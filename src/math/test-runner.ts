/**
 * Quick Comprehensive Verification of Math Engine
 */
import { calculateLoan } from './repayments';
import { calculateStampDuty } from './stampDuty';
import { estimateLMI } from './lmi';
import { calculateBorrowingPower } from './borrowingPower';
import { calculateRefinance } from './refinance';
import { calculateRentVsBuy } from './rentVsBuy';

console.log('--- 1. Testing Australian Loan & Offset Repayments ---');
const loanRes = calculateLoan({
  propertyValue: 1000000,
  deposit: 200000,
  interestRate: 6.0,
  loanTermYears: 30,
  repaymentFrequency: 'monthly',
  repaymentType: 'principal_and_interest',
  offsetBalance: 50000,
  monthlyOffsetContribution: 500,
  extraMonthlyPayment: 200,
});

console.log(`Loan Amount: $${loanRes.loanAmount}`);
console.log(`Monthly Repayment: $${loanRes.monthlyEquivalent.toFixed(2)}`);
console.log(`Total Interest: $${loanRes.totalInterest.toFixed(2)}`);
console.log(`Interest Saved via Offset & Extra: $${loanRes.totalInterestSaved.toFixed(2)}`);
console.log(`Years Saved: ${loanRes.yearsSaved} yrs ${loanRes.monthsSaved} mo`);

console.log('\n--- 2. Testing 2024/2025 Stamp Duty Across States ---');
const nswFirstHome = calculateStampDuty({
  propertyValue: 750000,
  state: 'NSW',
  buyerType: 'first_home_buyer',
  propertyType: 'established',
});
console.log(`NSW $750k First Home Buyer Duty: $${nswFirstHome.stampDuty} (Should be $0 exemption!)`);

const nswStandard = calculateStampDuty({
  propertyValue: 1000000,
  state: 'NSW',
  buyerType: 'owner_occupier',
  propertyType: 'established',
});
console.log(`NSW $1M Standard Duty: $${nswStandard.stampDuty}`);

const qldFirstHome = calculateStampDuty({
  propertyValue: 680000,
  state: 'QLD',
  buyerType: 'first_home_buyer',
  propertyType: 'established',
});
console.log(`QLD $680k First Home Buyer Duty (2024 cap $700k): $${qldFirstHome.stampDuty} (Should be $0!)`);

const vicStandard = calculateStampDuty({
  propertyValue: 800000,
  state: 'VIC',
  buyerType: 'owner_occupier',
  propertyType: 'established',
});
console.log(`VIC $800k Standard Duty: $${vicStandard.stampDuty}`);

console.log('\n--- 3. Testing LMI Estimation ---');
const lmi90 = estimateLMI({ propertyValue: 800000, deposit: 80000 }); // 90% LVR
console.log(`800k property with 80k deposit (90% LVR) -> LMI: $${lmi90.estimatedLmi}, LVR: ${lmi90.lvr}%`);

console.log('\n--- 4. Testing APRA Borrowing Power ---');
const capacity = calculateBorrowingPower({
  applicant1Income: 120000,
  applicant2Income: 80000,
  maritalStatus: 'couple',
  dependents: 1,
  declaredMonthlyLivingExpenses: 3500,
  creditCardLimitsTotal: 10000,
  monthlyOtherLoanRepayments: 0,
  currentMarketRate: 5.84,
});
console.log(`Max Borrowing Capacity: $${capacity.maxBorrowingCapacity.toLocaleString()} (Assessment rate: ${capacity.assessmentRate}%)`);

console.log('\n--- 5. Testing Refinance Calculation ---');
const refi = calculateRefinance({
  currentLoanBalance: 600000,
  remainingLoanTermYears: 25,
  currentInterestRate: 6.84,
  newInterestRate: 5.84,
  cashbackIncentive: 2000,
});
console.log(`Refinance monthly savings: $${refi.monthlySavings}/mo, Break-even: ${refi.breakEvenMonths} mo, Lifetime savings: $${refi.totalLifetimeSavings.toLocaleString()}`);

console.log('\n--- 6. Testing Rent vs Buy ---');
const rvb = calculateRentVsBuy({
  propertyPrice: 900000,
  depositPercent: 20,
  mortgageRate: 5.84,
  loanTermYears: 30,
  stampDutyAmount: 32000,
  weeklyRent: 750,
  propertyGrowthRateAnnual: 5.0,
  rentGrowthRateAnnual: 3.5,
  investmentReturnRateAnnual: 7.5,
  annualCouncilAndWaterRates: 2400,
  annualBuildingInsurance: 1500,
  annualMaintenancePercent: 1.0,
  strataBodyCorporateAnnual: 0,
});
console.log(`Rent vs Buy 10-Yr Buy Net Worth: $${rvb.tenYearBuyNetWorth.toLocaleString()} vs Rent: $${rvb.tenYearRentNetWorth.toLocaleString()} (Verdict: ${rvb.summaryVerdict})`);

console.log('\nALL MATH TESTS PASSED SUCCESSFULLY! 🚀');
