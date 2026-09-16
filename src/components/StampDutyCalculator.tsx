import React, { useState, useMemo } from 'react';
import {
  calculateStampDuty,
  type AustralianState,
  type BuyerType,
  type PropertyType,
  type StampDutyResult
} from '../math/stampDuty';
import {
  Building2,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface StampDutyCalculatorProps {
  onOpenLeadModal: (details?: any) => void;
}

export const StampDutyCalculator: React.FC<StampDutyCalculatorProps> = ({ onOpenLeadModal }) => {
  const [propertyValue, setPropertyValue] = useState<number>(850000);
  const [selectedState, setSelectedState] = useState<AustralianState>('NSW');
  const [buyerType, setBuyerType] = useState<BuyerType>('first_home_buyer');
  const [propertyType, setPropertyType] = useState<PropertyType>('established');
  const [isForeignBuyer, setIsForeignBuyer] = useState<boolean>(false);

  const statesList: { code: AustralianState; name: string }[] = [
    { code: 'NSW', name: 'New South Wales' },
    { code: 'VIC', name: 'Victoria' },
    { code: 'QLD', name: 'Queensland' },
    { code: 'WA', name: 'Western Australia' },
    { code: 'SA', name: 'South Australia' },
    { code: 'TAS', name: 'Tasmania' },
    { code: 'ACT', name: 'Australian Capital Territory' },
    { code: 'NT', name: 'Northern Territory' },
  ];

  const result: StampDutyResult = useMemo(() => {
    return calculateStampDuty({
      propertyValue,
      state: selectedState,
      buyerType,
      propertyType,
      isForeignBuyer,
    });
  }, [propertyValue, selectedState, buyerType, propertyType, isForeignBuyer]);

  const comparisonData = useMemo(() => {
    return statesList.map((st) => {
      const res = calculateStampDuty({
        propertyValue,
        state: st.code,
        buyerType,
        propertyType,
        isForeignBuyer,
      });
      return {
        state: st.code,
        'Stamp Duty': res.stampDuty,
        'Gov Fees': res.transferFee + res.mortgageRegistrationFee,
      };
    });
  }, [propertyValue, buyerType, propertyType, isForeignBuyer]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0f9ff] border border-[#0071e3]/25 text-[#0071e3] text-xs font-mono font-bold tracking-wide">
          <Building2 className="w-3.5 h-3.5 text-[#0071e3]" />
          <span>Updated for 2024 / 2026 State Budget Legislation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0f172a] font-display tracking-tight">
          Australian Stamp Duty <span className="text-[#0071e3]">Calculator</span>
        </h1>
        <p className="text-[#64748b] text-sm sm:text-base leading-relaxed">
          Accurate transfer duty, first home concessions, foreign buyer surcharges, and land transfer registration fees across all 8 states & territories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05),0_2px_6px_-1px_rgba(15,23,42,0.03)] border border-[#e2e8f0] space-y-6">
          <h2 className="text-base sm:text-lg font-bold text-[#0f172a] font-display flex items-center gap-2 pb-4 border-b border-[#e2e8f0]">
            <Building2 className="w-5 h-5 text-[#0071e3]" />
            <span>Property & Buyer Profile</span>
          </h2>

          {/* State Selector Buttons */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0f172a]">Select Australian State / Territory</label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {statesList.map((st) => (
                <button
                  key={st.code}
                  type="button"
                  onClick={() => setSelectedState(st.code)}
                  className={`py-2 text-xs font-mono font-extrabold rounded-xl border transition-all ${
                    selectedState === st.code
                      ? 'bg-[#0071e3] text-white border-[#0071e3] shadow-sm'
                      : 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0] hover:text-[#0f172a] hover:bg-[#f1f5f9]'
                  }`}
                >
                  {st.code}
                </button>
              ))}
            </div>
          </div>

          {/* Property Value Slider & Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="font-bold text-[#0f172a]">Property Purchase Price</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#64748b] font-mono font-bold">$</span>
                <input
                  type="number"
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(Math.max(0, Number(e.target.value)))}
                  className="w-40 pl-7 pr-3 py-1.5 text-right font-mono font-extrabold text-[#0f172a] bg-[#f8fafc] border border-[#cbd5e1] rounded-xl text-sm focus:ring-2 focus:ring-[#0071e3]"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[500000, 700000, 800000, 1000000, 1250000, 1500000].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setPropertyValue(v)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-mono font-bold ${
                    propertyValue === v ? 'bg-[#0071e3] text-white shadow-sm' : 'bg-[#f1f5f9] text-[#475569] hover:text-[#0f172a] border border-[#e2e8f0]'
                  }`}
                >
                  ${v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : `${v / 1000}k`}
                </button>
              ))}
            </div>
            <input
              type="range"
              min={100000}
              max={3000000}
              step={20000}
              value={propertyValue}
              onChange={(e) => setPropertyValue(Number(e.target.value))}
              className="w-full h-2 bg-[#e2e8f0] rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
            />
          </div>

          {/* Buyer Type */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#0f172a]">Buyer Status</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setBuyerType('first_home_buyer')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  buyerType === 'first_home_buyer'
                    ? 'bg-[#059669] text-white border-[#059669] shadow-sm'
                    : 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0] hover:text-[#0f172a]'
                }`}
              >
                First Home Buyer
              </button>
              <button
                type="button"
                onClick={() => setBuyerType('owner_occupier')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  buyerType === 'owner_occupier'
                    ? 'bg-[#0071e3] text-white border-[#0071e3] shadow-sm'
                    : 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0] hover:text-[#0f172a]'
                }`}
              >
                Owner Occupier
              </button>
              <button
                type="button"
                onClick={() => setBuyerType('investor')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  buyerType === 'investor'
                    ? 'bg-[#0071e3] text-white border-[#0071e3] shadow-sm'
                    : 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0] hover:text-[#0f172a]'
                }`}
              >
                Investor
              </button>
            </div>
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#0f172a]">Property Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'established' as PropertyType, label: 'Established Home' },
                { id: 'new_home' as PropertyType, label: 'Brand New Home' },
                { id: 'vacant_land' as PropertyType, label: 'Vacant Land' },
              ].map((pt) => (
                <button
                  key={pt.id}
                  type="button"
                  onClick={() => setPropertyType(pt.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    propertyType === pt.id
                      ? 'bg-[#0f1e36] text-white border-[#0f1e36]'
                      : 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0] hover:text-[#0f172a]'
                  }`}
                >
                  {pt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Foreign Buyer Checkbox */}
          <div className="pt-2 border-t border-[#e2e8f0]">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#64748b]">
              <input
                type="checkbox"
                checked={isForeignBuyer}
                onChange={(e) => setIsForeignBuyer(e.target.checked)}
                className="w-4 h-4 text-[#0071e3] rounded focus:ring-[#0071e3]"
              />
              <span>I am a foreign purchaser / non-resident (applies 7%–8% state surcharge)</span>
            </label>
          </div>
        </div>

        {/* Output Summary Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05),0_2px_6px_-1px_rgba(15,23,42,0.03)] border border-[#e2e8f0] space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-[#0071e3]">
                {selectedState} Total Government Fees
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#f1f5f9] text-[#334155] border border-[#e2e8f0]">
                {buyerType.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>

            {/* The Big Stamp Duty Number */}
            <div className="bg-[#f0f9ff] border-[1.5px] border-[#0071e3]/25 rounded-2xl p-5 text-center space-y-1">
              <div className="font-display text-4xl sm:text-5xl font-extrabold text-[#0071e3] leading-none">
                ${result.stampDuty.toLocaleString()}
              </div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#0071e3] pt-1">
                Estimated Transfer Duty
              </div>
              {result.concessionAmount > 0 && (
                <p className="text-xs text-[#059669] font-mono font-bold flex items-center justify-center gap-1 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Saved ${result.concessionAmount.toLocaleString()} via {selectedState} concessions!</span>
                </p>
              )}
            </div>

            {/* Explanation Note */}
            <div className="p-3.5 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] text-xs text-[#334155] leading-relaxed">
              <p className="font-bold text-[#0f172a] mb-1">State Policy Breakdown:</p>
              <p>{result.explanation}</p>
            </div>

            {/* Itemized Cost Breakdown */}
            <div className="space-y-2 text-xs font-mono border-t border-[#e2e8f0] pt-3">
              <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                <span className="text-[#64748b]">Standard Transfer Duty</span>
                <span className="font-bold text-[#0f172a]">${result.standardDuty.toLocaleString()}</span>
              </div>
              {result.concessionAmount > 0 && (
                <div className="flex justify-between py-1 border-b border-[#f1f5f9] text-[#059669]">
                  <span>First Home Concession Discount</span>
                  <span className="font-bold">-${result.concessionAmount.toLocaleString()}</span>
                </div>
              )}
              {result.foreignBuyerSurcharge > 0 && (
                <div className="flex justify-between py-1 border-b border-[#f1f5f9] text-[#d97706]">
                  <span>Foreign Purchaser Surcharge</span>
                  <span className="font-bold">+${result.foreignBuyerSurcharge.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                <span className="text-[#64748b]">Transfer of Land Registration Fee</span>
                <span className="font-bold text-[#0f172a]">${result.transferFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                <span className="text-[#64748b]">Mortgage Registration Fee</span>
                <span className="font-bold text-[#0f172a]">${result.mortgageRegistrationFee.toLocaleString()}</span>
              </div>
              {result.firstHomeGrantAmount > 0 && (
                <div className="flex justify-between py-1 border-b border-[#f1f5f9] text-[#059669]">
                  <span>Eligible First Home Owner Grant (FHOG)</span>
                  <span className="font-bold">+${result.firstHomeGrantAmount.toLocaleString()} (Cash Grant)</span>
                </div>
              )}
              <div className="flex justify-between py-2 text-sm font-extrabold text-[#0f172a]">
                <span>Total Cash Required For Gov Fees:</span>
                <span className="text-[#0071e3]">${result.totalGovernmentFees.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => onOpenLeadModal({ type: 'stamp_duty', state: selectedState, propertyValue, result })}
              className="w-full py-3.5 px-4 rounded-xl bg-[#0f1e36] hover:bg-[#0a192f] text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#0f1e36]/20"
            >
              <span>Get Pre-Approved with a {selectedState} Broker</span>
              <ArrowRight className="w-4 h-4 text-[#38bdf8]" />
            </button>
          </div>
        </div>
      </div>

      {/* Cross-State Comparison Bar Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05),0_2px_6px_-1px_rgba(15,23,42,0.03)] border border-[#e2e8f0] space-y-4">
        <div>
          <h3 className="text-lg font-bold text-[#0f172a] font-display">Stamp Duty Comparison Across All 8 States</h3>
          <p className="text-xs text-[#64748b]">
            See how much stamp duty you would pay on a ${propertyValue.toLocaleString()} property in each Australian state.
          </p>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="state" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Duty']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
              />
              <Bar dataKey="Stamp Duty" fill="#0071e3" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
