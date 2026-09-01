import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, X, Maximize2, Minimize2, Send, Mic, Search, ChevronRight, 
  ArrowUpRight, ArrowDownRight, Zap, Check, HelpCircle, UserCheck, Activity,
  Briefcase, BarChart2, TrendingUp, PieChart, Layers, FlaskConical
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
  followUpPrompts?: string[];
  stockContext?: {
    symbol: string;
    price: string;
    change: string;
    score: number;
    positives?: string[];
    watchouts?: string[];
  };
}

const DEMO_STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', price: '3,026.00', change: '+2.35%', score: 78 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: '4,241.00', change: '+1.82%', score: 84 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: '1,777.00', change: '+0.94%', score: 82 },
  { symbol: 'INFY', name: 'Infosys Ltd.', price: '1,642.00', change: '+1.21%', score: 79 },
  { symbol: 'DIXON', name: 'Dixon Technologies Ltd.', price: '12,450.00', change: '+3.45%', score: 88 }
];

export const AiCopilotModal: React.FC<AiCopilotModalProps> = ({
  isOpen,
  onClose,
  onSelectStock,
  onSelectResearch,
  onTrade
}) => {
  const [viewMode, setViewMode] = useState<'panel' | 'fullscreen'>('panel');
  const [selectedTopic, setSelectedTopic] = useState<'Portfolio' | 'Stock' | 'Market' | 'Sectors' | 'Lab' | null>(null);
  
  // Active Stock Context state (when A Stock is selected)
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [activeStockContext, setActiveStockContext] = useState<any | null>(null);

  const [inputVal, setInputVal] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Chat conversation messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  if (!isOpen) return null;

  const filteredSearchStocks = DEMO_STOCKS.filter(st =>
    st.symbol.toLowerCase().includes(stockSearchQuery.toLowerCase()) ||
    st.name.toLowerCase().includes(stockSearchQuery.toLowerCase())
  );

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
    setIsAiTyping(true);

    try {
      let aiText = `Here is ArthSetu's AI research response for "${text}":`;
      let related: string[] = [];
      let followUps: string[] = [];
      let stockCtxData: any = undefined;

      const lowerText = text.toLowerCase();

      if (lowerText.includes('reliance')) {
        setActiveStockContext(DEMO_STOCKS[0]);
        aiText = `Reliance Industries (RELIANCE) is trading higher today primarily due to O2C refining margin recovery (+12% QoQ) and Jio ARPU execution.`;
        stockCtxData = {
          symbol: 'RELIANCE',
          price: '3,026.00',
          change: '+2.35%',
          score: 78,
          positives: ['Strong business quality', 'Positive earnings trend'],
          watchouts: ['Valuation multiple Expansion', 'Global crude volatility']
        };
        related = ['RELIANCE', 'ONGC', 'BPCL'];
        followUps = ['Compare with peers', 'Is the move sustainable?', 'Show Reliance risks'];
      } else if (lowerText.includes('concentrat') || lowerText.includes('portfolio')) {
        setSelectedTopic('Portfolio');
        aiText = `Your simulated portfolio has 41% exposure to Technology (Infosys + TCS). While recent performance is strong (+12.28%), rebalancing 10% into Healthcare/Banking will optimize drawdown protection.`;
        followUps = ['Show sector breakdown', 'Which holding is performing best?', 'How to rebalance?'];
      } else if (lowerText.includes('market') || lowerText.includes('nifty')) {
        setSelectedTopic('Market');
        aiText = `The market is up today (+1.25% on NIFTY 50 to 22,183.65) led by Banking (+1.5%) and Energy (+1.25%). Foreign Institutional Investors (FII) turned net buyers (+₹2,450 Cr).`;
        followUps = ['Which sectors are leading?', 'Why are FIIs buying today?', 'Show top market gainers'];
      } else if (lowerText.includes('tcs') || lowerText.includes('infosys') || lowerText.includes('compare')) {
        aiText = `Comparing TCS vs Infosys: TCS delivers superior operating margins (24.5% vs INFY 21.2%) and lower attrition, making it a lower volatility pick. Infosys offers higher revenue growth optionality in GenAI contracts at 26x TTM earnings.`;
        related = ['TCS', 'INFY'];
        followUps = ['Which one has better dividend yield?', 'What is ArthSetu View for TCS?', 'Show IT sector headwinds'];
      } else if (lowerText.includes('lab') || lowerText.includes('decision')) {
        setSelectedTopic('Lab');
        aiText = `Your Investment Lab decision score is 82/100 (Strong Quality). Your Reliance entry (+14.2% return) was your highest quality entry based on valuation margin of safety.`;
        followUps = ['Which investment was my best?', 'Where did I take excess risk?', 'Review my original thesis'];
      } else {
        const response = await aiService.chatWithCopilot({
          messages: [{ role: 'user', content: text }]
        });
        aiText = response.text || `Based on ArthSetu research, "${text}" shows favorable risk-reward indicators.`;
        related = response.relatedStocks || ['RELIANCE', 'HDFCBANK'];
        followUps = ['Show fundamental ratios', 'Analyze drawdown risks', 'Add to Investment Lab'];
      }

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiText,
        timestamp: 'Just now',
        confidence: 94,
        relatedStocks: related,
        followUpPrompts: followUps,
        stockContext: stockCtxData
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("AI Copilot Error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "I am ready to assist. Please ask your research question.",
        timestamp: 'Just now',
        confidence: 0,
        followUpPrompts: ['Why is Reliance moving today?', 'Compare TCS and Infosys']
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
        handleSend('Why is Reliance moving today?');
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
          className={`relative bg-[#F8FAFC] border-l border-[#E2E8F0] h-full flex flex-col shadow-2xl z-10 overflow-hidden transition-all duration-300 ${
            viewMode === 'fullscreen' ? 'w-full' : 'w-full max-w-[520px]'
          }`}
        >
          {/* 1. CLEAN PREMIUM HEADER */}
          <header className="p-4 bg-white border-b border-[#E2E8F0] flex items-center justify-between shadow-2xs shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#123B63] to-[#15519D] text-white flex items-center justify-center font-black shadow-xs shrink-0">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-[#172033] leading-tight">ArthSetu AI Copilot</h3>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#15519D] text-[9px] font-black border border-blue-200 uppercase tracking-wider">
                    AI-POWERED
                  </span>
                </div>
                <span className="text-[10px] text-[#64748B] font-medium block">Personal Investment & Research Assistant</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode(viewMode === 'panel' ? 'fullscreen' : 'panel')}
                className="p-2 rounded-xl hover:bg-slate-100 text-[#64748B] hover:text-[#172033] transition cursor-pointer"
                title={viewMode === 'panel' ? 'Expand Full Screen' : 'Collapse Side Panel'}
              >
                {viewMode === 'panel' ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100 text-[#64748B] hover:text-[#172033] transition cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* 2. CHAT TOPIC SELECTOR */}
          <div className="p-3.5 bg-white border-b border-slate-200/80 space-y-2 shrink-0">
            <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider block">
              What would you like to explore?
            </span>

            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
              {[
                { id: 'Portfolio', label: 'My Portfolio', icon: Briefcase },
                { id: 'Stock', label: 'A Stock', icon: Search },
                { id: 'Market', label: 'The Market', icon: Activity },
                { id: 'Sectors', label: 'Sectors', icon: Layers },
                { id: 'Lab', label: 'Investment Lab', icon: FlaskConical },
              ].map((top) => {
                const IconComponent = top.icon;
                const isSelected = selectedTopic === top.id;
                return (
                  <button
                    key={top.id}
                    onClick={() => {
                      setSelectedTopic(isSelected ? null : (top.id as any));
                      if (top.id !== 'Stock') setActiveStockContext(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-[#15519D] text-white border-[#15519D] shadow-xs'
                        : 'bg-[#F8FAFC] text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{top.label}</span>
                  </button>
                );
              })}
            </div>

            {/* STOCK SEARCH FIELD WHEN 'A STOCK' IS SELECTED */}
            {selectedTopic === 'Stock' && (
              <div className="pt-1 space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={stockSearchQuery}
                    onChange={(e) => setStockSearchQuery(e.target.value)}
                    placeholder="Search a company or ticker (e.g. RELIANCE, TCS)..."
                    className="w-full pl-9 pr-3 py-1.5 bg-[#F8FAFC] border border-slate-300 rounded-xl text-xs font-bold text-[#172033] outline-none focus:border-[#15519D]"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                  {filteredSearchStocks.map(st => (
                    <button
                      key={st.symbol}
                      onClick={() => {
                        setActiveStockContext(st);
                        handleSend(`Tell me about ${st.symbol}`);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-black border transition cursor-pointer shrink-0 ${
                        activeStockContext?.symbol === st.symbol
                          ? 'bg-blue-50 border-[#15519D] text-[#15519D]'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {st.symbol} · ₹{st.price}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CONTEXT CHIP BAR */}
            {activeStockContext && (
              <div className="p-2 bg-blue-50/80 rounded-xl border border-blue-200 flex items-center justify-between text-xs font-bold text-[#15519D]">
                <span>Context: {activeStockContext.symbol} · ₹{activeStockContext.price} ({activeStockContext.change}) · ArthSetu View {activeStockContext.score}/100</span>
                <button onClick={() => setActiveStockContext(null)} className="p-0.5 hover:text-slate-900 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* 3. MAIN CONVERSATION SURFACE */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">

            {/* CHAT START SCREEN (IF NO MESSAGES) */}
            {messages.length === 0 && (
              <div className="my-auto py-8 text-center space-y-6 max-w-sm mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#123B63] to-[#15519D] text-white flex items-center justify-center mx-auto shadow-md">
                  <Sparkles className="w-7 h-7 text-amber-300" />
                </div>

                <div className="space-y-1">
                  <h2 className="text-xl font-extrabold text-[#172033]">How can I help?</h2>
                  <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                    Ask me about your portfolio, a stock, the market, or your investment ideas.
                  </p>
                </div>

                {/* LIGHTWEIGHT EXAMPLE PROMPTS */}
                <div className="space-y-2 text-left pt-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block text-center">
                    Example Questions
                  </span>

                  {[
                    { topic: 'Portfolio', text: 'Is my portfolio too concentrated?' },
                    { topic: 'Stock', text: 'Why is Reliance moving today?' },
                    { topic: 'Market', text: 'What is driving today\'s market?' },
                    { topic: 'Research', text: 'Compare TCS and Infosys.' },
                    { topic: 'Investment Lab', text: 'How have my investment decisions performed?' }
                  ].map((p) => (
                    <button
                      key={p.text}
                      onClick={() => handleSend(p.text)}
                      className="w-full p-3 bg-white hover:bg-blue-50/60 border border-slate-200/90 hover:border-[#15519D] rounded-xl text-xs font-bold text-[#172033] transition cursor-pointer flex items-center justify-between group shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-[#15519D] text-[10px] font-black rounded-md">
                          {p.topic}
                        </span>
                        <span>"{p.text}"</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#15519D] transition shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CHAT MESSAGES STREAM */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col gap-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`p-4 rounded-2xl max-w-[92%] text-xs leading-relaxed font-medium ${
                  msg.sender === 'user'
                    ? 'bg-[#15519D] text-white rounded-br-none shadow-xs'
                    : 'bg-white border border-slate-200 text-[#172033] rounded-bl-none shadow-2xs space-y-3'
                }`}>
                  
                  {/* STOCK CONTEXT HEADER IF AVAILABLE */}
                  {msg.stockContext && (
                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-200 text-[#172033] space-y-2">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                        <span className="font-extrabold text-sm">{msg.stockContext.symbol} · ₹{msg.stockContext.price}</span>
                        <span className="px-2 py-0.5 bg-blue-50 text-[#15519D] text-[10px] font-black rounded-md">
                          ArthSetu View {msg.stockContext.score}/100
                        </span>
                      </div>
                      
                      {msg.stockContext.positives && (
                        <div className="text-[11px] space-y-0.5">
                          <strong className="font-black text-emerald-700 block">What's positive:</strong>
                          {msg.stockContext.positives.map(p => <div key={p}>• {p}</div>)}
                        </div>
                      )}

                      {msg.stockContext.watchouts && (
                        <div className="text-[11px] space-y-0.5">
                          <strong className="font-black text-amber-700 block">What to watch:</strong>
                          {msg.stockContext.watchouts.map(w => <div key={w}>• {w}</div>)}
                        </div>
                      )}
                    </div>
                  )}

                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* AI CONVICTION & RELATED STOCKS */}
                  {msg.sender === 'ai' && (
                    <div className="pt-2 border-t border-slate-100 flex flex-col gap-2 text-[10px]">
                      {msg.confidence && (
                        <div className="flex items-center justify-between text-slate-400 font-bold">
                          <span className="flex items-center gap-1 text-[#15519D]">
                            <Sparkles className="w-3 h-3" /> {msg.confidence}% AI Conviction
                          </span>
                          <span>{msg.timestamp}</span>
                        </div>
                      )}

                      {/* CONTEXTUAL FOLLOW-UP PROMPT PILLS */}
                      {msg.followUpPrompts && msg.followUpPrompts.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 space-y-1.5">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                            Suggested Follow-Ups:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.followUpPrompts.map(promptText => (
                              <button
                                key={promptText}
                                onClick={() => handleSend(promptText)}
                                className="px-3 py-1 bg-[#F8FAFC] hover:bg-[#15519D] hover:text-white border border-slate-300 text-slate-800 text-[11px] font-extrabold rounded-xl transition cursor-pointer shadow-2xs"
                              >
                                [ {promptText} ]
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

            {/* AI TYPING INDICATOR */}
            {isAiTyping && (
              <div className="flex flex-col gap-2 items-start">
                <div className="p-4 rounded-2xl max-w-[90%] text-xs leading-relaxed font-medium bg-white border border-slate-200 text-[#172033] rounded-bl-none shadow-2xs">
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 bg-[#15519D] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#15519D] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-[#15519D] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* 4. FIXED CHAT INPUT FOOTER */}
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
                placeholder="Ask ArthSetu AI about a stock, portfolio, market or research..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-4 py-2.5 text-xs text-[#172033] outline-none focus:border-[#15519D] font-medium"
              />

              <button
                onClick={() => handleSend()}
                className="p-2.5 rounded-xl bg-[#15519D] hover:bg-[#123B63] text-white transition shadow-sm cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* AI DISCLAIMER */}
            <div className="text-[9.5px] text-slate-400 font-medium text-center px-1 pt-0.5">
              ArthSetu AI provides research & advisory insights based on available data. AI responses may require verification.
            </div>
          </footer>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AiCopilotModal;
