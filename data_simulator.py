import pandas as pd
import time
import random

def stream_data():
    df = pd.read_csv('sample_data.csv')
    for i in range(len(df)-24):
        yield df.iloc[i:i+24].values.tolist()  # 24 time steps
        time.sleep(1)  # Adjust speed as needed

if __name__ == '__main__':
    for data in stream_data():
        print(data)  # For testing