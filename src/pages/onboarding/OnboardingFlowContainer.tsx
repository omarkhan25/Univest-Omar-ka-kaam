import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Shield, CreditCard, Fingerprint, Camera, Landmark, FileText, Pen, Trophy, User, Clock, Lock, Star } from 'lucide-react';

import { WelcomeStep } from './WelcomeStep';
import { PersonalDetailsStep, type PersonalDetailsData } from './PersonalDetailsStep';
import { PANVerificationStep, type PANData } from './PANVerificationStep';
import { AadhaarVerificationStep, type AadhaarData } from './AadhaarVerificationStep';
import { BankDetailsStep, type BankData } from './BankDetailsStep';
import { AgreementsStep } from './AgreementsStep';

export const OnboardingFlowContainer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state as { name?: string; email?: string; mobile?: string }) || {};

  const [currentStep, setCurrentStep] = useState(1);
  const [personalData, setPersonalData] = useState<Partial<PersonalDetailsData>>({
    fullName: navState.name || 'Omar Khan',
    email: navState.email || 'omar@example.com',
    mobile: navState.mobile || '9876543210'
  });
  const [panData, setPanData] = useState<Partial<PANData>>({});
  const [aadhaarData, setAadhaarData] = useState<Partial<AadhaarData>>({});
  const [bankData, setBankData] = useState<Partial<BankData>>({});

  const totalSteps = 9;
  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
  const stepLabels = ['Welcome', 'PAN Card', 'Aadhaar', 'Selfie', 'Bank', 'Review', 'Signature', 'Agreement', 'Done'];

  const leftPanelContent: Record<number, { heading: string; sub: string; illustration: React.ReactNode }> = {
    1: {
      heading: 'Start Your Verified Journey',
      sub: 'Complete KYC in under 3 minutes. SEBI mandated, 100% secure.',
      illustration: (
        <div className="relative flex items-center justify-center w-full h-48">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute w-44 h-44 rounded-full border border-blue-500/20" />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute w-32 h-32 rounded-full border border-emerald-500/20" />
          <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/30 rounded-3xl flex items-center justify-center">
            <Shield className="w-9 h-9 text-emerald-400" />
          </div>
          {[{ label: 'SEBI', pos: 'top-2 left-2', color: 'text-blue-300 border-blue-500/30 bg-blue-500/10' },
            { label: 'SSL', pos: 'bottom-2 right-2', color: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10' },
            { label: 'DigiLocker', pos: 'top-2 right-2', color: 'text-purple-300 border-purple-500/30 bg-purple-500/10' }
          ].map(b => (
            <motion.div key={b.label} animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className={`absolute ${b.pos} px-2 py-0.5 rounded-full border text-[9px] font-bold ${b.color}`}>{b.label}</motion.div>
          ))}
        </div>
      )
    },
    2: {
      heading: 'PAN Card Verification',
      sub: 'Verified against NSDL Income Tax Database for identity authentication.',
      illustration: (
        <div className="relative w-full flex items-center justify-center h-48">
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-64 h-40 bg-gradient-to-br from-orange-500/20 to-yellow-500/10 border border-orange-500/30 rounded-2xl p-4 shadow-2xl shadow-orange-900/40 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[8px] font-black text-orange-300 tracking-widest">INCOME TAX DEPT. INDIA</div>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400/40 to-yellow-400/20" />
            </div>
            <div className="font-mono text-base font-black text-white/80 tracking-widest mb-2">ABCDE 1234 F</div>
            <div className="text-[9px] text-white/50 font-bold">NAME: OMAR KHAN</div>
            <div className="text-[9px] text-white/50 font-bold">DOB: 15/06/1995</div>
            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
              <Check className="w-2.5 h-2.5 text-emerald-400" />
              <span className="text-[8px] font-black text-emerald-300">NSDL Verified</span>
            </div>
          </motion.div>
        </div>
      )
    },
    3: {
      heading: 'Aadhaar Identity Lock',
      sub: 'Biometric verification using DigiLocker UIDAI offline eKYC.',
      illustration: (
        <div className="relative flex items-center justify-center w-full h-48">
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-64 h-40 bg-gradient-to-br from-blue-600/20 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-4 shadow-2xl shadow-blue-900/40 relative">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-[8px] font-black text-blue-300 tracking-widest">GOVERNMENT OF INDIA</div>
                <div className="text-[8px] font-bold text-blue-400/70">???? ?????</div>
              </div>
              <Fingerprint className="w-5 h-5 text-blue-300" />
            </div>
            <div className="text-[9px] text-white/50 font-bold">OMAR KHAN</div>
            <div className="font-mono text-sm font-black text-white/70 tracking-widest mt-3">1234 5678 9012</div>
            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
              <Check className="w-2.5 h-2.5 text-emerald-400" />
              <span className="text-[8px] font-black text-emerald-300">UIDAI Verified</span>
            </div>
          </motion.div>
        </div>
      )
    },
    4: {
      heading: 'Biometric Authentication',
      sub: 'Live selfie capture for liveness detection and photo-ID matching.',
      illustration: (
        <div className="relative flex items-center justify-center w-full h-48">
          <div className="relative w-36 h-36">
            {(['top-0 left-0','top-0 right-0','bottom-0 left-0','bottom-0 right-0'] as const).map((pos, i) => (
              <div key={i} className={`absolute w-5 h-5 ${pos} border-2 border-violet-400 ${i<2?'border-b-0':'border-t-0'} ${i%2===0?'border-r-0':'border-l-0'}`} />
            ))}
            <div className="w-full h-full rounded-full border-2 border-dashed border-violet-400/40 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                <User className="w-10 h-10 text-violet-400" />
              </div>
            </div>
            <motion.div animate={{ y: [-48, 48, -48] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-2 right-2 h-0.5 bg-violet-400/60 blur-sm top-1/2" />
          </div>
        </div>
      )
    },
    5: {
      heading: 'Link Your Payout Account',
      sub: 'Verified via ?1 penny-drop. Instant fund withdrawals after activation.',
      illustration: (
        <div className="relative flex items-center justify-center w-full h-48">
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-64 h-40 bg-gradient-to-br from-emerald-600/20 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-4 shadow-2xl shadow-emerald-900/40">
            <div className="flex items-start justify-between mb-5">
              <div className="w-10 h-7 bg-yellow-400/20 rounded-md border border-yellow-400/20 grid grid-cols-2 gap-0.5 p-1">
                <div className="bg-yellow-400/20 rounded-sm"/><div className="bg-yellow-400/20 rounded-sm"/>
                <div className="bg-yellow-400/20 rounded-sm"/><div className="bg-yellow-400/20 rounded-sm"/>
              </div>
              <Lock className="w-4 h-4 text-emerald-400/60" />
            </div>
            <div className="font-mono text-sm text-white/60 tracking-widest mb-2">•••• •••• •••• 4521</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[8px] text-white/40 font-bold">ACCOUNT HOLDER</div>
                <div className="text-[10px] text-white/70 font-black">OMAR KHAN</div>
              </div>
              <div className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                <Check className="w-2.5 h-2.5 text-emerald-400" />
                <span className="text-[8px] font-black text-emerald-300">Verified</span>
              </div>
            </div>
          </motion.div>
        </div>
      )
    },
    6: {
      heading: 'Final Details Review',
      sub: 'All documents verified. Completing your profile setup.',
      illustration: (
        <div className="flex flex-col items-center justify-center w-full h-48 gap-2.5">
          {['PAN Card', 'Aadhaar', 'Live Selfie', 'Bank Account'].map((item, i) => (
            <motion.div key={item} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
              className="w-full max-w-xs flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <span className="text-xs font-bold text-white/70">{item}</span>
              <div className="flex items-center gap-1 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black">Verified</span>
              </div>
            </motion.div>
          ))}
        </div>
      )
    },
    7: {
      heading: 'E-Signature Required',
      sub: 'Legally binding digital signature under IT Act 2000.',
      illustration: (
        <div className="relative flex items-center justify-center w-full h-48">
          <div className="relative w-56 h-36 bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl">
            <div className="h-2 w-28 bg-white/20 rounded mb-2" />
            <div className="h-1.5 w-20 bg-white/10 rounded mb-3" />
            <div className="h-px bg-white/10 mb-3" />
            <div className="space-y-1.5 mb-3">
              <div className="h-1.5 w-full bg-white/10 rounded" /><div className="h-1.5 w-5/6 bg-white/10 rounded" />
            </div>
            <div className="border-t border-dashed border-white/20 pt-2">
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}
                className="font-serif text-sm italic text-blue-400/80">Omar Khan</motion.div>
            </div>
            <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full border border-emerald-500/30 flex items-center justify-center">
              <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      )
    },
    8: {
      heading: 'SEBI Compliance Sign-Off',
      sub: 'Review and sign the SEBI Research Advisory Master Service Agreement.',
      illustration: (
        <div className="flex flex-col items-center justify-center w-full h-48 gap-3">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <div className="text-center">
            <div className="text-xs font-black text-white/70 tracking-widest">SEBI REGISTERED</div>
            <div className="text-[9px] text-white/40 font-bold mt-0.5">RA: INH000009821</div>
          </div>
          <div className="flex gap-1.5 flex-wrap justify-center">
            {['SEBI RA Act', 'IT Act 2000', 'PMLA'].map(b => (
              <span key={b} className="text-[9px] font-bold px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-white/50">{b}</span>
            ))}
          </div>
        </div>
      )
    },
    9: {
      heading: "You're Verified & Ready!",
      sub: 'KYC complete. Access the full power of Univest now.',
      illustration: (
        <div className="relative flex items-center justify-center w-full h-48">
          <div className="relative">
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-2xl shadow-emerald-900/40">
              <Trophy className="w-11 h-11 text-emerald-400" />
            </motion.div>
            {[{pos:'-top-4 -left-4',delay:0},{pos:'-top-4 -right-4',delay:0.3},{pos:'-bottom-4 -left-4',delay:0.6},{pos:'-bottom-4 -right-4',delay:0.9}].map((s,i) => (
              <motion.div key={i} animate={{ opacity:[0.3,1,0.3], scale:[0.8,1.2,0.8] }} transition={{ duration:1.5, repeat:Infinity, delay:s.delay }}
                className={`absolute ${s.pos}`}>
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </motion.div>
            ))}
          </div>
        </div>
      )
    }
  };

  const leftContent = leftPanelContent[currentStep];

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 gap-0 font-sans overflow-hidden">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-[#030a1a] min-h-screen">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div animate={{ scale:[1,1.2,1], x:[0,20,0], y:[0,-30,0] }} transition={{ duration:12, repeat:Infinity, ease:'easeInOut' }}
            className="absolute top-1/4 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[80px]" />
          <motion.div animate={{ scale:[1,0.9,1], x:[0,-20,0], y:[0,30,0] }} transition={{ duration:15, repeat:Infinity, ease:'easeInOut', delay:2 }}
            className="absolute bottom-1/4 left-0 w-80 h-80 bg-emerald-500/8 rounded-full blur-[100px]" />
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-600/30">U</div>
          <span className="font-black text-xl tracking-tight text-white">UNIVEST</span>
        </div>

        {/* Dynamic content */}
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }} transition={{ duration:0.4 }}
            className="z-10 flex flex-col items-start">
            {leftContent.illustration}
            <h2 className="text-2xl font-black text-white tracking-tight leading-tight mb-2 mt-4">{leftContent.heading}</h2>
            <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-xs">{leftContent.sub}</p>
          </motion.div>
        </AnimatePresence>

        {/* Progress strip */}
        <div className="z-10 space-y-3">
          <div className="flex gap-1 flex-wrap">
            {stepLabels.map((label, i) => {
              const sn = i + 1;
              const isDone = sn < currentStep;
              const isCur = sn === currentStep;
              return (
                <div key={label} className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold transition-all ${
                  isCur ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300'
                  : isDone ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                  : 'bg-white/5 border border-white/10 text-white/30'}`}>
                  {isDone && <Check className="w-2.5 h-2.5" />}{label}
                </div>
              );
            })}
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-500">KYC Progress</span>
              <span className="text-[10px] font-black text-slate-400">Step {currentStep} of {totalSteps}</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div animate={{ width:`${progressPercent}%` }} transition={{ duration:0.5, ease:'easeOut' }}
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
            <Lock className="w-3 h-3 text-emerald-500" />
            <span>256-bit encrypted · SEBI compliant · Data never shared</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col overflow-y-auto">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-2 px-6 pt-6 pb-4 border-b border-slate-200 bg-white">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center font-black text-white text-sm">U</div>
          <span className="font-black text-slate-900">UNIVEST</span>
          <div className="ml-auto text-[10px] font-bold text-slate-400">Step {currentStep}/{totalSteps}</div>
        </div>
        <div className="lg:hidden px-6 pt-3 pb-1 bg-white">
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div animate={{ width:`${progressPercent}%` }} transition={{ duration:0.5, ease:'easeOut' }}
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" />
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-start justify-center p-6 sm:p-12 lg:p-16">
          <div className="w-full max-w-xl">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div key="s1" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.3 }}>
                  <WelcomeStep onNext={() => setCurrentStep(2)} />
                </motion.div>
              )}
              {currentStep === 2 && (
                <motion.div key="s2" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.3 }}>
                  <PANVerificationStep initialData={panData} onNext={d => { setPanData(d); setCurrentStep(3); }} onBack={() => setCurrentStep(1)} />
                </motion.div>
              )}
              {currentStep === 3 && (
                <motion.div key="s3" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.3 }}>
                  <AadhaarVerificationStep initialData={aadhaarData} onNext={d => { setAadhaarData(d); setCurrentStep(4); }} onBack={() => setCurrentStep(2)} />
                </motion.div>
              )}
              {currentStep === 4 && (
                <motion.div key="s4" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.3 }}>
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Live Selfie Capture</h2>
                      <p className="text-sm text-slate-500 font-medium mt-1">Liveness detection for photo-match verification.</p>
                    </div>
                    <div className="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-video flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3 text-white/60">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full border-2 border-dashed border-violet-400/50 flex items-center justify-center">
                            <User className="w-9 h-9 text-white/40" />
                          </div>
                          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-violet-400" />
                          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-violet-400" />
                          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-violet-400" />
                          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-violet-400" />
                        </div>
                        <span className="text-xs font-bold text-white/50">Camera access required</span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-black/50 py-2 text-center text-[10px] font-bold text-white/60">
                        Feature coming soon — skip to continue
                      </div>
                    </div>
                    <div className="p-3 bg-violet-50 border border-violet-100 rounded-xl text-xs font-medium text-violet-700">
                      Your selfie is used only for identity match and is never stored beyond KYC verification.
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <button onClick={() => setCurrentStep(3)} className="text-sm font-bold text-slate-500 cursor-pointer">Back</button>
                      <button onClick={() => setCurrentStep(5)} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition shadow-md shadow-blue-500/20 cursor-pointer">Skip for now ?</button>
                    </div>
                  </div>
                </motion.div>
              )}
              {currentStep === 5 && (
                <motion.div key="s5" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.3 }}>
                  <BankDetailsStep initialData={bankData} onNext={d => { setBankData(d); setCurrentStep(6); }} onBack={() => setCurrentStep(4)} />
                </motion.div>
              )}
              {currentStep === 6 && (
                <motion.div key="s6" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.3 }}>
                  <PersonalDetailsStep initialData={personalData} onNext={d => { setPersonalData(d); setCurrentStep(7); }} />
                </motion.div>
              )}
              {currentStep === 7 && (
                <motion.div key="s7" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.3 }}>
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Digital Signature</h2>
                      <p className="text-sm text-slate-500 font-medium mt-1">Draw or type your signature to authorize the advisory agreement.</p>
                    </div>
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center min-h-[160px] flex items-center justify-center shadow-sm">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <Pen className="w-8 h-8 text-slate-300" />
                        <span className="text-sm font-bold">Signature Pad</span>
                        <span className="text-xs">Stylus / mouse drawing canvas — coming soon</span>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs font-medium text-blue-700">
                      <strong>Note:</strong> Your typed name in the agreements step serves as your legally binding digital signature under IT Act 2000.
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <button onClick={() => setCurrentStep(6)} className="text-sm font-bold text-slate-500 cursor-pointer">Back</button>
                      <button onClick={() => setCurrentStep(8)} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition shadow-md shadow-blue-500/20 cursor-pointer">Continue to Agreements ?</button>
                    </div>
                  </div>
                </motion.div>
              )}
              {currentStep === 8 && (
                <motion.div key="s8" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.3 }}>
                  <AgreementsStep onComplete={() => setCurrentStep(9)} onBack={() => setCurrentStep(7)} />
                </motion.div>
              )}
              {currentStep === 9 && (
                <motion.div key="s9" initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }} transition={{ duration:0.4 }}
                  className="flex flex-col items-center text-center py-12">
                  <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:200, delay:0.2 }}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/30">
                    <Check className="w-12 h-12 text-white stroke-[3]" />
                  </motion.div>
                  <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}>
                    <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Verification Complete!</h2>
                    <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto leading-relaxed">
                      Your KYC has been submitted and verified. You are now a fully verified Univest investor.
                    </p>
                    <div className="grid grid-cols-3 gap-3 mb-8 text-left max-w-xs mx-auto">
                      {[
                        { icon: <Shield className="w-4 h-4 text-blue-500" />, label: 'KYC Verified', bg: 'bg-blue-50 border-blue-100' },
                        { icon: <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />, label: 'SEBI Compliant', bg: 'bg-yellow-50 border-yellow-100' },
                        { icon: <Check className="w-4 h-4 text-emerald-500" />, label: 'Account Active', bg: 'bg-emerald-50 border-emerald-100' },
                      ].map(tile => (
                        <div key={tile.label} className={`${tile.bg} border rounded-xl p-3 flex flex-col items-center gap-1.5`}>
                          {tile.icon}
                          <span className="text-[10px] font-black text-slate-700 text-center leading-tight">{tile.label}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => navigate('/dashboard')}
                      className="px-10 py-4 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-blue-500/20 transition hover:-translate-y-0.5 cursor-pointer">
                      Go to Dashboard ?
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlowContainer;
