import React, { useState } from 'react';
import { FEATURED_BROKERS, type Broker } from '../data/brokers';
import {
  MapPin,
  Star,
  ShieldCheck,
  PhoneCall,
  Search
} from 'lucide-react';

interface BrokerMatcherProps {
  onOpenLeadModal: (broker?: Broker) => void;
}

export const BrokerMatcher: React.FC<BrokerMatcherProps> = ({ onOpenLeadModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState<string>('ALL');

  const filteredBrokers = FEATURED_BROKERS.filter((broker) => {
    const matchesSearch =
      broker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      broker.suburb.toLowerCase().includes(searchTerm.toLowerCase()) ||
      broker.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      broker.postcode.includes(searchTerm);
    const matchesState = selectedState === 'ALL' || broker.state === selectedState;
    return matchesSearch && matchesState;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05),0_2px_6px_-1px_rgba(15,23,42,0.03)] border border-[#e2e8f0] space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecfdf5] border border-[#059669]/30 text-[#047857] text-xs font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
            <span>Over 71% of Aussie Mortgages Settle via Brokers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0f172a] font-display">
            Find an Accredited Mortgage Broker Near You
          </h2>
          <p className="text-[#64748b] text-xs sm:text-sm">
            Top-rated Australian brokers negotiate with 30+ lenders at $0 fee to you under ASIC Best Interests Duty (BID).
          </p>
        </div>

        {/* Search & State Filter */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search suburb, city, postcode..."
              className="pl-9 pr-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-xl text-xs text-[#0f172a] placeholder-[#94a3b8] focus:ring-2 focus:ring-[#0071e3] w-full sm:w-56"
            />
          </div>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-xl text-xs text-[#0f172a] font-mono font-bold focus:ring-2 focus:ring-[#0071e3]"
          >
            <option value="ALL">All States</option>
            <option value="NSW">NSW</option>
            <option value="VIC">VIC</option>
            <option value="QLD">QLD</option>
            <option value="WA">WA</option>
            <option value="SA">SA</option>
            <option value="TAS">TAS</option>
            <option value="ACT">ACT</option>
          </select>
        </div>
      </div>

      {/* Broker Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBrokers.map((broker) => (
          <div
            key={broker.id}
            className="bg-[#ffffff] hover:bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-5 space-y-4 transition-all hover:border-[#0071e3]/40 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                {broker.badge && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#fffbeb] text-[#d97706] border border-[#fde68a]">
                    {broker.badge}
                  </span>
                )}
                <div className="flex items-center gap-1 text-[#d97706] text-xs font-mono font-bold shrink-0">
                  <Star className="w-3.5 h-3.5 fill-[#d97706] text-[#d97706]" />
                  <span>{broker.rating.toFixed(1)}</span>
                  <span className="text-[#64748b] font-normal">({broker.reviews})</span>
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-[#0f172a] text-base leading-snug font-display">{broker.name}</h3>
                <p className="text-xs text-[#64748b] flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-[#059669] shrink-0" />
                  <span>{broker.suburb}, {broker.state} {broker.postcode}</span>
                </p>
              </div>

              <p className="text-xs text-[#334155] line-clamp-3 leading-relaxed">
                {broker.about}
              </p>
            </div>

            <div className="pt-3 border-t border-[#f1f5f9] space-y-2">
              <button
                onClick={() => onOpenLeadModal(broker)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#0f1e36] hover:bg-[#0a192f] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Request Free Rate Review</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
