import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';
import { LoginIllustration } from '../components/auth/LoginIllustration';
import { TrustBadges } from '../components/auth/TrustBadges';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
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
    if (otpSent) window.setTimeout(() => otpRefs.current[0]?.focus(), 150); 
  }, [otpSent]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    
    setIsLoading(true);
    try {
      // 1. Check if email exists
      const checkRes = await api.get(`/auth/check-email?email=${encodeURIComponent(email)}`);
      if (!checkRes.data.exists) {
        setErrorMessage('No account found with this email. Please create an account.');
        setIsLoading(false);
        return;
      }

      // 2. Send OTP
      await api.post('/auth/send-otp', { email });
      setOtpSent(true); 
      setResendAfter(30);
      toast.success('OTP sent to your email');
    } catch (error) {
      console.error("Failed to send OTP", error);
      setErrorMessage("Failed to send OTP. Please check your email or try again later.");
    } finally {
      setIsLoading(false); 
    }
  };

  const handleVerifyOtp = async () => { 
    if (otp.some(value => !value) || isLoading) return; 
    setIsLoading(true); 
    
    try {
      const otpString = otp.join('');
      
      const response = await api.post('/auth/login', {
        email: email,
        otp: otpString
      });
      
      const { access_token } = response.data;
      
      const userRes = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      
      login(access_token, userRes.data);
      toast.success('Welcome back to Univest!');
      navigate('/dashboard');
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
    if (otp.every(Boolean)) handleVerifyOtp(); 
    /* eslint-disable-next-line react-hooks/exhaustive-deps */ 
  }, [otp]);

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
            className="absolute top-1/4 right-[-10%] w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[80px]"
          />
          <motion.div
            animate={{ 
              scale: [1, 0.9, 1.1, 1],
              x: [0, -20, 40, 0],
              y: [0, 30, -30, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-1/4 left-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]"
          />

          {/* Glowing Wavy Fluid Silk Mesh Ribbon via SVG */}
          <svg className="absolute inset-0 w-full h-full opacity-80" viewBox="0 0 500 800" fill="none" preserveAspectRatio="none">
            <defs>
              <linearGradient id="silkWave" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.05" />
                <stop offset="35%" stopColor="#1E4ED8" stopOpacity="0.3" />
                <stop offset="70%" stopColor="#059669" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="silkWave2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#10B981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#065F46" stopOpacity="0.6" />
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-600/30">
            U
          </div>
          <span className="font-black text-xl tracking-tight text-white font-display">UNIVEST</span>
        </div>

        {/* Bottom Left Teaser Text */}
        <div className="z-10 text-left mt-auto">
          <h2 className="text-[42px] leading-[1.1] font-black text-white font-display tracking-tight">
            Fast, Secure,<br />Profitable
          </h2>
        </div>
      </div>

      {/* Right Column: Interactive Login Form (White Background) */}
      <div className="min-h-screen p-8 sm:p-16 md:p-24 bg-white flex flex-col justify-center text-slate-900 overflow-y-auto">
        <div className="max-w-md w-full mx-auto flex flex-col justify-between min-h-[550px]">
          <div>
            {/* Form Header */}
            <div className="mb-8 text-left">
              <div className="lg:hidden flex items-center gap-2 mb-6">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center font-black text-lg text-white shadow-md">
                  U
                </div>
                <span className="font-black text-lg text-slate-900 font-display">UNIVEST</span>
              </div>

              {!otpSent ? (
                <>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sign in</h1>
                  <p className="text-slate-400 text-xs font-semibold mt-1">Access to your Univest account</p>
                </>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Verify Email</h1>
                    <p className="text-slate-400 text-xs font-semibold mt-1">
                      We sent a 6-digit code to <span className="font-bold text-slate-700">{email}</span>.
                    </p>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                </div>
              )}
            </div>

            {/* Social Logins */}
            {!otpSent && (
              <div className="grid grid-cols-3 gap-3 mb-6">
                {/* Apple Button */}
                <button 
                  type="button"
                  className="flex items-center justify-center py-2.5 bg-slate-50 border border-slate-200/60 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.51-.62.71-1.16 1.85-1.01 2.96 1.12.09 2.27-.56 2.96-1.41z" />
                  </svg>
                </button>

                {/* Google Button */}
                <button 
                  type="button"
                  className="flex items-center justify-center py-2.5 bg-slate-50 border border-slate-200/60 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.636 0-8.24-3.568-8.24-8.03s3.604-8.03 8.24-8.03c2.27 0 4.19.82 5.67 2.23l3.227-3.227C18.42 1.295 15.54 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c6.76 0 12.24-5.48 12.24-12.24 0-.853-.08-1.579-.24-2.24H12.24z" />
                    <path fill="#4285F4" d="M24.24 12.24c0-.853-.08-1.579-.24-2.24H12.24v4.4h6.887c-.288 1.074-1.002 2.115-2.028 2.836l3.187 2.47c1.86-1.716 2.944-4.24 2.944-7.466z" />
                    <path fill="#FBBC05" d="M12.24 24.48c3.3 0 6.075-1.09 8.1-2.97l-3.187-2.47c-.895.599-2.046.953-3.253.953-4.368 0-6.239-1.704-6.887-4.114L3.805 18.28c1.99 3.96 6.096 6.2 10.195 6.2z" />
                    <path fill="#34A853" d="M5.353 14.88c-.347-1.074-.543-2.203-.543-3.36s.196-2.286.543-3.36l-3.226-2.49c-.72 1.44-1.127 3.07-1.127 4.8s.407 3.36 1.127 4.8l3.226-2.49z" />
                  </svg>
                </button>

                {/* X Button */}
                <button 
                  type="button"
                  className="flex items-center justify-center py-2.5 bg-slate-50 border border-slate-200/60 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>
              </div>
            )}

            {/* Separator */}
            {!otpSent && (
              <div className="relative flex items-center justify-center mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <span className="relative px-3 bg-white text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  or sign in with email
                </span>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/5 p-3 text-[13px] font-bold text-rose-500 text-left">
                {errorMessage}
              </div>
            )}

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                {/* Email Address */}
                <div className={`relative border rounded-xl px-4 py-2.5 transition-colors text-left bg-white ${
                  errorMessage ? 'border-rose-500 bg-rose-500/5' : 'border-slate-200 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/30'
                }`}>
                  <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
                    E-Mail address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent border-none outline-none text-slate-900 placeholder-slate-350 text-xs font-semibold p-0 focus:ring-0 focus:outline-none"
                    required
                  />
                </div>

                {/* Keep me logged in & Forgot password */}
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      className="w-3.5 h-3.5 rounded border-slate-300 text-[#0D5C4E] focus:ring-[#0D5C4E]" 
                    />
                    <span>Keep me logged in</span>
                  </label>
                  <button 
                    type="button"
                    onClick={() => navigate('/forgot-password')} 
                    className="text-[#0D5C4E] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full py-3.5 bg-[#0D5C4E] hover:bg-[#0A4E42] active:bg-[#073D33] text-white font-black text-xs rounded-xl tracking-wider uppercase transition shadow-md shadow-[#0D5C4E]/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Login</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
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
                      className="h-12 w-11 sm:h-14 sm:w-12 rounded-xl border border-slate-200 bg-slate-50 text-center text-lg font-black text-slate-900 outline-none transition focus:border-[#0D5C4E] focus:bg-white focus:shadow-md"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <button 
                    type="button"
                    onClick={() => { setOtpSent(false); setErrorMessage(''); }} 
                    className="text-[#0D5C4E] hover:underline"
                  >
                    Change email
                  </button>
                  <button 
                    type="button"
                    onClick={() => { 
                      if (!resendAfter) { 
                        setOtp(Array(6).fill('')); 
                        handleSendOtp();
                      } 
                    }} 
                    disabled={Boolean(resendAfter)} 
                    className="text-[#0D5C4E] hover:underline disabled:text-slate-300 disabled:no-underline"
                  >
                    {resendAfter ? `Resend in ${resendAfter}s` : 'Resend code'}
                  </button>
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={isLoading || otp.some(v => !v)}
                  className="w-full py-3.5 bg-[#0D5C4E] hover:bg-[#0A4E42] active:bg-[#073D33] text-white font-black text-xs rounded-xl tracking-wider uppercase transition shadow-md shadow-[#0D5C4E]/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Secure Log In</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Bottom Register Link */}
            <div className="mt-6 text-center text-xs">
              <span className="text-slate-400 font-semibold">Don't have an account? </span>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-[#0D5C4E] font-black hover:underline transition-colors"
              >
                Register
              </button>
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

export default Login;
