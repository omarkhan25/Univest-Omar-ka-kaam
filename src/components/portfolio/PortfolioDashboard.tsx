import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical, Sparkles, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  ShieldCheck, AlertTriangle, Plus, RotateCcw, ChevronRight, CheckCircle2,
  PieChart, Activity, BookOpen, Trophy, Info, Search, X, Check, ArrowRight,
  HelpCircle, Shield, Award, Calendar, Clock, Lock, RefreshCw, BarChart2, Layers,
  Coins, Zap, CheckCircle, Eye, Lightbulb, UserCheck, LayoutDashboard, Filter, MessageSquare, ArrowLeft,
  DollarSign, ArrowUp, ArrowDown, ShoppingCart, Minus
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import toast from 'react-hot-toast';

interface PortfolioDashboardProps {
  onSelectStock?: (stock: any) => void;
  onOpenPricingModal?: () => void;
}

// ----------------------------------------------------
// TOKEN HOLDINGS DATASET
// ----------------------------------------------------
const INITIAL_TOKEN_HOLDINGS = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    investedTokens: 25000,
    currentValueTokens: 28550,
    returnTokens: 3550,
    returnPercent: 14.20,
    isPositive: true,
    weight: 26.3,
    avgPrice: 2650.00,
    currentPrice: 3026.00,
    badgeBg: 'bg-emerald-100 text-emerald-800',
    initials: 'RE',
    sparkline: [2650, 2720, 2800, 2890, 3026],
    thesisReason: 'Long-Term Growth',
    thesisText: 'Strong earnings visibility, digital expansion via Jio, and refining margin leadership.',
    buyDate: '24 MAY 2026'
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    investedTokens: 20000,
    currentValueTokens: 21640,
    returnTokens: 1640,
    returnPercent: 8.20,
    isPositive: true,
    weight: 19.9,
    avgPrice: 3865.00,
    currentPrice: 4182.75,
    badgeBg: 'bg-purple-100 text-purple-800',
    initials: 'TC',
    sparkline: [3865, 3950, 4010, 4120, 4182.75],
    thesisReason: 'Strong Fundamentals',
    thesisText: 'Robust deal wins in cloud transformation and high dividend yields.',
    buyDate: '15 MAY 2026'
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    investedTokens: 15000,
    currentValueTokens: 16180,
    returnTokens: 1180,
    returnPercent: 7.87,
    isPositive: true,
    weight: 14.9,
    avgPrice: 1556.00,
    currentPrice: 1678.40,
    badgeBg: 'bg-sky-100 text-sky-800',
    initials: 'HD',
    sparkline: [1556, 1590, 1620, 1650, 1678.4],
    thesisReason: 'Undervalued',
    thesisText: 'Post-merger credit growth stabilization and net interest margin recovery.',
    buyDate: '10 MAY 2026'
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd.',
    investedTokens: 12000,
    currentValueTokens: 12480,
    returnTokens: 480,
    returnPercent: 4.00,
    isPositive: true,
    weight: 11.5,
    avgPrice: 1571.00,
    currentPrice: 1634.20,
    badgeBg: 'bg-pink-100 text-pink-800',
    initials: 'IN',
    sparkline: [1571, 1590, 1610, 1634.2],
    thesisReason: 'Sector Opportunity',
    thesisText: 'US IT spending rebound and generative AI enterprise integrations.',
    buyDate: '05 MAY 2026'
  },
  {
    symbol: 'XYZCORP',
    name: 'XYZ Emerging Tech Ltd.',
    investedTokens: 10000,
    currentValueTokens: 9160,
    returnTokens: -840,
    returnPercent: -8.40,
    isPositive: false,
    weight: 8.4,
    avgPrice: 420.00,
    currentPrice: 384.72,
    badgeBg: 'bg-rose-100 text-rose-800',
    initials: 'XY',
    sparkline: [420, 410, 395, 384.72],
    thesisReason: 'Momentum',
    thesisText: 'Testing smallcap momentum breakout thesis.',
    buyDate: '02 MAY 2026'
  }
];

// INITIAL CLOSED POSITIONS HISTORY
const INITIAL_CLOSED_POSITIONS = [
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd.',
    investedTokens: 15000,
    exitValueTokens: 17250,
    realizedReturnTokens: 2250,
    realizedReturnPercent: 15.00,
    isPositive: true,
    initials: 'IC',
    badgeBg: 'bg-blue-100 text-blue-800',
    buyDate: '12 APR 2026',
    exitDate: '18 MAY 2026',
    holdingDays: 36,
    thesisReason: 'Strong Fundamentals',
    sellReason: 'Target Reached',
    userSellNote: 'Reached expected target after strong Q4 earnings release.'
  }
];

// RECOMMENDED STOCKS FOR TOKEN INVESTMENTS
const RECOMMENDED_INVESTMENT_STOCKS = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    price: '2,975.80',
    change: '+2.35%',
    isPositive: true,
    initials: 'RE',
    badgeBg: 'bg-emerald-100 text-emerald-800',
    score: '78/100',
    sparkline: [2910, 2930, 2950, 2975.8]
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    price: '4,120.50',
    change: '+1.12%',
    isPositive: true,
    initials: 'TC',
    badgeBg: 'bg-purple-100 text-purple-800',
    score: '84/100',
    sparkline: [4080, 4100, 4110, 4120.5]
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd.',
    price: '1,680.40',
    change: '-0.48%',
    isPositive: false,
    initials: 'IN',
    badgeBg: 'bg-pink-100 text-pink-800',
    score: '72/100',
    sparkline: [1695, 1690, 1685, 1680.4]
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    price: '1,845.60',
    change: '+0.76%',
    isPositive: true,
    initials: 'HD',
    badgeBg: 'bg-sky-100 text-sky-800',
    score: '80/100',
    sparkline: [1830, 1838, 1842, 1845.6]
  },
  {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Passenger Vehicles',
    price: '985.40',
    change: '+3.14%',
    isPositive: true,
    initials: 'TM',
    badgeBg: 'bg-amber-100 text-amber-800',
    score: '86/100',
    sparkline: [950, 965, 978, 985.4]
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd.',
    price: '1,240.20',
    change: '+1.85%',
    isPositive: true,
    initials: 'IC',
    badgeBg: 'bg-blue-100 text-blue-800',
    score: '82/100',
    sparkline: [1215, 1225, 1232, 1240.2]
  }
];

// PERFORMANCE CHART DATASET
const LAB_PERFORMANCE_TIMEFRAMES: Record<string, Array<{ date: string; labTokens: number; nifty: number }>> = {
  '1W': [
    { date: 'Mon', labTokens: 105200, nifty: 103100 },
    { date: 'Tue', labTokens: 106100, nifty: 103800 },
    { date: 'Wed', labTokens: 107000, nifty: 104200 },
    { date: 'Thu', labTokens: 107800, nifty: 104800 },
    { date: 'Fri', labTokens: 108450, nifty: 105120 }
  ],
  '1M': [
    { date: 'Week 1', labTokens: 101200, nifty: 101000 },
    { date: 'Week 2', labTokens: 103400, nifty: 102100 },
    { date: 'Week 3', labTokens: 105800, nifty: 103500 },
    { date: 'Week 4', labTokens: 108450, nifty: 105120 }
  ],
  '3M': [
    { date: 'Mar', labTokens: 100000, nifty: 100000 },
    { date: 'Apr', labTokens: 102500, nifty: 101500 },
    { date: 'May', labTokens: 108450, nifty: 105120 }
  ],
  '6M': [
    { date: 'Dec', labTokens: 98000, nifty: 99000 },
    { date: 'Feb', labTokens: 102000, nifty: 101000 },
    { date: 'May', labTokens: 108450, nifty: 105120 }
  ],
  '1Y': [
    { date: 'May 24', labTokens: 100000, nifty: 100000 },
    { date: 'Nov 24', labTokens: 104000, nifty: 102500 },
    { date: 'May 25', labTokens: 108450, nifty: 105120 }
  ],
  'All': [
    { date: 'Jan', labTokens: 100000, nifty: 100000 },
    { date: 'Feb', labTokens: 101500, nifty: 101200 },
    { date: 'Mar', labTokens: 103200, nifty: 102400 },
    { date: 'Apr', labTokens: 105900, nifty: 103800 },
    { date: 'May', labTokens: 108450, nifty: 105120 }
  ]
};

export const PortfolioDashboard: React.FC<PortfolioDashboardProps> = ({
  onSelectStock,
  onOpenPricingModal
}) => {
  // Demo Mode Switcher (Active Premium vs Free Locked Preview)
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(true);
  const [showFirstTimeWelcome, setShowFirstTimeWelcome] = useState<boolean>(false);

  // EXACT 5 TAB NAVIGATION: Overview, Holdings, Performance, Insights, Decision Journal
  const [activeTab, setActiveTab] = useState<'Overview' | 'Holdings' | 'Performance' | 'Insights' | 'Journal'>('Overview');
  const [chartTimeframe, setChartTimeframe] = useState<string>('1M');
  const [holdingsFilter, setHoldingsFilter] = useState<string>('All Holdings');

  // Active Holdings & Closed Positions Datasets
  const [holdings, setHoldings] = useState(INITIAL_TOKEN_HOLDINGS);
  const [closedPositions, setClosedPositions] = useState(INITIAL_CLOSED_POSITIONS);
  const [availableTokens, setAvailableTokens] = useState<number>(28000);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState<boolean>(false);
  const [showLowBalanceWarning, setShowLowBalanceWarning] = useState<boolean>(false);

  // REDESIGNED BUY STOCK BY QUANTITY STATE
  const [modalSearchQuery, setModalSearchQuery] = useState<string>('');
  const [selectedStockForAdd, setSelectedStockForAdd] = useState<any>(null);
  const [sharesToBuy, setSharesToBuy] = useState<number>(10);
  const [selectedThesisReason, setSelectedThesisReason] = useState<string>('Long-Term Growth');
  const [thesisText, setThesisText] = useState<string>('');
  const [showFinalBuyConfirmation, setShowFinalBuyConfirmation] = useState<boolean>(false);

  // Stock Sale Wizard State
  const [selectedHoldingForSell, setSelectedHoldingForSell] = useState<any>(null);
  const [sellSharePercent, setSellSharePercent] = useState<number>(100);
  const [selectedSellReason, setSelectedSellReason] = useState<string>('Target Reached');
  const [userSellNote, setUserSellNote] = useState<string>('');

  // Token Metrics Calculations
  const totalInvestedTokens = holdings.reduce((acc, h) => acc + h.investedTokens, 0);
  const totalCurrentTokensValue = holdings.reduce((acc, h) => acc + h.currentValueTokens, 0);
  const totalLabTokens = totalCurrentTokensValue + availableTokens;
  const overallReturnTokens = totalCurrentTokensValue - totalInvestedTokens;
  const overallReturnPercent = totalInvestedTokens > 0 ? (overallReturnTokens / totalInvestedTokens) * 100 : 0;

  // Selected Stock Price & Affordable Shares Calculation
  const selectedPriceNumeric = parseFloat(selectedStockForAdd?.price?.replace(/,/g, '') || '2975.80');
  const totalRequiredTokens = Math.round(sharesToBuy * selectedPriceNumeric);
  const maxAffordableShares = Math.floor(availableTokens / selectedPriceNumeric);
  const isInsufficientTokens = totalRequiredTokens > availableTokens;

  // Filtered stocks in Modal Search
  const filteredModalStocks = RECOMMENDED_INVESTMENT_STOCKS.filter(st =>
    st.symbol.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
    st.name.toLowerCase().includes(modalSearchQuery.toLowerCase())
  );

  // Holdings Filter Handler
  const filteredHoldings = holdings.filter(h => {
    if (holdingsFilter === 'Gainers') return h.isPositive;
    if (holdingsFilter === 'Decliners') return !h.isPositive;
    return true;
  });

  // Open Buy Investment Modal
  const handleOpenInvestModal = (stock?: any) => {
    if (availableTokens < 1000 && !stock) {
      setShowLowBalanceWarning(true);
      return;
    }

    if (stock) {
      setSelectedStockForAdd(stock);
      const price = parseFloat(stock.price?.replace(/,/g, '') || '2975.80');
      const maxAff = Math.floor(availableTokens / price);
      setSharesToBuy(Math.max(1, Math.min(10, maxAff)));
    } else {
      setSelectedStockForAdd(null);
      setSharesToBuy(10);
    }
    setModalSearchQuery('');
    setShowFinalBuyConfirmation(false);
    setIsAddModalOpen(true);
  };

  // When stock is selected from search/recommended
  const handleSelectStockFromList = (st: any) => {
    setSelectedStockForAdd(st);
    const price = parseFloat(st.price?.replace(/,/g, '') || '2975.80');
    const maxAff = Math.floor(availableTokens / price);
    setSharesToBuy(Math.max(1, Math.min(10, maxAff)));
  };

  // Confirm Virtual Stock Purchase
  const handleConfirmVirtualInvestment = () => {
    if (sharesToBuy <= 0) {
      toast.error('Please enter at least 1 share.');
      return;
    }

    if (isInsufficientTokens) {
      toast.error('Insufficient UNIVEST Tokens for this share quantity.');
      return;
    }

    const newHolding = {
      symbol: selectedStockForAdd.symbol,
      name: selectedStockForAdd.name,
      investedTokens: totalRequiredTokens,
      currentValueTokens: totalRequiredTokens,
      returnTokens: 0,
      returnPercent: 0,
      isPositive: true,
      weight: parseFloat(((totalRequiredTokens / (totalCurrentTokensValue + totalRequiredTokens)) * 100).toFixed(1)),
      avgPrice: selectedPriceNumeric,
      currentPrice: selectedPriceNumeric,
      badgeBg: selectedStockForAdd.badgeBg || 'bg-emerald-100 text-emerald-800',
      initials: selectedStockForAdd.initials || selectedStockForAdd.symbol.slice(0, 2),
      sparkline: selectedStockForAdd.sparkline || [selectedPriceNumeric, selectedPriceNumeric],
      thesisReason: selectedThesisReason,
      thesisText: thesisText || 'Virtual share investment experiment.',
      buyDate: '26 AUG 2026'
    };

    setHoldings(prev => [newHolding, ...prev]);
    setAvailableTokens(prev => prev - totalRequiredTokens);
    setIsAddModalOpen(false);
    setSelectedStockForAdd(null);
    setShowFinalBuyConfirmation(false);
    setModalSearchQuery('');
    setThesisText('');
    toast.success(`Successfully bought ${sharesToBuy} shares of ${selectedStockForAdd.symbol} for ${totalRequiredTokens.toLocaleString('en-IN')} Tokens!`);
  };

  // Open Sell Modal
  const handleOpenSellModal = (holding: any) => {
    setSelectedHoldingForSell(holding);
    setSellSharePercent(100);
    setSelectedSellReason('Target Reached');
    setUserSellNote('');
    setIsSellModalOpen(true);
  };

  // Confirm Sale of Holding
  const handleConfirmSale = () => {
    if (!selectedHoldingForSell) return;

    const holding = selectedHoldingForSell;
    const saleFraction = sellSharePercent / 100;

    const saleValueTokens = Math.round(holding.currentValueTokens * saleFraction);
    const investedTokensSold = Math.round(holding.investedTokens * saleFraction);
    const realizedReturnTokens = saleValueTokens - investedTokensSold;
    const realizedReturnPercent = investedTokensSold > 0 ? (realizedReturnTokens / investedTokensSold) * 100 : 0;

    if (sellSharePercent === 100) {
      // FULL SALE (100% MAX)
      setHoldings(prev => prev.filter(h => h.symbol !== holding.symbol));
      
      const closedEntry = {
        symbol: holding.symbol,
        name: holding.name,
        investedTokens: holding.investedTokens,
        exitValueTokens: saleValueTokens,
        realizedReturnTokens: realizedReturnTokens,
        realizedReturnPercent: parseFloat(realizedReturnPercent.toFixed(2)),
        isPositive: realizedReturnTokens >= 0,
        initials: holding.initials,
        badgeBg: holding.badgeBg,
        buyDate: holding.buyDate || '24 MAY 2026',
        exitDate: '26 AUG 2026',
        holdingDays: 25,
        thesisReason: holding.thesisReason,
        sellReason: selectedSellReason,
        userSellNote: userSellNote || 'Position closed following target approach.'
      };

      setClosedPositions(prev => [closedEntry, ...prev]);
    } else {
      // PARTIAL SALE (< 100%)
      setHoldings(prev => prev.map(h => {
        if (h.symbol === holding.symbol) {
          const remainingInvested = h.investedTokens - investedTokensSold;
          const remainingCurrent = h.currentValueTokens - saleValueTokens;
          const remainingReturn = remainingCurrent - remainingInvested;
          const remainingReturnPct = remainingInvested > 0 ? (remainingReturn / remainingInvested) * 100 : 0;

          return {
            ...h,
            investedTokens: remainingInvested,
            currentValueTokens: remainingCurrent,
            returnTokens: remainingReturn,
            returnPercent: parseFloat(remainingReturnPct.toFixed(2)),
            isPositive: remainingReturn >= 0
          };
        }
        return h;
      }));
    }

    setAvailableTokens(prev => prev + saleValueTokens);
    setIsSellModalOpen(false);
    setSelectedHoldingForSell(null);

    toast.success(`Sold ${sellSharePercent}% of ${holding.symbol}! ${saleValueTokens.toLocaleString('en-IN')} UNIVEST Tokens returned to available balance.`);
  };

  // ====================================================
  // LOCKED PREVIEW STATE FOR NON-PREMIUM USERS
  // ====================================================
  if (!isPremiumUser) {
    return (
      <div className="space-y-6 pb-16 font-sans text-[#172033]">
        
        {/* Demo Mode Banner */}
        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-center justify-between text-xs text-amber-900 font-bold">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" />
            <span>Demonstrating Locked State for Free Users</span>
          </div>
          <button
            onClick={() => { setIsPremiumUser(true); setShowFirstTimeWelcome(true); }}
            className="px-3 py-1 bg-[#15519D] text-white rounded-xl text-xs font-black hover:bg-[#123B63] transition cursor-pointer"
          >
            Switch to Premium Mode →
          </button>
        </div>

        {/* Locked Hero Banner */}
        <div className="bg-gradient-to-br from-[#123B63] via-[#15519D] to-[#0E2A47] rounded-[28px] p-8 md:p-12 text-white shadow-xl relative overflow-hidden text-center space-y-6">
          <div className="flex items-center justify-center gap-2 bg-amber-400/20 text-amber-300 px-4 py-1.5 rounded-full text-xs font-extrabold w-fit mx-auto border border-amber-400/30">
            <Coins className="w-4 h-4 fill-current" />
            <span>UNIVEST PRO FEATURE</span>
          </div>

          <div className="space-y-2 max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              INVESTMENT LAB
            </h1>
            <p className="text-xl font-black text-amber-300">
              Learn investing by doing it.
            </p>
            <p className="text-sm text-blue-100 font-medium leading-relaxed max-w-xl mx-auto">
              Test your investment ideas using <strong className="text-white font-black">1,00,000 virtual UNIVEST Tokens</strong>. Research, invest with tokens, track decisions, receive AI feedback, and become a better investor.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenPricingModal}
              className="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-5 h-5 fill-current" />
              <span>Unlock Investment Lab</span>
            </button>
            <p className="text-xs text-blue-200 font-medium mt-3">
              Get 1,00,000 virtual UNIVEST Tokens and start testing your investment ideas.
            </p>
          </div>
        </div>

      </div>
    );
  }

  // ====================================================
  // ACTIVE PREMIUM USER EXPERIENCE
  // ====================================================
  return (
    <div className="space-y-6 pb-16 font-sans text-[#172033]">
      
      {/* Demo State Switcher Bar */}
      <div className="bg-blue-50/80 border border-blue-200/80 p-3 rounded-2xl flex items-center justify-between text-xs text-blue-900 font-extrabold">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#15519D]" />
          <span>Active Premium Mode — Tokenized Investment Lab</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFirstTimeWelcome(true)}
            className="px-3 py-1 bg-white hover:bg-slate-50 text-[#15519D] border border-blue-200 rounded-xl text-[11px] font-black transition cursor-pointer"
          >
            Re-open Welcome Onboarding →
          </button>
          <button
            onClick={() => setIsPremiumUser(false)}
            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-[11px] font-extrabold transition cursor-pointer"
          >
            Preview Locked State
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. EXACT 5 TAB SEGMENTED NAVIGATION CONTAINER */}
      {/* ==================================================== */}
      <div className="bg-white p-2 rounded-[24px] border border-[#E2E8F0] shadow-2xs flex items-center gap-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'Overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'Holdings', label: 'Holdings', icon: <PieChart className="w-4 h-4" /> },
          { id: 'Performance', label: 'Performance', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'Insights', label: 'Insights', icon: <Sparkles className="w-4 h-4" /> },
          { id: 'Journal', label: 'Decision Journal', icon: <BookOpen className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 min-w-[130px] py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#15519D] text-white shadow-md shadow-blue-900/20'
                : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ==================================================== */}
      {/* TAB 1: OVERVIEW PAGE */}
      {/* ==================================================== */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          
          {/* Top Hero Banner */}
          <div className="bg-gradient-to-br from-[#123B63] via-[#15519D] to-[#0E2A47] rounded-[28px] p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 z-10 max-w-xl">
              <div className="flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3.5 py-1 rounded-full text-xs font-extrabold w-fit border border-amber-400/30">
                <Coins className="w-4 h-4 fill-current" />
                <span>UNIVEST INVESTMENT LAB</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-snug">
                Test your investment thinking.
              </h1>
              <p className="text-xs md:text-sm text-blue-100 font-medium leading-relaxed">
                Manage your <strong className="text-amber-300 font-black">1,00,000 UNIVEST Tokens</strong>. Select share quantities, buy stocks, and track real market performance.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 z-10 w-full md:w-auto">
              <button
                onClick={() => handleOpenInvestModal()}
                className="px-6 py-3.5 bg-white text-[#15519D] hover:bg-blue-50 text-xs font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Invest Tokens</span>
              </button>

              <button
                onClick={() => setActiveTab('Holdings')}
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-amber-300" />
                <span>Sell Holdings →</span>
              </button>
            </div>
          </div>

          {/* Connected Portfolio Summary Card */}
          <div className="bg-white p-6 md:p-7 rounded-[28px] border border-[#E2E8F0] shadow-2xs">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <div className="space-y-1 col-span-2 md:col-span-2">
                <div className="text-xs font-black uppercase text-slate-400 tracking-wider">Total Lab Value</div>
                <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">{totalLabTokens.toLocaleString('en-IN')} Tokens</div>
                <div className="flex items-center gap-2 pt-1">
                  <span className={`text-sm font-extrabold font-mono ${overallReturnTokens >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                    {overallReturnTokens >= 0 ? `↑ +${overallReturnPercent.toFixed(2)}%` : `${overallReturnPercent.toFixed(2)}%`}
                  </span>
                  <span className="text-xs font-bold text-slate-500">({overallReturnTokens >= 0 ? '+' : ''}{overallReturnTokens.toLocaleString('en-IN')} Tokens)</span>
                </div>
              </div>

              <div className="space-y-1 pt-4 md:pt-0 md:pl-6">
                <div className="text-xs font-black uppercase text-slate-400 tracking-wider">Available to Invest</div>
                <div className="text-xl font-black text-[#15519D] font-mono">{availableTokens.toLocaleString('en-IN')} Tokens</div>
                <div className="text-[11px] font-bold text-emerald-600">
                  {availableTokens < 10000 ? 'Sell holdings to free up Tokens' : 'Ready for New Investments'}
                </div>
              </div>

              <div className="space-y-1 pt-4 md:pt-0 md:pl-6">
                <div className="text-xs font-black uppercase text-slate-400 tracking-wider">Invested in Holdings</div>
                <div className="text-xl font-black text-slate-900 font-mono">{totalCurrentTokensValue.toLocaleString('en-IN')} Tokens</div>
                <div className="text-[11px] font-bold text-slate-500">{holdings.length} Active Positions</div>
              </div>

              <div className="space-y-1 pt-4 md:pt-0 md:pl-6">
                <div className="text-xs font-black uppercase text-slate-400 tracking-wider">Closed Realized Returns</div>
                <div className="text-xl font-black text-emerald-600 font-mono">+2,250 Tokens</div>
                <div className="text-[11px] font-bold text-slate-400">{closedPositions.length} Closed Deals</div>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleOpenInvestModal()}
                className="px-5 py-2.5 bg-[#15519D] hover:bg-[#123B63] text-white text-xs font-black rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Invest Tokens</span>
              </button>

              <button
                onClick={() => setActiveTab('Holdings')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <PieChart className="w-4 h-4 text-slate-600" />
                <span>View & Sell Holdings</span>
              </button>

              <button
                onClick={() => setActiveTab('Insights')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Review Insights</span>
              </button>
            </div>
          </div>

          {/* Dual Row: Performance Preview & Health Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Performance Preview Card (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-[28px] border border-[#E2E8F0] shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Your Lab Performance</h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-0.5">
                    <span>Portfolio +8.45%</span>
                    <span>•</span>
                    <span className="text-emerald-600">+3.33% vs NIFTY</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('Performance')}
                  className="text-xs font-extrabold text-[#15519D] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View Full Performance</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={LAB_PERFORMANCE_TIMEFRAMES['1M']}>
                    <defs>
                      <linearGradient id="prevGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#15519D" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#15519D" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748B' }} hide />
                    <Tooltip contentStyle={{ backgroundColor: '#172033', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="labTokens" stroke="#15519D" strokeWidth={2.5} fill="url(#prevGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Health Score Preview (5 cols) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-[28px] border border-[#E2E8F0] shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Investment Health</span>
                  </h3>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    78 / 100 Good
                  </span>
                </div>

                <div className="space-y-2 mt-4 text-xs font-bold">
                  <div className="flex justify-between"><span className="text-slate-500">Diversification</span><span className="font-mono">82</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Risk Balance</span><span className="font-mono">76</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Concentration</span><span className="text-amber-600 font-mono">65</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Decision Discipline</span><span className="text-emerald-600 font-mono">84</span></div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('Insights')}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>View Insights</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Top Holdings Preview Strip */}
          <div className="bg-white p-6 rounded-[28px] border border-[#E2E8F0] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Top Holdings</h3>
              <button onClick={() => setActiveTab('Holdings')} className="text-xs font-extrabold text-[#15519D] hover:underline flex items-center gap-1 cursor-pointer">
                <span>View & Sell Holdings ({holdings.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {holdings.slice(0, 4).map((st) => (
                <div
                  key={st.symbol}
                  className="p-4 bg-slate-50 hover:bg-blue-50/60 rounded-2xl border border-slate-100 space-y-2 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-slate-900">{st.symbol}</span>
                    <span className={`text-xs font-black font-mono ${st.isPositive ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                      {st.isPositive ? `+${st.returnPercent}%` : `${st.returnPercent}%`}
                    </span>
                  </div>
                  <div className="text-sm font-black font-mono text-slate-900">{st.currentValueTokens.toLocaleString('en-IN')} Tokens</div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onSelectStock && onSelectStock({ symbol: st.symbol, name: st.name, price: st.currentPrice.toLocaleString('en-IN') })}
                      className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold hover:bg-slate-100 cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleOpenSellModal(st)}
                      className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-black hover:bg-rose-100 cursor-pointer"
                    >
                      Sell
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: HOLDINGS PAGE */}
      {/* ==================================================== */}
      {activeTab === 'Holdings' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">My Holdings</h2>
              <p className="text-xs text-slate-500 font-medium">Track and manage active stock positions or sell to free up Tokens.</p>
            </div>

            <button
              onClick={() => handleOpenInvestModal()}
              className="px-5 py-2.5 bg-[#15519D] hover:bg-[#123B63] text-white text-xs font-black rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Invest Tokens</span>
            </button>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs flex items-center justify-between text-xs font-bold text-slate-600 flex-wrap gap-4">
            <div><span>{holdings.length} Active Holdings</span></div>
            <div><span>Invested: <strong className="font-mono text-slate-900">{totalInvestedTokens.toLocaleString('en-IN')} Tokens</strong></span></div>
            <div><span>Current Value: <strong className="font-mono text-slate-900">{totalCurrentTokensValue.toLocaleString('en-IN')} Tokens</strong></span></div>
            <div><span>Unrealized Return: <strong className="font-mono text-emerald-600">+{overallReturnTokens.toLocaleString('en-IN')} Tokens (+{overallReturnPercent.toFixed(2)}%)</strong></span></div>
          </div>

          <div className="bg-white p-6 rounded-[28px] border border-[#E2E8F0] shadow-2xs space-y-4">
            <div className="overflow-x-auto scrollbar-none">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                    <th className="pb-3 pl-2">Stock</th>
                    <th className="pb-3 text-right">Invested</th>
                    <th className="pb-3 text-right">Current Value</th>
                    <th className="pb-3 text-right">Unrealized Return</th>
                    <th className="pb-3 text-right">Weight</th>
                    <th className="pb-3 text-right">Current Price</th>
                    <th className="pb-3 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-extrabold">
                  {filteredHoldings.map((st) => (
                    <tr key={st.symbol} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-3.5 pl-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl font-black text-xs flex items-center justify-center ${st.badgeBg}`}>
                            {st.initials}
                          </div>
                          <div>
                            <div className="font-black text-slate-900 group-hover:text-[#15519D] transition-colors">{st.symbol}</div>
                            <div className="text-[10px] font-bold text-slate-400 truncate max-w-[140px]">{st.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 text-right font-mono text-slate-700">{st.investedTokens.toLocaleString('en-IN')} Tokens</td>
                      <td className="py-3.5 text-right font-mono text-slate-900 font-black">{st.currentValueTokens.toLocaleString('en-IN')} Tokens</td>
                      <td className="py-3.5 text-right font-mono">
                        <span className={st.isPositive ? 'text-[#16A34A]' : 'text-[#DC2626]'}>
                          {st.isPositive ? `+${st.returnTokens.toLocaleString('en-IN')} Tokens` : `${st.returnTokens.toLocaleString('en-IN')} Tokens`}
                        </span>
                      </td>
                      <td className="py-3.5 text-right font-mono text-slate-600">{st.weight}%</td>
                      <td className="py-3.5 text-right font-mono text-slate-900">₹{st.currentPrice.toLocaleString('en-IN')}</td>
                      <td className="py-3.5 text-right pr-2">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onSelectStock && onSelectStock({ symbol: st.symbol, name: st.name, price: st.currentPrice.toLocaleString('en-IN') })}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleOpenSellModal(st)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-black rounded-xl transition cursor-pointer"
                          >
                            Sell
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: PERFORMANCE PAGE */}
      {/* ==================================================== */}
      {activeTab === 'Performance' && (
        <div className="space-y-6">
          <div className="bg-white p-6 md:p-7 rounded-[28px] border border-[#E2E8F0] shadow-2xs space-y-4">
            <h2 className="text-xl font-black text-slate-900">Performance Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <div className="space-y-1">
                <div className="text-xs font-black uppercase text-slate-400">Unrealized Return</div>
                <div className="text-3xl font-black text-emerald-600 font-mono">+8.45%</div>
              </div>
              <div className="space-y-1 pt-4 md:pt-0 md:pl-6">
                <div className="text-xs font-black uppercase text-slate-400">Realized Gain</div>
                <div className="text-3xl font-black text-[#15519D] font-mono">+2,250 Tokens</div>
              </div>
              <div className="space-y-1 pt-4 md:pt-0 md:pl-6">
                <div className="text-xs font-black uppercase text-slate-400">Outperformance</div>
                <div className="text-3xl font-black text-emerald-600 font-mono">+3.33% vs NIFTY</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 4: INSIGHTS PAGE */}
      {/* ==================================================== */}
      {activeTab === 'Insights' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[28px] border border-[#E2E8F0] shadow-2xs space-y-4">
            <h2 className="text-xl font-black text-slate-900">Investment Insights</h2>
            <p className="text-xs text-slate-500 font-medium">Understand the patterns behind your investment decisions.</p>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 5: DECISION JOURNAL PAGE */}
      {/* ==================================================== */}
      {activeTab === 'Journal' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[28px] border border-[#E2E8F0] shadow-2xs space-y-4">
            <h2 className="text-xl font-black text-slate-900">Decision Journal</h2>
            <p className="text-xs text-slate-500 font-medium">Your investment thinking, recorded and tracked over time.</p>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 1: FIRST-TIME PREMIUM WELCOME OVERLAY */}
      {/* ==================================================== */}
      <AnimatePresence>
        {showFirstTimeWelcome && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] border border-[#E2E8F0] shadow-2xl max-w-xl w-full p-8 space-y-6 text-center overflow-hidden relative"
            >
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-md">
                <Coins className="w-8 h-8 fill-current" />
              </div>

              <div className="space-y-1">
                <div className="text-xs font-black uppercase text-[#15519D] tracking-wider">UNIVEST Investment Lab</div>
                <h2 className="text-2xl font-black text-slate-900">Welcome to the Investment Lab</h2>
                <p className="text-xs text-slate-500 font-medium">Your ideas deserve a place to be tested.</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-slate-900 to-[#123B63] text-white rounded-2xl space-y-1">
                <div className="text-[10px] font-bold text-amber-300 uppercase">Your Allocation</div>
                <div className="text-3xl font-black font-mono tracking-tight text-amber-300">1,00,000 UNIVEST TOKENS</div>
                <div className="text-[11px] text-blue-200 font-medium">Buy shares, manage your portfolio, sell to free up Tokens.</div>
              </div>

              <button
                onClick={() => setShowFirstTimeWelcome(false)}
                className="w-full py-4 bg-[#15519D] hover:bg-[#123B63] text-white text-xs font-black rounded-2xl shadow-xl transition-all cursor-pointer hover:scale-105"
              >
                Start My Investment Lab →
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* MODAL 2: BUY STOCK BY QUANTITY REDESIGNED MODAL */}
      {/* ==================================================== */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-2xl max-w-lg w-full p-6 space-y-5 overflow-hidden relative font-sans text-[#172033]"
            >
              {/* MODAL HEADER */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3.5">
                {selectedStockForAdd ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => { setSelectedStockForAdd(null); setShowFinalBuyConfirmation(false); }}
                      className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-lg text-slate-900">{selectedStockForAdd.symbol}</h3>
                        <span className="text-xs font-black font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                          {selectedStockForAdd.change || '+2.35% Today'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{selectedStockForAdd.name}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-black text-lg text-slate-900">Invest UNIVEST Tokens</h3>
                    <p className="text-xs text-slate-500 font-medium">Choose a stock to test your investment idea.</p>
                  </div>
                )}

                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* SCREEN 1: SEARCH & RECOMMENDED STOCKS LIST */}
              {!selectedStockForAdd && (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={modalSearchQuery}
                      onChange={(e) => setModalSearchQuery(e.target.value)}
                      placeholder="Search stocks or companies... (e.g. RELIANCE, TCS, INFY)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-medium text-slate-900 outline-none focus:border-[#15519D]"
                    />
                  </div>

                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto border border-slate-100 rounded-2xl bg-white">
                    {filteredModalStocks.map((st) => (
                      <div
                        key={st.symbol}
                        onClick={() => handleSelectStockFromList(st)}
                        className="p-3 hover:bg-blue-50/70 transition cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${st.badgeBg}`}>
                            {st.initials}
                          </div>
                          <div>
                            <div className="font-black text-xs text-slate-900 group-hover:text-[#15519D] transition-colors">{st.symbol}</div>
                            <div className="text-[10px] font-bold text-slate-400 truncate max-w-[150px]">{st.name}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-black font-mono text-slate-900">₹{st.price}</div>
                          <div className="text-[10px] font-bold font-mono text-[#16A34A]">{st.change}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SCREEN 2: SHARES QUANTITY SELECTOR & AUTO-CALCULATION */}
              {selectedStockForAdd && !showFinalBuyConfirmation && (
                <div className="space-y-4">
                  
                  {/* Stock Summary Card */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-500">Current Price</div>
                      <div className="text-2xl font-black font-mono text-slate-900">₹{selectedStockForAdd.price} <span className="text-xs font-bold text-slate-400 font-sans">per share</span></div>
                      <div className="text-[10px] text-slate-400 font-medium">Price used for this virtual investment</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-500">Univest Score</div>
                      <div className="text-sm font-black text-emerald-600 font-mono">{selectedStockForAdd.score || '78/100'}</div>
                    </div>
                  </div>

                  {/* SHARES QUANTITY INPUT */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-900 block">How Many Shares Do You Want to Buy?</label>
                    
                    {/* Controls: [-] [ 10 ] [+] */}
                    <div className="flex items-center justify-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-3">
                      <button
                        onClick={() => setSharesToBuy(prev => Math.max(1, prev - 1))}
                        className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-black transition cursor-pointer"
                      >
                        <Minus className="w-4 h-4 stroke-[3]" />
                      </button>

                      <div className="flex flex-col items-center">
                        <input
                          type="number"
                          value={sharesToBuy || ''}
                          onChange={(e) => setSharesToBuy(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-24 text-center text-2xl font-mono font-black text-slate-900 bg-transparent outline-none"
                        />
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Shares</span>
                      </div>

                      <button
                        onClick={() => setSharesToBuy(prev => prev + 1)}
                        className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-black transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>

                    {/* Quick Quantity Buttons */}
                    <div className="flex items-center gap-2">
                      {[1, 5, 10, 25].map((qty) => (
                        <button
                          key={qty}
                          onClick={() => setSharesToBuy(qty)}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
                            sharesToBuy === qty ? 'bg-blue-50 border-[#15519D] text-[#15519D]' : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          {qty}
                        </button>
                      ))}

                      {/* MAX Button */}
                      <button
                        onClick={() => setSharesToBuy(Math.max(1, maxAffordableShares))}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-black transition cursor-pointer border ${
                          sharesToBuy === maxAffordableShares ? 'bg-amber-100 border-amber-400 text-amber-900' : 'bg-amber-50 border-amber-200 text-amber-800'
                        }`}
                      >
                        MAX ({maxAffordableShares})
                      </button>
                    </div>
                  </div>

                  {/* AUTOMATIC INVESTMENT CALCULATION DISPLAY */}
                  <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600 font-bold">
                      <span>{sharesToBuy} Shares × ₹{selectedStockForAdd.price}</span>
                      <span className="text-slate-400">Rate Calculation</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-900 font-black border-t border-blue-200/50 pt-2 text-sm">
                      <span>Total Investment</span>
                      <span className="font-mono text-[#15519D]">{totalRequiredTokens.toLocaleString('en-IN')} Tokens</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 pt-1">
                      <span>Available Balance: <strong className="text-slate-900 font-mono">{availableTokens.toLocaleString('en-IN')} Tokens</strong></span>
                      <span>After Investment: <strong className={availableTokens - totalRequiredTokens >= 0 ? "text-emerald-700 font-mono font-bold" : "text-rose-600 font-mono font-bold"}>
                        {Math.max(0, availableTokens - totalRequiredTokens).toLocaleString('en-IN')} Tokens
                      </strong></span>
                    </div>
                  </div>

                  {/* INSUFFICIENT TOKENS WARNING */}
                  {isInsufficientTokens && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl space-y-2 text-xs text-rose-900">
                      <div className="font-black flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span>Insufficient UNIVEST Tokens</span>
                      </div>
                      <p className="text-[11px] text-rose-800">
                        You need <strong>{(totalRequiredTokens - availableTokens).toLocaleString('en-IN')}</strong> more Tokens to buy {sharesToBuy} shares.
                      </p>
                      <button
                        onClick={() => setSharesToBuy(Math.max(1, maxAffordableShares))}
                        className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-900 text-[11px] font-black rounded-xl border border-rose-300 transition cursor-pointer"
                      >
                        Use Maximum Affordable Quantity ({maxAffordableShares} Shares)
                      </button>
                    </div>
                  )}

                  {/* Thesis Selector */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-slate-700">Select Investment Thesis</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['Long-Term Growth', 'Strong Fundamentals', 'Undervalued', 'Momentum'].map((reason) => (
                        <button
                          key={reason}
                          onClick={() => setSelectedThesisReason(reason)}
                          className={`p-2 rounded-xl text-xs font-bold transition text-left border cursor-pointer ${
                            selectedThesisReason === reason ? 'bg-blue-50 border-[#15519D] text-[#15519D]' : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          {reason}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Primary CTA */}
                  <button
                    disabled={isInsufficientTokens || sharesToBuy <= 0}
                    onClick={() => setShowFinalBuyConfirmation(true)}
                    className={`w-full py-4 text-white text-xs font-black rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2 ${
                      isInsufficientTokens || sharesToBuy <= 0
                        ? 'bg-slate-300 cursor-not-allowed shadow-none'
                        : 'bg-[#15519D] hover:bg-[#123B63]'
                    }`}
                  >
                    <span>Confirm Investment — {sharesToBuy} Shares →</span>
                  </button>
                </div>
              )}

              {/* SCREEN 3: FINAL CONFIRMATION SCREEN */}
              {selectedStockForAdd && showFinalBuyConfirmation && (
                <div className="space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="font-black text-xl text-slate-900">Confirm Your Investment</h3>
                    <p className="text-xs text-slate-500 font-medium">Review investment summary before executing virtual trade.</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                    <div className="flex justify-between font-bold border-b border-slate-200 pb-2">
                      <span className="text-slate-500">Stock:</span>
                      <span className="text-slate-900 font-black">{selectedStockForAdd.symbol} ({selectedStockForAdd.name})</span>
                    </div>

                    <div className="flex justify-between font-bold border-b border-slate-200 pb-2">
                      <span className="text-slate-500">Quantity:</span>
                      <span className="text-slate-900 font-mono font-black">{sharesToBuy} Shares</span>
                    </div>

                    <div className="flex justify-between font-bold border-b border-slate-200 pb-2">
                      <span className="text-slate-500">Current Price:</span>
                      <span className="text-slate-900 font-mono font-black">₹{selectedStockForAdd.price} per share</span>
                    </div>

                    <div className="flex justify-between font-bold border-b border-slate-200 pb-2">
                      <span className="text-slate-500">Total Investment:</span>
                      <span className="text-[#15519D] font-mono font-black text-sm">{totalRequiredTokens.toLocaleString('en-IN')} UNIVEST Tokens</span>
                    </div>

                    <div className="flex justify-between font-bold">
                      <span className="text-slate-500">Remaining Available Balance:</span>
                      <span className="text-emerald-700 font-mono font-black">{(availableTokens - totalRequiredTokens).toLocaleString('en-IN')} Tokens</span>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmVirtualInvestment}
                    className="w-full py-4 bg-[#15519D] hover:bg-[#123B63] text-white text-xs font-black rounded-2xl shadow-xl transition cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02]"
                  >
                    <span>Confirm Virtual Investment</span>
                  </button>

                  <p className="text-[10px] text-center text-slate-400 font-medium">
                    This is a virtual investment using UNIVEST Tokens. No real money is involved.
                  </p>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* MODAL 3: SELL STOCK MODAL */}
      {/* ==================================================== */}
      <AnimatePresence>
        {isSellModalOpen && selectedHoldingForSell && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-2xl max-w-lg w-full p-6 space-y-5 font-sans text-[#172033]"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <div>
                  <h3 className="font-black text-lg text-slate-900">Sell {selectedHoldingForSell.symbol}</h3>
                  <p className="text-xs text-slate-500 font-medium">Free up Tokens to invest in other opportunities.</p>
                </div>
                <button onClick={() => setIsSellModalOpen(false)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs font-bold">
                <div>
                  <div className="text-slate-500">Current Market Price</div>
                  <div className="text-xl font-black font-mono text-slate-900">₹{selectedHoldingForSell.currentPrice.toLocaleString('en-IN')}</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-500">Position Value</div>
                  <div className="text-xl font-black font-mono text-[#15519D]">{selectedHoldingForSell.currentValueTokens.toLocaleString('en-IN')} Tokens</div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700">Select Sale Percentage</label>
                <div className="flex items-center gap-2">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setSellSharePercent(pct)}
                      className={`flex-1 py-2 rounded-xl text-xs font-black transition cursor-pointer border ${
                        sellSharePercent === pct ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-2xs' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {pct === 100 ? 'MAX (100%)' : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleConfirmSale}
                className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-2xl shadow-lg transition cursor-pointer"
              >
                Confirm Sale & Credit Tokens →
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* MODAL 4: INSUFFICIENT TOKENS WARNING MODAL */}
      {/* ==================================================== */}
      <AnimatePresence>
        {showLowBalanceWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[28px] border border-amber-200 shadow-2xl max-w-md w-full p-6 space-y-4 font-sans text-[#172033]"
            >
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">Insufficient Available Tokens</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                  You currently have <strong className="text-[#15519D] font-mono font-black">{availableTokens.toLocaleString('en-IN')} Tokens</strong> available to invest.
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  To free up more Tokens for new investments, you must sell part or all of your active stock positions.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => { setShowLowBalanceWarning(false); setActiveTab('Holdings'); }}
                  className="flex-1 py-3 bg-[#15519D] hover:bg-[#123B63] text-white text-xs font-black rounded-xl transition cursor-pointer"
                >
                  Sell a Holding →
                </button>
                <button
                  onClick={() => setShowLowBalanceWarning(false)}
                  className="py-3 px-4 bg-slate-100 text-slate-700 text-xs font-extrabold rounded-xl cursor-pointer"
                >
                  Close
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
