import React, { useState, useMemo } from 'react';
import {
  calculateBorrowingPower,
  type BorrowingPowerResult
} from '../math/borrowingPower';
import {
  Users,
  CreditCard,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface BorrowingPowerCalculatorProps {
  onOpenLeadModal: (details?: any) => void;
}

export const BorrowingPowerCalculator: React.FC<BorrowingPowerCalculatorProps> = ({ onOpenLeadModal }) => {
  const [maritalStatus, setMaritalStatus] = useState<'single' | 'couple'>('couple');
  const [dependents, setDependents] = useState<number>(1);
  const [applicant1Income, setApplicant1Income] = useState<number>(125000);
  const [applicant2Income, setApplicant2Income] = useState<number>(85000);
  const [hasHecs1, setHasHecs1] = useState<boolean>(false);
  const [hasHecs2, setHasHecs2] = useState<boolean>(false);
  const [rentalIncomeAnnual, setRentalIncomeAnnual] = useState<number>(0);
  const [otherIncomeAnnual, setOtherIncomeAnnual] = useState<number>(0);
  const [declaredMonthlyLivingExpenses, setDeclaredMonthlyLivingExpenses] = useState<number>(3600);
  const [creditCardLimitsTotal, setCreditCardLimitsTotal] = useState<number>(10000);
  const [monthlyOtherLoanRepayments, setMonthlyOtherLoanRepayments] = useState<number>(0);
  const [currentMarketRate, setCurrentMarketRate] = useState<number>(5.84);
  const [depositAvailable, setDepositAvailable] = useState<number>(150000);

  const result: BorrowingPowerResult = useMemo(() => {
    return calculateBorrowingPower(
      {
        applicant1Income,
        applicant2Income: maritalStatus === 'couple' ? applicant2Income : 0,
        hasHecs1,
        hasHecs2: maritalStatus === 'couple' ? hasHecs2 : false,
        rentalIncomeAnnual,
        otherIncomeAnnual,
        maritalStatus,
        dependents,
        declaredMonthlyLivingExpenses,
        creditCardLimitsTotal,
        monthlyOtherLoanRepayments,
        currentMarketRate,
        loanTermYears: 30,
      },
      depositAvailable
    );
  }, [
    applicant1Income,
    applicant2Income,
    hasHecs1,
    hasHecs2,
    rentalIncomeAnnual,
    otherIncomeAnnual,
    maritalStatus,
    dependents,
    declaredMonthlyLivingExpenses,
    creditCardLimitsTotal,
    monthlyOtherLoanRepayments,
    currentMarketRate,
    depositAvailable,
  ]);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0f9ff] border border-[#0071e3]/25 text-[#0071e3] text-xs font-mono font-bold tracking-wide">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0071e3]" />
          <span>APRA 3.00% Serviceability Buffer + Stage 3 Tax Model</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0f172a] font-display tracking-tight">
          How Much Can I <span className="text-[#0071e3]">Borrow?</span>
        </h1>
        <p className="text-[#64748b] text-sm sm:text-base leading-relaxed">
          Accurate Australian bank borrowing capacity assessment factoring in income, HEM living expense benchmarks, credit limits, and buffer rates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05),0_2px_6px_-1px_rgba(15,23,42,0.03)] border border-[#e2e8f0] space-y-6">
          <h2 className="text-base sm:text-lg font-bold text-[#0f172a] font-display flex items-center gap-2 pb-4 border-b border-[#e2e8f0]">
            <Users className="w-5 h-5 text-[#0071e3]" />
            <span>Household & Income Details</span>
          </h2>

          {/* Marital Status & Dependents */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0f172a]">Application Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMaritalStatus('single')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    maritalStatus === 'single'
                      ? 'bg-[#0071e3] text-white border-[#0071e3] shadow-sm'
                      : 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0] hover:text-[#0f172a]'
                  }`}
                >
                  Single Applicant
                </button>
                <button
                  type="button"
                  onClick={() => setMaritalStatus('couple')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    maritalStatus === 'couple'
                      ? 'bg-[#0071e3] text-white border-[#0071e3] shadow-sm'
                      : 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0] hover:text-[#0f172a]'
                  }`}
                >
                  Joint / Couple
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0f172a]">Number of Dependents</label>
              <select
                value={dependents}
                onChange={(e) => setDependents(Number(e.target.value))}
                className="w-full px-3 py-2 font-bold font-mono text-[#0f172a] bg-[#f8fafc] border border-[#cbd5e1] rounded-xl text-sm"
              >
                {[0, 1, 2, 3, 4, 5].map((d) => (
                  <option key={d} value={d}>
                    {d} {d === 1 ? 'Dependent' : 'Dependents'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Applicant 1 Income */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="font-bold text-[#0f172a]">Applicant 1 Gross Annual Salary</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#64748b] font-mono font-bold">$</span>
                <input
                  type="number"
                  value={applicant1Income}
                  onChange={(e) => setApplicant1Income(Math.max(0, Number(e.target.value)))}
                  className="w-40 pl-7 pr-3 py-1.5 text-right font-mono font-extrabold text-[#0f172a] bg-[#f8fafc] border border-[#cbd5e1] rounded-xl text-sm focus:ring-2 focus:ring-[#0071e3]"
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-[#64748b] cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasHecs1}
                  onChange={(e) => setHasHecs1(e.target.checked)}
                  className="rounded text-[#0071e3] focus:ring-[#0071e3] w-3.5 h-3.5"
                />
                <span>Has HECS / HELP Student Debt</span>
              </label>
              <span className="text-[#94a3b8] font-mono text-[11px]">Pre-tax annual base</span>
            </div>
          </div>

          {/* Applicant 2 Income */}
          {maritalStatus === 'couple' && (
            <div className="space-y-2 pt-2 border-t border-[#e2e8f0]">
              <div className="flex justify-between items-center text-sm">
                <label className="font-bold text-[#0f172a]">Applicant 2 Gross Annual Salary</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#64748b] font-mono font-bold">$</span>
                  <input
                    type="number"
                    value={applicant2Income}
                    onChange={(e) => setApplicant2Income(Math.max(0, Number(e.target.value)))}
                    className="w-40 pl-7 pr-3 py-1.5 text-right font-mono font-extrabold text-[#0f172a] bg-[#f8fafc] border border-[#cbd5e1] rounded-xl text-sm focus:ring-2 focus:ring-[#0071e3]"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-1.5 text-[#64748b] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasHecs2}
                    onChange={(e) => setHasHecs2(e.target.checked)}
                    className="rounded text-[#0071e3] focus:ring-[#0071e3] w-3.5 h-3.5"
                  />
                  <span>Has HECS / HELP Student Debt</span>
                </label>
                <span className="text-[#94a3b8] font-mono text-[11px]">Pre-tax annual base</span>
              </div>
            </div>
          )}

          {/* Secondary Incomes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#e2e8f0]">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#334155]">Gross Annual Rental Income ($)</label>
              <input
                type="number"
                value={rentalIncomeAnnual}
                onChange={(e) => setRentalIncomeAnnual(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 text-sm font-mono font-bold bg-[#f8fafc] text-[#0f172a] border border-[#cbd5e1] rounded-xl"
                placeholder="e.g. 24000 (80% shaded)"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#334155]">Bonuses / Other Annual Income ($)</label>
              <input
                type="number"
                value={otherIncomeAnnual}
                onChange={(e) => setOtherIncomeAnnual(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 text-sm font-mono font-bold bg-[#f8fafc] text-[#0f172a] border border-[#cbd5e1] rounded-xl"
                placeholder="e.g. 10000"
              />
            </div>
          </div>

          {/* Expenses & Liabilities */}
          <div className="space-y-4 pt-3 border-t border-[#e2e8f0]">
            <h3 className="text-sm font-bold text-[#0f172a] font-display flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#0071e3]" />
              <span>Living Expenses & Commitments</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label className="font-bold text-[#334155]">Monthly Living Expenses</label>
                  {result.isHemApplied && (
                    <span className="text-[#d97706] font-bold font-mono text-[10px]">HEM Floor Applied</span>
                  )}
                </div>
                <input
                  type="number"
                  value={declaredMonthlyLivingExpenses}
                  onChange={(e) => setDeclaredMonthlyLivingExpenses(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-sm font-mono font-bold bg-[#f8fafc] text-[#0f172a] border border-[#cbd5e1] rounded-xl"
                />
                <p className="text-[11px] text-[#64748b]">Groceries, utilities, bills (excl. rent)</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#334155]">Total Credit Card Limits ($)</label>
                <input
                  type="number"
                  value={creditCardLimitsTotal}
                  onChange={(e) => setCreditCardLimitsTotal(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-sm font-mono font-bold bg-[#f8fafc] text-[#0f172a] border border-[#cbd5e1] rounded-xl"
                  placeholder="e.g. 10000"
                />
                <p className="text-[11px] text-[#64748b] font-mono">Assessed at 3.8%/mo (${result.creditCardMonthlyAssessed}/mo liability)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#334155]">Other Monthly Loan Payments ($)</label>
                <input
                  type="number"
                  value={monthlyOtherLoanRepayments}
                  onChange={(e) => setMonthlyOtherLoanRepayments(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-sm font-mono font-bold bg-[#f8fafc] text-[#0f172a] border border-[#cbd5e1] rounded-xl"
                  placeholder="e.g. Car or personal loans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#334155]">Available Deposit ($)</label>
                <input
                  type="number"
                  value={depositAvailable}
                  onChange={(e) => setDepositAvailable(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-sm font-mono font-bold bg-[#f8fafc] text-[#0f172a] border border-[#cbd5e1] rounded-xl"
                  placeholder="e.g. 150000"
                />
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-xs font-bold text-[#334155]">Interest Rate Benchmark (%)</label>
              <input
                type="number"
                step="0.05"
                value={currentMarketRate}
                onChange={(e) => setCurrentMarketRate(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-mono font-bold bg-[#f8fafc] text-[#0f172a] border border-[#cbd5e1] rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Output Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05),0_2px_6px_-1px_rgba(15,23,42,0.03)] border border-[#e2e8f0] space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-[#0071e3]">
                Estimated Borrowing Capacity
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#ecfdf5] text-[#047857] border border-[#059669]/30 font-bold">
                APRA Buffer: {result.assessmentRate}%
              </span>
            </div>

            {/* The Big Number */}
            <div className="bg-[#f0f9ff] border-[1.5px] border-[#0071e3]/25 rounded-2xl p-5 text-center space-y-1">
              <div className="font-display text-4xl sm:text-5xl font-extrabold text-[#0071e3] leading-none">
                ${result.maxBorrowingCapacity.toLocaleString()}
              </div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#0071e3] pt-1">
                Max Borrowing Capacity
              </div>
              <p className="text-xs text-[#059669] font-mono font-bold pt-1">
                Estimated Max Purchase: <strong>${result.maxPropertyPurchasePrice.toLocaleString()}</strong> (with deposit)
              </p>
            </div>

            {/* Repayment estimate at current actual rate */}
            <div className="p-4 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#334155] font-medium">Repayment at Actual {currentMarketRate}% Rate:</span>
                <span className="font-extrabold font-mono text-[#0f172a] text-base">
                  ${result.monthlyRepaymentAtActualRate.toLocaleString()}/mo
                </span>
              </div>
              <p className="text-[11px] text-[#64748b]">
                Banks test your ability to pay at <strong>{result.assessmentRate}%</strong> (+3.00% buffer) to ensure you can handle future rate hikes.
              </p>
            </div>

            {/* Cash Flow Breakdown */}
            <div className="space-y-2 text-xs font-mono border-t border-[#e2e8f0] pt-3">
              <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                <span className="text-[#64748b]">Gross Monthly Income</span>
                <span className="font-bold text-[#0f172a]">${result.grossMonthlyIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                <span className="text-[#64748b]">Est. Tax & Medicare Paid</span>
                <span className="font-bold text-[#64748b]">-${result.monthlyTaxPaid.toLocaleString()}</span>
              </div>
              {result.monthlyHecsPaid > 0 && (
                <div className="flex justify-between py-1 border-b border-[#f1f5f9] text-[#d97706]">
                  <span>HECS / HELP Compulsory Repayment</span>
                  <span className="font-bold">-${result.monthlyHecsPaid.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                <span className="text-[#64748b]">Living Expenses Used</span>
                <span className="font-bold text-[#64748b]">-${result.monthlyLivingExpensesUsed.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                <span className="text-[#64748b]">Credit Card & Debt Commitments</span>
                <span className="font-bold text-[#64748b]">-${result.monthlyDebtCommitments.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 text-sm font-extrabold text-[#0f172a]">
                <span>Surplus Monthly Serviceability:</span>
                <span className="text-[#059669]">${result.surplusMonthlyCapacity.toLocaleString()}/mo</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <button
                onClick={() => onOpenLeadModal({ 
                  type: 'borrowing_power', 
                  capacity: result.maxBorrowingCapacity, 
                  result,
                  goal: `Unlock full $${result.maxBorrowingCapacity.toLocaleString()} borrowing capacity across 30+ lenders`
                })}
                className="w-full py-3.5 px-4 rounded-xl bg-[#0f1e36] hover:bg-[#0a192f] text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#0f1e36]/20 hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>Unlock My Full ${result.maxBorrowingCapacity.toLocaleString()} Borrowing Power</span>
                <ArrowRight className="w-4 h-4 text-[#38bdf8]" />
              </button>
              <p className="text-[11px] text-center text-[#64748b]">
                See which Australian banks approve your deposit & income with maximum borrowing capacity ($0 Fee)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
