/**
 * Australian Mortgage Refinance & Break-Even Engine
 */

export interface RefinanceInput {
  currentLoanBalance: number;
  remainingLoanTermYears: number;
  currentInterestRate: number; // e.g. 6.64%
  newInterestRate: number; // e.g. 5.84%
  dischargeFeeCurrentLender?: number; // approx $350
  applicationFeeNewLender?: number; // approx $0 - $600
  valuationFee?: number; // approx $0 - $300
  settlementFee?: number; // approx $200
  governmentDischargeRegistrationFees?: number; // approx $300 (state specific)
  cashbackIncentive?: number; // e.g. $2,000 promotional cashback
}

export interface RefinanceResult {
  currentMonthlyPayment: number;
  newMonthlyPayment: number;
  monthlySavings: number;
  annualSavings: number;
  totalLifetimeSavings: number;
  totalRefinanceCosts: number;
  netUpfrontCost: number; // Costs - Cashback
  breakEvenMonths: number;
  isRefinanceBeneficial: boolean;
  recommendation: string;
}

export function calculateRefinance(input: RefinanceInput): RefinanceResult {
  const balance = Math.max(0, input.currentLoanBalance);
  const years = Math.max(1, input.remainingLoanTermYears);
  const totalMonths = years * 12;

  const currentRate = Math.max(0, input.currentInterestRate);
  const newRate = Math.max(0, input.newInterestRate);

  const discharge = input.dischargeFeeCurrentLender ?? 350;
  const appFee = input.applicationFeeNewLender ?? 0;
  const valFee = input.valuationFee ?? 0;
  const settleFee = input.settlementFee ?? 200;
  const govFees = input.governmentDischargeRegistrationFees ?? 320;
  const cashback = input.cashbackIncentive ?? 0;

  const totalCosts = discharge + appFee + valFee + settleFee + govFees;
  const netUpfrontCost = Math.max(0, totalCosts - cashback);

  const currentMonthlyPayment = calculateMonthlyPI(balance, currentRate, totalMonths);
  const newMonthlyPayment = calculateMonthlyPI(balance, newRate, totalMonths);

  const monthlySavings = currentMonthlyPayment - newMonthlyPayment;
  const annualSavings = monthlySavings * 12;

  const currentLifetimeInterest = (currentMonthlyPayment * totalMonths) - balance;
  const newLifetimeInterest = (newMonthlyPayment * totalMonths) - balance;
  const totalLifetimeSavings = Math.max(0, currentLifetimeInterest - newLifetimeInterest - netUpfrontCost);

  let breakEvenMonths = 0;
  if (monthlySavings > 0) {
    breakEvenMonths = Math.ceil(netUpfrontCost / monthlySavings);
  }

  const isRefinanceBeneficial = monthlySavings > 0 && (breakEvenMonths <= 24 || netUpfrontCost === 0);

  let recommendation = '';
  if (monthlySavings <= 0) {
    recommendation = 'The new interest rate does not offer monthly savings over your current loan.';
  } else if (netUpfrontCost === 0 || breakEvenMonths <= 6) {
    recommendation = `Highly recommended! You break even almost immediately (${breakEvenMonths} mo) and pocket $${Math.round(annualSavings).toLocaleString()}/year.`;
  } else if (breakEvenMonths <= 24) {
    recommendation = `Beneficial refinance. You recover upfront fees within ${breakEvenMonths} months and save $${Math.round(totalLifetimeSavings).toLocaleString()} over the loan term.`;
  } else {
    recommendation = `Break-even takes ${breakEvenMonths} months (~${(breakEvenMonths / 12).toFixed(1)} years). Consider negotiating with your current bank first.`;
  }

  return {
    currentMonthlyPayment: Math.round(currentMonthlyPayment),
    newMonthlyPayment: Math.round(newMonthlyPayment),
    monthlySavings: Math.round(monthlySavings),
    annualSavings: Math.round(annualSavings),
    totalLifetimeSavings: Math.round(totalLifetimeSavings),
    totalRefinanceCosts: Math.round(totalCosts),
    netUpfrontCost: Math.round(netUpfrontCost),
    breakEvenMonths,
    isRefinanceBeneficial,
    recommendation,
  };
}

function calculateMonthlyPI(p: number, rPercent: number, nMonths: number): number {
  if (p <= 0 || nMonths <= 0) return 0;
  if (rPercent <= 0) return p / nMonths;
  const r = rPercent / 100 / 12;
  const f = Math.pow(1 + r, nMonths);
  return (p * r * f) / (f - 1);
}
