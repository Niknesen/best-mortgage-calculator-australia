/**
 * Australian Rent vs Buy Wealth Trajectory Calculator
 */

export interface RentVsBuyInput {
  propertyPrice: number;
  depositPercent: number; // e.g. 20%
  mortgageRate: number; // e.g. 5.84%
  loanTermYears: number; // 30
  stampDutyAmount: number; // e.g. $30,000
  weeklyRent: number; // e.g. $750/wk
  propertyGrowthRateAnnual: number; // e.g. 5.0%
  rentGrowthRateAnnual: number; // e.g. 3.5%
  investmentReturnRateAnnual: number; // e.g. 7.5% (ASX 200 / ETF index)
  annualCouncilAndWaterRates: number; // e.g. $2,400
  annualBuildingInsurance: number; // e.g. $1,500
  annualMaintenancePercent: number; // e.g. 1.0% of property value
  strataBodyCorporateAnnual: number; // e.g. $0 for house, $3,500 for apartment
}

export interface YearComparison {
  year: number;
  buyNetWorth: number;
  rentNetWorth: number;
  propertyValue: number;
  remainingLoan: number;
  investedRentFund: number;
  totalCostBuyingCumulative: number;
  totalCostRentingCumulative: number;
}

export interface RentVsBuyResult {
  tenYearBuyNetWorth: number;
  tenYearRentNetWorth: number;
  thirtyYearBuyNetWorth: number;
  thirtyYearRentNetWorth: number;
  crossOverYear: number | null; // Year buying overtakes renting
  yearlyProjections: YearComparison[];
  summaryVerdict: string;
}

export function calculateRentVsBuy(input: RentVsBuyInput): RentVsBuyResult {
  const price = Math.max(0, input.propertyPrice);
  const deposit = (price * Math.max(0, input.depositPercent)) / 100;
  const loanPrincipal = Math.max(0, price - deposit);
  const stampDuty = Math.max(0, input.stampDutyAmount);
  const totalUpfrontBuying = deposit + stampDuty;

  const rate = Math.max(0, input.mortgageRate);
  const termYears = Math.max(1, input.loanTermYears || 30);
  const totalMonths = termYears * 12;

  // Monthly mortgage payment
  const monthlyPI = calculateMonthlyPI(loanPrincipal, rate, totalMonths);
  const annualMortgagePayment = monthlyPI * 12;

  let propertyVal = price;
  let remainingLoan = loanPrincipal;
  let rentFund = totalUpfrontBuying; // Renter starts with deposit + stamp duty in stock market!
  let currentWeeklyRent = Math.max(0, input.weeklyRent);

  let totalCostBuying = stampDuty;
  let totalCostRenting = 0;

  const yearlyProjections: YearComparison[] = [];
  let crossOverYear: number | null = null;

  for (let year = 1; year <= 30; year++) {
    // 1. Property appreciation
    propertyVal *= 1 + input.propertyGrowthRateAnnual / 100;

    // 2. Loan principal reduction
    let yearInterest = 0;
    let yearPrincipal = 0;
    for (let m = 1; m <= 12; m++) {
      if (remainingLoan > 0) {
        const mRate = rate / 100 / 12;
        const intPayment = remainingLoan * mRate;
        const princPayment = Math.min(remainingLoan, monthlyPI - intPayment);
        yearInterest += intPayment;
        yearPrincipal += princPayment;
        remainingLoan = Math.max(0, remainingLoan - princPayment);
      }
    }

    // 3. Ownership ongoing costs
    const annualMaintenance = (propertyVal * (input.annualMaintenancePercent || 1.0)) / 100;
    const ownershipOutgoings = input.annualCouncilAndWaterRates + input.annualBuildingInsurance + input.strataBodyCorporateAnnual + annualMaintenance;
    const totalYearCostBuying = (remainingLoan > 0 ? annualMortgagePayment : 0) + ownershipOutgoings;
    totalCostBuying += totalYearCostBuying;

    // 4. Renting costs
    const annualRent = currentWeeklyRent * 52;
    totalCostRenting += annualRent;

    // 5. Investment Fund growth (ASX ETF returns)
    rentFund *= 1 + input.investmentReturnRateAnnual / 100;

    // Cash flow difference: If buying cost more than renting, renter invests the difference!
    const cashFlowDiff = totalYearCostBuying - annualRent;
    if (cashFlowDiff > 0) {
      rentFund += cashFlowDiff; // Renter invests the surplus savings
    } else {
      rentFund -= Math.abs(cashFlowDiff); // Renter pulls from fund if rent > buying cost
    }

    // Rent increases for next year
    currentWeeklyRent *= 1 + input.rentGrowthRateAnnual / 100;

    // Net worths:
    // Buying net worth = Property Value - Remaining Loan - 2.5% selling fees
    const buyNetWorth = Math.max(0, propertyVal * 0.975 - remainingLoan);
    const rentNetWorth = Math.max(0, rentFund);

    if (crossOverYear === null && buyNetWorth > rentNetWorth) {
      crossOverYear = year;
    }

    yearlyProjections.push({
      year,
      buyNetWorth: Math.round(buyNetWorth),
      rentNetWorth: Math.round(rentNetWorth),
      propertyValue: Math.round(propertyVal),
      remainingLoan: Math.round(remainingLoan),
      investedRentFund: Math.round(rentFund),
      totalCostBuyingCumulative: Math.round(totalCostBuying),
      totalCostRentingCumulative: Math.round(totalCostRenting),
    });
  }

  const y10 = yearlyProjections[9];
  const y30 = yearlyProjections[29];

  let summaryVerdict = '';
  if (crossOverYear) {
    summaryVerdict = `Buying pulls ahead of renting in Year ${crossOverYear}. By Year 10, buying generates $${((y10.buyNetWorth - y10.rentNetWorth) / 1000).toFixed(0)}k more equity.`;
  } else {
    summaryVerdict = 'Investing your deposit in the share market while renting outperforms buying under these market parameters.';
  }

  return {
    tenYearBuyNetWorth: y10.buyNetWorth,
    tenYearRentNetWorth: y10.rentNetWorth,
    thirtyYearBuyNetWorth: y30.buyNetWorth,
    thirtyYearRentNetWorth: y30.rentNetWorth,
    crossOverYear,
    yearlyProjections,
    summaryVerdict,
  };
}

function calculateMonthlyPI(p: number, rPercent: number, nMonths: number): number {
  if (p <= 0 || nMonths <= 0) return 0;
  if (rPercent <= 0) return p / nMonths;
  const r = rPercent / 100 / 12;
  const f = Math.pow(1 + r, nMonths);
  return (p * r * f) / (f - 1);
}
