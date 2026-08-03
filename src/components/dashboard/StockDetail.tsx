import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, TrendingUp, Clock, Activity, Briefcase, 
  BarChart3, Bookmark, Share2, Sparkles,
  Star, MessageSquare, Sliders, AlertCircle, Building2, UserCheck, 
  ChevronRight, Calendar, Compass, Info, Award, ChevronUp, ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';

interface StockDetailProps {
  isOpen: boolean;
  onClose: () => void;
  companyName?: string;
  symbol?: string;
  logo?: string;
  isTrading?: boolean;
  action?: 'BUY' | 'SELL';
  onTrade?: (tradeData: any) => void;
}

export const StockDetail: React.FC<StockDetailProps> = ({
  isOpen,
  onClose,
  companyName = 'Reliance Industries Ltd',
  symbol = 'RELIANCE',
  logo = 'RL',
  isTrading,
  action,
  onTrade
}) => {
  // Navigation & View Toggles
  const [chartInterval, setChartInterval] = useState<'1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | '5Y' | 'MAX'>('1M');
  const [chartType, setChartType] = useState<'Candlestick' | 'Line' | 'Area' | 'Heikin Ashi'>('Candlestick');
  const [activeIndicators, setActiveIndicators] = useState<string[]>(['RSI', 'Volume']);
  const [financialPeriod, setFinancialPeriod] = useState<'quarterly' | 'yearly'>('quarterly');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  // Discussion Feed state
  const [commentsList, setCommentsList] = useState([
    { id: '1', user: 'Vikram S.', time: '10 min ago', text: 'Strong support holding at ₹2,980. Hydrogen plant commissioning is going to trigger massive upside.', sentiment: 'Bullish' },
    { id: '2', user: 'Ananya R.', time: '45 min ago', text: 'Q2 earnings beat expected across retail and telecom divisions.', sentiment: 'Bullish' }
  ]);

  // Base stock price (hardcoded for MVP demo)
  const basePrice = 3024.50;

  // Sync scroll-to-top on open
  React.useEffect(() => {
    if (isOpen) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Working interactive price chart calculations based on timeframe
  const chartPointsMap = {
    '1D': [2980, 2995, 3010, 3005, 3024.5],
    '5D': [2910, 2940, 2925, 2990, 3024.5],
    '1M': [2820, 2870, 2850, 2960, 3024.5],
    '3M': [2700, 2780, 2750, 2900, 3024.5],
    '6M': [2550, 2650, 2600, 2850, 3024.5],
    '1Y': [2400, 2550, 2500, 2800, 3024.5],
    '5Y': [1500, 1850, 2100, 2600, 3024.5],
    'MAX': [800, 1200, 1900, 2500, 3024.5],
  };
  const points = chartPointsMap[chartInterval];
  const minPt = Math.min(...points) * 0.98;
  const maxPt = Math.max(...points) * 1.02;

  // Financial Period Data
  const financialData = {
    quarterly: [
      { term: 'Q1 FY26', revenue: 258400, profit: 19640, ebitda: 42150, cashFlow: 38900 },
      { term: 'Q2 FY26', revenue: 264200, profit: 20150, ebitda: 44200, cashFlow: 39500 },
      { term: 'Q3 FY26', revenue: 271500, profit: 21300, ebitda: 45800, cashFlow: 41200 },
      { term: 'Q4 FY26', revenue: 279800, profit: 22400, ebitda: 47900, cashFlow: 42800 },
    ],
    yearly: [
      { term: 'FY23', revenue: 879400, profit: 66700, ebitda: 142800, cashFlow: 125400 },
      { term: 'FY24', revenue: 954800, profit: 73500, ebitda: 154200, cashFlow: 138900 },
      { term: 'FY25', revenue: 1024600, profit: 79200, ebitda: 168400, cashFlow: 149600 },
      { term: 'FY26 (Est)', revenue: 1073900, profit: 83500, ebitda: 179050, cashFlow: 162400 },
    ]
  };

  const currentFinList = financialData[financialPeriod];

  const toggleIndicator = (ind: string) => {
    setActiveIndicators(prev => 
      prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind]
    );
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setCommentsList([
      { id: Date.now().toString(), user: 'You (Omar Khan)', time: 'Just now', text: commentText, sentiment: 'Bullish' },
      ...commentsList
    ]);
    setCommentText('');
    toast.success('Comment posted to Community Stream');
  };



  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] bg-[#F8FAFC] overflow-y-auto flex flex-col justify-between"
    >
        {/* TOP BRANDED FULL-PAGE HEADER BAR */}
        <header className="sticky top-0 bg-white border-b border-[#E2E8F0] px-6 py-4 flex flex-wrap items-center justify-between z-30 shadow-xs gap-4">
          
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                {logo || symbol.substring(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-black text-lg text-[#0F172A] leading-tight">{companyName}</h1>
                  <span className="text-[10px] font-black bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 uppercase">
                    NSE : {symbol}
                  </span>
                  <span className="text-[9px] font-black bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> LIVE
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> 4.9 Stars
                  </span>
                  <span>·</span>
                  <span className="text-emerald-600 bg-emerald-50 px-2 py-0.2 rounded font-black">
                    88% BUY CONSENSUS
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right mr-2">
              <span className="text-xl font-black text-[#0F172A]">₹3,024.50</span>
              <span className="block text-xs font-extrabold text-emerald-600">▲ +₹37.10 (+1.24%)</span>
            </div>

            <button
              onClick={() => {
                setIsBookmarked(!isBookmarked);
                toast.success(isBookmarked ? 'Removed from Watchlist' : 'Saved to Watchlist');
              }}
              className={`w-10 h-10 rounded-xl border border-[#E2E8F0] flex items-center justify-center transition ${
                isBookmarked ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              <Bookmark className="w-4.5 h-4.5" fill={isBookmarked ? '#2563EB' : 'none'} />
            </button>

            <button
              onClick={() => toast.success('Workspace link copied')}
              className="w-10 h-10 rounded-xl border border-[#E2E8F0] flex items-center justify-center text-slate-400 hover:bg-slate-50 transition"
            >
              <Share2 className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={() => {
                if (onTrade) onTrade({ symbol, action: 'BUY', company: companyName });
                
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-black text-xs hover:bg-blue-700 transition shadow-sm cursor-pointer"
            >
              Trade Asset
            </button>
          </div>
        </header>

        {/* MAIN SCROLLABLE CONTENT DESK */}
        <main className="w-full px-6 sm:px-8 py-6 sm:py-8 flex flex-col gap-8 flex-1">
          
          {/* 1. HERO TRADINGVIEW INTERACTIVE CHART WORKSPACE */}
          <section className="bg-white rounded-[28px] border border-[#E2E8F0] p-6 shadow-sm flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h3 className="font-black text-lg text-[#0F172A]">Interactive Chart Feed</h3>
              </div>

              {/* Timeframes */}
              <div className="flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0] text-xs">
                {(['1D', '5D', '1M', '3M', '6M', '1Y', '5Y', 'MAX'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setChartInterval(tf)}
                    className={`px-3 py-1.5 rounded-lg font-black transition ${
                      chartInterval === tf
                        ? 'bg-[#0F172A] text-white shadow-sm'
                        : 'text-slate-500 hover:text-[#0F172A]'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              {/* Chart Types */}
              <div className="flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0] text-xs">
                {(['Candlestick', 'Line', 'Area', 'Heikin Ashi'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition ${
                      chartType === type ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Indicators */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Indicators:</span>
                {['RSI', 'MACD', 'EMA', 'SMA', 'Bollinger', 'Volume'].map((ind) => {
                  const isActive = activeIndicators.includes(ind);
                  return (
                    <button
                      key={ind}
                      onClick={() => toggleIndicator(ind)}
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-black border transition ${
                        isActive ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      {ind}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TradingView Simulated Canvas */}
            <div className="relative h-80 w-full bg-[#0F172A] rounded-2xl p-5 overflow-hidden flex flex-col justify-between shadow-inner">
              <div className="absolute inset-0 flex flex-col justify-between p-5 pointer-events-none opacity-20">
                <div className="border-b border-dashed border-slate-400 w-full" />
                <div className="border-b border-dashed border-slate-400 w-full" />
                <div className="border-b border-dashed border-slate-400 w-full" />
              </div>

              <div className="absolute top-4 left-5 right-5 flex justify-between items-center text-xs font-black text-slate-300 z-10">
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" /> TradingView Engine Feed
                </span>
                <div className="flex gap-4 text-[10px] font-extrabold">
                  <span>O: ₹2,985.00</span>
                  <span>H: ₹3,040.00</span>
                  <span>L: ₹2,975.00</span>
                  <span className="text-emerald-400">C: ₹3,024.50</span>
                </div>
              </div>

              <svg className="w-full h-full relative z-0 mt-4" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="fullStockChartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                
                {chartType === 'Area' && (
                  <path
                    d={`M 0,200 ${points.map((pt, i) => {
                      const x = (i / (points.length - 1)) * 500;
                      const y = 170 - ((pt - minPt) / (maxPt - minPt)) * 130;
                      return `L ${x},${y}`;
                    }).join(' ')} L 500,200 Z`}
                    fill="url(#fullStockChartGrad)"
                  />
                )}

                <path
                  d={points.map((pt, i) => {
                    const x = (i / (points.length - 1)) * 500;
                    const y = 170 - ((pt - minPt) / (maxPt - minPt)) * 130;
                    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>

              <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold z-10 pt-2 border-t border-white/10">
                <span>RSI (14): <strong className="text-emerald-400">64.5 (Bullish)</strong></span>
                <span>MACD: <strong className="text-blue-400">Positive Crossover</strong></span>
                <span>Volume: <strong className="text-white">4.2M Shares</strong></span>
              </div>
            </div>
          </section>

          {/* 2. COMPANY OVERVIEW GRID */}
          <section className="bg-white rounded-[28px] border border-[#E2E8F0] p-6 shadow-sm">
            <h3 className="text-lg font-black text-[#0F172A] mb-4">Company Overview</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Market Cap', val: '₹19,84,200 Cr' },
                { label: 'P/E Ratio', val: '26.4x' },
                { label: 'P/B Ratio', val: '2.8x' },
                { label: 'EPS (TTM)', val: '₹114.50' },
                { label: 'ROE %', val: '18.5%' },
                { label: 'Dividend Yield', val: '0.45%' },
                { label: 'Sector', val: 'Energy & Petrochem' },
                { label: 'Industry', val: 'Conglomerates' },
                { label: 'Managing Director / CEO', val: 'Mukesh D. Ambani' },
                { label: 'Total Employees', val: '3,89,000+' },
                { label: 'Founded', val: '1973 (53 Yrs)' },
                { label: 'Official Website', val: 'ril.com' }
              ].map((item) => (
                <div key={item.label} className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{item.label}</span>
                  <span className="font-black text-xs text-[#0F172A] truncate block">{item.val}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 3. AI SUMMARY CARD */}
          <section className="bg-[#0F172A] text-white rounded-[28px] p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-black text-blue-400 uppercase tracking-wider">UNIVEST AI INVESTMENT THESIS</span>
                </div>
                <h3 className="text-xl font-black mb-3">Strong Fundamental Base & Hydrogen Growth Re-Rating</h3>
                <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-xl">
                  Reliance remains fundamentally strong with improving refining margins and stable retail cash flows. Institutional accumulation signals multi-quarter breakout potential.
                </p>
              </div>

              <div className="bg-white/10 border border-white/20 p-5 rounded-2xl text-center shrink-0 min-w-[160px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">AI Confidence Score</span>
                <span className="text-3xl font-black text-blue-400">94%</span>
                <span className="text-[10px] text-emerald-400 font-extrabold block mt-1">HIGH CONVICTION</span>
              </div>
            </div>
          </section>

          {/* 4. FINANCIAL PERFORMANCE WITH WORKING HISTORICAL BAR CHARTS */}
          <section className="bg-white rounded-[28px] border border-[#E2E8F0] p-6 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-[#0F172A]">Financial Performance</h3>
                <p className="text-xs text-slate-500 font-medium">Visual quarterly & yearly metrics breakdown.</p>
              </div>
              <div className="flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0] text-xs">
                <button
                  onClick={() => setFinancialPeriod('quarterly')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    financialPeriod === 'quarterly' ? 'bg-[#0F172A] text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Quarterly
                </button>
                <button
                  onClick={() => setFinancialPeriod('yearly')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    financialPeriod === 'yearly' ? 'bg-[#0F172A] text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>

            {/* Financial Columns Graph */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {currentFinList.map((data, index) => (
                <div key={index} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase">{data.term}</span>
                    <span className="text-[10px] font-extrabold text-emerald-600">▲ +12% Growth</span>
                  </div>

                  {/* Vertical bar visual graphs */}
                  <div className="flex items-end gap-2 h-20 pt-4">
                    <div className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-600 rounded-t-sm transition-all duration-300"
                        style={{ height: `${Math.min(100, (data.revenue / (financialPeriod === 'quarterly' ? 280000 : 1100000)) * 60)}px` }}
                      />
                      <span className="text-[8px] font-bold text-slate-400 mt-1">Rev</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-emerald-600 rounded-t-sm transition-all duration-300"
                        style={{ height: `${Math.min(100, (data.profit / (financialPeriod === 'quarterly' ? 28000 : 110000)) * 60)}px` }}
                      />
                      <span className="text-[8px] font-bold text-slate-400 mt-1">Net</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-indigo-600 rounded-t-sm transition-all duration-300"
                        style={{ height: `${Math.min(100, (data.ebitda / (financialPeriod === 'quarterly' ? 50000 : 200000)) * 60)}px` }}
                      />
                      <span className="text-[8px] font-bold text-slate-400 mt-1">EBIT</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3 text-xs flex justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block">Revenue</span>
                      <strong className="text-[#0F172A]">₹{(data.revenue/1000).toFixed(1)}k Cr</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 font-bold block">Net Profit</span>
                      <strong className="text-emerald-600">₹{(data.profit/1000).toFixed(1)}k Cr</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. FUNDAMENTAL & TECHNICAL BREAKDOWN WITH WORKING GAUGES */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Fundamental Ratios */}
            <div className="bg-white rounded-[28px] border border-[#E2E8F0] p-6 shadow-sm flex flex-col gap-4">
              <h4 className="font-black text-base text-[#0F172A]">Fundamental Metrics</h4>
              <div className="flex flex-col gap-3.5 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="font-bold text-slate-500">Return on Equity (ROE)</span>
                  <span className="font-black text-emerald-600">18.5%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="font-bold text-slate-500">Return on Capital (ROCE)</span>
                  <span className="font-black text-[#0F172A]">16.2%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="font-bold text-slate-500">Debt to Equity</span>
                  <span className="font-black text-[#0F172A]">0.38 (Low Risk)</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-bold text-slate-500">Promoter Pledge %</span>
                  <span className="font-black text-emerald-600">0.00% (Zero Pledge)</span>
                </div>
              </div>
            </div>

            {/* Technical Indicators with interactive visual gauge */}
            <div className="bg-white rounded-[28px] border border-[#E2E8F0] p-6 shadow-sm flex flex-col gap-4">
              <h4 className="font-black text-base text-[#0F172A]">Technical Indicators</h4>
              
              {/* RSI gauge slider */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-xl flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-500">RSI Gauge (14)</span>
                  <span className="text-emerald-600 font-black">64.5 - Bullish</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full relative mt-1">
                  <div className="absolute top-0 bottom-0 left-[64.5%] w-3 h-3 rounded-full bg-emerald-500 -translate-y-0.5 shadow-sm" />
                </div>
                <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase">
                  <span>Oversold</span>
                  <span>Neutral</span>
                  <span>Overbought</span>
                </div>
              </div>

              <div className="flex flex-col gap-3.5 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="font-bold text-slate-500">Support / Resistance</span>
                  <span className="font-black text-[#0F172A]">S: ₹2,960 · R: ₹3,375</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="font-bold text-slate-500">Moving Average crossover</span>
                  <span className="font-black text-emerald-600">Above 50 & 200 DMA</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-bold text-slate-500">ADX Momentum</span>
                  <span className="font-black text-blue-600">32.4 (Strong Trend)</span>
                </div>
              </div>
            </div>

          </section>

          {/* 6. PEER COMPARISON TABLE */}
          <section className="bg-white rounded-[28px] border border-[#E2E8F0] p-6 shadow-sm">
            <h3 className="text-lg font-black text-[#0F172A] mb-4">Peer Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-3 px-2">Company</th>
                    <th className="py-3 px-2">Price</th>
                    <th className="py-3 px-2">Market Cap</th>
                    <th className="py-3 px-2">P/E</th>
                    <th className="py-3 px-2">ROE</th>
                    <th className="py-3 px-2">1Y Return</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="font-black bg-blue-50/50 text-[#0F172A]">
                    <td className="py-3 px-2 flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-[#0F172A] text-white flex items-center justify-center text-[10px]">RL</span>
                      Reliance Industries
                    </td>
                    <td className="py-3 px-2">₹3,024.50</td>
                    <td className="py-3 px-2">₹19.8L Cr</td>
                    <td className="py-3 px-2">26.4x</td>
                    <td className="py-3 px-2 text-emerald-600">18.5%</td>
                    <td className="py-3 px-2 text-emerald-600">+24.2%</td>
                  </tr>
                  <tr className="font-bold text-slate-600 hover:bg-slate-50">
                    <td className="py-3 px-2 flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">TC</span>
                      TCS
                    </td>
                    <td className="py-3 px-2">₹4,185.10</td>
                    <td className="py-3 px-2">₹15.2L Cr</td>
                    <td className="py-3 px-2">31.2x</td>
                    <td className="py-3 px-2">42.1%</td>
                    <td className="py-3 px-2 text-emerald-600">+16.8%</td>
                  </tr>
                  <tr className="font-bold text-slate-600 hover:bg-slate-50">
                    <td className="py-3 px-2 flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">HD</span>
                      HDFC Bank
                    </td>
                    <td className="py-3 px-2">₹1,682.40</td>
                    <td className="py-3 px-2">₹12.8L Cr</td>
                    <td className="py-3 px-2">19.4x</td>
                    <td className="py-3 px-2">17.2%</td>
                    <td className="py-3 px-2 text-emerald-600">+12.5%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 7. SHAREHOLDING PATTERN WITH WORKING SEGMENTED PROGRESS BAR */}
          <section className="bg-white rounded-[28px] border border-[#E2E8F0] p-6 shadow-sm flex flex-col gap-6">
            <h3 className="text-lg font-black text-[#0F172A]">Shareholding Distribution</h3>
            
            {/* Visual segmented bar */}
            <div className="flex h-4 rounded-full overflow-hidden w-full bg-slate-200">
              <div className="bg-blue-600" style={{ width: '50.3%' }} title="Promoter: 50.3%" />
              <div className="bg-indigo-500" style={{ width: '22.15%' }} title="FII: 22.15%" />
              <div className="bg-purple-500" style={{ width: '16.45%' }} title="DII: 16.45%" />
              <div className="bg-slate-400" style={{ width: '11.1%' }} title="Public: 11.1%" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Promoters</span>
                </div>
                <span className="text-xl font-black text-[#0F172A]">50.30%</span>
                <span className="text-[10px] text-emerald-600 block font-bold mt-1">Zero Pledge</span>
              </div>
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Foreign FIIs</span>
                </div>
                <span className="text-xl font-black text-blue-600">22.15%</span>
                <span className="text-[10px] text-emerald-600 block font-bold mt-1">▲ +0.4% QoQ</span>
              </div>
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Domestic DIIs</span>
                </div>
                <span className="text-xl font-black text-blue-600">16.45%</span>
                <span className="text-[10px] text-emerald-600 block font-bold mt-1">▲ +0.8% QoQ</span>
              </div>
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Public & Others</span>
                </div>
                <span className="text-xl font-black text-slate-600">11.10%</span>
              </div>
            </div>
          </section>

          {/* 8. COMMUNITY COMMENTS & DISCUSSION STREAM */}
          <section className="bg-white rounded-[28px] border border-[#E2E8F0] p-6 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-black text-[#0F172A]">Investor Community Stream</h3>
              </div>
              <span className="text-xs font-bold text-slate-400">{commentsList.length} Discussions</span>
            </div>

            {/* Add Comment Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Share your technical or fundamental perspective on Reliance..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#0F172A] outline-none focus:border-blue-600"
              />
              <button
                onClick={handleAddComment}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-black text-xs hover:bg-blue-700 transition"
              >
                Post
              </button>
            </div>

            {/* Comments Feed */}
            <div className="flex flex-col gap-3">
              {commentsList.map((c) => (
                <div key={c.id} className="p-4 bg-[#F8FAFC] rounded-2xl border border-slate-100 flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-[#0F172A]">{c.user}</span>
                      <span className="px-2 py-0.2 rounded bg-emerald-100 text-emerald-700 text-[9px] font-black">{c.sentiment}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">{c.time}</span>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
          </section>
                   </main>

        {/* STICKY BOTTOM ACTION CTA BAR */}
        <footer className="sticky bottom-0 bg-white border-t border-[#E2E8F0] py-3.5 px-6 z-20 flex items-center justify-between gap-4 shadow-lg">
          <div className="hidden sm:flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Target Upside</span>
            <span className="text-sm font-black text-emerald-600">₹3,375 (+11%)</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto flex-1 sm:flex-none justify-end">
            <button
              onClick={() => {
                if (onTrade) {
                  onTrade({ symbol, company: companyName, logo, rec: 'SELL', price: basePrice });
                } else {
                  toast('Trading is not available in this context. Please navigate to the main dashboard.', { icon: '⚠️' });
                }
              }}
              className="flex-1 sm:px-8 py-2.5 rounded-xl bg-[#EF4444] hover:bg-rose-700 text-white font-black text-xs transition shadow-sm cursor-pointer"
            >
              SELL
            </button>

            <button
              onClick={() => {
                if (onTrade) {
                  onTrade({ symbol, company: companyName, logo, rec: 'BUY', price: basePrice });
                } else {
                  toast('Trading is not available in this context. Please navigate to the main dashboard.', { icon: '⚠️' });
                }
              }}
              className="flex-1 sm:px-10 py-2.5 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white font-black text-xs transition shadow-sm cursor-pointer"
            >
              BUY
            </button>
          </div>
        </footer>

      </motion.div>
  );
};
