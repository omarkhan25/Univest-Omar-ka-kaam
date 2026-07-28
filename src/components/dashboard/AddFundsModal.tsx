import React, { useState } from 'react';
import { 
  X, Wallet, CheckCircle2, ShieldCheck, ArrowUpRight, Copy, Check,
  QrCode, Building2, Smartphone, CreditCard, History, ChevronRight, Sparkles, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (amountAdded: number) => void;
}

export const AddFundsModal: React.FC<AddFundsModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [amount, setAmount] = useState<string>('25000');
  const [balance, setBalance] = useState<number>(() => {
    const val = localStorage.getItem('demat_cash_balance');
    if (val) return parseFloat(val) || 84250;
    localStorage.setItem('demat_cash_balance', '84250');
    return 84250;
  });
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'netbanking' | 'neft'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('gpay');
  const [customUpiId, setCustomUpiId] = useState<string>('');
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'add' | 'history'>('add');

  if (!isOpen) return null;

  const quickAmounts = [1000, 5000, 10000, 25000, 50000, 100000];

  const handleSelectQuickAmount = (val: number) => {
    const currentNum = parseInt(amount || '0', 10);
    setAmount((currentNum + val).toString());
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleProceedPayment = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 100) {
      toast.error('Minimum deposit amount is ₹100');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      const nextBal = balance + numAmount;
      localStorage.setItem('demat_cash_balance', String(nextBal));
      setBalance(nextBal);
      toast.success(`₹${numAmount.toLocaleString('en-IN')} added to your Univest account!`);
      if (onSuccess) onSuccess(numAmount);
    }, 1800);
  };

  const handleResetModal = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-white rounded-[28px] shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col my-auto font-sans text-slate-800"
        >
          {/* Header */}
          <div className="bg-[#0F172A] text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute right-5 top-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-500/20 text-blue-400 border border-blue-400/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-400" /> SEBI Compliant Brokerage Account
              </span>
            </div>

            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <Wallet className="w-6 h-6 text-blue-400" /> Add Funds to Account
            </h2>
            <p className="text-slate-400 text-xs mt-1">Instant fund addition via UPI, NetBanking & Bank Transfer</p>

            {/* Current Balance Snapshot */}
            <div className="mt-5 p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Available Trading Balance</span>
                <span className="text-xl font-black text-white">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 block">Demat ID</span>
                <span className="text-xs font-mono font-bold text-emerald-400">IN303028130</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-4 pt-2 border-t border-white/10 text-xs font-bold">
              <button
                onClick={() => setActiveTab('add')}
                className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'add' 
                    ? 'bg-blue-600 text-white shadow-sm font-black' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Deposit Money
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'history' 
                    ? 'bg-blue-600 text-white shadow-sm font-black' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <History className="w-3.5 h-3.5" /> Recent Deposits
              </button>
            </div>
          </div>

          {/* Success Overlay View */}
          {isSuccess ? (
            <div className="p-8 flex flex-col items-center justify-center text-center gap-4 bg-slate-50">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#0F172A]">Payment Successful!</h3>
                <p className="text-slate-600 text-sm mt-1">
                  ₹{parseFloat(amount).toLocaleString('en-IN')} has been added to your trading wallet.
                </p>
              </div>

              <div className="w-full bg-white p-4 rounded-2xl border border-slate-200 text-xs flex flex-col gap-2 font-medium text-slate-600 shadow-xs">
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-mono font-bold text-slate-900">UNI-{Date.now().toString().slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="font-bold text-slate-900 uppercase">{paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Updated Available Balance:</span>
                  <span className="font-black text-emerald-600">₹{(balance + parseFloat(amount || '0')).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <button
                onClick={handleResetModal}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-sm transition shadow-md cursor-pointer mt-2"
              >
                Done & Return to Dashboard
              </button>
            </div>
          ) : activeTab === 'history' ? (
            /* Recent Deposits View */
            <div className="p-6 flex flex-col gap-4 max-h-[420px] overflow-y-auto">
              <h3 className="font-black text-sm text-[#0F172A]">Recent Fund Deposits</h3>
              <div className="flex flex-col gap-2.5">
                {[
                  { id: 'TXN-90821', date: 'Today, 10:45 AM', amount: '₹25,000', method: 'UPI (GPay)', status: 'Success' },
                  { id: 'TXN-88412', date: 'July 18, 2026', amount: '₹50,000', method: 'NetBanking (HDFC)', status: 'Success' },
                  { id: 'TXN-76120', date: 'July 10, 2026', amount: '₹1,000,000', method: 'NEFT Transfer', status: 'Success' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-black text-sm text-[#0F172A]">{item.amount}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{item.method} • {item.date}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Deposit Form View */
            <div className="p-6 flex flex-col gap-5 max-h-[500px] overflow-y-auto">
              {/* Amount Input */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Enter Amount to Add</span>
                  <span className="text-[10px] text-slate-500">Min ₹100 • Max ₹10,00,000</span>
                </label>
                
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-2xl font-black text-slate-900">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-blue-600 focus:bg-white rounded-2xl text-2xl font-black text-slate-900 outline-none transition"
                  />
                </div>

                {/* Quick Add Chips */}
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {quickAmounts.map((val) => (
                    <button
                      key={val}
                      onClick={() => handleSelectQuickAmount(val)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition cursor-pointer"
                    >
                      +₹{val >= 1000 ? `${val / 1000}k` : val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Linked Bank Account Card */}
              <div className="p-3.5 bg-blue-50/60 border border-blue-200/80 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 flex items-center justify-center text-blue-700 font-bold shadow-2xs">
                    <Building2 className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 block">Primary Linked Bank</span>
                    <span className="text-xs font-black text-[#0F172A]">HDFC Bank •••• 4821</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Verified</span>
              </div>

              {/* Payment Methods Selection */}
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-bold text-slate-700">Select Payment Mode</label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition text-xs cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-700 font-black shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 font-bold'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-blue-600" />
                    <span>UPI Instant</span>
                    <span className="text-[9px] font-black text-emerald-600 uppercase">0% Charge</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition text-xs cursor-pointer ${
                      paymentMethod === 'netbanking'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-700 font-black shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 font-bold'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    <span>NetBanking</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase">Fast</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('neft')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition text-xs cursor-pointer ${
                      paymentMethod === 'neft'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-700 font-black shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 font-bold'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    <span>NEFT / RTGS</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase">Bank Direct</span>
                  </button>
                </div>

                {/* Sub-options based on Payment Method */}
                {paymentMethod === 'upi' && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-3">
                    <span className="text-[11px] font-bold text-slate-600">Choose UPI App or enter VPA</span>
                    
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'gpay', label: 'GPay', color: 'bg-white border-slate-200 text-slate-900' },
                        { id: 'phonepe', label: 'PhonePe', color: 'bg-purple-50 text-purple-900 border-purple-200' },
                        { id: 'paytm', label: 'Paytm', color: 'bg-blue-50 text-blue-900 border-blue-200' },
                        { id: 'bhim', label: 'BHIM', color: 'bg-amber-50 text-amber-900 border-amber-200' },
                      ].map((app) => (
                        <button
                          key={app.id}
                          onClick={() => setSelectedUpiApp(app.id)}
                          className={`p-2 rounded-xl border text-xs font-black transition cursor-pointer flex items-center justify-center ${app.color} ${
                            selectedUpiApp === app.id ? 'ring-2 ring-blue-600 shadow-xs' : 'opacity-80 hover:opacity-100'
                          }`}
                        >
                          {app.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Or enter UPI ID (e.g. mobile@upi)"
                        value={customUpiId}
                        onChange={(e) => setCustomUpiId(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:border-blue-600 outline-none"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-2.5">
                    <span className="text-[11px] font-bold text-slate-600">Select Bank</span>
                    <div className="grid grid-cols-2 gap-2">
                      {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra'].map((b) => (
                        <button
                          key={b}
                          onClick={() => setSelectedBank(b)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition text-left cursor-pointer ${
                            selectedBank === b 
                              ? 'bg-blue-600 text-white border-blue-600 font-black' 
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {paymentMethod === 'neft' && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-2 text-xs">
                    <span className="font-bold text-slate-700">Virtual Bank Account details for NEFT/RTGS:</span>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col gap-1.5 font-mono text-[11px]">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Beneficiary Name:</span>
                        <span className="font-bold text-slate-900">Univest Brokerage Pvt Ltd</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Account Number:</span>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-slate-900">UNIV303028130</span>
                          <button 
                            onClick={() => handleCopy('UNIV303028130', 'Account Number')}
                            className="p-1 hover:bg-slate-100 rounded cursor-pointer"
                          >
                            {copiedField === 'Account Number' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">IFSC Code:</span>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-slate-900">UTIB0000000</span>
                          <button 
                            onClick={() => handleCopy('UTIB0000000', 'IFSC Code')}
                            className="p-1 hover:bg-slate-100 rounded cursor-pointer"
                          >
                            {copiedField === 'IFSC Code' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Action */}
              <button
                onClick={handleProceedPayment}
                disabled={isProcessing}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-white" />
                    <span>Proceed to Add ₹{parseFloat(amount || '0').toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddFundsModal;
