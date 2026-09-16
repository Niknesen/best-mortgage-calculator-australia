export interface LoanProduct {
  id: string;
  lenderName: string;
  lenderLogo: string;
  productName: string;
  interestRate: number; // e.g. 5.74%
  comparisonRate: number; // e.g. 5.76%
  repaymentMonthly: number; // calculated for $600k 30yr baseline
  features: string[];
  productType: 'Variable' | 'Fixed 1-Yr' | 'Fixed 2-Yr' | 'Fixed 3-Yr';
  hasOffset: boolean;
  hasRedraw: boolean;
  minDepositPercent: number;
  highlightBadge?: string;
  ctaText: string; // Realistic dream outcome CTA
  goalSubtitle: string;
  enquireUrl: string;
}

export const TOP_AU_LENDERS: LoanProduct[] = [
  {
    id: 'tiimely-own',
    lenderName: 'Tiimely Home (Bendigo & Adelaide Bank)',
    lenderLogo: '🏦',
    productName: 'Live-in Variable Rate (P&I)',
    interestRate: 5.74,
    comparisonRate: 5.76,
    repaymentMonthly: 3497,
    features: ['Instant Online Approval', '100% Offset Available', 'Zero Monthly Fees', 'Free Redraw'],
    productType: 'Variable',
    hasOffset: true,
    hasRedraw: true,
    minDepositPercent: 10,
    highlightBadge: 'Lowest Variable Rate',
    ctaText: 'Unlock 5.74% Wholesale Rate',
    goalSubtitle: 'Access direct lender discounting with a broker',
    enquireUrl: 'http://localhost:8080/google-omni.html?lender=tiimely&rate=5.74'
  },
  {
    id: 'unloan-cba',
    lenderName: 'Unloan (Powered by CBA)',
    lenderLogo: '🟡',
    productName: 'Direct Owner Occupier Variable',
    interestRate: 5.79,
    comparisonRate: 5.70,
    repaymentMonthly: 3517,
    features: ['0.01% Discount every year', 'Backed by CBA', '$0 Application Fee', 'No Exit Fees'],
    productType: 'Variable',
    hasOffset: false,
    hasRedraw: true,
    minDepositPercent: 20,
    highlightBadge: 'Annual Loyalty Discount',
    ctaText: 'Setup Annual Loyalty Discount',
    goalSubtitle: 'CBA security with automatic annual rate reductions',
    enquireUrl: 'http://localhost:8080/google-omni.html?lender=unloan&rate=5.79'
  },
  {
    id: 'macquarie-offset',
    lenderName: 'Macquarie Bank',
    lenderLogo: '⚪',
    productName: 'Basic Home Loan with Offset',
    interestRate: 5.84,
    comparisonRate: 5.86,
    repaymentMonthly: 3537,
    features: ['Up to 10 Offset Accounts', 'Award-winning App', 'Fast Broker Approval', 'No Ongoing Fees'],
    productType: 'Variable',
    hasOffset: true,
    hasRedraw: true,
    minDepositPercent: 10,
    highlightBadge: 'Best Offset Feature (10 Accounts)',
    ctaText: 'Setup 10 Offset Accounts ($0 Fee)',
    goalSubtitle: 'Slash lifetime interest with multiple savings accounts',
    enquireUrl: 'http://localhost:8080/google-omni.html?lender=macquarie&rate=5.84'
  },
  {
    id: 'athena-celebrate',
    lenderName: 'Athena Home Loans',
    lenderLogo: '⚡',
    productName: 'Straight Up Variable (LVR < 60%)',
    interestRate: 5.89,
    comparisonRate: 5.84,
    repaymentMonthly: 3557,
    features: ['Automatic Rate Drops as LVR drops', 'No Application/Account Fees', 'Free Redraw', 'Top Broker Network'],
    productType: 'Variable',
    hasOffset: true,
    hasRedraw: true,
    minDepositPercent: 15,
    highlightBadge: 'Automatic Rate Drop',
    ctaText: 'Activate Auto Rate Drop Loan',
    goalSubtitle: 'Your rate drops automatically as you pay down your loan',
    enquireUrl: 'http://localhost:8080/google-omni.html?lender=athena&rate=5.89'
  },
  {
    id: 'anz-simplicity',
    lenderName: 'ANZ Bank',
    lenderLogo: '🔵',
    productName: 'ANZ Simplicity PLUS Special',
    interestRate: 6.04,
    comparisonRate: 6.08,
    repaymentMonthly: 3618,
    features: ['Big 4 Bank Security', 'Branch Network Access', 'Extra Repayments Allowed', 'Redraw Facility'],
    productType: 'Variable',
    hasOffset: false,
    hasRedraw: true,
    minDepositPercent: 5,
    highlightBadge: 'Big 4 Bank Special',
    ctaText: 'Access Big 4 Bank Special Rate',
    goalSubtitle: 'Major bank security negotiated at $0 broker fee',
    enquireUrl: 'http://localhost:8080/google-omni.html?lender=anz&rate=6.04'
  }
];
