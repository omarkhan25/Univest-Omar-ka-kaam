import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Shield, FileText, Pen, Lock, ChevronLeft, Fingerprint, Banknote, Star } from 'lucide-react';

import { AadhaarVerificationStep, type AadhaarData } from './AadhaarVerificationStep';
import { PANVerificationStep, type PANData } from './PANVerificationStep';
import { BankDetailsStep, type BankData } from './BankDetailsStep';
import { AgreementsStep } from './AgreementsStep';
import { ReviewSubmitStep } from './ReviewSubmitStep';
import { AccountSetupProgressStep } from './AccountSetupProgressStep';
import { InvestorPersonalizationJourney } from './InvestorPersonalizationJourney';

export const OnboardingFlowContainer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state as { name?: string; email?: string; mobile?: string }) || {};

  const [currentStep, setCurrentStep] = useState(1);
  const [aadhaarData, setAadhaarData] = useState<Partial<AadhaarData>>({});
  const [panData, setPanData] = useState<Partial<PANData>>({});
  const [bankData, setBankData] = useState<Partial<BankData>>({});

  const totalSteps = 5;
  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
  
  const stepLabels = ['Identity Verification', 'PAN Verification', 'Bank Verification', 'Document Sign', 'Review'];

  const leftPanelContent: Record<number, { heading: string; illustration: React.ReactNode; points: string[] }> = {
    1: {
      heading: 'Aadhaar Identity Verification',
      points: [
        'Verify your 12-digit Aadhaar via instant OTP.',
        'Name & Date of Birth will be fetched directly from UIDAI.'
      ],
      illustration: (
        <div className="relative flex flex-col items-center justify-center w-full h-48 bg-primary-light/50 rounded-2xl border border-[#E2E8F0]">
          <Fingerprint className="w-16 h-16 text-primary mb-2" />
          <div className="text-sm font-bold text-slate-700 bg-white px-4 py-1.5 rounded-full shadow-sm">
            UIDAI Authenticated
          </div>
        </div>
      )
    },
    2: {
      heading: 'PAN Card Verification',
      points: [
        'Your PAN is verified directly with the Income Tax Department.',
        'Required for all SEBI registered investment accounts.'
      ],
      illustration: (
        <div className="relative flex flex-col items-center justify-center w-full h-48 bg-orange-50/50 rounded-2xl border border-orange-100">
          <div className="w-24 h-16 bg-white rounded-lg border-2 border-orange-200 shadow-sm flex flex-col items-start p-2 relative overflow-hidden">
            <div className="w-1/2 h-1 bg-orange-200 rounded mb-1" />
            <div className="w-3/4 h-1 bg-slate-200 rounded mb-2" />
            <div className="w-4 h-4 rounded-full bg-slate-200 absolute bottom-2 right-2" />
          </div>
          <div className="absolute -bottom-3 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1 shadow-sm">
            <Check className="w-3 h-3" /> NSDL Verified
          </div>
        </div>
      )
    },
    3: {
      heading: 'Link Your Bank Account',
      points: [
        'We securely link your bank account for deposits and withdrawals.',
        'A quick OTP verifies your ownership securely.'
      ],
      illustration: (
        <div className="relative flex flex-col items-center justify-center w-full h-48 bg-emerald-50/50 rounded-2xl border border-emerald-100">
          <Banknote className="w-16 h-16 text-emerald-500 mb-2" />
          <div className="text-sm font-bold text-slate-700 bg-white px-4 py-1.5 rounded-full shadow-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" /> Secure Link
          </div>
        </div>
      )
    },
    4: {
      heading: 'Sign Account Documents',
      points: [
        'Review and digitally sign your account opening forms.',
        'You can download a copy for your records immediately.'
      ],
      illustration: (
        <div className="relative flex flex-col items-center justify-center w-full h-48 bg-purple-50/50 rounded-2xl border border-purple-100">
          <FileText className="w-16 h-16 text-purple-500 mb-2" />
          <div className="text-sm font-bold text-slate-700 bg-white px-4 py-1.5 rounded-full shadow-sm flex items-center gap-2">
            <Pen className="w-4 h-4 text-purple-500" /> Digital Sign
          </div>
        </div>
      )
    },
    5: {
      heading: 'Final Review & Submit',
      points: [
        'Please review all the provided details carefully.',
        'Once submitted, your account setup process will begin.'
      ],
      illustration: (
        <div className="relative flex flex-col items-center justify-center w-full h-48 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <div className="text-sm font-bold text-slate-700 bg-white px-4 py-1.5 rounded-full shadow-sm">
            Ready to Submit
          </div>
        </div>
      )
    },
    6: {
      heading: 'Setting Up Your Account',
      points: [
        'Application submitted successfully!',
        'Initializing your SEBI Demat & Advisory credentials.'
      ],
      illustration: (
        <div className="relative flex flex-col items-center justify-center w-full h-48 bg-primary-light rounded-2xl border border-[#E2E8F0]">
          <Star className="w-16 h-16 text-primary mb-2 animate-bounce" />
          <div className="text-sm font-bold text-slate-700 bg-white px-4 py-1.5 rounded-full shadow-sm">
            Provisioning Account
          </div>
        </div>
      )
    }
  };

  const leftContent = leftPanelContent[currentStep] || leftPanelContent[5];

  // If user reaches step 7, render the full Account Setup Questions (Personalization Journey)
  if (currentStep === 7) {
    return <InvestorPersonalizationJourney />;
  }

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-[40%_60%] gap-0 font-sans bg-white">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col p-10 relative border-r border-slate-100 bg-white">
        
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-black text-base text-white shadow-md">U</div>
          <span className="font-black text-base tracking-tight text-slate-900">UNIVEST</span>
        </div>

        {/* Dynamic content */}
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration:0.3 }}
            className="flex-1 flex flex-col justify-center">
            
            <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-snug mb-5">
              {leftContent.heading}
            </h2>

            <div className="mb-6 w-full">
              {leftContent.illustration}
            </div>

            <div className="space-y-3">
              {leftContent.points.map((pt, i) => (
                <div key={i} className="flex gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold text-slate-600">{i + 1}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-normal leading-relaxed">{pt}</p>
                </div>
              ))}
            </div>
            
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
          <Lock className="w-3 h-3 text-slate-300" />
          <span>256-bit encrypted · SEBI compliant · Secure platform</span>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="min-h-screen flex flex-col bg-white">
        
        {/* Top Progress Bar */}
        <div className="w-full px-8 pt-6 pb-4 border-b border-slate-50">
          <div className="flex items-center justify-between mb-2">
            {stepLabels.map((label, i) => (
              <div key={label} className="flex-1 flex flex-col gap-1.5 relative px-1">
                <div className={`text-xs font-bold ${currentStep === i + 1 ? 'text-primary' : currentStep > i + 1 ? 'text-slate-700' : 'text-slate-400'}`}>
                  0{i + 1}
                </div>
                <div className={`h-1 w-full rounded-full transition-colors ${currentStep === i + 1 ? 'bg-primary' : currentStep > i + 1 ? 'bg-slate-800' : 'bg-slate-100'}`} />
                <div className={`text-xs font-bold absolute -bottom-6 left-1 whitespace-nowrap ${currentStep === i + 1 ? 'text-slate-900' : currentStep > i + 1 ? 'text-slate-500' : 'text-slate-300'}`}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 overflow-y-auto px-12 py-12 flex justify-center">
          <div className="w-full max-w-lg">
            {currentStep > 1 && currentStep < 6 && (
              <button 
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-6"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}

            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div key="s1" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.3 }}>
                  <AadhaarVerificationStep initialData={aadhaarData} onNext={d => { setAadhaarData(d); setCurrentStep(2); }} />
                </motion.div>
              )}
              {currentStep === 2 && (
                <motion.div key="s2" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.3 }}>
                  <PANVerificationStep initialData={panData} onNext={d => { setPanData(d); setCurrentStep(3); }} />
                </motion.div>
              )}
              {currentStep === 3 && (
                <motion.div key="s3" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.3 }}>
                  <BankDetailsStep initialData={bankData} onNext={d => { setBankData(d); setCurrentStep(4); }} />
                </motion.div>
              )}
              {currentStep === 4 && (
                <motion.div key="s4" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.3 }}>
                  <AgreementsStep onComplete={() => setCurrentStep(5)} />
                </motion.div>
              )}
              {currentStep === 5 && (
                <motion.div key="s5" initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.3 }}>
                  <ReviewSubmitStep 
                    aadhaarData={aadhaarData} 
                    panData={panData} 
                    bankData={bankData}
                    onComplete={() => setCurrentStep(6)}
                  />
                </motion.div>
              )}
              {currentStep === 6 && (
                <motion.div key="s6" initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.3 }}>
                  <AccountSetupProgressStep onComplete={() => setCurrentStep(7)} />
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

