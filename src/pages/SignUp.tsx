import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Check, ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { TrustBadges } from '../components/auth/TrustBadges';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';
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
      const checkRes = await authService.checkEmail(formData.email);
      if (checkRes.exists) {
        toast.error('You already have an account with this email. Please log in.');
        setIsLoading(false);
        navigate('/login', { state: { identifier: formData.email } });
        return;
      }

      // 2. Send OTP
      await authService.sendOtp({ email: formData.email });
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
        await authService.register({
          full_name: formData.name,
          email: formData.email,
          otp: otpString
        });
      } catch (regError: any) {
        // If user already exists, we might still be able to login, but ideally they shouldn't reach here if check-email worked
        if (regError.response?.status !== 409) {
          throw regError;
        }
      }
      
      // 2. Login
      const response = await authService.login({
        email: formData.email,
        otp: otpString
      });
      
      const { access_token } = response;
      
      // 3. Fetch User
      const userRes = await authService.getUserProfile(access_token);
      
      login(access_token, userRes);
      
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
    <div className="min-h-screen w-full grid lg:grid-cols-2 gap-0 bg-white font-sans text-slate-900 relative overflow-hidden">
      
      {/* Left Column: Liquid Gradient Ribbon & Teaser Banner */}
      <div className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden bg-[#030712] min-h-screen">
        
        {/* Fluid Ribbon background waves */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#030712]">
          {/* Glowing animated background blobs */}
          <motion.div
            animate={{ 
              scale: [1, 1.15, 0.95, 1],
              x: [0, 30, -20, 0],
              y: [0, -40, 20, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 right-[-10%] w-[350px] h-[350px] bg-purple-500/20 rounded-full blur-[80px]"
          />
          <motion.div
            animate={{ 
              scale: [1, 0.9, 1.1, 1],
              x: [0, -20, 40, 0],
              y: [0, 30, -30, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-1/4 left-[-10%] w-[400px] h-[400px] bg-[#2B2440]/40 rounded-full blur-[100px]"
          />

          {/* Glowing Wavy Fluid Silk Mesh Ribbon via SVG */}
          <svg className="absolute inset-0 w-full h-full opacity-80" viewBox="0 0 500 800" fill="none" preserveAspectRatio="none">
            <defs>
              <linearGradient id="silkWave" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2B2440" stopOpacity="0.1" />
                <stop offset="35%" stopColor="#7E22CE" stopOpacity="0.4" />
                <stop offset="70%" stopColor="#A855F7" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#D8B4FE" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="silkWave2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B0764" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#7E22CE" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#581C87" stopOpacity="0.7" />
              </linearGradient>
              <filter id="waveGlow">
                <feGaussianBlur stdDeviation="15" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <motion.path
              animate={{
                d: [
                  "M 350,0 C 420,150 250,350 300,500 C 350,650 480,720 400,800 L 500,800 L 500,0 Z",
                  "M 380,0 C 390,200 280,300 320,520 C 360,740 460,700 420,800 L 500,800 L 500,0 Z",
                  "M 350,0 C 420,150 250,350 300,500 C 350,650 480,720 400,800 L 500,800 L 500,0 Z"
                ]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              d="M 350,0 C 420,150 250,350 300,500 C 350,650 480,720 400,800 L 500,800 L 500,0 Z"
              fill="url(#silkWave)"
              filter="url(#waveGlow)"
            />
            <motion.path
              animate={{
                d: [
                  "M 300,0 C 380,180 200,300 260,480 C 320,660 440,750 370,800 L 500,800 L 500,0 Z",
                  "M 320,0 C 360,140 230,340 280,460 C 330,580 410,780 390,800 L 500,800 L 500,0 Z",
                  "M 300,0 C 380,180 200,300 260,480 C 320,660 440,750 370,800 L 500,800 L 500,0 Z"
                ]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              d="M 300,0 C 380,180 200,300 260,480 C 320,660 440,750 370,800 L 500,800 L 500,0 Z"
              fill="url(#silkWave2)"
            />
          </svg>
        </div>

        {/* Top Left Logo */}
        <div className="flex items-center gap-3 z-10 text-left">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2B2440] to-purple-700 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-purple-900/30">
            U
          </div>
          <span className="font-black text-xl tracking-tight text-white font-display">UNIVEST</span>
        </div>

        {/* Bottom Left Teaser Text */}
        <div className="z-10 text-left mt-auto">
          <h2 className="text-[42px] leading-[1.1] font-black text-white font-display tracking-tight">
            Begin Your<br />Investment<br />Journey
          </h2>
          <p className="text-slate-400 text-sm font-medium mt-4 max-w-sm leading-relaxed">
            Open your free SEBI-compliant trading & research advisory account in under 2 minutes.
          </p>
        </div>
      </div>

      {/* Right Column: Interactive Signup Form (White Background) */}
      <div className="min-h-screen p-8 sm:p-16 md:p-24 bg-white relative flex flex-col justify-center text-slate-900 overflow-y-auto">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-md w-full mx-auto relative z-10 flex flex-col justify-between min-h-[550px]">
          <div>
            <div className="mb-6 text-left">
              <div className="lg:hidden flex items-center gap-2 mb-6">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-emerald-500 flex items-center justify-center font-black text-lg text-white shadow-md">
                  U
                </div>
                <span className="font-black text-lg text-slate-900 font-display">UNIVEST</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Create Account</h1>
              <p className="text-slate-400 text-[15px] font-medium mt-2">Start building your stock portfolio with AI insights</p>
            </div>

            {/* Step Progress Bar */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2].map((s) => (
                <React.Fragment key={s}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition ${
                    s === step ? 'bg-purple-700 text-white' : s < step ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {s < step ? <Check className="w-3.5 h-3.5" /> : s}
                  </div>
                  {s < 2 && <div className={`flex-1 h-1 rounded-full transition ${s < step ? 'bg-purple-700' : 'bg-slate-100'}`} />}
                </React.Fragment>
              ))}
            </div>

            {errorMessage && (
              <div className="mb-6 rounded-xl border border-danger/30 bg-danger/5 p-3 text-[13px] font-bold text-danger text-left">
                {errorMessage}
              </div>
            )}

            {step === 1 ? (
                <form className="space-y-5 text-left" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-1">Full Name *</label>
                    <div className="relative border border-slate-200/60 rounded-[16px] px-5 py-3 bg-slate-50 focus-within:bg-white focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10 focus-within:shadow-sm transition-all duration-300">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your full name"
                        className="w-full pl-8 bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 text-[15px] font-medium py-1 focus:ring-0 focus:outline-none"
                      />
                    </div>
                    {errors.name && <span className="text-[11px] font-bold text-danger mt-1 block">{errors.name}</span>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-1">Email Address *</label>
                    <div className="relative border border-slate-200/60 rounded-[16px] px-5 py-3 bg-slate-50 focus-within:bg-white focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10 focus-within:shadow-sm transition-all duration-300">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full pl-8 bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 text-[15px] font-medium py-1 focus:ring-0 focus:outline-none"
                      />
                    </div>
                    {errors.email && <span className="text-[11px] font-bold text-danger mt-1 block">{errors.email}</span>}
                  </div>

                  <div className="flex items-center gap-2 pt-1 pb-2">
                    <input
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 text-purple-700 focus:ring-purple-700"
                    />
                    <span className="text-[13px] font-bold text-slate-400">I agree to SEBI advisory terms & privacy policy</span>
                  </div>
                  {errors.acceptTerms && <span className="text-[11px] font-bold text-danger block -mt-2 mb-2">{errors.acceptTerms}</span>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 active:scale-[0.98] text-white font-black text-[14px] rounded-xl tracking-[0.15em] uppercase transition-all duration-300 shadow-xl shadow-purple-700/25 hover:shadow-2xl hover:shadow-purple-700/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:scale-100 disabled:shadow-none mt-6"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Please wait...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
            ) : (
              <div className="space-y-6 text-left">
                <div className="flex items-start justify-between gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">Verify Email</h3>
                    <p className="text-slate-400 text-xs font-semibold mt-1">
                      Code sent to <span className="font-bold text-slate-700">{formData.email}</span>.
                    </p>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 shrink-0">
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
                      className="h-12 w-11 sm:h-14 sm:w-12 rounded-xl border border-slate-200/60 bg-slate-50 text-center text-lg font-black text-slate-900 outline-none transition-all duration-300 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:shadow-sm"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <button onClick={() => { setStep(1); setErrorMessage(''); }} className="text-purple-700 hover:underline transition-colors">
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
                    className="text-purple-700 hover:underline disabled:text-slate-300 disabled:no-underline transition-colors"
                  >
                    {resendAfter ? `Resend in ${resendAfter}s` : 'Resend code'}
                  </button>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setErrorMessage(''); }}
                    className="py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs rounded-xl cursor-pointer uppercase tracking-wider transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isLoading || otp.some(v => !v)}
                    className="flex-1 py-4 bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 active:scale-[0.98] disabled:opacity-50 disabled:hover:bg-purple-700 text-white font-black text-[14px] rounded-xl transition-all duration-300 shadow-xl shadow-purple-700/25 hover:shadow-2xl hover:shadow-purple-700/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:hover:translate-y-0 disabled:hover:scale-100 disabled:shadow-none uppercase tracking-[0.15em]"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>{isLoading ? 'Creating...' : 'Complete'}</span>
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 text-center text-xs">
              <span className="text-slate-400 font-semibold">
                Already registered?{' '}
                <button onClick={() => navigate('/login')} className="text-purple-700 font-black hover:underline transition-colors">
                  Sign In
                </button>
              </span>
            </div>
          </div>

          <div className="mt-8">
            <TrustBadges light={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
