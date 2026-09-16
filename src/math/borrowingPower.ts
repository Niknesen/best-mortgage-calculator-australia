/**
 * APRA Borrowing Capacity & Serviceability Engine (Australia 2024/2025)
 * 
 * Incorporates:
 * - APRA mandated 3.00% interest rate buffer
 * - 2024/2025 Stage 3 Australian Income Tax Brackets + Medicare Levy
 * - Household Expenditure Measure (HEM) benchmark floor
 * - 80% Rental Income shading
 * - Credit Card limit 3.8% monthly commitment assessment
 * - HECS-HELP loan repayment calculation
 */

export interface BorrowingPowerInput {
  applicant1Income: number; // Gross Annual Salary
  applicant2Income?: number; // Gross Annual Salary
  hasHecs1?: boolean;
  hasHecs2?: boolean;
  rentalIncomeAnnual?: number; // Pre-tax investment income
  otherIncomeAnnual?: number;
  maritalStatus: 'single' | 'couple';
  dependents: number;
  declaredMonthlyLivingExpenses: number;
  creditCardLimitsTotal: number;
  monthlyOtherLoanRepayments: number; // car loans, personal loans
  currentMarketRate: number; // e.g. 5.84%
  loanTermYears?: number; // default 30
}

export interface BorrowingPowerResult {
  maxBorrowingCapacity: number;
  maxPropertyPurchasePrice: number; // Capacity + deposit estimate
  assessmentRate: number; // Actual Rate + 3.00%
  grossMonthlyIncome: number;
  netMonthlyIncome: number;
  monthlyTaxPaid: number;
  monthlyHecsPaid: number;
  monthlyLivingExpensesUsed: number;
  isHemApplied: boolean;
  monthlyDebtCommitments: number;
  creditCardMonthlyAssessed: number;
  surplusMonthlyCapacity: number;
  monthlyRepaymentAtActualRate: number;
}

export function calculateBorrowingPower(input: BorrowingPowerInput, depositAvailable: number = 100000): BorrowingPowerResult {
  const inc1 = Math.max(0, input.applicant1Income);
  const inc2 = Math.max(0, input.applicant2Income || 0);
  const otherInc = Math.max(0, input.otherIncomeAnnual || 0);
  const rentalInc = Math.max(0, input.rentalIncomeAnnual || 0) * 0.80; // 80% bank shading

  // Calculate Net Income for Applicant 1 & 2 after 2024/2025 Stage 3 Tax + Medicare + HECS
  const tax1 = calculateAustralianTax(inc1);
  const hecs1 = input.hasHecs1 ? calculateHecs(inc1) : 0;
  const net1 = inc1 - tax1 - hecs1;

  const tax2 = inc2 > 0 ? calculateAustralianTax(inc2) : 0;
  const hecs2 = input.hasHecs2 ? calculateHecs(inc2) : 0;
  const net2 = inc2 > 0 ? inc2 - tax2 - hecs2 : 0;

  // Other income taxed at estimated marginal 30%
  const netOther = (rentalInc + otherInc) * 0.70;

  const totalNetAnnual = net1 + net2 + netOther;
  const totalGrossAnnual = inc1 + inc2 + rentalInc + otherInc;
  const grossMonthlyIncome = totalGrossAnnual / 12;
  const netMonthlyIncome = totalNetAnnual / 12;
  const monthlyTaxPaid = (tax1 + tax2 + (rentalInc + otherInc) * 0.30) / 12;
  const monthlyHecsPaid = (hecs1 + hecs2) / 12;

  // HEM Benchmark calculation
  const hemBenchmark = getHemBenchmark(input.maritalStatus, input.dependents || 0);
  const declaredExpenses = Math.max(0, input.declaredMonthlyLivingExpenses);
  const monthlyLivingExpensesUsed = Math.max(declaredExpenses, hemBenchmark);
  const isHemApplied = hemBenchmark > declaredExpenses;

  // Monthly Debt commitments
  // Banks assess credit cards as 3.8% of credit limit per month as liability
  const ccAssessed = (Math.max(0, input.creditCardLimitsTotal) * 0.038);
  const otherLoans = Math.max(0, input.monthlyOtherLoanRepayments);
  const monthlyDebtCommitments = ccAssessed + otherLoans;

  // Surplus monthly cash flow for home loan
  const surplusMonthlyCapacity = Math.max(0, netMonthlyIncome - monthlyLivingExpensesUsed - monthlyDebtCommitments);

  // APRA Assessment Rate: Actual Rate + 3.00% Buffer (floor at 5.50%)
  const marketRate = Math.max(0.1, input.currentMarketRate || 5.84);
  const assessmentRate = Math.max(5.50, marketRate + 3.00);
  const termYears = input.loanTermYears || 30;
  const termMonths = termYears * 12;

  // Present Value formula: Loan = MonthlyPayment * [ (1 - (1 + r)^-n) / r ]
  const monthlyAssessmentRate = assessmentRate / 100 / 12;
  let maxBorrowingCapacity = 0;
  if (monthlyAssessmentRate > 0 && surplusMonthlyCapacity > 0) {
    maxBorrowingCapacity = (surplusMonthlyCapacity * (1 - Math.pow(1 + monthlyAssessmentRate, -termMonths))) / monthlyAssessmentRate;
  }
  maxBorrowingCapacity = Math.round(maxBorrowingCapacity / 1000) * 1000; // Round to nearest $1k

  // Monthly repayment at actual interest rate for max loan
  const monthlyActualRate = marketRate / 100 / 12;
  const factor = Math.pow(1 + monthlyActualRate, termMonths);
  const monthlyRepaymentAtActualRate = factor > 1
    ? (maxBorrowingCapacity * monthlyActualRate * factor) / (factor - 1)
    : 0;

  const maxPropertyPurchasePrice = maxBorrowingCapacity + Math.max(0, depositAvailable);

  return {
    maxBorrowingCapacity,
    maxPropertyPurchasePrice,
    assessmentRate: Number(assessmentRate.toFixed(2)),
    grossMonthlyIncome: Math.round(grossMonthlyIncome),
    netMonthlyIncome: Math.round(netMonthlyIncome),
    monthlyTaxPaid: Math.round(monthlyTaxPaid),
    monthlyHecsPaid: Math.round(monthlyHecsPaid),
    monthlyLivingExpensesUsed: Math.round(monthlyLivingExpensesUsed),
    isHemApplied,
    monthlyDebtCommitments: Math.round(monthlyDebtCommitments),
    creditCardMonthlyAssessed: Math.round(ccAssessed),
    surplusMonthlyCapacity: Math.round(surplusMonthlyCapacity),
    monthlyRepaymentAtActualRate: Math.round(monthlyRepaymentAtActualRate),
  };
}

/**
 * 2024/2025 Australian Stage 3 Resident Tax Rates + 2% Medicare Levy
 */
export function calculateAustralianTax(taxableIncome: number): number {
  if (taxableIncome <= 18200) return 0;

  let baseTax = 0;
  if (taxableIncome <= 45000) {
    baseTax = (taxableIncome - 18200) * 0.16;
  } else if (taxableIncome <= 135000) {
    baseTax = 4288 + (taxableIncome - 45000) * 0.30;
  } else if (taxableIncome <= 190000) {
    baseTax = 31288 + (taxableIncome - 135000) * 0.37;
  } else {
    baseTax = 51638 + (taxableIncome - 190000) * 0.45;
  }

  // 2% Medicare Levy for taxable income over $30,000
  const medicare = taxableIncome > 30000 ? taxableIncome * 0.02 : 0;
  return baseTax + medicare;
}

/**
 * 2024/2025 HECS-HELP Repayment Thresholds
 */
function calculateHecs(income: number): number {
  if (income <= 54435) return 0;
  if (income <= 62850) return income * 0.01;
  if (income <= 66620) return income * 0.02;
  if (income <= 70618) return income * 0.025;
  if (income <= 74855) return income * 0.03;
  if (income <= 79346) return income * 0.035;
  if (income <= 84107) return income * 0.04;
  if (income <= 89154) return income * 0.045;
  if (income <= 94503) return income * 0.05;
  if (income <= 100174) return income * 0.055;
  if (income <= 106185) return income * 0.06;
  if (income <= 112556) return income * 0.065;
  if (income <= 119309) return income * 0.07;
  if (income <= 126467) return income * 0.075;
  if (income <= 134056) return income * 0.08;
  if (income <= 142100) return income * 0.085;
  if (income <= 150626) return income * 0.09;
  if (income <= 159663) return income * 0.095;
  return income * 0.10;
}

/**
 * Baseline Household Expenditure Measure (HEM) Estimator
 */
function getHemBenchmark(maritalStatus: 'single' | 'couple', dependents: number): number {
  let base = maritalStatus === 'couple' ? 2750 : 1800;
  base += Math.max(0, dependents) * 480;
  return base;
}
