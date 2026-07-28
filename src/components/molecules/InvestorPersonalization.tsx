import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft, BrainCircuit, Check, Sparkles } from 'lucide-react';
import { Button } from '../atoms/Button';

const EXPERIENCES = [
  { value: 'Beginner', title: 'Beginner', desc: 'Learning to invest. Focus on low-risk mutual funds and primary blue chips.' },
  { value: 'Intermediate', title: 'Intermediate', desc: 'Some investing experience. Understated stock market mechanics and basic portfolio weightings.' },
  { value: 'Advanced', title: 'Advanced', desc: 'Experienced investor. Familiar with breakouts, options strategies, and MCX commodities.' },
  { value: 'Professional', title: 'Professional', desc: 'Active trader or financial professional. High frequency trades and options option-writing.' },
];

const GOALS = [
  'Long-Term Wealth', 'Retirement Planning', 'Passive Income', 
  'Short-Term Trading', 'Swing Trading', 'Intraday Trading', 
  'Tax Saving (ELSS)', 'Children\'s Education', 'Buying a Home', 'Wealth Creation'
];

const INTERESTS = [
  'Indian Stocks', 'US Stocks', 'Upcoming IPOs', 'Mutual Funds', 
  'ETFs', 'Futures & Options', 'Commodities', 'Gold', 
  'Bonds', 'NCDs', 'Fixed Deposits'
];

const SECTORS = [
  'Technology', 'Banking & Finance', 'Healthcare', 'Energy', 
  'Automobiles', 'Infrastructure', 'Consumer Goods', 'Pharmaceuticals', 
  'Defence Sector', 'Real Estate', 'Artificial Intelligence', 'Renewable Energy'
];

const RISK_CONFIGS = [
  { level: 'Conservative', return: '6 - 8%', risk: 'Very Low', desc: 'Capital preservation is your primary objective. Focused on corporate bonds, large debt schemes, and gold.' },
  { level: 'Balanced', return: '10 - 12%', risk: 'Moderate', desc: 'Standard hybrid allocation between blue-chips equities and bonds to grow capital steadily.' },
  { level: 'Growth', return: '14 - 16%', risk: 'High', desc: 'Prioritize wealth growth with higher volatility tolerance. Heavy focus on mid-caps and growth equities.' },
  { level: 'Aggressive', return: '18 - 22%+', risk: 'Extreme', desc: 'Maximize short-term advisory strategy returns, derivatives swing trading, and breakout commodities.' },
];

export const InvestorPersonalization = () => {
  const navigate = useNavigate();
  const [screen, setScreen] = useState(1);
  
  // Selected Profile state variables
  const [experience, setExperience] = useState('Beginner');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [riskSlider, setRiskSlider] = useState(1); // 0: Conservative, 1: Balanced, 2: Growth, 3: Aggressive
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  
  // Notifications preferences
  const [alertTypes, setAlertTypes] = useState({
    research: true,
    target: true,
    stoploss: true,
    ipo: false,
    news: true,
  });

  // AI Loading Screen simulation
  const [aiPercent, setAiPercent] = useState(0);

  useEffect(() => {
    if (screen === 8) {
      const interval = setInterval(() => {
        setAiPercent((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setScreen(9); // advance to final screen automatically
            }, 800);
            return 100;
          }
          return prev + 1;
        });
      }, 40); // 4 seconds total duration
      return () => clearInterval(interval);
    }
  }, [screen]);

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const toggleSector = (sector: string) => {
    setSelectedSectors(prev => 
      prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]
    );
  };

  const nextScreen = () => setScreen(prev => Math.min(prev + 1, 9));
  const prevScreen = () => setScreen(prev => Math.max(prev - 1, 1));
  
  const handleFinalRedirect = () => {
    navigate('/design-system');
  };

  // Get current active progress percentage for the indicator bar
  const getProgress = () => {
    if (screen === 9) return 100;
    return Math.round((screen / 8) * 95);
  };

  const currentRisk = RISK_CONFIGS[riskSlider];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-brand-navy flex flex-col justify-between p-6 md:p-10 font-sans relative selection:bg-primary/20 selection:text-primary">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 blur-[125px] pointer-events-none" />

      {/* Top Header progress indicator */}
      {screen < 9 && (
        <div className="max-w-xl w-full mx-auto flex flex-col gap-3 z-10">
          <div className="flex items-center justify-between text-xs text-brand-secondary">
            <button
              onClick={prevScreen}
              disabled={screen === 1}
              className="flex items-center gap-1 hover:text-brand-navy transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-semibold focus:outline-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <span>Investment Identity • {getProgress()}% Complete</span>
          </div>

          {/* Progress Bar slider container */}
          <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: '0%' }}
              animate={{ width: `${getProgress()}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Main Screen Card Switcher */}
      <div className="flex-1 max-w-xl w-full mx-auto flex flex-col justify-center my-6 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col gap-6"
          >
            
            {/* SCREEN 1: Welcome to Personalization */}
            {screen === 1 && (
              <div className="flex flex-col gap-6 text-center items-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-success flex items-center justify-center text-white font-extrabold text-2xl shadow-glow-blue border border-white/5">
                  U
                </div>

                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight text-brand-navy">
                    Welcome to Univest, Omar Khan!
                  </h2>
                  <p className="text-sm text-brand-secondary max-w-sm mx-auto leading-relaxed">
                    Your investor verification is complete. Let's customize your investing parameters to match your identity.
                  </p>
                </div>

                {/* Verification checklists badges */}
                <div className="grid grid-cols-2 gap-3.5 w-full bg-white border border-brand-border p-5 rounded-card text-xs text-left max-w-md shadow-premium-sm">
                  <div className="flex items-center gap-2 text-brand-navy font-bold">
                    <CheckCircle2 className="w-4.5 h-4.5 text-success" />
                    <span>PAN Verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-navy font-bold">
                    <CheckCircle2 className="w-4.5 h-4.5 text-success" />
                    <span>Aadhaar Verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-navy font-bold">
                    <CheckCircle2 className="w-4.5 h-4.5 text-success" />
                    <span>Bank Linked</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-navy font-bold">
                    <CheckCircle2 className="w-4.5 h-4.5 text-success" />
                    <span>Investor Certified</span>
                  </div>
                </div>

                <Button variant="primary" onClick={nextScreen} className="w-full max-w-md mt-4 py-4 bg-gradient-to-r from-primary to-blue-700 text-white">
                  <span>Build Investment Identity</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            )}

            {/* SCREEN 2: Investment Experience selection */}
            {screen === 2 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl md:text-2xl font-black tracking-tight text-brand-navy">How would you describe your experience?</h3>
                  <p className="text-xs md:text-sm text-brand-secondary">Select one option that matches your portfolio history.</p>
                </div>

                <div className="flex flex-col gap-3">
                  {EXPERIENCES.map(exp => (
                    <button
                      key={exp.value}
                      onClick={() => setExperience(exp.value)}
                      className={`text-left p-4 rounded-card border transition-all duration-200 select-none ${
                        experience === exp.value 
                          ? 'bg-primary/5 border-primary shadow-premium-sm text-brand-navy' 
                          : 'bg-white border-brand-border hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-brand-navy">{exp.title}</span>
                        {experience === exp.value && <Check className="w-4 h-4 text-primary" />}
                      </div>
                      <p className="text-[11px] text-brand-secondary leading-normal">{exp.desc}</p>
                    </button>
                  ))}
                </div>

                <Button variant="primary" onClick={nextScreen} className="py-4 mt-2 text-white">Continue</Button>
              </div>
            )}

            {/* SCREEN 3: Goals multi-select */}
            {screen === 3 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl md:text-2xl font-black tracking-tight text-brand-navy">What are you investing for?</h3>
                  <p className="text-xs md:text-sm text-brand-secondary">Choose all goals that align with your financial objectives.</p>
                </div>

                {/* Grid goals container */}
                <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                  {GOALS.map(goal => {
                    const isSelected = selectedGoals.includes(goal);
                    return (
                      <button
                        key={goal}
                        onClick={() => toggleGoal(goal)}
                        className={`p-4 text-left border rounded-card transition-all duration-200 ${
                          isSelected 
                            ? 'bg-primary/5 border-primary text-primary font-bold' 
                            : 'bg-white border-brand-border text-brand-secondary hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-xs">{goal}</span>
                      </button>
                    );
                  })}
                </div>

                <Button 
                  variant="primary" 
                  onClick={nextScreen} 
                  disabled={selectedGoals.length === 0}
                  className="py-4 mt-2 text-white"
                >
                  Continue
                </Button>
              </div>
            )}

            {/* SCREEN 4: Risk Appetite Interactive Slider */}
            {screen === 4 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl md:text-2xl font-black tracking-tight text-brand-navy">Set Your Risk Comfort Level</h3>
                  <p className="text-xs md:text-sm text-brand-secondary">Slide the meter to set acceptable volatility and return expectations.</p>
                </div>

                {/* Risk dynamic cards stats */}
                <div className="bg-white border border-brand-border rounded-card p-6 flex flex-col gap-4 relative overflow-hidden shadow-premium">
                  <div className="absolute right-4 top-4 text-slate-100"><Sparkles className="w-16 h-16 opacity-30" /></div>
                  <div className="flex justify-between items-center border-b border-slate-105 pb-3">
                    <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider">Advisory Strategy Match</span>
                    <span className="text-xs font-black bg-primary/10 text-primary border border-primary/20 px-3 py-0.5 rounded-full">
                      {currentRisk.level}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-brand-secondary font-bold uppercase">Expected Target Returns</span>
                      <span className="text-lg font-bold text-success mt-0.5">{currentRisk.return}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-brand-secondary font-bold uppercase">Volatility Risk Level</span>
                      <span className="text-lg font-bold text-brand-navy mt-0.5">{currentRisk.risk}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-brand-secondary leading-normal mt-2 border-t border-slate-100 pt-3">
                    {currentRisk.desc}
                  </p>
                </div>

                {/* Custom input slider element */}
                <div className="flex flex-col gap-2 mt-2">
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="1"
                    value={riskSlider}
                    onChange={(e) => setRiskSlider(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-brand-secondary uppercase px-1">
                    <span>Conservative</span>
                    <span>Balanced</span>
                    <span>Growth</span>
                    <span>Aggressive</span>
                  </div>
                </div>

                <Button variant="primary" onClick={nextScreen} className="py-4 mt-2 text-white">Confirm Risk Level</Button>
              </div>
            )}

            {/* SCREEN 5: Investment Interests multi-select */}
            {screen === 5 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl md:text-2xl font-black tracking-tight text-brand-navy">Which assets interest you?</h3>
                  <p className="text-xs md:text-sm text-brand-secondary">We will prioritize advisory feeds containing these financial assets.</p>
                </div>

                <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                  {INTERESTS.map(interest => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`p-4 text-left border rounded-card transition-all duration-200 ${
                          isSelected 
                            ? 'bg-primary/5 border-primary text-primary font-bold' 
                            : 'bg-white border-brand-border text-brand-secondary hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-xs">{interest}</span>
                      </button>
                    );
                  })}
                </div>

                <Button 
                  variant="primary" 
                  onClick={nextScreen} 
                  disabled={selectedInterests.length === 0}
                  className="py-4 mt-2 text-white"
                >
                  Continue
                </Button>
              </div>
            )}

            {/* SCREEN 6: Sectors chips multiselect */}
            {screen === 6 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl md:text-2xl font-black tracking-tight text-brand-navy">Select preferred market sectors</h3>
                  <p className="text-xs md:text-sm text-brand-secondary">Pre-populates watchlists with top tickers in selected categories.</p>
                </div>

                <div className="flex flex-wrap gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {SECTORS.map(sector => {
                    const isSelected = selectedSectors.includes(sector);
                    return (
                      <button
                        key={sector}
                        onClick={() => toggleSector(sector)}
                        className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                          isSelected 
                            ? 'bg-primary border-transparent text-white font-bold shadow-premium-sm' 
                            : 'bg-white border-brand-border text-brand-secondary hover:bg-slate-50'
                        }`}
                      >
                        {sector}
                      </button>
                    );
                  })}
                </div>

                <Button 
                  variant="primary" 
                  onClick={nextScreen} 
                  disabled={selectedSectors.length === 0}
                  className="py-4 mt-2 text-white"
                >
                  Confirm Sectors
                </Button>
              </div>
            )}

            {/* SCREEN 7: Notifications & Alerts setup */}
            {screen === 7 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl md:text-2xl font-black tracking-tight text-brand-navy">Configure strategy alerts</h3>
                  <p className="text-xs md:text-sm text-brand-secondary">Stay updated on target hits, stop losses, and research disclaimers.</p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between p-4 bg-white border border-brand-border rounded-card text-xs shadow-premium-sm">
                    <span className="font-semibold text-brand-navy">Research & Recommendation Alerts</span>
                    <input
                      type="checkbox"
                      checked={alertTypes.research}
                      onChange={(e) => setAlertTypes({ ...alertTypes, research: e.target.checked })}
                      className="w-4.5 h-4.5 bg-transparent border-brand-border rounded text-primary focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white border border-brand-border rounded-card text-xs shadow-premium-sm">
                    <span className="font-semibold text-brand-navy">Target Hit Alerts</span>
                    <input
                      type="checkbox"
                      checked={alertTypes.target}
                      onChange={(e) => setAlertTypes({ ...alertTypes, target: e.target.checked })}
                      className="w-4.5 h-4.5 bg-transparent border-brand-border rounded text-primary focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white border border-brand-border rounded-card text-xs shadow-premium-sm">
                    <span className="font-semibold text-brand-navy">Stop Loss Alerts</span>
                    <input
                      type="checkbox"
                      checked={alertTypes.stoploss}
                      onChange={(e) => setAlertTypes({ ...alertTypes, stoploss: e.target.checked })}
                      className="w-4.5 h-4.5 bg-transparent border-brand-border rounded text-primary focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white border border-brand-border rounded-card text-xs shadow-premium-sm">
                    <span className="font-semibold text-brand-navy">IPO Updates & Market News</span>
                    <input
                      type="checkbox"
                      checked={alertTypes.ipo}
                      onChange={(e) => setAlertTypes({ ...alertTypes, ipo: e.target.checked })}
                      className="w-4.5 h-4.5 bg-transparent border-brand-border rounded text-primary focus:ring-primary"
                    />
                  </div>
                </div>

                <Button variant="primary" onClick={nextScreen} className="py-4 mt-2 text-white">Enable Selected Alerts</Button>
              </div>
            )}

            {/* SCREEN 8: AI Personalization Processing Loop */}
            {screen === 8 && (
              <div className="flex flex-col gap-6 text-center items-center py-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary relative">
                  <BrainCircuit className="w-7 h-7" />
                  <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-xl md:text-2xl font-black tracking-tight text-brand-navy">AI Advisory Setup</h3>
                  <p className="text-xs text-brand-secondary max-w-sm mx-auto leading-normal">
                    {aiPercent < 25 && 'Learning investment preferences...'}
                    {aiPercent >= 25 && aiPercent < 50 && 'Pre-populating custom watchlists...'}
                    {aiPercent >= 50 && aiPercent < 75 && 'Preparing research feed algorithms...'}
                    {aiPercent >= 75 && 'Structuring final dashboard workspace...'}
                  </p>
                </div>

                <div className="w-64 flex flex-col gap-2 mt-4 items-center">
                  {/* Visual percentage meter */}
                  <span className="text-2xl font-black tracking-tight text-primary">{aiPercent}%</span>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${aiPercent}%` }} />
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 9: Final Welcome Home Dashboard Redirect */}
            {screen === 9 && (
              <div className="flex flex-col gap-6 text-center items-center py-6">
                <div className="w-16 h-16 rounded-full bg-success/15 border border-success/30 flex items-center justify-center text-success shadow-[0_0_24px_rgba(22,163,74,0.15)]">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <div className="flex flex-col gap-2.5">
                  <h2 className="text-2xl font-black tracking-tight text-brand-navy">
                    Your Investment Journey Begins Today
                  </h2>
                  <p className="text-xs md:text-sm text-brand-secondary max-w-sm mx-auto leading-relaxed">
                    Explore research signals, track portfolios, receive AI recommendations, and make smarter investment decisions.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-brand-border rounded-full px-3.5 py-1.5 text-[10px] text-brand-secondary font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                  <span>Personalized Profile Active</span>
                </div>

                <div className="flex flex-col gap-3 w-full max-w-xs mt-4">
                  <Button variant="primary" onClick={handleFinalRedirect} className="py-4 bg-gradient-to-r from-primary to-blue-700 shadow-glow-blue border border-white/5 font-bold text-white">
                    Go to Dashboard
                  </Button>
                  <Button variant="secondary" onClick={handleFinalRedirect} className="py-4">
                    View Quick Tour
                  </Button>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom security footer */}
      {screen < 9 && (
        <div className="max-w-md mx-auto w-full text-center flex items-center justify-center gap-2 border-t border-slate-250 pt-6 text-[10px] text-brand-secondary">
          <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>Security encryption active. Advisory selections drive automated platform feeds.</span>
        </div>
      )}
    </div>
  );
};
export default InvestorPersonalization;
