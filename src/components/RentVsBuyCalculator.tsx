import React, { useState, useMemo } from 'react';
import {
  calculateRentVsBuy,
  type RentVsBuyResult
} from '../math/rentVsBuy';
import {
  Scale,
  TrendingUp,
  Home,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

interface RentVsBuyCalculatorProps {
  onOpenLeadModal: (details?: any) => void;
}

export const RentVsBuyCalculator: React.FC<RentVsBuyCalculatorProps> = ({ onOpenLeadModal }) => {
  const [propertyPrice, setPropertyPrice] = useState<number>(900000);
  const [depositPercent, setDepositPercent] = useState<number>(20);
  const [mortgageRate, setMortgageRate] = useState<number>(5.84);
  const [weeklyRent, setWeeklyRent] = useState<number>(750);
  const stampDutyAmount = 35000;
  const [propertyGrowthRateAnnual, setPropertyGrowthRateAnnual] = useState<number>(5.0);
  const [rentGrowthRateAnnual, setRentGrowthRateAnnual] = useState<number>(3.5);
  const [investmentReturnRateAnnual, setInvestmentReturnRateAnnual] = useState<number>(7.5);
  const strataBodyCorporateAnnual = 0;

  const result: RentVsBuyResult = useMemo(() => {
    return calculateRentVsBuy({
      propertyPrice,
      depositPercent,
      mortgageRate,
      loanTermYears: 30,
      stampDutyAmount,
      weeklyRent,
      propertyGrowthRateAnnual,
      rentGrowthRateAnnual,
      investmentReturnRateAnnual,
      annualCouncilAndWaterRates: 2400,
      annualBuildingInsurance: 1500,
      annualMaintenancePercent: 1.0,
      strataBodyCorporateAnnual,
    });
  }, [
    propertyPrice,
    depositPercent,
    mortgageRate,
    stampDutyAmount,
    weeklyRent,
    propertyGrowthRateAnnual,
    rentGrowthRateAnnual,
    investmentReturnRateAnnual,
    strataBodyCorporateAnnual,
  ]);

  const chartData = useMemo(() => {
    return result.yearlyProjections.map((p) => ({
      year: `Yr ${p.year}`,
      'Buying Net Worth': p.buyNetWorth,
      'Renting & Investing Net Worth': p.rentNetWorth,
    }));
  }, [result]);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#edf8e1] border border-[#5ca701]/30 text-[#4e8f00] text-xs font-mono font-bold tracking-wide">
          <Scale className="w-3.5 h-3.5 text-[#5ca701]" />
          <span>30-Year Australian Wealth & Equity Simulator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1b2932] font-display tracking-tight">
          Rent vs Buy Australia <span className="text-[#5ca701]">Calculator</span>
        </h1>
        <p className="text-[#486d84] text-sm sm:text-base leading-relaxed">
          Compare the real 30-year net worth of buying property versus renting and investing your deposit into index funds (ASX 200 / S&P 500).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-[34px] p-6 sm:p-8 shadow-[0_18px_50px_rgba(17,41,60,0.08)] border border-[#e6edf2] space-y-6">
          <h2 className="text-base sm:text-lg font-bold text-[#1b2932] font-display flex items-center gap-2 pb-4 border-b border-[#e6edf2]">
            <Home className="w-5 h-5 text-[#5ca701]" />
            <span>Property vs Rent Parameters</span>
          </h2>

          {/* Property Price & Rent */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1b2932]">Property Purchase Price ($)</label>
              <input
                type="number"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 font-mono font-bold text-[#1b2932] bg-[#f4f7f9] border border-[#e6edf2] rounded-2xl text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1b2932]">Equivalent Weekly Rent ($/wk)</label>
              <input
                type="number"
                value={weeklyRent}
                onChange={(e) => setWeeklyRent(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 font-mono font-bold text-[#1b2932] bg-[#f4f7f9] border border-[#e6edf2] rounded-2xl text-sm"
              />
            </div>
          </div>

          {/* Deposit & Rate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1b2932]">Deposit Percentage (%)</label>
              <input
                type="number"
                value={depositPercent}
                onChange={(e) => setDepositPercent(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 font-mono font-bold text-[#1b2932] bg-[#f4f7f9] border border-[#e6edf2] rounded-2xl text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1b2932]">Mortgage Interest Rate (%)</label>
              <input
                type="number"
                step="0.05"
                value={mortgageRate}
                onChange={(e) => setMortgageRate(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 font-mono font-bold text-[#1b2932] bg-[#f4f7f9] border border-[#e6edf2] rounded-2xl text-sm"
              />
            </div>
          </div>

          {/* Growth Assumptions */}
          <div className="space-y-3 pt-3 border-t border-[#e6edf2]">
            <h3 className="text-xs font-mono font-bold text-[#486d84] uppercase tracking-wider">Growth & Market Assumptions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1b2932]">Property Growth (%/yr)</label>
                <input
                  type="number"
                  step="0.5"
                  value={propertyGrowthRateAnnual}
                  onChange={(e) => setPropertyGrowthRateAnnual(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono font-bold bg-[#f4f7f9] text-[#1b2932] border border-[#e6edf2] rounded-2xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1b2932]">Rent Inflation (%/yr)</label>
                <input
                  type="number"
                  step="0.5"
                  value={rentGrowthRateAnnual}
                  onChange={(e) => setRentGrowthRateAnnual(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono font-bold bg-[#f4f7f9] text-[#1b2932] border border-[#e6edf2] rounded-2xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1b2932]">Stock/ETF Return (%/yr)</label>
                <input
                  type="number"
                  step="0.5"
                  value={investmentReturnRateAnnual}
                  onChange={(e) => setInvestmentReturnRateAnnual(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono font-bold bg-[#f4f7f9] text-[#1b2932] border border-[#e6edf2] rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[34px] p-6 sm:p-7 shadow-[0_18px_50px_rgba(17,41,60,0.08)] border border-[#e6edf2] space-y-6">
            <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-[#5ca701]">
              10-Year Wealth Verdict
            </span>

            {/* Verdict */}
            <div className="p-4 rounded-2xl bg-[#f4f7f9] border border-[#e6edf2] space-y-2 text-xs leading-relaxed">
              <p className="font-bold text-[#1b2932] text-sm flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#5ca701]" />
                <span>Simulation Outcome</span>
              </p>
              <p className="text-[#486d84]">{result.summaryVerdict}</p>
            </div>

            {/* 10-Yr & 30-Yr Comparison */}
            <div className="grid grid-cols-2 gap-3 pt-2 font-mono">
              <div className="p-3.5 rounded-2xl bg-[#edf8e1] border border-[#5ca701]/30 space-y-1">
                <span className="text-[11px] text-[#486d84] font-semibold block">10-Yr Buying Net Worth</span>
                <span className="text-lg font-black text-[#4e8f00]">
                  ${Math.round(result.tenYearBuyNetWorth).toLocaleString()}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#f4f7f9] border border-[#e6edf2] space-y-1">
                <span className="text-[11px] text-[#486d84] font-semibold block">10-Yr Rent & Invest</span>
                <span className="text-lg font-black text-[#1b2932]">
                  ${Math.round(result.tenYearRentNetWorth).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono">
              <div className="p-3.5 rounded-2xl bg-[#edf8e1] border border-[#5ca701]/30 space-y-1">
                <span className="text-[11px] text-[#486d84] font-semibold block">30-Yr Buying Net Worth</span>
                <span className="text-lg font-black text-[#4e8f00]">
                  ${Math.round(result.thirtyYearBuyNetWorth).toLocaleString()}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#f4f7f9] border border-[#e6edf2] space-y-1">
                <span className="text-[11px] text-[#486d84] font-semibold block">30-Yr Rent & Invest</span>
                <span className="text-lg font-black text-[#1b2932]">
                  ${Math.round(result.thirtyYearRentNetWorth).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <button
                onClick={() => onOpenLeadModal({ 
                  type: 'rent_vs_buy', 
                  propertyPrice, 
                  result,
                  goal: `Build $${Math.round(result.tenYearBuyNetWorth).toLocaleString()} property equity with first home pre-approval`
                })}
                className="w-full py-3.5 px-4 rounded-full bg-[#5ca701] hover:bg-[#4e8f00] text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_4px_16px_rgba(92,167,1,0.38)] hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>Build ${Math.round(result.tenYearBuyNetWorth).toLocaleString()} Wealth — Start Buying Journey</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
              <p className="text-[11px] text-center text-[#486d84]">
                Check 5% Deposit Home Guarantee Scheme eligibility & get pre-approved ($0 Fee)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 30-Year Chart */}
      <div className="bg-white rounded-[34px] p-6 sm:p-8 shadow-[0_18px_50px_rgba(17,41,60,0.08)] border border-[#e6edf2] space-y-4">
        <div>
          <h3 className="text-lg font-bold text-[#1b2932] font-display">30-Year Wealth Trajectory (Buying vs Renting & Investing)</h3>
          <p className="text-xs text-[#486d84]">
            Assuming initial deposit and stamp duty are invested into the share market if renting.
          </p>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f7f9" />
              <XAxis dataKey="year" stroke="#486d84" fontSize={11} />
              <YAxis
                stroke="#486d84"
                fontSize={11}
                tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                contentStyle={{ backgroundColor: '#1b2932', borderColor: '#486d84', color: '#fff', borderRadius: '14px', fontSize: '12px' }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', color: '#486d84' }} />
              <Line
                type="monotone"
                dataKey="Buying Net Worth"
                stroke="#5ca701"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Renting & Investing Net Worth"
                stroke="#486d84"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
