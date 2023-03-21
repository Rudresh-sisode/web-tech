import pandas as pd

file_path = 'D:/Webfolder/web-tech/Python/QuantLibStuff/QuantLibSub/instruments.xlsx'
df = pd.read_excel(file_path)
df['new_column1'] = pd.Series([1, 2, 3, 4]) # Replace values with your own data
df['new_column2'] = pd.Series(['A', 'B', 'C', 'D']) # Replace values with your own data
df.to_excel(file_path, index=False)

# df = pd.read_csv('D:/Webfolder/web-tech/Python/QuantLibStuff/QuantLibSub/iinstruments.csv')
# pd.Series(
# df['new_column1'] = pd.Series([1, 2, 3, 4]) # Replace values with your own data
# df['new_column2'] = pd.Series(['A', 'B', 'C', 'D'])  # Replace values with your own data
# df.to_csv('D:/Webfolder/web-tech/Python/QuantLibStuff/QuantLibSub/iinstruments.csv', index=False)
# D:/Webfolder\web-tech\Python\QuantLibStuff\QuantLibSub
# with pd.ExcelWriter('path/to/excel/file.xlsx') as writer:
#     df.to_excel(writer, sheet_name='Sheet1', index=False)  # write to first sheet
#     df.to_excel(writer, sheet_name='Sheet2', index=False)  # write to second sheet
#     df.to_excel(writer, sheet_name='Sheet3', index=False)