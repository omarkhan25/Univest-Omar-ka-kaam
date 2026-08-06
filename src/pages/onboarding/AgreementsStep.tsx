import React, { useState } from 'react';
import { FileText, Shield, Check, Download, Pen, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface AgreementsProps {
  onComplete: () => void;
}

export const AgreementsStep: React.FC<AgreementsProps> = ({ onComplete }) => {
  const [signatureText, setSignatureText] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!signatureText.trim()) {
      setError('Please type your full name as a digital signature.');
      return;
    }
    if (!agreed) {
      setError('You must read and agree to the Account Opening Documents.');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      onComplete();
    }, 1500);
  };

  const handleDownload = () => {
    // Mock download action
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('Mock Account Opening Document Content.\n\nSEBI registered advisory terms and conditions...');
    link.download = 'Univest_Account_Opening_Form.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Account Opening Forms</h2>
        <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
          Please review your account opening documents and provide your digital signature to proceed.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Document Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Univest Account Form</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Includes SEBI RA terms & conditions</p>
            </div>
          </div>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Download className="w-4 h-4" /> Download
          </button>
        </div>

        {/* Digital Signature */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Pen className="w-4 h-4 text-slate-500" /> Digital Signature
          </label>
          <input
            type="text"
            value={signatureText}
            onChange={(e) => {
              setSignatureText(e.target.value);
              setError('');
            }}
            placeholder="Type your full legal name"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-serif italic text-lg placeholder:not-italic placeholder:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <p className="text-[10px] text-slate-500 mt-2 flex items-start gap-1.5">
            <Shield className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
            <span>Under IT Act 2000, your typed name serves as a legally binding digital signature for this document.</span>
          </p>
        </div>

        {/* Consent Checkbox */}
        <label className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              setError('');
            }}
            className="mt-1 shrink-0 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
          <span className="text-xs text-slate-600 font-medium leading-relaxed">
            I have read and understood the Account Opening Documents. I agree to the SEBI registered Research Advisory terms and authorize Univest to process my KYC.
          </span>
        </label>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs font-medium text-red-600 flex items-center gap-2">
            <span className="shrink-0 font-black">!</span> {error}
          </div>
        )}

        <div className="pt-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !signatureText.trim() || !agreed}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Signing...</>
            ) : (
              <><Check className="w-5 h-5" /> Sign & Continue</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
