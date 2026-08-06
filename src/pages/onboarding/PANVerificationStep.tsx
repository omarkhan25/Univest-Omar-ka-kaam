import React, { useState } from 'react';
import { Shield, Info, Check, Loader2, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export interface PANData {
  panNumber: string;
  fullName: string;
  dob: string;
  verified: boolean;
}

interface PANVerificationProps {
  initialData?: Partial<PANData>;
  onNext: (data: PANData) => void;
}

export const PANVerificationStep: React.FC<PANVerificationProps> = ({ initialData, onNext }) => {
  const [panNumber, setPanNumber] = useState(initialData?.panNumber || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  
  // For mocked NSDL response
  const [verifiedData, setVerifiedData] = useState<{name: string, dob: string} | null>(
    initialData?.verified ? { name: initialData.fullName || 'OMAR KHAN', dob: initialData.dob || '15/06/1995' } : null
  );

  const validatePAN = (pan: string) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);

  const handleVerify = () => {
    if (!panNumber) {
      setError('PAN number is required');
      return;
    }
    if (!validatePAN(panNumber)) {
      setError('Please enter a valid 10-character PAN number (e.g. ABCDE1234F)');
      return;
    }
    
    setError('');
    setIsVerifying(true);
    
    // Mock API call to NSDL
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedData({
        name: 'OMAR KHAN',
        dob: '15/06/1995'
      });
    }, 2000);
  };

  const handleContinue = () => {
    if (verifiedData) {
      onNext({
        panNumber,
        fullName: verifiedData.name,
        dob: verifiedData.dob,
        verified: true
      });
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">PAN Verification</h2>
        <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
          As per SEBI guidelines, your PAN is required to invest in financial markets.
        </p>
      </div>

      <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 flex gap-3 mb-8">
        <div className="mt-0.5"><Shield className="w-5 h-5 text-orange-500" /></div>
        <p className="text-xs font-medium text-orange-800 leading-relaxed">
          Your PAN details are securely verified directly with the Income Tax Department database (NSDL).
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">PAN Number</label>
          <div className="relative">
            <input
              type="text"
              value={panNumber}
              onChange={(e) => {
                setPanNumber(e.target.value.toUpperCase().slice(0, 10));
                setError('');
                setVerifiedData(null);
              }}
              disabled={isVerifying || !!verifiedData}
              placeholder="e.g. ABCDE1234F"
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60 uppercase"
            />
            <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs font-medium text-red-600 flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {verifiedData && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-900 mb-2">NSDL Verified</h4>
              <div className="space-y-1">
                <div className="text-xs text-emerald-700"><span className="font-medium opacity-70">Name:</span> <strong>{verifiedData.name}</strong></div>
                <div className="text-xs text-emerald-700"><span className="font-medium opacity-70">DOB:</span> <strong>{verifiedData.dob}</strong></div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="pt-4">
          {!verifiedData ? (
            <button
              onClick={handleVerify}
              disabled={isVerifying || panNumber.length !== 10}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              {isVerifying ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Verifying with NSDL...</>
              ) : (
                'Verify PAN'
              )}
            </button>
          ) : (
            <button
              onClick={handleContinue}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              Confirm & Continue
              <Check className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
