import pandas as pd

# Create the instruments list
instruments = [
    ('depo', '6M', 0.025),
    ('fra', '6M', 0.03),
    ('swap', '1Y', 0.031),
    ('swap', '2Y', 0.032),
    ('swap', '3Y', 0.035)
]

# Convert the list to a pandas DataFrame
df = pd.DataFrame(instruments, columns=['instrument', 'tenor', 'rate'])

# Write the DataFrame to an Excel file
file_path = 'instruments.xlsx'
df.to_excel(file_path,sheet_name='values', index=False)