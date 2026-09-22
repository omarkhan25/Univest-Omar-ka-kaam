import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Activity, Info, ShieldCheck, Search, 
  ChevronRight, Sparkles, Filter, AlertCircle, HelpCircle, ArrowUpRight, 
  ArrowDownRight, BarChart3, PieChart, Lock, Zap, Layers, RefreshCw, X, Eye
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, ReferenceLine
} from 'recharts';

interface FnOIntelligenceCenterProps {
  onSelectStock: (stock: any) => void;
}

// Sample Market Indices Data
const FNO_INDICES_HEADER = [
  { symbol: 'NIFTY', name: 'NIFTY 50 FUT', price: '22,183.65', change: '+274.15', changePercent: 1.25, isPositive: true },
  { symbol: 'BANK NIFTY', name: 'BANK NIFTY FUT', price: '55,320.25', change: '+460.80', changePercent: 0.84, isPositive: true },
  { symbol: 'FIN NIFTY', name: 'FIN NIFTY FUT', price: '26,423.70', change: '+175.40', changePercent: 0.67, isPositive: true },
];

// Snapshot Metrics Data
const SNAPSHOT_METRICS = [
  { id: 'oi', label: 'Open Interest', value: '₹3,42,850 Cr', change: '+4.85%', isPositive: true, tooltip: 'Open Interest represents the total number of outstanding derivative contracts that have not been settled.' },
  { id: 'oichg', label: 'OI Change', value: '+3.12%', change: '+12.4K contracts', isPositive: true, tooltip: 'Net change in open interest across futures & options in today’s session.' },
  { id: 'basis', label: 'Futures Basis', value: '+0.18%', change: '+₹38.5 pts premium', isPositive: true, tooltip: 'The percentage difference between the futures price and the underlying spot price.' },
  { id: 'vix', label: 'India VIX', value: '14.85', change: '-2.10%', isPositive: false, tooltip: 'India Volatility Index measures expected market volatility over the next 30 days.' },
  { id: 'pcr', label: 'Put/Call Ratio (PCR)', value: '1.12', change: '+0.06 vs yesterday', isPositive: true, tooltip: 'Ratio of total Put Open Interest to Call Open Interest. Values above 1.0 indicate strong put support.' },
  { id: 'expiry', label: 'Current Expiry', value: '18 Sep 2026', change: '3 Days Remaining', isPositive: true, tooltip: 'Upcoming weekly contract settlement date for benchmark index contracts.' },
];

// Futures Watch Data
const FUTURES_WATCH_DATA = [
  { contract: 'NIFTY FUT', spot: '22,183.65', price: '24,965.00', changePercent: 1.18, oi: '1.42 Cr', oiChange: '+12.2%', basis: '+0.15%', view: 'Bullish', viewColor: 'text-[#16A34A] bg-emerald-50 border-emerald-200' },
  { contract: 'BANK NIFTY FUT', spot: '55,320.25', price: '55,410.00', changePercent: 0.92, oi: '84.5 L', oiChange: '+9.4%', basis: '+0.16%', view: 'Positive', viewColor: 'text-[#16A34A] bg-emerald-50 border-emerald-200' },
  { contract: 'FIN NIFTY FUT', spot: '26,423.70', price: '26,465.00', changePercent: 0.67, oi: '42.1 L', oiChange: '+5.1%', basis: '+0.12%', view: 'Neutral', viewColor: 'text-amber-700 bg-amber-50 border-amber-200' },
  { contract: 'RELIANCE FUT', spot: '3,026.00', price: '3,041.50', changePercent: 2.12, oi: '3.82 Cr', oiChange: '+7.1%', basis: '+0.18%', view: 'Positive', viewColor: 'text-[#16A34A] bg-emerald-50 border-emerald-200' },
  { contract: 'TCS FUT', spot: '4,185.10', price: '4,198.00', changePercent: 1.51, oi: '1.95 Cr', oiChange: '+8.6%', basis: '+0.14%', view: 'Bullish', viewColor: 'text-[#16A34A] bg-emerald-50 border-emerald-200' },
  { contract: 'HDFCBANK FUT', spot: '1,777.00', price: '1,784.20', changePercent: 1.14, oi: '5.62 Cr', oiChange: '+12.6%', basis: '+0.16%', view: 'Bullish', viewColor: 'text-[#16A34A] bg-emerald-50 border-emerald-200' },
  { contract: 'ICICIBANK FUT', spot: '1,215.80', price: '1,221.00', changePercent: -0.45, oi: '2.84 Cr', oiChange: '-3.2%', basis: '+0.09%', view: 'Cautious', viewColor: 'text-rose-700 bg-rose-50 border-rose-200' },
  { contract: 'TATAMOTORS FUT', spot: '985.40', price: '989.10', changePercent: -1.28, oi: '2.10 Cr', oiChange: '-6.4%', basis: '+0.08%', view: 'Bearish', viewColor: 'text-rose-700 bg-rose-50 border-rose-200' },
];

// Open Interest Distribution Chart Mock Data by Index
const OI_DISTRIBUTION_DATA: Record<string, any[]> = {
  NIFTY: [
    { strike: 24500, callOi: 14.2, putOi: 82.5, callChg: -2.1, putChg: 18.4, isAtm: false },
    { strike: 24600, callOi: 22.8, putOi: 96.4, callChg: -4.5, putChg: 24.2, isAtm: false },
    { strike: 24700, callOi: 31.5, putOi: 125.8, callChg: -8.2, putChg: 32.6, isAtm: false, isSupport: true },
    { strike: 24800, callOi: 54.2, putOi: 88.6, callChg: 6.1, putChg: 15.1, isAtm: false, isSupport: true },
    { strike: 24900, callOi: 89.4, putOi: 72.1, callChg: 14.8, putChg: 8.3, isAtm: true },
    { strike: 25000, callOi: 145.6, putOi: 45.2, callChg: 42.1, putChg: -5.4, isAtm: false, isResistance: true },
    { strike: 25100, callOi: 112.3, putOi: 28.4, callChg: 28.4, putChg: -8.2, isAtm: false, isResistance: true },
    { strike: 25200, callOi: 94.8, putOi: 15.6, callChg: 18.9, putChg: -12.1, isAtm: false },
  ],
  BANKNIFTY: [
    { strike: 54500, callOi: 18.5, putOi: 78.4, callChg: -3.2, putChg: 14.2, isAtm: false },
    { strike: 54800, callOi: 26.2, putOi: 92.1, callChg: -5.1, putChg: 21.4, isAtm: false },
    { strike: 55000, callOi: 42.1, putOi: 110.5, callChg: -6.4, putChg: 28.9, isAtm: false, isSupport: true },
    { strike: 55200, callOi: 68.4, putOi: 74.2, callChg: 8.5, putChg: 11.2, isAtm: true },
    { strike: 55500, callOi: 124.8, putOi: 38.6, callChg: 36.2, putChg: -4.1, isAtm: false, isResistance: true },
    { strike: 55800, callOi: 98.2, putOi: 22.4, callChg: 22.1, putChg: -7.5, isAtm: false },
  ],
  FINNIFTY: [
    { strike: 26000, callOi: 12.1, putOi: 54.2, callChg: -1.8, putChg: 9.4, isAtm: false, isSupport: true },
    { strike: 26200, callOi: 24.5, putOi: 62.8, callChg: -2.4, putChg: 14.1, isAtm: false },
    { strike: 26400, callOi: 48.2, putOi: 42.1, callChg: 5.2, putChg: 4.8, isAtm: true },
    { strike: 26500, callOi: 78.6, putOi: 28.4, callChg: 18.4, putChg: -2.1, isAtm: false, isResistance: true },
    { strike: 26600, callOi: 59.2, putOi: 14.2, callChg: 11.2, putChg: -4.5, isAtm: false },
  ]
};

// Option Chain Data
const OPTION_CHAIN_DATA = [
  { callOi: '42.1L', callOiChg: '-8.2%', callVol: '2.4M', callIv: '13.2%', callLtp: '342.50', strike: 24700, putLtp: '48.20', putIv: '14.8%', putVol: '8.4M', putOiChg: '+32.6%', putOi: '125.8L', isAtm: false, isMaxPut: true },
  { callOi: '54.2L', callOiChg: '+6.1%', callVol: '4.8M', callIv: '13.8%', callLtp: '265.10', strike: 24800, putLtp: '72.40', putIv: '14.2%', putVol: '6.2M', putOiChg: '+15.1%', putOi: '88.6L', isAtm: false },
  { callOi: '89.4L', callOiChg: '+14.8%', callVol: '9.2M', callIv: '14.5%', callLtp: '194.80', strike: 24900, putLtp: '102.50', putIv: '13.9%', putVol: '5.1M', putOiChg: '+8.3%', putOi: '72.1L', isAtm: true },
  { callOi: '145.6L', callOiChg: '+42.1%', callVol: '14.6M', callIv: '15.1%', callLtp: '132.40', strike: 25000, putLtp: '140.20', putIv: '13.6%', putVol: '3.8M', putOiChg: '-5.4%', putOi: '45.2L', isAtm: false, isMaxCall: true, isMaxChg: true },
  { callOi: '112.3L', callOiChg: '+28.4%', callVol: '8.1M', callIv: '15.8%', callLtp: '84.60', strike: 25100, putLtp: '192.10', putIv: '13.4%', putVol: '2.1M', putOiChg: '-8.2%', putOi: '28.4L', isAtm: false },
  { callOi: '94.8L', callOiChg: '+18.9%', callVol: '5.4M', callIv: '16.4%', callLtp: '49.20', strike: 25200, putLtp: '256.80', putIv: '13.1%', putVol: '1.2M', putOiChg: '-12.1%', putOi: '15.6L', isAtm: false },
];

// OI Activity changing positioning
const OI_ACTIVITY_CHANGING = [
  { contract: 'NIFTY 25,000 CE', oiChg: '+42.1%', priceChg: '-14.2%', volume: '14.6M', interpretation: 'Call writing at 25,000 indicates sellers building strong resistance near this psychological hurdle.', bias: 'Resistance Building' },
  { contract: 'NIFTY 24,700 PE', oiChg: '+32.6%', priceChg: '+22.4%', volume: '8.4M', interpretation: 'Put OI addition indicates increased bullish positioning around this support strike.', bias: 'Support Strengthening' },
  { contract: 'BANK NIFTY 55,000 PE', oiChg: '+28.9%', priceChg: '+18.5%', volume: '6.1M', interpretation: 'Aggressive Put addition reinforces 55,000 as a strong foundation for Bank Nifty.', bias: 'Support Strengthening' },
  { contract: 'RELIANCE 3,050 CE', oiChg: '+24.2%', priceChg: '+8.1%', volume: '3.9M', interpretation: 'Price and Call OI both rising points to fresh long accumulation in Reliance options.', bias: 'Long Accumulation' },
  { contract: 'TCS 4,200 CE', oiChg: '-14.5%', priceChg: '+28.4%', volume: '2.8M', interpretation: 'Call short covering as prices break through 4,200 level.', bias: 'Short Covering' },
];

// F&O Stock Discovery
const FNO_STOCKS_TO_WATCH = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', price: '3,026.00', change: '+2.35%', oiChg: '+18.2%', volume: '2.4× Vol', iv: '22.4%', viewScore: 88, status: 'Bullish Breakout', sector: 'Energy' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Limited', price: '1,777.00', change: '+1.14%', oiChg: '+12.6%', volume: '1.8× Vol', iv: '19.8%', viewScore: 82, status: 'Fresh Longs', sector: 'Banking' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: '4,185.10', change: '+1.51%', oiChg: '+8.6%', volume: '1.5× Vol', iv: '20.2%', viewScore: 84, status: 'Bullish Build-up', sector: 'IT' },
  { symbol: 'INFY', name: 'Infosys Limited', price: '1,562.10', change: '-0.85%', oiChg: '-4.2%', volume: '0.9× Vol', iv: '24.1%', viewScore: 62, status: 'Unwinding', sector: 'IT' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Limited', price: '1,215.80', change: '-0.45%', oiChg: '-3.2%', volume: '1.1× Vol', iv: '18.6%', viewScore: 68, status: 'Neutral Drift', sector: 'Banking' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', price: '985.40', change: '-1.28%', oiChg: '+14.5%', volume: '2.1× Vol', iv: '28.5%', viewScore: 42, status: 'Short Build-up', sector: 'Auto' },
  { symbol: 'TATASTEEL', name: 'Tata Steel Limited', price: '147.20', change: '+2.40%', oiChg: '+16.8%', volume: '3.2× Vol', iv: '31.2%', viewScore: 79, status: 'Volume Surge', sector: 'Metals' },
];

// Unusual Derivatives Activity
const UNUSUAL_ACTIVITY = [
  { symbol: 'RELIANCE', title: 'Futures OI jumped +24% with price up +2.4%', interpretation: 'Fresh futures positioning is building alongside the price move, indicating strong institutional participation.', impact: 'High Interest' },
  { symbol: 'TCS', title: 'Put OI increased sharply around ₹4,100 strike (+38%)', interpretation: 'Derivative positioning has increased around this level, creating a strong potential support floor.', impact: 'Support Building' },
  { symbol: 'TATASTEEL', title: 'Call Volume spiked 4.2x above 20-day average', interpretation: 'Options traders are buying near-the-money Call options expecting high momentum in metals.', impact: 'Volume Outlier' },
  { symbol: 'TATAMOTORS', title: 'Futures OI increased +14.5% as price dropped -1.28%', interpretation: 'Short positions are being added by futures market participants ahead of key earnings data.', impact: 'Short Accumulation' },
];

// F&O Insights
const ARTHSETU_FNO_INSIGHTS = [
  { icon: '🚀', headline: 'Positioning Turning Positive in Benchmark Futures', description: 'NIFTY futures open interest has increased alongside price appreciation, confirming underlying buyers are active.', contract: 'NIFTY FUT', tag: 'Market Sentiment' },
  { icon: '🛡️', headline: 'Resistance Building Near 25,000 Strike', description: '25,000 Call OI has increased by +42% in recent sessions, creating a notable overhead supply zone for index bulls.', contract: 'NIFTY 25,000 CE', tag: 'Derivatives Supply' },
  { icon: '⚓', headline: 'Put Support Strengthening at 24,700 Level', description: '24,700 Put OI shows substantial fresh positioning (+32%), indicating strong institutional support on dips.', contract: 'NIFTY 24,700 PE', tag: 'Support Floor' },
];

export const FnOIntelligenceCenter: React.FC<FnOIntelligenceCenterProps> = ({ onSelectStock }) => {
  const [selectedOiIndex, setSelectedOiIndex] = useState<'NIFTY' | 'BANKNIFTY' | 'FINNIFTY'>('NIFTY');
  const [selectedChainIndex, setSelectedChainIndex] = useState<'NIFTY' | 'BANKNIFTY' | 'FINNIFTY'>('NIFTY');
  const [selectedExpiry, setSelectedExpiry] = useState<'Current' | 'Next' | 'Monthly'>('Current');
  const [stockFilter, setStockFilter] = useState<'all' | 'oi_add' | 'oi_red' | 'vol_surge' | 'price_oi_up' | 'high_iv'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeEducationModal, setActiveEducationModal] = useState<{ title: string; explanation: string; example: string } | null>(null);

  // Education Dictionary for info icons and "What's this?" links
  const EDUCATION_ITEMS: Record<string, { title: string; explanation: string; example: string }> = {
    oi: {
      title: 'What is Open Interest (OI)?',
      explanation: 'Open Interest shows how many derivative contracts remain active and open in the market. Unlike volume, which counts transactions, OI tells us whether money is flowing into or out of derivatives contracts.',
      example: 'Rising Price + Rising OI = Fresh Long positions building (Bullish signal).\nFalling Price + Rising OI = Fresh Short positions building (Bearish signal).'
    },
    pcr: {
      title: 'What is Put/Call Ratio (PCR)?',
      explanation: 'Put-Call Ratio compares total Put option open interest with Call option open interest. It measures relative market sentiment and hedging activity.',
      example: 'PCR > 1.2: Strong Put activity indicating support on dips (Positive/Bullish).\nPCR < 0.7: Heavy Call activity indicating resistance or overbought conditions.'
    },
    iv: {
      title: 'What is Implied Volatility (IV)?',
      explanation: 'Implied Volatility reflects the market’s expectation of price movement over the life of an option contract. Higher IV makes option contracts more expensive.',
      example: 'High IV usually occurs ahead of major market events, corporate earnings, or policy announcements.'
    },
    basis: {
      title: 'What is Futures Basis?',
      explanation: 'Basis is the price difference between a futures contract and its underlying spot price (Futures Price minus Spot Price).',
      example: 'Positive Basis (Premium): Futures trading higher than Spot, indicating positive sentiment.\nNegative Basis (Discount): Futures trading lower than Spot, indicating cautious sentiment.'
    },
    maxpain: {
      title: 'What is Max Pain / ATM?',
      explanation: 'At-The-Money (ATM) is the strike price closest to the current spot price. Max Pain is the strike price where option buyers as a collective would lose the most money upon contract expiration.',
      example: 'Option writers often seek to pin index prices near the Max Pain level towards expiry.'
    }
  };

  const filteredStocks = FNO_STOCKS_TO_WATCH.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          stock.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (stockFilter === 'oi_add') return parseFloat(stock.oiChg) > 10;
    if (stockFilter === 'oi_red') return parseFloat(stock.oiChg) < 0;
    if (stockFilter === 'vol_surge') return stock.volume.includes('2.') || stock.volume.includes('3.');
    if (stockFilter === 'price_oi_up') return stock.change.startsWith('+') && stock.oiChg.startsWith('+');
    if (stockFilter === 'high_iv') return parseFloat(stock.iv) > 22;
    return true;
  });

  return (
    <div className="space-y-8 pb-12 text-[#172033]">
      
      {/* 1. COMPACT F&O HEADER & LIVE TICKER STRIP */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">F&O Intelligence</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200/60 font-black text-xs">
                Derivatives Advisory & Analytics
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Understand futures, options, positioning and market expectations. Research intelligence, not order execution.
            </p>
          </div>

          {/* F&O Universal Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search F&O stocks, contracts or indices..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
            />
          </div>
        </div>

        {/* Live Index Derivatives Header Cards */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/80">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>NSE</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-black">Market Open</span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1">
            {FNO_INDICES_HEADER.map((idx) => (
              <div key={idx.symbol} className="px-3.5 py-1.5 bg-slate-50 border border-slate-200/90 rounded-xl flex items-center gap-3 text-xs shrink-0">
                <span className="font-extrabold text-slate-800">{idx.name}</span>
                <span className="font-black text-slate-900">₹{idx.price}</span>
                <span className={`font-black flex items-center gap-0.5 ${idx.isPositive ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                  {idx.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  +{idx.changePercent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. F&O MARKET SNAPSHOT ROW */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider">F&O Market Snapshot</h2>
          <span className="text-[11px] text-slate-400 font-medium">Real-time aggregate positioning metrics</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {SNAPSHOT_METRICS.map((m) => (
            <div key={m.id} className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs relative group hover:border-[#2563EB]/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 truncate">{m.label}</span>
                <button
                  onClick={() => setActiveEducationModal(EDUCATION_ITEMS[m.id] || null)}
                  className="text-slate-400 hover:text-[#2563EB] transition-colors p-0.5 cursor-pointer"
                  title="What's this?"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-base sm:text-lg font-black text-slate-900 mt-1">{m.value}</div>
              
              <div className={`text-[11px] font-bold mt-1 ${m.isPositive ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                {m.change}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. F&O MARKET MOOD (DERIVATIVES MARKET VIEW) */}
      <div className="p-6 bg-gradient-to-br from-[#0B1F33] to-[#2563EB] rounded-3xl text-white shadow-md relative overflow-hidden space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h3 className="font-extrabold text-lg text-white">Derivatives Market View</h3>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-amber-200 border border-white/15">
            ArthSetu Research Intelligence
          </span>
        </div>

        <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed italic">
          "Bullish positioning is building in NIFTY futures, while rising Call OI near 25,000 suggests resistance around this level."
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-xs">
            <span className="text-[10px] font-extrabold uppercase text-amber-200 block">Market Bias</span>
            <span className="text-base font-black text-emerald-400">Bullish</span>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-xs">
            <span className="text-[10px] font-extrabold uppercase text-amber-200 block">Confidence</span>
            <span className="text-base font-black text-white">Moderate</span>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-xs">
            <span className="text-[10px] font-extrabold uppercase text-amber-200 block">Key Resistance</span>
            <span className="text-base font-black text-rose-300">25,000</span>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-xs">
            <span className="text-[10px] font-extrabold uppercase text-amber-200 block">Key Support</span>
            <span className="text-base font-black text-emerald-300">24,700</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-300 font-medium pt-1 flex items-center gap-1.5 border-t border-white/10">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span>This is research intelligence derived from option open interest and futures positioning, not a trading recommendation.</span>
        </div>
      </div>

      {/* 4. FUTURES INTELLIGENCE (FUTURES WATCH) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Futures Watch</h3>
            <p className="text-xs text-slate-500 font-medium">Tracking premium/discount basis, contract prices, and open interest shifts</p>
          </div>
          <button
            onClick={() => setActiveEducationModal(EDUCATION_ITEMS.basis)}
            className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" /> What is Basis?
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Contract</th>
                <th className="py-3 px-4">Spot Price</th>
                <th className="py-3 px-4">Futures Price</th>
                <th className="py-3 px-4">Day Change</th>
                <th className="py-3 px-4">Total OI</th>
                <th className="py-3 px-4">OI Change</th>
                <th className="py-3 px-4">Basis</th>
                <th className="py-3 px-4 text-right">ArthSetu View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-semibold">
              {FUTURES_WATCH_DATA.map((fut) => (
                <tr key={fut.contract} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-black text-slate-900">{fut.contract}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono">₹{fut.spot}</td>
                  <td className="py-3.5 px-4 font-black text-slate-900 font-mono">₹{fut.price}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-0.5 font-bold ${fut.changePercent >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                      {fut.changePercent >= 0 ? '+' : ''}{fut.changePercent}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">{fut.oi}</td>
                  <td className="py-3.5 px-4">
                    <span className={`font-extrabold ${fut.oiChange.startsWith('+') ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                      {fut.oiChange}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-blue-700">{fut.basis}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border ${fut.viewColor}`}>
                      {fut.view}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. OPEN INTEREST INTELLIGENCE & VISUALIZATION */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-lg">Open Interest Distribution</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-black">
                Call vs Put Strike Concentrations
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Identify potential support floors, resistance ceilings, and heavy OI shifts across key strikes.
            </p>
          </div>

          {/* Index Selector Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
            {(['NIFTY', 'BANKNIFTY', 'FINNIFTY'] as const).map((idx) => (
              <button
                key={idx}
                onClick={() => setSelectedOiIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  selectedOiIndex === idx
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {idx === 'BANKNIFTY' ? 'BANK NIFTY' : idx === 'FINNIFTY' ? 'FIN NIFTY' : 'NIFTY'}
              </button>
            ))}
          </div>
        </div>

        {/* Legend & Summary Info */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500" />
              <span>Call OI (Derivatives Resistance)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500" />
              <span>Put OI (Derivatives Support)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-400" />
              <span>ATM Strike (Spot Reference)</span>
            </div>
          </div>

          <button
            onClick={() => setActiveEducationModal(EDUCATION_ITEMS.oi)}
            className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" /> What does OI tell us?
          </button>
        </div>

        {/* OI Chart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={OI_DISTRIBUTION_DATA[selectedOiIndex]} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="strike" tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#64748B' }} />
              <YAxis tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#94A3B8' }} unit="L" />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700">
                        <div className="font-extrabold text-amber-300">Strike Price: {label}</div>
                        <div className="text-rose-400 font-bold">Call OI: {data.callOi} Lakhs ({data.callChg >= 0 ? '+' : ''}{data.callChg}%)</div>
                        <div className="text-emerald-400 font-bold">Put OI: {data.putOi} Lakhs ({data.putChg >= 0 ? '+' : ''}{data.putChg}%)</div>
                        {data.isSupport && <div className="text-emerald-300 text-[10px] font-black uppercase">● Strong Support Zone</div>}
                        {data.isResistance && <div className="text-rose-300 text-[10px] font-black uppercase">● Key Resistance Zone</div>}
                        {data.isAtm && <div className="text-amber-300 text-[10px] font-black uppercase">● At-The-Money Strike</div>}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="callOi" name="Call OI" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={18} />
              <Bar dataKey="putOi" name="Put OI" fill="#10B981" radius={[4, 4, 0, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 6. DEDICATED OPTION CHAIN */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">Option Chain Intelligence</h3>
            <p className="text-xs text-slate-500 font-medium">
              Institutional breakdown of Call/Put open interest, implied volatility, and volume across strikes
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Index Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(['NIFTY', 'BANKNIFTY', 'FINNIFTY'] as const).map((idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedChainIndex(idx)}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    selectedChainIndex === idx ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {idx === 'BANKNIFTY' ? 'BANK NIFTY' : idx === 'FINNIFTY' ? 'FIN NIFTY' : 'NIFTY'}
                </button>
              ))}
            </div>

            {/* Expiry Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(['Current', 'Next', 'Monthly'] as const).map((exp) => (
                <button
                  key={exp}
                  onClick={() => setSelectedExpiry(exp)}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    selectedExpiry === exp ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {exp} Expiry
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Option Chain Institutional Table */}
        <div className="overflow-x-auto border border-slate-200/90 rounded-2xl">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
                <th colSpan={5} className="py-2.5 border-r border-slate-700 bg-rose-950/60 text-rose-300">CALL OPTIONS (Derivatives Supply)</th>
                <th className="py-2.5 bg-slate-800 text-amber-300">STRIKE</th>
                <th colSpan={5} className="py-2.5 border-l border-slate-700 bg-emerald-950/60 text-emerald-300">PUT OPTIONS (Derivatives Support)</th>
              </tr>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">OI</th>
                <th className="py-2.5 px-3">OI Chg</th>
                <th className="py-2.5 px-3">Volume</th>
                <th className="py-2.5 px-3">IV</th>
                <th className="py-2.5 px-3 border-r border-slate-200">LTP</th>
                <th className="py-2.5 px-4 font-black bg-amber-50 text-slate-900 border-x border-slate-200">PRICE</th>
                <th className="py-2.5 px-3 border-l border-slate-200">LTP</th>
                <th className="py-2.5 px-3">IV</th>
                <th className="py-2.5 px-3">Volume</th>
                <th className="py-2.5 px-3">OI Chg</th>
                <th className="py-2.5 px-3">OI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold">
              {OPTION_CHAIN_DATA.map((row) => (
                <tr 
                  key={row.strike} 
                  className={`transition-colors ${
                    row.isAtm 
                      ? 'bg-amber-50/90 font-black border-y-2 border-amber-300' 
                      : row.isMaxCall 
                      ? 'bg-rose-50/40' 
                      : row.isMaxPut 
                      ? 'bg-emerald-50/40' 
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* CALLS */}
                  <td className={`py-3 px-3 font-bold ${row.isMaxCall ? 'text-rose-700 font-black' : 'text-slate-700'}`}>
                    {row.callOi} {row.isMaxCall && <span className="text-[9px] bg-rose-100 text-rose-800 px-1 rounded ml-1 font-black">MAX</span>}
                  </td>
                  <td className={`py-3 px-3 ${row.callOiChg.startsWith('+') ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {row.callOiChg}
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono">{row.callVol}</td>
                  <td className="py-3 px-3 text-slate-500">{row.callIv}</td>
                  <td className="py-3 px-3 font-black text-slate-900 border-r border-slate-200 font-mono">₹{row.callLtp}</td>

                  {/* STRIKE */}
                  <td className={`py-3 px-4 font-black border-x border-slate-200 font-mono ${row.isAtm ? 'bg-amber-100 text-amber-950 text-sm' : 'bg-slate-50 text-slate-900'}`}>
                    {row.strike} {row.isAtm && <span className="block text-[9px] text-amber-800 font-bold uppercase">ATM</span>}
                  </td>

                  {/* PUTS */}
                  <td className="py-3 px-3 font-black text-slate-900 border-l border-slate-200 font-mono">₹{row.putLtp}</td>
                  <td className="py-3 px-3 text-slate-500">{row.putIv}</td>
                  <td className="py-3 px-3 text-slate-500 font-mono">{row.putVol}</td>
                  <td className={`py-3 px-3 ${row.putOiChg.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {row.putOiChg}
                  </td>
                  <td className={`py-3 px-3 font-bold ${row.isMaxPut ? 'text-emerald-700 font-black' : 'text-slate-700'}`}>
                    {row.putOi} {row.isMaxPut && <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded ml-1 font-black">MAX</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. DERIVATIVES LEVELS & WHERE POSITIONING IS CHANGING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Derivatives Levels (Support & Resistance) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Derivatives Levels</h3>
            <p className="text-xs text-slate-500 font-medium">Derived from Put & Call OI concentration</p>
          </div>

          <div className="space-y-3">
            {/* Resistance Box */}
            <div className="p-4 bg-rose-50/70 border border-rose-200/80 rounded-2xl space-y-2">
              <span className="text-xs font-black text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                Key Resistance Levels
              </span>

              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-rose-100">
                  <span className="font-black text-slate-900 font-mono text-sm">25,000</span>
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-black text-[11px]">Strong Call OI (145.6L)</span>
                </div>
                <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-rose-100">
                  <span className="font-black text-slate-900 font-mono text-sm">25,100</span>
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[11px]">Moderate Call OI (112.3L)</span>
                </div>
              </div>
            </div>

            {/* Support Box */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-2">
              <span className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                Key Support Levels
              </span>

              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-emerald-100">
                  <span className="font-black text-slate-900 font-mono text-sm">24,700</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-black text-[11px]">Strong Put OI (125.8L)</span>
                </div>
                <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-emerald-100">
                  <span className="font-black text-slate-900 font-mono text-sm">24,800</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">Moderate Put OI (88.6L)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-medium italic bg-slate-50 p-3 rounded-xl border border-slate-100">
            "These levels reflect areas of significant derivatives positioning and should not be interpreted as guaranteed price levels."
          </div>
        </div>

        {/* Where Positioning Is Changing (OI Activity) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Where Positioning Is Changing</h3>
            <p className="text-xs text-slate-500 font-medium">Active contract open interest additions and unwinding</p>
          </div>

          <div className="space-y-2.5">
            {OI_ACTIVITY_CHANGING.map((act, i) => (
              <div key={i} className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-black text-slate-900 text-sm">{act.contract}</span>
                  <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                    {act.bias}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                  <span>OI Change: <strong className="text-emerald-600">{act.oiChg}</strong></span>
                  <span>•</span>
                  <span>Price Change: <strong className="text-slate-800">{act.priceChg}</strong></span>
                  <span>•</span>
                  <span>Vol: <strong className="text-slate-700">{act.volume}</strong></span>
                </div>

                <p className="text-xs text-slate-500 font-medium leading-tight">
                  {act.interpretation}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 8. F&O STOCKS TO WATCH */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">F&O Stocks To Watch</h3>
            <p className="text-xs text-slate-500 font-medium">Intelligent screening of futures & options stock candidates</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {[
              { id: 'all', label: 'All F&O Stocks' },
              { id: 'oi_add', label: 'Highest OI Addition' },
              { id: 'oi_red', label: 'OI Reduction' },
              { id: 'vol_surge', label: 'Volume Surge' },
              { id: 'price_oi_up', label: 'Price + OI Rise' },
              { id: 'high_iv', label: 'High Volatility (IV)' },
            ].map((flt) => (
              <button
                key={flt.id}
                onClick={() => setStockFilter(flt.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  stockFilter === flt.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {flt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stock F&O Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Ticker</th>
                <th className="py-3.5 px-4">Spot Price</th>
                <th className="py-3.5 px-4">Day Change</th>
                <th className="py-3.5 px-4">OI Change</th>
                <th className="py-3.5 px-4">Volume</th>
                <th className="py-3.5 px-4">Implied Volatility (IV)</th>
                <th className="py-3.5 px-4">F&O Status</th>
                <th className="py-3.5 px-4 text-right">ArthSetu F&O Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-semibold">
              {filteredStocks.map((stk) => (
                <tr 
                  key={stk.symbol} 
                  onClick={() => onSelectStock({ symbol: stk.symbol, name: stk.name, price: stk.price })}
                  className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-slate-900 group-hover:text-[#2563EB] transition-colors">{stk.symbol}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{stk.name}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">₹{stk.price}</td>
                  <td className="py-3.5 px-4">
                    <span className={`font-bold ${stk.change.startsWith('+') ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                      {stk.change}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-blue-700">{stk.oiChg}</td>
                  <td className="py-3.5 px-4 text-slate-600">{stk.volume}</td>
                  <td className="py-3.5 px-4 text-slate-700">{stk.iv}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-extrabold text-xs">
                      {stk.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <span className="font-black text-[#2563EB] text-sm">{stk.viewScore}/100</span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#2563EB] transition-colors" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 9. UNUSUAL F&O ACTIVITY & VOLATILITY WATCH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Unusual Derivatives Activity */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Unusual Derivatives Activity</h3>
            <p className="text-xs text-slate-500 font-medium">Detecting institutional positioning outliers and volume spikes</p>
          </div>

          <div className="space-y-3">
            {UNUSUAL_ACTIVITY.map((ua, i) => (
              <div key={i} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-sm">{ua.symbol}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-black">
                    {ua.impact}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-800">{ua.title}</div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  <strong>Interpretation:</strong> "{ua.interpretation}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Volatility Watch */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Volatility Watch</h3>
            <button
              onClick={() => setActiveEducationModal(EDUCATION_ITEMS.iv)}
              className="text-xs font-bold text-[#2563EB] hover:underline"
            >
              What is IV/VIX?
            </button>
          </div>

          <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#2563EB] uppercase tracking-wider">India VIX</span>
              <span className="text-xs font-bold text-rose-600">-2.10% Today</span>
            </div>
            <div className="text-2xl font-black text-slate-900">14.85</div>
            <p className="text-xs text-slate-600 font-medium leading-tight">
              "Rising volatility indicates increased uncertainty in near-term market expectations."
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Highest IV Stocks</span>
            <div className="divide-y divide-slate-100">
              <div className="py-2 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-900">TATASTEEL</span>
                <span className="text-rose-600">31.2% IV</span>
              </div>
              <div className="py-2 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-900">TATAMOTORS</span>
                <span className="text-rose-600">28.5% IV</span>
              </div>
              <div className="py-2 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-900">INFY</span>
                <span className="text-slate-700">24.1% IV</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 10. UPCOMING EXPIRY INTELLIGENCE */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-lg">Upcoming Expiry Intelligence</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] font-black text-xs">
                Weekly Index Settlement
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">NIFTY Weekly Expiry — 18 Sep 2026 (3 Days Remaining)</p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-400 block">PCR Ratio</span>
            <span className="text-lg font-black text-[#2563EB]">1.08</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase">Total Call OI</span>
            <div className="text-base font-black text-rose-600 mt-0.5">₹1,84,200 Cr</div>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase">Total Put OI</span>
            <div className="text-base font-black text-emerald-600 mt-0.5">₹1,98,900 Cr</div>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase">Largest Call Position</span>
            <div className="text-base font-black text-slate-900 mt-0.5">25,000 CE</div>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase">Largest Put Position</span>
            <div className="text-base font-black text-slate-900 mt-0.5">24,700 PE</div>
          </div>
        </div>

        <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100/90 space-y-1">
          <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-emerald-900">What This Means</h4>
          <p className="text-xs text-slate-700 font-medium leading-relaxed">
            Put open interest slightly outweighs Call open interest, indicating options writers are comfortable writing puts at 24,700. However, high Call concentration at 25,000 creates a defined trading band leading up to Thursday settlement.
          </p>
        </div>
      </div>

      {/* 11. ARTHSETU F&O RESEARCH INSIGHTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">ArthSetu F&O Insights</h2>
          <span className="text-xs text-slate-500 font-medium">Curated derivatives research observations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ARTHSETU_FNO_INSIGHTS.map((ins, idx) => (
            <div key={idx} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#2563EB]/40 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{ins.icon}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                    {ins.tag}
                  </span>
                </div>
                <h3 className="font-black text-slate-900 text-base">{ins.headline}</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {ins.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-black text-[#2563EB]">{ins.contract}</span>
                <button
                  onClick={() => onSelectStock({ symbol: 'NIFTY' })}
                  className="font-extrabold text-[#2563EB] hover:underline inline-flex items-center gap-1"
                >
                  <span>Explore</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EDUCATIONAL MODAL POPUP */}
      <AnimatePresence>
        {activeEducationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 relative"
            >
              <button 
                onClick={() => setActiveEducationModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-[#2563EB]">
                <HelpCircle className="w-5 h-5" />
                <h3 className="font-extrabold text-base text-slate-900">{activeEducationModal.title}</h3>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {activeEducationModal.explanation}
              </p>

              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 text-xs space-y-1">
                <span className="font-extrabold text-[#2563EB] block">Practical Example:</span>
                <p className="text-slate-700 font-medium whitespace-pre-line">
                  {activeEducationModal.example}
                </p>
              </div>

              <button
                onClick={() => setActiveEducationModal(null)}
                className="w-full py-2.5 bg-[#2563EB] text-white text-xs font-black rounded-xl hover:bg-[#0B1F33] transition-colors"
              >
                Got it, close explanation
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default FnOIntelligenceCenter;
