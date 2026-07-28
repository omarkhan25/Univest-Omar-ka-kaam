import React, { useState } from 'react';
import { 
  Sun, Sunset, Moon, Activity, Landmark, Globe, Calendar, Eye, 
  TrendingUp, TrendingDown, RefreshCw, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export const MarketOutlookTab: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<'morning' | 'midday' | 'closing'>('morning');

  const segmentContent = {
    morning: {
      time: '8:30 AM IST',
      title: 'Pre-Market & Setup',
      summary: 'NIFTY looks poised for a positive open tracking bullish global cues and strong FII flows. Expected support at 22,050 and immediate resistance at 22,250.',
    },
    midday: {
      time: '12:45 PM IST',
      title: 'Intraday Trend & Volatility',
      summary: 'Markets are trading in a narrow range. Bank Nifty is outperforming led by private banks, while IT sector drags following cautious guidance from global peers.',
    },
    closing: {
      time: '3:45 PM IST',
      title: 'Closing Bell & Post-Market Analysis',
      summary: 'NIFTY closed at record highs, gaining +120 points (+0.54%). Heavy FII buying in late trade fueled a rally across capital goods and financial stocks.',
    }
  };

  const currentSegment = segmentContent[activeSegment];

  return (
    <div className="w-full flex flex-col gap-8 font-sans text-slate-800 animate-in fade-in duration-300">
      {/* Magazine Editorial Header */}
      <div className="border-y border-slate-200 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 px-4 rounded-xl">
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded">Daily Edition</span>
          <span className="text-xs font-bold text-slate-400">Last updated: {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Analysis Active
        </div>
      </div>

      {/* Segment Switcher */}
      <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs max-w-md">
        {(['morning', 'midday', 'closing'] as const).map((seg) => {
          const Icon = seg === 'morning' ? Sun : seg === 'midday' ? Activity : Sunset;
          const isActive = activeSegment === seg;
          return (
            <button
              key={seg}
              onClick={() => setActiveSegment(seg)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-black capitalize transition-all cursor-pointer ${
                isActive ? 'bg-[#0F172A] text-white shadow-xs' : 'text-slate-500 hover:text-[#0F172A] hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {seg}
            </button>
          );
        })}
      </div>

      {/* Active Segment Editorial Card */}
      <motion.div 
        key={activeSegment}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-[28px] p-6 md:p-8 shadow-xs relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{currentSegment.time}</span>
            <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
            <span className="text-xs font-bold text-slate-500">{currentSegment.title}</span>
          </div>
          <h2 className="text-2xl font-black text-[#0F172A] tracking-tight max-w-xl">{currentSegment.summary}</h2>
        </div>
      </motion.div>

      {/* Structured Editorial Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Section 1: Market Summary */}
        <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-black text-sm text-[#0F172A] flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-blue-600" /> Market Summary
            </h3>
            <p className="text-xs font-medium text-slate-600 leading-relaxed">
              Equities remain positive with Nifty holding comfortably above short-term moving averages. Volatility Index (VIX) contracted by 3.2% reflecting lower pricing risk for short-duration options.
            </p>
          </div>
          <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400">TREND</span>
            <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Bullish Consolidation
            </span>
          </div>
        </div>

        {/* Section 2: Sector Rotation */}
        <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-black text-sm text-[#0F172A] flex items-center gap-2 mb-4">
              <RefreshCw className="w-4 h-4 text-orange-500" /> Sector Rotation
            </h3>
            <p className="text-xs font-medium text-slate-600 leading-relaxed">
              Defensive sectors like FMCG and Pharma are cooling off. Capital flows are shifting rapidly back into cyclical groups — predominantly Banking, Capital Goods, and Infrastructure providers.
            </p>
          </div>
          <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400">LEADER</span>
            <span className="text-[10px] font-black text-blue-600 uppercase">Private Banks</span>
          </div>
        </div>

        {/* Section 3: Global Markets */}
        <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-black text-sm text-[#0F172A] flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-purple-600" /> Global Markets
            </h3>
            <p className="text-xs font-medium text-slate-600 leading-relaxed">
              Wall Street ended flat as treasury yields edged higher. Asian markets are trading mixed with Nikkei down slightly and Hang Seng recovering on tech sector gains.
            </p>
          </div>
          <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400">GIFT NIFTY</span>
            <span className="text-[10px] font-black text-emerald-600">+48.5 pts</span>
          </div>
        </div>

        {/* Section 4: FII / DII Activity */}
        <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-black text-sm text-[#0F172A] flex items-center gap-2 mb-4">
              <Landmark className="w-4 h-4 text-indigo-600" /> FII & DII Flows
            </h3>
            <div className="space-y-2 mt-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">FII Net Value</span>
                <span className="font-black text-emerald-600">+₹1,842.60 Cr</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">DII Net Value</span>
                <span className="font-black text-rose-600">-₹420.10 Cr</span>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-4 mt-4 text-[10px] font-bold text-slate-400 text-right">
            Cash Market provisional figures
          </div>
        </div>

        {/* Section 5: Key Events */}
        <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-black text-sm text-[#0F172A] flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-rose-500" /> Key Macro Events
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400">THURSDAY</span>
                <p className="font-bold text-slate-700">RBI Monetary Policy Announcement</p>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400">FRIDAY</span>
                <p className="font-bold text-slate-700">US Non-Farm Payrolls (NFP) Data</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-4 mt-4 text-[10px] font-bold text-slate-400">
            Highly critical for market direction
          </div>
        </div>

        {/* Section 6: Tomorrow's Watchlist */}
        <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-black text-sm text-[#0F172A] flex items-center gap-2 mb-4">
              <Eye className="w-4 h-4 text-emerald-600" /> Tomorrow's Watchlist
            </h3>
            <div className="flex flex-col gap-1.5">
              {['HDFCBANK', 'RELIANCE', 'TATASTEEL'].map((sym) => (
                <div key={sym} className="flex justify-between items-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  <span className="text-xs font-black text-slate-900">{sym}</span>
                  <span className="text-[10px] font-bold text-blue-600">Earnings Outlook</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-100 pt-4 mt-4 text-[10px] font-bold text-slate-400">
            Earnings calendar focus
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketOutlookTab;
