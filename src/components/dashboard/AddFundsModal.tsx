import React, { useState, useEffect } from 'react';
import { 
  X, Wallet, CheckCircle2, ShieldCheck, Copy, Check,
  QrCode, Building2, Smartphone, CreditCard, History, Sparkles, RefreshCw,
  Clock, AlertCircle, ExternalLink, ArrowRight, CheckCircle, AlertTriangle
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
  
  // Stages: 'form' | 'upi_waiting' | 'netbanking_waiting' | 'neft_registered' | 'success' | 'failed'
  const [stage, setStage] = useState<'form' | 'upi_waiting' | 'netbanking_waiting' | 'neft_registered' | 'success' | 'failed'>('form');
  const [upiTimer, setUpiTimer] = useState<number>(300); // 5 minutes countdown
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'add' | 'history'>('add');
  const [lastTxnDetails, setLastTxnDetails] = useState<any>(null);

  // UPI Countdown effect
  useEffect(() => {
    let interval: any = null;
    if (stage === 'upi_waiting' && upiTimer > 0) {
      interval = setInterval(() => {
        setUpiTimer((prev) => prev - 1);
      }, 1000);
    } else if (upiTimer === 0 && stage === 'upi_waiting') {
      setStage('failed');
      toast.error('UPI payment request timed out. Please try again.');
    }
    return () => clearInterval(interval);
  }, [stage, upiTimer]);

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

    const txnId = `UNI-${Date.now().toString().slice(-8)}`;

    if (paymentMethod === 'upi') {
      setStage('upi_waiting');
      setUpiTimer(300);
      const appName = customUpiId || (selectedUpiApp === 'gpay' ? 'Google Pay' : selectedUpiApp === 'phonepe' ? 'PhonePe' : selectedUpiApp === 'paytm' ? 'Paytm' : 'BHIM UPI');
      toast.loading(`Payment notification sent to your ${appName} app`, { id: 'upi-toast' });
    } else if (paymentMethod === 'netbanking') {
      setStage('netbanking_waiting');
    } else if (paymentMethod === 'neft') {
      const generatedUtr = `UTR${Date.now()}`;
      setUtrNumber(generatedUtr);
      setStage('neft_registered');
    }
  };

  // Complete Payment Action (Simulating Bank / App Approval)
  const handleCompletePayment = () => {
    const numAmount = parseFloat(amount);
    const nextBal = balance + numAmount;
    localStorage.setItem('demat_cash_balance', String(nextBal));
    setBalance(nextBal);

    const txn = {
      id: `UNI-${Date.now().toString().slice(-8)}`,
      amount: numAmount,
      method: paymentMethod === 'upi' ? `UPI (${selectedUpiApp.toUpperCase()})` : paymentMethod === 'netbanking' ? `NetBanking (${selectedBank})` : 'NEFT / RTGS Transfer',
      date: 'Just Now',
      status: 'Success'
    };
    setLastTxnDetails(txn);

    setStage('success');
    toast.dismiss('upi-toast');
    toast.success(`₹${numAmount.toLocaleString('en-IN')} added successfully to your wallet!`);
    if (onSuccess) onSuccess(numAmount);
  };

  const handleCancelPayment = () => {
    toast.dismiss('upi-toast');
    setStage('form');
  };

  const handleResetModal = () => {
    setStage('form');
    onClose();
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-md"
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
                <ShieldCheck className="w-3.3 h-3.3 text-blue-400" /> SEBI Compliant Brokerage Account
              </span>
            </div>

            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <Wallet className="w-6 h-6 text-blue-400" /> Add Funds to Account
            </h2>
            <p className="text-slate-400 text-xs mt-1">Instant fund addition via UPI, NetBanking & Bank Transfer</p>

            {/* Current Balance Snapshot */}
            <div className="mt-4 p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Available Trading Balance</span>
                <span className="text-xl font-black text-white">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 block">Demat ID</span>
                <span className="text-xs font-mono font-bold text-emerald-400">IN303028130</span>
              </div>
            </div>

            {/* Tabs (only show on form stage) */}
            {stage === 'form' && (
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
            )}
          </div>

          {/* ── STAGE 1: FORM VIEW ── */}
          {stage === 'form' && activeTab === 'add' && (
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

                {/* Sub-options for UPI */}
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

                {/* Sub-options for Netbanking */}
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

                {/* Sub-options for NEFT/RTGS */}
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

              {/* Proceed Action Button */}
              <button
                onClick={handleProceedPayment}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                <span>Proceed to Pay ₹{parseFloat(amount || '0').toLocaleString('en-IN')}</span>
              </button>
            </div>
          )}

          {/* ── STAGE 1 (History): RECENT DEPOSITS ── */}
          {stage === 'form' && activeTab === 'history' && (
            <div className="p-6 flex flex-col gap-4 max-h-[420px] overflow-y-auto">
              <h3 className="font-black text-sm text-[#0F172A]">Recent Fund Deposits</h3>
              <div className="flex flex-col gap-2.5">
                {[
                  { id: 'TXN-90821', date: 'Today, 10:45 AM', amount: '₹25,000', method: 'UPI (GPay)', status: 'Success' },
                  { id: 'TXN-88412', date: 'July 18, 2026', amount: '₹50,000', method: 'NetBanking (HDFC)', status: 'Success' },
                  { id: 'TXN-76120', date: 'July 10, 2026', amount: '₹1,00,000', method: 'NEFT Transfer', status: 'Success' },
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
          )}

          {/* ── STAGE 2: UPI WAITING SCREEN ── */}
          {stage === 'upi_waiting' && (
            <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center gap-5 bg-slate-50">
              {/* Pulsing Radar Loader */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-ping opacity-75" />
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg relative z-10">
                  <Smartphone className="w-8 h-8 animate-pulse" />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                  Waiting for UPI Approval
                </span>
                <h3 className="text-xl font-black text-[#0F172A] mt-3">
                  Approve ₹{parseFloat(amount || '0').toLocaleString('en-IN')} on {customUpiId || selectedUpiApp.toUpperCase()}
                </h3>
                <p className="text-slate-500 text-xs mt-1.5 max-w-sm mx-auto font-medium leading-relaxed">
                  Open your UPI app ({customUpiId || selectedUpiApp.toUpperCase()}) on your phone and approve the payment request from <strong>Univest Brokerage</strong>.
                </p>
              </div>

              {/* Countdown Timer */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 w-full max-w-xs flex flex-col items-center gap-1 shadow-2xs">
                <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                  <Clock className="w-4 h-4 text-blue-600" /> Time Remaining to Complete:
                </div>
                <span className="text-2xl font-mono font-black text-blue-600 tracking-wider">
                  {formatTimer(upiTimer)}
                </span>
              </div>

              {/* Simulation Helper */}
              <div className="w-full bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex flex-col gap-3 text-left">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-black text-blue-900 uppercase">Test Payment Simulation</span>
                </div>
                <p className="text-[11px] text-blue-800 font-medium">
                  In production, your UPI app receives a push notification. For this demo, click below to simulate instant payment approval.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleCompletePayment}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs transition cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" /> Simulate Approve Payment
                  </button>
                  <button
                    onClick={handleCancelPayment}
                    className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STAGE 3: NETBANKING GATEWAY REDIRECT SCREEN ── */}
          {stage === 'netbanking_waiting' && (
            <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center gap-5 bg-slate-50">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shadow-md">
                <Building2 className="w-8 h-8 animate-bounce" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                  Bank Gateway Portal
                </span>
                <h3 className="text-xl font-black text-[#0F172A] mt-3">
                  Connecting to {selectedBank} NetBanking...
                </h3>
                <p className="text-slate-500 text-xs mt-1.5 max-w-sm mx-auto font-medium">
                  Please do not refresh or close this browser window while we authenticate your transaction with {selectedBank}.
                </p>
              </div>

              {/* Details summary */}
              <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-xs flex flex-col gap-2 font-medium text-slate-600 text-left shadow-2xs">
                <div className="flex justify-between">
                  <span>Merchant:</span>
                  <span className="font-bold text-slate-900">Univest Brokerage Pvt Ltd</span>
                </div>
                <div className="flex justify-between">
                  <span>Bank Chosen:</span>
                  <span className="font-bold text-indigo-600">{selectedBank}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-black text-slate-900">₹{parseFloat(amount || '0').toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Simulation action */}
              <div className="w-full flex gap-2">
                <button
                  onClick={handleCompletePayment}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" /> Simulate Authorize at {selectedBank}
                </button>
                <button
                  onClick={handleCancelPayment}
                  className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* ── STAGE 4: NEFT / RTGS REQUEST REGISTERED SCREEN ── */}
          {stage === 'neft_registered' && (
            <div className="p-6 md:p-8 flex flex-col gap-5 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center font-bold shrink-0">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                    Bank Batch Settlement
                  </span>
                  <h3 className="text-lg font-black text-[#0F172A] mt-1">NEFT / RTGS Transfer Details Registered</h3>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="font-medium leading-relaxed">
                  NEFT/RTGS transfers are cleared in half-hourly RBI batches. Money will reflect in your account within <strong>30–60 minutes</strong> after your bank processes the payment.
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs flex flex-col gap-2 font-mono text-slate-700 shadow-2xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans">Reference UTR:</span>
                  <span className="font-bold text-slate-900">{utrNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans">Amount:</span>
                  <span className="font-black text-slate-900 font-sans">₹{parseFloat(amount || '0').toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans">Expected Credit Time:</span>
                  <span className="font-bold text-purple-600 font-sans">Within 30 Mins (Batch Clearing)</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCompletePayment}
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 fill-white" /> Simulate RBI Batch Settlement Success
                </button>
                <button
                  onClick={handleResetModal}
                  className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* ── STAGE 5: SUCCESS OVERLAY ── */}
          {stage === 'success' && (
            <div className="p-8 flex flex-col items-center justify-center text-center gap-4 bg-slate-50">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#0F172A]">Deposit Successful!</h3>
                <p className="text-slate-600 text-sm mt-1 font-medium">
                  ₹{parseFloat(amount).toLocaleString('en-IN')} has been added to your trading wallet.
                </p>
              </div>

              <div className="w-full bg-white p-4 rounded-2xl border border-slate-200 text-xs flex flex-col gap-2 font-medium text-slate-600 shadow-2xs text-left">
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-mono font-bold text-slate-900">{lastTxnDetails?.id || `UNI-${Date.now().toString().slice(-8)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="font-bold text-slate-900">{lastTxnDetails?.method || paymentMethod.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Updated Cash Balance:</span>
                  <span className="font-black text-emerald-600">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <button
                onClick={handleResetModal}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-sm transition shadow-md cursor-pointer mt-2"
              >
                Done & Return to Dashboard
              </button>
            </div>
          )}

          {/* ── STAGE 6: FAILED OVERLAY ── */}
          {stage === 'failed' && (
            <div className="p-8 flex flex-col items-center justify-center text-center gap-4 bg-slate-50">
              <div className="w-16 h-16 rounded-full bg-rose-100 border-2 border-rose-500 text-rose-600 flex items-center justify-center shadow-lg">
                <X className="w-10 h-10 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#0F172A]">Payment Request Timed Out</h3>
                <p className="text-slate-600 text-sm mt-1 font-medium">
                  We didn't receive confirmation from your UPI app in time.
                </p>
              </div>

              <button
                onClick={() => setStage('form')}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-sm transition shadow-md cursor-pointer mt-2"
              >
                Try Again
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddFundsModal;
