import React, { useState } from 'react';
import { Calculator, Percent, Sparkles, Building2, RefreshCw, Scale, Code2, PhoneCall, Menu, X } from 'lucide-react';

export type ActiveTab = 'home-loan' | 'stamp-duty' | 'borrowing-power' | 'refinance' | 'rent-vs-buy' | 'compare-rates';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenLeadModal: (source?: string) => void;
  onOpenWidgetModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenLeadModal,
  onOpenWidgetModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tickerItems = [
    { label: 'INDEX', val: '25,419 VERIFIED AUSTRALIAN BROKERS', color: 'text-white' },
    { label: 'STANDARDS', val: 'ASIC BEST INTERESTS DUTY (BID) COMPLIANT', color: 'text-[#5ca701]' },
    { label: 'APRA BUFFER', val: '3.00% SERVICING AUDIT ACTIVE', color: 'text-[#5ca701]' },
    { label: 'RBA CASH RATE', val: '4.35%', sub: 'Hold', color: 'text-amber-400' },
    { label: 'AVG 30-YR VARIABLE', val: '5.84%', sub: '-0.38% Broker Disc.', color: 'text-[#5ca701]' },
    { label: 'SYDNEY MEDIAN', val: '$1,180,000', color: 'text-white' },
  ];

  const navItems = [
    { id: 'home-loan' as ActiveTab, label: 'Mortgage & Offset', icon: Calculator },
    { id: 'stamp-duty' as ActiveTab, label: 'Stamp Duty', icon: Building2 },
    { id: 'borrowing-power' as ActiveTab, label: 'Borrowing Power', icon: Percent },
    { id: 'refinance' as ActiveTab, label: 'Refinance Switch', icon: RefreshCw },
    { id: 'rent-vs-buy' as ActiveTab, label: 'Rent vs Buy', icon: Scale },
    { id: 'compare-rates' as ActiveTab, label: 'Top Rates', icon: Sparkles },
  ];

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#f4f7f9]/90 backdrop-blur-md pb-2 pt-0 transition-all">
      {/* Top Ticker Bar */}
      <div className="bg-[#1b2932] overflow-hidden py-1 text-[10px] font-mono select-none text-white leading-tight mb-3">
        <div className="animate-marquee flex items-center gap-7 whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5ca701] animate-pulse" />
              <span className="text-slate-400 font-semibold tracking-wider">{item.label}:</span>
              <span className={`font-bold ${item.color}`}>{item.val}</span>
              {item.sub && <span className="text-slate-400 text-[9px]">({item.sub})</span>}
              <span className="text-slate-600 ml-3">•</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
        {/* Floating Liven White Nav Pill */}
        <div className="bg-white rounded-full px-5 py-2.5 shadow-[0_14px_40px_rgba(0,0,0,0.08)] border border-[#e6edf2] flex items-center justify-between">
          {/* Brand Logo Seal */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => handleTabClick('home-loan')}>
            <span className="font-extrabold text-xl tracking-tight font-display text-[#5ca701]">
              Best<span className="text-[#1b2932]">Brokers</span>
            </span>
            <span className="bg-[#e0f2fe] text-[#0369a1] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
              AU
            </span>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#f4f7f9] p-1 rounded-full border border-[#e6edf2]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white text-[#5ca701] shadow-sm border border-[#e6edf2]'
                      : 'text-[#486d84] hover:text-[#1b2932] hover:bg-slate-200/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#5ca701]' : 'text-[#94a3b8]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenWidgetModal}
              title="Embed this calculator on your website"
              className="px-3 py-1.5 rounded-full text-xs font-bold text-[#486d84] hover:text-[#1b2932] bg-[#f4f7f9] hover:bg-[#e6edf2] border border-[#e6edf2] flex items-center gap-1.5 transition-all"
            >
              <Code2 className="w-3.5 h-3.5 text-[#5ca701]" />
              <span>Embed</span>
            </button>
            <button
              onClick={() => onOpenLeadModal('navbar-cta')}
              className="px-4 py-2 rounded-full text-xs font-extrabold bg-[#5ca701] hover:bg-[#4e8f00] text-white flex items-center gap-1.5 transition-all shadow-[0_4px_16px_rgba(92,167,1,0.38)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <PhoneCall className="w-3.5 h-3.5 text-white" />
              <span>Match Broker</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-1.5">
            <button
              onClick={() => onOpenLeadModal('mobile-nav')}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#5ca701] text-white flex items-center gap-1"
            >
              Match
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full text-[#486d84] hover:text-[#1b2932] hover:bg-[#f4f7f9] border border-[#e6edf2]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden max-w-[1180px] mx-auto px-4 mt-2">
          <div className="bg-white rounded-3xl p-4 space-y-2 shadow-xl border border-[#e6edf2]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-[#edf8e1] text-[#5ca701] border border-[#5ca701]/30'
                      : 'text-[#486d84] hover:bg-[#f4f7f9]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#5ca701]' : 'text-[#94a3b8]'}`} />
                  {item.label}
                </button>
              );
            })}
            <div className="pt-2 border-t border-[#e6edf2] flex gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWidgetModal();
                }}
                className="flex-1 py-2.5 rounded-full text-xs font-bold bg-[#f4f7f9] text-[#486d84] border border-[#e6edf2] flex items-center justify-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5 text-[#5ca701]" />
                Embed Widget
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLeadModal('mobile-drawer');
                }}
                className="flex-1 py-2.5 rounded-full text-xs font-black bg-[#5ca701] text-white flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <PhoneCall className="w-3.5 h-3.5 text-white" />
                Find Broker
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
