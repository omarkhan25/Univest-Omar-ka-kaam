import React, { useState, useMemo } from 'react';
import { 
  Radio, ShieldCheck, ArrowRight, Bookmark, Clock, 
  ChevronLeft, ChevronRight, Share2, Heart, Star
} from 'lucide-react';
import { motion } from 'framer-motion';

export interface ResearchCallItem {
  id: string;
  symbol: string;
  companyName: string;
  exchange: 'NSE' | 'BSE' | 'MCX';
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  entryRange: string;
  targetPrice: number;
  stopLoss: number;
  currentPrice: number;
  potentialReturn: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  confidenceScore: number;
  horizon: string;
  summary: string;
  status: 'ACTIVE' | 'TARGET_HIT' | 'STOP_LOSS_HIT';
  publishedTime: string;
}

const MOCK_RESEARCH_CALLS: ResearchCallItem[] = [
  {
    id: 'rc-1',
    symbol: 'RELIANCE',
    companyName: 'Reliance Industries Ltd',
    exchange: 'NSE',
    recommendation: 'BUY',
    entryRange: '₹2,920 - ₹2,940',
    targetPrice: 3375,
    stopLoss: 2838,
    currentPrice: 2934.50,
    potentialReturn: 14.2,
    riskLevel: 'Low',
    confidenceScore: 94,
    horizon: 'Swing',
    summary: 'Consolidation breakout verified on daily frames. Hydrogen commissioning projected to trigger re-rating.',
    status: 'ACTIVE',
    publishedTime: '10:15 AM'
  },
  {
    id: 'rc-2',
    symbol: 'HDFCBANK',
    companyName: 'HDFC Bank Limited',
    exchange: 'NSE',
    recommendation: 'BUY',
    entryRange: '₹1,675 - ₹1,685',
    targetPrice: 1950,
    stopLoss: 1610,
    currentPrice: 1682.40,
    potentialReturn: 16.0,
    riskLevel: 'Low',
    confidenceScore: 92,
    horizon: 'Long Term',
    summary: 'Q1 net interest margin bottomed out. Credit growth expanding 16% YoY across retail sectors.',
    status: 'ACTIVE',
    publishedTime: '9:30 AM'
  },
  {
    id: 'rc-3',
    symbol: 'TATAMOTORS',
    companyName: 'Tata Motors Ltd',
    exchange: 'NSE',
    recommendation: 'BUY',
    entryRange: '₹980 - ₹995',
    targetPrice: 1180,
    stopLoss: 940,
    currentPrice: 996.10,
    potentialReturn: 18.0,
    riskLevel: 'Medium',
    confidenceScore: 89,
    horizon: 'Swing',
    summary: 'Strong JLR margins and market leadership in domestic EV transition continue to drive upgrades.',
    status: 'ACTIVE',
    publishedTime: 'Yesterday'
  },
  {
    id: 'rc-4',
    symbol: 'INFY',
    companyName: 'Infosys Limited',
    exchange: 'NSE',
    recommendation: 'HOLD',
    entryRange: '₹1,560 - ₹1,570',
    targetPrice: 1620,
    stopLoss: 1520,
    currentPrice: 1562.10,
    potentialReturn: 3.0,
    riskLevel: 'Medium',
    confidenceScore: 85,
    horizon: 'Swing',
    summary: 'IT sector spending shows gradual bottoming out; holding positions recommended ahead of key client cycles.',
    status: 'ACTIVE',
    publishedTime: '3 days ago'
  }
];

interface LiveCallsTabProps {
  onSelectCall: (call: any) => void;
  onTradeCall: (call: any) => void;
  calls?: any[];
}

export const LiveCallsTab: React.FC<LiveCallsTabProps> = ({
  onSelectCall,
  onTradeCall
}) => {
  const [filter, setFilter] = useState<'ALL' | 'BUY' | 'SELL' | 'HOLD'>('ALL');
  const [watchlist, setWatchlist] = useState<string[]>([]);

  const filteredCalls = useMemo(() => {
    return MOCK_RESEARCH_CALLS.filter(call => {
      if (filter === 'ALL') return true;
      return call.recommendation === filter;
    });
  }, [filter]);

  const toggleWatchlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWatchlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans text-slate-800 animate-in fade-in duration-300">
      
      {/* Tab Filter bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-xl">
          {(['ALL', 'BUY', 'SELL', 'HOLD'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                filter === r ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <span className="text-[10px] font-bold text-slate-400">
          Showing {filteredCalls.length} active calls
        </span>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCalls.map((call) => (
          <motion.div
            key={call.id}
            whileHover={{ y: -3 }}
            className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${
                    call.recommendation === 'BUY' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    call.recommendation === 'SELL' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                    'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    {call.recommendation}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {call.publishedTime}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400">AI Score: <strong className="text-slate-900 font-black">{call.confidenceScore}%</strong></span>
                  <button 
                    onClick={(e) => toggleWatchlist(call.id, e)}
                    className="p-1.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <Star className={`w-3.5 h-3.5 ${watchlist.includes(call.id) ? 'fill-yellow-400 text-yellow-500' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Company Info */}
              <h3 className="text-base font-black text-slate-900 leading-tight">{call.companyName}</h3>
              <span className="text-[10px] font-bold text-slate-400 block mt-0.5 mb-4">{call.symbol} • Risk: {call.riskLevel}</span>

              {/* Price Details */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-100 p-3.5 rounded-2xl mb-4">
                <div>
                  <span className="text-[9px] uppercase text-slate-400 block font-bold">Current</span>
                  <span className="text-xs font-black text-slate-900">₹{call.currentPrice}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-slate-400 block font-bold">Target</span>
                  <span className="text-xs font-black text-emerald-600">₹{call.targetPrice}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-slate-400 block font-bold">Stop Loss</span>
                  <span className="text-xs font-black text-rose-600">₹{call.stopLoss}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 font-medium mb-6">
                {call.summary}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-4">
              <span className="text-xs font-black text-emerald-600">{call.potentialReturn}% Potential Upside</span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectCall(call)}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold transition cursor-pointer"
                >
                  Read Report
                </button>
                <button
                  onClick={() => onTradeCall(call)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-xs"
                >
                  Trade
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LiveCallsTab;
