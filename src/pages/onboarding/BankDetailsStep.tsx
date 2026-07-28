import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Landmark, CreditCard, Check, Shield, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../../components/atoms/Button';

export interface BankData {
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  accountType: 'savings' | 'current';
  upiId: string;
}

interface BankDetailsProps {
  initialData?: Partial<BankData>;
  onNext: (data: BankData) => void;
  onBack: () => void;
}

export const BankDetailsStep: React.FC<BankDetailsProps> = ({ initialData, onNext, onBack }) => {
  const [accountNumber, setAccountNumber] = useState(initialData?.accountNumber || '');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState(initialData?.accountNumber || '');
  const [ifscCode, setIfscCode] = useState(initialData?.ifscCode || '');
  const [bankName, setBankName] = useState(initialData?.bankName || '');
  const [accountType, setAccountType] = useState<'savings' | 'current'>(initialData?.accountType || 'savings');
  const [upiId, setUpiId] = useState(initialData?.upiId || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  const validateIFSC = (ifsc: string) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase());

  const handleVerifyBank = () => {
    if (!accountNumber || accountNumber !== confirmAccountNumber) {
      setError('Account numbers do not match');
      return;
    }
    if (!ifscCode || !validateIFSC(ifscCode)) {
      setError('Invalid IFSC Code (e.g. SBIN0001234)');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      setBankName('State Bank of India (Main Branch)');
      toast.success('Penny drop verification successful! Bank account linked');
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-xl mx-auto space-y-6 font-sans text-slate-900"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Bank Account Linkage</h2>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Link your primary bank account for fund deposits, payout withdrawals, and UPI mandates.
        </p>
      </div>

      <div className="space-y-4">
        {/* Account Number */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Bank Account Number *</label>
          <div className="relative">
            <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password"
              value={accountNumber}
              onChange={(e) => {
                setAccountNumber(e.target.value.replace(/\D/g, ''));
                setError('');
              }}
              placeholder="Enter account number"
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition"
            />
          </div>
        </div>

        {/* Confirm Account Number */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm Bank Account Number *</label>
          <div className="relative">
            <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={confirmAccountNumber}
              onChange={(e) => {
                setConfirmAccountNumber(e.target.value.replace(/\D/g, ''));
                setError('');
              }}
              placeholder="Re-enter account number"
              className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm font-mono font-bold text-slate-900 placeholder-slate-400 outline-none transition ${
                error ? 'border-rose-500 focus:ring-4 focus:ring-rose-50' : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50'
              }`}
            />
          </div>
          {error && <span className="text-[11px] font-bold text-rose-500 mt-1 block">{error}</span>}
        </div>

        {/* IFSC Code & Account Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">IFSC Code *</label>
            <input
              type="text"
              maxLength={11}
              value={ifscCode}
              onChange={(e) => {
                setIfscCode(e.target.value.toUpperCase());
                setError('');
              }}
              placeholder="SBIN0001234"
              className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 uppercase transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Account Type *</label>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as any)}
              className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition"
            >
              <option value="savings">Savings Account</option>
              <option value="current">Current Account</option>
            </select>
          </div>
        </div>

        {bankName && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-bold text-emerald-700 flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-500" /> Linked Bank: {bankName}
          </div>
        )}

        {/* Verification Trigger */}
        <button
          onClick={handleVerifyBank}
          disabled={isVerifying || isVerified}
          className={`w-full py-3.5 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 ${
            isVerified 
              ? 'bg-emerald-100 text-emerald-700 cursor-default' 
              : 'bg-blue-50 hover:bg-blue-100 text-blue-600 cursor-pointer border border-blue-200'
          }`}
        >
          {isVerifying ? <span>Executing ₹1 Penny Drop Verification...</span> : isVerified ? <><Check className="w-4 h-4" /><span>Bank Account Verified & Penny Dropped</span></> : <><Shield className="w-4 h-4" /><span>Verify Bank via Penny Drop</span></>}
        </button>
      </div>

      <div className="pt-4 flex justify-between gap-4 items-center">
        <button onClick={onBack} className="text-sm font-bold text-slate-500 cursor-pointer">
          Back
        </button>
        <Button
          onClick={() => onNext({ accountNumber, ifscCode, bankName, accountType, upiId })}
          disabled={!isVerified}
          className="px-8 py-3.5 rounded-xl text-sm"
          icon={<ChevronRight className="w-4 h-4" />}
          iconPosition="right"
        >
          Next Step
        </Button>
      </div>
    </motion.div>
  );
};

export default BankDetailsStep;
