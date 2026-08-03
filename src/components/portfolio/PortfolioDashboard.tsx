
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Sparkles, PieChart, Activity, Wallet, AlertCircle,
  ArrowLeft, Search, Filter, ArrowUpDown, ChevronRight, Bookmark, Clock, CheckCircle2,
  Calendar, Star, Download, RefreshCw, Landmark, Heart, Info, ArrowUpRight, ArrowDownLeft, ArrowDownRight, X, ShieldCheck,
  BarChart3, FileText, Receipt, LayoutDashboard, LineChart, Layers
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import portfolioService from '../../services/portfolio.service';
import aiService from '../../services/ai.service';
import marketService from '../../services/market.service';
import toast from 'react-hot-toast';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

// ----------------------------------------------------
// MULTI-MONTH HISTORICAL PORTFOLIO DATASET
// ----------------------------------------------------
interface MonthData {
  overview: {
    value: number;
    todayPnL: number;
    todayPnLPerc: number;
    overallReturn: number;
    invested: number;
    cash: number;
  };
  chartData: { name: string; value: number }[];
  holdings: {
    symbol: string;
    companyName: string;
    logo: string;
    qty: number;
    avgPrice: number;
    cmp: number;
    todayPnL: number;
    overallReturn: number;
    currentValue: number;
    weight: number;
    risk: string;
    ai: string;
    sparkline: number[];
    notes: string;
    timeline: { date: string; type: string; qty: number; price: number }[];
    dividends: { date: string; amount: number }[];
  }[];
  allocation: { name: string; value: number; color: string }[];
  sectors: { name: string; value: number; color: string }[];
  performance: {
    dailyReturn: number;
    monthlyReturn: number;
    yearlyReturn: number;
    sinceInception: number;
    niftyComparison: number;
    bestPerformer: { symbol: string; change: number; sector: string };
    worstPerformer: { symbol: string; change: number; sector: string };
    realisedGains: number;
    unrealisedGains: number;
    dividendYTD: number;
  };
  transactions: {
    id: string;
    type: 'Buy' | 'Sell' | 'SIP' | 'Dividend' | 'Bonus' | 'Deposit' | 'Withdrawal';
    symbol: string;
    name: string;
    qty: number;
    price: number;
    total: number;
    date: string;
    time: string;
  }[];
  aiInsights: {
    healthScore: number;
    diversification: string;
    riskLevel: string;
    topOpportunity: string;
    biggestRisk: string;
    suggestedAction: string;
    expectedImprovement: string;
    analysisText: string;
  };
}

const createEmptyMonthData = (): MonthData => ({
  overview: { value: 0, todayPnL: 0, todayPnLPerc: 0, overallReturn: 0, invested: 0, cash: 0 },
  chartData: [{ name: 'Jul 2026', value: 0 }],
  holdings: [],
  allocation: [],
  sectors: [],
  performance: {
    dailyReturn: 0, monthlyReturn: 0, yearlyReturn: 0, sinceInception: 0, niftyComparison: 0,
    bestPerformer: { symbol: '--', change: 0, sector: '--' },
    worstPerformer: { symbol: '--', change: 0, sector: '--' },
    realisedGains: 0, unrealisedGains: 0, dividendYTD: 0
  },
  transactions: [],
  aiInsights: {
    healthScore: 0, diversification: 'Awaiting Data', riskLevel: 'Unrated',
    topOpportunity: '--', biggestRisk: '--',
    suggestedAction: 'Awaiting backend broker integration or user trade execution.',
    expectedImprovement: '--',
    analysisText: 'No portfolio holdings recorded. Connect your broker account or execute trades to begin.'
  }
});

const HISTORICAL_DATA: Record<string, MonthData> = {
  'Jan 2026': createEmptyMonthData(),
  'Feb 2026': createEmptyMonthData(),
  'Mar 2026': createEmptyMonthData(),
  'Apr 2026': createEmptyMonthData(),
  'May 2026': createEmptyMonthData(),
  'Jun 2026': createEmptyMonthData(),
  'Jul 2026': createEmptyMonthData(),
};

const TIMELINE_MONTHS = ['Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026'];

interface PortfolioDashboardProps {
  onTrade?: (tradeIntent: any) => void;
  onSelectResearch?: (research: any) => void;
}

export const PortfolioDashboard: React.FC<PortfolioDashboardProps> = ({ onTrade, onSelectResearch }) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('Jul 2026');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [holdingsFilter, setHoldingsFilter] = useState<'ALL' | 'GAINS' | 'LOSSES'>('ALL');
  const [sortField, setSortField] = useState<string>('weight');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeHoldingDetail, setActiveHoldingDetail] = useState<any | null>(null);

  const { data: realPortfolio, isLoading: isPortfolioLoading, refetch: refetchPortfolio } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => portfolioService.getPortfolio(),
  });

  const { data: aiPortfolioData, isLoading: isAiLoading } = useQuery({
    queryKey: ['aiPortfolio'],
    queryFn: () => aiService.analyzePortfolio(),
  });

  const [liveQuotes, setLiveQuotes] = useState<Record<string, any>>({});

  useEffect(() => {
    if (realPortfolio && realPortfolio.holdings.length > 0) {
      const symbols = realPortfolio.holdings.map((h: any) => h.symbol);
      marketService.getBatchQuotes(symbols).then((quotes) => {
        setLiveQuotes(quotes || {});
      }).catch((err) => {
        console.error("Failed to fetch live quotes for portfolio:", err);
      });
    }
  }, [realPortfolio]);

  const refetch = () => { refetchPortfolio(); };

  // Dynamic portfolio recalculation helper based on real backend data
  const data: MonthData = useMemo(() => {
    const base = createEmptyMonthData();
    if (realPortfolio) {
      base.overview.invested = realPortfolio.total_invested;
      base.overview.cash = realPortfolio.cash_balance;

      let totalCurrentValue = realPortfolio.cash_balance;
      let totalInvested = 0;
      let totalTodayPnL = 0;

      base.holdings = realPortfolio.holdings.map((h: any) => {
        const invested = h.quantity * h.average_buy_price;
        const livePrice = liveQuotes[h.symbol]?.lastPrice || h.average_buy_price;
        const changePercent = liveQuotes[h.symbol]?.changePercent || 0;
        const currentValue = h.quantity * livePrice;
        
        totalInvested += invested;
        totalCurrentValue += currentValue;
        
        const overallReturn = invested > 0 ? ((currentValue - invested) / invested) * 100 : 0;
        const todayPnL = h.quantity * (liveQuotes[h.symbol]?.change || 0);
        totalTodayPnL += todayPnL;

        const weight = realPortfolio.current_value ? (invested / realPortfolio.current_value) * 100 : 0;
        return {
          symbol: h.symbol,
          companyName: h.symbol,
          logo: h.symbol.substring(0, 2),
          qty: h.quantity,
          avgPrice: h.average_buy_price,
          cmp: livePrice, // Uses actual live quote!
          todayPnL: todayPnL,
          overallReturn: overallReturn,
          currentValue: currentValue,
          weight: parseFloat(weight.toFixed(1)),
          risk: 'Low',
          ai: 'HOLD',
          sparkline: [h.average_buy_price, livePrice],
          notes: 'Synced from backend.',
          timeline: [],
          dividends: []
        };
      });

      // Recalculate portfolio overview based on live prices
      base.overview.invested = totalInvested;
      base.overview.value = totalCurrentValue;
      base.overview.todayPnL = totalTodayPnL;
      
      const unrealizedPnL = totalCurrentValue - totalInvested - realPortfolio.cash_balance;
      base.overview.overallReturn = totalInvested > 0 ? (unrealizedPnL / totalInvested) * 100 : 0;
      
      // Calculate today's PNL % based on yesterday's value (approx)
      const yesterdayValue = (totalCurrentValue - realPortfolio.cash_balance) - totalTodayPnL;
      base.overview.todayPnLPerc = yesterdayValue > 0 ? (totalTodayPnL / yesterdayValue) * 100 : 0;

      base.chartData = [
        { name: 'Start', value: base.overview.invested },
        { name: 'Current', value: base.overview.value }
      ];
    }

    if (aiPortfolioData) {
      base.aiInsights = {
        healthScore: aiPortfolioData.health_score,
        diversification: aiPortfolioData.overall_health,
        riskLevel: 'Moderate', // Backend doesn't provide this currently
        topOpportunity: aiPortfolioData.top_performers.join(', ') || '--',
        biggestRisk: aiPortfolioData.weak_performers.join(', ') || '--',
        suggestedAction: aiPortfolioData.recommended_actions.join(', ') || '--',
        expectedImprovement: '--',
        analysisText: aiPortfolioData.detailed_analysis,
      };
    }

    return base;
  }, [realPortfolio, aiPortfolioData, liveQuotes]);

  const isReloading = isPortfolioLoading || isAiLoading;

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('10000');
  const [withdrawAmount, setWithdrawAmount] = useState('10000');

  // Deposit handler
  const handleDeposit = async (amountVal: number) => {
    try {
      await portfolioService.depositFunds(amountVal);
      toast.success(`₹${amountVal.toLocaleString()} added to Available Cash successfully!`);
      setShowDepositModal(false);
      refetch();
    } catch (error) {
      toast.error('Failed to deposit funds.');
    }
  };

  // Withdraw handler
  const handleWithdraw = (amountVal: number) => {
    const cashAvailable = realPortfolio?.cash_balance || 0;
    if (amountVal > cashAvailable) {
      toast.error('Insufficient available cash balance for withdrawal.');
      return;
    }
    // In a real app, this would call a backend endpoint
    toast.success(`₹${amountVal.toLocaleString()} withdrawn to bank account successfully!`);
    setShowWithdrawModal(false);
    refetch();
  };

  // Execute Rebalance handler
  const handleExecuteRebalance = () => {
    // In a real app, this would trigger multiple backend trades
    toast.success('AI Portfolio Rebalance executed successfully!');
    setShowRebalanceModal(false);
    refetch();
  };

  // We are not tracking historical states anymore since we pull directly from backend.
  // data is now memoized from realPortfolio.

  // Formatters
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Handle rebalance recommendation action
  const handleRebalance = () => {
    toast.success('AI Rebalance execution payload sent to order management dashboard');
  };

  const handleExport = (type: string) => {
    const toastId = toast.loading(`Generating SEBI-compliant ${type}...`);
    setTimeout(() => {
      toast.success(`${type} downloaded successfully!`, { id: toastId });
      
      // Simulating immediate file download setup
      try {
        const link = document.createElement('a');
        link.href = 'data:application/pdf;base64,JVBERi0xLjQKJcFSnaerCg=='; // Minimal dummy PDF content
        link.setAttribute('download', `${type.toLowerCase().replace(/\s+/g, '_')}_FY25_26.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (e) {
        console.error(e);
      }
    }, 1500);
  };

  // Sort and Filter Holdings
  const sortedAndFilteredHoldings = useMemo(() => {
    let list = [...data.holdings];

    // Search filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(h => h.symbol.toLowerCase().includes(q) || h.companyName.toLowerCase().includes(q));
    }

    // Performance filter
    if (holdingsFilter === 'GAINS') {
      list = list.filter(h => h.overallReturn >= 0);
    } else if (holdingsFilter === 'LOSSES') {
      list = list.filter(h => h.overallReturn < 0);
    }

    // Sort
    list.sort((a: any, b: any) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Calculate return value fallback if sorting by return
      if (sortField === 'return') {
        aVal = a.overallReturn;
        bVal = b.overallReturn;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [data.holdings, searchQuery, holdingsFilter, sortField, sortDirection]);

  // Handle Sort Toggle
  const requestSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  if (isReloading) {
    return (
      <div className="w-full flex flex-col gap-10 font-sans text-slate-800 pb-20 animate-in fade-in duration-300">
        {/* Skeleton Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 animate-pulse">
          <div className="bg-white border border-slate-200 rounded-[32px] p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div className="w-32 h-4 bg-slate-200 rounded" />
              <div className="w-20 h-3 bg-slate-200 rounded" />
            </div>
            <LoadingSkeleton variant="Chart" />
          </div>
          <div className="bg-[#0F172A] border border-slate-800 rounded-[32px] p-6 sm:p-8 flex flex-col gap-6">
            <div className="w-24 h-4 bg-slate-800 rounded" />
            <div className="w-48 h-8 bg-slate-800 rounded mt-2" />
            <div className="flex flex-col gap-4 mt-6">
              <div className="w-full h-12 bg-slate-800 rounded-xl" />
              <div className="w-full h-12 bg-slate-800 rounded-xl" />
            </div>
          </div>
        </div>
        
        {/* Skeleton Holdings Table */}
        <div className="bg-white border border-slate-200 rounded-[32px] p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex justify-between">
            <div className="w-40 h-5 bg-slate-200 rounded" />
            <div className="w-24 h-8 bg-slate-200 rounded-xl" />
          </div>
          <div className="flex flex-col gap-3.5">
            <LoadingSkeleton variant="TableRow" count={4} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-10 font-sans text-slate-800 pb-20 animate-in fade-in duration-500">


      {/* ----------------------------------------------------
          1. PORTFOLIO OVERVIEW (HERO)
          ---------------------------------------------------- */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

        {/* Growth Chart */}
        <div className="bg-white border border-slate-200 rounded-[32px] p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-blue-600" />
              <h2 className="text-sm font-black text-[#0F172A] uppercase tracking-wider">Growth Trajectory</h2>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Growth vs Index</span>
          </div>

          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }} tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} dx={-10} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontSize: '12px', fontWeight: 700 }}
                  itemStyle={{ color: '#0F172A' }}
                />
                <Area type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wealth Snapshot metrics panel */}
        <div className="bg-[#0F172A] text-white border border-slate-800 rounded-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex flex-col gap-6">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Portfolio Value</span>
              <span className="text-3xl font-black text-white leading-none tracking-tight block">
                {formatINR(data.overview.value)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block mb-0.5">Today's P&L</span>
                <span className={`text-sm font-black flex items-center gap-0.5 ${data.overview.todayPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {data.overview.todayPnL >= 0 ? '+' : ''}{formatINR(data.overview.todayPnL)} ({data.overview.todayPnLPerc}%)
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block mb-0.5">Overall Return</span>
                <span className="text-sm font-black text-emerald-400">+{data.overview.overallReturn}%</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block mb-0.5">Invested</span>
                <span className="text-xs font-black text-slate-200">{formatINR(data.overview.invested)}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block mb-0.5">Available Cash</span>
                <span className="text-xs font-black text-slate-200">{formatINR(data.overview.cash)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 mt-6 border-t border-white/10 pt-4">
            <button
              onClick={() => setShowDepositModal(true)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black cursor-pointer transition text-center"
            >
              Add Funds
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl text-[11px] font-bold cursor-pointer transition text-center"
              >
                Withdraw
              </button>
              <button
                onClick={() => setShowExportModal(true)}
                className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl text-[11px] font-bold cursor-pointer transition text-center"
              >
                Export statement
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* ----------------------------------------------------
          2. HOLDINGS LIST SECTION
          ---------------------------------------------------- */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Star className="w-4.5 h-4.5 text-blue-600 fill-blue-600" />
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">Holdings</h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                placeholder="Search holdings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-500 transition shadow-xs"
              />
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl">
              {(['ALL', 'GAINS', 'LOSSES'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setHoldingsFilter(opt)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${holdingsFilter === opt ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-white border border-slate-200 rounded-[28px] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-wider">Company</th>
                  <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Quantity</th>
                  <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Avg Price</th>
                  <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Current Price</th>
                  <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Today's P&L</th>
                  <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Total Return</th>
                  <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Current Value</th>
                  <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Weight</th>
                  <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                {sortedAndFilteredHoldings.map((h) => {
                  const investedCost = h.qty * h.avgPrice;
                  const currentTotal = h.qty * h.cmp;
                  const totalReturnAmount = currentTotal - investedCost;
                  const returnPercentage = (totalReturnAmount / investedCost) * 100;

                  return (
                    <tr key={h.symbol} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-black text-xs shrink-0">
                            {h.logo}
                          </div>
                          <div>
                            <span className="font-black text-slate-900 block">{h.symbol}</span>
                            <span className="text-[10px] text-slate-400 block">{h.companyName}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right font-black text-slate-900">{h.qty}</td>
                      <td className="py-4 px-6 text-right text-slate-600">₹{h.avgPrice.toLocaleString()}</td>
                      <td className="py-4 px-6 text-right text-slate-900 font-bold">₹{h.cmp.toLocaleString()}</td>
                      <td className={`py-4 px-6 text-right font-bold ${h.todayPnL >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {h.todayPnL >= 0 ? '+' : ''}₹{h.todayPnL.toLocaleString()}
                      </td>
                      <td className={`py-4 px-6 text-right font-black ${totalReturnAmount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {totalReturnAmount >= 0 ? '+' : ''}{returnPercentage.toFixed(2)}%
                      </td>
                      <td className="py-4 px-6 text-right text-slate-900 font-black">₹{currentTotal.toLocaleString()}</td>
                      <td className="py-4 px-6 text-right text-slate-600 font-bold">{h.weight}%</td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setActiveHoldingDetail(h)}
                          className="text-[10px] font-black text-blue-600 hover:text-blue-700 cursor-pointer"
                        >
                          View Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {sortedAndFilteredHoldings.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400 font-bold text-xs">
                      No holdings found matching filter terms
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          3. ALLOCATION SECTION
          ---------------------------------------------------- */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Asset Classes Donut */}
        <div className="bg-white border border-slate-200 rounded-[32px] p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-6 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-blue-600" /> Asset Class Allocation
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="w-44 h-44 relative shrink-0">
              <ResponsiveContainer width="99%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={data.allocation}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.allocation.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col select-none">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Assets</span>
                <span className="text-sm font-black text-slate-900">{data.allocation.length} Types</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 w-full text-xs font-bold text-slate-600">
              {data.allocation.map((alloc) => (
                <div key={alloc.name} className="flex items-center justify-between border-b border-slate-50 pb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: alloc.color }} />
                    <span className="text-slate-900">{alloc.name}</span>
                  </div>
                  <span>{alloc.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sector Allocation */}
        <div className="bg-white border border-slate-200 rounded-[32px] p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" /> Sector Exposure
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="w-44 h-44 relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={data.sectors}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.sectors.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col select-none">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Concentration</span>
                <span className="text-sm font-black text-slate-900">{data.sectors[0]?.name}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 w-full text-xs font-bold text-slate-600">
              {data.sectors.map((sec) => (
                <div key={sec.name} className="flex items-center justify-between border-b border-slate-50 pb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sec.color }} />
                    <span className="text-slate-900">{sec.name}</span>
                  </div>
                  <span>{sec.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* ----------------------------------------------------
          4. PERFORMANCE KPIS SECTION
          ---------------------------------------------------- */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Landmark className="w-4.5 h-4.5 text-blue-600" />
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">Performance Analysis</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Daily Return', value: `${data.performance.dailyReturn >= 0 ? '+' : ''}${data.performance.dailyReturn}%`, desc: 'VS NIFTY 50' },
            { label: 'Monthly Return', value: `+${data.performance.monthlyReturn}%`, desc: 'Overall month gains' },
            { label: 'Yearly return', value: `+${data.performance.yearlyReturn}%`, desc: 'YTD Growth rate' },
            { label: 'Alpha Generated', value: `+${(data.performance.sinceInception - data.performance.niftyComparison).toFixed(1)}%`, desc: 'Returns above index' }
          ].map((card, i) => (
            <div key={i} className="bg-white border border-slate-200 p-5 rounded-[22px] shadow-xs">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">{card.label}</span>
              <span className="text-lg font-black text-slate-900 block">{card.value}</span>
              <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">{card.desc}</span>
            </div>
          ))}
        </div>

        {/* Highlights: Best vs Worst, realised vs unrealised */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-emerald-50 border border-emerald-100 rounded-[24px] p-5 flex flex-col justify-between min-h-[140px]">
            <div>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block mb-2">Best Performer</span>
              <span className="text-base font-black text-slate-900 block">{data.performance.bestPerformer.symbol}</span>
              <span className="text-[10px] text-slate-500 font-bold block mt-0.5">{data.performance.bestPerformer.sector}</span>
            </div>
            <span className="text-lg font-black text-emerald-600 flex items-center gap-0.5 mt-4">
              <ArrowUpRight className="w-5 h-5" /> +{data.performance.bestPerformer.change}%
            </span>
          </div>

          <div className="bg-rose-50 border border-rose-100 rounded-[24px] p-5 flex flex-col justify-between min-h-[140px]">
            <div>
              <span className="text-[10px] font-black text-rose-600 uppercase tracking-wider block mb-2">Worst Performer</span>
              <span className="text-base font-black text-slate-900 block">{data.performance.worstPerformer.symbol}</span>
              <span className="text-[10px] text-slate-500 font-bold block mt-0.5">{data.performance.worstPerformer.sector}</span>
            </div>
            <span className="text-lg font-black text-rose-600 flex items-center gap-0.5 mt-4">
              <ArrowDownRight className="w-5 h-5" /> {data.performance.worstPerformer.change}%
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-[24px] p-5 flex flex-col justify-between min-h-[140px]">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Dividends & Gains</span>
              <div className="flex flex-col gap-1 mt-2 text-xs font-bold text-slate-500">
                <div className="flex justify-between">
                  <span>Dividend Income</span>
                  <span className="text-slate-900 font-black">{formatINR(data.performance.dividendYTD)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Realised Gains</span>
                  <span className="text-slate-900 font-black">{formatINR(data.performance.realisedGains)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unrealised Gains</span>
                  <span className="text-emerald-600 font-black">{formatINR(data.performance.unrealisedGains)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          5. TRANSACTIONS TIMELINE SECTION
          ---------------------------------------------------- */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4.5 h-4.5 text-blue-600" />
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">Transactions Timeline</h2>
          </div>
          <button
            onClick={() => handleExport('Transaction statement')}
            className="text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export Statements
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-xs">
          <div className="flex flex-col divide-y divide-slate-100">
            {data.transactions.map((t) => {
              let tagColor = 'bg-slate-100 text-slate-600';
              if (t.type === 'Buy' || t.type === 'SIP' || t.type === 'Deposit') {
                tagColor = 'bg-emerald-50 text-emerald-700 border border-emerald-100';
              } else if (t.type === 'Sell' || t.type === 'Withdrawal') {
                tagColor = 'bg-rose-50 text-rose-700 border border-rose-100';
              } else if (t.type === 'Dividend' || t.type === 'Bonus') {
                tagColor = 'bg-blue-50 text-blue-700 border border-blue-100';
              }

              return (
                <div key={t.id} className="px-6 py-4 grid grid-cols-12 items-center gap-4 hover:bg-slate-50/50 transition">
                  {/* Date & Time */}
                  <div className="col-span-2 min-w-[85px] flex flex-col">
                    <span className="text-xs font-black text-slate-900">{t.date}</span>
                    <span className="text-[10px] text-slate-400 font-bold">{t.time}</span>
                  </div>

                  {/* Vertical Divider */}
                  <div className="col-span-1 flex justify-center">
                    <div className="h-8 w-px bg-slate-200" />
                  </div>

                  {/* Symbol & Name */}
                  <div className="col-span-4 flex flex-col justify-center">
                    <span className="text-xs font-black text-slate-900 block leading-tight">{t.symbol}</span>
                    <span className="text-[10px] text-slate-400 font-medium truncate block max-w-[200px] mt-0.5">{t.name}</span>
                  </div>

                  {/* Badge Tag */}
                  <div className="col-span-2 flex justify-start">
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wide text-center shrink-0 min-w-[70px] ${tagColor}`}>
                      {t.type}
                    </span>
                  </div>

                  {/* Pricing / Total */}
                  <div className="col-span-3 text-right flex flex-col justify-center">
                    {t.total > 0 ? (
                      <span className="text-xs font-black text-slate-900">{formatINR(t.total)}</span>
                    ) : (
                      <span className="text-xs font-black text-slate-400">-</span>
                    )}
                    {t.qty > 0 && (
                      <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{t.qty} shares @ {formatINR(t.price)}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          6. AI PORTFOLIO INSIGHTS
          ---------------------------------------------------- */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4.5 h-4.5 text-blue-600" />
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">AI Portfolio Insights</h2>
        </div>

        <div className="bg-white border border-blue-100 rounded-[32px] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-48 h-48 bg-blue-50/20 rounded-full blur-[80px] pointer-events-none" />

          <div className="max-w-xl flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-xl">
                Portfolio Health Score: {data.aiInsights.healthScore}%
              </span>
              <span className="text-xs font-bold text-slate-400">Risk Assessment: <strong className="text-slate-900 font-black">{data.aiInsights.riskLevel}</strong></span>
            </div>

            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
              {data.aiInsights.suggestedAction}
            </h3>

            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              {data.aiInsights.analysisText} Top sector opportunities exist in <strong>{data.aiInsights.topOpportunity}</strong> while your biggest segment risk is <strong>{data.aiInsights.biggestRisk}</strong>.
            </p>

            <div className="flex gap-4 text-xs font-bold text-slate-400">
              <div>Diversification: <strong className="text-slate-900">{data.aiInsights.diversification}</strong></div>
              <div>Expected Yield Improvement: <strong className="text-emerald-600">{data.aiInsights.expectedImprovement} p.a.</strong></div>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0 w-full md:w-60">
            <button
              onClick={() => setShowAnalysisModal(true)}
              className="w-full py-3.5 bg-[#0F172A] hover:bg-slate-900 text-white font-black text-xs rounded-xl shadow-xs transition cursor-pointer text-center"
            >
              View Full Analysis
            </button>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          7. REPORTS LIST
          ---------------------------------------------------- */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <Download className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 leading-tight">Statements & Tax Reports</h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SEBI Compliant • FY 2025-26</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-3 py-1.5 rounded-full">6 Reports Available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {([
            { name: 'Holdings Statement', desc: 'Current portfolio snapshot with all open positions', Icon: BarChart3, color: 'blue', iconBg: 'bg-blue-100', iconText: 'text-blue-600' },
            { name: 'Capital Gains', desc: 'Short-term & long-term gains for ITR filing', Icon: TrendingUp, color: 'emerald', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600' },
            { name: 'Tax Report', desc: 'Tax liability summary for securities traded', Icon: Receipt, color: 'violet', iconBg: 'bg-violet-100', iconText: 'text-violet-600' },
            { name: 'Transaction Statement', desc: 'Chronological log of all debit & credit entries', Icon: FileText, color: 'amber', iconBg: 'bg-amber-100', iconText: 'text-amber-600' },
            { name: 'Portfolio Summary', desc: 'Asset-wise allocation and performance digest', Icon: Layers, color: 'sky', iconBg: 'bg-sky-100', iconText: 'text-sky-600' },
            { name: 'P&L Report', desc: 'Realised & unrealised profit and loss breakdown', Icon: LineChart, color: 'rose', iconBg: 'bg-rose-100', iconText: 'text-rose-600' },
          ] as const).map((rep) => {
            const colorMap: Record<string, string> = {
              blue: 'border-blue-100 hover:border-blue-300 bg-gradient-to-br from-blue-50/40 to-white',
              emerald: 'border-emerald-100 hover:border-emerald-300 bg-gradient-to-br from-emerald-50/40 to-white',
              violet: 'border-violet-100 hover:border-violet-300 bg-gradient-to-br from-violet-50/40 to-white',
              amber: 'border-amber-100 hover:border-amber-300 bg-gradient-to-br from-amber-50/40 to-white',
              sky: 'border-sky-100 hover:border-sky-300 bg-gradient-to-br from-sky-50/40 to-white',
              rose: 'border-rose-100 hover:border-rose-300 bg-gradient-to-br from-rose-50/40 to-white',
            };
            const btnColorMap: Record<string, string> = {
              blue: 'bg-blue-600 hover:bg-blue-700',
              emerald: 'bg-emerald-600 hover:bg-emerald-700',
              violet: 'bg-violet-600 hover:bg-violet-700',
              amber: 'bg-amber-500 hover:bg-amber-600',
              sky: 'bg-sky-600 hover:bg-sky-700',
              rose: 'bg-rose-600 hover:bg-rose-700',
            };
            const { Icon } = rep;
            return (
              <div
                key={rep.name}
                className={`border rounded-[22px] p-5 cursor-pointer transition-all duration-200 group shadow-xs hover:shadow-md flex flex-col gap-4 ${colorMap[rep.color]}`}
                onClick={() => handleExport(rep.name)}
              >
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${rep.iconBg}`}>
                    <Icon className={`w-5 h-5 ${rep.iconText}`} strokeWidth={1.75} />
                  </div>
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider bg-white/80 border border-slate-200 px-2 py-0.5 rounded-full">PDF</span>
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <span className="font-black text-sm text-slate-900 leading-tight">{rep.name}</span>
                  <span className="text-[10px] text-slate-400 font-medium leading-relaxed">{rep.desc}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleExport(rep.name); }}
                  className={`w-full py-2.5 rounded-xl text-white font-black text-[11px] transition flex items-center justify-center gap-1.5 ${btnColorMap[rep.color]}`}
                >
                  <Download className="w-3.5 h-3.5" strokeWidth={2.5} /> Download Report
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ----------------------------------------------------
          PORTFOLIO DETAIL PAGE MODAL OVERLAY
          ---------------------------------------------------- */}
      {/* DEPOSIT MODAL */}
      <AnimatePresence>
        {showDepositModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[28px] border border-slate-200 p-6 sm:p-8 max-w-sm w-full shadow-2xl flex flex-col gap-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-base text-[#0F172A]">Deposit Wealth Funds</h3>
                <button onClick={() => setShowDepositModal(false)} className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-4 text-xs font-bold text-slate-500">
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Deposit Amount (₹)</label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-black text-sm outline-none"
                    placeholder="Enter amount"
                  />
                </div>
                <div className="flex gap-2">
                  {['5000', '10000', '25000', '50000'].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setDepositAmount(amt)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[10px] text-slate-700 cursor-pointer"
                    >
                      +₹{Number(amt).toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleDeposit(Number(depositAmount || 0))}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition cursor-pointer"
              >
                Complete Deposit
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WITHDRAW MODAL */}
      <AnimatePresence>
        {showWithdrawModal && (() => {
          const withdrawableBalance = Math.max(0, Math.floor(data.overview.cash * 0.8));
          const unsettledBalance = data.overview.cash - withdrawableBalance;
          
          return (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[28px] border border-slate-200 p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-6"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-black text-base text-[#0F172A]">Withdraw to Bank</h3>
                  <button onClick={() => setShowWithdrawModal(false)} className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-4 text-xs font-bold text-slate-500">
                  {/* Balances Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <span className="text-[9px] text-slate-400 uppercase block mb-1">Total Balance</span>
                      <span className="text-slate-950 font-black text-sm">₹{data.overview.cash.toLocaleString()}</span>
                    </div>
                    <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                      <span className="text-[9px] text-blue-500 uppercase block mb-1">Withdrawable Cash</span>
                      <span className="text-blue-700 font-black text-sm">₹{withdrawableBalance.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Unsettled info */}
                  {unsettledBalance > 0 && (
                    <div className="p-3.5 bg-amber-50 border border-amber-100 text-amber-900 rounded-xl font-medium leading-relaxed">
                      <div className="flex items-center gap-1.5 font-bold mb-1">
                        <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Unsettled Funds: ₹{unsettledBalance.toLocaleString()}</span>
                      </div>
                      <span>Recent stock sales or profit payouts take **1 business day (T+1)** to settle before they can be withdrawn to your bank account.</span>
                    </div>
                  )}

                  {/* Amount Input */}
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 mb-1">Withdrawal Amount (₹)</label>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-black text-sm outline-none"
                      placeholder="Enter amount to withdraw"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    const amountVal = Number(withdrawAmount || 0);
                    if (amountVal <= 0) {
                      toast.error("Please enter a valid amount");
                      return;
                    }
                    if (amountVal > withdrawableBalance) {
                      toast.error("Withdrawal amount exceeds your withdrawable cash balance. T+1 settled funds are required.");
                      return;
                    }
                    handleWithdraw(amountVal);
                  }}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition cursor-pointer"
                >
                  Initiate Withdrawal
                </button>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>


      {/* EXPORT STATEMENTS MODAL */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[28px] border border-slate-200 p-6 sm:p-8 max-w-sm w-full shadow-2xl flex flex-col gap-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-base text-[#0F172A]">Export Statements</h3>
                <button onClick={() => setShowExportModal(false)} className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-3 text-xs font-bold text-slate-700">
                {[
                  'Portfolio Holdings Report',
                  'Capital Gains Tax Statement',
                  'Chronological Transaction Statement',
                  'P&L Performance Summary'
                ].map(item => (
                  <button
                    key={item}
                    onClick={() => {
                      handleExport(item);
                      setShowExportModal(false);
                    }}
                    className="w-full p-4 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl text-left flex justify-between items-center cursor-pointer"
                  >
                    <span>{item}</span>
                    <Download className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL PORTFOLIO HEALTH ANALYSIS MODAL */}
      <AnimatePresence>
        {showAnalysisModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-[32px] border border-slate-200 p-6 sm:p-8 max-w-lg w-full shadow-2xl flex flex-col gap-6 my-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-blue-600 animate-pulse animate-duration-1000" />
                  <div>
                    <h3 className="font-black text-base text-[#0F172A] leading-tight">AI Portfolio Health Audit</h3>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">SEBI Compliant Diagnostic Report</span>
                  </div>
                </div>
                <button onClick={() => setShowAnalysisModal(false)} className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Score Snapshot */}
              <div className="bg-gradient-to-r from-blue-900 to-[#0F172A] text-white p-5 rounded-2xl flex items-center justify-between shadow-md relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Overall Health Score</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-blue-400">{data.aiInsights.healthScore}%</span>
                    <span className="text-xs font-bold text-emerald-400">Excellent</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Demat Account Status</span>
                  <span className="text-xs font-mono font-bold bg-white/10 text-emerald-400 px-2 py-0.5 rounded border border-white/5">IN303028130</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 text-xs font-bold text-slate-500">
                
                {/* 1. Metric Breakdown */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Health Score Components</span>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                      <span className="text-[9px] text-slate-400 uppercase block mb-1">Sector Diversification</span>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-900 font-black">95/100</span>
                        <span className="text-[9px] text-emerald-600 font-black">Optimal</span>
                      </div>
                    </div>
                    <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                      <span className="text-[9px] text-slate-400 uppercase block mb-1">Asset Class Allocation</span>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-900 font-black">92/100</span>
                        <span className="text-[9px] text-emerald-600 font-black">Optimal</span>
                      </div>
                    </div>
                    <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                      <span className="text-[9px] text-slate-400 uppercase block mb-1">Average Stock Quality</span>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-900 font-black">94/100</span>
                        <span className="text-[9px] text-emerald-600 font-black">High-Grade</span>
                      </div>
                    </div>
                    <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                      <span className="text-[9px] text-slate-400 uppercase block mb-1">Dividend Yield Factor</span>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-900 font-black">88/100</span>
                        <span className="text-[9px] text-blue-600 font-black">Moderate</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Portfolio Risk Metrics */}
                <div className="flex flex-col gap-2.5 mt-2">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Risk & Volatility Ratios</span>
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                      <span className="text-[8px] text-slate-400 uppercase block mb-1">Beta Coefficient</span>
                      <span className="text-slate-900 font-black text-xs block">0.84</span>
                      <span className="text-[8px] text-emerald-600 block mt-0.5">Low Volatility</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                      <span className="text-[8px] text-slate-400 uppercase block mb-1">Sharpe Ratio</span>
                      <span className="text-slate-900 font-black text-xs block">1.95</span>
                      <span className="text-[8px] text-emerald-600 block mt-0.5">High Efficiency</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                      <span className="text-[8px] text-slate-400 uppercase block mb-1">Max Drawdown</span>
                      <span className="text-rose-600 font-black text-xs block">-12.4%</span>
                      <span className="text-[8px] text-slate-400 block mt-0.5">Well Hedged</span>
                    </div>
                  </div>
                </div>

                {/* 3. Diagnostic Text */}
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-950 rounded-2xl font-medium leading-relaxed mt-2 flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black block text-emerald-900 mb-0.5">AI Diagnostic Insight</span>
                    Your portfolio is currently optimized against major macroeconomic risks. Exposure to defensive sectors matches recommended asset targets.
                  </div>
                </div>

              </div>

              {/* Actions */}
              <button
                onClick={() => {
                  toast.success('Downloading Health Audit Report PDF...');
                  setShowAnalysisModal(false);
                }}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Complete PDF Audit
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeHoldingDetail && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-white max-w-lg w-full h-full p-8 shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div className="flex flex-col gap-8">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveHoldingDetail(null)}
                      className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition cursor-pointer"
                    >
                      <ArrowLeft className="w-4.5 h-4.5" />
                    </button>
                    <div>
                      <h3 className="font-black text-lg text-slate-900 leading-tight">
                        {activeHoldingDetail.symbol}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-bold block">{activeHoldingDetail.companyName}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black px-2.5 py-1 rounded bg-blue-50 text-blue-700 uppercase`}>
                    AI Recommendation: {activeHoldingDetail.ai}
                  </span>
                </div>

                {/* Performance Snapshot */}
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Holding Performance</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Current Value</span>
                      <span className="text-base font-black text-slate-900">
                        ₹{(activeHoldingDetail.qty * activeHoldingDetail.cmp).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Total Returns</span>
                      <span className={`text-base font-black ${activeHoldingDetail.overallReturn >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {activeHoldingDetail.overallReturn >= 0 ? '+' : ''}{activeHoldingDetail.overallReturn}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Summary Notes */}
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Holding Summary</span>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    {activeHoldingDetail.notes}
                  </p>
                </div>

                {/* Investment timeline */}
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-3">Investment Timeline</span>
                  <div className="flex flex-col gap-2.5">
                    {activeHoldingDetail.timeline.map((event: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-50/50 p-3 rounded-xl border border-slate-100 text-xs font-semibold">
                        <div>
                          <span className="text-slate-900 block">{event.type} shares</span>
                          <span className="text-[9px] text-slate-400 block font-bold mt-0.5">{event.date}</span>
                        </div>
                        <span className="text-slate-600">{event.qty} Shares @ ₹{event.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dividend History */}
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-3">Dividend History</span>
                  <div className="flex flex-col gap-2.5">
                    {activeHoldingDetail.dividends.map((div: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-50/50 p-3 rounded-xl border border-slate-100 text-xs font-semibold">
                        <div>
                          <span className="text-slate-900 block">Payout Received</span>
                          <span className="text-[9px] text-slate-400 block font-bold mt-0.5">{div.date}</span>
                        </div>
                        <span className="text-emerald-600 font-black">+₹{div.amount}</span>
                      </div>
                    ))}
                    {activeHoldingDetail.dividends.length === 0 && (
                      <span className="text-[10px] text-slate-400 font-bold block">No dividends distributed for this period</span>
                    )}
                  </div>
                </div>

              </div>

              {/* Drawer actions */}
              <div className="flex items-center gap-3 border-t border-slate-100 pt-6">
                <button
                  onClick={() => {
                    if (onSelectResearch) {
                      onSelectResearch({
                        id: activeHoldingDetail.symbol,
                        symbol: activeHoldingDetail.symbol,
                        title: `Equity Advisory report: ${activeHoldingDetail.symbol}`,
                        company: activeHoldingDetail.companyName,
                        analyst: 'SEBI Registered Analyst',
                        time: 'Just Now',
                        rec: activeHoldingDetail.ai || 'HOLD'
                      });
                      setActiveHoldingDetail(null);
                    } else {
                      toast.success(`Showing advisory reports for ${activeHoldingDetail.symbol}`);
                    }
                  }}
                  className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer text-center"
                >
                  View Research
                </button>
                <button
                  onClick={() => {
                    if (onTrade) {
                      onTrade({
                        symbol: activeHoldingDetail.symbol,
                        company: activeHoldingDetail.companyName,
                        price: activeHoldingDetail.cmp,
                        rec: activeHoldingDetail.ai || 'BUY'
                      });
                      setActiveHoldingDetail(null);
                    } else {
                      toast.success(`Executing order payload for ${activeHoldingDetail.symbol}`);
                    }
                  }}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition cursor-pointer text-center"
                >
                  Trade Stock
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PortfolioDashboard;
