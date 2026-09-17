import React, { useState, useMemo } from 'react';
import {
  calculateRefinance,
  type RefinanceResult
} from '../math/refinance';
import {
  RefreshCw,
  ArrowRight,
  Zap
} from 'lucide-react';

interface RefinanceCalculatorProps {
  onOpenLeadModal: (details?: any) => void;
}

export const RefinanceCalculator: React.FC<RefinanceCalculatorProps> = ({ onOpenLeadModal }) => {
  const [currentLoanBalance, setCurrentLoanBalance] = useState<number>(650000);
  const [remainingLoanTermYears, setRemainingLoanTermYears] = useState<number>(25);
  const [currentInterestRate, setCurrentInterestRate] = useState<number>(6.64);
  const [newInterestRate, setNewInterestRate] = useState<number>(5.74);
  const [cashbackIncentive, setCashbackIncentive] = useState<number>(2000);
  const [dischargeFeeCurrentLender, setDischargeFeeCurrentLender] = useState<number>(350);
  const [governmentDischargeRegistrationFees, setGovernmentDischargeRegistrationFees] = useState<number>(330);
  const [applicationFeeNewLender] = useState<number>(0);

  const result: RefinanceResult = useMemo(() => {
    return calculateRefinance({
      currentLoanBalance,
      remainingLoanTermYears,
      currentInterestRate,
      newInterestRate,
      cashbackIncentive,
      dischargeFeeCurrentLender,
      governmentDischargeRegistrationFees,
      applicationFeeNewLender,
    });
  }, [
    currentLoanBalance,
    remainingLoanTermYears,
    currentInterestRate,
    newInterestRate,
    cashbackIncentive,
    dischargeFeeCurrentLender,
    governmentDischargeRegistrationFees,
    applicationFeeNewLender,
  ]);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#edf8e1] border border-[#5ca701]/30 text-[#4e8f00] text-xs font-mono font-bold tracking-wide">
          <Zap className="w-3.5 h-3.5 text-[#5ca701]" />
          <span>Real-time Australian Refinance & Break-Even Simulator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1b2932] font-display tracking-tight">
          Refinance Savings <span className="text-[#5ca701]">Calculator</span>
        </h1>
        <p className="text-[#486d84] text-sm sm:text-base leading-relaxed">
          See exactly how much you can slash off your monthly repayments, recover upfront switching fees, and save tens of thousands in lifetime interest.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-[34px] p-6 sm:p-8 shadow-[0_18px_50px_rgba(17,41,60,0.08)] border border-[#e6edf2] space-y-6">
          <h2 className="text-base sm:text-lg font-bold text-[#1b2932] font-display flex items-center gap-2 pb-4 border-b border-[#e6edf2]">
            <RefreshCw className="w-5 h-5 text-[#5ca701]" />
            <span>Current Loan vs New Loan Rate</span>
          </h2>

          {/* Current Loan Balance */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="font-bold text-[#1b2932]">Current Outstanding Loan Balance</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#486d84] font-mono font-bold">$</span>
                <input
                  type="number"
                  value={currentLoanBalance}
                  onChange={(e) => setCurrentLoanBalance(Math.max(0, Number(e.target.value)))}
                  className="w-40 pl-7 pr-3 py-2 text-right font-mono font-extrabold text-[#1b2932] bg-[#f4f7f9] border border-[#e6edf2] rounded-2xl text-sm focus:ring-2 focus:ring-[#5ca701]"
                />
              </div>
            </div>
            <input
              type="range"
              min={100000}
              max={2500000}
              step={25000}
              value={currentLoanBalance}
              onChange={(e) => setCurrentLoanBalance(Number(e.target.value))}
              className="w-full h-2 bg-[#e6edf2] rounded-lg appearance-none cursor-pointer accent-[#5ca701]"
            />
          </div>

          {/* Remaining Loan Term */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <label className="font-bold text-[#1b2932]">Remaining Loan Term</label>
              <span className="font-mono font-bold text-[#1b2932]">{remainingLoanTermYears} Years</span>
            </div>
            <select
              value={remainingLoanTermYears}
              onChange={(e) => setRemainingLoanTermYears(Number(e.target.value))}
              className="w-full px-3 py-2 font-bold font-mono text-[#1b2932] bg-[#f4f7f9] border border-[#e6edf2] rounded-2xl text-sm"
            >
              {[30, 25, 20, 15, 10].map((y) => (
                <option key={y} value={y}>
                  {y} Years
                </option>
              ))}
            </select>
          </div>

          {/* Rates Comparison Side by Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#f4f7f9] border border-[#e6edf2] space-y-2">
              <label className="text-xs font-mono font-bold text-[#486d84] uppercase tracking-wider block">Your Current Rate</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.05"
                  value={currentInterestRate}
                  onChange={(e) => setCurrentInterestRate(Number(e.target.value))}
                  className="w-full pl-3 pr-8 py-2 font-mono font-extrabold text-[#1b2932] bg-white border border-[#e6edf2] rounded-2xl text-sm"
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#486d84] font-mono font-bold text-xs">%</span>
              </div>
              <p className="text-[11px] text-[#486d84] font-mono">Current: ${result.currentMonthlyPayment.toLocaleString()}/mo</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#edf8e1] border border-[#5ca701]/30 space-y-2">
              <label className="text-xs font-mono font-bold text-[#4e8f00] uppercase tracking-wider block">New Proposed Rate</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.05"
                  value={newInterestRate}
                  onChange={(e) => setNewInterestRate(Number(e.target.value))}
                  className="w-full pl-3 pr-8 py-2 font-mono font-extrabold text-[#4e8f00] bg-white border border-[#5ca701]/40 rounded-2xl text-sm"
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5ca701] font-mono font-bold text-xs">%</span>
              </div>
              <p className="text-[11px] text-[#4e8f00] font-mono font-bold">New: ${result.newMonthlyPayment.toLocaleString()}/mo</p>
            </div>
          </div>

          {/* Upfront Fees & Cashback */}
          <div className="space-y-4 pt-3 border-t border-[#e6edf2]">
            <h3 className="text-sm font-bold text-[#1b2932]">Switching Fees & Cashback Promotion</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1b2932]">Cashback Deal ($)</label>
                <input
                  type="number"
                  value={cashbackIncentive}
                  onChange={(e) => setCashbackIncentive(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-xs font-mono font-bold bg-[#f4f7f9] text-[#1b2932] border border-[#e6edf2] rounded-2xl"
                  placeholder="e.g. 2000"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1b2932]">Discharge Fee ($)</label>
                <input
                  type="number"
                  value={dischargeFeeCurrentLender}
                  onChange={(e) => setDischargeFeeCurrentLender(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-xs font-mono font-bold bg-[#f4f7f9] text-[#1b2932] border border-[#e6edf2] rounded-2xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1b2932]">Gov Registry Fees ($)</label>
                <input
                  type="number"
                  value={governmentDischargeRegistrationFees}
                  onChange={(e) => setGovernmentDischargeRegistrationFees(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-xs font-mono font-bold bg-[#f4f7f9] text-[#1b2932] border border-[#e6edf2] rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[34px] p-6 sm:p-7 shadow-[0_18px_50px_rgba(17,41,60,0.08)] border border-[#e6edf2] space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-[#5ca701]">
                Monthly Refinance Savings
              </span>
              <span className="text-xs font-mono px-3 py-0.5 rounded-full bg-[#edf8e1] text-[#4e8f00] border border-[#5ca701]/30 font-bold">
                Rate Drop: {(currentInterestRate - newInterestRate).toFixed(2)}%
              </span>
            </div>

            {/* The Big Monthly Savings Dock */}
            <div className="bg-[#edf8e1] border-[1.5px] border-[#5ca701]/30 rounded-3xl p-6 text-center space-y-1 shadow-sm">
              <div className="font-display text-4xl sm:text-5xl font-extrabold text-[#4e8f00] leading-none">
                ${result.monthlySavings.toLocaleString()}
              </div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#5ca701] pt-1">
                Monthly Repayment Saved
              </div>
              <p className="text-xs text-[#4e8f00] font-mono font-bold pt-1">
                That's ${result.annualSavings.toLocaleString()} back in your pocket every single year!
              </p>
            </div>

            {/* Verdict Note */}
            <div className="p-4 rounded-2xl bg-[#f4f7f9] border border-[#e6edf2] text-xs text-[#1b2932] leading-relaxed">
              <p className="font-bold text-[#1b2932] mb-1">Refinance Verdict:</p>
              <p>{result.recommendation}</p>
            </div>

            {/* Itemized Savings Breakdown */}
            <div className="space-y-2 text-xs font-mono border-t border-[#e6edf2] pt-3">
              <div className="flex justify-between py-1 border-b border-[#f4f7f9]">
                <span className="text-[#486d84]">Current Monthly Payment</span>
                <span className="font-bold text-[#1b2932]">${result.currentMonthlyPayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f4f7f9]">
                <span className="text-[#486d84]">New Monthly Payment</span>
                <span className="font-bold text-[#5ca701]">${result.newMonthlyPayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f4f7f9]">
                <span className="text-[#486d84]">Total Switching Fees</span>
                <span className="font-bold text-[#486d84]">${result.totalRefinanceCosts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f4f7f9]">
                <span className="text-[#486d84]">Lender Cashback</span>
                <span className="font-bold text-[#5ca701]">+${cashbackIncentive.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f4f7f9]">
                <span className="text-[#486d84]">Break-Even Timeline</span>
                <span className="font-bold text-[#1b2932]">{result.breakEvenMonths} Months</span>
              </div>
              <div className="flex justify-between py-2 text-sm font-extrabold text-[#1b2932]">
                <span>Total Lifetime Interest Saved:</span>
                <span className="text-[#5ca701]">${result.totalLifetimeSavings.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <button
                onClick={() => onOpenLeadModal({ 
                  type: 'refinance', 
                  savings: result.monthlySavings, 
                  result,
                  goal: `Slash home loan by $${result.monthlySavings.toLocaleString()}/mo & claim $${cashbackIncentive.toLocaleString()} cashback` 
                })}
                className="w-full py-3.5 px-4 rounded-full bg-[#5ca701] hover:bg-[#4e8f00] text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_4px_16px_rgba(92,167,1,0.38)] hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>Slash My Loan by ${result.monthlySavings.toLocaleString()}/mo ($0 Switch Fee)</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
              <p className="text-[11px] text-center text-[#486d84]">
                Save ${result.annualSavings.toLocaleString()}/year with free broker discharge & refinancing management
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
