import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, TrendingUp, Clock, Activity, Briefcase, 
  BarChart3, Bookmark, Share2, Sparkles, AlertCircle, 
  ChevronRight, Calendar, Info, Award, ShieldCheck, ArrowUpRight, ArrowDownRight, Bell, ExternalLink, X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface StockDetailProps {
  isOpen: boolean;
  onClose: () => void;
  stock?: any;
  onInvestViaBroker?: (stock: any) => void;
  onSetAlert?: (stock: any) => void;
}

export const StockDetail: React.FC<StockDetailProps> = ({
  isOpen,
  onClose,
  stock,
  onInvestViaBroker,
  onSetAlert
}) => {
  const [chartInterval, setChartInterval] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | '5Y'>('1M');
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  if (!isOpen) return null;

  const symbol = stock?.symbol || 'RELIANCE';
  const companyName = stock?.companyName || stock?.name || 'Reliance Industries Ltd';
  const price = stock?.price || '2,934.50';
  const changePercent = stock?.changePercent ?? 1.25;
  const isPositive = changePercent >= 0;

  // Chart data calculation points based on timeframe
  const chartPointsMap: Record<string, number[]> = {
    '1D': [2910, 2920, 2915, 2928, 2934.5],
    '1W': [2890, 2905, 2900, 2925, 2934.5],
    '1M': [2820, 2870, 2850, 2910, 2934.5],
    '3M': [2750, 2810, 2790, 2890, 2934.5],
    '1Y': [2450, 2600, 2550, 2800, 2934.5],
    '5Y': [1400, 1750, 2100, 2650, 2934.5],
  };

  const points = chartPointsMap[chartInterval] || chartPointsMap['1M'];
  const minPt = Math.min(...points) * 0.98;
  const maxPt = Math.max(...points) * 1.02;

  // SVG Chart Polyline Points
  const chartSvgPoints = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * 500;
    const y = 180 - ((val - minPt) / (maxPt - minPt)) * 160;
    return `${x},${y}`;
  }).join(' ');

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Stock intelligence link copied to clipboard!');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-hidden">
        {/* Backdrop click listener */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative bg-[#F8FAFC] rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden my-auto z-10"
        >
          {/* HEADER */}
          <div className="p-5 md:p-6 bg-white border-b border-slate-200 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 z-20">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors"
                title="Close"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#15519D] text-white font-black text-lg flex items-center justify-center shadow-md">
                  {symbol.substring(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-extrabold text-slate-900">{companyName}</h1>
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 font-mono font-bold text-xs rounded-lg">
                      {symbol}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mt-0.5">
                    <span>NSE India</span> • <span className="text-[#16A34A] font-bold">● Market Open</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price & Primary Actions */}
            <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-6 flex-wrap md:flex-nowrap">
              <div>
                <div className="text-2xl font-black text-slate-900">₹{price}</div>
                <div className={`text-xs font-extrabold flex items-center justify-end gap-0.5 ${isPositive ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                  {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  <span>{isPositive ? `+${changePercent}%` : `${changePercent}%`} Today</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <button
                  onClick={() => {
                    setIsWatchlisted(!isWatchlisted);
                    toast.success(isWatchlisted ? 'Removed from Watchlist' : 'Added to Watchlist');
                  }}
                  className={`p-2.5 sm:p-3 rounded-2xl border transition-all ${
                    isWatchlisted ? 'bg-blue-50 border-blue-200 text-[#15519D]' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Add to Watchlist"
                >
                  <Bookmark className={`w-5 h-5 ${isWatchlisted ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={() => onSetAlert && onSetAlert(stock)}
                  className="p-2.5 sm:p-3 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl transition-all"
                  title="Set Alert"
                >
                  <Bell className="w-5 h-5" />
                </button>

                <button
                  onClick={handleShare}
                  className="p-2.5 sm:p-3 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl transition-all"
                  title="Share Stock Intelligence"
                >
                  <Share2 className="w-5 h-5" />
                </button>

                <button
                  onClick={() => {
                    toast.success(`Allocated ₹10,000 virtual capital to ${symbol} in your Investment Lab!`);
                  }}
                  className="px-5 py-3 bg-[#15519D] hover:bg-[#123B63] text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Add to Investment Lab</span>
                </button>

                <button
                  onClick={onClose}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-2xl transition-colors"
                  title="Close Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* BODY CONTENT */}
          <div className="p-6 md:p-8 space-y-8 overflow-y-auto flex-1 scrollbar-thin">
            {/* PRICE PERFORMANCE CHART SECTION */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#15519D]" />
                  <h3 className="font-extrabold text-slate-900 text-base">Price Performance Trend</h3>
                </div>

                {/* Timeframe selector */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {['1D', '1W', '1M', '3M', '1Y', '5Y'].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setChartInterval(tf as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        chartInterval === tf
                          ? 'bg-[#15519D] text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* SVG Chart Graphic */}
              <div className="relative w-full h-48 pt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="stockChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#15519D" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#15519D" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points={`0,180 ${chartSvgPoints} 500,180`}
                    fill="url(#stockChartGrad)"
                  />
                  <polyline
                    fill="none"
                    stroke="#15519D"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={chartSvgPoints}
                  />
                </svg>
              </div>
            </div>

            {/* WHY IS THIS STOCK MOVING? */}
            <div className="p-6 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/50 rounded-3xl border border-blue-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-[#15519D] text-white rounded-xl shadow-md">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h3 className="font-extrabold text-[#15519D] text-base">Why Is This Stock Moving Today?</h3>
              </div>

              <p className="text-sm text-slate-800 font-semibold leading-relaxed">
                "{companyName} is trading higher today driven by positive sector rotation in banking and heavyweights, expanding refining margins, and sustained institutional buying interest."
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-white rounded-2xl border border-slate-200/80 text-xs">
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Factor 1</span>
                  <div className="font-extrabold text-slate-900 mt-0.5">Refining Margin Expansion</div>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-slate-200/80 text-xs">
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Factor 2</span>
                  <div className="font-extrabold text-slate-900 mt-0.5">Strong FII Inflows (+₹420 Cr)</div>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-slate-200/80 text-xs">
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Factor 3</span>
                  <div className="font-extrabold text-slate-900 mt-0.5">Green Energy Commissioning</div>
                </div>
              </div>
            </div>

            {/* STOCK SNAPSHOT METRICS */}
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg mb-3">Stock Valuation & Fundamental Snapshot</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-4 bg-white rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">Market Cap</span>
                  <div className="text-base font-black text-slate-900 mt-0.5">₹19,85,400 Cr</div>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">P/E Ratio</span>
                  <div className="text-base font-black text-slate-900 mt-0.5">28.4x</div>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">EPS (TTM)</span>
                  <div className="text-base font-black text-slate-900 mt-0.5">₹103.20</div>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">52W High</span>
                  <div className="text-base font-black text-slate-900 mt-0.5">₹3,024.90</div>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">52W Low</span>
                  <div className="text-base font-black text-slate-900 mt-0.5">₹2,220.30</div>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">Dividend Yield</span>
                  <div className="text-base font-black text-slate-900 mt-0.5">0.35%</div>
                </div>
              </div>
            </div>

            {/* UNIVEST AI VIEW SCORE CARD */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-50 text-[#16A34A] font-black text-xs rounded-full">
                      POSITIVE OUTLOOK
                    </span>
                    <span className="text-xs font-bold text-slate-400">Univest AI Intelligence View</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-1">Univest Conviction Score: 78 / 100</h3>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black text-[#15519D]">78</div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Score / 100</span>
                </div>
              </div>

              {/* 6 Components Score Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Business</span>
                  <div className="font-extrabold text-emerald-600 text-xs">Strong (90/100)</div>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight">Monopoly market share & cash flow</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Growth</span>
                  <div className="font-extrabold text-emerald-600 text-xs">High (82/100)</div>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight">18% 3-Yr order pipeline CAGR</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Valuation</span>
                  <div className="font-extrabold text-amber-600 text-xs">Fair (72/100)</div>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight">Trades at 28x TTM earnings</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Momentum</span>
                  <div className="font-extrabold text-emerald-600 text-xs">Bullish (85/100)</div>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight">Above 20D & 50D Moving Avg</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Financial Health</span>
                  <div className="font-extrabold text-emerald-600 text-xs">Excellent (94/100)</div>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight">Zero net debt & AAA balance sheet</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Risk</span>
                  <div className="font-extrabold text-blue-600 text-xs">Low Risk (22/100)</div>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight">High moat & defensive model</p>
                </div>
              </div>

              {/* WHAT CHANGED (LAST 30 DAYS DEVELOPMENTS) */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">What Changed (Last 30 Days)</h4>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-full">Live Disclosures</span>
                </div>

                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <span className="font-extrabold text-slate-900 block">Q1 Earnings Beat Expectations (+14% YoY Net Profit)</span>
                      <span className="text-[10px] text-slate-400 font-medium">12 Days Ago • Financial Disclosure</span>
                    </div>
                    <span className="text-emerald-600 font-black text-[11px] shrink-0">+3.4% Impact</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <span className="font-extrabold text-slate-900 block">Green Hydrogen Electrolyzer Factory Commissioned</span>
                      <span className="text-[10px] text-slate-400 font-medium">18 Days Ago • Strategic Expansion</span>
                    </div>
                    <span className="text-emerald-600 font-black text-[11px] shrink-0">+1.8% Impact</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <span className="font-extrabold text-slate-900 block">FII Institutional Shareholding Increased by +0.45%</span>
                      <span className="text-[10px] text-slate-400 font-medium">24 Days Ago • Shareholding Disclosure</span>
                    </div>
                    <span className="text-blue-600 font-black text-[11px] shrink-0">Institutional Flow</span>
                  </div>
                </div>
              </div>
            </div>

            {/* WHY THIS / WHY NOW SIGNATURE SECTION */}
            <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl space-y-6">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Univest Signature Investment Thesis</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-extrabold uppercase text-blue-300">Why This Company?</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Unrivalled market leader across consumer telecom (Jio), retail distribution, and oil-to-chemicals. Generates massive cash flows funding transition to renewable green hydrogen.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-extrabold uppercase text-amber-300">Why Now?</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Recent telecom tariff hikes directly translate into high-margin ARPU growth while giga-factory commissioning schedule unlocks retail IPO listing catalysts over next 12 months.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                <div>
                  <h5 className="text-xs font-extrabold uppercase text-emerald-400 mb-1">Key Catalysts</h5>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside font-medium">
                    <li>Reliance Retail IPO demerger timeline announcement</li>
                    <li>Consolidated ARPU crossing ₹200 threshold</li>
                  </ul>
                </div>

                <div>
                  <h5 className="text-xs font-extrabold uppercase text-rose-400 mb-1">Key Thesis Risks</h5>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside font-medium">
                    <li>Global crude oil refining margin volatility</li>
                    <li>Slower capex monetization in new energy division</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StockDetail;
