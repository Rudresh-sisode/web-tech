from sys import displayhook
import QuantLib as ql
import pandas as pd


yts = ql.RelinkableYieldTermStructureHandle()
df = pd.read_csv('d:/Webfolder/web-tech/Python/QuantLibStuff/instruments.csv', index_col=0)

instruments = []
for col in df.columns:
    for idx, val in df[col].items():
        if not pd.isna(val):
            instruments.append((col, idx, val))

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

cashflows = pd.DataFrame({
    'date': cf.date(),
    'amount': cf.amount()
    } for cf in swap.leg(1))
displayhook(cashflows)