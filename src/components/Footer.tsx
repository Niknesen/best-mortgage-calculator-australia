import React from 'react';
import { Heart, ExternalLink } from 'lucide-react';
import type { ActiveTab } from './Navbar';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenWidgetModal: () => void;
  onOpenLeadModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenWidgetModal, onOpenLeadModal }) => {
  return (
    <footer className="bg-[#0e1626] text-[#94a3b8] text-xs border-t border-[#1e293b] pt-12 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0071e3] to-[#047857] flex items-center justify-center text-white font-black text-xs font-display">
                AU
              </div>
              <span className="font-extrabold text-white text-base font-display">
                Best<span className="text-[#0071e3]">Brokers</span> Australia
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Australia's premier home loan repayment and financial modelling engine. Built for Australian homebuyers, refinancers, and investors.
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              National Mortgage Broker Network & Directory.
            </p>
          </div>

          {/* Calculators Nav */}
          <div className="space-y-2">
            <h4 className="font-mono font-bold text-white uppercase tracking-wider text-[11px]">Calculators</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => setActiveTab('home-loan')} className="hover:text-[#38bdf8] transition-colors">
                  Mortgage & Offset Calculator
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('stamp-duty')} className="hover:text-[#38bdf8] transition-colors">
                  Stamp Duty Calculator (8 States)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('borrowing-power')} className="hover:text-[#38bdf8] transition-colors">
                  APRA Borrowing Power Calculator
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('refinance')} className="hover:text-[#38bdf8] transition-colors">
                  Refinance & Break-Even Calculator
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('rent-vs-buy')} className="hover:text-[#38bdf8] transition-colors">
                  Rent vs Buy Australia Calculator
                </button>
              </li>
            </ul>
          </div>

          {/* Broker Directory Hubs */}
          <div className="space-y-2">
            <h4 className="font-mono font-bold text-white uppercase tracking-wider text-[11px]">Broker Directory</h4>
            <ul className="space-y-1.5">
              <li>
                <a href="#sydney-brokers" onClick={onOpenLeadModal} className="hover:text-[#10b981] transition-colors">
                  Mortgage Brokers Sydney NSW
                </a>
              </li>
              <li>
                <a href="#melbourne-brokers" onClick={onOpenLeadModal} className="hover:text-[#10b981] transition-colors">
                  Mortgage Brokers Melbourne VIC
                </a>
              </li>
              <li>
                <a href="#brisbane-brokers" onClick={onOpenLeadModal} className="hover:text-[#10b981] transition-colors">
                  Mortgage Brokers Brisbane QLD
                </a>
              </li>
              <li>
                <a href="#perth-brokers" onClick={onOpenLeadModal} className="hover:text-[#10b981] transition-colors">
                  Mortgage Brokers Perth WA
                </a>
              </li>
              <li>
                <a href="#adelaide-brokers" onClick={onOpenLeadModal} className="hover:text-[#10b981] transition-colors">
                  Mortgage Brokers Adelaide SA
                </a>
              </li>
            </ul>
          </div>

          {/* Embed & Free Tools */}
          <div className="space-y-2">
            <h4 className="font-mono font-bold text-white uppercase tracking-wider text-[11px]">For Real Estate Sites</h4>
            <p className="text-[11px] text-slate-400">
              Embed our Australian mortgage calculators on your real estate blog or agency site for free.
            </p>
            <button
              onClick={onOpenWidgetModal}
              className="px-3 py-2 rounded-xl bg-[#141d33] hover:bg-[#1b2642] text-white font-bold text-xs border border-[#1e293b] transition-colors flex items-center gap-1.5"
            >
              <span>Get Free Embed Widget</span>
              <ExternalLink className="w-3 h-3 text-[#38bdf8]" />
            </button>
          </div>
        </div>

        {/* Legal & Regulatory Disclaimers */}
        <div className="pt-8 border-t border-[#1e293b] text-[11px] text-slate-500 space-y-3 leading-relaxed">
          <p>
            <strong>General Advice Warning:</strong> The information and calculations provided on this website are for educational and illustrative purposes only and do not constitute personal financial, taxation, or credit advice under the National Consumer Credit Protection Act 2009 (NCCP). Loan approvals and interest rates are subject to individual lender credit criteria, APRA serviceability guidelines, and valuation assessment.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 font-mono text-[11px]">
            <p>© {new Date().getFullYear()} BestBrokers Australia. All Rights Reserved.</p>
            <p className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
              <span>for Australian Property Buyers</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
