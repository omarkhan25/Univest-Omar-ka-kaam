import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, ShieldCheck, Sparkles, AlertTriangle, 
  TrendingUp, Calendar, Heart, Share2, DollarSign, 
  Percent, PieChart, Star
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ResearchDetailProps {
  isOpen: boolean;
  onClose: () => void;
  research?: any;
  onTrade?: (researchData: any) => void;
}

export const ResearchDetail: React.FC<ResearchDetailProps> = ({
  isOpen,
  onClose,
  research,
  onTrade
}) => {
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !research) return null;

  // Normalize data fields
  const companyName = research.company || research.companyName || 'Reliance Industries Ltd';
  const symbol = research.symbol || 'RELIANCE';
  const recommendation = research.rating || research.rec || 'BUY';
  const targetPrice = research.target || '₹3,375';
  const stopLoss = research.stop || research.stopLoss || '₹2,838';
  const upside = research.upside || '+14%';
  const confidence = research.confidence || '94%';
  const risk = research.risk || 'Low';
  const summary = research.summary || 'Reliance Industries is poised for expansion across digital services and green energy setups. Reliances strong balance sheet and robust retail margins support a structural valuation breakout.';

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Removed from saved research' : 'Saved research to Saved tab');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#F8FAFC] overflow-y-auto flex flex-col"
    >
      {/* Sticky Premium Header */}
      <header className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-30 shadow-xs">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Research
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleSave}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer text-slate-500 hover:text-slate-900"
            title="Save Research"
          >
            <Star className={`w-4 h-4 ${isSaved ? 'fill-yellow-400 text-yellow-500' : ''}`} />
          </button>
          <button 
            onClick={() => {
              onTrade?.(research);
            }}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer transition"
          >
            Trade Now
          </button>
        </div>
      </header>

      {/* Editorial Content Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-10 md:py-16 flex flex-col gap-10">
        
        {/* 1. HERO HEADER */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase ${
              recommendation === 'BUY' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
            }`}>
              {recommendation} Recommendation
            </span>
            <span className="text-[10px] font-bold text-slate-400">PUBLISHED TODAY</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-[#0F172A] tracking-tight leading-tight">
            {companyName} ({symbol})
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 font-bold border-y border-slate-200/80 py-4 mt-2">
            <div>Target: <strong className="text-slate-900 font-black">{targetPrice}</strong> <span className="text-emerald-600">({upside} Upside)</span></div>
            <div className="h-4 w-px bg-slate-200" />
            <div>Stop Loss: <strong className="text-rose-600 font-black">{stopLoss}</strong></div>
            <div className="h-4 w-px bg-slate-200" />
            <div>Risk Profile: <strong className="text-slate-900 font-black">{risk}</strong></div>
            <div className="h-4 w-px bg-slate-200" />
            <div>AI Confidence: <strong className="text-blue-600 font-black">{confidence}</strong></div>
          </div>
        </div>

        {/* 2. AI EXECUTIVE SUMMARY */}
        <div className="p-6 md:p-8 bg-blue-50/50 border border-blue-100 rounded-[28px] flex flex-col gap-4">
          <h3 className="font-black text-sm text-[#0F172A] flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-blue-600" /> AI Executive Summary
          </h3>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
            {summary}
          </p>
        </div>

        {/* 3. INVESTMENT THESIS */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Investment Thesis</h3>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            Our recommendation is anchored on structural expansion across retail operations and early monetization of clean energy assets. Consistent demand in domestic margins makes the company an attractive defensive-core holding for long-duration wealth portfolios.
          </p>
        </div>

        {/* 4. GROWTH DRIVERS & CONTEXT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-200/80 pt-8">
          <div className="flex flex-col gap-3">
            <h4 className="font-black text-sm text-[#0F172A] flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-emerald-600" /> Growth Drivers
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                Expanding market leadership inside domestic retail consumption patterns.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                Capital expenditure commissioning of clean solar/hydrogen production facilities.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                Deleveraging balance sheet dynamics expected to result in return ratio upgrades.
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-black text-sm text-[#0F172A] flex items-center gap-2">
              <AlertTriangle className="w-4.5 h-4.5 text-rose-500" /> Key Risks
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                Fluctuations in global energy crude demand and export margin policy caps.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                Rising pricing competition across localized telecom service providers.
              </li>
            </ul>
          </div>
        </div>

        {/* 5. FINANCIAL HIGHLIGHTS & VALUATION */}
        <div className="border-t border-slate-200/80 pt-8 flex flex-col gap-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Financial Highlights & Valuation</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'P/E Ratio', value: '24.2x', desc: 'Sector Avg: 28.5x' },
              { label: 'EV/EBITDA', value: '14.8x', desc: 'Historically attractive' },
              { label: 'ROE', value: '16.4%', desc: 'Strong equity return' },
              { label: 'Debt/Equity', value: '0.34x', desc: 'Conservative profile' }
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 block">{stat.label}</span>
                <span className="text-base font-black text-slate-900 mt-0.5 block">{stat.value}</span>
                <span className="text-[9px] text-slate-400 block font-semibold mt-0.5">{stat.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. UPCOMING EVENTS */}
        <div className="border-t border-slate-200/80 pt-8 flex flex-col gap-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Upcoming Corporate Events</h3>
          
          <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Q1 Earnings Conference Call</h4>
                <span className="text-[10px] text-slate-400 font-bold">Upcoming earnings call presentation</span>
              </div>
            </div>
            <span className="text-xs font-black text-slate-900 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg">August 14, 2026</span>
          </div>
        </div>

        {/* 7. TRADE CALL TO ACTION */}
        <div className="border-t border-slate-200/80 pt-8 flex items-center justify-between gap-4 mt-4">
          <div className="text-xs text-slate-500 font-bold">
            SEBI Advisory Compliant Research Document • INH000009821
          </div>
          <button
            onClick={() => onTrade?.(research)}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow-md shadow-blue-600/10 cursor-pointer transition"
          >
            Execute Trade
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default ResearchDetail;
