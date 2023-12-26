from sys import displayhook
import QuantLib as ql
import pandas as pd

yts = ql.RelinkableYieldTermStructureHandle()
#existing instrument excel file which only hold instrument, tenor, rate columns
file_path = 'D:/Webfolder/web-tech/Python/QuantLibStuff/FinalQuantLibSub/instruments.xlsx'
df = pd.read_excel(file_path) # reading the excel file

instruments = [] #it will hold the instrument, tenor and rate column's data
for index, row in df.iterrows():
    instrument = row['instrument']
    tenor = row['tenor']
    rate = row['rate']
    instruments.append((instrument, tenor, rate))

helpers = ql.RateHelperVector()
index = ql.Euribor6M(yts)
for instrument, tenor, rate in instruments:
    print(instrument,tenor,rate)
    if instrument == 'depo':
        helpers.append( ql.DepositRateHelper(rate, index))
    if instrument == 'fra':
        monthsToStart = ql.Period(tenor).length()
        helpers.append( ql.FraRateHelper(rate, monthsToStart, index) )
    if instrument == 'swap':
        swapIndex = ql.EuriborSwapIsdaFixA(ql.Period(tenor))
        helpers.append( ql.SwapRateHelper(rate, swapIndex))
print("-----------------------------------")
curve = ql.PiecewiseLogCubicDiscount(2, ql.TARGET(), helpers, ql.ActualActual(ql.ActualActual.Actual365)) #making a curve here
yts.linkTo(curve)
engine = ql.DiscountingSwapEngine(yts)

tenor = ql.Period('2y')
fixedRate = 0.05
forwardStart = ql.Period("2D")

swap = ql.MakeVanillaSwap(tenor, index, fixedRate, forwardStart, Nominal=10e6, pricingEngine=engine)


fairRate = swap.fairRate()
npv = swap.NPV()
df['FSR'] = pd.Series([fairRate]) # adding the FSR column with value to the 'sheet1'
df['NPV'] = pd.Series([npv]) # adding the NPV column with value to the 'sheet1'

# Write the DataFrame to a CSV file
df.to_excel(file_path,sheet_name='values', index=False)
print(f"Fair swap rate: {fairRate:.3%}")
print(f"Swap NPV: {npv:,.3f}")
print("-----------------------------------")
pd.options.display.float_format = "{:,.2f}".format


with pd.ExcelWriter(file_path, mode='a') as writer:  # 'a' means append mode
    # Create a DataFrame from the cashflows data
    cashflows = pd.DataFrame({
    'nominal': cf.nominal(),
    'accrualStartDate': cf.accrualStartDate().ISO(),
    'accrualEndDate': cf.accrualEndDate().ISO(),
    'rate': cf.rate(),
    'amount': cf.amount()
    } for cf in map(ql.as_coupon, swap.leg(1)))

    # Write the DataFrame to a new sheet in the Excel file
    cashflows.to_excel(writer, sheet_name='Cashflows', index=False)
    displayhook(cashflows)
