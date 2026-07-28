import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, BarChart3, CandlestickChart, Briefcase, Shield,
  TrendingUp, Zap, CheckCircle2, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Animated: AI Signal Ticker (Card 1 — wide) ─────────────────────────────
const AI_SIGNALS = [
  { symbol: 'RELIANCE', action: 'BUY', conf: 96, pattern: 'Cup & Handle', target: '₹3,120', color: 'text-emerald-400' },
  { symbol: 'TCS', action: 'BUY', conf: 91, pattern: 'Bull Flag', target: '₹4,280', color: 'text-emerald-400' },
  { symbol: 'INFY', action: 'BUY', conf: 88, pattern: 'Breakout', target: '₹1,620', color: 'text-emerald-400' },
  { symbol: 'TATASTEEL', action: 'SELL', conf: 83, pattern: 'H&S Top', target: '₹140', color: 'text-red-400' },
  { symbol: 'HDFCBANK', action: 'BUY', conf: 94, pattern: 'Golden Cross', target: '₹1,720', color: 'text-emerald-400' },
  { symbol: 'WIPRO', action: 'BUY', conf: 87, pattern: 'Ascending △', target: '₹520', color: 'text-emerald-400' },
];

function AISignalAnimation() {
  const [idx, setIdx] = useState(0);
  const [chartPts, setChartPts] = useState([55, 48, 52, 40, 38, 30, 33, 22, 20, 15]);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx(p => (p + 1) % AI_SIGNALS.length);
      setChartPts(prev => {
        const last = prev[prev.length - 1];
        const next = Math.max(5, Math.min(58, last + (Math.random() - 0.45) * 10));
        return [...prev.slice(1), next];
      });
    }, 2200);
    return () => clearInterval(t);
  }, []);

  const sig = AI_SIGNALS[idx];
  const w = 200, h = 60;
  const pts = chartPts.map((y, i) => `${(i / (chartPts.length - 1)) * w},${y}`).join(' ');
  const area = `M0,${chartPts[0]} ` + chartPts.map((y, i) => `L${(i / (chartPts.length - 1)) * w},${y}`).join(' ') + ` L${w},${h} L0,${h} Z`;

  return (
    <div className="flex flex-col gap-3 mt-3">
      {/* Mini live chart */}
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-14" preserveAspectRatio="none">
        <defs>
          <linearGradient id="bentoChartGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <linearGradient id="bentoAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#bentoAreaGrad)" />
        <polyline points={pts} fill="none" stroke="url(#bentoChartGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={(chartPts.length - 1) / (chartPts.length - 1) * w} cy={chartPts[chartPts.length - 1]} r="3.5" fill="#10B981">
          <animate attributeName="r" values="3;5;3" dur="1.4s" repeatCount="indefinite" />
        </circle>
      </svg>
      {/* Signal row */}
      <motion.div
        key={idx}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.35 }}
        className="flex items-center justify-between bg-white/[0.06] border border-white/[0.08] rounded-xl px-3 py-2"
      >
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full animate-pulse ${sig.action === 'BUY' ? 'bg-emerald-400' : 'bg-red-400'}`} />
          <span className="text-white font-black text-sm">{sig.symbol}</span>
          <span className="text-slate-500 text-[10px]">{sig.pattern}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[10px] font-mono">{sig.target}</span>
          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${sig.action === 'BUY' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
            {sig.action} {sig.conf}%
          </span>
        </div>
      </motion.div>
      {/* Stock queue */}
      <div className="flex gap-1.5 flex-wrap">
        {AI_SIGNALS.map((s, i) => (
          <span key={i} className={`text-[9px] font-mono px-2 py-0.5 rounded-full border transition-all duration-300 ${
            i === idx
              ? 'border-blue-500/50 text-blue-400 bg-blue-500/10'
              : 'border-white/[0.06] text-slate-600'
          }`}>{s.symbol}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Animated: Latency Pulse (Card 2 — tall) ────────────────────────────────
function LatencyAnimation() {
  const [bars, setBars] = useState([8, 12, 6, 9, 7, 11, 8, 5, 10, 7]);
  const [latency, setLatency] = useState(12);

  useEffect(() => {
    const t = setInterval(() => {
      setBars(prev => {
        const n = Math.floor(Math.random() * 14) + 4;
        return [...prev.slice(1), n];
      });
      setLatency(Math.floor(Math.random() * 8) + 8);
    }, 600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col gap-3 mt-3">
      {/* Latency badge */}
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-[11px] font-semibold">Feed Latency</span>
        <motion.span
          key={latency}
          initial={{ scale: 0.85, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-emerald-400 text-xs font-black font-mono"
        >
          &lt;{latency}ms
        </motion.span>
      </div>
      {/* Live bar chart */}
      <div className="flex items-end gap-1 h-12">
        {bars.map((b, i) => (
          <motion.div
            key={i}
            animate={{ height: `${(b / 16) * 100}%` }}
            transition={{ duration: 0.4 }}
            className={`flex-1 rounded-sm ${i === bars.length - 1 ? 'bg-emerald-400' : 'bg-blue-500/30'}`}
          />
        ))}
      </div>
      {/* Feed indicators */}
      <div className="space-y-1.5">
        {['NSE Tick Feed', 'BSE Tick Feed', 'F&O OI Feed'].map((feed, i) => (
          <div key={feed} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
              <span className="text-slate-400 text-[10px]">{feed}</span>
            </div>
            <span className="text-emerald-400 text-[10px] font-mono font-bold">LIVE</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Animated: MACD / RSI lines (Card 3) ────────────────────────────────────
function ChartingAnimation() {
  const [rsi, setRsi] = useState(58);
  const [macdPts, setMacdPts] = useState([0, 2, 5, 3, 6, 8, 5, 9, 7, 10]);

  useEffect(() => {
    const t = setInterval(() => {
      setRsi(prev => Math.max(20, Math.min(80, prev + (Math.random() - 0.45) * 5)));
      setMacdPts(prev => {
        const last = prev[prev.length - 1];
        const next = Math.max(-5, Math.min(15, last + (Math.random() - 0.48) * 3));
        return [...prev.slice(1), next];
      });
    }, 1500);
    return () => clearInterval(t);
  }, []);

  const w = 160, h = 40;
  const min = Math.min(...macdPts), max = Math.max(...macdPts), range = max - min || 1;
  const pts = macdPts.map((y, i) => `${(i / (macdPts.length - 1)) * w},${h - ((y - min) / range) * h}`).join(' ');

  return (
    <div className="flex flex-col gap-3 mt-3">
      {/* RSI gauge */}
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-[10px] text-slate-400 font-semibold">RSI (14)</span>
          <motion.span
            key={Math.round(rsi)}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className={`text-[10px] font-black ${rsi > 70 ? 'text-red-400' : rsi < 30 ? 'text-blue-400' : 'text-emerald-400'}`}
          >
            {rsi.toFixed(1)}
          </motion.span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            animate={{ width: `${rsi}%` }}
            transition={{ duration: 0.8 }}
            className={`h-full rounded-full ${rsi > 70 ? 'bg-red-400' : rsi < 30 ? 'bg-blue-400' : 'bg-emerald-400'}`}
          />
        </div>
      </div>
      {/* MACD line */}
      <div>
        <span className="text-[10px] text-slate-400 font-semibold block mb-1">MACD Signal</span>
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-8" preserveAspectRatio="none">
          <polyline points={pts} fill="none" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {/* Tags */}
      <div className="flex gap-2 flex-wrap">
        {['Golden Cross', 'Vol Surge', 'RSI OB'].map((t) => (
          <span key={t} className="text-[9px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">{t}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Animated: Portfolio Donut (Card 4 — wide) ───────────────────────────────
const PORTFOLIO_SLICES = [
  { label: 'Large Cap', pct: 45, color: '#2563EB' },
  { label: 'Mid Cap', pct: 30, color: '#10B981' },
  { label: 'Small Cap', pct: 15, color: '#F59E0B' },
  { label: 'Debt', pct: 10, color: '#8B5CF6' },
];

function PortfolioAnimation() {
  const [cagr, setCagr] = useState(22.4);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCagr(prev => parseFloat((Math.max(18, Math.min(26, prev + (Math.random() - 0.48) * 0.3))).toFixed(1)));
      setRotation(prev => prev + 0.5);
    }, 100);
    return () => clearInterval(t);
  }, []);

  // Build SVG donut arcs
  const r = 28, cx = 36, cy = 36, strokeW = 8;
  let cumAngle = -90;
  const arcs = PORTFOLIO_SLICES.map(s => {
    const angle = (s.pct / 100) * 360;
    const start = cumAngle;
    cumAngle += angle;
    const a1 = (start * Math.PI) / 180;
    const a2 = ((start + angle - 1) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
    return { ...s, d: `M${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${angle > 180 ? 1 : 0},1 ${x2.toFixed(1)},${y2.toFixed(1)}` };
  });

  return (
    <div className="flex gap-4 mt-3 items-center">
      {/* Donut */}
      <div className="relative shrink-0">
        <motion.svg
          animate={{ rotate: rotation }}
          style={{ originX: '50%', originY: '50%' }}
          viewBox="0 0 72 72" width="72" height="72"
        >
          {arcs.map((arc, i) => (
            <path key={i} d={arc.d} fill="none" stroke={arc.color} strokeWidth={strokeW} strokeLinecap="butt" />
          ))}
        </motion.svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[9px] font-black text-white leading-none text-center">
            {cagr}%<br /><span className="text-[8px] text-slate-400 font-normal">CAGR</span>
          </span>
        </div>
      </div>
      {/* Legend */}
      <div className="flex-1 space-y-1.5">
        {PORTFOLIO_SLICES.map(s => (
          <div key={s.label} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-[10px] text-slate-400">{s.label}</span>
            </div>
            <span className="text-[10px] font-bold text-white">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Animated: Compliance Check (Card 5) ─────────────────────────────────────
const CHECKS = [
  'SEBI RA Regulation 2014',
  'Conflict of Interest Disclosure',
  'Risk Profiling Complete',
  'Client KYC Verified',
  'Research Disclaimer Added',
];

function ComplianceAnimation() {
  const [done, setDone] = useState<number[]>([]);

  useEffect(() => {
    setDone([]);
    let i = 0;
    const t = setInterval(() => {
      if (i < CHECKS.length) {
        setDone(prev => [...prev, i]);
        i++;
      } else {
        clearInterval(t);
        setTimeout(() => setDone([]), 1800);
      }
    }, 700);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col gap-1.5 mt-3">
      {CHECKS.map((check, i) => (
        <motion.div
          key={check}
          className="flex items-center gap-2"
          animate={{ opacity: done.includes(i) ? 1 : 0.3 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {done.includes(i) ? (
              <motion.div key="done" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              </motion.div>
            ) : (
              <div key="pending" className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
            )}
          </AnimatePresence>
          <span className={`text-[10px] font-medium transition-colors ${done.includes(i) ? 'text-slate-300' : 'text-slate-600'}`}>
            {check}
          </span>
        </motion.div>
      ))}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-[10px] text-slate-500 font-mono">SEBI RA:</span>
        <span className="text-[10px] text-rose-400 font-black">INH000009821</span>
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse ml-auto" />
      </div>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
interface Props { theme: 'dark' | 'light' }

export const BentoFeaturesSection: React.FC<Props> = ({ theme }) => {
  const navigate = useNavigate();
  const dark = theme === 'dark';

  const cardBase = `rounded-3xl flex flex-col overflow-hidden transition-all duration-300 ${
    dark
      ? 'bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/[0.10] shadow-[0_4px_32px_rgba(0,0,0,0.35)]'
      : 'bg-white/60 backdrop-blur-xl border border-slate-200/40 hover:bg-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)]'
  }`;

  return (
    <section id="capabilities" className="space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-blue-500 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">
          Platform Features
        </span>
        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black font-display ${dark ? 'text-white' : 'text-slate-900'}`}>
          Everything Needed to Generate Alpha
        </h2>
        <p className={`text-sm font-medium ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
          Modular capabilities engineered for stock traders and long-term investors.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-auto gap-4">

        {/* ── Cell 1: AI Signal Engine — wide (span 2) ──────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`${cardBase} lg:col-span-2 p-6 group`}
        >
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
              4,000+ Stocks
            </span>
          </div>
          <h3 className={`text-lg font-black mt-4 group-hover:text-blue-400 transition-colors ${dark ? 'text-white' : 'text-slate-900'}`}>
            Autonomous AI Signal Engine
          </h3>
          <p className={`text-xs leading-relaxed mt-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            Scans candlestick patterns, volume surges, and RSI breakouts across 4,000+ Indian stocks in real time.
          </p>
          <AISignalAnimation />
        </motion.div>

        {/* ── Cell 2: NSE/BSE Feeds — tall ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`${cardBase} p-6 group`}
        >
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />LIVE
            </span>
          </div>
          <h3 className={`text-lg font-black mt-4 group-hover:text-emerald-400 transition-colors ${dark ? 'text-white' : 'text-slate-900'}`}>
            Sub-Second NSE/BSE Feeds
          </h3>
          <p className={`text-xs leading-relaxed mt-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            Direct exchange tick streaming with order book depth and instant notifications.
          </p>
          <LatencyAnimation />
        </motion.div>

        {/* ── Cell 3: Pro Charting ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className={`${cardBase} p-6 group`}
        >
          <div className="w-11 h-11 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
            <CandlestickChart className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className={`text-lg font-black mt-4 group-hover:text-purple-400 transition-colors ${dark ? 'text-white' : 'text-slate-900'}`}>
            Pro Charting & Screener
          </h3>
          <p className={`text-xs leading-relaxed mt-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            Professional technical charts with RSI, MACD, Moving Averages, and fundamental ratio filters.
          </p>
          <ChartingAnimation />
        </motion.div>

        {/* ── Cell 4: Portfolio Rebalance — wide ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`${cardBase} lg:col-span-2 p-6 group`}
        >
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              Auto-Rebalance
            </span>
          </div>
          <h3 className={`text-lg font-black mt-4 group-hover:text-amber-400 transition-colors ${dark ? 'text-white' : 'text-slate-900'}`}>
            Portfolio Auto-Rebalance
          </h3>
          <p className={`text-xs leading-relaxed mt-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            Multi-asset wealth tracking with automated risk-adjusted CAGR optimization. Live allocation spinning to maintain your targets.
          </p>
          <PortfolioAnimation />
          <button
            onClick={() => navigate('/signup')}
            className="mt-4 self-start inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-xs font-bold transition"
          >
            View Portfolio Intelligence <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>

        {/* ── Cell 5: SEBI Compliance — full width ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className={`${cardBase} lg:col-span-3 p-6 group`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

            {/* Left: heading */}
            <div className="flex flex-col gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-600/20 border border-rose-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className={`text-lg font-black group-hover:text-rose-400 transition-colors ${dark ? 'text-white' : 'text-slate-900'}`}>
                SEBI Compliant Advisory
              </h3>
              <p className={`text-xs leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                Every research call is cross-checked against SEBI RA Regulations 2014 before publication. Zero tolerance for conflict of interest.
              </p>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded-lg w-fit">
                RA: INH000009821
              </span>
            </div>

            {/* Middle: animated compliance checklist */}
            <div>
              <span className={`text-[11px] font-bold uppercase tracking-wider mb-3 block ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                Compliance Checklist
              </span>
              <ComplianceAnimation />
            </div>

            {/* Right: stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Research Calls', value: '12,400+', color: 'text-rose-400' },
                { label: 'Accuracy Rate', value: '98.4%', color: 'text-emerald-400' },
                { label: 'Registered Since', value: '2019', color: 'text-white' },
                { label: 'Compliance Score', value: '100%', color: 'text-emerald-400' },
              ].map(stat => (
                <div key={stat.label} className={`rounded-2xl p-3 ${dark ? 'bg-white/[0.04]' : 'bg-slate-50'}`}>
                  <span className={`text-xl font-black block ${stat.color}`}>{stat.value}</span>
                  <span className={`text-[10px] font-medium block mt-0.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{stat.label}</span>
                </div>
              ))}
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default BentoFeaturesSection;
