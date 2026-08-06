import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Sparkles, Wallet, ArrowUpRight, ArrowDownRight, 
  Search, ChevronRight, Plus, ArrowRight, ShieldCheck, Activity, BarChart3, 
  Clock, CheckCircle2, DollarSign, Layers, Filter, RefreshCw, Zap, Award, 
  Bookmark, ChevronDown, Radio, AlertCircle, Check, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

import marketService from '../../services/market.service';
import wsService from '../../services/websocket.service';
import watchlistService from '../../services/watchlist.service';
import { portfolioService } from '../../services/portfolio.service';
import { orderService } from '../../services/order.service';
import aiService from '../../services/ai.service';
import type { Watchlist } from '../../services/watchlist.service';

const ALL_HISTORICAL_DATA = [
  // FY 2024-25
  { date: 'Apr 2024', value: 850000, invested: 800000 },
  { date: 'May 2024', value: 870000, invested: 800000 },
  { date: 'Jun 2024', value: 890000, invested: 800000 },
  { date: 'Jul 2024', value: 920000, invested: 850000 },
  { date: 'Aug 2024', value: 910000, invested: 850000 },
  { date: 'Sep 2024', value: 945000, invested: 850000 },
  { date: 'Oct 2024', value: 980000, invested: 900000 },
  { date: 'Nov 2024', value: 975000, invested: 900000 },
  { date: 'Dec 2024', value: 1020000, invested: 950000 },
  { date: 'Jan 2025', value: 1050000, invested: 950000 },
  { date: 'Feb 2025', value: 1090000, invested: 1000000 },
  { date: 'Mar 2025', value: 1120000, invested: 1000000 },
  // FY 2025-26
  { date: 'Apr 2025', value: 1150000, invested: 1143060 },
  { date: 'May 2025', value: 1175000, invested: 1143060 },
  { date: 'Jun 2025', value: 1210000, invested: 1143060 },
  { date: 'Jul 2025', value: 1195000, invested: 1143060 },
  { date: 'Aug 2025', value: 1240000, invested: 1143060 },
  { date: 'Sep 2025', value: 1285000, invested: 1143060 },
  { date: 'Oct 2025', value: 1320000, invested: 1143060 },
  { date: 'Nov 2025', value: 1305000, invested: 1143060 },
  { date: 'Dec 2025', value: 1360000, invested: 1143060 },
  { date: 'Jan 2026', value: 1395000, invested: 1143060 },
  { date: 'Feb 2026', value: 1430000, invested: 1143060 },
  { date: 'Mar 2026', value: 1485240, invested: 1143060 }
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = data.value || 0;
    const invested = data.invested !== undefined ? data.invested : 0;
    const gain = value - invested;
    const gainPercentage = invested > 0 ? ((gain / invested) * 100).toFixed(1) : '0.0';
    
    return (
      <div className="bg-slate-950 text-white p-3.5 rounded-2xl shadow-xl border border-slate-800 text-[11px] font-sans">
        <p className="font-extrabold text-slate-400 mb-1">{data.date}</p>
        <p className="font-black text-sm text-white">Valuation: ₹{value.toLocaleString('en-IN')}</p>
        <p className="font-bold text-slate-400 mt-1">Invested: ₹{invested.toLocaleString('en-IN')}</p>
        <p className={`font-black mt-1 ${gain === 0 ? 'text-slate-400' : gain > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {gain >= 0 ? '+' : ''}₹{gain.toLocaleString('en-IN')} ({gainPercentage}%)
        </p>
      </div>
    );
  }
  return null;
};

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

  const [activeTimeframe, setActiveTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('1Y');

  const { data: rawGainers } = useQuery({
    queryKey: ['marketGainers'],
    queryFn: async () => {
      const gainers = await marketService.getStocks('gainers');
      return gainers || [];
    },
    refetchInterval: 60000,
  });

  const liveGainers = useMemo(() => {
    if (!rawGainers || rawGainers.length === 0) return [];
    
    return rawGainers.slice(0, 6).map((st: any) => {
      const currentPrice = st.currentPrice || st.lastPrice || 0;
      const changePercent = st.changePercent || 0;
      const previousClose = currentPrice / (1 + (changePercent / 100));
      const absoluteChange = currentPrice - previousClose;

      return {
        name: st.symbol,
        value: `₹${currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`,
        change: `${absoluteChange >= 0 ? '+' : ''}${absoluteChange.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`,
        isPositive: absoluteChange >= 0,
        sparkline: [10, 15, 12, 18, 24, 30] // Fallback sparkline
      };
    });
  }, [rawGainers]);

  const { data: portfolioData } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => portfolioService.getPortfolio(),
    refetchInterval: 30000,
  });

  const { data: orderHistory } = useQuery({
    queryKey: ['orderHistory'],
    queryFn: () => orderService.getHistory(),
    refetchInterval: 30000,
  });

  const { data: aiBrief } = useQuery({
    queryKey: ['aiBrief'],
    queryFn: () => aiService.analyzeMarketMovers(),
    refetchInterval: 300000, // 5 minutes
  });

  const portfolioMetrics = useMemo(() => {
    if (!portfolioData) {
      return {
        valuation: 0,
        invested: 0,
        cash: 0,
        totalGain: 0,
        totalGainPerc: 0,
        xirr: '0.0'
      };
    }
    
    return {
      valuation: portfolioData.current_value || 0,
      invested: portfolioData.total_invested || 0,
      cash: portfolioData.cash_balance || 0,
      totalGain: portfolioData.unrealized_pnl || 0,
      totalGainPerc: portfolioData.unrealized_pnl_percentage || 0,
      xirr: portfolioData.total_invested > 0 ? Math.min(30, Math.max(0, portfolioData.unrealized_pnl_percentage)).toFixed(1) : '0.0'
    };
  }, [portfolioData]);

  const chartData = useMemo(() => {
    const val = portfolioMetrics?.valuation || 0;
    const inv = portfolioMetrics?.invested || 0;
    if (val === 0 && inv === 0) {
      return [
        { date: 'Apr 2025', value: 0, invested: 0 },
        { date: 'Jul 2025', value: 0, invested: 0 },
        { date: 'Oct 2025', value: 0, invested: 0 },
        { date: 'Jan 2026', value: 0, invested: 0 },
        { date: 'Mar 2026', value: 0, invested: 0 }
      ];
    }
    
    if (inv === 0) {
      // User just deposited cash, no investments yet
      return [
        { date: 'Apr 2025', value: val, invested: 0 },
        { date: 'Jul 2025', value: val, invested: 0 },
        { date: 'Oct 2025', value: val, invested: 0 },
        { date: 'Jan 2026', value: val, invested: 0 },
        { date: 'Mar 2026', value: val, invested: 0 }
      ];
    }

    return [
      { date: 'Apr 2025', value: Math.round(inv * 0.95), invested: inv },
      { date: 'Jul 2025', value: Math.round(inv), invested: inv },
      { date: 'Oct 2025', value: Math.round(inv + (val - inv) * 0.2), invested: inv },
      { date: 'Jan 2026', value: Math.round(inv + (val - inv) * 0.6), invested: inv },
      { date: 'Mar 2026', value: val, invested: inv }
    ];
  }, [portfolioMetrics]);

  // Watchlist States
  const [selectedWatchlist, setSelectedWatchlist] = useState<Watchlist | null>(null);
  const [watchlistSearch, setWatchlistSearch] = useState('');
  const [showWatchlistDropdown, setShowWatchlistDropdown] = useState(false);
  const [showCreateWatchlistModal, setShowCreateWatchlistModal] = useState(false);
  const [newWatchlistTitle, setNewWatchlistTitle] = useState('');
  const [showSaveToWatchlistModal, setShowSaveToWatchlistModal] = useState(false);
  const [stockToSave, setStockToSave] = useState<any>(null);

  const { data: watchlists = [], refetch: refetchWatchlists } = useQuery({
    queryKey: ['watchlists'],
    queryFn: async () => {
      const data = await watchlistService.getWatchlists();
      if (data && data.length > 0) return data;
      // Auto-create default if none exists
      if (data && data.length === 0) {
        const defaultW = await watchlistService.createWatchlist('Default Watchlist', true);
        return defaultW ? [defaultW] : [];
      }
      return [];
    }
  });

  useEffect(() => {
    if (watchlists.length > 0 && !selectedWatchlist) {
      setSelectedWatchlist(watchlists.find(w => w.is_default) || watchlists[0]);
    }
  }, [watchlists, selectedWatchlist]);

  // Live Watchlist Stocks
  const [watchlistStocks, setWatchlistStocks] = useState<any[]>([]);
  
  useQuery({
    queryKey: ['watchlistStocksData'],
    queryFn: async () => {
      const data = await marketService.getStocks();
      if (data && data.length > 0) {
        const formatted = data.map(st => ({
          symbol: st.symbol,
          name: st.companyName,
          ltp: `₹${st.lastPrice.toLocaleString('en-IN')}`,
          change: `${st.changePercent >= 0 ? '+' : ''}${st.changePercent.toFixed(2)}%`,
          isPositive: st.changePercent >= 0,
          sparkline: [10, 14, 12, 18, 22, 28]
        }));
        setWatchlistStocks(formatted);
      }
      return data;
    },
    refetchInterval: 60000
  });

  const { data: aiOpportunitiesData, isLoading: isAiLoading } = useQuery({
    queryKey: ['aiOpportunities'],
    queryFn: async () => {
      const data = await aiService.getHighConvictionPicks();
      return data || [];
    },
    refetchInterval: 120000
  });

  const aiOpportunities = useMemo(() => {
    if (!aiOpportunitiesData) return [];
    return aiOpportunitiesData.slice(0, 4).map(call => ({
      symbol: call.symbol,
      company: call.companyName,
      type: call.type || 'Stock',
      signal: call.recommendation,
      confidence: call.confidenceScore,
      targetPrice: typeof call.targetPrice === 'number' ? `₹${call.targetPrice.toLocaleString('en-IN')}` : call.targetPrice,
      upside: `+${call.potentialReturn}%`,
      risk: call.riskLevel,
      reason: call.summary
    }));
  }, [aiOpportunitiesData]);

  useEffect(() => {
    let isMounted = true;
    const symbols = watchlistStocks.map(s => s.symbol);

    if (symbols.length > 0) {
      symbols.forEach(s => wsService.subscribe(s));
    }

    const handlePriceUpdate = (prices: Record<string, any>) => {
      if (!isMounted) return;
      setWatchlistStocks(prev =>
        prev.map(item => {
          const live = prices[item.symbol];
          if (live && live.lastPrice) {
            const isPos = live.change >= 0;
            return {
              ...item,
              ltp: `₹${live.lastPrice.toLocaleString('en-IN')}`,
              change: `${isPos ? '+' : ''}${live.changePercent}%`,
              isPositive: isPos
            };
          }
          return item;
        })
      );
    };

    wsService.addListener(handlePriceUpdate);
    return () => {
      isMounted = false;
      wsService.removeListener(handlePriceUpdate);
    };
  }, [watchlistStocks.map(s => s.symbol).join(',')]);

  const filteredWatchlist = useMemo(() => {
    let baseStocks: any[] = [];
    if (selectedWatchlist && selectedWatchlist.items && selectedWatchlist.items.length > 0) {
      const symbolsInWatchlist = selectedWatchlist.items.map((i: any) => i.symbol);
      baseStocks = watchlistStocks.filter((st: any) => symbolsInWatchlist.includes(st.symbol));
    }
    
    return baseStocks.filter((st: any) => 
      st.symbol.toLowerCase().includes(watchlistSearch.toLowerCase()) ||
      st.name.toLowerCase().includes(watchlistSearch.toLowerCase())
    );
  }, [watchlistStocks, selectedWatchlist, watchlistSearch]);

  const marketOverview = useMemo(() => {
    if (liveGainers.length > 0) {
      return liveGainers;
    }
    
    if (watchlistStocks.length === 0) {
      return [
        { name: 'NIFTY 50', value: '24,586.20', change: '+142.50 (+0.58%)', isPositive: true, sparkline: [10, 15, 12, 18, 24, 30] },
        { name: 'SENSEX', value: '80,716.40', change: '+485.10 (+0.61%)', isPositive: true, sparkline: [12, 18, 16, 22, 28, 34] },
        { name: 'BANK NIFTY', value: '52,380.90', change: '+610.40 (+1.18%)', isPositive: true, sparkline: [8, 12, 18, 25, 30, 40] },
        { name: 'NASDAQ', value: '17,842.10', change: '-94.30 (-0.53%)', isPositive: false, sparkline: [30, 25, 22, 18, 15, 12] },
        { name: 'Gold (10g)', value: '₹72,450', change: '+180 (+0.25%)', isPositive: true, sparkline: [15, 18, 20, 22, 24, 25] },
        { name: 'USD/INR', value: '₹83.68', change: '-0.02 (-0.02%)', isPositive: false, sparkline: [18, 17, 18, 17, 16, 16] }
      ];
    }
    
    return [...watchlistStocks]
      .filter(st => st.isPositive)
      .sort((a, b) => {
        const valA = parseFloat(a.change.replace(/[+%]/g, ''));
        const valB = parseFloat(b.change.replace(/[+%]/g, ''));
        return valB - valA;
      })
      .slice(0, 6)
      .map(st => ({
        name: st.symbol,
        value: st.ltp,
        change: st.change,
        isPositive: st.isPositive,
        sparkline: st.sparkline || [10, 15, 12, 18, 24, 30]
      }));
  }, [liveGainers, watchlistStocks]);

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

  const dynamicRecentActivities = useMemo(() => {
    const formattedTrades = (orderHistory || []).map((trade: any) => ({
      type: trade.order_type || 'TRADE',
      symbol: trade.symbol,
      detail: `${trade.quantity} Qty @ ₹${trade.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      status: trade.status || 'Executed',
      time: new Date(trade.created_at).toLocaleDateString()
    }));
    return formattedTrades;
  }, [orderHistory]);

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500 pb-16">
      
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-[28px] p-6 sm:p-8 shadow-xs flex flex-col justify-between gap-6 relative overflow-hidden">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Net Portfolio Valuation</span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-none">
                ₹{portfolioMetrics.valuation.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs font-black px-2.5 py-0.5 rounded-md flex items-center gap-1 border ${
                  portfolioMetrics.totalGain >= 0 ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose-600 bg-rose-50 border-rose-100'
                }`}>
                  {portfolioMetrics.totalGain >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />} 
                  {portfolioMetrics.totalGain >= 0 ? '+' : ''}₹{portfolioMetrics.totalGain.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({portfolioMetrics.totalGainPerc >= 0 ? '+' : ''}{portfolioMetrics.totalGainPerc.toFixed(2)}%) Today
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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Total Gain</span>
              <span className={`text-sm font-black block mt-0.5 ${portfolioMetrics.totalGain >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {portfolioMetrics.totalGain >= 0 ? '+' : ''}₹{portfolioMetrics.totalGain.toLocaleString('en-IN')} ({portfolioMetrics.totalGainPerc >= 0 ? '+' : ''}{portfolioMetrics.totalGainPerc.toFixed(1)}%)
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Invested Amount</span>
              <span className="text-sm font-black text-slate-800 block mt-0.5">
                ₹{portfolioMetrics.invested.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Available Cash</span>
              <span className="text-sm font-black text-blue-600 block mt-0.5">
                ₹{portfolioMetrics.cash.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">XIRR Return</span>
              <span className="text-sm font-black text-emerald-600 block mt-0.5">{portfolioMetrics.xirr}% p.a.</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Portfolio Growth Trajectory</span>
              </div>
              
              <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
                {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setActiveTimeframe(tf)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider transition cursor-pointer select-none ${
                      activeTimeframe === tf 
                        ? 'bg-blue-600 text-white shadow-xs' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-48 w-full mt-2 relative">
              <ResponsiveContainer width="99%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fill: '#94A3B8', fontWeight: 700 }}
                    dy={8}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fill: '#94A3B8', fontWeight: 700 }}
                    tickFormatter={(val: any) => `₹${(val / 100000).toFixed(1)}L`}
                    dx={-6}
                  />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2563EB" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#growthGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-[28px] p-5 shadow-xs flex flex-col gap-3.5">
          <div className="flex flex-col gap-2 border-b border-slate-100 pb-3">
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

            <div className="relative">
              <button 
                onClick={() => setShowWatchlistDropdown(!showWatchlistDropdown)}
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-slate-800 hover:border-slate-300 transition cursor-pointer"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Active:</span> {selectedWatchlist?.name || 'Loading...'}
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
                    {watchlists.map((w: any) => (
                      <button
                        key={w.id}
                        onClick={() => {
                          setSelectedWatchlist(w);
                          setShowWatchlistDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-between ${
                          selectedWatchlist?.id === w.id ? 'bg-blue-50 text-blue-700 font-black' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{w.name}</span>
                        {selectedWatchlist?.id === w.id && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
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

          <div className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-[320px] scrollbar-none pr-0.5">
            {filteredWatchlist.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-2 text-center my-auto">
                <span className="text-xs font-black text-slate-500">Your Watchlist is empty</span>
                <p className="text-[10px] text-slate-400 font-medium max-w-[150px]">Search and add stocks to track them here.</p>
              </div>
            ) : filteredWatchlist.map((st: any) => (
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


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-xs flex flex-col gap-5 h-[380px]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-blue-600 fill-blue-500/20 animate-pulse" />
              <div>
                <h3 className="text-base font-black text-slate-900 leading-tight">Today's High-Conviction AI Picks</h3>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-1">
            {isAiLoading ? (
              <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-black text-slate-500">Analyzing market data...</span>
              </div>
            ) : aiOpportunities.length === 0 ? (
              <div className="p-8 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-3 text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-1">
                  <Sparkles className="w-6 h-6 text-blue-500" />
                </div>
                <span className="text-sm font-black text-slate-900">AI is gathering intelligence</span>
                <p className="text-xs text-slate-500 font-medium max-w-[200px]">Our models are analyzing the market. Check back soon for high-conviction picks.</p>
              </div>
            ) : (
              aiOpportunities.map((opp: any) => (
                <div 
                  key={opp.symbol}
                  className="p-4 bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md rounded-2xl transition-all duration-300 flex flex-col gap-3 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                  
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        opp.type === 'Mutual Fund' 
                          ? 'bg-violet-100 text-violet-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {opp.type === 'Mutual Fund' ? <Layers className="w-5 h-5" /> : <BarChart3 className="w-5 h-5" />}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-slate-900">{opp.symbol}</span>
                          <span className="text-[9px] font-black bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded uppercase tracking-wider">
                            {opp.type}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold truncate max-w-[180px] mt-0.5">{opp.company}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase">
                        {opp.signal}
                      </span>
                      <span className="text-xs font-black text-emerald-600 mt-1">
                        {opp.upside}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col gap-2 mt-1">
                    <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                      {opp.reason}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-[10px] font-bold text-slate-600">AI Confidence: <span className="text-slate-900">{opp.confidence}%</span></span>
                      </div>
                      {opp.targetPrice && (
                        <div className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-blue-500" />
                          <span className="text-[10px] font-bold text-slate-600">Target: <span className="text-slate-900">{opp.targetPrice}</span></span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">
                      Risk: {opp.risk}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setStockToSave(opp);
                          setShowSaveToWatchlistModal(true);
                        }}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-[10px] font-black text-slate-700 rounded-xl transition cursor-pointer flex items-center gap-1"
                      >
                        <Bookmark className="w-3.5 h-3.5" /> Save
                      </button>
                      <button 
                        onClick={() => {
                          if (onSelectResearch) onSelectResearch({ symbol: opp.symbol, company: opp.company });
                        }}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-[10px] font-black text-white rounded-xl transition cursor-pointer flex items-center gap-1 shadow-xs"
                      >
                        Explore <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-xs flex flex-col gap-5 h-[380px]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-blue-600" />
              <div>
                <h3 className="text-base font-black text-slate-900 leading-tight">Highly Profitable Stocks</h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 flex-1 overflow-y-auto pr-1 content-start">
            {marketOverview.map((idx: any) => (
              <div key={idx.name} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase">{idx.name}</span>
                <span className="text-xs font-black text-slate-900">{idx.value}</span>
                <span className={`text-[9px] font-bold ${idx.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {idx.change}
                </span>
                
                <svg className="w-full h-5 opacity-70 mt-1" viewBox="0 0 100 20">
                  <path
                    d={`M ${idx.sparkline.map((val: number, i: number) => `${(i / (idx.sparkline.length - 1)) * 100} ${20 - val}`).join(' L ')}`}
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

      <section className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-xs flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div>
            <h3 className="text-base font-black text-slate-900 leading-tight">Recent Activity & Orders</h3>
          </div>
        </div>

        {dynamicRecentActivities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dynamicRecentActivities.map((act: any, idx: number) => (
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
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <span className="text-sm font-bold text-slate-400">No recent activity to show</span>
          </div>
        )}
      </section>

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
                  onClick={async () => {
                    const trimmed = newWatchlistTitle.trim();
                    if (!trimmed) {
                      toast.error('Please enter a valid watchlist name');
                      return;
                    }
                    if (watchlists.some((w: any) => w.name === trimmed)) {
                      toast.error('A watchlist with this name already exists');
                      return;
                    }
                    const newWl = await watchlistService.createWatchlist(trimmed);
                    if (newWl) {
                      setWatchlistStocks((prev: any) => [...prev, newWl]);
                      setSelectedWatchlist(newWl);
                      setShowCreateWatchlistModal(false);
                      setNewWatchlistTitle('');
                      toast.success(`Created watchlist "${trimmed}"`);
                    } else {
                      toast.error('Failed to create watchlist');
                    }
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

      {/* SAVE TO WATCHLIST MODAL OVERLAY */}
      <AnimatePresence>
        {showSaveToWatchlistModal && stockToSave && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[28px] border border-slate-200 p-6 sm:p-8 max-w-sm w-full shadow-2xl flex flex-col gap-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-black text-base text-slate-900">Save to Watchlist</h3>
                  <span className="text-[10px] text-slate-400 font-bold">Select a watchlist for {stockToSave.symbol}</span>
                </div>
                <button 
                  onClick={() => setShowSaveToWatchlistModal(false)}
                  className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2">
                {watchlists.map(w => (
                  <button
                    key={w.id}
                    onClick={async () => {
                      const res = await watchlistService.addStockToWatchlist(w.id, stockToSave.symbol);
                      if (res) {
                        toast.success(`${stockToSave.symbol} saved to ${w.name}`);
                        setShowSaveToWatchlistModal(false);
                      } else {
                        toast.error(`Failed to save to ${w.name}`);
                      }
                    }}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition cursor-pointer flex items-center justify-between group"
                  >
                    <span className="text-sm font-bold text-slate-800 group-hover:text-blue-700">{w.name}</span>
                    <Plus className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default HomeDashboard;
