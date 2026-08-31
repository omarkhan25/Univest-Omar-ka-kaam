import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Gem, TrendingUp, Layers, Radio, Lock, Unlock, 
  ArrowRight, Award, CheckCircle2, ChevronRight, Sparkles, Filter, AlertCircle
} from 'lucide-react';
import ResearchCenter from './ResearchCenter';
import CollectionsCenter from './CollectionsCenter';
import OpportunityRadar from './OpportunityRadar';

interface ProCenterProps {
  onSelectStock: (stock: any) => void;
  onOpenPricingModal?: () => void;
}

export const ProCenter: React.FC<ProCenterProps> = ({
  onSelectStock,
  onOpenPricingModal
}) => {
  // Demo Access State Toggle: 'Active' allows owner to review all Pro screens without real payment
  const [proState, setProState] = useState<'Active' | 'Locked'>('Active');
  const [activeSection, setActiveSection] = useState<'All' | 'Picks' | 'Collections' | 'Radar'>('All');

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner & Demo Access Switcher */}
      <div className="p-8 bg-gradient-to-r from-slate-900 via-[#123B63] to-[#15519D] rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-black uppercase tracking-wider border border-amber-400/30">
            <Gem className="w-3.5 h-3.5 fill-current text-amber-400" />
            <span>UNIVEST PRO INTELLIGENCE</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            Institutional Research & High-Conviction Strategy
          </h1>
          <p className="text-sm text-slate-200 font-medium leading-relaxed">
            Access Pro Picks, Curated Strategy Collections, and Opportunity Radar signals built for multi-year compounding.
          </p>
        </div>

        {/* Demo / Developer Review Access Switcher */}
        <div className="z-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex flex-col items-center gap-2 shrink-0">
          <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider">Demo Review Switcher</span>
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setProState('Active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                proState === 'Active'
                  ? 'bg-[#16A34A] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Pro Active</span>
            </button>

            <button
              onClick={() => setProState('Locked')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                proState === 'Locked'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Free Preview</span>
            </button>
          </div>
        </div>

        {/* Background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Section Sub-Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 overflow-x-auto">
        {[
          { id: 'All', label: 'All Pro Offerings' },
          { id: 'Picks', label: 'Pro Picks (Individual Ideas)' },
          { id: 'Collections', label: 'Pro Collections (Curated Baskets)' },
          { id: 'Radar', label: 'Pro Radar (Opportunity Signals)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
              activeSection === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* PRO STATE LOCKED BANNER (Shown when proState === 'Locked') */}
      {proState === 'Locked' && (
        <div className="p-6 bg-gradient-to-r from-amber-500/10 via-amber-50 to-blue-50 rounded-3xl border border-amber-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800 uppercase tracking-wider">
              <Lock className="w-4 h-4 text-amber-600" />
              <span>Free Preview Mode Active</span>
            </div>
            <h3 className="text-lg font-black text-slate-900">
              Unlock Full Pro Picks, Collections & Live Opportunity Radar
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              You are currently viewing a limited preview. Switch to Pro Active mode above or activate your Pro membership.
            </p>
          </div>

          <button
            onClick={() => setProState('Active')}
            className="px-6 py-3 bg-[#15519D] hover:bg-[#123B63] text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0"
          >
            <span>Activate Pro Access</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SECTION 1: PRO PICKS */}
      {(activeSection === 'All' || activeSection === 'Picks') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#15519D]" />
                Pro Picks — Individual High-Conviction Ideas
              </h2>
              <p className="text-xs text-slate-500">In-depth fundamental theses, catalysts, and transparent updates.</p>
            </div>
          </div>

          <ResearchCenter
            onSelectStock={onSelectStock}
            onInvestViaBroker={() => {}}
          />
        </div>
      )}

      {/* SECTION 2: PRO COLLECTIONS */}
      {(activeSection === 'All' || activeSection === 'Collections') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#15519D]" />
                Pro Collections — Curated Investment Baskets
              </h2>
              <p className="text-xs text-slate-500">Structured investment strategies built for long-term wealth creation.</p>
            </div>
          </div>

          <CollectionsCenter
            onSelectStock={onSelectStock}
            onInvestViaBroker={() => {}}
          />
        </div>
      )}

      {/* SECTION 3: PRO RADAR */}
      {(activeSection === 'All' || activeSection === 'Radar') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#15519D]" />
                Pro Intelligence — Live Opportunity Radar
              </h2>
              <p className="text-xs text-slate-500">Real-time signals detecting high conviction, building momentum, and rising risks.</p>
            </div>
          </div>

          <OpportunityRadar
            onSelectStock={onSelectStock}
          />
        </div>
      )}
    </div>
  );
};

export default ProCenter;
