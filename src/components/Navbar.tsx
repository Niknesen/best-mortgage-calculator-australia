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
      {/* Top Ticker Bar */}
      <div className="bg-[#0e1626] border-b border-[#1e293b] overflow-hidden py-1.5 text-[11px] font-mono select-none text-white">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-slate-400 font-bold tracking-wider">{item.label}:</span>
              <span className={`font-extrabold ${item.color}`}>{item.val}</span>
              {item.sub && <span className="text-slate-400 text-[10px]">({item.sub})</span>}
              <span className="text-slate-700 ml-4">•</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Exact Brand Logo Seal from suburbs/sydney.html */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleTabClick('home-loan')}>
            <div className="w-8 h-8 rounded-lg border-[1.5px] border-[#0f172a] bg-white flex items-center justify-center text-[#0f172a] font-display font-extrabold text-base shadow-sm">
              B
            </div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#0f172a] font-display">
              Best Brokers <span className="text-[#0071e3]">Australia</span>
            </span>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#f8fafc] p-1 rounded-xl border border-[#e2e8f0]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white text-[#0071e3] shadow-sm border border-[#e2e8f0]'
                      : 'text-[#64748b] hover:text-[#0f172a] hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0071e3]' : 'text-[#94a3b8]'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={onOpenWidgetModal}
              title="Embed this calculator on your website"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#334155] hover:text-[#0f172a] bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Code2 className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>Embed</span>
            </button>
            <button
              onClick={() => onOpenLeadModal('navbar-cta')}
              className="px-4 py-2 rounded-xl text-xs font-extrabold bg-[#0f1e36] hover:bg-[#0a192f] text-white flex items-center gap-1.5 transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99]"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Match Broker</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => onOpenLeadModal('mobile-nav')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0f1e36] text-white flex items-center gap-1"
            >
              Match
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#64748b] hover:text-[#0f172a] hover:bg-[#f8fafc] border border-[#e2e8f0]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#e2e8f0] bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-[#f0f9ff] text-[#0071e3] border border-[#0071e3]/30'
                    : 'text-[#334155] hover:bg-[#f8fafc]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#0071e3]' : 'text-[#94a3b8]'}`} />
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
              className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-[#f8fafc] text-[#334155] border border-[#e2e8f0] flex items-center justify-center gap-1.5"
            >
              <Code2 className="w-3.5 h-3.5 text-[#0071e3]" />
              Embed Widget
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLeadModal('mobile-drawer');
              }}
              className="flex-1 py-2.5 rounded-xl text-xs font-black bg-[#0f1e36] text-white flex items-center justify-center gap-1.5"
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
