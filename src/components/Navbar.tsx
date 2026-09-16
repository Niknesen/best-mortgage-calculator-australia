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
    { label: 'STANDARDS', val: 'ASIC BEST INTERESTS DUTY (BID) COMPLIANT', color: 'text-[#38bdf8]' },
    { label: 'APRA BUFFER', val: '3.00% SERVICING AUDIT ACTIVE', color: 'text-[#34d399]' },
    { label: 'RBA CASH RATE', val: '4.35%', sub: 'Hold', color: 'text-amber-400' },
    { label: 'AVG 30-YR VARIABLE', val: '5.84%', sub: '-0.38% Broker Disc.', color: 'text-emerald-400' },
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e2e8f0] shadow-sm">
      {/* Super Slim Ticker Bar */}
      <div className="bg-[#0e1626] border-b border-[#1e293b] overflow-hidden py-1 text-[10px] font-mono select-none text-white leading-tight">
        <div className="animate-marquee flex items-center gap-7 whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-slate-400 font-semibold tracking-wider">{item.label}:</span>
              <span className={`font-bold ${item.color}`}>{item.val}</span>
              {item.sub && <span className="text-slate-400 text-[9px]">({item.sub})</span>}
              <span className="text-slate-700 ml-3">•</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Slim Header: 48px (h-12) */}
        <div className="flex items-center justify-between h-12">
          {/* Brand Logo Seal */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => handleTabClick('home-loan')}>
            <div className="w-6 h-6 rounded-md border-[1.5px] border-[#0f172a] bg-white flex items-center justify-center text-[#0f172a] font-display font-extrabold text-xs shadow-xs">
              B
            </div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#0f172a] font-display">
              Best Brokers <span className="text-[#0071e3]">Australia</span>
            </span>
          </div>

          {/* Slim Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-0.5 bg-[#f8fafc] p-0.5 rounded-lg border border-[#e2e8f0]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                    isActive
                      ? 'bg-white text-[#0071e3] shadow-xs border border-[#e2e8f0]'
                      : 'text-[#64748b] hover:text-[#0f172a] hover:bg-slate-200/40'
                  }`}
                >
                  <Icon className={`w-3 h-3 ${isActive ? 'text-[#0071e3]' : 'text-[#94a3b8]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Slim Action CTAs */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenWidgetModal}
              title="Embed this calculator on your website"
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#334155] hover:text-[#0f172a] bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] flex items-center gap-1 transition-all shadow-2xs"
            >
              <Code2 className="w-3 h-3 text-[#0071e3]" />
              <span>Embed</span>
            </button>
            <button
              onClick={() => onOpenLeadModal('navbar-cta')}
              className="px-3 py-1 rounded-lg text-[11px] font-extrabold bg-[#0f1e36] hover:bg-[#0a192f] text-white flex items-center gap-1 transition-all shadow-xs hover:scale-[1.01] active:scale-[0.99]"
            >
              <PhoneCall className="w-3 h-3 text-[#38bdf8]" />
              <span>Match Broker</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-1.5">
            <button
              onClick={() => onOpenLeadModal('mobile-nav')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#0f1e36] text-white flex items-center gap-1"
            >
              Match
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 rounded-lg text-[#64748b] hover:text-[#0f172a] hover:bg-[#f8fafc] border border-[#e2e8f0]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#e2e8f0] bg-white px-4 pt-2.5 pb-5 space-y-1.5 shadow-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-[#f0f9ff] text-[#0071e3] border border-[#0071e3]/30'
                    : 'text-[#334155] hover:bg-[#f8fafc]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0071e3]' : 'text-[#94a3b8]'}`} />
                {item.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-[#e2e8f0] flex gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWidgetModal();
              }}
              className="flex-1 py-2 rounded-lg text-xs font-bold bg-[#f8fafc] text-[#334155] border border-[#e2e8f0] flex items-center justify-center gap-1.5"
            >
              <Code2 className="w-3.5 h-3.5 text-[#0071e3]" />
              Embed Widget
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLeadModal('mobile-drawer');
              }}
              className="flex-1 py-2 rounded-lg text-xs font-black bg-[#0f1e36] text-white flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#38bdf8]" />
              Find Broker
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
