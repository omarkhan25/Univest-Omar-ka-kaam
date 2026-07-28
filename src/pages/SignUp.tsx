import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Check, ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';
import { SignupIllustration } from '../components/auth/SignupIllustration';
import { TrustBadges } from '../components/auth/TrustBadges';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    acceptTerms: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState('');
  
  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [resendAfter, setResendAfter] = useState(30);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => { 
    if (!otpSent || resendAfter === 0) return; 
    const timer = window.setTimeout(() => setResendAfter(value => value - 1), 1000); 
    return () => window.clearTimeout(timer); 
  }, [otpSent, resendAfter]);

  useEffect(() => { 
    if (otpSent && step === 2) window.setTimeout(() => otpRefs.current[0]?.focus(), 150); 
  }, [otpSent, step]);

  const handleSendOtp = async () => {
    setErrorMessage('');
    setIsLoading(true);
    try {
      // 1. Check if email exists
      const checkRes = await api.get(`/auth/check-email?email=${encodeURIComponent(formData.email)}`);
      if (checkRes.data.exists) {
        setErrorMessage('You already have an account with this email. Please log in.');
        setIsLoading(false);
        return;
      }

      // 2. Send OTP
      await api.post('/auth/send-otp', { email: formData.email });
      setOtpSent(true); 
      setResendAfter(30);
      setStep(2);
      toast.success('OTP sent to your email');
    } catch (error) {
      console.error("Failed to send OTP", error);
      setErrorMessage("Failed to send OTP. Please check your email or try again later.");
    } finally {
      setIsLoading(false); 
    }
  };

  const handleNext = () => {
    if (step === 1) {
      const newErr: Record<string, string> = {};
      if (!formData.name) newErr.name = 'Full name is required';
      if (!formData.email) newErr.email = 'Email is required';
      if (!formData.mobile) newErr.mobile = 'Mobile number is required';
      if (!formData.acceptTerms) newErr.acceptTerms = 'You must accept the terms';

      if (Object.keys(newErr).length > 0) {
        setErrors(newErr);
        return;
      }
      setErrors({});
      handleSendOtp();
    }
  };

  const handleVerifyOtp = async () => { 
    if (otp.some(value => !value) || isLoading) return; 
    setIsLoading(true); 
    setErrorMessage('');
    
    try {
      const otpString = otp.join('');
      
      // 1. Register
      try {
        await api.post('/auth/register', {
          full_name: formData.name,
          email: formData.email,
          otp: otpString,
          phone_number: formData.mobile || undefined
        });
      } catch (regError: any) {
        // If user already exists, we might still be able to login, but ideally they shouldn't reach here if check-email worked
        if (regError.response?.status !== 409) {
          throw regError;
        }
      }
      
      // 2. Login
      const response = await api.post('/auth/login', {
        email: formData.email,
        otp: otpString
      });
      
      const { access_token } = response.data;
      
      // 3. Fetch User
      const userRes = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      
      login(access_token, userRes.data);
      
      toast.success('Account created! Proceeding to KYC & Document verification...');
      navigate('/onboarding', { state: { name: formData.name, email: formData.email, mobile: formData.mobile } });
    } catch (error) {
      console.error("Auth Error", error);
      setErrorMessage("Authentication failed. Invalid OTP.");
      setOtp(Array(6).fill(''));
      otpRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    if (step === 2 && otp.every(Boolean)) handleVerifyOtp(); 
    /* eslint-disable-next-line react-hooks/exhaustive-deps */ 
  }, [otp, step]);

  const setDigit = (index: number, raw: string) => { 
    const next = [...otp]; 
    next[index] = raw.replace(/\D/g, '').slice(-1); 
    setOtp(next); 
    if (next[index] && index < 5) otpRefs.current[index + 1]?.focus(); 
  };

  const pasteOtp = (event: React.ClipboardEvent<HTMLInputElement>) => { 
    const digits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split(''); 
    if (!digits.length) return; 
    event.preventDefault(); 
    setOtp([...digits, ...Array(6).fill('')].slice(0, 6)); 
    otpRefs.current[Math.min(digits.length, 5)]?.focus(); 
  };

  return (
    <div className="min-h-screen bg-[#070B14] flex items-center justify-center p-4 sm:p-6 font-sans text-slate-100">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-0 bg-[#0F172A] border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl">
        
        {/* Left Column: Illustration */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border-r border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 font-black text-white text-lg flex items-center justify-center shadow-md">
              U
            </div>
            <span className="font-black text-xl tracking-tight text-white">UNIVEST</span>
          </div>

          <div className="my-auto flex flex-col items-center text-center">
            <SignupIllustration />
            <h2 className="text-2xl font-black text-white mt-6 tracking-tight">
              Begin Your Investment Journey
            </h2>
            <p className="text-slate-400 text-xs font-medium mt-2 max-w-sm leading-relaxed">
              Open your free SEBI-compliant trading & research advisory account in under 2 minutes.
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 border-t border-slate-800/60 pt-4">
            <span>Free Account</span>
            <span>Zero Annual Charges</span>
          </div>
        </div>

        {/* Right Column: Multi-Step Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Create Account</h1>
              <p className="text-slate-400 text-xs font-medium mt-1">Start building your stock portfolio with AI insights</p>
            </div>

            {/* Step Progress Bar */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2].map((s) => (
                <React.Fragment key={s}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition ${
                    s === step ? 'bg-blue-600 text-white' : s < step ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {s < step ? <Check className="w-3.5 h-3.5" /> : s}
                  </div>
                  {s < 2 && <div className={`flex-1 h-1 rounded-full transition ${s < step ? 'bg-emerald-500' : 'bg-slate-800'}`} />}
                </React.Fragment>
              ))}
            </div>

            {errorMessage && (
              <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-[13px] font-bold text-rose-500">
                {errorMessage}
              </div>
            )}

            {step === 1 ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-3 bg-[#1E293B] border border-slate-700 rounded-xl text-xs font-medium text-white placeholder-slate-500 outline-none focus:border-blue-500"
                    />
                  </div>
                  {errors.name && <span className="text-[11px] font-bold text-rose-500 mt-1 block">{errors.name}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-[#1E293B] border border-slate-700 rounded-xl text-xs font-medium text-white placeholder-slate-500 outline-none focus:border-blue-500"
                    />
                  </div>
                  {errors.email && <span className="text-[11px] font-bold text-rose-500 mt-1 block">{errors.email}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Mobile Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="10-digit mobile number"
                      className="w-full pl-10 pr-4 py-3 bg-[#1E293B] border border-slate-700 rounded-xl text-xs font-medium text-white placeholder-slate-500 outline-none focus:border-blue-500"
                    />
                  </div>
                  {errors.mobile && <span className="text-[11px] font-bold text-rose-500 mt-1 block">{errors.mobile}</span>}
                </div>

                <div className="flex items-center gap-2 pt-1 pb-2">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-700 bg-[#1E293B] text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-300 font-medium">I agree to SEBI advisory terms & privacy policy</span>
                </div>
                {errors.acceptTerms && <span className="text-[11px] font-bold text-rose-500 block -mt-2 mb-2">{errors.acceptTerms}</span>}

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isLoading}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue with OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4 bg-[#1E293B] p-4 rounded-xl border border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">Verify Email</h3>
                    <p className="text-slate-400 text-xs font-medium mt-1">
                      Code sent to <span className="font-bold text-white">{formData.email}</span>.
                    </p>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-500/20 text-blue-400 shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                </div>

                {/* OTP Inputs */}
                <div className="flex justify-between gap-2" onPaste={pasteOtp}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={node => { otpRefs.current[index] = node; }}
                      value={digit}
                      onChange={event => setDigit(index, event.target.value)}
                      onKeyDown={event => { if (event.key === 'Backspace' && !otp[index] && index) otpRefs.current[index - 1]?.focus(); }}
                      inputMode="numeric"
                      maxLength={1}
                      aria-label={`OTP digit ${index + 1}`}
                      className="h-12 w-11 sm:h-14 sm:w-12 rounded-xl border border-slate-700 bg-[#1E293B] text-center text-lg font-black text-white outline-none transition focus:border-blue-500 focus:bg-slate-800"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <button onClick={() => { setStep(1); setErrorMessage(''); }} className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
                    Change details
                  </button>
                  <button 
                    onClick={() => { 
                      if (!resendAfter) { 
                        setOtp(Array(6).fill('')); 
                        handleSendOtp();
                      } 
                    }} 
                    disabled={Boolean(resendAfter)} 
                    className="font-bold text-blue-400 disabled:text-slate-500 transition-colors"
                  >
                    {resendAfter ? `Resend in ${resendAfter}s` : 'Resend code'}
                  </button>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setErrorMessage(''); }}
                    className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isLoading || otp.some(v => !v)}
                    className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white font-black text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <span className="text-xs text-slate-400 font-medium">
                Already registered?{' '}
                <button onClick={() => navigate('/login')} className="text-blue-400 font-black hover:text-blue-300">
                  Sign In
                </button>
              </span>
            </div>
          </div>

          <div className="mt-6">
            <TrustBadges />
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignUp;
