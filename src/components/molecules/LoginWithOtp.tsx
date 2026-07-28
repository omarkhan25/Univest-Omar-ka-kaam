import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Headphones, LockKeyhole, MessageSquareCode, ShieldCheck, Smartphone, UserRound, Mail } from 'lucide-react';
import { Button } from '../atoms/Button';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

type AuthTab = 'login' | 'signup';

export const LoginWithOtp = () => {
  const params = new URLSearchParams(window.location.search);
  const initialTab: AuthTab = params.get('tab') === 'signup' || params.get('mode') === 'new' ? 'signup' : 'login';
  const [tab, setTab] = useState<AuthTab>(initialTab);
  const [email, setEmail] = useState(params.get('email') || '');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [resendAfter, setResendAfter] = useState(30);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const isSignup = tab === 'signup';
  
  const { login } = useAuth();

  useEffect(() => { 
    if (!otpSent || resendAfter === 0) return; 
    const timer = window.setTimeout(() => setResendAfter(value => value - 1), 1000); 
    return () => window.clearTimeout(timer); 
  }, [otpSent, resendAfter]);

  useEffect(() => { 
    if (otpSent) window.setTimeout(() => otpRefs.current[0]?.focus(), 150); 
  }, [otpSent]);

  const finish = async () => { 
    if (otp.some(value => !value) || isLoading) return; 
    setIsLoading(true); 
    
    try {
      const otpString = otp.join('');
      
      if (isSignup) {
        // Register API call
        try {
          await api.post('/auth/register', {
            full_name: name,
            email: email,
            otp: otpString,
            phone_number: phone || undefined
          });
        } catch (regError: any) {
          // If 409 Conflict (User already exists), we can safely ignore and just log them in
          if (regError.response?.status !== 409) {
            throw regError;
          }
        }
      }
      
      // Login API call
      const response = await api.post('/auth/login', {
        email: email,
        otp: otpString
      });
      
      const { access_token } = response.data;
      
      // Fetch user data using the token
      const userRes = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      
      login(access_token, userRes.data);
      
      window.location.href = isSignup ? '/onboarding' : '/design-system';
    } catch (error) {
      console.error("Auth Error", error);
      alert("Authentication failed. Invalid OTP or account error.");
      setOtp(Array(6).fill(''));
      otpRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    if (otp.every(Boolean)) finish(); 
    /* eslint-disable-next-line react-hooks/exhaustive-deps */ 
  }, [otp]);

  const submitAuth = async (event: React.FormEvent) => { 
    event.preventDefault(); 
    setErrorMessage('');
    if (!email.includes('@') || (isSignup && !name.trim())) return; 
    setIsLoading(true); 
    
    try {
      if (isSignup) {
        const checkRes = await api.get(`/auth/check-email?email=${encodeURIComponent(email)}`);
        if (checkRes.data.exists) {
          setErrorMessage('You already have an account with this email. Please log in.');
          setTab('login');
          setIsLoading(false);
          return;
        }
      } else {
        const checkRes = await api.get(`/auth/check-email?email=${encodeURIComponent(email)}`);
        if (!checkRes.data.exists) {
          setErrorMessage('No account found with this email. Please create an account.');
          setTab('signup');
          setIsLoading(false);
          return;
        }
      }

      await api.post('/auth/send-otp', { email });
      setOtpSent(true); 
      setResendAfter(30); 
    } catch (error) {
      console.error("Failed to send OTP", error);
      setErrorMessage("Failed to send OTP. Please check your email or try again later.");
    } finally {
      setIsLoading(false); 
    }
  };

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

  const switchTab = (next: AuthTab) => { 
    setTab(next); 
    setOtpSent(false); 
    setErrorMessage('');
    setOtp(Array(6).fill('')); 
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-5 py-6 text-[#111827] sm:grid sm:place-items-center sm:p-8">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-28 h-[30rem] w-[30rem] rounded-full bg-blue-200/35 blur-[110px]" />
        <div className="absolute -bottom-36 -left-24 h-96 w-96 rounded-full bg-emerald-100/55 blur-[100px]" />
      </div>
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }} className="relative mx-auto w-full max-w-[470px] rounded-[28px] border border-[#E2E8F0] bg-white p-6 shadow-[0_24px_65px_-25px_rgba(15,23,42,.22)] sm:p-9">
        <button onClick={() => window.location.href = '/get-started'} className="group mb-8 inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] transition hover:text-[#0F172A]">
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" /> Back to home
        </button>
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#16A34A] text-sm font-black text-white shadow-lg shadow-blue-200">U</div>
          <div>
            <p className="font-extrabold tracking-[-.04em] text-[#0F172A]">univest</p>
            <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#64748B]">Investment intelligence</p>
          </div>
        </div>
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-[#93C5FD] bg-[#DBEAFE] px-3 py-2 text-[11px] font-semibold text-[#1D4ED8]">
          <LockKeyhole className="h-4 w-4" /> Encrypted verification · Your details stay private
        </div>
        <AnimatePresence mode="wait">
          {!otpSent ? (
            <motion.form key="auth" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} onSubmit={submitAuth}>
              <h1 className="text-2xl font-black tracking-[-.045em] text-[#0F172A]">{isSignup ? 'Start investing with clarity' : 'Welcome back'}</h1>
              <p className="mt-2 text-sm leading-6 text-[#64748B]">{isSignup ? 'Create your secure account in under a minute.' : 'Sign in to continue with your research and portfolio.'}</p>
              
              {errorMessage && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[13px] font-medium text-red-600">
                  {errorMessage}
                </div>
              )}

              <div className="mt-6 grid grid-cols-2 rounded-xl bg-[#F1F5F9] p-1">
                <button type="button" onClick={() => switchTab('login')} className={`rounded-lg py-2.5 text-xs font-bold transition ${!isSignup ? 'bg-white text-[#2563EB] shadow-sm' : 'text-[#64748B]'}`}>Log in</button>
                <button type="button" onClick={() => switchTab('signup')} className={`rounded-lg py-2.5 text-xs font-bold transition ${isSignup ? 'bg-white text-[#2563EB] shadow-sm' : 'text-[#64748B]'}`}>Create account</button>
              </div>
              {isSignup && (
                <label className="mt-5 block text-xs font-bold text-[#0F172A]">
                  Full name
                  <div className="mt-2 flex items-center rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-blue-100">
                    <UserRound className="ml-3 h-4 w-4 text-[#2563EB]" />
                    <input autoFocus value={name} onChange={event => setName(event.target.value)} placeholder="Your full name" className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm font-normal outline-none placeholder:text-[#94A3B8]" />
                  </div>
                </label>
              )}
              <label className="mt-5 block text-xs font-bold text-[#0F172A]">
                Email address
                <div className="mt-2 flex items-center overflow-hidden rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-blue-100">
                  <span className="flex h-12 items-center gap-2 border-r border-[#E2E8F0] px-3 text-sm font-bold text-[#475569]">
                    <Mail className="h-4 w-4 text-[#2563EB]" />
                  </span>
                  <input autoFocus={!isSignup} type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm font-normal outline-none placeholder:text-[#94A3B8]" />
                </div>
              </label>
              {isSignup && (
                <label className="mt-5 block text-xs font-bold text-[#0F172A]">
                  Mobile number <span className="font-normal text-[#94A3B8]">(optional)</span>
                  <input type="tel" inputMode="numeric" value={phone} onChange={event => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" className="mt-2 h-12 w-full rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] px-3 text-sm font-normal outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-100" />
                </label>
              )}
              <Button type="submit" disabled={!email.includes('@') || (isSignup && !name.trim())} isLoading={isLoading} className="mt-6 w-full py-3.5 text-sm font-bold" icon={<MessageSquareCode className="h-4 w-4" />}>
                {isSignup ? 'Create account' : 'Continue with OTP'}
              </Button>
              <p className="mt-5 text-center text-xs text-[#64748B]">
                {isSignup ? (
                  <>Already have an account? <button type="button" onClick={() => switchTab('login')} className="font-bold text-[#2563EB] hover:underline">Log in</button></>
                ) : (
                  <>New to Univest? <button type="button" onClick={() => switchTab('signup')} className="font-bold text-[#2563EB] hover:underline">Create account</button></>
                )}
              </p>
            </motion.form>
          ) : (
            <motion.div key="otp" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black tracking-[-.045em] text-[#0F172A]">Verify your email</h1>
                  <p className="mt-2 text-sm leading-6 text-[#64748B]">
                    {isSignup && name ? `Hi ${name.split(' ')[0]}, we` : 'We'} sent a 6-digit code to <span className="font-bold text-[#0F172A]">{email}</span>.
                  </p>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#DCFCE7] text-[#166534]">
                  <ShieldCheck className="h-5 w-5" />
                </span>
              </div>
              <div className="mt-7 flex justify-between gap-2" onPaste={pasteOtp}>
                {otp.map((digit, index) => (
                  <input key={index} ref={node => { otpRefs.current[index] = node; }} value={digit} onChange={event => setDigit(index, event.target.value)} onKeyDown={event => { if (event.key === 'Backspace' && !otp[index] && index) otpRefs.current[index - 1]?.focus(); }} inputMode="numeric" maxLength={1} aria-label={`OTP digit ${index + 1}`} className="h-12 w-11 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-center text-lg font-extrabold text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-100 sm:h-14 sm:w-12" />
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between text-xs">
                <button onClick={() => setOtpSent(false)} className="font-semibold text-[#2563EB] hover:underline">Change details</button>
                <button 
                  onClick={(e) => { 
                    if (!resendAfter) { 
                      setOtp(Array(6).fill('')); 
                      submitAuth(e);
                    } 
                  }} 
                  disabled={Boolean(resendAfter)} 
                  className="font-semibold text-[#2563EB] disabled:text-[#94A3B8]">
                  {resendAfter ? `Resend in ${resendAfter}s` : 'Resend code'}
                </button>
              </div>
              <Button onClick={finish} disabled={otp.some(value => !value)} isLoading={isLoading} className="mt-6 w-full py-3.5 text-sm font-bold" icon={isLoading ? undefined : <CheckCircle2 className="h-4 w-4" />}>
                Verify & continue
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="mt-8 flex items-center justify-between border-t border-[#E2E8F0] pt-5 text-[11px] text-[#64748B]">
          <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[#16A34A]" /> SEBI compliant</span>
          <a className="flex items-center gap-1 font-semibold text-[#2563EB] hover:underline" href="mailto:support@univest.in"><Headphones className="h-3.5 w-3.5" /> Need help</a>
        </div>
      </motion.section>
    </main>
  );
};

export default LoginWithOtp;
