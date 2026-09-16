/**
 * Australian Stamp Duty (Transfer Duty) & Government Fees Engine (2024/2025 Rates)
 * Supports all 8 States and Territories: NSW, VIC, QLD, WA, SA, TAS, ACT, NT
 */

export type AustralianState = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';
export type BuyerType = 'first_home_buyer' | 'owner_occupier' | 'investor';
export type PropertyType = 'established' | 'new_home' | 'vacant_land';

export interface StampDutyInput {
  propertyValue: number;
  state: AustralianState;
  buyerType: BuyerType;
  propertyType: PropertyType;
  isForeignBuyer?: boolean;
}

export interface StampDutyResult {
  state: AustralianState;
  propertyValue: number;
  stampDuty: number;
  standardDuty: number; // duty without concessions
  concessionAmount: number; // discount or exemption applied
  foreignBuyerSurcharge: number;
  transferFee: number;
  mortgageRegistrationFee: number;
  totalGovernmentFees: number;
  totalUpfrontCost: number; // Property + Fees
  firstHomeGrantAmount: number; // First Home Owner Grant (FHOG) where applicable for new builds
  explanation: string;
}

export function calculateStampDuty(input: StampDutyInput): StampDutyResult {
  const value = Math.max(0, input.propertyValue);
  const { state, buyerType, propertyType, isForeignBuyer = false } = input;

  let standardDuty = 0;
  let stampDuty = 0;
  let foreignSurchargeRate = 0;
  let transferFee = 0;
  let mortgageRegFee = 0;
  let fhog = 0;
  let explanation = '';

  switch (state) {
    case 'NSW': {
      standardDuty = calculateNSWStandardDuty(value);
      transferFee = 165.40;
      mortgageRegFee = 165.40;
      foreignSurchargeRate = 0.08;

      if (buyerType === 'first_home_buyer') {
        if (propertyType === 'vacant_land') {
          if (value <= 350000) {
            stampDuty = 0;
            explanation = 'NSW FHBAS: Full stamp duty exemption on vacant land up to $350k.';
          } else if (value < 450000) {
            const factor = (value - 350000) / 100000;
            stampDuty = standardDuty * factor;
            explanation = 'NSW FHBAS: Concessional stamp duty applied on vacant land between $350k and $450k.';
          } else {
            stampDuty = standardDuty;
          }
        } else {
          // Established or New Home
          if (value <= 800000) {
            stampDuty = 0;
            explanation = 'NSW FHBAS: Full stamp duty exemption for first home buyers up to $800k.';
          } else if (value < 1000000) {
            // Concessional rate: linear phase-in between 800k and 1M
            const factor = (value - 800000) / 200000;
            stampDuty = standardDuty * factor;
            explanation = 'NSW FHBAS: Concessional stamp duty rate for first home buyers between $800k and $1,000,000.';
          } else {
            stampDuty = standardDuty;
          }
        }
        if (propertyType === 'new_home' && value <= 600000) {
          fhog = 10000; // NSW FHOG $10k
        }
      } else {
        stampDuty = standardDuty;
      }
      break;
    }

    case 'VIC': {
      standardDuty = calculateVICStandardDuty(value);
      transferFee = Math.min(3611, 107 + (value / 1000) * 1.5);
      mortgageRegFee = 124.90;
      foreignSurchargeRate = 0.08;

      if (buyerType === 'first_home_buyer') {
        if (value <= 600000) {
          stampDuty = 0;
          explanation = 'VIC First Home Buyer Exemption: 100% duty exemption for homes up to $600k.';
        } else if (value <= 750000) {
          // Sliding scale: Duty = StandardDuty * (Value - 600000) / 150000
          stampDuty = standardDuty * ((value - 600000) / 150000);
          explanation = 'VIC First Home Buyer Concession: Sliding scale discount on homes between $600k and $750k.';
        } else {
          stampDuty = standardDuty;
        }
        if (propertyType === 'new_home' && value <= 750000) {
          fhog = 10000; // VIC FHOG $10k
        }
      } else {
        stampDuty = standardDuty;
      }
      break;
    }

    case 'QLD': {
      transferFee = 224;
      mortgageRegFee = 224;
      foreignSurchargeRate = 0.08;
      const investorDuty = calculateQLDStandardDuty(value);

      if (buyerType === 'first_home_buyer') {
        // 2024 Raised Queensland First Home Concession to $700k exemption!
        if (value <= 700000) {
          stampDuty = 0;
          explanation = 'QLD 2024 First Home Concession: Zero stamp duty on properties up to $700k.';
        } else if (value <= 800000) {
          // Phasing concession
          const homeConcessionDuty = calculateQLDHomeConcessionDuty(value);
          const maxDiscount = calculateQLDHomeConcessionDuty(700000);
          const phaseOutDiscount = maxDiscount * ((800000 - value) / 100000);
          stampDuty = Math.max(0, homeConcessionDuty - phaseOutDiscount);
          explanation = 'QLD First Home Concession: Phasing discount up to $800k.';
        } else {
          stampDuty = calculateQLDHomeConcessionDuty(value);
          explanation = 'QLD Home Concession: Owner occupier discounted rate applied.';
        }
        if (propertyType === 'new_home' && value <= 750000) {
          fhog = 30000; // QLD boosted FHOG to $30k!
        }
      } else if (buyerType === 'owner_occupier') {
        stampDuty = calculateQLDHomeConcessionDuty(value);
        explanation = 'QLD Home Concession: Discounted rate for principal place of residence.';
      } else {
        stampDuty = investorDuty;
        explanation = 'QLD Standard / Investor Transfer Duty rate.';
      }
      standardDuty = investorDuty;
      break;
    }

    case 'WA': {
      standardDuty = calculateWAStandardDuty(value);
      transferFee = 197.60;
      mortgageRegFee = 197.60;
      foreignSurchargeRate = 0.07;

      if (buyerType === 'first_home_buyer') {
        if (value <= 450000) {
          stampDuty = 0;
          explanation = 'WA First Home Owner Rate (FHOR): Full exemption up to $450k.';
        } else if (value <= 600000) {
          // Concessional rate: $15.01 per $100 over $450k
          stampDuty = ((value - 450000) / 100) * 15.01;
          explanation = 'WA FHOR: Concessional rate between $450k and $600k.';
        } else {
          stampDuty = standardDuty;
        }
        if (propertyType === 'new_home' && value <= 750000) {
          fhog = 10000; // WA FHOG $10k
        }
      } else {
        stampDuty = standardDuty;
      }
      break;
    }

    case 'SA': {
      standardDuty = calculateSAStandardDuty(value);
      transferFee = 320;
      mortgageRegFee = 186;
      foreignSurchargeRate = 0.07;

      if (buyerType === 'first_home_buyer' && (propertyType === 'new_home' || propertyType === 'vacant_land')) {
        stampDuty = 0; // SA abolished stamp duty for first home buyers on new homes / land
        explanation = 'SA First Home Buyer Relief: 100% stamp duty exemption on new builds & vacant land with no price cap!';
        fhog = 15000;
      } else {
        stampDuty = standardDuty;
        explanation = 'SA Standard Transfer Duty rates apply.';
      }
      break;
    }

    case 'TAS': {
      standardDuty = calculateTASStandardDuty(value);
      transferFee = 230;
      mortgageRegFee = 155;
      foreignSurchargeRate = 0.08;

      if (buyerType === 'first_home_buyer' && value <= 750000) {
        stampDuty = standardDuty * 0.5; // TAS 50% discount for first home buyers up to $750k
        explanation = 'TAS First Home Buyer Concession: 50% discount on stamp duty for homes up to $750k.';
        if (propertyType === 'new_home') fhog = 30000;
      } else {
        stampDuty = standardDuty;
      }
      break;
    }

    case 'ACT': {
      standardDuty = calculateACTDuty(value, buyerType === 'first_home_buyer');
      transferFee = 464;
      mortgageRegFee = 166;
      foreignSurchargeRate = 0.08;
      stampDuty = standardDuty;
      explanation = 'ACT Progressive Rates (concessions available based on household income thresholds).';
      break;
    }

    case 'NT': {
      standardDuty = calculateNTDuty(value);
      transferFee = 160;
      mortgageRegFee = 160;
      foreignSurchargeRate = 0;
      stampDuty = standardDuty;
      if (buyerType === 'first_home_buyer' && propertyType === 'new_home') {
        fhog = 10000;
      }
      explanation = 'NT Standard stamp duty tiered formula.';
      break;
    }
  }

  const foreignBuyerSurcharge = isForeignBuyer ? value * foreignSurchargeRate : 0;
  const concessionAmount = Math.max(0, standardDuty - stampDuty);
  const totalGovernmentFees = stampDuty + foreignBuyerSurcharge + transferFee + mortgageRegFee;
  const totalUpfrontCost = value + totalGovernmentFees;

  return {
    state,
    propertyValue: value,
    stampDuty: Math.round(stampDuty),
    standardDuty: Math.round(standardDuty),
    concessionAmount: Math.round(concessionAmount),
    foreignBuyerSurcharge: Math.round(foreignBuyerSurcharge),
    transferFee: Math.round(transferFee),
    mortgageRegistrationFee: Math.round(mortgageRegFee),
    totalGovernmentFees: Math.round(totalGovernmentFees),
    totalUpfrontCost: Math.round(totalUpfrontCost),
    firstHomeGrantAmount: fhog,
    explanation: explanation || `${state} standard transfer duty calculated.`,
  };
}

// State Specific Helper Functions

function calculateNSWStandardDuty(v: number): number {
  if (v <= 17000) return (v * 1.25) / 100;
  if (v <= 36000) return 212 + ((v - 17000) * 1.5) / 100;
  if (v <= 93000) return 497 + ((v - 36000) * 1.75) / 100;
  if (v <= 351000) return 1495 + ((v - 93000) * 3.5) / 100;
  if (v <= 1168000) return 10525 + ((v - 351000) * 4.5) / 100;
  if (v <= 3500000) return 47290 + ((v - 1168000) * 5.5) / 100;
  return 175550 + ((v - 3500000) * 7.0) / 100;
}

function calculateVICStandardDuty(v: number): number {
  if (v <= 25000) return (v * 1.4) / 100;
  if (v <= 130000) return 350 + ((v - 25000) * 2.4) / 100;
  if (v <= 960000) return 2870 + ((v - 130000) * 6.0) / 100;
  if (v <= 2000000) return (v * 5.5) / 100;
  return 110000 + ((v - 2000000) * 6.5) / 100;
}

function calculateQLDStandardDuty(v: number): number {
  if (v <= 5000) return 0;
  if (v <= 75000) return ((v - 5000) * 1.5) / 100;
  if (v <= 540000) return 1050 + ((v - 75000) * 3.5) / 100;
  if (v <= 1000000) return 17325 + ((v - 540000) * 4.5) / 100;
  return 38025 + ((v - 1000000) * 5.75) / 100;
}

function calculateQLDHomeConcessionDuty(v: number): number {
  if (v <= 350000) return (v * 1.0) / 100;
  if (v <= 540000) return 3500 + ((v - 350000) * 3.5) / 100;
  if (v <= 1000000) return 10150 + ((v - 540000) * 4.5) / 100;
  return 30850 + ((v - 1000000) * 5.75) / 100;
}

function calculateWAStandardDuty(v: number): number {
  if (v <= 120000) return (v * 1.9) / 100;
  if (v <= 150000) return 2280 + ((v - 120000) * 2.85) / 100;
  if (v <= 360000) return 3135 + ((v - 150000) * 3.8) / 100;
  if (v <= 725000) return 11115 + ((v - 360000) * 4.75) / 100;
  return 28453 + ((v - 725000) * 5.15) / 100;
}

function calculateSAStandardDuty(v: number): number {
  if (v <= 10000) return (v * 1.0) / 100;
  if (v <= 19000) return 100 + ((v - 10000) * 2.0) / 100;
  if (v <= 40000) return 280 + ((v - 19000) * 3.0) / 100;
  if (v <= 100000) return 910 + ((v - 40000) * 4.0) / 100;
  if (v <= 200000) return 3310 + ((v - 100000) * 4.5) / 100;
  if (v <= 250000) return 7810 + ((v - 200000) * 5.0) / 100;
  if (v <= 300000) return 10310 + ((v - 250000) * 5.0) / 100;
  if (v <= 500000) return 12810 + ((v - 300000) * 5.5) / 100;
  return 23810 + ((v - 500000) * 5.5) / 100;
}

function calculateTASStandardDuty(v: number): number {
  if (v <= 3000) return 50;
  if (v <= 25000) return 50 + ((v - 3000) * 1.75) / 100;
  if (v <= 75000) return 435 + ((v - 25000) * 2.25) / 100;
  if (v <= 200000) return 1560 + ((v - 75000) * 3.5) / 100;
  if (v <= 375000) return 5935 + ((v - 200000) * 4.0) / 100;
  if (v <= 725000) return 12935 + ((v - 375000) * 4.25) / 100;
  return 27810 + ((v - 725000) * 4.5) / 100;
}

function calculateACTDuty(v: number, _isFirstHome: boolean): number {
  // ACT progressive rates
  if (v <= 260000) return (v * 0.49) / 100;
  if (v <= 300000) return 1274 + ((v - 260000) * 1.4) / 100;
  if (v <= 500000) return 1834 + ((v - 300000) * 2.42) / 100;
  if (v <= 750000) return 6674 + ((v - 500000) * 3.4) / 100;
  if (v <= 1000000) return 15174 + ((v - 750000) * 4.38) / 100;
  if (v <= 1455000) return 26124 + ((v - 1000000) * 4.57) / 100;
  return (v * 4.54) / 100;
}

function calculateNTDuty(v: number): number {
  if (v <= 525000) {
    const k = 0.06571441;
    const vInThousands = v / 1000;
    return (k * Math.pow(vInThousands, 2) + 15 * vInThousands);
  }
  if (v <= 3000000) return (v * 4.95) / 100;
  if (v <= 5000000) return (v * 5.75) / 100;
  return (v * 5.95) / 100;
}
