import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Fingerprint, Info, Check, Loader2 } from 'lucide-react';

export interface AadhaarData {
  aadhaarNumber: string;
  consentGiven: boolean;
  verified: boolean;
}

interface AadhaarVerificationProps {
  initialData?: Partial<AadhaarData>;
  onNext: (data: AadhaarData) => void;
}

export const AadhaarVerificationStep: React.FC<AadhaarVerificationProps> = ({ initialData, onNext }) => {
  const [aadhaarNumber, setAadhaarNumber] = useState(initialData?.aadhaarNumber || '');
  const [consentGiven, setConsentGiven] = useState(initialData?.consentGiven ?? true);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const validateAadhaar = (num: string) => /^\d{12}$/.test(num);

  const handleSendOtp = () => {
    if (!aadhaarNumber) {
      setError('Aadhaar number is required');
      return;
    }
    if (!validateAadhaar(aadhaarNumber)) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return;
    }
    setError('');
    setIsVerifying(true);
    
    // Mock API call to send OTP
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
    
    // Mock API call to verify OTP and fetch DigiLocker data
    setTimeout(() => {
      setIsVerifying(false);
      onNext({
        aadhaarNumber,
        consentGiven,
        verified: true
      });
    }, 2000);
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Identity Verification</h2>
        <p className="text-base text-slate-500 font-medium mt-2 leading-relaxed">
          Verify your identity using Aadhaar and DigiLocker to continue opening your account.
        </p>
      </div>

      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3 mb-8">
        <div className="mt-0.5"><Shield className="w-6 h-6 text-blue-600" /></div>
        <p className="text-sm font-medium text-blue-800 leading-relaxed">
          Your Aadhaar details will be securely fetched from DigiLocker. We do not store your Aadhaar number.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-base font-bold text-slate-700 mb-2">Aadhaar Number</label>
          <div className="relative">
            <input
              type="text"
              value={aadhaarNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                setAadhaarNumber(val);
                setError('');
              }}
              disabled={otpSent || isVerifying}
              placeholder="Enter 12-digit Aadhaar number"
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60 text-lg"
            />
            <Fingerprint className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
        </div>

        <AnimatePresence>
          {otpSent && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden pt-2">
              <label className="block text-base font-bold text-slate-700 mb-2">Aadhaar OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                disabled={isVerifying}
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-center tracking-[0.5em] text-xl"
              />
              <p className="text-sm text-slate-500 mt-2 text-center">OTP sent to your Aadhaar-linked mobile number.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs font-medium text-red-600 flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
          <input
            type="checkbox"
            checked={consentGiven}
            onChange={(e) => setConsentGiven(e.target.checked)}
            disabled={isVerifying}
            className="mt-1 shrink-0 w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-500 font-medium leading-relaxed">
            I hereby give consent to Univest to fetch my Aadhaar details from DigiLocker (UIDAI) for KYC purposes in accordance with the IT Act 2000.
          </span>
        </label>

        <div className="pt-4">
          {!otpSent ? (
            <button
              onClick={handleSendOtp}
              disabled={isVerifying || !consentGiven}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all text-lg"
            >
              {isVerifying ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Preparing...</>
              ) : (
                'Send OTP via DigiLocker'
              )}
            </button>
          ) : (
            <button
              onClick={handleVerifyOtp}
              disabled={isVerifying || otp.length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all text-lg"
            >
              {isVerifying ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</>
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
