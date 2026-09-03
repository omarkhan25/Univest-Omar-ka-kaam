import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, TrendingUp, Clock, Activity, Briefcase, 
  BarChart3, Bookmark, Share2, Sparkles, AlertCircle, 
  ChevronRight, Calendar, Info, Award, ShieldCheck, ArrowUpRight, ArrowDownRight, Bell, ExternalLink, X, Plus, Check, Sliders
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import AdvancedStockChart from './AdvancedStockChart';
import { useAuth } from '../../context/AuthContext';

interface StockDetailProps {
  isOpen: boolean;
  onClose: () => void;
  stock?: any;
  onInvestViaBroker?: (stock: any) => void;
  onSetAlert?: (stock: any) => void;
  onNavigateTab?: (tab: string) => void;
  onOpenTradeDrawer?: (stock: any) => void;
  isPremium?: boolean;
}

export const StockDetail: React.FC<StockDetailProps> = ({
  isOpen,
  onClose,
  stock,
  onInvestViaBroker,
  onSetAlert,
  onNavigateTab,
  onOpenTradeDrawer,
  isPremium
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'charts'>('overview');
  const [chartInterval, setChartInterval] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | '5Y'>('1M');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAlertSet, setIsAlertSet] = useState(false);
  const [hoveredDataPoint, setHoveredDataPoint] = useState<{ price: number; label: string; diff: number; pct: number } | null>(null);

  if (!isOpen) return null;

  const symbol = stock?.symbol || 'NIFTY 500';
  const companyName = stock?.companyName || stock?.name || 'NIFTY 500 Index';
  const price = stock?.price || '22,183.65';
  const changePercent = stock?.changePercent ?? 1.25;
  const changeAmount = stock?.changeAmount ?? '+275.45';
  const isPositive = changePercent >= 0;

  const numericPrice = parseFloat(price.toString().replace(/,/g, '')) || 22183.65;

  // Generate detailed, realistic time-series chart data points based on stock price and interval
  const generateDetailedChartData = (basePrice: number, interval: '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y') => {
    let count = 24;
    let labels: string[] = [];
    let startPrice = basePrice * 0.94;

    if (interval === '1D') {
      count = 26;
      labels = [
        '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00',
        '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00',
        '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00',
        '15:15', '15:30'
      ];
      startPrice = basePrice * 0.988;
    } else if (interval === '1W') {
      count = 20;
      labels = ['Mon 09:15', 'Mon 13:00', 'Tue 09:15', 'Tue 13:00', 'Wed 09:15', 'Wed 13:00', 'Thu 09:15', 'Thu 13:00', 'Fri 09:15', 'Fri 13:00', 'Mon 09:15', 'Mon 13:00', 'Tue 09:15', 'Tue 13:00', 'Wed 09:15', 'Wed 13:00', 'Thu 09:15', 'Thu 13:00', 'Fri 09:15', 'Today'];
      startPrice = basePrice * 0.965;
    } else if (interval === '1M') {
      count = 30;
      labels = Array.from({ length: 30 }, (_, i) => `May ${i + 1}`);
      startPrice = basePrice * 0.93;
    } else if (interval === '3M') {
      count = 24;
      labels = Array.from({ length: 24 }, (_, i) => `Wk ${i + 1}`);
      startPrice = basePrice * 0.88;
    } else if (interval === '1Y') {
      count = 24;
      labels = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May',
                'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'Today'];
      startPrice = basePrice * 0.78;
    } else {
      count = 25;
      labels = Array.from({ length: 25 }, (_, i) => `Q${(i % 4) + 1} ${(2020 + Math.floor(i / 4))}`);
      startPrice = basePrice * 0.52;
    }

    const totalRange = basePrice - startPrice;
    const data = [];

    for (let i = 0; i < count; i++) {
      const progress = i / (count - 1);
      const trend = startPrice + totalRange * Math.pow(progress, 0.85);
      const wave = Math.sin(progress * Math.PI * 4) * (totalRange * 0.08);
      const wave2 = Math.cos(progress * Math.PI * 7) * (totalRange * 0.04);
      
      let priceVal = trend + wave + wave2;
      if (i === count - 1) priceVal = basePrice;

      data.push({
        label: labels[i] || `Pt ${i + 1}`,
        price: parseFloat(priceVal.toFixed(2)),
        startPrice: parseFloat(startPrice.toFixed(2))
      });
    }

    return data;
  };

  const detailedChartData = generateDetailedChartData(numericPrice, chartInterval);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Stock intelligence link copied to clipboard!');
    }
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Removed from Watchlist' : 'Added to Watchlist!');
  };

  const handleToggleAlert = () => {
    setIsAlertSet(!isAlertSet);
    toast.success(isAlertSet ? 'Price alert removed' : `Alert created for ${symbol}!`);
  };

  const handleAddToInvestmentLab = () => {
    const hasPremium = isPremium || 
                       user?.isPremium || 
                       user?.plan === 'pro' || 
                       user?.plan === 'premium' || 
                       localStorage.getItem('is_premium_member') === 'true' ||
                       localStorage.getItem('user_plan') === 'pro';

    if (hasPremium) {
      // User HAS bought premium -> Open Buy / Sell trade page
      onClose();
      if (onOpenTradeDrawer) {
        onOpenTradeDrawer(stock || { symbol, companyName, price });
      } else if (onInvestViaBroker) {
        onInvestViaBroker(stock || { symbol, companyName, price });
      } else {
        toast.success(`Opening Buy/Sell Order Page for ${symbol}`);
      }
    } else {
      // User HAS NOT bought premium -> Redirect to Investment Lab page ('Portfolio')
      onClose();
      if (onNavigateTab) {
        onNavigateTab('Portfolio');
      }
      toast.success(`Redirecting to Investment Lab for ${symbol}...`, {
        icon: '🧪'
      });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-hidden font-sans">
        {/* Backdrop listener */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative bg-[#F8FAFC] rounded-[28px] shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden my-auto z-10"
        >
          {/* 1. STICKY COMPACT HEADER */}
          <div className="p-4 sm:p-5 bg-white border-b border-slate-200 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 z-20">
            
            {/* LEFT: STOCK LOGO, NAME & PRICE */}
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                title="Close"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#15519D] text-white font-black text-sm flex items-center justify-center shadow-md shrink-0">
                  {symbol.substring(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-xl font-extrabold text-[#172033]">{companyName}</h1>
                    <span className="px-2 py-0.5 bg-slate-100 text-[#64748B] font-mono font-bold text-xs rounded-lg">
                      {symbol}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] mt-0.5">
                    <span>NSE India</span> • <span className="text-[#16A34A] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" /> Market Open
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CENTER/RIGHT: PRICE & HEADER ACTIONS */}
            <div className="flex flex-wrap items-center justify-between md:justify-end gap-4">
              
              <div className="text-left md:text-right">
                <div className="text-xl sm:text-2xl font-black text-[#172033] leading-none">
                  ₹{price}
                </div>
                <div className={`text-xs font-extrabold flex items-center gap-0.5 mt-1 ${isPositive ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                  {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  <span>{changeAmount} ({isPositive ? '+' : ''}{changePercent}%) Today</span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleBookmark}
                  className={`p-2.5 rounded-xl border transition cursor-pointer ${
                    isBookmarked ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Bookmark Stock"
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                </button>

                <button
                  onClick={handleToggleAlert}
                  className={`p-2.5 rounded-xl border transition cursor-pointer ${
                    isAlertSet ? 'bg-blue-50 border-blue-200 text-[#15519D]' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Create Price Alert"
                >
                  <Bell className="w-4 h-4" />
                </button>

                <button
                  onClick={handleShare}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl border border-slate-200 transition cursor-pointer"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  onClick={handleAddToInvestmentLab}
                  className="px-4 py-2.5 bg-[#15519D] hover:bg-[#123B63] text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <Briefcase className="w-4 h-4 text-amber-300" />
                  <span>Add to Investment Lab</span>
                </button>

                <button
                  onClick={onClose}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition cursor-pointer ml-1"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

          {/* 2. PILL-STYLE TABS BAR */}
          <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-5 py-2 rounded-xl font-black text-xs transition cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#15519D] text-white shadow-sm'
                    : 'bg-slate-100 text-[#64748B] hover:text-[#172033]'
                }`}
              >
                Overview
              </button>

              <button
                onClick={() => setActiveTab('charts')}
                className={`px-5 py-2 rounded-xl font-black text-xs transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'charts'
                    ? 'bg-[#15519D] text-white shadow-sm'
                    : 'bg-slate-100 text-[#64748B] hover:text-[#172033]'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Advanced Charts</span>
              </button>
            </div>

            {activeTab === 'overview' && (
              <button
                onClick={() => setActiveTab('charts')}
                className="text-xs font-extrabold text-[#15519D] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Open Advanced Technical Workspace</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 3. TAB CONTENT WORKSPACE */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                
                {/* SECTION 1: KEY METRICS HORIZONTAL STRIP */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 divide-x divide-slate-100 text-xs">
                    <div className="pr-2">
                      <span className="text-[10px] font-bold text-[#64748B] uppercase block">Current Price</span>
                      <div className="font-black text-sm text-[#172033] mt-0.5">₹{price}</div>
                    </div>
                    <div className="pl-3 pr-2">
                      <span className="text-[10px] font-bold text-[#64748B] uppercase block">Today's Change</span>
                      <div className={`font-black text-sm mt-0.5 ${isPositive ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                        {isPositive ? '+' : ''}{changePercent}%
                      </div>
                    </div>
                    <div className="pl-3 pr-2">
                      <span className="text-[10px] font-bold text-[#64748B] uppercase block">Today's Range</span>
                      <div className="font-extrabold text-xs text-[#172033] mt-0.5">₹21,980 - 22,240</div>
                    </div>
                    <div className="pl-3 pr-2">
                      <span className="text-[10px] font-bold text-[#64748B] uppercase block">52-Week Range</span>
                      <div className="font-extrabold text-xs text-[#172033] mt-0.5">₹18,400 - 22,480</div>
                    </div>
                    <div className="pl-3 pr-2">
                      <span className="text-[10px] font-bold text-[#64748B] uppercase block">Open</span>
                      <div className="font-extrabold text-xs text-[#172033] mt-0.5">₹22,010.50</div>
                    </div>
                    <div className="pl-3 pr-2">
                      <span className="text-[10px] font-bold text-[#64748B] uppercase block">Prev Close</span>
                      <div className="font-extrabold text-xs text-[#172033] mt-0.5">₹21,908.20</div>
                    </div>
                    <div className="pl-3 pr-2">
                      <span className="text-[10px] font-bold text-[#64748B] uppercase block">Volume</span>
                      <div className="font-extrabold text-xs text-[#172033] mt-0.5">14.20M</div>
                    </div>
                    <div className="pl-3">
                      <span className="text-[10px] font-bold text-[#64748B] uppercase block">Market Cap</span>
                      <div className="font-extrabold text-xs text-[#15519D] mt-0.5">₹19.45L Cr</div>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: PRICE PERFORMANCE TREND */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#15519D]" />
                        <h3 className="font-black text-base text-[#172033]">Price Performance Trend</h3>
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#15519D] font-extrabold text-[10px] border border-blue-200">
                          Live Interactive Chart
                        </span>
                      </div>

                      {/* DYNAMIC CURSOR HOVER PRICE DISPLAY */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xl font-black text-slate-900 font-mono">
                          ₹{(hoveredDataPoint ? hoveredDataPoint.price : numericPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                        {hoveredDataPoint ? (
                          <span className={`text-xs font-extrabold flex items-center gap-0.5 px-2 py-0.5 rounded-md ${hoveredDataPoint.diff >= 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                            <span>{hoveredDataPoint.diff >= 0 ? '▲ +' : '▼ '}{hoveredDataPoint.diff.toFixed(2)} ({hoveredDataPoint.pct}%)</span>
                            <span className="text-[10px] text-slate-400 font-semibold ml-1">at {hoveredDataPoint.label}</span>
                          </span>
                        ) : (
                          <span className={`text-xs font-extrabold flex items-center gap-0.5 px-2 py-0.5 rounded-md ${isPositive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                            <span>{isPositive ? '▲ +' : '▼ '}{changePercent}% Today</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* TIMEFRAME SELECTOR BUTTONS */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-center">
                      {(['1D', '1W', '1M', '3M', '1Y', '5Y'] as const).map((inter) => (
                        <button
                          key={inter}
                          onClick={() => {
                            setChartInterval(inter);
                            setHoveredDataPoint(null);
                          }}
                          className={`px-3 py-1.5 text-xs font-black rounded-lg transition cursor-pointer ${
                            chartInterval === inter
                              ? 'bg-[#15519D] text-white shadow-xs'
                              : 'text-[#64748B] hover:text-[#172033]'
                          }`}
                        >
                          {inter}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* RECHARTS INTERACTIVE AREA/LINE CHART */}
                  <div className="h-60 w-full relative pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={detailedChartData}
                        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                        onMouseMove={(e) => {
                          if (e && e.activePayload && e.activePayload.length > 0) {
                            const p = e.activePayload[0].payload;
                            const diff = p.price - p.startPrice;
                            const pct = parseFloat(((diff / p.startPrice) * 100).toFixed(2));
                            setHoveredDataPoint({
                              price: p.price,
                              label: p.label,
                              diff,
                              pct
                            });
                          }
                        }}
                        onMouseLeave={() => setHoveredDataPoint(null)}
                      >
                        <defs>
                          <linearGradient id="stockDetailAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#15519D" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#15519D" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                        <XAxis 
                          dataKey="label" 
                          stroke="#94A3B8" 
                          fontSize={11} 
                          tickLine={false} 
                          axisLine={{ stroke: '#E2E8F0' }}
                          minTickGap={25}
                        />
                        <YAxis 
                          domain={['dataMin - 10', 'dataMax + 10']} 
                          stroke="#94A3B8" 
                          fontSize={11} 
                          tickLine={false} 
                          axisLine={false}
                          tickFormatter={(v) => `₹${Math.round(v).toLocaleString('en-IN')}`}
                          orientation="right"
                        />
                        <Tooltip 
                          content={({ active, payload }: any) => {
                            if (active && payload && payload.length) {
                              const d = payload[0].payload;
                              const isUp = d.price >= d.startPrice;
                              const diff = d.price - d.startPrice;
                              const pct = ((diff / d.startPrice) * 100).toFixed(2);
                              return (
                                <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700/80 backdrop-blur-md text-xs space-y-1">
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{d.label}</div>
                                  <div className="text-base font-black font-mono text-white">
                                    ₹{d.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                  </div>
                                  <div className={`text-[11px] font-extrabold flex items-center gap-1 ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    <span>{isUp ? '▲ +' : '▼ '}{diff.toFixed(2)} ({pct}%)</span>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }} 
                          cursor={{ stroke: '#15519D', strokeWidth: 1.5, strokeDasharray: '4 4' }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="price" 
                          stroke="#15519D" 
                          strokeWidth={3} 
                          fill="url(#stockDetailAreaGrad)" 
                          activeDot={{ r: 6, fill: '#15519D', stroke: '#FFFFFF', strokeWidth: 2 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* SECTION 3: WHY IS THIS STOCK MOVING TODAY? */}
                <div className="bg-blue-50/60 p-6 rounded-2xl border border-blue-100 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#15519D] text-white flex items-center justify-center shadow-xs">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </div>
                    <h3 className="font-black text-base text-[#15519D]">Why Is This Stock Moving Today?</h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#172033] font-medium leading-relaxed italic">
                    "{companyName} is trading higher today driven by positive sector rotation in banking and heavyweights, expanding refining margins, and sustained institutional buying interest."
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {[
                      { factor: 'FACTOR 1', title: 'Refining Margin Expansion' },
                      { factor: 'FACTOR 2', title: 'Strong FII Inflows (+₹420 Cr)' },
                      { factor: 'FACTOR 3', title: 'Green Energy Commissioning' }
                    ].map((f) => (
                      <div key={f.factor} className="p-3 bg-white rounded-xl border border-blue-100 shadow-2xs space-y-0.5">
                        <span className="text-[9px] font-extrabold text-[#64748B] uppercase">{f.factor}</span>
                        <div className="font-extrabold text-xs text-[#172033]">{f.title}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION 4: ARTHSETU VIEW CONVICTION SCORE */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="px-3 py-1 bg-emerald-50 text-[#16A34A] font-black text-xs rounded-full uppercase">
                        POSITIVE OUTLOOK
                      </span>
                      <h3 className="text-lg font-black text-[#172033] mt-1.5">ArthSetu Conviction Score: 78 / 100</h3>
                    </div>

                    <div className="text-right">
                      <div className="text-3xl font-black text-[#15519D]">78</div>
                      <span className="text-[10px] font-bold text-[#64748B] uppercase">Score / 100</span>
                    </div>
                  </div>

                  {/* SCORE BARS GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Business Quality', score: 86, text: 'Strong cashflow stability & moat' },
                      { label: 'Growth Trajectory', score: 82, text: 'Consistent earnings expansion' },
                      { label: 'Valuation Safety', score: 68, text: 'Fairly valued with margin of safety' },
                      { label: 'Momentum', score: 79, text: 'Bullish trend across 20 & 50 MAs' },
                      { label: 'Financial Health', score: 88, text: 'Low debt to equity ratio' },
                      { label: 'Risk Balance', score: 74, text: 'Low beta relative to broader market' }
                    ].map((sc) => (
                      <div key={sc.label} className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-200/80 space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-[#172033]">{sc.label}</span>
                          <span className="text-[#15519D] font-black">{sc.score}/100</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#15519D] rounded-full" style={{ width: `${sc.score}%` }} />
                        </div>
                        <span className="text-[10px] text-[#64748B] font-medium block">{sc.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION 5: WHAT CHANGED (RESEARCH TIMELINE) */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
                  <h3 className="font-black text-base text-[#172033]">What Changed (Research Timeline)</h3>
                  
                  <div className="space-y-3">
                    {[
                      { date: '28 AUG 2026', title: 'Q1 Financial Results Beat Estimates', desc: 'EBITDA expanded 14.2% YoY backed by retail margin recovery.', impact: 'Positive' },
                      { date: '15 AUG 2026', title: 'Commissioned 2GW Solar Energy Plant', desc: 'Expands renewable capacity toward 2030 green target.', impact: 'Positive' },
                      { date: '01 AUG 2026', title: 'FII Holding Increased by +1.4%', desc: 'Institutional allocation raised across key mutual funds.', impact: 'Positive' }
                    ].map((ev) => (
                      <div key={ev.title} className="p-3.5 bg-[#F8FAFC] rounded-xl border border-slate-200/80 flex items-start justify-between gap-3 text-xs">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold text-[#64748B]">{ev.date}</span>
                          <h4 className="font-extrabold text-[#172033]">{ev.title}</h4>
                          <p className="text-[#64748B] text-[11px] font-medium">{ev.desc}</p>
                        </div>
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full shrink-0">
                          {ev.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* CHARTS TAB */}
            {activeTab === 'charts' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-lg text-[#172033]">Advanced Technical Charting Workspace</h3>
                    <p className="text-xs text-[#64748B] font-medium">Interactive OHLC candlesticks, moving average overlays, and independent RSI & MACD indicator panels.</p>
                  </div>
                </div>

                <AdvancedStockChart
                  symbol={symbol}
                  price={numericPrice}
                  isPositive={isPositive}
                />
              </div>
            )}

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StockDetail;
