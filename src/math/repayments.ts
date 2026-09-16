/**
 * Australian Mortgage Repayment & Amortization Engine
 * 
 * In Australia:
 * - Interest is calculated daily on the outstanding balance and charged monthly.
 * - Standard repayment frequencies: Monthly, Fortnightly, Weekly.
 * - Fortnightly has two modes:
 *   - "Standard Calendar": Monthly payment * 12 / 26
 *   - "Accelerated (Aussie Half-Pay)": Monthly payment / 2 (results in 26 half-payments = 13 monthly payments/year)
 * - Weekly has two modes:
 *   - "Standard Calendar": Monthly payment * 12 / 52
 *   - "Accelerated": Monthly payment / 4
 */

export type RepaymentFrequency = 'monthly' | 'fortnightly' | 'weekly';
export type RepaymentType = 'principal_and_interest' | 'interest_only';
export type LoanPurpose = 'owner_occupier' | 'investor';

export interface LoanInput {
  propertyValue: number;
  deposit: number;
  loanAmount?: number; // if provided, overrides (propertyValue - deposit)
  interestRate: number; // e.g. 5.84 (%)
  loanTermYears: number; // e.g. 30
  repaymentFrequency: RepaymentFrequency;
  repaymentType: RepaymentType;
  interestOnlyYears?: number; // e.g. 1 to 5 years if repaymentType === 'interest_only'
  acceleratedRepayments?: boolean; // True fortnightly (Monthly / 2)
  offsetBalance?: number;
  monthlyOffsetContribution?: number;
  extraMonthlyPayment?: number;
  extraAnnualPayment?: number;
  extraOneOffPayment?: number;
  extraOneOffMonth?: number;
  capitaliseLmi?: boolean;
  lmiAmount?: number;
}

export interface AmortizationPeriod {
  period: number; // month number or payment number
  year: number;
  date: string;
  payment: number;
  principal: number;
  interest: number;
  extraPayment: number;
  offsetBalance: number;
  remainingBalance: number;
  totalInterestPaid: number;
  totalPrincipalPaid: number;
}

export interface AnnualAmortization {
  year: number;
  totalPayment: number;
  principalPaid: number;
  interestPaid: number;
  extraPaid: number;
  endingBalance: number;
  endingOffsetBalance: number;
}

export interface LoanSummary {
  loanAmount: number;
  originalLoanAmount: number;
  lvr: number; // Loan to Value Ratio (e.g. 80.0)
  repaymentAmount: number; // per chosen frequency
  monthlyEquivalent: number;
  totalRepayments: number;
  totalInterest: number;
  totalCost: number; // Principal + Interest + Fees
  actualTermYears: number;
  actualTermMonths: number;
  yearsSaved: number;
  monthsSaved: number;
  totalInterestSaved: number;
  payoffDate: string;
  originalPayoffDate: string;
  schedule: AmortizationPeriod[];
  annualSchedule: AnnualAmortization[];
  interestOnlyMonthlyPayment?: number;
  reversionMonthlyPayment?: number;
}

/**
 * Standard Monthly P&I Repayment Formula
 * M = P * [ r(1 + r)^n ] / [ (1 + r)^n – 1]
 */
export function calculateMonthlyPI(principal: number, annualRatePercent: number, totalMonths: number): number {
  if (principal <= 0 || totalMonths <= 0) return 0;
  if (annualRatePercent <= 0) return principal / totalMonths;

  const monthlyRate = annualRatePercent / 100 / 12;
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
}

/**
 * Monthly Interest Only Payment Formula
 */
export function calculateMonthlyIO(principal: number, annualRatePercent: number): number {
  if (principal <= 0 || annualRatePercent <= 0) return 0;
  return (principal * (annualRatePercent / 100)) / 12;
}

/**
 * Convert monthly repayment into Australian frequency (Weekly / Fortnightly / Monthly)
 */
export function convertRepaymentFrequency(
  monthlyPayment: number,
  frequency: RepaymentFrequency,
  accelerated: boolean = true
): number {
  if (frequency === 'monthly') {
    return monthlyPayment;
  }
  if (frequency === 'fortnightly') {
    return accelerated ? monthlyPayment / 2 : (monthlyPayment * 12) / 26;
  }
  if (frequency === 'weekly') {
    return accelerated ? monthlyPayment / 4 : (monthlyPayment * 12) / 52;
  }
  return monthlyPayment;
}

/**
 * Comprehensive Australian Loan & Offset Simulation
 */
export function calculateLoan(input: LoanInput): LoanSummary {
  const propertyVal = Math.max(0, input.propertyValue || 0);
  const depositVal = Math.max(0, input.deposit || 0);
  
  let principal = input.loanAmount ?? Math.max(0, propertyVal - depositVal);
  const originalLoanAmount = principal;

  // LMI Capitalisation if requested
  if (input.capitaliseLmi && input.lmiAmount && input.lmiAmount > 0) {
    principal += input.lmiAmount;
  }

  const lvr = propertyVal > 0 ? (principal / propertyVal) * 100 : 0;
  const rate = Math.max(0, input.interestRate || 0);
  const totalYears = Math.max(1, input.loanTermYears || 30);
  const totalMonths = totalYears * 12;
  const isIO = input.repaymentType === 'interest_only';
  const ioYears = isIO ? Math.min(totalYears - 1, Math.max(1, input.interestOnlyYears || 5)) : 0;
  const ioMonths = ioYears * 12;
  const piMonths = totalMonths - ioMonths;

  // Contractual fixed monthly repayment based on original principal
  const baseMonthlyPI = calculateMonthlyPI(principal, rate, isIO ? piMonths : totalMonths);
  const baseMonthlyIO = isIO ? calculateMonthlyIO(principal, rate) : 0;
  const initialMonthlyPayment = isIO ? baseMonthlyIO : baseMonthlyPI;

  const standardRepayment = convertRepaymentFrequency(
    initialMonthlyPayment,
    input.repaymentFrequency,
    input.acceleratedRepayments !== false
  );

  // Simulation state
  let currentBalance = principal;
  let currentOffset = Math.max(0, input.offsetBalance || 0);
  const monthlyOffsetContrib = Math.max(0, input.monthlyOffsetContribution || 0);
  const extraMonthly = Math.max(0, input.extraMonthlyPayment || 0);
  const extraAnnual = Math.max(0, input.extraAnnualPayment || 0);
  const extraOneOff = Math.max(0, input.extraOneOffPayment || 0);
  const extraOneOffMonth = input.extraOneOffMonth || 12;

  const schedule: AmortizationPeriod[] = [];
  const annualSchedule: AnnualAmortization[] = [];

  let totalInterestPaid = 0;
  let totalPrincipalPaid = 0;
  let totalRepayments = 0;

  let currentYearPayment = 0;
  let currentYearPrincipal = 0;
  let currentYearInterest = 0;
  let currentYearExtra = 0;

  const startDate = new Date();

  // Baseline simulation without extra/offset to calculate savings
  const baselineTotalInterest = calculateBaselineTotalInterest(principal, rate, totalMonths, ioMonths);

  let month = 1;
  while (currentBalance > 0.01 && month <= totalMonths + 120) {
    const isInsideIO = isIO && month <= ioMonths;
    const currentYear = Math.ceil(month / 12);
    
    // In Australia, contractual required payment remains based on original schedule
    let contractualPayment = isInsideIO ? baseMonthlyIO : baseMonthlyPI;

    // Offset account grows with contribution
    if (month > 1 && monthlyOffsetContrib > 0) {
      currentOffset += monthlyOffsetContrib;
    }

    // In Australia: Daily interest calculated on max(0, Balance - Offset)
    // For 30-day average month: (Rate / 100 / 365) * 30.4167 days ~= Rate / 100 / 12
    const effectiveBalanceForInterest = Math.max(0, currentBalance - currentOffset);
    const monthlyInterest = (effectiveBalanceForInterest * (rate / 100)) / 12;

    // Calculate extra payments for this month
    let thisMonthExtra = extraMonthly;
    if (month % 12 === 0) {
      thisMonthExtra += extraAnnual;
    }
    if (month === extraOneOffMonth) {
      thisMonthExtra += extraOneOff;
    }

    // Aussie Accelerated Fortnightly / Weekly bonus equivalent
    if (input.repaymentFrequency === 'fortnightly' && input.acceleratedRepayments !== false) {
      // 26 fortnights = 13 monthly payments -> extra 1/12th of monthly payment per month
      thisMonthExtra += contractualPayment / 12;
    } else if (input.repaymentFrequency === 'weekly' && input.acceleratedRepayments !== false) {
      thisMonthExtra += contractualPayment / 12;
    }

    let principalPayment = 0;
    let actualPayment = 0;

    if (isInsideIO) {
      principalPayment = 0;
      actualPayment = monthlyInterest + thisMonthExtra;
      // Extra payment directly reduces balance during IO
      if (thisMonthExtra > 0) {
        const extraRed = Math.min(currentBalance, thisMonthExtra);
        currentBalance -= extraRed;
        principalPayment += extraRed;
      }
    } else {
      let regularPrincipal = Math.max(0, contractualPayment - monthlyInterest);
      principalPayment = regularPrincipal + thisMonthExtra;

      if (principalPayment + monthlyInterest >= currentBalance + monthlyInterest) {
        principalPayment = currentBalance;
        actualPayment = currentBalance + monthlyInterest;
      } else {
        actualPayment = contractualPayment + thisMonthExtra;
      }
      currentBalance = Math.max(0, currentBalance - principalPayment);
    }

    totalInterestPaid += monthlyInterest;
    totalPrincipalPaid += principalPayment;
    totalRepayments += actualPayment;

    currentYearPayment += actualPayment;
    currentYearPrincipal += principalPayment;
    currentYearInterest += monthlyInterest;
    currentYearExtra += thisMonthExtra;

    const dateObj = new Date(startDate);
    dateObj.setMonth(dateObj.getMonth() + month);
    const dateStr = dateObj.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' });

    schedule.push({
      period: month,
      year: currentYear,
      date: dateStr,
      payment: actualPayment,
      principal: principalPayment,
      interest: monthlyInterest,
      extraPayment: thisMonthExtra,
      offsetBalance: currentOffset,
      remainingBalance: currentBalance,
      totalInterestPaid,
      totalPrincipalPaid,
    });

    // Close of annual bucket
    if (month % 12 === 0 || currentBalance <= 0.01) {
      annualSchedule.push({
        year: currentYear,
        totalPayment: currentYearPayment,
        principalPaid: currentYearPrincipal,
        interestPaid: currentYearInterest,
        extraPaid: currentYearExtra,
        endingBalance: currentBalance,
        endingOffsetBalance: currentOffset,
      });
      currentYearPayment = 0;
      currentYearPrincipal = 0;
      currentYearInterest = 0;
      currentYearExtra = 0;
    }

    if (currentBalance <= 0.01) {
      break;
    }
    month++;
  }

  const actualTotalMonths = schedule.length;
  const actualTermYears = Math.floor(actualTotalMonths / 12);
  const actualTermMonths = actualTotalMonths % 12;

  const totalOriginalMonths = totalYears * 12;
  const totalMonthsSaved = Math.max(0, totalOriginalMonths - actualTotalMonths);
  const yearsSaved = Math.floor(totalMonthsSaved / 12);
  const monthsSaved = totalMonthsSaved % 12;

  const totalInterestSaved = Math.max(0, baselineTotalInterest - totalInterestPaid);

  const finalDate = new Date(startDate);
  finalDate.setMonth(finalDate.getMonth() + actualTotalMonths);
  const payoffDate = finalDate.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });

  const origFinalDate = new Date(startDate);
  origFinalDate.setMonth(origFinalDate.getMonth() + totalOriginalMonths);
  const originalPayoffDate = origFinalDate.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });

  return {
    loanAmount: principal,
    originalLoanAmount,
    lvr: Number(lvr.toFixed(1)),
    repaymentAmount: standardRepayment,
    monthlyEquivalent: initialMonthlyPayment,
    totalRepayments,
    totalInterest: totalInterestPaid,
    totalCost: principal + totalInterestPaid,
    actualTermYears,
    actualTermMonths,
    yearsSaved,
    monthsSaved,
    totalInterestSaved,
    payoffDate,
    originalPayoffDate,
    schedule,
    annualSchedule,
    interestOnlyMonthlyPayment: isIO ? baseMonthlyIO : undefined,
    reversionMonthlyPayment: isIO ? baseMonthlyPI : undefined,
  };
}

/**
 * Compute pure baseline interest without offset or extra
 */
function calculateBaselineTotalInterest(principal: number, rate: number, totalMonths: number, ioMonths: number): number {
  if (principal <= 0 || rate <= 0) return 0;
  let balance = principal;
  let interest = 0;
  const piMonths = totalMonths - ioMonths;
  const monthlyPI = calculateMonthlyPI(principal, rate, piMonths);

  for (let m = 1; m <= totalMonths; m++) {
    const monthlyRate = rate / 100 / 12;
    const curInt = balance * monthlyRate;
    interest += curInt;

    if (m <= ioMonths) {
      // IO period - balance does not decrease
    } else {
      const princ = monthlyPI - curInt;
      balance = Math.max(0, balance - princ);
    }
  }
  return interest;
}
