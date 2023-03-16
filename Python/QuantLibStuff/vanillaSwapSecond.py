import csv
import QuantLib as ql

yts = ql.RelinkableYieldTermStructureHandle()

# Read the instruments data from the CSV file
instruments = []
# with open('d:/Webfolder/web-tech/Python/QuantLibStuff/instruments.csv', 'r') as file:
with open('d:/Webfolder/web-tech/Python/QuantLibStuff/instruments.csv', newline='') as csvfile:
    reader = csv.reader(csvfile)
    headers = next(reader)  # Skip the header row
    
    for row in reader:
        instrument_data = []
        for value in row:
            instrument_data.append(float(value) if value != '' else 0.0)
        instruments.append(instrument_data)

helpers = ql.RateHelperVector()
index = ql.Euribor6M(yts)

for i, row in enumerate(instruments):
    tenor = headers[i + 1]
    for j, rate in enumerate(row):
        instrument = headers[j + 1]
        if instrument == 'depo':
            helpers.append(ql.DepositRateHelper(rate, index))
        elif instrument == 'fra':
            monthsToStart = ql.Period(tenor).length()
            helpers.append(ql.FraRateHelper(rate, monthsToStart, index))
        elif instrument == 'swap':
            swapIndex = ql.EuriborSwapIsdaFixA(ql.Period(tenor))
            helpers.append(ql.SwapRateHelper(rate, swapIndex))

curve = ql.PiecewiseLogCubicDiscount(2, ql.TARGET(), helpers, ql.ActualActual())