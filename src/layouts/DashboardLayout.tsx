import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Compass, TrendingUp, Newspaper, Briefcase, Gem, 
  Search, Sparkles, Bell, ChevronDown, ArrowRight, Plus, 
  Settings, MoreVertical, Star, ChevronRight, User, ShieldCheck, FlaskConical
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

import LiveStockTicker from '../components/dashboard/LiveStockTicker';
import HomeDashboard from '../components/dashboard/HomeDashboard';
import MarketsCenter from '../components/dashboard/MarketsCenter';
import ResearchCenter from '../components/dashboard/ResearchCenter';
import NewsCenter from '../components/dashboard/NewsCenter';
import PortfolioDashboard from '../components/portfolio/PortfolioDashboard';
import ProCenter from '../components/dashboard/ProCenter';

import { StockDetail } from '../components/dashboard/StockDetail';
import { ResearchDetail } from '../components/dashboard/ResearchDetail';
import { UniversalSearch } from '../components/dashboard/UniversalSearch';
import { UserMenuDropdown } from '../components/dashboard/UserMenuDropdown';
import { PremiumPricingModal } from '../components/dashboard/PremiumPricingModal';
import { AiCopilotModal } from '../components/ai/AiCopilotModal';

const RIGHT_WATCHLIST_DATA = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', price: '2,975.80', changePercent: 2.35, isPositive: true, sparkline: [2910, 2930, 2945, 2975.8], badgeBg: 'bg-emerald-100 text-emerald-800' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: '4,182.75', changePercent: -0.45, isPositive: false, sparkline: [4210, 4200, 4190, 4182.75], badgeBg: 'bg-purple-100 text-purple-800' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: '1,678.40', changePercent: 1.81, isPositive: true, sparkline: [1650, 1662, 1670, 1678.4], badgeBg: 'bg-sky-100 text-sky-800' },
  { symbol: 'INFY', name: 'Infosys Ltd.', price: '1,634.20', changePercent: 0.92, isPositive: true, sparkline: [1615, 1620, 1628, 1634.2], badgeBg: 'bg-pink-100 text-pink-800' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', price: '1,248.65', changePercent: -0.32, isPositive: false, sparkline: [1255, 1252, 1250, 1248.65], badgeBg: 'bg-rose-100 text-rose-800' },
  { symbol: 'SBIN', name: 'State Bank of India', price: '857.10', changePercent: 1.68, isPositive: true, sparkline: [842, 848, 852, 857.1], badgeBg: 'bg-[#E0F2FE] text-[#15519D]' },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd.', price: '3,620.45', changePercent: 1.92, isPositive: true, sparkline: [3550, 3575, 3600, 3620.45], badgeBg: 'bg-emerald-100 text-emerald-800' },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd.', price: '1,166.30', changePercent: 0.76, isPositive: true, sparkline: [1156, 1160, 1162, 1166.3], badgeBg: 'bg-pink-100 text-pink-800' },
  { symbol: 'BAJFINANCE', price: '6,912.30', changePercent: -0.16, isPositive: false, sparkline: [6930, 6925, 6918, 6912.3], badgeBg: 'bg-[#E0F2FE] text-[#15519D]', name: 'Bajaj Finance Ltd.' },
  { symbol: 'SUNPHARMA', price: '1,782.55', changePercent: 0.55, isPositive: true, sparkline: [1770, 1775, 1778, 1782.55], badgeBg: 'bg-amber-100 text-amber-800', name: 'Sun Pharma Ltd.' },
];

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Home');
  const [selectedStock, setSelectedStock] = useState<any | null>(null);
  const [selectedResearch, setSelectedResearch] = useState<any | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navTabs = [
    { name: 'Home', icon: <Home className="w-5 h-5" />, label: 'Home' },
    { name: 'Markets', icon: <Compass className="w-5 h-5" />, label: 'Markets' },
    { name: 'Research', icon: <TrendingUp className="w-5 h-5" />, label: 'Research' },
    { name: 'News', icon: <Newspaper className="w-5 h-5" />, label: 'News' },
    { name: 'Portfolio', icon: <FlaskConical className="w-5 h-5" />, label: 'Investment Lab' },
    { name: 'Pro', icon: <Gem className="w-5 h-5" />, label: 'Pro' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-[#172033] flex flex-col">
      
      {/* 1. MOVING LIVE STOCK TICKER STRIP FIXED AT VERY TOP */}
      <div className="sticky top-0 z-50">
        <LiveStockTicker onSelectStock={(symbol) => setSelectedStock({ symbol })} />
      </div>

      <div className="flex-1 flex w-full relative">
        
        {/* 2. LEFT SIDEBAR — PERMANENTLY FIXED ON SCREEN (240px Width) */}
        <aside className="fixed top-[28px] left-0 bottom-0 w-[240px] bg-white border-r border-[#E2E8F0] hidden lg:flex flex-col z-30 shadow-2xs justify-between overflow-y-auto scrollbar-none">
          <div>
            {/* Brand Header */}
            <div className="p-6 border-b border-slate-100 flex flex-col gap-0.5 cursor-pointer" onClick={() => setActiveTab('Home')}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#15519D] text-white font-black text-xl flex items-center justify-center shadow-md">
                  U
                </div>
                <span className="font-black text-xl tracking-tight text-[#15519D]">UNIVEST</span>
              </div>
              <span className="text-[10px] font-extrabold text-slate-400 tracking-tight mt-1">
                Invest Intelligence. Gain Confidence.
              </span>
            </div>

            {/* Nav Items */}
            <nav className="p-4 space-y-1.5">
              {navTabs.map((tab) => {
                const isActive = activeTab === tab.name;
                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-150 ${
                      isActive
                        ? 'bg-[#15519D] text-white shadow-md shadow-blue-900/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span className="shrink-0">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Upgrade & Profile Area */}
          <div className="p-4 space-y-4 border-t border-slate-100 bg-white">
            {/* Upgrade to Pro Banner */}
            <div className="p-4 bg-gradient-to-br from-amber-500/10 via-amber-50 to-blue-50 rounded-2xl border border-amber-200 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
                <Gem className="w-4 h-4 text-amber-600 fill-current" />
                <span>Upgrade to Pro</span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-tight">
                Unlock expert research, stock scores, pro picks & more.
              </p>
              <button
                onClick={() => setIsPricingOpen(true)}
                className="w-full py-2 bg-[#15519D] hover:bg-[#123B63] text-white text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>Go Pro</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* User Profile Chip */}
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#15519D] text-white font-black text-xs flex items-center justify-center">
                  AK
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">Aman Kumar</div>
                  <div className="text-[10px] font-bold text-emerald-600">Premium Plan</div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </aside>

        {/* 3. MAIN CENTER & RIGHT WATCHLIST WRAPPER (PADDED FOR FIXED NAV BAR) */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-[240px]">
          
          {/* GLOBAL TOP HEADER STICKY BELOW TICKER */}
          <header className="h-20 bg-white border-b border-[#E2E8F0] sticky top-[28px] z-40 px-8 flex items-center justify-between shadow-2xs gap-6">
            {/* Left Date & Market Open Indicator */}
            <div className="flex items-center gap-3.5 text-sm font-bold text-slate-500">
              <span className="font-black text-slate-900 text-sm">Tuesday, 27 May 2025</span>
              <span className="flex items-center gap-1.5 font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-xs border border-emerald-200/60 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Market Open
              </span>
              <span className="text-slate-500 font-bold text-xs">• NSE</span>
              <span className="text-slate-500 font-bold text-xs">• BSE</span>
            </div>

            {/* Center Universal Search Bar */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-3 px-4 py-3 bg-slate-100/90 hover:bg-slate-200/70 rounded-2xl text-sm font-semibold text-slate-500 w-72 md:w-[480px] lg:w-[540px] transition-all border border-slate-200/80 shadow-2xs group"
            >
              <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
              <span className="truncate">Search stocks, companies, sectors...</span>
            </button>

            {/* Right Header Actions */}
            <div className="flex items-center gap-3.5 shrink-0">
              <button
                onClick={() => setIsAiOpen(true)}
                className="px-5 py-2.5 bg-[#15519D] hover:bg-[#123B63] text-white rounded-2xl text-sm font-black flex items-center gap-2 shadow-md shadow-blue-900/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-4.5 h-4.5 text-amber-300" />
                <span>Ask AI Copilot</span>
              </button>

              <button className="relative p-3 rounded-2xl border border-slate-200/80 text-slate-600 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer">
                <Bell className="w-5 h-5 text-slate-700" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-2xl transition-colors cursor-pointer border border-slate-200/60 shadow-2xs"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#15519D] text-white text-xs font-black flex items-center justify-center shadow-xs">
                    AK
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500 pr-1" />
                </button>

                <UserMenuDropdown
                  isOpen={isUserMenuOpen}
                  onClose={() => setIsUserMenuOpen(false)}
                  onNavigateTab={(tb) => setActiveTab(tb)}
                  onOpenWorkspace={() => {}}
                  onAddFunds={() => setIsPricingOpen(true)}
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={logout}
                />
              </div>
            </div>
          </header>

          {/* MAIN WORKSPACE GRID: CENTER CONTENT + RIGHT WATCHLIST PANEL */}
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-0">
            
            {/* CENTER PRIMARY VIEW AREA (8-9 COLS ON DESKTOP) */}
            <main className="xl:col-span-8 2xl:col-span-9 p-6 max-w-[1400px] w-full mx-auto">
              {children ? (
                children
              ) : (
                <>
                  {activeTab === 'Home' && (
                    <HomeDashboard
                      onSelectStock={(st) => setSelectedStock(st)}
                      onSelectResearch={(res) => setSelectedResearch(res)}
                      onNavigateTab={(tb) => setActiveTab(tb)}
                      onOpenPricing={() => setIsPricingOpen(true)}
                    />
                  )}

                  {activeTab === 'Markets' && (
                    <MarketsCenter
                      onSelectStock={(st) => setSelectedStock(st)}
                    />
                  )}

                  {activeTab === 'Research' && (
                    <ResearchCenter
                      onSelectStock={(st) => setSelectedStock(st)}
                    />
                  )}

                  {activeTab === 'News' && (
                    <NewsCenter
                      onSelectStock={(st) => setSelectedStock(st)}
                    />
                  )}

                  {activeTab === 'Portfolio' && (
                    <PortfolioDashboard
                      onSelectStock={(st) => setSelectedStock(st)}
                    />
                  )}

                  {activeTab === 'Pro' && (
                    <ProCenter
                      onSelectStock={(st) => setSelectedStock(st)}
                      onOpenPricingModal={() => setIsPricingOpen(true)}
                    />
                  )}
                </>
              )}
            </main>

            {/* RIGHT SIDEBAR — PERSISTENT WATCHLIST PANEL (3-4 COLS ON DESKTOP) */}
            <aside className="xl:col-span-4 2xl:col-span-3 bg-white border-l border-[#E2E8F0] p-6 space-y-6 hidden xl:block shrink-0 shadow-2xs sticky top-[100px] h-[calc(100vh-100px)] overflow-y-auto scrollbar-none">
              
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-base">My Watchlists</h3>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <button className="p-1 hover:text-slate-700" title="Add Stock"><Plus className="w-4 h-4" /></button>
                    <button className="p-1 hover:text-slate-700" title="Watchlist Settings"><Settings className="w-4 h-4" /></button>
                    <button className="p-1 hover:text-slate-700" title="Options"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="relative">
                  <select className="w-full appearance-none bg-slate-100 text-slate-800 text-xs font-extrabold py-2 px-3.5 rounded-xl cursor-pointer border border-slate-200/80 focus:outline-hidden">
                    <option>Default</option>
                    <option>Long Term Compounders</option>
                    <option>Tech & SaaS</option>
                    <option>High Growth Defense</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Watchlist Table */}
              <div className="space-y-3">
                <div className="grid grid-cols-12 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100">
                  <span className="col-span-5">Stock</span>
                  <span className="col-span-3 text-right">Price</span>
                  <span className="col-span-2 text-right">Change</span>
                  <span className="col-span-2 text-right">1D Chart</span>
                </div>

                <div className="space-y-2">
                  {RIGHT_WATCHLIST_DATA.map((stk) => (
                    <div
                      key={stk.symbol}
                      onClick={() => setSelectedStock({ symbol: stk.symbol, name: stk.name, price: stk.price })}
                      className="grid grid-cols-12 items-center py-2 px-2 hover:bg-slate-50/90 rounded-xl transition-colors cursor-pointer group"
                    >
                      {/* Symbol & Initial Badge */}
                      <div className="col-span-5 flex items-center gap-2 min-w-0">
                        <div className={`w-7 h-7 rounded-lg font-black text-[10px] flex items-center justify-center shrink-0 ${stk.badgeBg}`}>
                          {stk.symbol.substring(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-extrabold text-slate-900 text-xs truncate group-hover:text-[#15519D] transition-colors">{stk.symbol}</div>
                          {stk.name && <div className="text-[9px] text-slate-400 truncate">{stk.name}</div>}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-3 text-right font-extrabold text-slate-900 text-xs font-mono">
                        ₹{stk.price}
                      </div>

                      {/* Change % */}
                      <div className={`col-span-2 text-right font-extrabold text-[11px] ${stk.isPositive ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                        {stk.isPositive ? `+${stk.changePercent}%` : `${stk.changePercent}%`}
                      </div>

                      {/* Sparkline */}
                      <div className="col-span-2 flex justify-end">
                        <svg className="w-10 h-4 overflow-visible" viewBox="0 0 30 12">
                          <polyline
                            fill="none"
                            stroke={stk.isPositive ? '#16A34A' : '#DC2626'}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            points={stk.isPositive ? "0,10 10,8 20,9 30,2" : "0,2 10,6 20,5 30,10"}
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-center border-t border-slate-100">
                  <button
                    onClick={() => setActiveTab('Markets')}
                    className="text-xs font-extrabold text-[#15519D] hover:underline inline-flex items-center gap-1"
                  >
                    <span>View all watchlists</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* QUICK INSIGHTS PANEL */}
              <div className="p-4 bg-[#F8FAFC] rounded-[16px] border border-slate-200/80 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Quick Insights</h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Nifty up 170 pts led by Banking & IT.
                </p>
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span>6 / 10 stocks in watchlist are up today</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>

            </aside>
          </div>

          {/* DISCLAIMER FOOTER */}
          <footer className="p-4 text-center border-t border-slate-200 bg-white text-[11px] text-slate-400 font-medium">
            Disclaimer: Investments in securities market are subject to market risks. Read all the related documents carefully before investing. UNIVEST is an investment intelligence platform, not a broker.
          </footer>

        </div>
      </div>

      {/* MODALS */}
      <UniversalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectStock={(st) => setSelectedStock(st)}
        onSelectResearch={(res) => setSelectedResearch(res)}
        onSelectReport={() => {}}
        onSelectAnalyst={() => {}}
      />

      <StockDetail
        isOpen={!!selectedStock}
        onClose={() => setSelectedStock(null)}
        stock={selectedStock}
      />

      <ResearchDetail
        isOpen={!!selectedResearch}
        onClose={() => setSelectedResearch(null)}
        researchItem={selectedResearch}
      />

      <PremiumPricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
      />

      <AiCopilotModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        onSelectStock={(st) => setSelectedStock(st)}
      />
    </div>
  );
};

export default DashboardLayout;
