import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, X, Maximize2, Minimize2, Send, Mic, Volume2, Bookmark, Share2, 
  TrendingUp, AlertCircle, ShieldCheck, CheckCircle2, ArrowRight, Wallet, 
  BarChart3, RefreshCw, Layers, ArrowUpDown, ChevronRight, HelpCircle, UserCheck, Search, Scale,
  Lightbulb, Zap, Compass, Filter, Plus, ArrowUpRight, ArrowDownRight, Bot, PieChart, Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import aiService from '../../services/ai.service';

interface AiCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStock?: (stock: any) => void;
  onSelectResearch?: (research: any) => void;
  onTrade?: (tradeData: any) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  confidence?: number;
  sources?: string[];
  relatedStocks?: string[];
  relatedResearch?: string;
  type?: 'text' | 'comparison' | 'scenario' | 'chart';
  comparisonData?: any;
  scenarioData?: {
    bull: string;
    base: string;
    bear: string;
    targetPrice?: string;
  };
  followUpPrompts?: string[];
}

export const AiCopilotModal: React.FC<AiCopilotModalProps> = ({
  isOpen,
  onClose,
  onSelectStock,
  onSelectResearch,
  onTrade
}) => {
  const [viewMode, setViewMode] = useState<'panel' | 'fullscreen'>('panel');
  const [activeTab, setActiveTab] = useState<'Home' | 'Chat' | 'Portfolio Review' | 'Market Brief'>('Home');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Stock Research' | 'Portfolio Health' | 'Sector Trends' | 'Small-Caps'>('All');
  const [inputVal, setInputVal] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Namaste Omar! I am your ArthSetu AI Investment Advisory Copilot. Your simulated portfolio is up +1.55% today led by Reliance (+1.25%) and HDFC Bank (+0.85%). What investment research can I assist you with today?',
      timestamp: 'Just now',
      confidence: 96,
      sources: ['ArthSetu SEBI Advisory Engine', 'TradingView OHLC Engine', 'NSE Live'],
      relatedStocks: ['RELIANCE', 'HDFCBANK', 'DIXON'],
      followUpPrompts: [
        'Why is Reliance rising today?',
        'Show scenario targets for Dixon',
        'Analyze my portfolio concentration'
      ]
    }
  ]);

  const [isAiTyping, setIsAiTyping] = useState(false);

  if (!isOpen) return null;

  // Categorized Recommended Research Questions
  const categorizedPrompts = [
    { category: 'Stock Research', text: 'Why is Reliance rising today?' },
    { category: 'Stock Research', text: 'Compare TCS vs Infosys balance sheets' },
    { category: 'Stock Research', text: 'What changed in HDFC Bank recently?' },
    { category: 'Portfolio Health', text: 'Analyze drawdown risks in my portfolio' },
    { category: 'Portfolio Health', text: 'Are my IT holdings over-concentrated?' },
    { category: 'Sector Trends', text: 'What are the biggest risks in IT sector?' },
    { category: 'Sector Trends', text: 'Rank top 5 performing sectors this month' },
    { category: 'Small-Caps', text: 'Which small-caps are rising on ArthSetu Radar?' },
    { category: 'Small-Caps', text: 'Why is HAL a premium defense pick?' }
  ];

  const filteredPrompts = activeCategory === 'All'
    ? categorizedPrompts
    : categorizedPrompts.filter(p => p.category === activeCategory);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputVal('');

    // Ensure we are in Chat tab when a prompt is sent
    setActiveTab('Chat');
    setIsAiTyping(true);

    try {
      let aiText = `Here is ArthSetu's AI research synthesis for "${text}":`;
      let related: string[] = [];
      let followUps: string[] = [];
      let scenarioData: any = undefined;

      const lowerText = text.toLowerCase();

      if (lowerText.includes('reliance')) {
        aiText = `Reliance Industries (RELIANCE) is showing strong positive momentum (+2.35% today). Key drivers: 1) O2C refining margin recovery (+12% QoQ), 2) Jio ARPU tariff hike execution, and 3) New Energy gigafactory commissioning ahead of schedule.`;
        related = ['RELIANCE', 'ONGC', 'BPCL'];
        scenarioData = {
          bull: '₹3,550 (+17.3%) — Rapid New Energy monetization & retail margin expansion.',
          base: '₹3,200 (+5.7%) — Steady telecom cash flows & 14% EBITDA CAGR.',
          bear: '₹2,750 (-9.1%) — Crude oil margin compression & capex delay.'
        };
        followUps = [
          'Show peer comparison with ONGC',
          'Add RELIANCE to Investment Lab',
          'What are the risk factors for Reliance?'
        ];
      } else if (lowerText.includes('tcs') || lowerText.includes('infosys') || lowerText.includes('compare')) {
        aiText = `Comparing TCS vs Infosys: TCS leads in operating margin stability (24.5% vs INFY 21.2%) and lower attrition. Infosys offers higher revenue growth potential in GenAI enterprise contracts but carries elevated valuation risk at 26x TTM earnings.`;
        related = ['TCS', 'INFY', 'WIPRO'];
        followUps = [
          'Which one has better dividend yield?',
          'What is ArthSetu View for TCS?',
          'Analyze IT sector headwinds'
        ];
      } else if (lowerText.includes('dixon')) {
        aiText = `Dixon Technologies is a high-conviction research candidate (Score 88/100). The company is benefiting from PLI mobile export incentives and recent laptop assembly wins.`;
        related = ['DIXON', 'KAYNES', 'AMBER'];
        scenarioData = {
          bull: '₹16,500 (+32.5%) — Accelerated laptop exports & 40% EPS CAGR.',
          base: '₹14,200 (+14.0%) — Steady EMS execution & 28% EPS CAGR.',
          bear: '₹10,800 (-13.2%) — Order deferral & component inflation.'
        };
        followUps = [
          'Inspect full Dixon research report',
          'Compare Dixon vs Kaynes Tech',
          'Add Dixon to Investment Lab'
        ];
      } else if (lowerText.includes('small-cap') || lowerText.includes('radar')) {
        aiText = `ArthSetu Radar upgraded 3 small-cap candidates this week: 1) Dixon (+8 pts to 88/100), 2) Suzlon Energy (+6 pts to 78/100), and 3) Trent Ltd (+4 pts to 89/100) due to margin expansion and debt reduction.`;
        related = ['DIXON', 'SUZLON', 'TRENT'];
        followUps = [
          'Show Suzuki/Suzlon debt breakdown',
          'Filter small-caps by Quality lens',
          'What are the risks in small-caps?'
        ];
      } else {
        const response = await aiService.chatWithCopilot({
          messages: [{ role: 'user', content: text }]
        });
        aiText = response.text || `Based on ArthSetu advisory models, ${text} shows favorable risk-reward indicators.`;
        related = response.relatedStocks || ['RELIANCE', 'HDFCBANK'];
        followUps = [
          'Show detailed fundamental ratios',
          'Analyze drawdown protection',
          'Add position to Investment Lab'
        ];
      }

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiText,
        timestamp: 'Just now',
        confidence: 94,
        relatedStocks: related,
        sources: ['ArthSetu SEBI Advisory Rules Engine', 'NSE Real-Time Feed'],
        scenarioData,
        followUpPrompts: followUps
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("AI Copilot Error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "I encountered a brief connection delay fetching advisory data. Please click a recommended prompt below.",
        timestamp: 'Just now',
        confidence: 0,
        followUpPrompts: ['Why is Reliance rising today?', 'Compare TCS vs Infosys']
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const toggleVoiceMode = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.success('Voice listener active. Speak your question...');
      setTimeout(() => {
        setIsRecording(false);
        handleSend('Why is Reliance rising today?');
      }, 3000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[90] flex justify-end font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs"
        />

        {/* AI Copilot Workspace Container */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          className={`relative bg-white border-l border-[#E2E8F0] h-full flex flex-col shadow-2xl z-10 overflow-hidden transition-all duration-300 ${
            viewMode === 'fullscreen' ? 'w-full' : 'w-full max-w-[540px]'
          }`}
        >
          {/* 1. BRANDED HEADER BANNER */}
          <header className="p-4 sm:p-5 bg-gradient-to-r from-[#123B63] via-[#15519D] to-[#0E2F50] text-white flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/30 text-amber-300 flex items-center justify-center font-black text-sm shadow-sm shrink-0">
                <Sparkles className="w-5 h-5 fill-current text-amber-300 animate-pulse" />
              </div>
              <div>
                <h3 className="font-black text-base leading-tight flex items-center gap-2 text-white">
                  ArthSetu AI Copilot
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-black border border-emerald-400/30 uppercase tracking-wider">
                    SEBI INTEGRATED
                  </span>
                </h3>
                <span className="text-[10px] text-slate-200 font-medium">Personal Wealth & Advisory Intelligence</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode(viewMode === 'panel' ? 'fullscreen' : 'panel')}
                className="p-2 rounded-xl hover:bg-white/10 text-slate-200 transition cursor-pointer"
                title={viewMode === 'panel' ? 'Expand Full Screen' : 'Collapse Side Panel'}
              >
                {viewMode === 'panel' ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/10 text-slate-200 transition cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* 2. NAVIGATION TABS */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-200 bg-[#F8FAFC] text-xs font-bold shrink-0 overflow-x-auto">
            {(['Home', 'Chat', 'Portfolio Review', 'Market Brief'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                  activeTab === tab ? 'bg-[#15519D] text-white font-black shadow-xs' : 'text-slate-600 hover:text-[#172033]'
                }`}
              >
                {tab === 'Home' ? 'Home Synthesis' : tab === 'Chat' ? 'AI Live Chat' : tab}
              </button>
            ))}
          </div>

          {/* 3. CATEGORIZED RESEARCH PROMPTS BAR */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/80 space-y-2 shrink-0">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Research Recommendations
              </span>
              <span>Select Question</span>
            </div>

            {/* CATEGORY FILTER CHIPS */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
              {(['All', 'Stock Research', 'Portfolio Health', 'Sector Trends', 'Small-Caps'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold whitespace-nowrap transition cursor-pointer border ${
                    activeCategory === cat
                      ? 'bg-[#15519D] text-white border-[#15519D]'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 4. MAIN COPILOT WORKSPACE SURFACE */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-5">

            {/* TAB 1: HOME SYNTHESIS */}
            {activeTab === 'Home' && (
              <div className="flex flex-col gap-5">
                
                {/* Today's AI Brief Card */}
                <div className="bg-[#123B63] text-white rounded-[24px] p-5 shadow-xl relative overflow-hidden space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> TODAY'S ADVISORY SYNTHESIS
                    </span>
                    <span className="text-[10px] font-bold text-slate-300">Live Engine</span>
                  </div>

                  <h4 className="text-base font-black leading-snug">
                    Banking and Capital Goods Leading Outperformance
                  </h4>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    Your portfolio is up <strong className="text-emerald-400">+1.55%</strong> today led by Reliance (+1.25%) and HDFC Bank (+0.85%). Rebalancing IT holdings into Healthcare will optimize drawdown protection.
                  </p>
                </div>

                {/* Metrics Summary Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Top Opportunity</span>
                    <strong className="text-xs text-emerald-600 font-black block">Large-cap Banking (+15%)</strong>
                  </div>
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Top Risk Alert</span>
                    <strong className="text-xs text-rose-600 font-black block">Small-cap IT Drag (-0.8%)</strong>
                  </div>
                </div>

                {/* SUGGESTED AI RESEARCH QUESTIONS GRID */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    Suggested Research Prompts ({filteredPrompts.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredPrompts.map((p) => (
                      <button
                        key={p.text}
                        onClick={() => handleSend(p.text)}
                        className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#15519D] hover:bg-blue-50/40 rounded-xl text-xs text-left font-bold text-[#172033] transition cursor-pointer flex items-center justify-between group"
                      >
                        <span className="line-clamp-2">{p.text}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#15519D] transition shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: AI LIVE CHAT */}
            {activeTab === 'Chat' && (
              <div className="flex flex-col gap-4 flex-1">
                
                {/* SUGGESTED PROMPTS STRIP IN CHAT */}
                <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2">
                  <div className="text-[10px] font-extrabold text-[#15519D] uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> Recommended Chat Prompts:
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
                    {filteredPrompts.slice(0, 4).map(p => (
                      <button
                        key={p.text}
                        onClick={() => handleSend(p.text)}
                        className="px-2.5 py-1 bg-white hover:bg-[#15519D] hover:text-white border border-blue-200 text-[#172033] text-[11px] font-extrabold rounded-xl whitespace-nowrap transition cursor-pointer shadow-2xs shrink-0"
                      >
                        {p.text}
                      </button>
                    ))}
                  </div>
                </div>

                {/* MESSAGES LIST */}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col gap-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`p-4 rounded-2xl max-w-[92%] text-xs leading-relaxed font-medium ${
                      msg.sender === 'user'
                        ? 'bg-[#15519D] text-white rounded-br-none shadow-xs'
                        : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#172033] rounded-bl-none shadow-2xs space-y-3'
                    }`}>
                      <p>{msg.text}</p>

                      {/* SCENARIO DATA CARD */}
                      {msg.scenarioData && (
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 text-[#172033] font-sans">
                          <span className="text-[10px] font-black text-[#15519D] uppercase block">Scenario Targets Breakdown:</span>
                          <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px]">
                            <strong className="font-black text-emerald-800">Bull Case: </strong>{msg.scenarioData.bull}
                          </div>
                          <div className="p-2 bg-blue-50 rounded-lg border border-blue-200 text-[11px]">
                            <strong className="font-black text-blue-800">Base Case: </strong>{msg.scenarioData.base}
                          </div>
                          <div className="p-2 bg-rose-50 rounded-lg border border-rose-200 text-[11px]">
                            <strong className="font-black text-rose-800">Bear Case: </strong>{msg.scenarioData.bear}
                          </div>
                        </div>
                      )}

                      {/* AI INTELLIGENCE FOOTER */}
                      {msg.sender === 'ai' && (
                        <div className="pt-2 border-t border-slate-200/60 flex flex-col gap-2 text-[10px]">
                          {msg.confidence && (
                            <div className="flex items-center justify-between text-slate-400 font-bold">
                              <span className="flex items-center gap-1 text-[#15519D]">
                                <Sparkles className="w-3 h-3" /> {msg.confidence}% AI Conviction
                              </span>
                              <span>{msg.timestamp}</span>
                            </div>
                          )}

                          {msg.relatedStocks && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-slate-400 font-bold">Related Candidates:</span>
                              {msg.relatedStocks.map(st => (
                                <button
                                  key={st}
                                  onClick={() => {
                                    if (onSelectStock) onSelectStock({ symbol: st, companyName: st });
                                  }}
                                  className="px-2 py-0.5 rounded bg-blue-50 text-[#15519D] font-black text-[10px] hover:bg-[#15519D] hover:text-white transition cursor-pointer"
                                >
                                  ${st}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* DYNAMIC FOLLOW-UP RECOMMENDATION CHIPS */}
                          {msg.followUpPrompts && msg.followUpPrompts.length > 0 && (
                            <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                              <span className="text-[10px] font-black text-[#15519D] uppercase tracking-wider block">
                                Recommended Follow-Ups:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {msg.followUpPrompts.map(promptText => (
                                  <button
                                    key={promptText}
                                    onClick={() => handleSend(promptText)}
                                    className="px-2.5 py-1 bg-white hover:bg-[#15519D] hover:text-white border border-slate-300 text-slate-800 text-[10px] font-extrabold rounded-xl transition cursor-pointer shadow-2xs"
                                  >
                                    💡 {promptText}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isAiTyping && (
                  <div className="flex flex-col gap-2 items-start">
                    <div className="p-4 rounded-2xl max-w-[90%] text-xs leading-relaxed font-medium bg-[#F8FAFC] border border-[#E2E8F0] text-[#172033] rounded-bl-none shadow-2xs">
                      <div className="flex gap-1 items-center">
                        <div className="w-2 h-2 bg-[#15519D] rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-[#15519D] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-[#15519D] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 3: DEDICATED PORTFOLIO REVIEW VIEW */}
            {activeTab === 'Portfolio Review' && (
              <div className="flex flex-col gap-5">
                
                {/* Health Score Banner */}
                <div className="bg-[#123B63] text-white p-5 rounded-[24px] shadow-lg flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest block">AI Portfolio Assessment</span>
                    <h3 className="text-xl font-black text-white mt-0.5">Portfolio Health Score</h3>
                    <p className="text-xs text-blue-100 font-medium">Good risk diversification & quality balance.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-amber-300 block">78/100</span>
                    <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                      Strong Quality
                    </span>
                  </div>
                </div>

                {/* Sector Allocation Breakdown */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
                  <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-sm text-[#172033]">Sector Concentration & Allocation</h4>
                    <span className="text-xs font-bold text-amber-600">Tech High Alert</span>
                  </div>

                  <div className="space-y-2 text-xs font-medium">
                    {[
                      { name: 'Technology & Cloud', pct: 41.2, color: 'bg-amber-500', isHigh: true },
                      { name: 'Financials & Banking', pct: 28.5, color: 'bg-emerald-500', isHigh: false },
                      { name: 'Industrials & Defense', pct: 18.3, color: 'bg-blue-500', isHigh: false },
                      { name: 'Energy & Commodities', pct: 12.0, color: 'bg-indigo-500', isHigh: false }
                    ].map(sec => (
                      <div key={sec.name} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-bold text-slate-800">{sec.name}</span>
                          <span className="font-extrabold text-slate-900">{sec.pct}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${sec.color} rounded-full`} style={{ width: `${sec.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Rebalancing Advisory Recommendations */}
                <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] space-y-3">
                  <h4 className="font-extrabold text-sm text-[#172033] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#15519D]" /> Actionable Rebalancing Advice
                  </h4>
                  <ul className="text-xs text-slate-700 font-medium space-y-2">
                    <li className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                      <strong className="font-black text-amber-900">1. Trim IT Allocation: </strong>Rebalance 10% of IT holdings into Healthcare to optimize drawdown protection.
                    </li>
                    <li className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                      <strong className="font-black text-emerald-900">2. Hold Reliance & HDFC Bank: </strong>Thesis playing out well (+14.2% return); maintain positions for 12+ months.
                    </li>
                  </ul>

                  <button
                    onClick={() => handleSend('Generate full rebalancing plan for my portfolio')}
                    className="w-full py-3 bg-[#15519D] hover:bg-[#123B63] text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer"
                  >
                    Ask Copilot to Generate Rebalance Plan →
                  </button>
                </div>

              </div>
            )}

            {/* TAB 4: DEDICATED MARKET BRIEF VIEW */}
            {activeTab === 'Market Brief' && (
              <div className="flex flex-col gap-5">
                
                {/* Indices Snapshot Cards */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">NIFTY 50</span>
                    <div className="font-black text-sm text-[#172033]">22,183.65</div>
                    <span className="text-[11px] font-extrabold text-emerald-600">+1.25% ↑</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">SENSEX</span>
                    <div className="font-black text-sm text-[#172033]">73,120.40</div>
                    <span className="text-[11px] font-extrabold text-emerald-600">+0.95% ↑</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">MIDCAP 100</span>
                    <div className="font-black text-sm text-[#172033]">48,240.10</div>
                    <span className="text-[11px] font-extrabold text-emerald-600">+1.85% ↑</span>
                  </div>
                </div>

                {/* Top 3 Market Catalysts */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
                  <h4 className="font-extrabold text-sm text-[#172033]">Top Market Advisory Catalysts Today</h4>
                  <div className="space-y-2 text-xs font-medium">
                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-100">
                      <strong className="font-black text-[#15519D] block">FII Net Buying (+₹2,450 Cr)</strong>
                      <p className="text-slate-600 mt-0.5">Foreign Institutional Investors turned strong buyers in banking & large-cap energy.</p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-100">
                      <strong className="font-black text-[#15519D] block">Refining Margin Recovery</strong>
                      <p className="text-slate-600 mt-0.5">Brent crude stabilizing around $78.40/bbl providing margin relief for downstream oil marketing.</p>
                    </div>
                  </div>
                </div>

                {/* Sector Momentum Rankings */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
                  <h4 className="font-extrabold text-sm text-[#172033]">1M Sector Momentum Rankings</h4>
                  <div className="space-y-2 text-xs font-medium">
                    {[
                      { name: 'Technology & Cloud', change: '+4.8%', view: 'Bullish' },
                      { name: 'Financials & Banking', change: '+3.2%', view: 'Bullish' },
                      { name: 'Industrials & Defense', change: '+2.7%', view: 'Robust' },
                      { name: 'Consumer FMCG', change: '-0.8%', view: 'Cautious' }
                    ].map(sec => (
                      <div key={sec.name} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                        <span className="font-extrabold text-slate-800">{sec.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={sec.change.startsWith('+') ? 'text-emerald-600 font-extrabold' : 'text-rose-600 font-extrabold'}>{sec.change}</span>
                          <span className="px-2 py-0.5 bg-blue-50 text-[#15519D] text-[10px] font-black rounded">{sec.view}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSend('Explain sector momentum trends for Technology and Banking')}
                    className="w-full py-3 bg-[#15519D] hover:bg-[#123B63] text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer"
                  >
                    Ask Copilot About Market Drivers →
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* 5. INPUT FOOTER */}
          <footer className="p-4 border-t border-[#E2E8F0] bg-white flex flex-col gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleVoiceMode}
                className={`p-2.5 rounded-xl border transition cursor-pointer ${
                  isRecording ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                }`}
                title="Voice Input"
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="text"
                placeholder="Ask ArthSetu AI Copilot about stocks, portfolio, research..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#172033] outline-none focus:border-[#15519D] font-medium"
              />

              <button
                onClick={() => handleSend()}
                className="p-2.5 rounded-xl bg-[#15519D] text-white hover:bg-[#123B63] transition shadow-sm cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold px-1">
              <span>Powered by ArthSetu SEBI Advisory Engine</span>
              <span>Press Enter to send</span>
            </div>
          </footer>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AiCopilotModal;
