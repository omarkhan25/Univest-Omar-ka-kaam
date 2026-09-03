import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, Gem, Sparkles, ShieldCheck, CheckCircle2, 
  ArrowRight, Coins, FlaskConical, Zap, BarChart3, 
  TrendingUp, Award, Check, HelpCircle, ChevronRight, X
} from 'lucide-react';

interface LockedInvestmentLabPaywallProps {
  onUnlockPremium?: () => void;
  onSimulatePremium?: () => void;
}

export const LockedInvestmentLabPaywall: React.FC<LockedInvestmentLabPaywallProps> = ({
  onUnlockPremium,
  onSimulatePremium
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. HERO PAYWALL BANNER */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#15519D] text-white rounded-[32px] p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-slate-700/60">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
          
          {/* LEFT CONTENT */}
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 border border-amber-400/30">
                <Lock className="w-3.5 h-3.5" /> Premium Feature Locked
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 font-bold text-xs flex items-center gap-1.5 border border-blue-400/20">
                <Coins className="w-3.5 h-3.5 text-amber-400" /> Virtual Token Simulation System
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Unlock ArthSetu Investment Lab & Token Intelligence
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              The Investment Lab allows you to test investment thesis with <strong>₹1,50,000 in Virtual Tokens</strong>, track decision scores, and execute trades seamlessly. Upgrade to <strong>ArthSetu Pro</strong> to unlock full access!
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onUnlockPremium}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl hover:shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-2 group transform hover:-translate-y-0.5"
              >
                <Gem className="w-4 h-4 text-slate-950 fill-current" />
                <span>Unlock Premium Membership</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onSimulatePremium}
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm rounded-2xl border border-white/20 transition-all cursor-pointer flex items-center gap-2 backdrop-blur-md"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Simulate Premium Active Mode</span>
              </button>
            </div>
          </div>

          {/* RIGHT BADGE CARD */}
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 text-center xl:text-left space-y-4 shrink-0 max-w-xs shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black mx-auto xl:mx-0 shadow-lg">
              <FlaskConical className="w-6 h-6" />
            </div>

            <div>
              <div className="text-xs font-black text-amber-300 uppercase tracking-wider">Virtual Capital Provided</div>
              <div className="text-3xl font-black text-white mt-1 font-mono">₹1,50,000</div>
              <div className="text-xs text-slate-300 font-semibold mt-1">Configured Simulation Tokens</div>
            </div>

            <div className="pt-3 border-t border-white/15 text-[11px] text-slate-300 font-medium space-y-1.5">
              <div className="flex items-center gap-1.5 justify-center xl:justify-start">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero Financial Risk</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center xl:justify-start">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>1-Click Order Execution</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center xl:justify-start">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>AI Decision Score Tracking</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. WHY YOU SHOULD BUY (KEY BENEFITS GRID) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#15519D]" />
          <h2 className="text-xl font-black text-slate-900">Why Upgrade to ArthSetu Pro?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* BENEFIT 1 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3 hover:border-blue-300 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#15519D] flex items-center justify-center font-black group-hover:bg-[#15519D] group-hover:text-white transition-colors">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Virtual Token Allocation</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Test your stock picks with ₹1,50,000 in virtual capital. Evaluate thesis progression and see returns before risking real money in the market.
            </p>
          </div>

          {/* BENEFIT 2 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3 hover:border-emerald-300 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">1-Click Trade Execution</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Connect your broker account and convert paper investment decisions into real-world market orders with 1-click execution.
            </p>
          </div>

          {/* BENEFIT 3 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3 hover:border-amber-300 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">AI Conviction & Decision Score</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Get detailed AI scores (0-100) analyzing business quality, valuation safety, financial health, and risk parameters for every stock.
            </p>
          </div>
        </div>
      </div>

      {/* 3. ABOUT VIRTUAL TOKENS SYSTEM */}
      <div className="bg-gradient-to-r from-blue-50/80 via-white to-amber-50/60 p-6 sm:p-8 rounded-3xl border border-blue-100 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-blue-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#15519D] text-white flex items-center justify-center font-black">
              <Coins className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">About the Token Investment System</h3>
              <p className="text-xs text-slate-500 font-medium">How virtual tokens help you become a disciplined, high-conviction investor.</p>
            </div>
          </div>

          <span className="px-3 py-1 bg-amber-100 text-amber-800 font-extrabold text-xs rounded-full shrink-0">
            100% Risk-Free Practice Environment
          </span>
        </div>

        {/* 4 STEPS TIMELINE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Receive Virtual Tokens', desc: 'Every Pro member receives ₹1.5 Lakhs in virtual simulation tokens.' },
            { step: '02', title: 'Write Investment Thesis', desc: 'Tag every token allocation with your rationale (Value, Growth, Momentum).' },
            { step: '03', title: 'Track AI Performance', desc: 'ArthSetu AI evaluates your thesis playing out against real-time market data.' },
            { step: '04', title: 'Execute Live Orders', desc: 'Convert top-performing paper strategies into live broker orders with 1 click.' }
          ].map((st) => (
            <div key={st.step} className="p-4 bg-white rounded-2xl border border-blue-100/80 shadow-2xs space-y-2">
              <span className="text-xl font-black text-[#15519D]">{st.step}</span>
              <h4 className="text-xs font-black text-slate-900">{st.title}</h4>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. MEMBERSHIP PRICING TIERS */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <span className="px-3 py-1 bg-blue-50 text-[#15519D] font-extrabold text-xs rounded-full uppercase tracking-wider">
            Flexible Pricing Options
          </span>
          <h2 className="text-2xl font-black text-slate-900">Choose Your Membership Plan</h2>
          <p className="text-xs text-slate-500 font-medium">Transparent pricing with no hidden charges or commitment lock-ins.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TIER 1: ARTHSETU PICKS */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-6 hover:border-slate-300 transition-all">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">BASIC RESEARCH</span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">ArthSetu Picks</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">For investors looking for individual stock recommendations.</p>
              </div>

              <div className="pb-4 border-b border-slate-100">
                <span className="text-3xl font-black text-slate-900">₹999</span>
                <span className="text-xs text-slate-500 font-medium"> / month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 font-semibold">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  High-Conviction Stock Picks
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Full Research Thesis Reports
                </li>
                <li className="flex items-center gap-2 text-slate-400 line-through">
                  <X className="w-4 h-4 text-slate-300 shrink-0" />
                  Virtual Token Investment Lab
                </li>
                <li className="flex items-center gap-2 text-slate-400 line-through">
                  <X className="w-4 h-4 text-slate-300 shrink-0" />
                  1-Click Buy/Sell Order Execution
                </li>
              </ul>
            </div>

            <button
              onClick={onUnlockPremium}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-xs rounded-xl transition cursor-pointer"
            >
              Select Basic Plan
            </button>
          </div>

          {/* TIER 2: ARTHSETU PRO (POPULAR) */}
          <div className="bg-gradient-to-b from-[#123B63] to-[#15519D] text-white p-7 rounded-3xl shadow-xl flex flex-col justify-between space-y-6 relative border-2 border-amber-400 transform scale-105">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-full shadow-md">
              Most Popular • Includes Investment Lab
            </span>

            <div className="space-y-4 pt-2">
              <div>
                <span className="text-[10px] font-extrabold text-blue-200 uppercase tracking-wider">COMPLETE INTELLIGENCE</span>
                <h3 className="text-2xl font-black text-white mt-0.5">ArthSetu Pro</h3>
                <p className="text-xs text-blue-100 font-medium mt-1">Full Investment Lab, Virtual Tokens, AI Radar & Direct Execution.</p>
              </div>

              <div className="pb-4 border-b border-white/20">
                <span className="text-4xl font-black text-white">₹1,499</span>
                <span className="text-xs text-blue-200 font-medium"> / month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-blue-50 font-semibold">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <strong>Full Investment Lab Access</strong>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <strong>₹1,50,000 Virtual Tokens Allocation</strong>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <strong>1-Click Buy/Sell Order Execution</strong>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  AI Market Radar & Conviction Scores
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  Thesis & Decision Journaling
                </li>
              </ul>
            </div>

            <button
              onClick={onUnlockPremium}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Gem className="w-4 h-4 fill-current" />
              <span>Unlock Pro Membership Now</span>
            </button>
          </div>

          {/* TIER 3: ELITE WEALTH */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-6 hover:border-slate-300 transition-all">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">ANNUAL PRO</span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">Elite Wealth</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">For serious investors seeking dedicated analyst support & audits.</p>
              </div>

              <div className="pb-4 border-b border-slate-100">
                <span className="text-3xl font-black text-slate-900">₹4,999</span>
                <span className="text-xs text-slate-500 font-medium"> / year (Save 72%)</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 font-semibold">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Everything in Pro Membership
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Dedicated Senior Analyst Support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Quarterly Portfolio Health Audit
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Priority AI Signal Alerts
                </li>
              </ul>
            </div>

            <button
              onClick={onUnlockPremium}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition cursor-pointer"
            >
              Select Annual Plan
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LockedInvestmentLabPaywall;
