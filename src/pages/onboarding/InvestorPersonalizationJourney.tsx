import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ArrowRight, ArrowLeft, Check, ShieldCheck, User,
  TrendingUp, Award, Target, Clock, ShieldAlert, Cpu, Layers,
  Bell, CheckCircle2, ChevronRight, Edit3, Bookmark, Zap, Compass,
  Briefcase, GraduationCap, Building2, UserCheck, Heart, CircleDollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface InvestorProfileState {
  fullName: string;
  dateOfBirth: string;
  occupation: string;
  city: string;
  country: string;
  employmentType: string;
  experienceLevel: string;
  goals: string[];
  horizon: string;
  riskTolerance: 'Conservative' | 'Balanced' | 'Growth' | 'Aggressive';
  preferredInvestments: string[];
  favoriteSectors: string[];
  aiPreferences: string[];
  notificationAlerts: string[];
}

export const InvestorPersonalizationJourney: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 12;

  // Profile Form State
  const [profile, setProfile] = useState<InvestorProfileState>(() => {
    const saved = localStorage.getItem('univest_investor_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      fullName: 'Omar Khan',
      dateOfBirth: '1995-06-15',
      occupation: 'Software Engineer',
      city: 'Mumbai',
      country: 'India',
      employmentType: 'Salaried Professional',
      experienceLevel: 'I know the basics',
      goals: ['Wealth Creation', 'Passive Income', 'Tax Saving'],
      horizon: '3–5 Years',
      riskTolerance: 'Growth',
      preferredInvestments: ['Stocks', 'Mutual Funds', 'ETFs', 'IPO'],
      favoriteSectors: ['Technology', 'Banking', 'AI', 'Healthcare'],
      aiPreferences: ['Finding investment opportunities', 'Portfolio analysis', 'Daily market summaries'],
      notificationAlerts: ['Price Alerts', 'Research Updates', 'AI Recommendations']
    };
  });

  const [isCompleted, setIsCompleted] = useState(false);

  // Auto-save to localStorage on step change
  useEffect(() => {
    localStorage.setItem('univest_investor_profile', JSON.stringify(profile));
  }, [profile]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsCompleted(true);
      toast.success('AI Investor Profile Generated!');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const toggleMultiSelect = (key: keyof InvestorProfileState, item: string) => {
    const currentList = (profile[key] as string[]) || [];
    if (currentList.includes(item)) {
      setProfile({ ...profile, [key]: currentList.filter(i => i !== item) });
    } else {
      setProfile({ ...profile, [key]: [...currentList, item] });
    }
  };

  // Step 3 Options
  const employmentOptions = [
    { label: 'Student', desc: 'Starting your financial literacy', icon: <GraduationCap className="w-5 h-5 text-blue-600" /> },
    { label: 'Salaried Professional', desc: 'Earning regular income', icon: <Briefcase className="w-5 h-5 text-emerald-600" /> },
    { label: 'Business Owner', desc: 'Managing enterprise capital', icon: <Building2 className="w-5 h-5 text-purple-600" /> },
    { label: 'Freelancer', desc: 'Flexible independent contractor', icon: <Zap className="w-5 h-5 text-amber-600" /> },
    { label: 'Retired', desc: 'Preserving wealth & steady yields', icon: <UserCheck className="w-5 h-5 text-rose-600" /> },
    { label: 'Other', desc: 'Unique background profile', icon: <User className="w-5 h-5 text-slate-600" /> }
  ];

  // Step 4 Options
  const experienceOptions = [
    { label: "I'm completely new", desc: "First time investing. Need guided step-by-step AI advice.", badge: 'Beginner' },
    { label: "I know the basics", desc: "Have bought a few stocks or SIPs. Looking to grow.", badge: 'Intermediate' },
    { label: "I invest regularly", desc: "Active monthly investor in equity & mutual funds.", badge: 'Advanced' },
    { label: "I'm an experienced investor", desc: "Pro trader doing F&O, technical analysis, and swing setups.", badge: 'Expert' }
  ];

  // Step 5 Options
  const goalOptions = [
    'Wealth Creation', 'Retirement', 'Monthly Income', 'Emergency Fund',
    'Child Education', 'Buying a House', 'Buying a Car', 'Travel',
    'Tax Saving', 'Passive Income'
  ];

  // Step 6 Options
  const horizonOptions = ['Less than 1 Year', '1–3 Years', '3–5 Years', '5–10 Years', 'More than 10 Years'];

  // Step 7 Options
  const riskOptions = [
    { type: 'Conservative', desc: 'Focus on capital preservation with minimal volatility. Prefer Fixed Income & Gold.', color: 'border-blue-200 bg-blue-50/40 text-blue-900' },
    { type: 'Balanced', desc: 'Moderate risk for consistent multi-asset growth across Large Caps and Mutual Funds.', color: 'border-emerald-200 bg-emerald-50/40 text-emerald-900' },
    { type: 'Growth', desc: 'Higher risk tolerance for outperforming market indices via Tech & Mid-Cap Equities.', color: 'border-amber-200 bg-amber-50/40 text-amber-900' },
    { type: 'Aggressive', desc: 'Maximum growth potential accepting high market volatility, Small Caps, and Momentum F&O.', color: 'border-rose-200 bg-rose-50/40 text-rose-900' }
  ];

  // Step 8 Options
  const investmentOptions = ['Stocks', 'Mutual Funds', 'ETFs', 'IPO', 'Gold', 'Bonds', 'REITs', 'International Stocks', 'SIP'];

  // Step 9 Options
  const sectorOptions = [
    'Technology', 'Banking', 'Healthcare', 'Pharma', 'Energy', 'FMCG',
    'Automobile', 'Infrastructure', 'Defence', 'AI', 'Telecom', 'Real Estate',
    'Consumer', 'Manufacturing'
  ];

  // Step 10 Options
  const aiAssistantOptions = [
    'Finding investment opportunities', 'Understanding stocks', 'Portfolio analysis',
    'Daily market summaries', 'Learning investing', 'Long-term wealth planning',
    'Risk management', 'Tax planning', 'Retirement planning'
  ];

  // Step 11 Options
  const notificationOptions = [
    'Price Alerts', 'Research Updates', 'Market News', 'Corporate Actions',
    'Dividend Alerts', 'IPO Updates', 'AI Recommendations', 'Portfolio Alerts'
  ];

  // Compute AI Archetype Summary
  const getAiArchetype = () => {
    if (profile.riskTolerance === 'Aggressive') return 'Aggressive Momentum Investor';
    if (profile.riskTolerance === 'Growth') return 'Growth-Oriented Long-Term Investor';
    if (profile.riskTolerance === 'Balanced') return 'Balanced Wealth Accumulator';
    return 'Conservative Capital Preserver';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-4 sm:p-8 font-sans text-slate-800">
      
      {/* TOP HEADER & LIVE PROGRESS BAR */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-4 px-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 font-black text-white text-xl flex items-center justify-center shadow-md">
            U
          </div>
          <div>
            <span className="font-black text-lg tracking-tight text-[#0F172A] block leading-none">UNIVEST</span>
            <span className="text-[10px] text-slate-500 font-bold">Personalized AI Onboarding</span>
          </div>
        </div>

        {!isCompleted && (
          <div className="flex items-center gap-4">
            <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
              Step {currentStep} of {totalSteps}
            </span>

            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="p-2 text-slate-500 hover:text-[#0F172A] hover:bg-slate-100 rounded-xl transition cursor-pointer"
                title="Go Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </header>

      {/* TOP PROGRESS TRACKER INDICATOR */}
      {!isCompleted && (
        <div className="max-w-4xl w-full mx-auto my-4">
          <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* MAIN CONVERSATIONAL STEP CONTAINER */}
      <main className="flex-1 max-w-2xl w-full mx-auto flex flex-col justify-center my-4">
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-white border border-[#E2E8F0] rounded-[32px] p-6 sm:p-10 shadow-xl"
            >
              {/* STEP 1: WELCOME */}
              {currentStep === 1 && (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Sparkles className="w-10 h-10 animate-pulse" />
                  </div>

                  <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
                      Welcome to Univest AI
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-2 max-w-md mx-auto leading-relaxed">
                      Let's personalize your investing experience in just a few minutes. We train autonomous AI advisors to match your exact goals.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={handleNext}
                      className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Get Started Now</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition cursor-pointer"
                    >
                      Skip to Dashboard
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: PERSONAL INFO */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-blue-600">Step 2 · Personal Profile</span>
                    <h2 className="text-2xl font-black text-[#0F172A] mt-1">Tell us about yourself</h2>
                    <p className="text-xs text-slate-500 font-medium">Helps tailor demographic insights & regional market opportunities.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#0F172A] outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-slate-700 mb-1">Date of Birth</label>
                        <input
                          type="date"
                          value={profile.dateOfBirth}
                          onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                          className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#0F172A] outline-none focus:border-blue-500 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-700 mb-1">Occupation</label>
                        <input
                          type="text"
                          value={profile.occupation}
                          onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                          className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#0F172A] outline-none focus:border-blue-500 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-slate-700 mb-1">City</label>
                        <input
                          type="text"
                          value={profile.city}
                          onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                          className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#0F172A] outline-none focus:border-blue-500 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-700 mb-1">Country</label>
                        <input
                          type="text"
                          value={profile.country}
                          onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                          className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#0F172A] outline-none focus:border-blue-500 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <span>Continue to Employment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 3: EMPLOYMENT TYPE */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-blue-600">Step 3 · Employment Profile</span>
                    <h2 className="text-2xl font-black text-[#0F172A] mt-1">What best describes you?</h2>
                    <p className="text-xs text-slate-500 font-medium">Single selection card choice.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {employmentOptions.map((opt) => {
                      const isSelected = profile.employmentType === opt.label;
                      return (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          key={opt.label}
                          onClick={() => setProfile({ ...profile, employmentType: opt.label })}
                          className={`p-4 rounded-2xl border transition cursor-pointer flex items-center gap-3.5 ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/60 shadow-md ring-2 ring-blue-600/20'
                              : 'border-[#E2E8F0] bg-white hover:border-blue-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="p-2.5 rounded-xl bg-white shadow-xs border border-slate-100">
                            {opt.icon}
                          </div>
                          <div>
                            <h4 className="font-black text-xs text-[#0F172A]">{opt.label}</h4>
                            <p className="text-[10px] text-slate-500 font-medium mt-0.5">{opt.desc}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <span>Next: Experience Level</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 4: EXPERIENCE LEVEL */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-blue-600">Step 4 · Market Experience</span>
                    <h2 className="text-2xl font-black text-[#0F172A] mt-1">How experienced are you with investing?</h2>
                    <p className="text-xs text-slate-500 font-medium">Select your experience background.</p>
                  </div>

                  <div className="space-y-3">
                    {experienceOptions.map((opt) => {
                      const isSelected = profile.experienceLevel === opt.label;
                      return (
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          key={opt.label}
                          onClick={() => setProfile({ ...profile, experienceLevel: opt.label })}
                          className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/60 shadow-md ring-2 ring-blue-600/20'
                              : 'border-[#E2E8F0] bg-white hover:border-blue-200 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-black text-sm text-[#0F172A]">{opt.label}</h4>
                              <span className="text-[9px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md">{opt.badge}</span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium mt-1">{opt.desc}</p>
                          </div>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />}
                        </motion.div>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <span>Next: Investment Goals</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 5: INVESTMENT GOALS */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-blue-600">Step 5 · Financial Objectives</span>
                    <h2 className="text-2xl font-black text-[#0F172A] mt-1">What are your investment goals?</h2>
                    <p className="text-xs text-slate-500 font-medium">Select all that apply.</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {goalOptions.map((g) => {
                      const isSelected = profile.goals.includes(g);
                      return (
                        <button
                          key={g}
                          onClick={() => toggleMultiSelect('goals', g)}
                          className={`p-3.5 rounded-2xl border text-xs font-black transition cursor-pointer text-left flex items-center justify-between ${
                            isSelected
                              ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                              : 'border-[#E2E8F0] bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{g}</span>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <span>Next: Investment Horizon</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 6: INVESTMENT HORIZON */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-blue-600">Step 6 · Time Horizon</span>
                    <h2 className="text-2xl font-black text-[#0F172A] mt-1">How long do you plan to invest?</h2>
                    <p className="text-xs text-slate-500 font-medium">Determines asset allocation and SIP compounding schedules.</p>
                  </div>

                  <div className="space-y-3">
                    {horizonOptions.map((hz) => {
                      const isSelected = profile.horizon === hz;
                      return (
                        <button
                          key={hz}
                          onClick={() => setProfile({ ...profile, horizon: hz })}
                          className={`w-full p-4 rounded-2xl border text-xs font-black transition cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-600/20'
                              : 'border-[#E2E8F0] bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-sm font-black">{hz}</span>
                          <Clock className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <span>Next: Risk Tolerance</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 7: RISK TOLERANCE */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-blue-600">Step 7 · Risk Profile</span>
                    <h2 className="text-2xl font-black text-[#0F172A] mt-1">How much risk are you comfortable taking?</h2>
                    <p className="text-xs text-slate-500 font-medium">Select your drawdown comfort boundary.</p>
                  </div>

                  <div className="space-y-3">
                    {riskOptions.map((rk) => {
                      const isSelected = profile.riskTolerance === rk.type;
                      return (
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          key={rk.type}
                          onClick={() => setProfile({ ...profile, riskTolerance: rk.type as any })}
                          className={`p-4 rounded-2xl border transition cursor-pointer ${
                            isSelected
                              ? `${rk.color} border-2 shadow-md`
                              : 'border-[#E2E8F0] bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-black text-sm text-[#0F172A]">{rk.type} Risk</h4>
                            {isSelected && <Check className="w-4 h-4 text-blue-600 stroke-[3]" />}
                          </div>
                          <p className="text-xs text-slate-600 font-medium leading-relaxed">{rk.desc}</p>
                        </motion.div>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <span>Next: Preferred Assets</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 8: PREFERRED INVESTMENTS */}
              {currentStep === 8 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-blue-600">Step 8 · Asset Preferences</span>
                    <h2 className="text-2xl font-black text-[#0F172A] mt-1">Which investments interest you?</h2>
                    <p className="text-xs text-slate-500 font-medium">Select multiple product categories.</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {investmentOptions.map((inv) => {
                      const isSelected = profile.preferredInvestments.includes(inv);
                      return (
                        <button
                          key={inv}
                          onClick={() => toggleMultiSelect('preferredInvestments', inv)}
                          className={`p-3.5 rounded-2xl border text-xs font-black transition cursor-pointer text-left flex items-center justify-between ${
                            isSelected
                              ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                              : 'border-[#E2E8F0] bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{inv}</span>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <span>Next: Favorite Sectors</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 9: FAVORITE SECTORS */}
              {currentStep === 9 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-blue-600">Step 9 · Industry Focus</span>
                    <h2 className="text-2xl font-black text-[#0F172A] mt-1">Favorite sectors</h2>
                    <p className="text-xs text-slate-500 font-medium">Choose sectors you want to receive research and news on.</p>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {sectorOptions.map((sec) => {
                      const isSelected = profile.favoriteSectors.includes(sec);
                      return (
                        <button
                          key={sec}
                          onClick={() => toggleMultiSelect('favoriteSectors', sec)}
                          className={`px-4 py-2.5 rounded-xl border text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                            isSelected
                              ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                              : 'border-[#E2E8F0] bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{sec}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <span>Next: AI Advisor Configuration</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 10: AI ADVISOR CONFIGURATION */}
              {currentStep === 10 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-blue-600">Step 10 · AI Personalization</span>
                    <h2 className="text-2xl font-black text-[#0F172A] mt-1">What would you like your AI to help with?</h2>
                    <p className="text-xs text-slate-500 font-medium">Select primary AI assistant responsibilities.</p>
                  </div>

                  <div className="space-y-2.5">
                    {aiAssistantOptions.map((aiOpt) => {
                      const isSelected = profile.aiPreferences.includes(aiOpt);
                      return (
                        <button
                          key={aiOpt}
                          onClick={() => toggleMultiSelect('aiPreferences', aiOpt)}
                          className={`w-full p-3.5 rounded-2xl border text-xs font-black transition cursor-pointer text-left flex items-center justify-between ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-600/20'
                              : 'border-[#E2E8F0] bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{aiOpt}</span>
                          {isSelected && <Check className="w-4 h-4 text-blue-600 stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <span>Next: Market Notifications</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 11: MARKET NOTIFICATIONS */}
              {currentStep === 11 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-blue-600">Step 11 · Alerts & Push Feeds</span>
                    <h2 className="text-2xl font-black text-[#0F172A] mt-1">Market Notifications</h2>
                    <p className="text-xs text-slate-500 font-medium">Choose real-time alert triggers. Can be edited anytime.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {notificationOptions.map((notif) => {
                      const isSelected = profile.notificationAlerts.includes(notif);
                      return (
                        <button
                          key={notif}
                          onClick={() => toggleMultiSelect('notificationAlerts', notif)}
                          className={`p-3.5 rounded-2xl border text-xs font-black transition cursor-pointer text-left flex items-center justify-between ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 text-blue-900 border-2'
                              : 'border-[#E2E8F0] bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{notif}</span>
                          <Bell className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <span>Next: Review & Summary</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 12: REVIEW & SUMMARY */}
              {currentStep === 12 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-blue-600">Step 12 · Profile Review</span>
                    <h2 className="text-2xl font-black text-[#0F172A] mt-1">Review & Finish Setup</h2>
                    <p className="text-xs text-slate-500 font-medium">Verify your personalization choices before generating your AI Profile.</p>
                  </div>

                  <div className="space-y-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 text-xs font-medium text-slate-700">
                    <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                      <span className="text-slate-500 font-bold">Investor Name</span>
                      <span className="font-black text-[#0F172A]">{profile.fullName}</span>
                    </div>

                    <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                      <span className="text-slate-500 font-bold">Experience Level</span>
                      <span className="font-black text-blue-600">{profile.experienceLevel}</span>
                    </div>

                    <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                      <span className="text-slate-500 font-bold">Risk Profile</span>
                      <span className="font-black text-emerald-600">{profile.riskTolerance} Risk</span>
                    </div>

                    <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                      <span className="text-slate-500 font-bold">Time Horizon</span>
                      <span className="font-black text-[#0F172A]">{profile.horizon}</span>
                    </div>

                    <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                      <span className="text-slate-500 font-bold">Goals ({profile.goals.length})</span>
                      <span className="font-black text-[#0F172A]">{profile.goals.slice(0, 3).join(', ')}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">Favorite Sectors ({profile.favoriteSectors.length})</span>
                      <span className="font-black text-[#0F172A]">{profile.favoriteSectors.slice(0, 3).join(', ')}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-5 py-3.5 bg-white border border-[#E2E8F0] text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer flex items-center gap-1.5"
                    >
                      <Edit3 className="w-4 h-4" /> Edit Details
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" /> Finish Setup & Generate AI Profile
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            /* SUCCESS SCREEN: AI-GENERATED INVESTOR PROFILE SUMMARY CARD */
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-[#E2E8F0] rounded-[32px] p-8 sm:p-12 shadow-2xl text-center space-y-8"
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-emerald-500 to-teal-600 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Setup Complete · AI Profile Trained
                </span>
                <h1 className="text-3xl font-black text-[#0F172A] mt-3">
                  Welcome aboard, {profile.fullName}!
                </h1>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  Your personalized investment workspace is ready.
                </p>
              </div>

              {/* AI GENERATED INVESTOR SUMMARY CARD */}
              <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white rounded-[24px] p-6 text-left shadow-xl space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" /> AI Generated Investor Profile
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-white/10 px-2.5 py-0.5 rounded">Active Archetype</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Investor Archetype</span>
                    <span className="text-base font-black text-emerald-400 mt-0.5 block">{getAiArchetype()}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Risk Profile</span>
                    <span className="text-base font-black text-blue-300 mt-0.5 block">{profile.riskTolerance} Risk</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Primary Goals</span>
                    <span className="text-xs font-bold text-white mt-0.5 block">{profile.goals.slice(0, 2).join(' & ')}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Top Sectors</span>
                    <span className="text-xs font-bold text-white mt-0.5 block">{profile.favoriteSectors.slice(0, 3).join(', ')}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 text-[11px] text-slate-300 font-medium leading-relaxed">
                  "Your AI Advisors have been calibrated with your preferred sectors, risk boundary, and time horizon. You'll now receive customized research signals and stock setups."
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Go to Personalized Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition cursor-pointer"
                >
                  Explore Research
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="max-w-4xl w-full mx-auto text-center text-[11px] font-medium text-slate-500 py-4 border-t border-[#E2E8F0]">
        Univest AI Advisor Personalization Suite · Privacy Protected · Auto-saved to Workspace
      </footer>
    </div>
  );
};

export default InvestorPersonalizationJourney;
