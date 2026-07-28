import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Check, ArrowRight, CreditCard, Fingerprint, Landmark, Clock, Camera } from 'lucide-react';
import { Button } from '../../components/atoms/Button';

interface WelcomeStepProps {
  onNext: () => void;
}

const requirements = [
  { icon: CreditCard, label: 'PAN Card', desc: 'Govt-issued tax identity', color: 'text-orange-500 bg-orange-50 border-orange-100' },
  { icon: Fingerprint, label: 'Aadhaar Card', desc: 'Front + Back photos', color: 'text-blue-500 bg-blue-50 border-blue-100' },
  { icon: Camera, label: 'Live Selfie', desc: 'Face biometric capture', color: 'text-violet-500 bg-violet-50 border-violet-100' },
  { icon: Landmark, label: 'Bank Details', desc: 'Account + IFSC code', color: 'text-emerald-500 bg-emerald-50 border-emerald-100' },
];

const guarantees = [
  { label: 'Takes less than 3 minutes', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  { label: 'Bank-grade 256-bit encryption', color: 'text-blue-600 bg-blue-50 border-blue-100' },
  { label: 'SEBI mandated & compliant', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
];

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col max-w-xl"
    >
      {/* Header */}
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[11px] font-black text-emerald-600">
            <Clock className="w-3 h-3" />
            <span>~3 minutes to complete</span>
          </div>
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
          Complete Your Investor<br />Verification
        </h1>
        <p className="text-slate-500 font-medium leading-relaxed text-[15px]">
          To provide SEBI-compliant research advisory services, we need to verify your identity. Secure, fast and one-time only.
        </p>
      </div>

      {/* What you'll need */}
      <div className="mb-7">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">What you'll need</h3>
        <div className="grid grid-cols-2 gap-3">
          {requirements.map((req, i) => (
            <motion.div
              key={req.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${req.color}`}>
                <req.icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[13px] font-black text-slate-900">{req.label}</div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">{req.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Guarantee badges */}
      <div className="flex flex-wrap gap-2 mb-7">
        {guarantees.map((g) => (
          <div key={g.label} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${g.color}`}>
            <Check className="w-3 h-3" />
            <span>{g.label}</span>
          </div>
        ))}
      </div>

      <Button
        onClick={onNext}
        className="w-full sm:w-auto self-start px-8 py-3.5 text-[15px] font-bold rounded-xl"
        icon={<ArrowRight className="w-4 h-4" />}
        iconPosition="right"
      >
        Start Verification
      </Button>
    </motion.div>
  );
};

