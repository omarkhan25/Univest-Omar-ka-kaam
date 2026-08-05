import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft, BrainCircuit, Check, Sparkles,
  User, TrendingUp, Target, Activity, PieChart, Briefcase, BellRing, Rocket
} from 'lucide-react';
import { Button } from '../atoms/Button';

const EXPERIENCES = [
  { value: 'Beginner', title: 'Beginner', desc: 'Learning to invest. Focus on low-risk mutual funds and primary blue chips.' },
  { value: 'Intermediate', title: 'Intermediate', desc: 'Some investing experience. Understands stock market mechanics and basic portfolio weightings.' },
  { value: 'Advanced', title: 'Advanced', desc: 'Experienced investor. Familiar with breakouts, options strategies, and MCX commodities.' },
  { value: 'Professional', title: 'Professional', desc: 'Active trader or financial professional. High frequency trades and option-writing.' },
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
  'Defence', 'Real Estate', 'Artificial Intelligence', 'Renewable Energy'
];

const RISK_CONFIGS = [
  { level: 'Conservative', return: '6 - 8%', risk: 'Very Low', desc: 'Capital preservation is your primary objective. Focused on corporate bonds, large debt schemes, and gold.' },
  { level: 'Balanced', return: '10 - 12%', risk: 'Moderate', desc: 'Standard hybrid allocation between blue-chip equities and bonds to grow capital steadily.' },
  { level: 'Growth', return: '14 - 16%', risk: 'High', desc: 'Prioritize wealth growth with higher volatility tolerance. Heavy focus on mid-caps and growth equities.' },
  { level: 'Aggressive', return: '18 - 22%+', risk: 'Extreme', desc: 'Maximize short-term advisory strategy returns, derivatives swing trading, and breakout commodities.' },
];

// ─── PREMIUM ABSTRACT VISUAL CANVASES ──────────────────────────────────────────

const AmbientBackground = () => (
  <div className="absolute inset-0 overflow-hidden bg-slate-950 pointer-events-none">
    {/* Subtle financial grid */}
    <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    
    {/* Slow Layered Mesh Gradients */}
    <motion.div 
      animate={{ x: [0, 30, -30, 0], y: [0, -30, 30, 0] }}
      transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-blue-900/40 rounded-full blur-[120px] mix-blend-screen"
    />
    <motion.div 
      animate={{ x: [0, -40, 40, 0], y: [0, 40, -40, 0] }}
      transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      className="absolute top-1/2 right-0 w-[25rem] h-[25rem] bg-cyan-900/20 rounded-full blur-[100px] mix-blend-screen"
    />
    <motion.div 
      animate={{ opacity: [0.1, 0.2, 0.1] }}
      transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-0 left-1/4 w-[20rem] h-[20rem] bg-emerald-900/10 rounded-full blur-[100px] mix-blend-screen"
    />
    
    {/* Noise Texture */}
    <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
  </div>
);

const IdentityAbstract = () => (
  <div className="relative w-72 h-80 flex items-center justify-center">
    <div className="absolute inset-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
      {/* Geometric Shield / Face ID framing */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M 20 20 L 30 20 M 20 20 L 20 30" fill="none" stroke="white" strokeWidth="0.5" />
        <path d="M 80 20 L 70 20 M 80 20 L 80 30" fill="none" stroke="white" strokeWidth="0.5" />
        <path d="M 20 80 L 30 80 M 20 80 L 20 70" fill="none" stroke="white" strokeWidth="0.5" />
        <path d="M 80 80 L 70 80 M 80 80 L 80 70" fill="none" stroke="white" strokeWidth="0.5" />
      </svg>
      
      {/* Core abstract node */}
      <motion.div 
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="w-20 h-28 border-[0.5px] border-cyan-400/40 rounded-t-full rounded-b-[2rem] shadow-[0_0_30px_rgba(34,211,238,0.15)] flex items-center justify-center"
      >
        <div className="w-8 h-12 border-[0.5px] border-emerald-400/30 rounded-t-full rounded-b-xl" />
      </motion.div>
      
      {/* Scanning Laser */}
      <motion.div 
        animate={{ y: [-120, 120, -120] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.5)]"
      />
    </div>
  </div>
);

const JourneyAbstract = () => (
  <div className="relative w-72 h-80 flex items-center justify-center">
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
       <motion.path 
         d="M 10 90 Q 40 80, 50 50 T 90 10" 
         fill="none" 
         stroke="rgba(255,255,255,0.1)" 
         strokeWidth="0.5" 
       />
       <motion.path 
         d="M 10 90 Q 40 80, 50 50 T 90 10" 
         fill="none" 
         stroke="rgba(34,211,238,0.6)" 
         strokeWidth="1"
         animate={{ strokeDasharray: ["0, 300", "300, 0"] }}
         transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
       />
    </svg>
    {/* Abstract Data Nodes */}
    <div className="absolute bottom-[10%] left-[10%] w-2 h-2 bg-white/30 backdrop-blur-md rounded-full border border-white/40" />
    <motion.div 
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400/40 backdrop-blur-md rounded-full border border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]" 
    />
    <div className="absolute top-[10%] right-[10%] w-2 h-2 bg-white/30 backdrop-blur-md rounded-full border border-white/40" />
    
    {/* Glass overlay card */}
    <div className="absolute top-[40%] left-[30%] w-32 h-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center px-4 gap-3">
       <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center">
         <div className="w-2 h-2 bg-white/50 rounded-full" />
       </div>
       <div className="flex-1 flex flex-col gap-1.5">
         <div className="w-full h-1 bg-white/20 rounded-full" />
         <div className="w-2/3 h-1 bg-white/10 rounded-full" />
       </div>
    </div>
  </div>
);

const GoalsAbstract = () => (
  <div className="relative w-72 h-80 flex items-end pb-16 justify-center gap-6">
     {[1, 2, 3].map((i) => (
       <motion.div 
         key={i}
         className="w-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-t-2xl relative overflow-hidden flex justify-center"
         initial={{ height: 40 }}
         animate={{ height: 40 + i * 40 }}
         transition={{ duration: 4, delay: i * 0.3, ease: "easeOut" }}
       >
         <motion.div
           animate={{ y: [200, -100] }}
           transition={{ duration: 8, delay: i * 1.5, repeat: Infinity, ease: "linear" }}
           className="absolute bottom-0 w-[1px] h-32 bg-gradient-to-t from-transparent via-cyan-400/50 to-transparent shadow-[0_0_10px_rgba(34,211,238,0.5)]"
         />
       </motion.div>
     ))}
  </div>
);

const RiskAbstract = ({ activeRisk }: { activeRisk: number }) => (
  <div className="relative w-72 h-80 flex flex-col items-center justify-center gap-6">
    <div className="absolute top-10 bottom-10 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
    
    {[0, 1, 2].map((i) => {
      const isActive = (i === 0 && activeRisk <= 1) || (i === 1 && activeRisk === 2) || (i === 2 && activeRisk === 3);
      return (
        <motion.div 
          key={i}
          animate={{ x: isActive ? 15 : 0, scale: isActive ? 1.05 : 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`relative z-10 w-48 h-14 backdrop-blur-2xl rounded-2xl border-[0.5px] flex items-center justify-start px-6 gap-4 ${
            isActive 
              ? 'bg-white/10 border-cyan-400/40 shadow-[0_0_30px_rgba(34,211,238,0.1)]' 
              : 'bg-white/5 border-white/10'
          }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'bg-white/20'}`} />
          <div className={`h-[1px] rounded-full ${isActive ? 'w-20 bg-cyan-400/50' : 'w-12 bg-white/10'}`} />
        </motion.div>
      )
    })}
  </div>
);

const AssetsAbstract = () => (
  <div className="relative w-72 h-80 flex items-center justify-center">
     <div className="absolute w-16 h-16 bg-white/5 backdrop-blur-2xl border border-white/20 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.05)]">
       <motion.div 
         animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
         transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
         className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.6)]" 
       />
     </div>
     
     <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
       <circle cx="50" cy="50" r="28" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="1 3" />
       <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="1 3" />
     </svg>
     
     <motion.div animate={{ rotate: 360 }} transition={{ duration: 32, repeat: Infinity, ease: "linear" }} className="absolute inset-0 flex items-center justify-center">
       <div className="absolute top-[12%] w-6 h-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full" />
     </motion.div>
     
     <motion.div animate={{ rotate: -360 }} transition={{ duration: 48, repeat: Infinity, ease: "linear" }} className="absolute inset-0 flex items-center justify-center">
       <div className="absolute bottom-[5%] w-5 h-5 bg-emerald-400/10 backdrop-blur-xl border border-emerald-400/20 rounded-full" />
       <div className="absolute left-[5%] w-3 h-3 bg-cyan-400/10 backdrop-blur-xl border border-cyan-400/20 rounded-full" />
     </motion.div>
  </div>
);

const SectorsAbstract = () => (
  <div className="relative w-72 h-80 flex items-center justify-center">
    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
       <motion.line x1="30" y1="30" x2="70" y2="50" stroke="white" strokeWidth="0.5" animate={{ strokeDasharray: ["0, 100", "100, 0"] }} transition={{ duration: 6, repeat: Infinity }} />
       <motion.line x1="70" y1="50" x2="40" y2="80" stroke="white" strokeWidth="0.5" animate={{ strokeDasharray: ["0, 100", "100, 0"] }} transition={{ duration: 7, repeat: Infinity }} />
       <motion.line x1="40" y1="80" x2="30" y2="30" stroke="white" strokeWidth="0.5" animate={{ strokeDasharray: ["0, 100", "100, 0"] }} transition={{ duration: 8, repeat: Infinity }} />
       <line x1="70" y1="20" x2="70" y2="50" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
    </svg>
    <div className="absolute top-[30%] left-[30%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/5 backdrop-blur-2xl border border-white/20 rounded-xl" />
    <motion.div 
       animate={{ opacity: [0.6, 1, 0.6] }}
       transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
       className="absolute top-[50%] left-[70%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white/5 backdrop-blur-2xl border border-cyan-400/40 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.15)] flex items-center justify-center"
    >
       <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
    </motion.div>
    <div className="absolute top-[80%] left-[40%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white/5 backdrop-blur-2xl border border-white/20 rounded-lg" />
  </div>
);

const AlertsAbstract = () => (
  <div className="relative w-72 h-80 flex flex-col items-center justify-center gap-6">
     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-400/5 rounded-full blur-2xl" />
     {[1, 2].map(i => (
       <div key={i} className="w-56 h-14 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl relative overflow-hidden flex items-center px-6">
         <motion.div 
           animate={{ x: [-150, 250] }}
           transition={{ duration: 4, delay: i * 2, repeat: Infinity, ease: "easeInOut" }}
           className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent skew-x-12"
         />
         <div className="w-10 h-[1px] bg-white/30 rounded-full" />
       </div>
     ))}
     <svg className="absolute inset-0 w-full h-full -z-10 opacity-10" viewBox="0 0 100 100">
       <path d="M 50 20 L 50 80" stroke="white" strokeWidth="0.5" strokeDasharray="1 4" />
     </svg>
  </div>
);

const BrainAbstract = () => (
  <div className="relative w-72 h-80 flex items-center justify-center">
     <motion.div 
       animate={{ rotate: 360, scale: [0.97, 1.03, 0.97] }}
       transition={{ rotate: { duration: 32, repeat: Infinity, ease: "linear" }, scale: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
       className="w-40 h-40 border-[0.5px] border-white/10 rounded-full flex items-center justify-center"
     >
       <motion.div 
         animate={{ rotate: -360 }}
         transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
         className="w-28 h-28 border-[0.5px] border-cyan-400/20 rounded-full flex items-center justify-center"
       >
         <div className="w-14 h-14 bg-white/5 backdrop-blur-3xl border border-white/20 rounded-full shadow-[0_0_40px_rgba(34,211,238,0.1)] flex items-center justify-center relative overflow-hidden">
            <motion.div 
              animate={{ opacity: [0, 1, 0] }} 
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
              className="absolute inset-0 bg-cyan-400/10" 
            />
            <div className="w-2 h-2 bg-cyan-400/60 rounded-full blur-[1px]" />
         </div>
       </motion.div>
     </motion.div>
  </div>
);

const RocketAbstract = () => (
  <div className="relative w-72 h-80 flex items-center justify-center">
    <div className="relative z-10 w-28 h-28 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6], scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="text-4xl font-light text-transparent bg-clip-text bg-gradient-to-tr from-cyan-300 to-white"
      >
        U
      </motion.div>
      <div className="absolute inset-0 border-[0.5px] border-cyan-400/20 rounded-[2.5rem]" />
    </div>
    
    <motion.div animate={{ y: [-250, 250], opacity: [0, 1, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} className="absolute left-16 w-[0.5px] h-40 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent" />
    <motion.div animate={{ y: [-250, 250], opacity: [0, 1, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 2 }} className="absolute right-20 w-[0.5px] h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
  </div>
);

const ScreenGraphic = ({ screen, activeRisk }: { screen: number, activeRisk: number }) => {
  const graphics = {
    1: { title: 'Secure Identity', desc: 'Every account is verified using industry-standard KYC to protect your investments and ensure regulatory compliance.', render: <IdentityAbstract /> },
    2: { title: 'Investment Journey', desc: 'Understanding your market experience allows us to calibrate complex strategies perfectly to your comfort level.', render: <JourneyAbstract /> },
    3: { title: 'Strategic Milestones', desc: 'Your financial objectives dictate our quantitative models, building a precise path to wealth creation.', render: <GoalsAbstract /> },
    4: { title: 'Risk Calibration', desc: 'Balancing algorithmic potential against volatility to construct a mathematically sound investment profile.', render: <RiskAbstract activeRisk={activeRisk} /> },
    5: { title: 'Asset Allocation', desc: 'Intelligently distributing capital across premium asset classes for maximum diversification and yield.', render: <AssetsAbstract /> },
    6: { title: 'Sector Intelligence', desc: 'Focusing on high-conviction industries and market segments powered by our real-time data networks.', render: <SectorsAbstract /> },
    7: { title: 'Secure Communications', desc: 'End-to-end encrypted alerts ensure you never miss a critical market movement or portfolio update.', render: <AlertsAbstract /> },
    8: { title: 'Neural Synthesis', desc: 'Our proprietary AI is now processing your unique parameters to generate a highly tailored investment matrix.', render: <BrainAbstract /> },
    9: { title: 'System Initialization', desc: 'Your personalized financial infrastructure is fully compiled. Welcome to the future of wealth management.', render: <RocketAbstract /> },
  };

  const curr = graphics[screen as keyof typeof graphics] || graphics[1];

  return (
    <div className="absolute inset-0 flex flex-col justify-center p-14 overflow-hidden bg-slate-950 border-r border-white/5">
      <AmbientBackground />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10 flex flex-col w-full h-full"
        >
          <div className="flex-1 flex items-center justify-center">
             {curr.render}
          </div>
          
          <div className="flex flex-col gap-3 mt-auto mb-8">
            <h2 className="text-3xl font-light text-white tracking-wide">{curr.title}</h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm font-light tracking-wide">{curr.desc}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export const InvestorPersonalization = () => {
  const navigate = useNavigate();
  const [screen, setScreen] = useState(1);
  
  const [experience, setExperience] = useState('Beginner');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [riskSlider, setRiskSlider] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  
  const [alertTypes, setAlertTypes] = useState({
    research: true, target: true, stoploss: true, ipo: false, news: true,
  });

  const [aiPercent, setAiPercent] = useState(0);

  useEffect(() => {
    if (screen === 8) {
      const interval = setInterval(() => {
        setAiPercent((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setScreen(9), 800);
            return 100;
          }
          return prev + 1;
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [screen]);

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]);
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]);
  };

  const toggleSector = (sector: string) => {
    setSelectedSectors(prev => prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]);
  };

  const nextScreen = () => setScreen(prev => Math.min(prev + 1, 9));
  const prevScreen = () => setScreen(prev => Math.max(prev - 1, 1));
  const handleFinalRedirect = () => navigate('/dashboard');
  const getProgress = () => screen === 9 ? 100 : Math.round((screen / 8) * 95);

  const currentRisk = RISK_CONFIGS[riskSlider];

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans selection:bg-blue-500/20">
      
      <div className="hidden lg:block lg:w-5/12 relative overflow-hidden shadow-2xl z-10">
        <ScreenGraphic screen={screen} activeRisk={riskSlider} />
      </div>

      <div className="flex-1 flex flex-col relative h-screen overflow-y-auto">
        <div className="flex-1 flex flex-col p-6 md:p-12 w-full max-w-2xl mx-auto">
          
          {screen < 9 && (
            <div className="w-full flex flex-col gap-4 z-10 mb-8 pt-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <button
                  onClick={prevScreen}
                  disabled={screen === 1}
                  className="flex items-center gap-1.5 hover:text-slate-900 transition-colors disabled:opacity-0 disabled:cursor-default focus:outline-none"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <span>{getProgress()}% Complete</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-600 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${getProgress()}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          <div className="flex-1 flex flex-col justify-center pb-12 max-w-xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={screen}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col gap-6"
              >
                
                {screen === 1 && (
                  <div className="flex flex-col gap-6 text-center items-center py-4">
                    <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-blue-500/20">
                      U
                    </div>
                    <div className="flex flex-col gap-2">
                      <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">Welcome to Univest,<br/>Omar Khan!</h2>
                      <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">Your identity verification is complete. Let's customize your investing parameters to build your unique wealth strategy.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 w-full bg-white border border-slate-200 p-5 rounded-2xl text-xs text-left max-w-sm mx-auto shadow-lg shadow-slate-200/50">
                      <div className="flex items-center gap-2 text-slate-800 font-bold"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span>PAN Verified</span></div>
                      <div className="flex items-center gap-2 text-slate-800 font-bold"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span>Aadhaar Verified</span></div>
                      <div className="flex items-center gap-2 text-slate-800 font-bold"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span>Bank Linked</span></div>
                      <div className="flex items-center gap-2 text-slate-800 font-bold"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span>Investor Certified</span></div>
                    </div>
                    <Button variant="primary" onClick={nextScreen} className="w-full max-w-sm mx-auto mt-4 py-4 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 rounded-xl text-base font-bold">
                      <span className="flex items-center justify-center gap-2">Build Investment Identity <ArrowRight className="w-4 h-4" /></span>
                    </Button>
                  </div>
                )}

                {screen === 2 && (
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-2xl font-black tracking-tight text-slate-900">How would you describe your experience?</h3>
                      <p className="text-sm text-slate-500">Select one option that matches your portfolio history.</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      {EXPERIENCES.map(exp => (
                        <button
                          key={exp.value}
                          onClick={() => setExperience(exp.value)}
                          className={`text-left p-4 rounded-xl border-2 transition-all duration-300 hover:-translate-y-1 ${
                            experience === exp.value ? 'bg-blue-50 border-blue-600 shadow-md shadow-blue-600/10' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-sm font-black text-slate-900">{exp.title}</span>
                            {experience === exp.value && <Check className="w-4 h-4 text-blue-600" />}
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">{exp.desc}</p>
                        </button>
                      ))}
                    </div>
                    <Button variant="primary" onClick={nextScreen} className="py-3.5 mt-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl text-base font-bold">Continue</Button>
                  </div>
                )}

                {screen === 3 && (
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-2xl font-black tracking-tight text-slate-900">What are you investing for?</h3>
                      <p className="text-sm text-slate-500">Choose all goals that align with your financial objectives.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1 pb-1">
                      {GOALS.map(goal => {
                        const isSelected = selectedGoals.includes(goal);
                        return (
                          <button
                            key={goal}
                            onClick={() => toggleGoal(goal)}
                            className={`p-4 text-left border-2 rounded-xl transition-all duration-300 hover:-translate-y-0.5 ${
                              isSelected ? 'bg-blue-50 border-blue-600 shadow-sm shadow-blue-600/10 text-blue-700 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:shadow-sm font-semibold'
                            }`}
                          >
                            <span className="text-xs">{goal}</span>
                          </button>
                        );
                      })}
                    </div>
                    <Button variant="primary" onClick={nextScreen} disabled={selectedGoals.length === 0} className="py-3.5 mt-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl text-base font-bold disabled:opacity-50">Continue</Button>
                  </div>
                )}

                {screen === 4 && (
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-2xl font-black tracking-tight text-slate-900">Set Your Risk Comfort Level</h3>
                      <p className="text-sm text-slate-500">Slide the meter to set acceptable volatility and return expectations.</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-5 relative overflow-hidden shadow-lg shadow-slate-200/50">
                      <div className="absolute -right-2 -top-2 text-slate-100"><Sparkles className="w-24 h-24 opacity-50 text-blue-50" /></div>
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3 relative z-10">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Advisory Strategy Match</span>
                        <span className="text-[10px] font-black bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1 rounded-full">{currentRisk.level}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 relative z-10">
                        <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Target Returns</span><span className="text-xl font-black text-emerald-500 mt-0.5">{currentRisk.return}</span></div>
                        <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Volatility Risk</span><span className="text-xl font-black text-slate-900 mt-0.5">{currentRisk.risk}</span></div>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1 border-t border-slate-100 pt-3 relative z-10">{currentRisk.desc}</p>
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                      <input type="range" min="0" max="3" step="1" value={riskSlider} onChange={(e) => setRiskSlider(parseInt(e.target.value))} className="w-full h-2.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all" />
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase px-1 mt-1">
                        <span>Conservative</span><span className="pl-4">Balanced</span><span className="pr-1">Growth</span><span>Aggressive</span>
                      </div>
                    </div>
                    <Button variant="primary" onClick={nextScreen} className="py-3.5 mt-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl text-base font-bold">Confirm Risk Level</Button>
                  </div>
                )}

                {screen === 5 && (
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-2xl font-black tracking-tight text-slate-900">Which assets interest you?</h3>
                      <p className="text-sm text-slate-500">We will prioritize advisory feeds containing these financial assets.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1 pb-1">
                      {INTERESTS.map(interest => {
                        const isSelected = selectedInterests.includes(interest);
                        return (
                          <button
                            key={interest}
                            onClick={() => toggleInterest(interest)}
                            className={`p-4 text-left border-2 rounded-xl transition-all duration-300 hover:-translate-y-0.5 ${
                              isSelected ? 'bg-blue-50 border-blue-600 shadow-sm shadow-blue-600/10 text-blue-700 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:shadow-sm font-semibold'
                            }`}
                          >
                            <span className="text-xs">{interest}</span>
                          </button>
                        );
                      })}
                    </div>
                    <Button variant="primary" onClick={nextScreen} disabled={selectedInterests.length === 0} className="py-3.5 mt-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl text-base font-bold disabled:opacity-50">Continue</Button>
                  </div>
                )}

                {screen === 6 && (
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-2xl font-black tracking-tight text-slate-900">Select preferred market sectors</h3>
                      <p className="text-sm text-slate-500">Pre-populates watchlists with top tickers in selected categories.</p>
                    </div>
                    <div className="flex flex-wrap gap-2.5 max-h-[350px] overflow-y-auto pr-1 pb-1">
                      {SECTORS.map(sector => {
                        const isSelected = selectedSectors.includes(sector);
                        return (
                          <button
                            key={sector}
                            onClick={() => toggleSector(sector)}
                            className={`px-4 py-2.5 rounded-full text-xs border-2 transition-all duration-300 hover:-translate-y-0.5 ${
                              isSelected ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-md shadow-blue-600/20' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:shadow-sm font-semibold'
                            }`}
                          >
                            {sector}
                          </button>
                        );
                      })}
                    </div>
                    <Button variant="primary" onClick={nextScreen} disabled={selectedSectors.length === 0} className="py-3.5 mt-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl text-base font-bold disabled:opacity-50">Confirm Sectors</Button>
                  </div>
                )}

                {screen === 7 && (
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-2xl font-black tracking-tight text-slate-900">Configure strategy alerts</h3>
                      <p className="text-sm text-slate-500">Stay updated on target hits, stop losses, and research disclaimers.</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      {Object.entries({ research: 'Research & Recommendation Alerts', target: 'Target Hit Alerts', stoploss: 'Stop Loss Alerts', ipo: 'IPO Updates & Market News' }).map(([key, label]) => (
                        <label key={key} className="flex items-center justify-between p-4 bg-white border-2 border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors shadow-sm">
                          <span className="font-bold text-slate-800 text-xs">{label}</span>
                          <input type="checkbox" checked={alertTypes[key as keyof typeof alertTypes]} onChange={(e) => setAlertTypes({ ...alertTypes, [key]: e.target.checked })} className="w-4.5 h-4.5 bg-transparent border-slate-300 rounded text-blue-600 focus:ring-blue-600 cursor-pointer" />
                        </label>
                      ))}
                    </div>
                    <Button variant="primary" onClick={nextScreen} className="py-3.5 mt-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl text-base font-bold">Enable Selected Alerts</Button>
                  </div>
                )}

                {screen === 8 && (
                  <div className="flex flex-col gap-6 text-center items-center py-8">
                    <div className="w-20 h-20 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 relative shadow-lg shadow-blue-500/10">
                      <BrainCircuit className="w-8 h-8" />
                      <div className="absolute inset-0 rounded-full border-[3px] border-blue-600 border-t-transparent animate-spin" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-2xl font-black tracking-tight text-slate-900">AI Advisory Setup</h3>
                      <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed h-10">
                        {aiPercent < 25 && 'Learning investment preferences...'}
                        {aiPercent >= 25 && aiPercent < 50 && 'Pre-populating custom watchlists...'}
                        {aiPercent >= 50 && aiPercent < 75 && 'Preparing research feed algorithms...'}
                        {aiPercent >= 75 && 'Structuring final dashboard workspace...'}
                      </p>
                    </div>
                    <div className="w-full max-w-[200px] flex flex-col gap-2 mt-4 items-center">
                      <span className="text-3xl font-black tracking-tight text-blue-600">{aiPercent}%</span>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out" style={{ width: `${aiPercent}%` }} />
                      </div>
                    </div>
                  </div>
                )}

                {screen === 9 && (
                  <div className="flex flex-col gap-6 text-center items-center py-8">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-500/20 relative">
                      <div className="absolute inset-0 rounded-full border-[3px] border-emerald-400 animate-[ping_2s_ease-in-out_infinite]" />
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">Your Journey Begins Today</h2>
                      <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">Explore research signals, track portfolios, receive AI recommendations, and make smarter investment decisions.</p>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-4 py-1.5 text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Personalized Profile Active</span>
                    </div>
                    <div className="flex flex-col gap-3 w-full max-w-xs mt-6">
                      <Button variant="primary" onClick={handleFinalRedirect} className="py-3.5 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 rounded-xl font-bold text-white text-base">Go to Dashboard</Button>
                      <Button variant="secondary" onClick={handleFinalRedirect} className="py-3.5 rounded-xl text-base font-bold border-2 border-slate-200 text-slate-600 hover:bg-slate-100">View Quick Tour</Button>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
          
          {screen < 9 && (
            <div className="w-full text-center flex items-center justify-center gap-2 border-t border-slate-200 pt-5 mt-auto text-[10px] font-semibold text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>Security encryption active. Advisory selections drive automated platform feeds.</span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
export default InvestorPersonalization;
