import numpy as np
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import joblib
import pandas as pd
from io import StringIO
import traceback # Import traceback for error details

app = Flask(__name__)

# --- Configuration ---
# ** IMPORTANT: Update these paths if necessary **
CSV_PATH = 'Plant_2_Merged_Data.csv' # Or Plant_1_Merged_Data.csv - Use the data corresponding to your model/threshold
MODEL_PATH = 'my_energy_model_3.keras' # New model name from output
SCALER_PATH = 'scaler.save'         # New scaler name from output
# ** IMPORTANT: Assumes you saved the threshold value using joblib **
# Example save command: joblib.dump(0.116518, 'anomaly_threshold_scaled.joblib')
ANOMALY_THRESHOLD_SCALED_PATH = 'anomaly_threshold_scaled.joblib'

FEATURE_ORDER = [
    'DC_POWER',
    'AC_POWER',
    'AMBIENT_TEMPERATURE',
    'MODULE_TEMPERATURE',
    'IRRADIATION'
]
SEQUENCE_LENGTH = 24 # Should match model training

# --- Load Global Data (for Simulation) ---
try:
    # Specify date format or dayfirst=False to avoid warnings if your dates are YYYY-MM-DD
    df = pd.read_csv(CSV_PATH)
    # Attempt to convert DATE_TIME if it exists, otherwise ignore
    if 'DATE_TIME' in df.columns:
        try:
            # Add format='%Y-%m-%d %H:%M:%S' if applicable, or dayfirst=False
            df['DATE_TIME'] = pd.to_datetime(df['DATE_TIME'], errors='coerce') # Let pandas infer or specify format
            df = df.set_index('DATE_TIME') # Set as index for easier timestamping
            print("DATE_TIME column found and set as index.")
        except Exception as date_e:
            print(f"Warning: Could not parse DATE_TIME column: {date_e}. Using default index.")
    else:
         print("No DATE_TIME column found. Using default index.")

    # Ensure data is sorted if using datetime index (important for sequences)
    if isinstance(df.index, pd.DatetimeIndex):
        df = df.sort_index()
        print("Data sorted by index.")

    print(f"Simulation data loaded: {len(df)} rows")

except Exception as e:
    print(f"ERROR Loading Simulation CSV: {str(e)}")
    traceback.print_exc()
    df = None # Indicate data loading failed
    print("Simulation data could not be loaded.")


# --- Load Model, Scaler, and Anomaly Threshold ---
model = None
scaler = None
anomaly_threshold_scaled = None # Declare the variable

try:
    model = load_model(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    # --- Load the saved anomaly threshold ---
    anomaly_threshold_scaled = joblib.load(ANOMALY_THRESHOLD_SCALED_PATH)
    # ------------------------------------------
    print(f"Model, scaler, and anomaly threshold ({anomaly_threshold_scaled}) loaded successfully.")
except Exception as e:
    print(f"ERROR Loading Model, Scaler, or Threshold: {str(e)}")
    traceback.print_exc()
    # Ensure flags are set so the API knows initialization failed
    model = None
    scaler = None
    anomaly_threshold_scaled = None
    print("Model, scaler, or threshold could not be loaded. Predictions will not be possible.")


# Fonction pour convertir les types NumPy en types Python natifs (keep this function)
def convert_numpy_types(obj):
    if isinstance(obj, np.generic):
        return obj.item()  # Convertit np types (int64, float32/64) en Python types
    elif isinstance(obj, (pd.Timestamp, pd.Timedelta)):
         return obj.isoformat() # Convert Pandas Timestamps to ISO strings
    elif isinstance(obj, dict):
        return {k: convert_numpy_types(v) for k, v in obj.items()}
    elif isinstance(obj, (list, tuple)):
        return [convert_numpy_types(v) for v in obj]
    return obj


# --- API Endpoint ---
# Renamed for clarity matching previous examples
@app.route('/get_prediction', methods=['GET'])
def get_prediction():
    global df # Needed to access the dataframe

    # Check if model, scaler, threshold, and data are loaded
    if model is None or scaler is None or anomaly_threshold_scaled is None or df is None:
         # Convert message before jsonify if it contains non-serializable types
         error_data = convert_numpy_types({
             'status': 'error',
             'message': 'Server not fully initialized (model, scaler, threshold, or data not loaded).'
         })
         return jsonify(error_data), 500

    try:
        # --- Simulation of data stream ---
        # Use a counter attribute attached to the function itself for persistence between requests
        counter = getattr(get_prediction, 'counter', 0)

        # Ensure we don't go out of bounds for the sequence start index
        if counter >= len(df) - SEQUENCE_LENGTH:
            # Reset counter or signal end of data stream
            print("Reached end of data file, resetting counter.")
            counter = 0 # Reset for continuous loop
            # Or return end of stream message:
            # return jsonify({'status': 'info', 'message': 'End of simulated data stream.'}), 200

        start_idx = counter
        sequence_end_idx = start_idx + SEQUENCE_LENGTH # Index *after* the last element of the sequence

        # Get the sequence data (last SEQUENCE_LENGTH rows)
        sequence_data_raw = df[FEATURE_ORDER].iloc[start_idx:sequence_end_idx].values

        # --- Get the actual values for the timestep *after* the sequence ---
        # This is crucial for calculating MAE consistent with your training validation
        actual_next_step_raw = None # Initialize
        actual_next_step_timestamp = None
        if sequence_end_idx < len(df): # Check *before* accessing iloc
             actual_next_step_raw = df[FEATURE_ORDER].iloc[sequence_end_idx:sequence_end_idx+1].values
             actual_next_step_timestamp = df.index[sequence_end_idx] # Get timestamp/index of the actual next step
             if len(actual_next_step_raw) == 0: # Safety check
                 actual_next_step_raw = None
                 actual_next_step_timestamp = None
        # --------------------------------------------------------------------

        # Check if the sequence has the correct length (should be ok if counter logic is right)
        if len(sequence_data_raw) < SEQUENCE_LENGTH:
             get_prediction.counter = counter + 1 # Increment counter even here
             return jsonify({'status': 'info', 'message': f'Insufficient data at index {start_idx} to form a complete sequence.'}), 200

        # --- Preprocessing ---
        # Check for NaNs before scaling
        if np.isnan(sequence_data_raw).any():
            print(f"WARNING: NaN values found in input sequence data at index {start_idx}")
            get_prediction.counter = counter + 1 # Increment counter
            # Return error or handle as appropriate (e.g., skip, fill)
            return jsonify({'status': 'error', 'message': f'NaN values found in input sequence starting at index {start_idx}.'}), 500

        scaled_sequence_data = scaler.transform(sequence_data_raw)

        # Reshape for model input: (n_samples, sequence_length, n_features)
        scaled_sequence_data_reshaped = scaled_sequence_data.reshape((1, SEQUENCE_LENGTH, len(FEATURE_ORDER)))

        # --- Prediction ---
        # Model predicts the *next* time step (t+1) in scaled format
        predicted_scaled_data = model.predict(scaled_sequence_data_reshaped) # Shape: (1, n_features)

        # --- Anomaly Detection Logic (Matches Training Validation) ---
        mae_scaled = None
        is_anomaly = False # Default to False

        if actual_next_step_raw is not None:
             # Check for NaNs in actual next step
             if np.isnan(actual_next_step_raw).any():
                  print(f"WARNING: NaN values found in actual next step data for sequence ending at index {sequence_end_idx-1}")
                  # Decide how to handle: maybe cannot calculate MAE, so not an anomaly?
                  mae_scaled = None
                  is_anomaly = False
             else:
                  # Scale the actual next step to calculate scaled MAE correctly
                  actual_next_step_scaled = scaler.transform(actual_next_step_raw) # Shape: (1, n_features)

                  # Calculate SCALED MAE between predicted scaled values and actual scaled values
                  mae_scaled = np.mean(np.abs(predicted_scaled_data - actual_next_step_scaled))

                  # Determine if it's an anomaly based on comparing scaled MAE to the loaded scaled threshold
                  is_anomaly = float(mae_scaled) > anomaly_threshold_scaled
        # else: MAE cannot be calculated if there's no next step data

        # --- Inverse Transform Predictions (for user-friendly output) ---
        predicted_orig_data = scaler.inverse_transform(predicted_scaled_data)

        # --- Update Counter for Next Request ---
        get_prediction.counter = counter + 1

        # --- Prepare Response Data ---
        # Safely get dictionary for actual next step raw values
        actual_next_vals_dict = None
        if actual_next_step_raw is not None and len(actual_next_step_raw) > 0:
             actual_next_vals_dict = {k: v for k, v in zip(FEATURE_ORDER, actual_next_step_raw[0])}

        response_data = {
            'status': 'success',
            # Timestamp of the *last* data point IN THE INPUT SEQUENCE
            'sequence_end_timestamp': df.index[sequence_end_idx-1],
            # Timestamp of the data point the prediction is FOR (the one *after* the sequence)
            'prediction_for_timestamp': actual_next_step_timestamp,
            # --- Anomaly Results ---
            'mae_scaled': mae_scaled, # The SCALED MAE used for comparison
            'anomaly_threshold_scaled': anomaly_threshold_scaled, # The threshold value used
            'is_anomaly': is_anomaly, # Result of the comparison
            # --- Values ---
            # Raw values of the last timestep IN THE INPUT SEQUENCE
            'last_values_in_sequence_raw': {k: v for k, v in zip(FEATURE_ORDER, sequence_data_raw[-1])},
            # Predicted values for the NEXT timestep (original scale)
            'predicted_next_values_orig': {k: v for k, v in zip(FEATURE_ORDER, predicted_orig_data[0])},
            # Actual raw values of the NEXT timestep (if available)
            'actual_next_values_raw': actual_next_vals_dict,
            # --- Simulation Info ---
            'next_sequence_start_index': get_prediction.counter # Index for the start of the next sequence request
        }

        # --- Convert all numpy/pandas types before jsonify ---
        safe_data = convert_numpy_types(response_data)

        return jsonify(safe_data)

    except Exception as e:
        traceback.print_exc() # Print detailed error to Flask console
        # Increment counter even on error to attempt next sequence
        counter = getattr(get_prediction, 'counter', 0)
        setattr(get_prediction, 'counter', counter + 1)

        # Ensure the error response is JSON serializable
        error_data = convert_numpy_types({
            'status': 'error',
            'message': f'Error processing sequence starting at index {getattr(get_prediction, "counter", 0) - 1}: {str(e)}',
            'trace': traceback.format_exc() # Include traceback in response (useful for debugging)
        })
        return jsonify(error_data), 500

# Initialize counter attribute for the function
setattr(get_prediction, 'counter', 0)


if __name__ == '__main__':
    # Set debug=False for production/deployment
    # Ensure host='0.0.0.0' to be accessible externally
    app.run(host='0.0.0.0', port=5000, debug=True)