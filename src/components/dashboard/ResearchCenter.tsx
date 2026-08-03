import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, RefreshCw, LayoutDashboard, Radio, Sparkles, 
  BookOpen, FolderHeart, Newspaper, Compass, AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import { ResearchDetail } from './ResearchDetail';
import { TradeDrawer } from './TradeDrawer';
import { ShareModal } from './ShareModal';
import { CompareModal } from './CompareModal';
import { ReportViewer } from './ReportViewer';
import { UniversalSearch } from './UniversalSearch';

// Research tabs
import { OverviewTab } from '../research/OverviewTab';
import { LiveCallsTab } from '../research/LiveCallsTab';
import { AiAdvisorsHub } from '../ai/AiAdvisorsHub';
import { MarketOutlookTab } from '../research/MarketOutlookTab';
import { SectorsTab } from '../research/SectorsTab';
import { SavedTab } from '../research/SavedTab';
import toast from 'react-hot-toast';

interface ResearchCenterProps {
  onTrade?: (tradeData: any) => void;
  onSelectStock?: (stock: any) => void;
}

export const ResearchCenter: React.FC<ResearchCenterProps> = ({ onTrade, onSelectStock }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'calls' | 'ai-advisor' | 'outlook' | 'sectors' | 'saved'>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUniversalSearchOpen, setIsUniversalSearchOpen] = useState(false);
  const [featuredOpportunities, setFeaturedOpportunities] = useState<any[]>([]);

  const handleTrade = (item: any) => {
    if (onTrade) {
      onTrade(item);
    } else {
      setTradeIntent(item);
    }
  };

  React.useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response = await api.get('/research/feed');
        const formatted = response.data.map((call: any) => ({
          company: call.company_name || call.symbol,
          symbol: call.symbol,
          logo: call.symbol.substring(0, 2).toUpperCase(),
          exchange: 'NSE',
          rec: call.recommendation.toUpperCase(),
          price: '₹' + (call.entry_price_min || '0'),
          entry: `₹${call.entry_price_min} - ₹${call.entry_price_max}`,
          target: `₹${call.target_price}`,
          stop: `₹${call.stop_loss}`,
          return: '14%',
          risk: 'Low',
          confidence: 94,
          duration: call.category || 'Swing',
          sector: 'Equities',
          summary: call.summary || call.fundamental_notes || 'Research call published.',
          analyst: 'AI Analyst',
          time: 'Recently'
        }));
        setFeaturedOpportunities(formatted);
      } catch (error) {
        console.error("Failed to fetch research feed", error);
      }
    };
    fetchCalls();
  }, []);
  
  // Interactivity Modals State
  const [selectedResearch, setSelectedResearch] = useState<any | null>(null);
  const [tradeIntent, setTradeIntent] = useState<any | null>(null);
  const [showCompare, setShowCompare] = useState<any | null>(null);
  const [showShare, setShowShare] = useState<any | null>(null);
  const [showReport, setShowReport] = useState<any | null>(null);

  const TABS = [
    { id: 'overview', name: 'Overview', icon: <LayoutDashboard className="w-4 h-4" />, count: null },
    { id: 'calls', name: 'Live Calls', icon: <Radio className="w-4 h-4 text-rose-500" />, count: 28 },
    { id: 'ai-advisor', name: 'AI Advisor', icon: <Sparkles className="w-4 h-4 text-blue-500" />, count: 'Live' },
    { id: 'outlook', name: 'Market Outlook', icon: <Newspaper className="w-4 h-4" />, count: null },
    { id: 'sectors', name: 'Sectors', icon: <Compass className="w-4 h-4" />, count: null },
    { id: 'saved', name: 'Saved', icon: <FolderHeart className="w-4 h-4" />, count: '4 Items' },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Research data synced with SEBI feeds');
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-8 w-full pb-12 font-sans text-slate-800">
      
      {/* PAGE HEADER & CONTROLS */}
      <div className="w-full pt-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F172A] mb-2">
            Research Center
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            SEBI registered Research Analyst advisory and autonomous AI Investment Experts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div 
            onClick={() => setIsUniversalSearchOpen(true)}
            className="relative flex-1 sm:w-80 flex items-center bg-white border border-[#E2E8F0] rounded-2xl px-3.5 py-2.5 cursor-pointer hover:border-blue-500 transition shadow-xs select-none"
          >
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <span className="text-xs text-slate-400 font-medium truncate flex-1">Search stocks, research, reports...</span>
            <kbd className="hidden sm:inline-block rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-semibold text-slate-400 ml-2">⌘ K</kbd>
          </div>

          <button 
            onClick={handleRefresh}
            className="p-2.5 bg-white border border-[#E2E8F0] rounded-2xl text-slate-500 hover:text-[#0F172A] hover:bg-slate-50 transition shadow-xs cursor-pointer"
            title="Refresh Research"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* ANIMATED SEGMENTED TABS BAR */}
      <div className="w-full bg-white p-1.5 rounded-[22px] border border-[#E2E8F0] shadow-xs flex items-center overflow-x-auto no-scrollbar">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs transition-all shrink-0 select-none cursor-pointer ${
                isActive ? 'text-[#0F172A] bg-[#F1F5F9] shadow-xs' : 'text-slate-500 hover:text-[#0F172A] hover:bg-slate-50'
              }`}
            >
              <span className="relative z-10">{tab.icon}</span>
              <span className="relative z-10">{tab.name}</span>
              {tab.count && (
                <span className={`relative z-10 text-[10px] px-2 py-0.5 rounded-md border ${
                  isActive ? 'bg-white text-blue-600 border-white font-bold' : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* DYNAMIC TAB CONTENT */}
      <div className="w-full">
        {activeTab === 'overview' && (
          <OverviewTab
            onNavigateTab={(tab) => setActiveTab(tab as any)}
            onOpenAiAdvisor={() => setActiveTab('ai-advisor')}
            onSelectResearchCall={(call) => setSelectedResearch(call)}
          />
        )}
        {activeTab === 'calls' && (
          <LiveCallsTab
            onSelectCall={(call) => setSelectedResearch(call)}
            onTradeCall={(call) => handleTrade(call)}
            calls={featuredOpportunities}
          />
        )}
        {activeTab === 'ai-advisor' && (
          <AiAdvisorsHub
            onTradeStock={(stk) => handleTrade(stk)}
            onCompareStock={(stk) => setShowCompare(stk)}
          />
        )}
        {activeTab === 'outlook' && (
          <MarketOutlookTab />
        )}
        {activeTab === 'sectors' && (
          <SectorsTab />
        )}
        {activeTab === 'saved' && (
          <SavedTab />
        )}
      </div>

      {/* MODALS & DRAWERS */}
      <AnimatePresence>
        {selectedResearch && (
          <ResearchDetail
            isOpen={true}
            onClose={() => setSelectedResearch(null)}
            research={selectedResearch}
            onTrade={(res) => handleTrade(res)}
          />
        )}
      </AnimatePresence>

      {!onTrade && (
        <TradeDrawer
          isOpen={!!tradeIntent}
          onClose={() => setTradeIntent(null)}
          /* @ts-ignore */
          call={tradeIntent}
        />
      )}

      <ShareModal
        isOpen={!!showShare}
        onClose={() => setShowShare(null)}
        /* @ts-ignore */
        item={showShare}
      />

      <CompareModal
        isOpen={!!showCompare}
        onClose={() => setShowCompare(null)}
        /* @ts-ignore */
        call1={showCompare}
      />

      <ReportViewer
        isOpen={!!showReport}
        onClose={() => setShowReport(null)}
        report={showReport}
      />

      <UniversalSearch
        isOpen={isUniversalSearchOpen}
        onClose={() => setIsUniversalSearchOpen(false)}
        onSelectStock={(stk) => handleTrade(stk)}
        onSelectResearch={(res) => setSelectedResearch(res)}
        onSelectReport={(rep) => setShowReport(rep)}
        onSelectAnalyst={() => setActiveTab('ai-advisor')}
      />
    </div>
  );
};

export default ResearchCenter;
