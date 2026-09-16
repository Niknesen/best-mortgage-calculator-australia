/**
 * Australian Lenders Mortgage Insurance (LMI) Estimator
 * 
 * LMI is required by Australian lenders when the Loan to Value Ratio (LVR) > 80%
 * (i.e. deposit is less than 20% of property purchase price).
 * LMI can be paid upfront or capitalised into the loan balance.
 */

export interface LMIInput {
  propertyValue: number;
  deposit: number;
  isFirstHomeBuyer?: boolean;
  eligibleForFirstHomeGuarantee?: boolean; // Home Guarantee Scheme (5% deposit, 0 LMI)
}

export interface LMIResult {
  lvr: number;
  loanAmount: number;
  isLmiRequired: boolean;
  estimatedLmi: number;
  canCapitalise: boolean;
  loanAmountWithLmi: number;
  explanation: string;
}

export function estimateLMI(input: LMIInput): LMIResult {
  const propertyValue = Math.max(0, input.propertyValue);
  const deposit = Math.max(0, input.deposit);
  const loanAmount = Math.max(0, propertyValue - deposit);

  if (propertyValue <= 0 || loanAmount <= 0) {
    return {
      lvr: 0,
      loanAmount: 0,
      isLmiRequired: false,
      estimatedLmi: 0,
      canCapitalise: true,
      loanAmountWithLmi: 0,
      explanation: 'Please enter property value and deposit.',
    };
  }

  const lvr = (loanAmount / propertyValue) * 100;

  // Check First Home Guarantee Scheme (5% deposit, $0 LMI)
  if (input.eligibleForFirstHomeGuarantee && lvr <= 95 && lvr > 80) {
    return {
      lvr: Number(lvr.toFixed(1)),
      loanAmount,
      isLmiRequired: false,
      estimatedLmi: 0,
      canCapitalise: false,
      loanAmountWithLmi: loanAmount,
      explanation: 'Eligible for Federal First Home Guarantee (HGS): $0 LMI with as little as 5% deposit!',
    };
  }

  if (lvr <= 80) {
    return {
      lvr: Number(lvr.toFixed(1)),
      loanAmount,
      isLmiRequired: false,
      estimatedLmi: 0,
      canCapitalise: false,
      loanAmountWithLmi: loanAmount,
      explanation: 'No Lenders Mortgage Insurance (LMI) required because deposit is 20% or higher (LVR ≤ 80%).',
    };
  }

  // Australian LMI Rate Matrix based on Helia (Genworth) / QBE average tables
  let ratePercent = 0;
  if (lvr <= 82) {
    ratePercent = 0.85;
  } else if (lvr <= 85) {
    ratePercent = 1.35;
  } else if (lvr <= 88) {
    ratePercent = 1.95;
  } else if (lvr <= 90) {
    ratePercent = 2.45;
  } else if (lvr <= 92) {
    ratePercent = 3.35;
  } else if (lvr <= 95) {
    ratePercent = 4.25;
  } else {
    ratePercent = 5.50; // Over 95% rarely approved without guarantor
  }

  // Adjust slightly for higher loan quantum tiers (> $600k / > $1M)
  if (loanAmount > 1000000) {
    ratePercent += 0.40;
  } else if (loanAmount > 600000) {
    ratePercent += 0.20;
  }

  const estimatedLmi = Math.round((loanAmount * ratePercent) / 100);
  const loanAmountWithLmi = loanAmount + estimatedLmi;

  return {
    lvr: Number(lvr.toFixed(1)),
    loanAmount,
    isLmiRequired: true,
    estimatedLmi,
    canCapitalise: lvr <= 95, // Most banks permit capitalising up to 98% Max LVR
    loanAmountWithLmi,
    explanation: `Estimated LMI is ~$${estimatedLmi.toLocaleString()} based on ${lvr.toFixed(1)}% LVR. This can be paid upfront or rolled into your loan.`,
  };
}
