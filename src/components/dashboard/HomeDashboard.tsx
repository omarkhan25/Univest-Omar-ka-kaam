import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Sparkles, Wallet, ArrowUpRight, ArrowDownRight, 
  Search, ChevronRight, Plus, ArrowRight, ShieldCheck, Activity, BarChart3, 
  Clock, CheckCircle2, DollarSign, Layers, Filter, RefreshCw, Zap, Award, 
  Bookmark, ChevronDown, Radio, AlertCircle, Check, X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface HomeDashboardProps {
  onSelectStock?: (stock: any) => void;
  onSelectResearch?: (research: any) => void;
  onTrade?: (tradeData: any) => void;
  onNavigateTab?: (tab: string) => void;
  onDepositFunds?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onSelectStock,
  onSelectResearch,
  onTrade,
  onNavigateTab,
  onDepositFunds
}) => {
  // Calculate if Indian stock market (NSE/BSE) is currently open based on IST time (Mon-Fri 09:15 AM - 03:30 PM IST)
  const isMarketOpen = useMemo(() => {
    const now = new Date();
    // Convert to IST (UTC+5:30)
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utc + (3600000 * 5.5));
    
    const day = istTime.getDay(); // 0 = Sun, 6 = Sat
    if (day === 0 || day === 6) return false;

    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();
    const timeInMinutes = hours * 60 + minutes;

    // 09:15 AM = 555 mins, 03:30 PM = 930 mins
    return timeInMinutes >= 555 && timeInMinutes <= 930;
  }, []);

  // Watchlist States
  const [watchlists, setWatchlists] = useState(['Default Watchlist', 'Long Term Picks', 'Breakout Trades', 'High Dividend Yield']);
  const [selectedWatchlist, setSelectedWatchlist] = useState('Default Watchlist');
  const [watchlistSearch, setWatchlistSearch] = useState('');
  const [showWatchlistDropdown, setShowWatchlistDropdown] = useState(false);
  const [showCreateWatchlistModal, setShowCreateWatchlistModal] = useState(false);
  const [newWatchlistTitle, setNewWatchlistTitle] = useState('');

  // Mock Watchlist Stocks
  const watchlistStocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', ltp: '₹2,940.35', change: '+2.45%', isPositive: true, sparkline: [10, 14, 12, 18, 22, 28] },
    { symbol: 'TCS', name: 'Tata Consultancy Services', ltp: '₹4,120.45', change: '-0.85%', isPositive: false, sparkline: [24, 20, 22, 18, 16, 14] },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', ltp: '₹1,610.15', change: '+1.82%', isPositive: true, sparkline: [12, 15, 14, 20, 24, 29] },
    { symbol: 'INFY', name: 'Infosys Ltd', ltp: '₹1,560.50', change: '-0.92%', isPositive: false, sparkline: [22, 19, 18, 17, 16, 15] },
    { symbol: 'TATAPOWER', name: 'Tata Power Co', ltp: '₹435.80', change: '+3.15%', isPositive: true, sparkline: [15, 18, 22, 25, 28, 34] }
  ];

  const filteredWatchlist = watchlistStocks.filter(st => 
    st.symbol.toLowerCase().includes(watchlistSearch.toLowerCase()) ||
    st.name.toLowerCase().includes(watchlistSearch.toLowerCase())
  );

  // Today's AI Opportunities (Strictly 3 Quality Recommendations)
  const aiOpportunities = [
    {
      symbol: 'RELIANCE',
      company: 'Reliance Industries Ltd',
      signal: 'BUY',
      confidence: 94,
      targetPrice: '₹3,250',
      upside: '+12.4%',
      risk: 'Low',
      reason: 'Green Hydrogen gigafactory commissioning approaching & retail margin expansion.'
    },
    {
      symbol: 'HDFCBANK',
      company: 'HDFC Bank Ltd',
      signal: 'BUY',
      confidence: 91,
      targetPrice: '₹1,850',
      upside: '+14.8%',
      risk: 'Low',
      reason: 'RBI repo rate pause protects net interest margins and expands institutional accumulation.'
    },
    {
      symbol: 'TATAPOWER',
      company: 'Tata Power Company',
      signal: 'BUY',
      confidence: 88,
      targetPrice: '₹480',
      upside: '+16.2%',
      risk: 'Moderate',
      reason: 'Approved 1:1 bonus share issue and green energy generation capacity addition.'
    }
  ];

  // Market Overview Benchmarks
  const marketOverview = [
    { name: 'NIFTY 50', value: '24,586.20', change: '+142.50 (+0.58%)', isPositive: true, sparkline: [10, 15, 12, 18, 24, 30] },
    { name: 'SENSEX', value: '80,716.40', change: '+485.10 (+0.61%)', isPositive: true, sparkline: [12, 18, 16, 22, 28, 34] },
    { name: 'BANK NIFTY', value: '52,380.90', change: '+610.40 (+1.18%)', isPositive: true, sparkline: [8, 12, 18, 25, 30, 40] },
    { name: 'NASDAQ', value: '17,842.10', change: '-94.30 (-0.53%)', isPositive: false, sparkline: [30, 25, 22, 18, 15, 12] },
    { name: 'Gold (10g)', value: '₹72,450', change: '+180 (+0.25%)', isPositive: true, sparkline: [15, 18, 20, 22, 24, 25] },
    { name: 'USD/INR', value: '₹83.68', change: '-0.02 (-0.02%)', isPositive: false, sparkline: [18, 17, 18, 17, 16, 16] }
  ];

  // Curated Market Intelligence News (Strictly 3 Articles)
  const curatedNews = [
    {
      id: 'news-1',
      headline: 'RBI Policy: Repo Rate Kept Unchanged at 6.5% as Inflation Target Remains Priority',
      source: 'Bloomberg India',
      time: '12 min ago',
      summary: 'The RBI maintained key policy rates unchanged while reiterating commitment to bring retail inflation closer to the 4% target.',
      impact: 'High Positive Impact on Banking'
    },
    {
      id: 'news-2',
      headline: 'Reliance Green Hydrogen Gigafactory Phase-1 Commissioning Approaching Target Date',
      source: 'Reuters Financial',
      time: '45 min ago',
      summary: 'Reliance Industries prepares for commercial electrolyzer production at Jamnagar green energy complex.',
      impact: 'Positive Valuation Re-rating'
    },
    {
      id: 'news-3',
      headline: 'US Fed Signals Rate Cut Outlook as US CPI Inflation Softens to 2.9%',
      source: 'Wall Street Journal',
      time: '2 hrs ago',
      summary: 'Lower US yields bode well for Indian IT exporters as enterprise software spending resumes momentum in Q3.',
      impact: 'Moderate Impact on Tech'
    }
  ];

  // Recent Activity Feed
  const recentActivities = [
    { type: 'BUY', symbol: 'RELIANCE', detail: '15 Qty @ ₹2,920.00', status: 'Executed', time: 'Yesterday' },
    { type: 'DIVIDEND', symbol: 'HDFCBANK', detail: '₹2,925.00 Credited to Primary Bank', status: 'Completed', time: '2 Days Ago' },
    { type: 'SIP', symbol: 'ICICI Prudential Bluechip', detail: '₹10,000 Auto-Debited', status: 'Executed', time: '4 Days Ago' },
    { type: 'DEPOSIT', symbol: 'UPI Wallet', detail: '₹50,000 Added to Available Cash', status: 'Success', time: '1 Week Ago' }
  ];

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500 pb-16">
      


      {/* ROW 1: PORTFOLIO HERO (70%) + WATCHLIST (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        
        {/* PORTFOLIO HERO (7 COLUMNS / 70%) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-[28px] p-6 sm:p-8 shadow-xs flex flex-col justify-between gap-6 relative overflow-hidden">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Net Portfolio Valuation</span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-none">₹14,85,240.00</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +₹18,420.50 (+1.25%) Today
                </span>
                <span className="text-xs font-bold text-slate-400">Real-Time Sync</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  if (onDepositFunds) onDepositFunds();
                  else if (onNavigateTab) onNavigateTab('Portfolio');
                }}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Invest / Add Funds
              </button>
              <button 
                onClick={() => {
                  if (onNavigateTab) onNavigateTab('Portfolio');
                }}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition cursor-pointer"
              >
                View Portfolio
              </button>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Total Gain</span>
              <span className="text-sm font-black text-emerald-600 block mt-0.5">+₹3,42,180 (+29.9%)</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Invested Amount</span>
              <span className="text-sm font-black text-slate-800 block mt-0.5">₹11,43,060</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Available Cash</span>
              <span className="text-sm font-black text-blue-600 block mt-0.5">₹1,24,800</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">XIRR Return</span>
              <span className="text-sm font-black text-emerald-600 block mt-0.5">24.8% p.a.</span>
            </div>
          </div>

          {/* Mini Growth Curve */}
          <div className="flex flex-col gap-1.5 pt-2">
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
              <span>PORTFOLIO GROWTH TRAJECTORY (FY 2025-26)</span>
              <span className="text-emerald-600 font-black">All-Time High</span>
            </div>
            <svg className="w-full h-14" viewBox="0 0 300 40">
              <path
                d="M 0 32 Q 50 28, 100 20 T 200 12 T 300 4"
                fill="none"
                stroke="#2563EB"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
              <path
                d="M 0 32 Q 50 28, 100 20 T 200 12 T 300 4 L 300 40 L 0 40 Z"
                fill="rgba(37, 99, 235, 0.08)"
              />
            </svg>
          </div>
        </div>

        {/* WATCHLIST WIDGET (3 COLUMNS / 30%) */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-[28px] p-5 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2.5 border-b border-slate-100 pb-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-base text-slate-900 leading-tight">Watchlist</h3>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Real-time prices & trade access</span>
              </div>
              <button 
                onClick={() => setShowCreateWatchlistModal(true)}
                className="text-[11px] font-black text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-xl transition cursor-pointer"
              >
                + Create
              </button>
            </div>

            {/* Watchlist Switcher Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowWatchlistDropdown(!showWatchlistDropdown)}
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-slate-800 hover:border-slate-300 transition cursor-pointer"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Active:</span> {selectedWatchlist}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
              </button>

              <AnimatePresence>
                {showWatchlistDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-30 flex flex-col gap-1 max-h-52 overflow-y-auto"
                  >
                    {watchlists.map(w => (
                      <button
                        key={w}
                        onClick={() => {
                          setSelectedWatchlist(w);
                          setShowWatchlistDropdown(false);
                          toast.success(`Switched to "${w}"`);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-between ${
                          selectedWatchlist === w ? 'bg-blue-50 text-blue-700 font-black' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{w}</span>
                        {selectedWatchlist === w && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setShowWatchlistDropdown(false);
                        setShowCreateWatchlistModal(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-black text-blue-600 hover:bg-blue-50 transition cursor-pointer border-t border-slate-100 mt-1 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Create New Watchlist
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Watchlist Search Bar */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search watchlist..."
              value={watchlistSearch}
              onChange={(e) => setWatchlistSearch(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-800 outline-none font-medium placeholder:text-slate-400"
            />
          </div>

          {/* Compact Stock List */}
          <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto max-h-64 scrollbar-none">
            {filteredWatchlist.map((st) => (
              <div 
                key={st.symbol}
                className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/50 transition cursor-pointer flex items-center justify-between gap-2 group"
                onClick={() => {
                  if (onSelectStock) onSelectStock({ symbol: st.symbol, company: st.name });
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                    {st.symbol.substring(0, 2)}
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-slate-900 block leading-tight">{st.symbol}</span>
                    <span className="text-[9px] text-slate-400 font-medium block truncate max-w-[90px]">{st.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-extrabold text-xs text-slate-900 block leading-tight">{st.ltp}</span>
                    <span className={`text-[9px] font-bold block ${st.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {st.change}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onTrade) onTrade({ symbol: st.symbol, company: st.name, rec: st.isPositive ? 'BUY' : 'SELL' });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] transition cursor-pointer shadow-xs"
                  >
                    Trade
                  </button>
                </div>
              </div>
            ))}
          </div>


        </div>

      </div>

      {/* ROW 2: QUICK ACTIONS */}
      <section className="flex flex-col gap-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Actions</span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          {[
            { label: 'Buy Stock', action: () => onTrade && onTrade({ rec: 'BUY' }), icon: ArrowUpRight, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
            { label: 'Sell Stock', action: () => onTrade && onTrade({ rec: 'SELL' }), icon: ArrowDownRight, color: 'text-rose-600 bg-rose-50 border-rose-100' },
            { label: 'Invest Wealth', action: () => onNavigateTab && onNavigateTab('Invest'), icon: TrendingUp, color: 'text-blue-600 bg-blue-50 border-blue-100' },
            { label: 'Transfer Funds', action: () => onDepositFunds && onDepositFunds(), icon: Wallet, color: 'text-violet-600 bg-violet-50 border-violet-100' },
            { label: 'AI Advisor', action: () => onNavigateTab && onNavigateTab('AI Advisor'), icon: Sparkles, color: 'text-amber-600 bg-amber-50 border-amber-100' }
          ].map((act, idx) => {
            const Icon = act.icon;
            return (
              <div
                key={idx}
                onClick={act.action}
                className="bg-white border border-slate-200 hover:border-slate-400 rounded-2xl p-4 cursor-pointer shadow-xs hover:shadow-md transition flex items-center gap-3 group"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${act.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-xs text-slate-900 group-hover:text-blue-600 transition">{act.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ROW 3: TODAY'S AI OPPORTUNITIES (3 PICKS MAX) + MARKET OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* TODAY'S AI OPPORTUNITIES (MAX 3 PICKS) */}
        <section className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-xs flex flex-col justify-between gap-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-blue-600 fill-blue-500/20 animate-pulse" />
              <div>
                <h3 className="text-base font-black text-slate-900 leading-tight">Today's High-Conviction AI Picks</h3>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Top 3 Institutional Opportunities</span>
              </div>
            </div>
            <span className="text-[9px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
              90%+ Confidence
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {aiOpportunities.map((opp) => (
              <div 
                key={opp.symbol}
                className="p-4 bg-slate-50 border border-slate-100 hover:border-blue-200 rounded-2xl transition flex flex-col gap-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-900">{opp.symbol}</span>
                    <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase">
                      {opp.signal}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400">Confidence: {opp.confidence}%</span>
                  </div>

                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                    Target {opp.targetPrice} ({opp.upside})
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  {opp.reason}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Risk Profile: {opp.risk}</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        if (onSelectResearch) onSelectResearch({ symbol: opp.symbol, company: opp.company });
                      }}
                      className="text-[10px] font-black text-slate-600 hover:text-slate-900 transition cursor-pointer"
                    >
                      Read Research
                    </button>
                    <button 
                      onClick={() => {
                        if (onTrade) onTrade({ symbol: opp.symbol, company: opp.company, rec: 'BUY' });
                      }}
                      className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] transition cursor-pointer shadow-xs"
                    >
                      Trade {opp.symbol}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MARKET OVERVIEW BENCHMARKS */}
        <section className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-xs flex flex-col justify-between gap-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-blue-600" />
              <div>
                <h3 className="text-base font-black text-slate-900 leading-tight">Live Market Overview</h3>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Benchmark Indices & Global Indicators</span>
              </div>
            </div>
            <span className="text-[9px] text-emerald-600 font-black bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full animate-pulse">
              LIVE
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {marketOverview.map((idx) => (
              <div key={idx.name} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase">{idx.name}</span>
                <span className="text-xs font-black text-slate-900">{idx.value}</span>
                <span className={`text-[9px] font-bold ${idx.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {idx.change}
                </span>
                
                {/* Mini SVG Sparkline */}
                <svg className="w-full h-5 opacity-70 mt-1" viewBox="0 0 100 20">
                  <path
                    d={`M ${idx.sparkline.map((val, i) => `${(i / (idx.sparkline.length - 1)) * 100} ${20 - val}`).join(' L ')}`}
                    fill="none"
                    stroke={idx.isPositive ? '#10B981' : '#EF4444'}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ROW 4: AI INTELLIGENCE (SINGLE SIGNATURE CARD) */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white border border-slate-800 rounded-[28px] p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-400 fill-blue-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white leading-tight">Today's Executive AI Brief</h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Automated Intelligence Digest</span>
            </div>
          </div>

          <button 
            onClick={() => {
              if (onNavigateTab) onNavigateTab('News');
            }}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            Read Full AI Brief <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
            <span className="text-[9px] text-blue-400 font-black uppercase tracking-wider block mb-1">Market Mood</span>
            <strong className="text-sm font-black text-emerald-400 block">BULLISH (92% Conviction)</strong>
            <span className="text-[10px] text-slate-400 mt-1 block">Institutional inflows support banking.</span>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
            <span className="text-[9px] text-blue-400 font-black uppercase tracking-wider block mb-1">Top Opportunity</span>
            <strong className="text-sm font-black text-white block">Banking & Green Energy</strong>
            <span className="text-[10px] text-slate-400 mt-1 block">Rate pause protects commercial margins.</span>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
            <span className="text-[9px] text-blue-400 font-black uppercase tracking-wider block mb-1">Biggest Risk</span>
            <strong className="text-sm font-black text-rose-400 block">Sub-Monsoon Deficits</strong>
            <span className="text-[10px] text-slate-400 mt-1 block">Short term supply constraints in food staples.</span>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
            <span className="text-[9px] text-blue-400 font-black uppercase tracking-wider block mb-1">Recommended Action</span>
            <strong className="text-sm font-black text-amber-300 block">Increase Large-Cap Exposure</strong>
            <span className="text-[10px] text-slate-400 mt-1 block">Accumulate quality tier-1 equities.</span>
          </div>
        </div>
      </section>

      {/* ROW 5: MARKET INTELLIGENCE (3 CURATED STORIES) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 leading-tight">Latest Market Intelligence</h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Top 3 Curated Headlines & Impact Breakdown</span>
          </div>
          <button 
            onClick={() => {
              if (onNavigateTab) onNavigateTab('News');
            }}
            className="text-xs font-black text-blue-600 hover:underline cursor-pointer"
          >
            View News Center →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {curatedNews.map((news) => (
            <div 
              key={news.id}
              onClick={() => {
                if (onNavigateTab) onNavigateTab('News');
              }}
              className="bg-white border border-slate-200 hover:border-blue-300 rounded-[24px] p-6 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between gap-4 group"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                  <span>{news.source}</span>
                  <span>{news.time}</span>
                </div>
                <h4 className="font-black text-sm text-slate-900 leading-snug group-hover:text-blue-600 transition">
                  {news.headline}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2">
                  {news.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[9px] font-black text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded uppercase">
                  {news.impact}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ROW 6: RECENT ACTIVITY TIMELINE */}
      <section className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-xs flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div>
            <h3 className="text-base font-black text-slate-900 leading-tight">Recent Activity & Orders</h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Chronological Log of Orders & Corporate Events</span>
          </div>
          <button 
            onClick={() => {
              if (onNavigateTab) onNavigateTab('Portfolio');
            }}
            className="text-xs font-black text-blue-600 hover:underline cursor-pointer"
          >
            View All Activity →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentActivities.map((act, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                  act.type === 'BUY' ? 'bg-emerald-100 text-emerald-800' :
                  act.type === 'DIVIDEND' ? 'bg-blue-100 text-blue-800' :
                  act.type === 'SIP' ? 'bg-violet-100 text-violet-800' : 'bg-slate-200 text-slate-800'
                }`}>
                  {act.type}
                </span>
                <span className="text-[9px] text-slate-400 font-bold">{act.time}</span>
              </div>

              <div>
                <strong className="text-xs font-black text-slate-900 block">{act.symbol}</strong>
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{act.detail}</span>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[9px] text-emerald-600 font-black flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {act.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CREATE NEW WATCHLIST MODAL OVERLAY */}
      <AnimatePresence>
        {showCreateWatchlistModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[28px] border border-slate-200 p-6 sm:p-8 max-w-sm w-full shadow-2xl flex flex-col gap-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-black text-base text-slate-900">Create New Watchlist</h3>
                  <span className="text-[10px] text-slate-400 font-bold">Organize custom stock trackings</span>
                </div>
                <button 
                  onClick={() => {
                    setShowCreateWatchlistModal(false);
                    setNewWatchlistTitle('');
                  }} 
                  className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Watchlist Name</label>
                <input
                  type="text"
                  placeholder="e.g. EV & Clean Energy, Dividend Picks"
                  value={newWatchlistTitle}
                  onChange={(e) => setNewWatchlistTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 outline-none focus:border-blue-500 transition"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowCreateWatchlistModal(false);
                    setNewWatchlistTitle('');
                  }}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const trimmed = newWatchlistTitle.trim();
                    if (!trimmed) {
                      toast.error('Please enter a valid watchlist name');
                      return;
                    }
                    if (watchlists.includes(trimmed)) {
                      toast.error('A watchlist with this name already exists');
                      return;
                    }
                    setWatchlists(prev => [...prev, trimmed]);
                    setSelectedWatchlist(trimmed);
                    setShowCreateWatchlistModal(false);
                    setNewWatchlistTitle('');
                    toast.success(`Created watchlist "${trimmed}"`);
                  }}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition cursor-pointer shadow-md"
                >
                  Create Watchlist
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default HomeDashboard;
