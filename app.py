import joblib
threshold = 0.116518
joblib.dump(threshold, 'anomaly_threshold_scaled.joblib')
print("Threshold saved.")
