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
    { label: 'RBA CASH RATE', val: '4.35%', sub: 'Hold', color: 'text-emerald-400' },
    { label: 'AVG 30-YR VARIABLE', val: '5.84%', sub: '-0.38% Broker Disc.', color: 'text-[#38bdf8]' },
    { label: 'SYDNEY CBD MEDIAN', val: '$1,180,000', sub: '+0.4% MoM', color: 'text-white' },
    { label: 'MELBOURNE MEDIAN', val: '$780,000', sub: '+0.1% MoM', color: 'text-white' },
    { label: 'BRISBANE MEDIAN', val: '$850,000', sub: '+0.9% MoM', color: 'text-emerald-400' },
    { label: 'PERTH MEDIAN', val: '$730,000', sub: '+1.4% MoM', color: 'text-emerald-400' },
    { label: 'APRA SERVICEABILITY BUFFER', val: '+3.00%', sub: 'Floor 5.50%', color: 'text-amber-400' },
  ];

  const navItems = [
    { id: 'home-loan' as ActiveTab, label: 'Mortgage & Offset', icon: Calculator },
    { id: 'stamp-duty' as ActiveTab, label: 'Stamp Duty (8 States)', icon: Building2 },
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
    <header className="sticky top-0 z-40 bg-[#0e1626] border-b border-[#1e293b] text-white shadow-xl">
      {/* Continuous Live Market Ticker */}
      <div className="bg-[#090e1a] border-b border-[#1e293b]/80 overflow-hidden py-1.5 text-[11px] font-mono select-none">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-slate-400 font-bold tracking-wider">{item.label}:</span>
              <span className={`font-extrabold ${item.color}`}>{item.val}</span>
              <span className="text-slate-400 text-[10px]">({item.sub})</span>
              <span className="text-slate-700 ml-4">/</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleTabClick('home-loan')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0071e3] to-[#047857] flex items-center justify-center shadow-md shadow-[#0071e3]/30 text-white font-black text-base font-display">
              AU
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white font-display">
                  Best<span className="text-[#0071e3]">MortgageCalculator</span>
                </span>
                <span className="bg-[#0071e3]/15 border border-[#0071e3]/40 text-[#38bdf8] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  AUSTRALIA
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans hidden sm:block">Powered by BestBrokers Australia</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-[#141d33] p-1 rounded-xl border border-[#1e293b]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#0071e3] text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-[#1e293b]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
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
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-[#141d33] hover:bg-[#1e293b] border border-[#1e293b] flex items-center gap-1.5 transition-all"
            >
              <Code2 className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Embed</span>
            </button>
            <button
              onClick={() => onOpenLeadModal('navbar-cta')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0071e3] hover:bg-[#0077ed] text-white flex items-center gap-1.5 transition-all shadow-md shadow-[#0071e3]/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Match Broker</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => onOpenLeadModal('mobile-nav')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0071e3] text-white flex items-center gap-1"
            >
              Match
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#141d33] border border-[#1e293b]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1e293b] bg-[#090e1a] px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-[#0071e3] text-white'
                    : 'text-slate-300 hover:bg-[#141d33]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-[#1e293b] flex gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWidgetModal();
              }}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-[#141d33] text-slate-300 border border-[#1e293b] flex items-center justify-center gap-1.5"
            >
              <Code2 className="w-3.5 h-3.5 text-[#38bdf8]" />
              Embed Widget
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLeadModal('mobile-drawer');
              }}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-[#0071e3] text-white flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Find Broker
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
