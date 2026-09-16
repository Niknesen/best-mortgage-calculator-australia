import React from 'react';
import { TOP_AU_LENDERS } from '../data/rates';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

interface RateComparisonTableProps {
  onOpenLeadModal: (details?: any) => void;
}

export const RateComparisonTable: React.FC<RateComparisonTableProps> = ({ onOpenLeadModal }) => {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0f9ff] border border-[#0071e3]/25 text-[#0071e3] text-xs font-mono font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
          <span>Real-time Australian Home Loan Rates</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0f172a] font-display tracking-tight">
          Compare Top Australian <span className="text-[#0071e3]">Mortgage Rates</span>
        </h1>
        <p className="text-[#64748b] text-sm sm:text-base leading-relaxed">
          Compare the lowest variable and fixed rates across top banks, digital lenders, and accredited broker networks.
        </p>
      </div>

      {/* Lenders Table */}
      <div className="bg-white rounded-3xl shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05),0_2px_6px_-1px_rgba(15,23,42,0.03)] border border-[#e2e8f0] overflow-hidden">
        <div className="p-5 sm:p-7 bg-[#0e1626] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold font-display text-white">Featured Home Loan Products</h2>
            <p className="text-xs text-slate-400 font-mono">Owner-Occupier Principal & Interest • $600k Loan Example</p>
          </div>
          <button
            onClick={() => onOpenLeadModal({ type: 'rate_comparison' })}
            className="px-4 py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-md shadow-[#0071e3]/30"
          >
            <span>Have a Broker Negotiate For You</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-[#f1f5f9]">
          {TOP_AU_LENDERS.map((lender) => (
            <div
              key={lender.id}
              className="p-5 sm:p-6 hover:bg-[#f8fafc] transition-colors grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
            >
              {/* Col 1: Lender Info (4 cols) */}
              <div className="md:col-span-4 space-y-1.5">
                {lender.highlightBadge && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#ecfdf5] text-[#047857] border border-[#059669]/30">
                    {lender.highlightBadge}
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{lender.lenderLogo}</span>
                  <div>
                    <h3 className="font-bold text-[#0f172a] text-base font-display">{lender.lenderName}</h3>
                    <p className="text-xs text-[#64748b]">{lender.productName}</p>
                  </div>
                </div>
              </div>

              {/* Col 2: Rate & Comparison Rate (3 cols) */}
              <div className="md:col-span-3 flex items-baseline gap-4 font-mono">
                <div>
                  <span className="text-xs text-[#94a3b8] font-bold block">Interest Rate</span>
                  <span className="text-2xl font-black text-[#0071e3]">{lender.interestRate.toFixed(2)}%</span>
                  <span className="text-[10px] text-[#64748b] block font-medium">p.a. variable</span>
                </div>
                <div>
                  <span className="text-xs text-[#94a3b8] font-bold block">Comparison</span>
                  <span className="text-sm font-bold text-[#334155]">{lender.comparisonRate.toFixed(2)}%</span>
                  <span className="text-[10px] text-[#64748b] block font-medium">p.a.</span>
                </div>
              </div>

              {/* Col 3: Key Features (3 cols) */}
              <div className="md:col-span-3 space-y-1 text-xs">
                {lender.features.slice(0, 2).map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[#334155]">
                    <Check className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
                {lender.hasOffset && (
                  <span className="inline-block text-[10px] font-mono font-bold text-[#0071e3] bg-[#f0f9ff] border border-[#0071e3]/20 px-2 py-0.5 rounded-full">
                    100% Offset Included
                  </span>
                )}
              </div>

              {/* Col 4: Action Button (2 cols) */}
              <div className="md:col-span-2 flex flex-col gap-2">
                <button
                  onClick={() => onOpenLeadModal({ lender: lender.lenderName, rate: lender.interestRate })}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#0f1e36] hover:bg-[#0a192f] text-white text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
                >
                  <span>Enquire Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] text-center text-[#94a3b8] font-mono">Min {lender.minDepositPercent}% deposit</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimers */}
      <div className="p-4 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] text-[#64748b] text-xs leading-relaxed">
        <p className="font-bold text-[#0f172a] mb-1">Comparison Rate Warning:</p>
        <p>
          The Comparison Rate is based on a secured loan of $150,000 over 25 years. WARNING: This comparison rate applies only to the example or examples given. Different amounts and terms will result in different comparison rates. Costs such as redraw fees or early repayment fees, and cost savings such as fee waivers, are not included in the comparison rate but may influence the cost of the loan.
        </p>
      </div>
    </div>
  );
};
