import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, X, Maximize2, Minimize2, Send, Mic, Volume2, Bookmark, Share2, 
  TrendingUp, AlertCircle, ShieldCheck, CheckCircle2, ArrowRight, Wallet, 
  BarChart3, RefreshCw, Layers, ArrowUpDown, ChevronRight, HelpCircle, UserCheck, Search, Scale
} from 'lucide-react';
import toast from 'react-hot-toast';

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
  type?: 'text' | 'comparison' | 'portfolio' | 'chart';
  comparisonData?: any;
}

export const AiCopilotModal: React.FC<AiCopilotModalProps> = ({
  isOpen,
  onClose,
  onSelectStock,
  onSelectResearch,
  onTrade
}) => {
  const [viewMode, setViewMode] = useState<'panel' | 'fullscreen'>('panel');
  const [activeTab, setActiveTab] = useState<'Chat' | 'Home' | 'Portfolio Review' | 'Market Brief'>('Home');
  const [inputVal, setInputVal] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Good morning Omar! I am your Univest AI Investment Copilot. Your portfolio is up +1.55% today. How can I help you build wealth today?',
      timestamp: 'Just now',
      confidence: 96,
      sources: ['Univest SEBI Advisory Feed', 'TradingView Engine', 'NSE Live'],
      relatedStocks: ['RELIANCE', 'HDFCBANK', 'LT']
    }
  ]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Should I buy Reliance?',
    'Compare TCS vs Infosys',
    'Summarize today\'s market',
    'Review my portfolio',
    'Find dividend stocks',
    'Explain RSI'
  ];

  const handleSend = (textToSend?: string) => {
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

    // Simulate AI Copilot intelligent analysis
    setTimeout(() => {
      let aiResponse: ChatMessage;

      if (text.toLowerCase().includes('compare') || (text.toLowerCase().includes('tcs') && text.toLowerCase().includes('infosys'))) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'TCS currently presents stronger ROE (42.1%) and lower debt, while Infosys offers a higher dividend yield (2.85%). Here is the comparative breakdown:',
          timestamp: 'Just now',
          confidence: 94,
          type: 'comparison',
          sources: ['SEBI Research Desk', 'Company Q1 Reports'],
          relatedStocks: ['TCS', 'INFY'],
          relatedResearch: 'TCS vs INFY Valuation Breakdown',
          comparisonData: {
            stockA: { symbol: 'TCS', name: 'Tata Consultancy', pe: '31.2x', roe: '42.1%', rating: 'BUY' },
            stockB: { symbol: 'INFY', name: 'Infosys Limited', pe: '26.8x', roe: '31.4%', rating: 'HOLD' }
          }
        };
      } else if (text.toLowerCase().includes('reliance')) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'Reliance Industries (NSE: RELIANCE) is in a strong bullish consolidation phase. Green Hydrogen commissioning projected for Q3 FY26 will drive enterprise valuation re-rating.',
          timestamp: 'Just now',
          confidence: 92,
          sources: ['Lead Analyst Aarav Mehta', 'NSE Live Feed'],
          relatedStocks: ['RELIANCE'],
          relatedResearch: 'Reliance Green Energy Commissioning Valuation Report'
        };
      } else if (text.toLowerCase().includes('portfolio')) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'Your Portfolio Health Score is 92/100. You hold 12 assets with a total value of ₹8,42,150. AI recommends reallocating 5% from IT into Healthcare to balance sector exposure.',
          timestamp: 'Just now',
          confidence: 95,
          type: 'portfolio',
          sources: ['Univest Portfolio Engine', 'Risk Assessment Matrix'],
          relatedStocks: ['INFY', 'SUNPHARMA']
        };
      } else {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `I have analyzed "${text}" against current market data. Banking and Capital Goods continue to outperform. Would you like me to generate a full research report or execute a trade?`,
          timestamp: 'Just now',
          confidence: 90,
          sources: ['TradingView Technical Engine', 'Bloomberg News Feed'],
          relatedStocks: ['HDFCBANK', 'LT']
        };
      }

      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const toggleVoiceMode = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.success('Voice listener active. Speak your question...');
      setTimeout(() => {
        setIsRecording(false);
        handleSend('Should I buy Reliance today?');
      }, 3000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[90] flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* AI Copilot Workspace Container */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          className={`relative bg-white border-l border-[#E2E8F0] h-full flex flex-col shadow-2xl z-10 overflow-hidden transition-all duration-300 ${
            viewMode === 'fullscreen' ? 'w-full' : 'w-full max-w-[500px]'
          }`}
        >
          {/* TOP HEADER */}
          <header className="p-5 border-b border-[#E2E8F0] bg-white flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-sm shadow-md">
                <Sparkles className="w-5 h-5 fill-white animate-pulse" />
              </div>
              <div>
                <h3 className="font-black text-base text-[#0F172A] leading-tight flex items-center gap-2">
                  Univest AI Copilot
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[9px] font-black border border-blue-200 uppercase">
                    SEBI Integrated
                  </span>
                </h3>
                <span className="text-[10px] text-slate-400 font-bold">Personal Wealth & Advisory Intelligence</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'panel' ? 'fullscreen' : 'panel')}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition"
                title={viewMode === 'panel' ? 'Expand Full Screen' : 'Collapse Side Panel'}
              >
                {viewMode === 'panel' ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* SECONDARY NAVIGATION TABS */}
          <div className="flex items-center gap-1 px-5 py-2.5 border-b border-slate-100 bg-[#F8FAFC] text-xs font-bold">
            {(['Home', 'Chat', 'Portfolio Review', 'Market Brief'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl transition ${
                  activeTab === tab ? 'bg-[#0F172A] text-white font-black shadow-2xs' : 'text-slate-500 hover:text-[#0F172A]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* MAIN COPILOT WORKSPACE SURFACE */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">

            {/* TAB 1: HOME OVERVIEW */}
            {activeTab === 'Home' && (
              <div className="flex flex-col gap-6">
                
                {/* Today's AI Brief Card */}
                <div className="bg-[#0F172A] text-white rounded-[24px] p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 flex flex-col gap-3">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> TODAY'S COPILOT SYNTHESIS
                    </span>
                    <h4 className="text-lg font-black leading-snug">
                      Banking and Capital Goods Leading Outperformance
                    </h4>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      Your portfolio is up <strong>+1.55%</strong> today led by Reliance (+1.25%) and HDFC Bank (+0.85%). Rebalancing IT holdings into Healthcare will optimize drawdown protection.
                    </p>
                  </div>
                </div>

                {/* Metrics Summary Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Top Opportunity</span>
                    <strong className="text-xs text-emerald-600 font-black block">Large-cap Banking (+15%)</strong>
                  </div>
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Top Risk Alert</span>
                    <strong className="text-xs text-rose-600 font-black block">Small-cap IT Drag (-0.8%)</strong>
                  </div>
                </div>

                {/* Quick Prompts */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Suggested AI Questions</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {quickPrompts.map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setActiveTab('Chat');
                          handleSend(p);
                        }}
                        className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] hover:border-blue-300 hover:bg-blue-50/50 rounded-xl text-xs text-left font-bold text-[#0F172A] transition flex items-center justify-between group"
                      >
                        <span>{p}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition" />
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: CHAT INTERACTION */}
            {(activeTab === 'Chat' || activeTab === 'Portfolio Review' || activeTab === 'Market Brief') && (
              <div className="flex flex-col gap-4 flex-1">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col gap-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`p-4 rounded-2xl max-w-[90%] text-xs leading-relaxed font-medium ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] rounded-bl-none shadow-2xs'
                    }`}>
                      <p>{msg.text}</p>

                      {/* Embedded Comparison Component */}
                      {msg.type === 'comparison' && msg.comparisonData && (
                        <div className="mt-3 bg-white p-3.5 rounded-xl border border-slate-200 text-[#0F172A]">
                          <div className="grid grid-cols-2 gap-3 text-[11px] font-bold border-b border-slate-100 pb-2 mb-2">
                            <div>
                              <span className="text-blue-600 font-black block">{msg.comparisonData.stockA.symbol}</span>
                              <span>P/E: {msg.comparisonData.stockA.pe}</span>
                              <span className="block text-emerald-600">ROE: {msg.comparisonData.stockA.roe}</span>
                            </div>
                            <div>
                              <span className="text-indigo-600 font-black block">{msg.comparisonData.stockB.symbol}</span>
                              <span>P/E: {msg.comparisonData.stockB.pe}</span>
                              <span className="block text-emerald-600">ROE: {msg.comparisonData.stockB.roe}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* AI Intelligence Footer */}
                      {msg.sender === 'ai' && (
                        <div className="mt-3 pt-3 border-t border-slate-200/60 flex flex-col gap-2 text-[10px]">
                          {msg.confidence && (
                            <div className="flex items-center justify-between text-slate-400 font-bold">
                              <span className="flex items-center gap-1 text-blue-600">
                                <Sparkles className="w-3 h-3" /> {msg.confidence}% AI Conviction
                              </span>
                              <span>{msg.timestamp}</span>
                            </div>
                          )}

                          {msg.relatedStocks && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-slate-400 font-bold">Related:</span>
                              {msg.relatedStocks.map(st => (
                                <button
                                  key={st}
                                  onClick={() => {
                                    if (onSelectStock) onSelectStock({ symbol: st, company: st });
                                  }}
                                  className="px-2 py-0.5 rounded bg-slate-200 hover:bg-slate-300 font-black text-[#0F172A] transition"
                                >
                                  ${st}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Quick Action buttons */}
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => {
                                if (onTrade) onTrade({ symbol: msg.relatedStocks?.[0] || 'RELIANCE', rec: 'BUY' });
                              }}
                              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-black transition"
                            >
                              Trade {msg.relatedStocks?.[0] || 'Asset'}
                            </button>
                            <button
                              onClick={() => toast.success('Saved to AI Queue')}
                              className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition"
                            >
                              Save Insight
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* INPUT BAR */}
          <footer className="p-4 border-t border-[#E2E8F0] bg-white flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleVoiceMode}
                className={`p-2.5 rounded-xl border transition ${
                  isRecording ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                }`}
                title="Voice Input"
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="text"
                placeholder="Ask AI Copilot anything about stocks, portfolio, research..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#0F172A] outline-none focus:border-blue-600 font-medium"
              />

              <button
                onClick={() => handleSend()}
                className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold px-1">
              <span>Powered by SEBI Advisory Rules Engine</span>
              <span>Press Enter to send</span>
            </div>
          </footer>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default AiCopilotModal;
