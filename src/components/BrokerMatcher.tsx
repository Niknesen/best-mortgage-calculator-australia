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
    <div className="bg-white rounded-[34px] p-6 sm:p-10 shadow-[0_18px_50px_rgba(17,41,60,0.08)] border border-[#e6edf2] space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#edf8e1] border border-[#5ca701]/30 text-[#4e8f00] text-xs font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5ca701]" />
            <span>Over 71% of Aussie Mortgages Settle via Brokers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1b2932] font-display">
            Find an Accredited Mortgage Broker Near You
          </h2>
          <p className="text-[#486d84] text-xs sm:text-sm">
            Top-rated Australian brokers negotiate with 30+ lenders at $0 fee to you under ASIC Best Interests Duty (BID).
          </p>
        </div>

        {/* Search & State Filter */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search suburb, city, postcode..."
              className="pl-9 pr-4 py-2.5 bg-[#f4f7f9] border border-[#e6edf2] rounded-full text-xs text-[#1b2932] placeholder-[#94a3b8] focus:ring-2 focus:ring-[#5ca701] w-full sm:w-56"
            />
          </div>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-4 py-2.5 bg-[#f4f7f9] border border-[#e6edf2] rounded-full text-xs text-[#1b2932] font-mono font-bold focus:ring-2 focus:ring-[#5ca701]"
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
            className="bg-[#ffffff] hover:bg-[#f4f7f9] border border-[#e6edf2] rounded-3xl p-6 space-y-4 transition-all hover:border-[#5ca701]/50 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                {broker.badge && (
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#edf8e1] text-[#4e8f00] border border-[#5ca701]/30">
                    {broker.badge}
                  </span>
                )}
                <div className="flex items-center gap-1 text-[#d97706] text-xs font-mono font-bold shrink-0">
                  <Star className="w-3.5 h-3.5 fill-[#d97706] text-[#d97706]" />
                  <span>{broker.rating.toFixed(1)}</span>
                  <span className="text-[#94a3b8] font-normal">({broker.reviews})</span>
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-[#1b2932] text-base leading-snug font-display">{broker.name}</h3>
                <p className="text-xs text-[#486d84] flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#5ca701] shrink-0" />
                  <span>{broker.suburb}, {broker.state} {broker.postcode}</span>
                </p>
              </div>

              <p className="text-xs text-[#486d84] line-clamp-3 leading-relaxed">
                {broker.about}
              </p>
            </div>

            <div className="pt-3 border-t border-[#f4f7f9] space-y-2">
              <button
                onClick={() => onOpenLeadModal(broker)}
                className="w-full py-2.5 px-3 rounded-full bg-[#1b2932] hover:bg-[#0d1720] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#5ca701]" />
                <span>Request Free Rate Review</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
