from sys import displayhook
import QuantLib as ql
import pandas as pd
import datetime as dt


yts = ql.RelinkableYieldTermStructureHandle()
df = pd.read_csv('d:/Webfolder/web-tech/Python/QuantLibStuff/iinstruments.csv')

instruments = []
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
        helpers.append( ql.DepositRateHelper(rate, index) )
    if instrument == 'fra':
        monthsToStart = ql.Period(tenor).length()
        helpers.append( ql.FraRateHelper(rate, monthsToStart, index) )
    if instrument == 'swap':
        swapIndex = ql.EuriborSwapIsdaFixA(ql.Period(tenor))
        helpers.append( ql.SwapRateHelper(rate, swapIndex))
print("-----------------------------------")
curve = ql.PiecewiseLogCubicDiscount(2, ql.TARGET(), helpers, ql.ActualActual(ql.ActualActual.Actual365))
yts.linkTo(curve)
engine = ql.DiscountingSwapEngine(yts)

tenor = ql.Period('2y')
fixedRate = 0.05
forwardStart = ql.Period("2D")

swap = ql.MakeVanillaSwap(tenor, index, fixedRate, forwardStart, Nominal=10e6, pricingEngine=engine)


fairRate = swap.fairRate()
npv = swap.NPV()

print(f"Fair swap rate: {fairRate:.3%}")
print(f"Swap NPV: {npv:,.3f}")
print("-----------------------------------")
pd.options.display.float_format = "{:,.2f}".format

now = dt.datetime.now()

# Format the date and time as a string
date_str = now.strftime('%Y-%m-%d_%H-%M-%S')

# Append the formatted date string to the CSV filename
filename = f'cashflows_1_{date_str}.csv'

cashflows = pd.DataFrame({
    'date': cf.date(),
    'amount': cf.amount()
    } for cf in swap.leg(1))
cashflows.to_csv(filename, index=False)
displayhook(cashflows)
now = dt.datetime.now()
print("-----------------------------------------------------------------")
# Format the date and time as a string
date_str = now.strftime('%Y-%m-%d_%H-%M-%S')

# Append the formatted date string to the CSV filename
filename = f'cashflows_2_{date_str}.csv'
cashflows = pd.DataFrame({
    'nominal': cf.nominal(),
    'accrualStartDate': cf.accrualStartDate().ISO(),
    'accrualEndDate': cf.accrualEndDate().ISO(),
    'rate': cf.rate(),
    'amount': cf.amount()
    } for cf in map(ql.as_coupon, swap.leg(1)))
cashflows.to_csv(filename, index=False)
displayhook(cashflows)