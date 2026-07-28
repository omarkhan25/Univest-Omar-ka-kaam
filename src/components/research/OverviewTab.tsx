import React from 'react';
import { 
  Sparkles, TrendingUp, TrendingDown, ArrowRight, ShieldCheck, 
  Activity, Star, BarChart3, AlertCircle, Eye
} from 'lucide-react';
import { motion } from 'framer-motion';

interface OverviewTabProps {
  onNavigateTab: (tabId: string) => void;
  onOpenAiAdvisor: (advisorId?: string) => void;
  onSelectResearchCall?: (call: any) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  onNavigateTab,
  onOpenAiAdvisor,
  onSelectResearchCall
}) => {

  const featuredReports = [
    {
      company: 'Reliance Industries',
      symbol: 'RELIANCE',
      rating: 'BUY',
      target: '₹3,375',
      upside: '+14%',
      risk: 'Low',
      confidence: '94%',
      summary: 'Reliance Industries is poised for expansion across digital services and green energy setups. Reliances strong balance sheet and robust retail margins support a structural valuation breakout.'
    },
    {
      key: 'hdfc',
      company: 'HDFC Bank Ltd',
      symbol: 'HDFCBANK',
      rating: 'BUY',
      target: '₹1,950',
      upside: '+16%',
      risk: 'Low',
      confidence: '92%',
      summary: 'Net Interest Margins are stabilizing as post-merger integration dynamics settle. Credit demand remains strong across retail segments.'
    },
    {
      key: 'tata',
      company: 'Tata Motors Ltd',
      symbol: 'TATAMOTORS',
      rating: 'BUY',
      target: '₹1,180',
      upside: '+18%',
      risk: 'Medium',
      confidence: '89%',
      summary: 'Market leadership in domestic electric passenger vehicles coupled with JLR debt reduction targets positions Tata Motors for continuous margin upgrades.'
    }
  ];

  const quickInsights = [
    { title: 'Most Bullish Sector', value: 'Healthcare', icon: TrendingUp, trend: 'Outperforming', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { title: 'Most Bearish', value: 'IT Sector', icon: TrendingDown, trend: 'Correction', color: 'bg-rose-50 text-rose-600 border-rose-100' },
    { title: 'Best Momentum', value: 'Banking', icon: Activity, trend: 'Buying Inflows', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { title: 'Highest Volume', value: 'Energy', icon: BarChart3, trend: 'Institutional Flows', color: 'bg-amber-50 text-amber-600 border-amber-100' }
  ];

  const todayPicks = [
    { company: 'Reliance Industries', symbol: 'RELIANCE', rating: 'BUY', target: '₹3,375', upside: '+14%', confidence: '94%' },
    { company: 'HDFC Bank Ltd', symbol: 'HDFCBANK', rating: 'BUY', target: '₹1,950', upside: '+16%', confidence: '92%' },
    { company: 'Tata Motors Ltd', symbol: 'TATAMOTORS', rating: 'BUY', target: '₹1,180', upside: '+18%', confidence: '89%' },
    { company: 'State Bank of India', symbol: 'SBIN', rating: 'BUY', target: '₹840', upside: '+11%', confidence: '91%' },
    { company: 'Infosys Ltd', symbol: 'INFY', rating: 'HOLD', target: '₹1,620', upside: '+3%', confidence: '85%' }
  ];

  return (
    <div className="flex flex-col gap-10 w-full font-sans text-slate-800 animate-in fade-in duration-500 pb-16">
      
      {/* 1. LARGE HERO MAGAZINE COVER */}
      <div className="relative overflow-hidden rounded-[32px] bg-[#0A0F1D] text-white border border-slate-800 p-8 md:p-12 shadow-2xl flex flex-col justify-between min-h-[360px]">
        {/* Decorative background visual elements */}
        <div className="absolute right-0 top-0 w-[45%] h-full bg-gradient-to-l from-blue-600/10 via-emerald-500/5 to-transparent pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Header line */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-blue-500/20 border border-blue-500/30 text-blue-300 px-3 py-1 rounded">Today's Research</span>
            <span className="text-xs font-bold text-slate-400">Vol. {new Date().getFullYear()} • Issue {new Date().getMonth() + 1}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-black uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Market: Bullish
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Top Opportunity</span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight mb-4">
              Structural Upside in Private Banking & Financials
            </h1>
            <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed">
              Favorable credit trends, margin stabilization and post-merger consolidations indicate a major entry window across primary private lenders.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md shrink-0">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AI Confidence Score</span>
              <span className="text-2xl font-black text-white flex items-center gap-1.5 mt-0.5">
                92% <span className="text-xs text-emerald-400 font-bold">Very Strong</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FEATURED RESEARCH ARTICLES */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Star className="w-4.5 h-4.5 text-blue-600 fill-blue-600" />
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">Featured Research</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredReports.map((r, i) => (
            <motion.div
              key={r.symbol}
              whileHover={{ y: -4 }}
              onClick={() => onSelectResearchCall?.(r)}
              className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-black px-2.5 py-1 rounded-lg">
                    {r.rating}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                    <span>AI Confidence:</span>
                    <span className="text-slate-900 font-black">{r.confidence}</span>
                  </div>
                </div>

                <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                  {r.company}
                </h3>
                <span className="text-[10px] font-bold text-slate-400 block mt-0.5 mb-3">{r.symbol} • Risk: {r.risk}</span>

                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 font-medium mb-6">
                  {r.summary}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-auto flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block">TARGET PRICE</span>
                  <span className="text-sm font-black text-slate-900">{r.target} <span className="text-xs text-emerald-600 font-bold">{r.upside}</span></span>
                </div>
                <span className="text-xs font-black text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-all">
                  Read Report <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. AI QUICK INSIGHTS */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Activity className="w-4.5 h-4.5 text-blue-600" />
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">AI Quick Insights</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickInsights.map((insight, idx) => {
            const Icon = insight.icon;
            return (
              <div 
                key={idx} 
                className="bg-white border border-slate-200 rounded-[22px] p-5 shadow-xs flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">{insight.title}</span>
                  <span className="text-base font-black text-slate-900">{insight.value}</span>
                  <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">{insight.trend}</span>
                </div>
                <div className={`p-2.5 rounded-xl border shrink-0 ${insight.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. TODAY'S RESEARCH PICKS */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 text-blue-600" />
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">Today's Research Picks</h2>
          </div>
          <span className="text-[10px] font-bold text-slate-400">Showing top 5 opportunities</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-[28px] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-wider">Company</th>
                  <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-wider">Rating</th>
                  <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-wider">Target</th>
                  <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-wider">Upside</th>
                  <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-wider">AI Confidence</th>
                  <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {todayPicks.map((pick, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-900">{pick.company}</span>
                        <span className="text-[10px] text-slate-400 font-bold">{pick.symbol}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        pick.rating === 'BUY' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {pick.rating}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs font-black text-slate-900">{pick.target}</td>
                    <td className="py-4 px-6 text-xs font-black text-emerald-600">{pick.upside}</td>
                    <td className="py-4 px-6 text-xs font-medium text-slate-600">{pick.confidence}</td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => onSelectResearchCall?.(pick)}
                        className="text-[10px] font-black text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
                      >
                        Read Report <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default OverviewTab;
