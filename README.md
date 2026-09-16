# Best Mortgage Calculator Australia 🇦🇺

An Australian mortgage calculation, 100% offset simulation, and financial modelling engine built with React 19, TypeScript, Tailwind CSS, Recharts, and jsPDF.

Engineered specifically for Australian property buyers, refinancers, and mortgage brokers adhering to APRA serviceability guidelines, 2024/2026 State Budget Stamp Duty legislation, and ASIC Best Interests Duty (BID) compliance.

---

## 🚀 Key Features & Australian Banking Specifics

### 1. 100% Mortgage Offset & Accelerated Repayment Simulator
- **Daily Compounding**: Calculates interest daily on `max(0, Principal - OffsetBalance)` and charges monthly, mirroring real Australian banking schedules (CBA, Westpac, NAB, ANZ, Macquarie).
- **Aussie Accelerated Fortnightly & Weekly**: Supports the classic Australian 26-half-payment strategy (`Monthly ÷ 2`), making 13 months of payments per year to shave 5–8 years off the loan term.
- **Extra Repayments**: Real-time simulation of recurring monthly additions, annual bonuses, or one-off lump-sum deposits.
- **Payoff Trajectory Chart**: Dynamic visual comparison between standard 30-year amortization and accelerated offset curves.

### 2. 8-State Stamp Duty (Transfer Duty) Engine (2024/2026 Rates)
- Real-time calculations across **NSW, VIC, QLD, WA, SA, TAS, ACT, and NT**.
- **First Home Buyer Concessions**:
  - **QLD**: Full exemption up to **$700,000** and concessions to $800,000 (2024 state budget increase).
  - **NSW FHBAS**: 100% exemption up to $800,000; concessions up to $1,000,000.
  - **VIC**: Full exemption up to $600,000; sliding-scale concession to $750,000.
  - **WA, SA, TAS, ACT, NT**: State-specific formulas and First Home Owner Grants (FHOG $10k–$30k).
- **Foreign Buyer Surcharges**: Automatic 7%–8% foreign purchaser duty calculation.
- **Government Fees**: Accurate Transfer of Land registration and Mortgage registration fees by state.

### 3. APRA Borrowing Capacity & Serviceability Engine
- **APRA +3.00% Buffer**: Evaluates borrowing capacity using `Max(Market Rate + 3.00%, 5.50% Floor Rate)`.
- **2024/2025 Stage 3 Australian Income Tax**: Exact progressive tax brackets + 2% Medicare levy.
- **HEM Benchmark Floor**: Household Expenditure Measure baseline based on applicant status (Single/Couple) and dependents.
- **Credit Card Liability**: Assesses credit limits at standard bank rate of 3.8%/month commitment.
- **HECS/HELP Repayments**: Compulsory student debt deductions.

### 4. LMI (Lenders Mortgage Insurance) Estimator
- Sliding scale LMI matrix for Loan-to-Value Ratios (LVR) between 80.01% and 95%.
- Capitalisation toggle (rolling LMI directly into loan principal).
- Federal Home Guarantee Scheme (5% deposit, $0 LMI) support.

### 5. Refinance & Break-Even Calculator
- Calculates monthly savings, annual savings, and exact month-by-month break-even timeline factoring in discharge fees, application fees, settlement fees, and promotional lender cashback.

### 6. Rent vs. Buy 30-Year Wealth Trajectory
- Models the long-term net worth of buying property versus renting and investing the deposit/savings into the share market (ASX 200 / S&P 500).

### 7. Client-Side PDF & CSV Export
- Instant, zero-backend generation of professional **PDF Amortization Reports** and CSV schedules.

### 8. Broker Match & Lead Gen Integration
- Directly connects high-intent loan scenarios to accredited MFAA/FBAA brokers from the **BestBrokers Australia** directory.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 (Apple-Luxe Paper Editorial Design System)
- **Typography**: Space Grotesk (Headings), Plus Jakarta Sans (Body), JetBrains Mono (Financial readouts)
- **Charts**: Recharts (Interactive Area, Bar, and Donut charts)
- **Document Generation**: jsPDF + jspdf-autotable
- **Micro-interactions**: Canvas-Confetti, Lucide-React icons

---

## 📦 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Niknesen/best-mortgage-calculator-australia.git
cd best-mortgage-calculator-australia

# Install dependencies
npm install

# Run development server
npm run dev

# Build production bundle
npm run build
```

---

## 📄 License

MIT © [BestBrokers Australia](https://bestbrokersaustralia.org)
