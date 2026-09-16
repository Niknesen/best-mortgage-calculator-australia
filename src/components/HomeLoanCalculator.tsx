import React, { useState, useMemo } from 'react';
import {
  calculateLoan,
  type RepaymentFrequency,
  type RepaymentType,
  type LoanSummary
} from '../math/repayments';
import { estimateLMI } from '../math/lmi';
import { calculateStampDuty, type AustralianState, type BuyerType } from '../math/stampDuty';
import {
  Sparkles,
  Download,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  PiggyBank,
  ArrowRight,
  CheckCircle2,
  Building2,
  Sliders,
  Flame
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface HomeLoanCalculatorProps {
  onOpenLeadModal: (details?: any) => void;
  onSelectState?: (state: AustralianState) => void;
}

export const HomeLoanCalculator: React.FC<HomeLoanCalculatorProps> = ({
  onOpenLeadModal,
}) => {
  // Primary Loan Inputs
  const [propertyValue, setPropertyValue] = useState<number>(950000);
  const [deposit, setDeposit] = useState<number>(190000); // 20%
  const [interestRate, setInterestRate] = useState<number>(5.84);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [repaymentFrequency, setRepaymentFrequency] = useState<RepaymentFrequency>('monthly');
  const [repaymentType, setRepaymentType] = useState<RepaymentType>('principal_and_interest');
  const [interestOnlyYears, setInterestOnlyYears] = useState<number>(5);
  const [acceleratedRepayments, setAcceleratedRepayments] = useState<boolean>(true);

  // Advanced Aussie Features
  const [showAdvanced, setShowAdvanced] = useState<boolean>(true);
  const [offsetBalance, setOffsetBalance] = useState<number>(35000);
  const [monthlyOffsetContribution, setMonthlyOffsetContribution] = useState<number>(500);
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState<number>(250);
  const [extraAnnualPayment] = useState<number>(0);
  const [extraOneOffPayment, setExtraOneOffPayment] = useState<number>(0);
  const [extraOneOffMonth] = useState<number>(24);
  
  // Stamp Duty & LMI toggles
  const [selectedState, setSelectedState] = useState<AustralianState>('NSW');
  const [buyerType, setBuyerType] = useState<BuyerType>('owner_occupier');
  const [capitaliseLmi, setCapitaliseLmi] = useState<boolean>(true);

  // Schedule Table View Mode
  const [scheduleView, setScheduleView] = useState<'annual' | 'monthly'>('annual');
  const [tablePage, setTablePage] = useState<number>(1);

  // Auto Deposit % sync helper
  const depositPercent = propertyValue > 0 ? Math.min(100, (deposit / propertyValue) * 100) : 0;

  const handleDepositPercentChange = (pct: number) => {
    const newDep = Math.round((propertyValue * pct) / 100);
    setDeposit(newDep);
  };

  const handlePropertyValueChange = (val: number) => {
    const clamped = Math.max(0, val);
    setPropertyValue(clamped);
    const currentPct = propertyValue > 0 ? deposit / propertyValue : 0.20;
    setDeposit(Math.round(clamped * currentPct));
  };

  // 1. Calculate LMI
  const lmiResult = useMemo(() => {
    return estimateLMI({
      propertyValue,
      deposit,
      isFirstHomeBuyer: buyerType === 'first_home_buyer',
    });
  }, [propertyValue, deposit, buyerType]);

  // 2. Calculate Stamp Duty
  const stampDutyResult = useMemo(() => {
    return calculateStampDuty({
      propertyValue,
      state: selectedState,
      buyerType,
      propertyType: 'established',
    });
  }, [propertyValue, selectedState, buyerType]);

  // 3. Core Loan Calculation
  const loanSummary: LoanSummary = useMemo(() => {
    return calculateLoan({
      propertyValue,
      deposit,
      interestRate,
      loanTermYears,
      repaymentFrequency,
      repaymentType,
      interestOnlyYears,
      acceleratedRepayments,
      offsetBalance,
      monthlyOffsetContribution,
      extraMonthlyPayment,
      extraAnnualPayment,
      extraOneOffPayment,
      extraOneOffMonth,
      capitaliseLmi: lmiResult.isLmiRequired && capitaliseLmi,
      lmiAmount: lmiResult.estimatedLmi,
    });
  }, [
    propertyValue,
    deposit,
    interestRate,
    loanTermYears,
    repaymentFrequency,
    repaymentType,
    interestOnlyYears,
    acceleratedRepayments,
    offsetBalance,
    monthlyOffsetContribution,
    extraMonthlyPayment,
    extraAnnualPayment,
    extraOneOffPayment,
    extraOneOffMonth,
    capitaliseLmi,
    lmiResult,
  ]);

  // Chart Data preparation
  const areaChartData = useMemo(() => {
    return loanSummary.annualSchedule.map((item) => {
      const baselineFactor = (loanTermYears - item.year) / loanTermYears;
      const baselineBalance = Math.max(0, Math.round(loanSummary.originalLoanAmount * baselineFactor));
      return {
        year: `Yr ${item.year}`,
        'Accelerated Balance': Math.round(item.endingBalance),
        'Standard 30-Yr Balance': baselineBalance,
        'Offset Balance': Math.round(item.endingOffsetBalance),
      };
    });
  }, [loanSummary, loanTermYears]);

  const pieData = useMemo(() => {
    return [
      { name: 'Loan Principal', value: loanSummary.loanAmount, color: '#0071e3' },
      { name: 'Total Interest', value: Math.round(loanSummary.totalInterest), color: '#059669' },
      ...(lmiResult.isLmiRequired && capitaliseLmi ? [{ name: 'Capitalised LMI', value: lmiResult.estimatedLmi, color: '#d97706' }] : []),
    ];
  }, [loanSummary, lmiResult, capitaliseLmi]);

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = ['Period (Month)', 'Year', 'Payment ($)', 'Principal ($)', 'Interest ($)', 'Extra/Offset Bonus ($)', 'Remaining Balance ($)'];
    const rows = loanSummary.schedule.map((s) => [
      s.period,
      s.year,
      s.payment.toFixed(2),
      s.principal.toFixed(2),
      s.interest.toFixed(2),
      s.extraPayment.toFixed(2),
      s.remainingBalance.toFixed(2),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mortgage-schedule-${propertyValue}-australia.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Export Handler
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(0, 113, 227);
    doc.text('Australian Mortgage & Amortization Report', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated by BestBrokers Australia • ${new Date().toLocaleDateString('en-AU')}`, 14, 27);

    // Summary Table
    autoTable(doc, {
      startY: 33,
      head: [['Key Metrics', 'Value']],
      body: [
        ['Property Purchase Price', `$${propertyValue.toLocaleString()}`],
        ['Deposit', `$${deposit.toLocaleString()} (${depositPercent.toFixed(1)}%)`],
        ['Loan Principal Amount', `$${loanSummary.loanAmount.toLocaleString()}`],
        ['Interest Rate', `${interestRate.toFixed(2)}% p.a.`],
        ['Repayment Frequency', `${repaymentFrequency.toUpperCase()} (${acceleratedRepayments ? 'Accelerated' : 'Standard'})`],
        ['Repayment Amount', `$${loanSummary.repaymentAmount.toFixed(2)} / ${repaymentFrequency}`],
        ['Estimated LMI', `$${lmiResult.estimatedLmi.toLocaleString()}`],
        ['Estimated State Stamp Duty', `$${stampDutyResult.stampDuty.toLocaleString()} (${selectedState})`],
        ['Total Interest Over Loan', `$${Math.round(loanSummary.totalInterest).toLocaleString()}`],
        ['Interest Saved via Offset & Extra', `$${Math.round(loanSummary.totalInterestSaved).toLocaleString()}`],
        ['Time Saved Off Mortgage', `${loanSummary.yearsSaved} Years, ${loanSummary.monthsSaved} Months`],
        ['Accelerated Payoff Date', loanSummary.payoffDate],
      ],
      theme: 'striped',
      headStyles: { fillColor: [0, 113, 227] },
    });

    const tableData = loanSummary.annualSchedule.map((a) => [
      `Year ${a.year}`,
      `$${Math.round(a.totalPayment).toLocaleString()}`,
      `$${Math.round(a.principalPaid).toLocaleString()}`,
      `$${Math.round(a.interestPaid).toLocaleString()}`,
      `$${Math.round(a.extraPaid).toLocaleString()}`,
      `$${Math.round(a.endingBalance).toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Year', 'Total Repayments', 'Principal Paid', 'Interest Paid', 'Offset/Extra Bonus', 'Ending Balance']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] },
    });

    doc.save(`Australian-Mortgage-Report-${propertyValue}.pdf`);
  };

  const frequencyLabel =
    repaymentFrequency === 'weekly' ? 'Weekly' : repaymentFrequency === 'fortnightly' ? 'Fortnightly' : 'Monthly';

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0f9ff] border border-[#0071e3]/25 text-[#0071e3] text-xs font-mono font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
          <span>Real-time Aussie Offset & Accelerated Payoff Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f172a] font-display">
          Best Mortgage Calculator <span className="text-[#0071e3]">Australia</span>
        </h1>
        <p className="text-[#64748b] text-sm sm:text-base leading-relaxed">
          Simulate exact Australian loan repayments, 100% daily offset interest reductions, LMI, and 8-state stamp duty under 2024/2026 APRA serviceability guidelines.
        </p>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05),0_2px_6px_-1px_rgba(15,23,42,0.03)] border border-[#e2e8f0] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0]">
            <h2 className="text-base sm:text-lg font-bold text-[#0f172a] font-display flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#0071e3]" />
              <span>Mortgage Parameters</span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-3 py-1 bg-[#f8fafc] text-[#0071e3] border border-[#e2e8f0] rounded-full">
                LVR: <strong className="text-[#0f172a]">{loanSummary.lvr}%</strong>
              </span>
            </div>
          </div>

          {/* Property Value Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="font-bold text-[#0f172a]">Property Purchase Price</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#64748b] font-mono font-bold">$</span>
                <input
                  type="number"
                  value={propertyValue}
                  onChange={(e) => handlePropertyValueChange(Number(e.target.value))}
                  className="w-40 pl-7 pr-3 py-1.5 text-right font-mono font-extrabold text-[#0f172a] bg-[#f8fafc] border border-[#cbd5e1] rounded-xl focus:ring-2 focus:ring-[#0071e3] focus:border-[#0071e3] text-sm"
                />
              </div>
            </div>
            {/* Quick Price Buttons */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[600000, 800000, 950000, 1200000, 1500000, 2000000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handlePropertyValueChange(val)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-mono font-bold transition-all ${
                    propertyValue === val
                      ? 'bg-[#0071e3] text-white shadow-sm'
                      : 'bg-[#f1f5f9] text-[#475569] hover:text-[#0f172a] hover:bg-[#e2e8f0] border border-[#e2e8f0]'
                  }`}
                >
                  ${val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : `${val / 1000}k`}
                </button>
              ))}
            </div>
            <input
              type="range"
              min={200000}
              max={3000000}
              step={25000}
              value={propertyValue}
              onChange={(e) => handlePropertyValueChange(Number(e.target.value))}
              className="w-full h-2 bg-[#e2e8f0] rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
            />
          </div>

          {/* Deposit Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <label className="font-bold text-[#0f172a]">Deposit Amount</label>
                <span className="text-xs text-[#059669] bg-[#ecfdf5] border border-[#059669]/30 font-mono font-bold px-2 py-0.5 rounded-full">
                  {depositPercent.toFixed(1)}%
                </span>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#64748b] font-mono font-bold">$</span>
                <input
                  type="number"
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="w-40 pl-7 pr-3 py-1.5 text-right font-mono font-extrabold text-[#0f172a] bg-[#f8fafc] border border-[#cbd5e1] rounded-xl focus:ring-2 focus:ring-[#0071e3] focus:border-[#0071e3] text-sm"
                />
              </div>
            </div>
            {/* Quick Deposit % Buttons */}
            <div className="flex gap-1.5 pt-1">
              {[5, 10, 15, 20, 30].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleDepositPercentChange(pct)}
                  className={`flex-1 text-xs py-1.5 rounded-lg font-mono font-bold transition-all ${
                    Math.round(depositPercent) === pct
                      ? 'bg-[#0071e3] text-white shadow-sm'
                      : 'bg-[#f1f5f9] text-[#475569] hover:text-[#0f172a] hover:bg-[#e2e8f0] border border-[#e2e8f0]'
                  }`}
                >
                  {pct}% {pct < 20 ? '(LMI)' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* LMI Warning / Notice */}
          {lmiResult.isLmiRequired && (
            <div className="p-4 rounded-2xl bg-[#fffbeb] border border-[#fde68a] text-[#92400e] text-xs space-y-2">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <p className="font-semibold">{lmiResult.explanation}</p>
                  <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-[#78350f]">
                    <input
                      type="checkbox"
                      checked={capitaliseLmi}
                      onChange={(e) => setCapitaliseLmi(e.target.checked)}
                      className="rounded text-[#0071e3] focus:ring-[#0071e3] w-4 h-4"
                    />
                    <span>Capitalise LMI into loan (add ${lmiResult.estimatedLmi.toLocaleString()} to loan principal)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Interest Rate & Loan Term */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <label className="font-bold text-[#0f172a]">Interest Rate</label>
                <span className="font-mono font-bold text-[#0071e3]">{interestRate.toFixed(2)}% p.a.</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.05"
                  min="1"
                  max="15"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full pl-3 pr-8 py-2 font-mono font-extrabold text-[#0f172a] bg-[#f8fafc] border border-[#cbd5e1] rounded-xl focus:ring-2 focus:ring-[#0071e3] text-sm"
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748b] font-mono font-bold text-xs">%</span>
              </div>
              {/* Quick Rates */}
              <div className="flex gap-1 pt-1">
                {[5.74, 5.84, 6.14, 6.44].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setInterestRate(r)}
                    className="text-[11px] px-2 py-0.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] rounded-md border border-[#e2e8f0] font-mono"
                  >
                    {r}%
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <label className="font-bold text-[#0f172a]">Loan Term</label>
                <span className="font-mono font-bold text-[#0f172a]">{loanTermYears} Years</span>
              </div>
              <select
                value={loanTermYears}
                onChange={(e) => setLoanTermYears(Number(e.target.value))}
                className="w-full px-3 py-2 font-bold text-[#0f172a] bg-[#f8fafc] border border-[#cbd5e1] rounded-xl focus:ring-2 focus:ring-[#0071e3] text-sm"
              >
                <option value={30}>30 Years (Standard Australia)</option>
                <option value={25}>25 Years</option>
                <option value={20}>20 Years</option>
                <option value={15}>15 Years</option>
                <option value={10}>10 Years</option>
              </select>
            </div>
          </div>

          {/* Repayment Frequency & Mode */}
          <div className="space-y-3 pt-2">
            <label className="block text-sm font-bold text-[#0f172a]">Repayment Frequency</label>
            <div className="grid grid-cols-3 gap-2">
              {(['monthly', 'fortnightly', 'weekly'] as RepaymentFrequency[]).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setRepaymentFrequency(freq)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                    repaymentFrequency === freq
                      ? 'bg-[#0071e3] text-white border-[#0071e3] shadow-sm'
                      : 'bg-[#f8fafc] text-[#475569] hover:text-[#0f172a] border-[#e2e8f0] hover:bg-[#f1f5f9]'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>

            {/* Accelerated Frequency Switch */}
            {repaymentFrequency !== 'monthly' && (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#ecfdf5] border border-[#059669]/30 text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-[#047857] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                    <span>Aussie Accelerated Repayment ({repaymentFrequency === 'fortnightly' ? 'Monthly ÷ 2' : 'Monthly ÷ 4'})</span>
                  </span>
                  <p className="text-[#065f46] text-[11px]">
                    Pays 1 extra month of principal per year, shaving years off your mortgage.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={acceleratedRepayments}
                  onChange={(e) => setAcceleratedRepayments(e.target.checked)}
                  className="w-4 h-4 text-[#059669] rounded focus:ring-[#059669]"
                />
              </div>
            )}
          </div>

          {/* Repayment Type (P&I vs IO) */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#0f172a]">Repayment Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRepaymentType('principal_and_interest')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  repaymentType === 'principal_and_interest'
                    ? 'bg-[#0f1e36] text-white border-[#0f1e36] shadow-sm'
                    : 'bg-[#f8fafc] text-[#475569] hover:text-[#0f172a] border-[#e2e8f0]'
                }`}
              >
                Principal & Interest (P&I)
              </button>
              <button
                type="button"
                onClick={() => setRepaymentType('interest_only')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  repaymentType === 'interest_only'
                    ? 'bg-[#0f1e36] text-white border-[#0f1e36] shadow-sm'
                    : 'bg-[#f8fafc] text-[#475569] hover:text-[#0f172a] border-[#e2e8f0]'
                }`}
              >
                Interest Only (IO)
              </button>
            </div>

            {repaymentType === 'interest_only' && (
              <div className="p-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#334155]">Interest-Only Period:</span>
                  <select
                    value={interestOnlyYears}
                    onChange={(e) => setInterestOnlyYears(Number(e.target.value))}
                    className="font-bold px-2.5 py-1 bg-white text-[#0f172a] border border-[#cbd5e1] rounded-lg text-xs"
                  >
                    {[1, 2, 3, 4, 5].map((y) => (
                      <option key={y} value={y}>
                        {y} Years
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[#64748b] text-[11px]">
                  After {interestOnlyYears} years, your repayment converts to Principal & Interest for the remaining{' '}
                  {loanTermYears - interestOnlyYears} years.
                </p>
              </div>
            )}
          </div>

          {/* Accordion: 100% Offset Account & Extra Repayments */}
          <div className="border border-[#e2e8f0] rounded-2xl overflow-hidden bg-[#f8fafc]">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between p-4 bg-[#f8fafc] hover:bg-[#f1f5f9] transition-colors text-left font-bold text-sm text-[#0f172a]"
            >
              <div className="flex items-center gap-2">
                <PiggyBank className="w-4 h-4 text-[#0071e3]" />
                <span>100% Offset Account & Extra Repayments Simulator</span>
                <span className="text-[10px] bg-[#ecfdf5] border border-[#059669]/30 text-[#059669] font-mono font-extrabold px-2 py-0.5 rounded-full">
                  AU ALPHA
                </span>
              </div>
              {showAdvanced ? <ChevronUp className="w-4 h-4 text-[#64748b]" /> : <ChevronDown className="w-4 h-4 text-[#64748b]" />}
            </button>

            {showAdvanced && (
              <div className="p-5 space-y-4 bg-white border-t border-[#e2e8f0]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Offset Initial Balance */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#334155]">Initial Offset Balance ($)</label>
                    <input
                      type="number"
                      value={offsetBalance}
                      onChange={(e) => setOffsetBalance(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm font-mono font-bold bg-[#f8fafc] text-[#0f172a] border border-[#cbd5e1] rounded-xl focus:ring-2 focus:ring-[#0071e3]"
                      placeholder="e.g. 20000"
                    />
                  </div>
                  {/* Monthly Offset Savings Deposit */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#334155]">Monthly Offset Deposit ($/mo)</label>
                    <input
                      type="number"
                      value={monthlyOffsetContribution}
                      onChange={(e) => setMonthlyOffsetContribution(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm font-mono font-bold bg-[#f8fafc] text-[#0f172a] border border-[#cbd5e1] rounded-xl focus:ring-2 focus:ring-[#0071e3]"
                      placeholder="e.g. 500"
                    />
                  </div>
                  {/* Extra Monthly Payment */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#334155]">Extra Monthly Repayment ($/mo)</label>
                    <input
                      type="number"
                      value={extraMonthlyPayment}
                      onChange={(e) => setExtraMonthlyPayment(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm font-mono font-bold bg-[#f8fafc] text-[#0f172a] border border-[#cbd5e1] rounded-xl focus:ring-2 focus:ring-[#0071e3]"
                      placeholder="e.g. 250"
                    />
                  </div>
                  {/* Lump Sum Payment */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#334155]">One-Off Lump Sum ($)</label>
                    <input
                      type="number"
                      value={extraOneOffPayment}
                      onChange={(e) => setExtraOneOffPayment(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm font-mono font-bold bg-[#f8fafc] text-[#0f172a] border border-[#cbd5e1] rounded-xl focus:ring-2 focus:ring-[#0071e3]"
                      placeholder="e.g. 10000"
                    />
                  </div>
                </div>

                {/* State Stamp Duty Quick Selector */}
                <div className="pt-3 border-t border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#0071e3]" />
                    <span className="font-bold text-[#334155]">State Stamp Duty:</span>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value as AustralianState)}
                      className="font-bold font-mono px-2.5 py-1 bg-[#f8fafc] text-[#0f172a] rounded-lg border border-[#cbd5e1]"
                    >
                      {(['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'] as AustralianState[]).map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#334155]">Buyer Type:</span>
                    <select
                      value={buyerType}
                      onChange={(e) => setBuyerType(e.target.value as BuyerType)}
                      className="font-bold px-2.5 py-1 bg-[#f8fafc] text-[#0f172a] rounded-lg border border-[#cbd5e1]"
                    >
                      <option value="owner_occupier">Owner Occupier</option>
                      <option value="first_home_buyer">First Home Buyer</option>
                      <option value="investor">Investor</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Visual Summary & Big Repayment Dock (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Repayment Display Dock (Matches calc-result-dock style from sydney.html) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05),0_2px_6px_-1px_rgba(15,23,42,0.03)] border border-[#e2e8f0] space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-[#0071e3] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#059669]" />
                <span>Estimated {frequencyLabel} Repayment</span>
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#ecfdf5] text-[#047857] border border-[#059669]/30 font-bold">
                {interestRate.toFixed(2)}% Variable
              </span>
            </div>

            {/* The Big Emerald Display Dock */}
            <div className="bg-[#ecfdf5] border-[1.5px] border-[#059669]/30 rounded-2xl p-5 text-center space-y-1">
              <div className="font-display text-4xl sm:text-5xl font-extrabold text-[#047857] leading-none">
                ${Math.round(loanSummary.repaymentAmount).toLocaleString()}
              </div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#059669] pt-1">
                Estimated {frequencyLabel} Repayment
              </div>
              {repaymentFrequency !== 'monthly' && (
                <p className="text-[11px] text-[#065f46] font-mono pt-1">
                  Monthly Equivalent: <strong>${Math.round(loanSummary.monthlyEquivalent).toLocaleString()}/mo</strong>
                </p>
              )}
            </div>

            {/* Total Savings Supercharge Highlight */}
            {(loanSummary.totalInterestSaved > 0 || loanSummary.yearsSaved > 0) && (
              <div className="p-4 rounded-2xl bg-[#f0f9ff] border border-[#0071e3]/30 space-y-2.5">
                <div className="flex items-center gap-2 text-[#0071e3] font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Offset & Accelerated Supercharge!</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#64748b] block text-[11px] font-mono">Interest Saved</span>
                    <strong className="text-[#0071e3] text-lg font-black font-mono">
                      ${Math.round(loanSummary.totalInterestSaved).toLocaleString()}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#64748b] block text-[11px] font-mono">Time Cut Off Loan</span>
                    <strong className="text-[#0071e3] text-lg font-black font-mono">
                      {loanSummary.yearsSaved}y {loanSummary.monthsSaved}m
                    </strong>
                  </div>
                </div>
                <p className="text-[11px] text-[#334155]">
                  Mortgage paid off by <strong className="text-[#0f172a]">{loanSummary.payoffDate}</strong> (instead of {loanSummary.originalPayoffDate}).
                </p>
                <button
                  onClick={() => onOpenLeadModal({ 
                    propertyValue, 
                    deposit, 
                    loanSummary, 
                    selectedState, 
                    goal: `Save $${Math.round(loanSummary.totalInterestSaved).toLocaleString()} with 100% Offset Account` 
                  })}
                  className="w-full py-2 px-3 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <span>Claim My ${Math.round(loanSummary.totalInterestSaved).toLocaleString()} Offset Savings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Key Totals Breakdown */}
            <div className="space-y-2 pt-2 border-t border-[#e2e8f0] text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                <span className="text-[#64748b]">Loan Principal</span>
                <span className="font-bold text-[#0f172a]">${loanSummary.loanAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                <span className="text-[#64748b]">Total Interest (Loan Lifetime)</span>
                <span className="font-bold text-[#0f172a]">${Math.round(loanSummary.totalInterest).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                <span className="text-[#64748b]">{selectedState} Stamp Duty</span>
                <span className="font-bold text-[#0f172a]">${stampDutyResult.stampDuty.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#334155] font-bold">Total Cost (Principal + Interest)</span>
                <span className="font-extrabold text-[#0071e3] text-sm">${Math.round(loanSummary.totalCost).toLocaleString()}</span>
              </div>
            </div>

            {/* Apple Navy CTA Button */}
            <div className="space-y-1.5">
              <button
                onClick={() => onOpenLeadModal({ 
                  propertyValue, 
                  deposit, 
                  loanSummary, 
                  selectedState,
                  goal: `Lock in $${Math.round(loanSummary.repaymentAmount).toLocaleString()}/${repaymentFrequency === 'weekly' ? 'wk' : repaymentFrequency === 'fortnightly' ? 'fn' : 'mo'} Repayment Rate`
                })}
                className="w-full py-3.5 px-4 rounded-xl bg-[#0f1e36] hover:bg-[#0a192f] text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#0f1e36]/20 hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>Lock In This ${Math.round(loanSummary.repaymentAmount).toLocaleString()}/{repaymentFrequency === 'weekly' ? 'wk' : repaymentFrequency === 'fortnightly' ? 'fn' : 'mo'} Rate</span>
                <ArrowRight className="w-4 h-4 text-[#38bdf8]" />
              </button>
              <p className="text-[11px] text-center text-[#64748b]">
                Free Pre-Approval & Rate Negotiation with a Top {selectedState} Broker ($0 Fee)
              </p>
            </div>
          </div>

          {/* Principal vs Interest Donut Chart */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05),0_2px_6px_-1px_rgba(15,23,42,0.03)] border border-[#e2e8f0] space-y-4">
            <h3 className="text-sm font-bold text-[#0f172a] font-display">Principal vs Interest Breakdown</h3>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Amount']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[#334155] truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trajectory Area Chart: 30-Year Loan Balance Over Time */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05),0_2px_6px_-1px_rgba(15,23,42,0.03)] border border-[#e2e8f0] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
          <div>
            <h3 className="text-lg font-bold text-[#0f172a] font-display">Loan Balance Payoff Trajectory</h3>
            <p className="text-xs text-[#64748b]">
              Comparing your standard 30-year schedule against your accelerated offset strategy.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-xs font-bold text-[#334155] hover:text-[#0f172a] hover:bg-[#e2e8f0] flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>CSV</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="px-3 py-1.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF Amortization Report</span>
            </button>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaChartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="accelGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0071e3" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0071e3" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="stdGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', color: '#64748b' }} />
              <Area
                type="monotone"
                dataKey="Standard 30-Yr Balance"
                stroke="#94a3b8"
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#stdGradient)"
              />
              <Area
                type="monotone"
                dataKey="Accelerated Balance"
                stroke="#0071e3"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#accelGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Amortization Schedule Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05),0_2px_6px_-1px_rgba(15,23,42,0.03)] border border-[#e2e8f0] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e2e8f0]">
          <div>
            <h3 className="text-lg font-bold text-[#0f172a] font-display">Amortization Schedule</h3>
            <p className="text-xs text-[#64748b]">Year-by-year principal, interest, and remaining balance breakdown.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-[#f1f5f9] p-1 rounded-xl flex text-xs font-bold border border-[#e2e8f0]">
              <button
                onClick={() => setScheduleView('annual')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  scheduleView === 'annual' ? 'bg-[#0071e3] text-white shadow-sm' : 'text-[#475569] hover:text-[#0f172a]'
                }`}
              >
                Annual Summary
              </button>
              <button
                onClick={() => setScheduleView('monthly')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  scheduleView === 'monthly' ? 'bg-[#0071e3] text-white shadow-sm' : 'text-[#475569] hover:text-[#0f172a]'
                }`}
              >
                Monthly Schedule
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {scheduleView === 'annual' ? (
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#f8fafc] text-[#334155] uppercase font-bold border-b border-[#e2e8f0]">
                <tr>
                  <th className="py-3 px-3">Year</th>
                  <th className="py-3 px-3">Total Payments</th>
                  <th className="py-3 px-3">Principal Paid</th>
                  <th className="py-3 px-3">Interest Paid</th>
                  <th className="py-3 px-3">Offset / Extra</th>
                  <th className="py-3 px-3">Ending Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {loanSummary.annualSchedule.map((row) => (
                  <tr key={row.year} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="py-2.5 px-3 font-bold text-[#0f172a]">Year {row.year}</td>
                    <td className="py-2.5 px-3 text-[#334155]">${Math.round(row.totalPayment).toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-bold text-[#059669]">${Math.round(row.principalPaid).toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-[#64748b]">${Math.round(row.interestPaid).toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-[#0071e3]">${Math.round(row.extraPaid).toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-bold text-[#0f172a]">${Math.round(row.endingBalance).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#f8fafc] text-[#334155] uppercase font-bold border-b border-[#e2e8f0]">
                <tr>
                  <th className="py-3 px-3">Month</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3">Principal</th>
                  <th className="py-3 px-3">Interest</th>
                  <th className="py-3 px-3">Extra/Offset</th>
                  <th className="py-3 px-3">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {loanSummary.schedule.slice((tablePage - 1) * 24, tablePage * 24).map((row) => (
                  <tr key={row.period} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="py-2 px-3 font-bold text-[#0f172a]">#{row.period}</td>
                    <td className="py-2 px-3 text-[#64748b]">{row.date}</td>
                    <td className="py-2 px-3 text-[#334155]">${row.payment.toFixed(2)}</td>
                    <td className="py-2 px-3 font-bold text-[#059669]">${row.principal.toFixed(2)}</td>
                    <td className="py-2 px-3 text-[#64748b]">${row.interest.toFixed(2)}</td>
                    <td className="py-2 px-3 text-[#0071e3]">${row.extraPayment.toFixed(2)}</td>
                    <td className="py-2 px-3 font-bold text-[#0f172a]">${Math.round(row.remainingBalance).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Monthly Pagination */}
        {scheduleView === 'monthly' && (
          <div className="flex items-center justify-between pt-3 border-t border-[#e2e8f0] text-xs font-mono">
            <span className="text-[#64748b]">
              Showing months {(tablePage - 1) * 24 + 1} to {Math.min(loanSummary.schedule.length, tablePage * 24)} of {loanSummary.schedule.length}
            </span>
            <div className="flex gap-2">
              <button
                disabled={tablePage === 1}
                onClick={() => setTablePage(tablePage - 1)}
                className="px-3 py-1 rounded-lg bg-[#f8fafc] border border-[#cbd5e1] disabled:opacity-40 text-[#0f172a] font-bold"
              >
                Previous
              </button>
              <button
                disabled={tablePage * 24 >= loanSummary.schedule.length}
                onClick={() => setTablePage(tablePage + 1)}
                className="px-3 py-1 rounded-lg bg-[#f8fafc] border border-[#cbd5e1] disabled:opacity-40 text-[#0f172a] font-bold"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
