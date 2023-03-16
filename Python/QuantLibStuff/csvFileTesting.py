import pandas as pd

# Read the CSV file
df = pd.read_csv('d:/Webfolder/web-tech/Python/QuantLibStuff/instruments.csv', index_col=0)

# Create a list of tuples from the DataFrame
instruments = []
for col in df.columns:
    for idx, val in df[col].items():
        if not pd.isna(val):
            instruments.append((col, idx, val))

print(instruments)