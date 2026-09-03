import React, { useState } from 'react';
import { 
  Radio, Sparkles, Zap, ShieldCheck, 
  ChevronRight, Calendar, BarChart3, TrendingUp,
  ArrowUpRight, Target, Award, CheckCircle2
} from 'lucide-react';

interface AiMarketRadarHubProps {
  onSelectStock?: (stock: any) => void;
  onNavigateTab?: (tab: string) => void;
}

interface SignalItem {
  symbol: string;
  name: string;
  price: string;
  changePercent: number;
  aiScore: number;
  targetPrice: string;
  upside: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  signalType: 'Strong Buy' | 'Breakout' | 'Accumulate' | 'Momentum';
  rationale: string;
  catalyst: string;
  badgeBg: string;
}

const HIGH_CONVICTION_SIGNALS: SignalItem[] = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    price: '2,975.80',
    changePercent: 2.35,
    aiScore: 94,
    targetPrice: '₹3,450',
    upside: '+15.9%',
    riskLevel: 'Low',
    signalType: 'Strong Buy',
    rationale: 'Telecom tariff hikes combined with margin expansion in oil-to-chemicals segment.',
    catalyst: 'New Energy Giga-Factory commissioning schedule & Q4 earnings rally.',
    badgeBg: 'bg-emerald-500/15 text-emerald-800 border-emerald-200'
  },
  {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd.',
    price: '985.40',
    changePercent: 1.85,
    aiScore: 89,
    targetPrice: '₹1,160',
    upside: '+17.7%',
    riskLevel: 'Moderate',
    signalType: 'Breakout',
    rationale: 'Domestic EV market leadership and strong free-cash-flow generation from JLR.',
    catalyst: 'De-merger value unlocking into Commercial and Passenger EV entities.',
    badgeBg: 'bg-blue-500/15 text-blue-800 border-blue-200'
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    price: '1,678.40',
    changePercent: 1.81,
    aiScore: 91,
    targetPrice: '₹1,950',
    upside: '+16.2%',
    riskLevel: 'Low',
    signalType: 'Accumulate',
    rationale: 'Loan-to-deposit ratio normalization with NIM expansion bottoming out.',
    catalyst: 'FII institutional inflows returning to mega-cap private banking.',
    badgeBg: 'bg-sky-500/15 text-sky-800 border-sky-200'
  },
  {
    symbol: 'BHARTIARTL',
    name: 'Bharti Airtel Ltd.',
    price: '1,540.00',
    changePercent: 1.85,
    aiScore: 87,
    targetPrice: '₹1,780',
    upside: '+15.6%',
    riskLevel: 'Low',
    signalType: 'Momentum',
    rationale: 'Consolidated ARPU expanding past ₹230 benchmark with sustained 5G adoption.',
    catalyst: 'Africa subsidiary debt reduction and premium postpaid expansion.',
    badgeBg: 'bg-purple-500/15 text-purple-800 border-purple-200'
  }
];

const SECTOR_MOMENTUM = [
  {
    sector: 'Defense & Aerospace',
    flow: '+3.1% Inflow Surge',
    isPositive: true,
    momentumScore: 95,
    topMover: { symbol: 'HAL', name: 'Hindustan Aeronautics', price: '4,820.00', change: '+2.65%' },
    catalyst: '₹45,000 Cr domestic defense procurement approvals'
  },
  {
    sector: 'IT Services & Tech',
    flow: '+2.4% Institutional Inflow',
    isPositive: true,
    momentumScore: 88,
    topMover: { symbol: 'INFY', name: 'Infosys Ltd.', price: '1,634.20', change: '+0.92%' },
    catalyst: 'US Fed interest rate cut expectations & BFSI deal renewals'
  },
  {
    sector: 'Banking & Financials',
    flow: '+1.8% Net Inflow',
    isPositive: true,
    momentumScore: 84,
    topMover: { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: '1,678.40', change: '+1.81%' },
    catalyst: 'Credit growth holding strong at 14.2% YoY'
  },
  {
    sector: 'Automotive & Mobility',
    flow: '-0.4% Consolidation',
    isPositive: false,
    momentumScore: 62,
    topMover: { symbol: 'M&M', name: 'Mahindra & Mahindra', price: '2,890.00', change: '+2.10%' },
    catalyst: 'Festive season vehicle dispatch volume tracking'
  }
];

const CATALYST_EVENTS = [
  {
    date: '28 MAY 2025',
    title: 'Reliance Industries Q4 Results & Dividend Board Meeting',
    symbol: 'RELIANCE',
    impact: 'High Impact',
    impactBg: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
    desc: 'Consolidated EBITDA expected at ₹42,500 Cr with commentary on retail IPO timeline.'
  },
  {
    date: '30 MAY 2025',
    title: 'HDFC Bank Institutional Analyst Meet',
    symbol: 'HDFCBANK',
    impact: 'Medium Impact',
    impactBg: 'bg-blue-50 text-blue-800 border border-blue-200/80',
    desc: 'Management presentation on deposit growth trajectory and branch network expansion.'
  },
  {
    date: '04 JUN 2025',
    title: 'RBI Monetary Policy Committee Rate Decision',
    symbol: 'MARKET',
    impact: 'Critical Impact',
    impactBg: 'bg-amber-50 text-amber-900 border border-amber-200/80',
    desc: 'Consensus expects 25 bps repo rate cut; key catalyst for Rate Sensitives & Real Estate.'
  },
  {
    date: '06 JUN 2025',
    title: 'TCS Ex-Dividend Date (₹28.00 / Share)',
    symbol: 'TCS',
    impact: 'Dividend Alert',
    impactBg: 'bg-purple-50 text-purple-800 border border-purple-200/80',
    desc: 'Final dividend payout record date for eligible shareholders.'
  }
];

export const AiMarketRadarHub: React.FC<AiMarketRadarHubProps> = ({
  onSelectStock,
  onNavigateTab
}) => {
  const [activeTab, setActiveTab] = useState<'signals' | 'momentum' | 'catalysts'>('signals');

  return (
    <div className="p-6 md:p-7 bg-white rounded-[28px] border border-[#E2E8F0] shadow-2xs space-y-6">
      
      {/* HEADER WITH SEGMENTED TABS BELOW HEADING */}
      <div className="space-y-4 border-b border-slate-100 pb-5">
        
        {/* Title, Icon & Live Indicator Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 shrink-0 rounded-2xl bg-gradient-to-br from-[#123B63] to-[#15519D] text-white flex items-center justify-center shadow-md border border-white/20">
              <Radio className="w-5.5 h-5.5 animate-pulse text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  ArthSetu AI Intelligence & Market Radar
                </h2>
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-extrabold text-xs border border-emerald-500/20 flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Signals
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Real-time conviction scores, sector flows & market catalyst tracking
              </p>
            </div>
          </div>
        </div>

        {/* Segmented Navigation Tabs (Placed Below Heading) */}
        <div className="pt-1">
          <div className="inline-flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/70 text-xs overflow-x-auto max-w-full scrollbar-none shadow-2xs">
            <button
              onClick={() => setActiveTab('signals')}
              className={`px-4 py-2 rounded-xl font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'signals'
                  ? 'bg-white text-[#15519D] shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className={`w-4 h-4 ${activeTab === 'signals' ? 'text-[#15519D]' : 'text-slate-400'}`} />
              <span>AI Alpha Signals</span>
            </button>

            <button
              onClick={() => setActiveTab('momentum')}
              className={`px-4 py-2 rounded-xl font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'momentum'
                  ? 'bg-white text-[#15519D] shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className={`w-4 h-4 ${activeTab === 'momentum' ? 'text-[#15519D]' : 'text-slate-400'}`} />
              <span>Sector Momentum</span>
            </button>

            <button
              onClick={() => setActiveTab('catalysts')}
              className={`px-4 py-2 rounded-xl font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'catalysts'
                  ? 'bg-white text-[#15519D] shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className={`w-4 h-4 ${activeTab === 'catalysts' ? 'text-[#15519D]' : 'text-slate-400'}`} />
              <span>Market Catalysts</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB CONTENT 1: AI ALPHA SIGNALS */}
      {activeTab === 'signals' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {HIGH_CONVICTION_SIGNALS.map((sig) => (
              <div
                key={sig.symbol}
                onClick={() => onSelectStock && onSelectStock({ symbol: sig.symbol, name: sig.name, price: sig.price })}
                className="p-5 bg-white hover:bg-slate-50/50 rounded-2xl border border-slate-200/90 hover:border-[#15519D]/40 transition-all duration-300 cursor-pointer space-y-4 shadow-2xs hover:shadow-lg group relative overflow-hidden"
              >
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl font-black text-xs flex items-center justify-center shrink-0 shadow-2xs border ${sig.badgeBg}`}>
                      {sig.symbol.substring(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-black text-slate-900 text-sm group-hover:text-[#15519D] transition-colors">{sig.symbol}</div>
                      <div className="text-xs text-slate-500 font-semibold truncate max-w-[170px]">{sig.name}</div>
                    </div>
                  </div>

                  {/* AI Score Glowing Badge */}
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-xs shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Score {sig.aiScore}/100</span>
                  </div>
                </div>

                {/* Metrics Grid Box */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Price</span>
                    <span className="font-black text-slate-900 font-mono text-sm">₹{sig.price}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AI Target</span>
                    <span className="font-black text-emerald-700 font-mono text-sm">{sig.targetPrice}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Upside</span>
                    <span className="font-black text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg text-xs inline-block mt-0.5">
                      {sig.upside}
                    </span>
                  </div>
                </div>

                {/* AI Rationale Box */}
                <div className="p-3.5 bg-[#F8FAFC] rounded-xl border-l-4 border-[#15519D] text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>AI Thesis & Rationale</span>
                    <span className="text-emerald-700 font-black px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200">{sig.signalType}</span>
                  </div>
                  <p className="text-slate-800 font-medium leading-relaxed">{sig.rationale}</p>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-1 text-xs font-extrabold text-[#15519D]">
                  <span className="text-slate-400 text-[11px] font-semibold truncate max-w-[200px]">Catalyst: {sig.catalyst}</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                    <span>Inspect Thesis</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-medium">Updated live by ArthSetu Neural Engine</span>
            <button
              onClick={() => onNavigateTab && onNavigateTab('Research')}
              className="text-[#15519D] font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All 24 AI Signals</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: SECTOR MOMENTUM */}
      {activeTab === 'momentum' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SECTOR_MOMENTUM.map((item) => (
              <div
                key={item.sector}
                className="p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 transition-all shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="font-black text-slate-900 text-sm">{item.sector}</h3>
                    <span className={`text-xs font-extrabold ${item.isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {item.flow}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Momentum Score</span>
                    <span className="text-sm font-black text-[#15519D] font-mono">{item.momentumScore}/100</span>
                  </div>
                </div>

                {/* Momentum Progress Bar */}
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.isPositive ? 'bg-gradient-to-r from-blue-600 to-emerald-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${item.momentumScore}%` }}
                  />
                </div>

                {/* Top Mover Chip */}
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Top Sector Stock</span>
                    <span className="font-extrabold text-slate-900">{item.topMover.symbol} <span className="text-slate-500 font-normal">({item.topMover.name})</span></span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-slate-900 font-mono">₹{item.topMover.price}</span>
                    <span className="text-emerald-700 font-extrabold text-xs block">{item.topMover.change}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-medium">
                  <strong className="text-slate-900 font-bold">Key Driver:</strong> {item.catalyst}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100 text-xs">
            <button
              onClick={() => onNavigateTab && onNavigateTab('Markets')}
              className="text-[#15519D] font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Sector Heatmap in Markets</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}



      {/* TAB CONTENT 4: MARKET CATALYSTS */}
      {activeTab === 'catalysts' && (
        <div className="space-y-3.5">
          {CATALYST_EVENTS.map((evt) => (
            <div 
              key={evt.title} 
              className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs group"
            >
              <div className="flex items-start gap-4">
                <div className="px-3.5 py-2.5 bg-slate-900 text-white rounded-xl font-extrabold text-xs font-mono text-center shrink-0 shadow-2xs">
                  {evt.date}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-[#15519D] transition-colors">{evt.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${evt.impactBg}`}>
                      {evt.impact}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{evt.desc}</p>
                </div>
              </div>

              <button
                onClick={() => onSelectStock && onSelectStock({ symbol: evt.symbol, name: evt.title, price: '—' })}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold rounded-xl shrink-0 transition-colors self-end sm:self-auto cursor-pointer"
              >
                Event Details
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AiMarketRadarHub;
