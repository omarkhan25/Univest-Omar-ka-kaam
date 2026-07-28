import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, Check, Sparkles, AlertTriangle, BookOpen, Pen } from 'lucide-react';
import toast from 'react-hot-toast';

interface AgreementsProps {
  onComplete: () => void;
  onBack: () => void;
}

export const AgreementsStep: React.FC<AgreementsProps> = ({ onComplete, onBack }) => {
  const [agreedSebi, setAgreedSebi] = useState(true);
  const [agreedRisk, setAgreedRisk] = useState(true);
  const [agreedDigital, setAgreedDigital] = useState(true);
  const [signatureText, setSignatureText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!signatureText.trim()) {
      toast.error('Please type your full name as digital signature');
      return;
    }
    if (!agreedSebi || !agreedRisk || !agreedDigital) {
      toast.error('Please accept all compliance agreements');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Onboarding complete! Your account is active');
      onComplete();
    }, 1600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-xl mx-auto space-y-6 font-sans text-slate-900"
    >
      <div className="mb-5">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">SEBI Advisory Agreements</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Final step: Review and digitally sign the SEBI Research Advisory Master Service Agreement.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-black text-emerald-600">
            <ShieldCheck className="w-3 h-3" />
            <span>SEBI RA</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
      <div className="space-y-3">
          {/* Agreement Card 1 */}
          <label className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${agreedSebi ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
            <input type="checkbox" checked={agreedSebi} onChange={(e) => setAgreedSebi(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-black text-slate-900">SEBI Research Analyst Terms</span>
              </div>
              <span className="text-xs text-slate-500 font-medium leading-relaxed">
                I accept the <strong className="text-slate-900">SEBI Research Analyst Master Terms of Advisory</strong> (RA: INH000009821).
              </span>
            </div>
            {agreedSebi && <Check className="w-4 h-4 text-blue-500 shrink-0 mt-1" />}
          </label>

          {/* Agreement Card 2 */}
          <label className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${agreedRisk ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
            <input type="checkbox" checked={agreedRisk} onChange={(e) => setAgreedRisk(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-black text-slate-900">Equity & Derivatives Risk Disclosure</span>
              </div>
              <span className="text-xs text-slate-500 font-medium leading-relaxed">
                I have read and acknowledged the <strong className="text-slate-900">Equity & Derivatives Risk Disclosure Document</strong>.
              </span>
            </div>
            {agreedRisk && <Check className="w-4 h-4 text-orange-500 shrink-0 mt-1" />}
          </label>

          {/* Agreement Card 3 */}
          <label className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${agreedDigital ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
            <input type="checkbox" checked={agreedDigital} onChange={(e) => setAgreedDigital(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-black text-slate-900">Digital Signature Consent</span>
              </div>
              <span className="text-xs text-slate-500 font-medium leading-relaxed">
                I consent to digital signature e-Stamping under the <strong className="text-slate-900">Indian IT Act 2000</strong>.
              </span>
            </div>
            {agreedDigital && <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />}
          </label>
        </div>

        {/* Digital Signature Capture */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Pen className="w-3.5 h-3.5 text-slate-500" />
            <label className="text-xs font-black text-slate-700">
              Digital Signature (Type your Full Name as per PAN) *
            </label>
          </div>
          <div className="relative border border-slate-200 rounded-xl focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 transition overflow-hidden bg-white">
            <div className="absolute top-2 left-3 text-[9px] font-black text-slate-400 uppercase tracking-wider">Signature</div>
            <input
              type="text"
              value={signatureText}
              onChange={(e) => setSignatureText(e.target.value)}
              placeholder="e.g. Omar Khan"
              className="w-full px-4 pt-7 pb-3 bg-transparent border-none outline-none text-base font-serif font-black italic text-slate-900 placeholder-slate-300 focus:ring-0"
            />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-200" />
          </div>
          <span className="text-[10px] text-slate-500 font-bold block mt-1.5">
            By typing your full name, you legally execute this digital contract timestamped on {new Date().toLocaleDateString()}.
          </span>
        </div>

        {/* Submit CTA */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {isSubmitting ? (
            <span>Completing Account Setup...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>E-Sign & Activate Account</span>
            </>
          )}
        </button>
      </div>

      <div className="pt-4 flex justify-start">
        <button onClick={onBack} className="text-sm font-bold text-slate-500 cursor-pointer">
          Back
        </button>
      </div>
    </motion.div>
  );
};

export default AgreementsStep;
