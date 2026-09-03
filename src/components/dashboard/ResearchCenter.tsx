import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Sparkles, ShieldCheck, Clock, 
  ArrowUpRight, ArrowDownRight, ChevronRight, Award, Bookmark, Filter, Search
} from 'lucide-react';
import ResearchDetail from './ResearchDetail';
import marketService from '../../services/market.service';
import { MOCK_RESEARCH_PICKS } from '../../mock/mockData';

interface ResearchCenterProps {
  onSelectStock?: (stock: any) => void;
  onInvestViaBroker?: (stock: any) => void;
}

export interface UnivestPick {
  id: string;
  symbol: string;
  companyName: string;
  category?: 'High Conviction' | 'Growth' | 'Value' | 'Momentum' | 'Long Term' | string;
  datePublished?: string;
  returnPercent?: number;
  risk?: string;
  horizon?: string;
  convictionScore?: number;
  summary: string;
}

export const ResearchCenter: React.FC<ResearchCenterProps> = ({
  onSelectStock,
  onInvestViaBroker
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedResearch, setSelectedResearch] = useState<UnivestPick | null>(null);
  const [picks, setPicks] = useState<UnivestPick[]>(MOCK_RESEARCH_PICKS as any[]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    marketService.getResearchCalls().then((data) => {
      if (isMounted) {
        if (data && data.length > 0) {
          setPicks(data as any[]);
        }
        setIsLoading(false);
      }
    }).catch(() => {
      if (isMounted) setIsLoading(false);
    });
    return () => { isMounted = false; };
  }, []);

  const displayPicks = picks.length > 0 ? picks : (MOCK_RESEARCH_PICKS as any[]);

  const filteredPicks = displayPicks.filter(pick => 
    selectedCategory === 'All' || pick.category === selectedCategory
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#15519D] mb-1">
          <TrendingUp className="w-4 h-4" />
          <span>High-Conviction Investment Intelligence</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          ArthSetu Premium Research Picks
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          In-depth fundamental research theses backed by transparent performance timelines and catalyst tracking.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {['All', 'High Conviction', 'Growth', 'Value', 'Momentum', 'Long Term'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#15519D] text-white shadow-md shadow-blue-500/20'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Picks Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPicks.map((pick) => (
          <div
            key={pick.id}
            onClick={() => setSelectedResearch(pick)}
            className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 bg-blue-50 text-[#15519D] font-extrabold text-xs rounded-full">
                  {pick.category}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {pick.datePublished}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-[#15519D] transition-colors">
                {pick.symbol}
              </h3>
              <p className="text-xs text-slate-400 font-medium">{pick.companyName}</p>

              <p className="text-xs text-slate-700 mt-3 line-clamp-2 leading-relaxed font-medium">
                "{pick.summary}"
              </p>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 my-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Return</span>
                  <div className="text-xs font-black text-[#16A34A]">+{pick.returnPercent}%</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Conviction</span>
                  <div className="text-xs font-extrabold text-slate-900">{pick.convictionScore}/100</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Horizon</span>
                  <div className="text-xs font-extrabold text-slate-900">{pick.horizon}</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-[#15519D] group-hover:translate-x-1 transition-transform">
              <span>Read Complete Thesis & Timeline</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* FULL RESEARCH MODAL */}
      {selectedResearch && (
        <ResearchDetail
          isOpen={!!selectedResearch}
          onClose={() => setSelectedResearch(null)}
          researchItem={selectedResearch}
          onSelectStock={onSelectStock}
          onInvestViaBroker={onInvestViaBroker}
        />
      )}
    </div>
  );
};

export default ResearchCenter;
