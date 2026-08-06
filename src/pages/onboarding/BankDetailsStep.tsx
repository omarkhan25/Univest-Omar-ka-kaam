import React, { useState } from 'react';
import { Shield, Info, Check, Loader2, Landmark, Banknote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface BankData {
  accountNumber: string;
  ifscCode: string;
  verified: boolean;
}

interface BankDetailsProps {
  initialData?: Partial<BankData>;
  onNext: (data: BankData) => void;
}

export const BankDetailsStep: React.FC<BankDetailsProps> = ({ initialData, onNext }) => {
  const [accountNumber, setAccountNumber] = useState(initialData?.accountNumber || '');
  const [ifscCode, setIfscCode] = useState(initialData?.ifscCode || '');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = () => {
    if (!accountNumber || accountNumber.length < 9) {
      setError('Please enter a valid Account Number');
      return;
    }
    if (!ifscCode || ifscCode.length !== 11) {
      setError('Please enter a valid 11-character IFSC Code');
      return;
    }
    
    setError('');
    setIsVerifying(true);
    
    // Mock API call to send OTP from Bank
    setTimeout(() => {
      setOtpSent(true);
      setIsVerifying(false);
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    setError('');
    setIsVerifying(true);
    
    // Mock API call to verify bank OTP
    setTimeout(() => {
      setIsVerifying(false);
      onNext({
        accountNumber,
        ifscCode,
        verified: true
      });
    }, 2000);
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Bank Verification</h2>
        <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
          Link your primary bank account for all your deposits and withdrawals.
        </p>
      </div>

      <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex gap-3 mb-8">
        <div className="mt-0.5"><Shield className="w-5 h-5 text-emerald-600" /></div>
        <p className="text-xs font-medium text-emerald-800 leading-relaxed">
          Your account is verified securely. The name on the bank account must match your PAN card name.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Account Number</label>
          <div className="relative">
            <input
              type="password"
              value={accountNumber}
              onChange={(e) => {
                setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 18));
                setError('');
              }}
              disabled={otpSent || isVerifying}
              placeholder="Enter your Bank Account Number"
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60 font-mono tracking-widest text-lg"
            />
            <Banknote className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">IFSC Code</label>
          <div className="relative">
            <input
              type="text"
              value={ifscCode}
              onChange={(e) => {
                setIfscCode(e.target.value.toUpperCase().slice(0, 11));
                setError('');
              }}
              disabled={otpSent || isVerifying}
              placeholder="e.g. HDFC0000123"
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60 uppercase"
            />
            <Landmark className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
        </div>

        <AnimatePresence>
          {otpSent && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden pt-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Bank OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                disabled={isVerifying}
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-center tracking-[0.5em] text-lg"
              />
              <p className="text-xs text-slate-500 mt-2 text-center">OTP sent to your bank-registered mobile number.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs font-medium text-red-600 flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <div className="pt-4">
          {!otpSent ? (
            <button
              onClick={handleSendOtp}
              disabled={isVerifying || accountNumber.length < 9 || ifscCode.length !== 11}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              {isVerifying ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Preparing...</>
              ) : (
                'Send OTP to Verify Bank'
              )}
            </button>
          ) : (
            <button
              onClick={handleVerifyOtp}
              disabled={isVerifying || otp.length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              {isVerifying ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Verifying Bank...</>
              ) : (
                <><Check className="w-5 h-5" /> Verify & Continue</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
