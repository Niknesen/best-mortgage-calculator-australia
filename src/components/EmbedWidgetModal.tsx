import React, { useState } from 'react';
import { X, Code2, Copy, Check } from 'lucide-react';

interface EmbedWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmbedWidgetModal: React.FC<EmbedWidgetModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [widgetType, setWidgetType] = useState<'standard' | 'compact'>('standard');

  if (!isOpen) return null;

  const embedCode = `<iframe 
  src="https://bestbrokersaustralia.org/widget/calculator?type=${widgetType}" 
  width="100%" 
  height="${widgetType === 'standard' ? '650' : '450'}" 
  frameborder="0" 
  scrolling="no"
  style="border-radius: 20px; box-shadow: 0 4px 20px -2px rgba(15,23,42,0.08); border: 1px solid #e2e8f0;"
></iframe>
<p style="font-size: 11px; text-align: right; color: #64748b; margin-top: 4px; font-family: sans-serif;">
  Powered by <a href="https://bestbrokersaustralia.org" target="_blank" style="color: #0071e3; font-weight: 700; text-decoration: none;">BestBrokers Australia Calculator</a>
</p>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#e2e8f0] overflow-hidden text-[#0f172a]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0071e3] flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" />
              <span>Free Embeddable Widget</span>
            </span>
            <h3 className="text-2xl font-black font-display text-[#0f172a] tracking-tight">
              Embed on Your Website
            </h3>
            <p className="text-xs text-[#64748b]">
              Add the Australian Mortgage & Offset Calculator to your real estate blog, buyers agency site, or property portal.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-[#334155] block">Widget Size / Format</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setWidgetType('standard')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  widgetType === 'standard'
                    ? 'bg-[#0071e3] text-white border-[#0071e3] shadow-sm'
                    : 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0]'
                }`}
              >
                Standard (Full Featured)
              </button>
              <button
                type="button"
                onClick={() => setWidgetType('compact')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  widgetType === 'compact'
                    ? 'bg-[#0071e3] text-white border-[#0071e3] shadow-sm'
                    : 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0]'
                }`}
              >
                Compact (Sidebar)
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono font-bold text-[#334155]">
              <span>HTML Embed Code:</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[#0071e3] hover:text-[#0077ed]"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-3.5 bg-[#f8fafc] text-[#0f172a] text-xs font-mono rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed border border-[#cbd5e1]">
              {embedCode}
            </pre>
          </div>

          <button
            onClick={handleCopy}
            className="w-full py-3 px-4 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#0071e3]/20"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied! Ready to Paste</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Embed Code</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
