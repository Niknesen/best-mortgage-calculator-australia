import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  User,
  Lock,
  ExternalLink,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

export const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, initialData }) => {
  const [step, setStep] = useState<number>(1);
  const [loanPurpose, setLoanPurpose] = useState<string>('Buying a Home');
  const [timeline, setTimeline] = useState<string>('Next 1-3 Months');
  const [propertyPrice, setPropertyPrice] = useState<string>(
    initialData?.propertyValue ? `$${Number(initialData.propertyValue).toLocaleString()}` : '$850,000'
  );
  const depositAmount = initialData?.deposit ? `$${Number(initialData.deposit).toLocaleString()}` : '$170,000';
  const [postcode, setPostcode] = useState<string>('2000');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentGoal = initialData?.goal || (initialData?.lender ? `Apply for ${initialData.lender} ${initialData.rate}% Rate` : 'Get Free Broker Pre-Approval');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 700);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setStep(1);
    onClose();
  };

  const handleContinueToFunnel = () => {
    const funnelUrl = `http://localhost:8080/google-omni.html?postcode=${encodeURIComponent(postcode)}&price=${encodeURIComponent(propertyPrice)}&goal=${encodeURIComponent(currentGoal)}`;
    window.open(funnelUrl, '_blank');
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#e2e8f0] overflow-hidden text-[#0f172a]">
        {/* Top Gradient Bar */}
        <div className="h-2 bg-gradient-to-r from-[#0071e3] via-[#059669] to-[#0071e3]" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-[#ecfdf5] text-[#059669] border border-[#059669]/30 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black font-display text-[#0f172a]">Your Scenario is Registered!</h3>
              <p className="text-sm text-[#64748b] max-w-sm mx-auto leading-relaxed">
                An accredited MFAA broker matching your goal in postcode <strong>{postcode}</strong> will review your scenario within 2 business hours.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] text-xs font-mono text-[#334155] space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-[#64748b]">Applicant:</span>
                <span className="font-bold text-[#0f172a]">{fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Your Goal:</span>
                <span className="font-bold text-[#0071e3]">{currentGoal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Property Target:</span>
                <span className="font-bold text-[#0f172a]">{propertyPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Deposit Available:</span>
                <span className="font-bold text-[#059669]">{depositAmount}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleContinueToFunnel}
                className="w-full py-3.5 px-4 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#0071e3]/25"
              >
                <span>Continue to Best Brokers Australia Funnel</span>
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={handleClose}
                className="w-full py-2.5 px-4 rounded-xl text-[#64748b] hover:text-[#0f172a] font-bold text-xs"
              >
                Return to Calculator
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Header with Customer's Selected Dream Goal */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f0f9ff] border border-[#0071e3]/20 text-[#0071e3] text-[11px] font-mono font-bold">
                <Target className="w-3.5 h-3.5 text-[#0071e3]" />
                <span className="truncate max-w-[320px]">{currentGoal}</span>
              </div>
              <h3 className="text-2xl font-black font-display text-[#0f172a] tracking-tight">
                Get Pre-Approved with a Top Broker
              </h3>
              <p className="text-xs text-[#64748b]">
                Compare 30+ lenders & unlock wholesale broker discounting under ASIC Best Interests Duty (BID).
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#334155]">What is your loan purpose?</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Buying a Home', 'First Home Buyer', 'Refinancing', 'Investing'].map((purp) => (
                        <button
                          key={purp}
                          type="button"
                          onClick={() => setLoanPurpose(purp)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                            loanPurpose === purp
                              ? 'bg-[#0071e3] text-white border-[#0071e3] shadow-sm'
                              : 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0] hover:text-[#0f172a]'
                          }`}
                        >
                          {purp}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#334155]">Buying Timeline</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Next 1-3 Months', '3-6 Months', 'Just Exploring'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTimeline(t)}
                          className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all border ${
                            timeline === t
                              ? 'bg-[#0f1e36] text-white border-[#0f1e36] shadow-sm'
                              : 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0] hover:text-[#0f172a]'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#334155]">Estimated Property ($)</label>
                      <input
                        type="text"
                        value={propertyPrice}
                        onChange={(e) => setPropertyPrice(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono font-bold bg-[#f8fafc] border border-[#cbd5e1] rounded-xl text-[#0f172a]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#334155]">Your Postcode</label>
                      <input
                        type="text"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono font-bold bg-[#f8fafc] border border-[#cbd5e1] rounded-xl text-[#0f172a]"
                        placeholder="e.g. 2000"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full py-3 px-4 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#0071e3]/20"
                  >
                    <span>Next: Match Available Lenders</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#334155] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#64748b]" />
                      <span>Full Legal Name</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Nick Harrison"
                      className="w-full px-3 py-2 text-xs font-semibold bg-[#f8fafc] text-[#0f172a] border border-[#cbd5e1] rounded-xl focus:ring-2 focus:ring-[#0071e3]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#334155] flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#64748b]" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. nick@example.com"
                      className="w-full px-3 py-2 text-xs font-semibold bg-[#f8fafc] text-[#0f172a] border border-[#cbd5e1] rounded-xl focus:ring-2 focus:ring-[#0071e3]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#334155] flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#64748b]" />
                      <span>Australian Mobile Phone</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 0412 345 678"
                      className="w-full px-3 py-2 text-xs font-mono font-bold bg-[#f8fafc] text-[#0f172a] border border-[#cbd5e1] rounded-xl focus:ring-2 focus:ring-[#0071e3]"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-3 rounded-xl border border-[#cbd5e1] text-[#334155] text-xs font-bold hover:bg-[#f8fafc]"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#0071e3]/20 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Matching Broker...</span>
                      ) : (
                        <>
                          <span>Submit & Connect with Broker</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[10px] text-[#64748b] text-center flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3 text-[#94a3b8]" />
                    <span>Your data is encrypted & protected under Australian Privacy Principles.</span>
                  </p>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
