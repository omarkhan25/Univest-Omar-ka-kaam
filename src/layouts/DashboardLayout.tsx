import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, TrendingUp, Compass, Briefcase, User, 
  Bell, Sparkles, X,
  ArrowRight, ArrowLeft, Search, ChevronDown,
  Bookmark, Plus, Trash2, AlertCircle, Wand2, ArrowUpRight,
  Gem, Clock
} from 'lucide-react';
import { MarketRibbon } from '../components/dashboard/MarketRibbon';
import { InvestHub } from '../components/dashboard/InvestHub';
import { ResearchCenter } from '../components/dashboard/ResearchCenter';
import { PortfolioDashboard } from '../components/portfolio/PortfolioDashboard';
import { ProfileSettingsCenter } from '../components/profile/ProfileSettingsCenter';
import { UserMenuDropdown } from '../components/dashboard/UserMenuDropdown';
import { UniversalSearch } from '../components/dashboard/UniversalSearch';
import { StockDetail } from '../components/dashboard/StockDetail';
import { ResearchDetail } from '../components/dashboard/ResearchDetail';
import { ReportViewer } from '../components/dashboard/ReportViewer';
import { AnalystProfileModal } from '../components/dashboard/AnalystProfileModal';
import { CompareModal } from '../components/dashboard/CompareModal';
import { OrderExecutionDrawer } from '../components/dashboard/OrderExecutionDrawer';
import { NotificationCenterModal } from '../components/dashboard/NotificationCenterModal';
import { NewsDetail } from '../components/dashboard/NewsDetail';
import { AiCopilotModal } from '../components/ai/AiCopilotModal';
import { LearningCenter } from '../components/dashboard/LearningCenter';
import { MarketIntelligenceCenter } from '../components/dashboard/MarketIntelligenceCenter';
import { useAuth } from '../context/AuthContext';
import { LiveMarketStatusWidget } from '../components/dashboard/LiveMarketStatusWidget';
import { AddFundsModal } from '../components/dashboard/AddFundsModal';
import HomeDashboard from '../components/dashboard/HomeDashboard';
import { Newspaper, GraduationCap } from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
  badgeCount?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, label, active = false, onClick, collapsed = false, badgeCount 
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        height: active ? '54px' : '48px',
        borderRadius: active ? '17px' : '12px',
        padding: '0 18px',
      }}
      className={`group relative w-full flex items-center justify-between mb-0 text-sm font-semibold transition-all duration-200 overflow-hidden ${
        active
          ? 'text-white'
          : 'text-[#64748B] hover:text-primary'
      }`}
    >
      {/* Active State Background */}
      {active && (
        <div
          className="absolute inset-0 rounded-[17px]"
          style={{
            background: '#15519D',
            boxShadow: '0 8px 24px -6px rgba(21, 81, 157, 0.45)',
          }}
        />
      )}
      
      {/* Hover State Background */}
      {!active && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: '#EBF3FC', borderRadius: '12px' }}
        />
      )}

      <div className="relative z-10 flex items-center w-full" style={{ gap: collapsed ? 0 : '18px' }}>
        <span
          className="flex-shrink-0 transition-all duration-200"
          style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {icon}
        </span>
        {!collapsed && (
          <span className="truncate flex-1 text-left" style={{ fontSize: '16px', fontWeight: 600, lineHeight: '24px' }}>
            {label}
          </span>
        )}
      </div>
      
      {!collapsed && badgeCount && badgeCount > 0 ? (
        <span
          className={`relative z-10 flex items-center justify-center font-black rounded-full transition-all duration-200`}
          style={{
            width: '22px',
            height: '22px',
            fontSize: '11px',
            flexShrink: 0,
            background: active ? 'rgba(255,255,255,0.2)' : '#EBF3FC',
            color: active ? '#fff' : '#15519D',
            border: active ? '1px solid rgba(255,255,255,0.3)' : '1px solid #B3D4F5',
          }}
        >
          {badgeCount}
        </span>
      ) : null}
    </button>
  );
};

// Types for Workspace elements
interface CustomWatchlist {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
}

interface DrawerStock {
  symbol: string;
  companyName: string;
  price: string;
  changePercent: number;
  sparkline: number[];
  rsi: number;
  alertStatus?: 'target-hit' | 'volume-spike' | 'ai-alert' | 'stop-loss' | null;
  category: string;
  logoText: string;
  flash?: 'green' | 'red' | null;
}

export const DashboardLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const isLoggedIn = isAuthenticated || !!user || !!localStorage.getItem('access_token');

  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [activeInvestCategory, setActiveInvestCategory] = useState('stocks');
  const [aiOpen, setAiOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [workspaceTab, setWorkspaceTab] = useState<'watchlists' | 'research' | 'alerts' | 'ai'>('watchlists');
  
  // Universal Search & Interactivity State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<any | null>(null);
  const [selectedResearch, setSelectedResearch] = useState<any | null>(null);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [selectedAnalyst, setSelectedAnalyst] = useState<any | null>(null);
  const [selectedNews, setSelectedNews] = useState<any | null>(null);
  const [tradeIntent, setTradeIntent] = useState<any | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [addFundsMode, setAddFundsMode] = useState<'deposit' | 'withdraw'>('deposit');
  
  const handleOpenDeposit = () => { setAddFundsMode('deposit'); setIsAddFundsOpen(true); };
  const handleOpenWithdraw = () => { setAddFundsMode('withdraw'); setIsAddFundsOpen(true); };
  
  const handleTradeIntent = (tr: any) => {
    if (!tr) return;
    setTradeIntent({
      symbol: tr.symbol || 'RELIANCE',
      companyName: tr.company || tr.companyName || tr.name || 'Reliance Industries Ltd',
      logo: tr.logo || tr.symbol?.substring(0, 2) || 'RL',
      action: tr.rec || tr.action || 'BUY',
      price: tr.price || 3024.50
    });
  };
  
  // Custom Watchlists state
  const [customWatchlists, setCustomWatchlists] = useState<CustomWatchlist[]>([
    { id: 'cw1', name: 'Dividend Yield', color: 'Purple', icon: 'gem', description: 'Stocks with solid dividend track records' }
  ]);
  const [activeWatchlistTab, setActiveWatchlistTab] = useState<string>('All');
  const [watchlistSearch, setWatchlistSearch] = useState('');
  
  // Watchlist Modal creation state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [newWatchlistColor, setNewWatchlistColor] = useState('Blue');
  const [newWatchlistIcon, setNewWatchlistIcon] = useState('bookmark');
  const [newWatchlistDesc, setNewWatchlistDesc] = useState('');

  // Watchlist Items
  const [watchlistStocks, setWatchlistStocks] = useState<DrawerStock[]>([
    { symbol: 'RELIANCE', companyName: 'Reliance Industries Ltd', price: '2,934.50', changePercent: 1.25, sparkline: [2900, 2910, 2915, 2928, 2934.5], rsi: 58, alertStatus: 'ai-alert', category: 'Long Term', logoText: 'RL' },
    { symbol: 'INFY', companyName: 'Infosys Limited', price: '1,562.10', changePercent: -0.85, sparkline: [1580, 1572, 1560, 1564, 1562.1], rsi: 42, alertStatus: 'stop-loss', category: 'Tech', logoText: 'IF' },
    { symbol: 'TATASTEEL', companyName: 'Tata Steel Limited', price: '147.20', changePercent: 2.40, sparkline: [141, 143, 145, 144, 147.2], rsi: 65, alertStatus: 'target-hit', category: 'Swing', logoText: 'TS' },
    { symbol: 'HDFCBANK', companyName: 'HDFC Bank Limited', price: '1,682.40', changePercent: 0.85, sparkline: [1660, 1672, 1675, 1678, 1682.4], rsi: 52, alertStatus: 'volume-spike', category: 'Long Term', logoText: 'HD' }
  ]);

  // Saved Research
  const savedResearch = [
    { id: 'sr1', symbol: 'HDFCBANK', title: 'Q1 Earnings Beat & Core Margin Recovery Analysis', analyst: 'Aarav Mehta', time: '2 hours ago' },
    { id: 'sr2', symbol: 'RELIANCE', title: 'New Energy Giga-factory Commissioning Valuation Impact', analyst: 'Neha Shah', time: 'Yesterday' }
  ];

  // Active Alerts
  const [activeAlerts, setActiveAlerts] = useState([
    { id: 'al1', symbol: 'INFY', target: '₹1,600', condition: 'Price Above', type: 'target-hit' },
    { id: 'al2', symbol: 'TATASTEEL', target: '₹140', condition: 'Price Below', type: 'stop-loss' }
  ]);

  // AI Queue
  const aiQueue = [
    { id: 'aq1', query: 'Portfolio Sector Concentration Risk Assessment', status: 'Completed', result: 'High exposure detected in IT (25%). Recommending reallocation into defensive utilities.' },
    { id: 'aq2', query: 'Analyze L&T Relative Strength Index breakout validation', status: 'In Progress', result: 'AI Engine calculating technical breakouts...' }
  ];

  // Hover item overlay
  const [hoveredStockSymbol, setHoveredStockSymbol] = useState<string | null>(null);

  const tabs = [
    { name: 'Home', icon: <Home className="w-5 h-5" />, label: 'Home' },
    { name: 'Research', icon: <TrendingUp className="w-5 h-5" />, label: 'Research', badgeCount: 3 },
    { name: 'Invest', icon: <Compass className="w-5 h-5" />, label: 'Invest' },
    { name: 'Portfolio', icon: <Briefcase className="w-5 h-5" />, label: 'Portfolio' },
    { name: 'News', icon: <Newspaper className="w-5 h-5" />, label: 'News', badgeCount: 4 },
    { name: 'Academy', icon: <GraduationCap className="w-5 h-5" />, label: 'Academy' },
    { name: 'Profile', icon: <User className="w-5 h-5" />, label: 'Profile & Settings' },
  ];

  useEffect(() => {
    let isMounted = true;
    
    const fetchWatchlistLivePrices = async () => {
      try {
        const { marketService } = await import('../services/market.service');
        // Initial list of symbols we want in the watchlist
        const symbols = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'];
        const quotes = await marketService.getBatchQuotes(symbols);
        
        if (isMounted && Object.keys(quotes).length > 0) {
          const updatedStocks = symbols.map(sym => {
            const quote = quotes[sym];
            if (!quote) return null;
            
            return {
              symbol: sym,
              name: quote.companyName || sym,
              price: (typeof quote.lastPrice === 'number' ? quote.lastPrice : 0).toLocaleString('en-IN', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
              }),
              change: quote.change,
              changePercent: quote.changePercent,
              marketCap: quote.marketCap || 'N/A'
            };
          }).filter(Boolean) as any[];
          
          setWatchlistStocks(updatedStocks);
        }
      } catch (error) {
        console.error("Failed to fetch live watchlist prices", error);
      }
    };

    fetchWatchlistLivePrices();
    
    // Poll every 10 seconds
    const interval = setInterval(fetchWatchlistLivePrices, 10000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleCreateWatchlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWatchlistName.trim()) return;
    const newId = `cw-${Date.now()}`;
    const newList: CustomWatchlist = {
      id: newId,
      name: newWatchlistName,
      color: newWatchlistColor,
      icon: newWatchlistIcon,
      description: newWatchlistDesc
    };
    setCustomWatchlists(prev => [...prev, newList]);
    setActiveWatchlistTab(newWatchlistName);
    
    // Clear and close
    setNewWatchlistName('');
    setNewWatchlistDesc('');
    setShowCreateModal(false);
  };

  const handleAddStockToWatchlist = () => {
    // Demo quick add helper
    const demoOptions: DrawerStock[] = [
      { symbol: 'TCS', companyName: 'Tata Consultancy Services', price: '4,185.10', changePercent: -0.42, sparkline: [4210, 4200, 4185.1], rsi: 48, alertStatus: null, category: 'Tech', logoText: 'TC' },
      { symbol: 'LT', companyName: 'Larsen & Toubro Ltd', price: '3,456.90', changePercent: 1.05, sparkline: [3410, 3435, 3456.9], rsi: 59, alertStatus: 'ai-alert', category: 'Dividend Yield', logoText: 'LT' }
    ];
    
    const stockToAdd = demoOptions.find(opt => !watchlistStocks.some(w => w.symbol === opt.symbol));
    if (stockToAdd) {
      setWatchlistStocks(prev => [...prev, stockToAdd]);
    }
  };

  const handleRemoveStock = (symbol: string) => {
    setWatchlistStocks(prev => prev.filter(w => w.symbol !== symbol));
  };

  // Watchlist tabs listing
  const watchlistTabs = ['All', 'Long Term', 'Tech', 'Swing', 'F&O', ...customWatchlists.map(c => c.name)];

  const filteredWatchlistStocks = watchlistStocks.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(watchlistSearch.toLowerCase()) || 
                          stock.companyName.toLowerCase().includes(watchlistSearch.toLowerCase());
    const matchesTab = activeWatchlistTab === 'All' || stock.category === activeWatchlistTab;
    return matchesSearch && matchesTab;
  });

  const getAlertBadgeColor = (status?: string | null) => {
    if (!status) return null;
    switch (status) {
      case 'target-hit': return 'bg-[#DCFCE7] text-[#166534]';
      case 'volume-spike': return 'bg-[#FEF3C7] text-[#92400E]';
      case 'ai-alert': return 'bg-[#EBF3FC] text-[#104280]';
      case 'stop-loss': return 'bg-[#FEECEC] text-[#991B1B]';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC] text-brand-navy transition-colors duration-200 pb-20 lg:pb-0">
      
      {/* DESKTOP SIDEBAR NAVIGATION (lg:flex) */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r h-screen sticky top-0 transition-all duration-300 z-30`}
        style={{
          width: collapsed ? '80px' : '286px',
          borderColor: '#E2E8F0',
          minWidth: collapsed ? '80px' : '260px',
        }}
      >
        {/* Brand Header */}
        <div
          className="flex items-center justify-between border-b"
          style={{ height: '72px', padding: '0 18px', borderColor: '#E2E8F0' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center text-white font-extrabold text-base border"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#15519D',
                borderColor: 'rgba(255,255,255,0.08)',
                flexShrink: 0,
              }}
            >
              U
            </div>
            {!collapsed && (
              <span
                className="font-black tracking-tight"
                style={{ fontSize: '18px', color: '#172033', letterSpacing: '-0.02em' }}
              >
                UNIVEST
              </span>
            )}
          </div>
        </div>

        {/* Sidebar Navigation Items */}
        <nav
          className="flex-1 overflow-y-auto flex flex-col"
          style={{ padding: collapsed ? '20px 12px' : '20px 17px', gap: '17px' }}
        >
          {tabs.map((tab) => (
            <SidebarItem
              key={tab.name}
              icon={tab.icon}
              label={tab.label}
              active={activeTab === tab.name}
              onClick={() => setActiveTab(tab.name)}
              collapsed={collapsed}
              badgeCount={tab.badgeCount}
            />
          ))}
        </nav>

        {/* Sidebar Footer — 125px bottom section */}
        <div
          className="flex flex-col border-t"
          style={{ height: '125px', padding: '18px', borderColor: '#E2E8F0', gap: '12px', justifyContent: 'center' }}
        >
          {/* Collapse Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center transition-colors"
            style={{
              height: '38px',
              width: '100%',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              background: '#fff',
              color: '#64748B',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#EBF3FC'; (e.currentTarget as HTMLButtonElement).style.color = '#15519D'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.color = '#64748B'; }}
          >
            {collapsed ? <ArrowRight style={{ width: '18px', height: '18px' }} /> : <ArrowLeft style={{ width: '18px', height: '18px' }} />}
          </button>
          
          {/* User Profile */}
          <div className="flex items-center" style={{ gap: '14px' }}>
            <div
              className="flex items-center justify-center font-black text-white shrink-0"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#15519D',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              {user?.full_name ? user.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'OK'}
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0" style={{ gap: '1px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, lineHeight: '20px', color: '#172033' }} className="truncate">
                  {user?.full_name || 'Omar Khan'}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 400, lineHeight: '16px', color: '#64748B' }} className="truncate">
                  Verified Investor
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER BAR */}
      <header className="lg:hidden h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-30 shadow-premium-sm" style={{ borderColor: '#E2E8F0' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center text-white font-extrabold text-sm"
            style={{ width: '30px', height: '30px', borderRadius: '9px', background: '#15519D', flexShrink: 0 }}
          >
            U
          </div>
          <span className="font-black text-sm tracking-tight" style={{ color: '#172033', letterSpacing: '-0.02em' }}>
            UNIVEST
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Workspace Trigger (mobile) */}
          <button 
            onClick={() => setWorkspaceOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-xl border bg-white transition-colors"
            style={{ borderColor: '#E2E8F0', color: '#64748B' }}
            aria-label="Workspace"
          >
            <Bookmark className="w-4 h-4" />
          </button>
          <button className="relative grid h-9 w-9 place-items-center rounded-xl border bg-white" style={{ borderColor: '#E2E8F0', color: '#64748B' }} aria-label="Notifications">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-danger" />
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-xl text-[10px] font-black text-white" style={{ background: '#15519D' }} aria-label="Open profile">OK</button>
        </div>
      </header>

      {/* MAIN VIEW CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* DESKTOP TOP HEADER */}
        <header className="hidden lg:flex h-[72px] bg-white border-b items-center justify-between px-8 sticky top-0 z-40" style={{ borderColor: '#E2E8F0' }}>

          {/* Universal Search Bar */}
          <div 
            onClick={() => setIsSearchOpen(true)}
            className="flex w-full max-w-md items-center gap-2.5 h-10 rounded-full border px-4 text-slate-500 transition-all cursor-pointer select-none"
            style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#99F6E4'; (e.currentTarget as HTMLDivElement).style.background = '#fff'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#E2E8F0'; (e.currentTarget as HTMLDivElement).style.background = '#F8FAFC'; }}
          >
            <Search className="h-4 w-4 shrink-0" style={{ color: '#15519D' }} />
            <span className="min-w-0 flex-1 text-xs font-medium" style={{ color: '#94A3B8' }}>Search stocks, research, mutual funds, IPOs...</span>
            <kbd className="rounded-md border px-1.5 py-0.5 text-[9px] font-bold" style={{ borderColor: '#E2E8F0', background: '#fff', color: '#94A3B8' }}>⌘ K</kbd>
          </div>

          {/* Right Header Action Items */}
          <div className="flex items-center gap-3">
            {/* Live Market Status Widget */}
            <LiveMarketStatusWidget />

            {/* Notifications Bell */}
            <button 
              onClick={() => setIsNotificationOpen(true)}
              className="relative grid h-10 w-10 place-items-center rounded-full border bg-white transition shadow-2xs cursor-pointer"
              style={{ borderColor: '#E2E8F0', color: '#64748B' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#99F6E4'; (e.currentTarget as HTMLButtonElement).style.background = '#EBF3FC'; (e.currentTarget as HTMLButtonElement).style.color = '#15519D'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#E2E8F0'; (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.color = '#64748B'; }}
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-danger" />
            </button>

            {/* User Profile Menu */}
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(true)}
                className="flex items-center gap-2 h-10 rounded-full border bg-white py-1 pl-1 pr-3 text-left transition shadow-2xs cursor-pointer"
                style={{ borderColor: '#E2E8F0' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#99F6E4'; (e.currentTarget as HTMLButtonElement).style.background = '#EBF3FC'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#E2E8F0'; (e.currentTarget as HTMLButtonElement).style.background = '#fff'; }}
                aria-label="Open profile menu"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full text-[10px] font-black text-white" style={{ background: '#15519D' }}>
                  {user?.full_name ? user.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'OK'}
                </span>
                <span className="hidden xl:block">
                  <span className="block text-[11px] font-bold leading-tight" style={{ color: '#172033' }}>
                    {user?.full_name || 'Omar Khan'}
                  </span>
                </span>
                <ChevronDown className="h-3.5 w-3.5 ml-0.5" style={{ color: '#94A3B8' }} />
              </button>
              <UserMenuDropdown 
                isOpen={isUserMenuOpen} 
                onClose={() => setIsUserMenuOpen(false)} 
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenWorkspace={() => setWorkspaceOpen(true)}
                onAddFunds={() => setIsAddFundsOpen(true)}
                isAuthenticated={isLoggedIn}
                user={user}
                onLogout={logout}
              />
            </div>
          </div>
        </header>

        <MarketRibbon />

        {/* Primary Page Content Grid Area */}
        <main className="flex-1 w-full p-6 flex flex-col gap-6">
          <div className="flex-1">
            {activeTab === 'Home' && (
              children ? (
                React.isValidElement(children) ? (
                  React.cloneElement(children as React.ReactElement<any>, {
                    onSelectStock: (st: any) => setSelectedStock(st),
                    onSelectResearch: (res: any) => setSelectedResearch(res),
                    onTrade: (tr: any) => handleTradeIntent(tr),
                    onNavigateTab: (tb: string) => setActiveTab(tb as any),
                    onDepositFunds: handleOpenDeposit,
                  })
                ) : (
                  children
                )
              ) : (
                <HomeDashboard 
                  onSelectStock={(st) => setSelectedStock(st)}
                  onSelectResearch={(res) => setSelectedResearch(res)}
                  onTrade={(tr) => handleTradeIntent(tr)}
                  onNavigateTab={(tb) => setActiveTab(tb as any)}
                  onDepositFunds={handleOpenDeposit}
                />
              )
            )}
            {activeTab === 'Invest' && (
              <InvestHub 
                activeCategory={activeInvestCategory}
                onSelectStock={(st) => setSelectedStock(st)}
                onSelectResearch={(res) => setSelectedResearch(res)}
                onTrade={(tr) => handleTradeIntent(tr)}
              />
            )}
            {activeTab === 'Research' && (
              <ResearchCenter 
                onTrade={handleTradeIntent}
                onSelectStock={(st) => setSelectedStock(st)}
              />
            )}
            {activeTab === 'Portfolio' && (
              <PortfolioDashboard
                onTrade={(tr) => handleTradeIntent(tr)}
                onSelectResearch={(res) => setSelectedResearch(res)}
                onAddFunds={handleOpenDeposit}
                onWithdraw={handleOpenWithdraw}
              />
            )}
            {activeTab === 'News' && (
              <MarketIntelligenceCenter
                onSelectStock={(st) => setSelectedStock(st)}
                onSelectResearch={(res) => setSelectedResearch(res)}
                onTrade={(tr) => handleTradeIntent(tr)}
              />
            )}
            {activeTab === 'Academy' && (
              <LearningCenter
                onSelectStock={(st) => setSelectedStock(st)}
                onSelectResearch={(res) => setSelectedResearch(res)}
              />
            )}
            {activeTab === 'Profile' && <ProfileSettingsCenter onAddFunds={handleOpenDeposit} />}
          </div>
        </main>
      </div>

      {/* MOBILE STICKY BOTTOM NAVIGATION BAR (lg:hidden) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex items-center justify-around z-30 shadow-[0_-4px_16px_rgba(15,23,42,0.04)] px-4" style={{ borderColor: '#E2E8F0' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex flex-col items-center justify-center gap-1.5 relative py-1 focus:outline-none`}
              style={{ color: isActive ? '#15519D' : '#64748B' }}
            >
              <span>{tab.icon}</span>
              <span className="text-[10px] font-bold">{tab.label}</span>
              {tab.badgeCount && tab.badgeCount > 0 ? (
                <span className="absolute top-0 right-1.5 w-2 h-2 bg-danger rounded-full animate-pulse" />
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* GLOBAL FLOATING AI ASSISTANT ACTION BUTTON */}
      <motion.button
        onClick={() => setAiOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 lg:bottom-8 right-6 lg:right-8 z-40 w-14 h-14 rounded-full flex items-center justify-center text-white border border-white/10 focus:outline-none"
        style={{ background: '#15519D', boxShadow: '0 0 24px 4px rgba(21,81,157,0.35)' }}
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
      </motion.button>

      {/* AI INVESTMENT COPILOT MODAL & WORKSPACE */}
      <AiCopilotModal
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
        onSelectStock={(st) => setSelectedStock(st)}
        onSelectResearch={(res) => setSelectedResearch(res)}
        onTrade={(tr) => setTradeIntent(tr)}
      />

      {/* NOTIFICATION CENTER MODAL & FEED */}
      <NotificationCenterModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onSelectStock={(st) => setSelectedStock(st)}
        onSelectResearch={(res) => setSelectedResearch(res)}
        onTrade={(tr) => setTradeIntent(tr)}
        onSelectNews={(nw) => setSelectedNews(nw)}
      />

      {/* NEWS DETAIL MODAL */}
      <AnimatePresence>
        {selectedNews && (
          <NewsDetail
            isOpen={true}
            onClose={() => setSelectedNews(null)}
            newsItem={selectedNews}
            onOpenCompany={(sym) => {
              setSelectedNews(null);
              setSelectedStock({ symbol: sym, company: sym });
            }}
            onOpenResearch={(res) => {
              setSelectedNews(null);
              setSelectedResearch(res);
            }}
            onTrade={(tr) => {
              setSelectedNews(null);
              setTradeIntent(tr);
            }}
          />
        )}
      </AnimatePresence>

      {/* PREMIUM RIGHT SLIDE-OVER WORKSPACE DRAWER PANEL */}
      <AnimatePresence>
        {workspaceOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setWorkspaceOpen(false)}
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs"
            />
            
            {/* Workspace Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="relative w-full max-w-[450px] bg-white border-l border-brand-border h-full flex flex-col shadow-2xl z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4.5 h-4.5 text-slate-500" />
                    <h3 className="text-sm font-black text-brand-navy">Personal Workspace</h3>
                  </div>
                  <button 
                    onClick={() => setWorkspaceOpen(false)}
                    className="p-1.5 hover:bg-slate-100 rounded-full text-brand-secondary transition-colors"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Workspace Hub Tabs */}
                <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1 text-[10.5px]">
                  {[
                    { id: 'watchlists', label: 'Watchlists' },
                    { id: 'research', label: 'Saved Research' },
                    { id: 'alerts', label: 'Alerts' },
                    { id: 'ai', label: 'AI Queue' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setWorkspaceTab(tab.id as any)}
                      className={`px-2.5 py-1.5 rounded-lg font-black transition-colors shrink-0 ${
                        workspaceTab === tab.id
                          ? 'bg-brand-navy text-white'
                          : 'text-[#64748B] hover:text-[#172033] hover:bg-slate-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drawer Content Body */}
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
                
                {/* 1. WATCHLISTS TAB */}
                {workspaceTab === 'watchlists' && (
                  <div className="flex flex-col gap-4">
                    {/* Performance Summary Banner */}
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-3 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Watchlist performance</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-extrabold text-[#172033]">+{watchlistStocks.length > 0 ? '2.45%' : '0.00%'}</span>
                          <span className="text-[9px] font-bold text-[#16A34A] bg-[#E8F8F0] px-1.5 py-0.2 rounded">Today</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
                        <span className="font-extrabold text-slate-600 text-[10px]">
                          {watchlistStocks.filter(s => s.changePercent >= 0).length} Up • {watchlistStocks.filter(s => s.changePercent < 0).length} Down
                        </span>
                      </div>
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input 
                          type="text"
                          placeholder="Search watchlist..."
                          value={watchlistSearch}
                          onChange={(e) => setWatchlistSearch(e.target.value)}
                          className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-8 pr-3 py-1.5 text-xs text-brand-navy outline-none placeholder:text-slate-400"
                        />
                      </div>
                      <button 
                        onClick={() => setShowCreateModal(true)}
                        className="h-8 px-2.5 bg-brand-navy text-white text-[10px] font-black rounded-lg hover:bg-slate-800 flex items-center gap-1 shrink-0"
                      >
                        <Plus className="w-3 h-3" /> New
                      </button>
                    </div>

                    {/* Watchlist Categories Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-100 text-[10px]">
                      {watchlistTabs.map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveWatchlistTab(tab)}
                          className={`px-2.5 py-1 rounded-lg font-black transition-colors ${
                            activeWatchlistTab === tab 
                              ? 'bg-primary text-white' 
                              : 'bg-slate-100 text-[#64748B] hover:text-[#172033]'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Stock Rows List */}
                    <div className="flex flex-col gap-2 min-h-[160px]">
                      {filteredWatchlistStocks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-8">
                          <Bookmark className="w-8 h-8 text-slate-300" />
                          <h4 className="text-xs font-black text-[#172033] mt-3">Build Your Watchlist</h4>
                          <p className="text-[10px] text-[#64748B] mt-1 leading-normal max-w-[170px]">
                            Track your favourite stocks and receive instant alerts.
                          </p>
                          <button 
                            onClick={handleAddStockToWatchlist}
                            className="mt-3 text-[10px] font-black bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary"
                          >
                            Add Stock Feed
                          </button>
                        </div>
                      ) : (
                        filteredWatchlistStocks.map((stock) => {
                          const isPositive = stock.changePercent >= 0;
                          const isHovered = hoveredStockSymbol === stock.symbol;

                          return (
                            <div 
                              key={stock.symbol}
                              onMouseEnter={() => setHoveredStockSymbol(stock.symbol)}
                              onMouseLeave={() => setHoveredStockSymbol(null)}
                              className={`relative p-3 rounded-xl border transition-all duration-200 ${
                                stock.flash === 'green'
                                  ? 'bg-emerald-50 border-emerald-300'
                                  : stock.flash === 'red'
                                  ? 'bg-rose-50 border-rose-300'
                                  : 'bg-white border-[#E2E8F0] hover:border-slate-300'
                              }`}
                            >
                              {/* Stock Info */}
                              <div className={`flex items-center justify-between transition-opacity ${isHovered ? 'opacity-15' : 'opacity-100'}`}>
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center font-black text-[9px] text-[#64748B] shrink-0">
                                    {stock.logoText}
                                  </span>
                                  <div className="min-w-0">
                                    <span className="text-xs font-black text-[#172033] block">{stock.symbol}</span>
                                    <span className="text-[9.5px] text-[#64748B] truncate block max-w-[100px]">{stock.companyName}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2.5 shrink-0">
                                  {/* Alert & RSI */}
                                  <div className="flex flex-col gap-0.5 items-end">
                                    {stock.alertStatus && (
                                      <span className={`text-[8px] font-black px-1.5 py-0.2 rounded-full ${getAlertBadgeColor(stock.alertStatus)}`}>
                                        {stock.alertStatus.toUpperCase()}
                                      </span>
                                    )}
                                    <span className="text-[8.5px] font-bold text-slate-400">RSI {stock.rsi}</span>
                                  </div>

                                  {/* Mini sparkline */}
                                  <svg className="w-8 h-4 overflow-visible" viewBox="0 0 40 20">
                                    <path 
                                      d={isPositive ? 'M0 15 L8 12 L16 14 L24 6 L32 8 L40 2' : 'M0 5 L8 8 L16 6 L24 14 L32 12 L40 18'} 
                                      fill="none" 
                                      stroke={isPositive ? '#16A34A' : '#DC2626'} 
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                    />
                                  </svg>

                                  <div className="text-right">
                                    <span className="text-[11px] font-extrabold text-[#172033] block">₹{stock.price}</span>
                                    <span className={`text-[9px] font-black block ${isPositive ? 'text-[#16A34A]' : 'text-loss'}`}>
                                      {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Desktop Hover Quick Actions Overlay */}
                              {isHovered && (
                                <div className="absolute inset-0 bg-slate-50/95 rounded-xl flex items-center justify-around px-3 z-10">
                                  <button className="text-[9px] font-black text-white bg-primary px-2 py-1 rounded-md hover:bg-primary">
                                    BUY
                                  </button>
                                  <button className="text-[9px] font-black text-brand-navy bg-slate-200 px-2 py-1 rounded-md hover:bg-slate-300">
                                    ANALYZE
                                  </button>
                                  <button className="text-[9px] font-black text-brand-navy bg-white border border-[#E2E8F0] px-2 py-1 rounded-md hover:bg-slate-100">
                                    RESEARCH
                                  </button>
                                  <button 
                                    onClick={() => handleRemoveStock(stock.symbol)}
                                    className="p-1 hover:bg-rose-50 text-loss rounded-md"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Quick Add helper trigger */}
                    {watchlistStocks.length < 6 && (
                      <button 
                        onClick={handleAddStockToWatchlist}
                        className="w-full py-2 bg-slate-50 border border-dashed border-[#E2E8F0] hover:border-slate-400 text-[#64748B] hover:text-[#172033] rounded-xl text-xs font-bold transition-colors text-center"
                      >
                        + Add Stock from Recommendations
                      </button>
                    )}

                    {/* AI Suggested Stocks */}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> AI Suggested Stocks</h4>
                      <div className="bg-primary-light/40 border border-[#E2E8F0]/60 p-3 rounded-xl flex items-start gap-2.5 text-xs">
                        <Wand2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-primary">Add L&T (Larsen & Toubro)</span>
                          <p className="text-[10.5px] text-slate-600 mt-1 leading-normal">
                            Based on your watchlist momentum, L&T shows strong correlation and breakouts in the industrial sector.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Recently Viewed */}
                    <div className="mt-2 pt-2">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Recently Viewed</h4>
                      <div className="flex gap-2 text-[10px] font-bold text-[#64748B]">
                        <span className="bg-slate-100 px-2 py-1 rounded cursor-pointer hover:bg-slate-200">TCS</span>
                        <span className="bg-slate-100 px-2 py-1 rounded cursor-pointer hover:bg-slate-200">TATAMOTORS</span>
                        <span className="bg-slate-100 px-2 py-1 rounded cursor-pointer hover:bg-slate-200">GOLD FUT</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. SAVED RESEARCH TAB */}
                {workspaceTab === 'research' && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase text-brand-navy">Bookmarks</h4>
                      <span className="text-[10px] text-[#64748B] font-bold">{savedResearch.length} Saved</span>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {savedResearch.map((res) => (
                        <div key={res.id} className="bg-white border border-[#E2E8F0] p-3 rounded-xl hover:border-primary-light transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black bg-primary-light text-primary px-2 py-0.5 rounded">{res.symbol}</span>
                            <span className="text-[9px] text-slate-400">{res.time}</span>
                          </div>
                          <h4 className="text-xs font-black text-[#172033] mt-2 leading-relaxed">{res.title}</h4>
                          <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-slate-50 text-[10px]">
                            <span className="text-slate-400">By <b>{res.analyst}</b></span>
                            <button className="text-primary font-bold hover:underline flex items-center gap-0.5">
                              Read Call <ArrowUpRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. ALERTS TAB */}
                {workspaceTab === 'alerts' && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase text-brand-navy">Active Price Alerts</h4>
                      <button className="h-7 px-2.5 bg-brand-navy hover:bg-slate-800 text-[10px] font-black text-white rounded-lg">
                        + Add Alert
                      </button>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {activeAlerts.map((alert) => (
                        <div key={alert.id} className="bg-white border border-[#E2E8F0] p-3 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                            <div>
                              <span className="text-xs font-black text-[#172033]">{alert.symbol}</span>
                              <span className="block text-[9.5px] text-[#64748B] mt-0.5">{alert.condition} <b>{alert.target}</b></span>
                            </div>
                          </div>
                          <button 
                            onClick={() => setActiveAlerts(curr => curr.filter(a => a.id !== alert.id))}
                            className="text-[9px] font-black text-loss hover:bg-rose-50 px-2.5 py-1 rounded-md"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. AI QUEUE TAB */}
                {workspaceTab === 'ai' && (
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-black uppercase text-brand-navy">AI Intelligence Backlog</h4>
                    
                    <div className="flex flex-col gap-3">
                      {aiQueue.map((item) => (
                        <div key={item.id} className="bg-white border border-[#E2E8F0] p-3.5 rounded-xl flex flex-col gap-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-brand-navy leading-normal">{item.query}</span>
                            <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded ${
                              item.status === 'Completed' ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FEF3C7] text-[#92400E]'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          {item.result && (
                            <p className="text-[10px] text-slate-500 leading-normal bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                              {item.result}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NEW WATCHLIST CREATOR MODAL OVERLAY */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            
            <motion.form 
              onSubmit={handleCreateWatchlist}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white border border-[#E2E8F0] rounded-[24px] shadow-2xl p-5 md:p-6 w-full max-w-sm flex flex-col gap-4 z-10"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-brand-navy">Create Watchlist</h3>
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 hover:bg-slate-100 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Watchlist Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Intraday Tech" 
                  value={newWatchlistName}
                  onChange={(e) => setNewWatchlistName(e.target.value)}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-brand-navy outline-none focus:border-primary"
                />
              </div>

              {/* Color */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Color Tag</label>
                <div className="flex items-center gap-2">
                  {['Blue', 'Green', 'Purple', 'Orange'].map((col) => (
                    <button
                      type="button"
                      key={col}
                      onClick={() => setNewWatchlistColor(col)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black border transition-colors ${
                        newWatchlistColor === col 
                          ? 'bg-brand-navy text-white' 
                          : 'bg-slate-100 text-[#64748B] hover:bg-slate-200'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Icon</label>
                <div className="flex items-center gap-2">
                  {['bookmark', 'trending', 'gem', 'sparkle'].map((ic) => (
                    <button
                      type="button"
                      key={ic}
                      onClick={() => setNewWatchlistIcon(ic)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                        newWatchlistIcon === ic 
                          ? 'bg-slate-200 border-slate-400 text-[#172033]' 
                          : 'bg-[#F8FAFC] hover:bg-slate-100 text-slate-500'
                      }`}
                    >
                      {ic === 'bookmark' && <Bookmark className="w-4 h-4" />}
                      {ic === 'trending' && <TrendingUp className="w-4 h-4" />}
                      {ic === 'gem' && <Gem className="w-4 h-4" />}
                      {ic === 'sparkle' && <Sparkles className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-brand-navy hover:bg-slate-800 text-xs font-black text-white rounded-xl shadow-premium mt-1 transition-colors"
              >
                Create Watchlist
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* GLOBAL UNIVERSAL SEARCH & WORKSPACE MODALS */}
      <UniversalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectStock={(stock) => setSelectedStock(stock)}
        onSelectResearch={(res) => setSelectedResearch(res)}
        onSelectReport={(rep) => setSelectedReport(rep)}
        onSelectAnalyst={(an) => setSelectedAnalyst(an)}
      />

      <AnimatePresence>
        {selectedStock && (
          <StockDetail
            isOpen={true}
            onClose={() => setSelectedStock(null)}
            companyName={selectedStock?.company || selectedStock?.name}
            symbol={selectedStock?.symbol}
            logo={selectedStock?.logo}
            isTrading={selectedStock?.isTrading}
            action={selectedStock?.action}
            onTrade={(tr) => {
              // Set trade intent first (mounts the drawer), then close stock detail
              handleTradeIntent(tr);
              setTimeout(() => setSelectedStock(null), 50);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {tradeIntent && (
          <OrderExecutionDrawer
            isOpen={true}
            onClose={() => setTradeIntent(null)}
            symbol={tradeIntent.symbol}
            companyName={tradeIntent.companyName}
            logo={tradeIntent.logo}
            initialAction={tradeIntent.action}
            initialPrice={tradeIntent.price}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedResearch && (
          <ResearchDetail
            isOpen={true}
            onClose={() => setSelectedResearch(null)}
            research={selectedResearch}
            onTrade={(t) => handleTradeIntent(t)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedReport && (
          <ReportViewer
            isOpen={true}
            onClose={() => setSelectedReport(null)}
            report={selectedReport}
          />
        )}
      </AnimatePresence>

      <AnalystProfileModal
        isOpen={!!selectedAnalyst}
        onClose={() => setSelectedAnalyst(null)}
        analyst={selectedAnalyst}
        onSelectResearch={(res) => setSelectedResearch(res)}
      />

      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onSelectStock={(st) => setSelectedStock(st)}
        onSelectResearch={(res) => setSelectedResearch(res)}
        onTrade={(tr) => handleTradeIntent(tr)}
      />

      <AddFundsModal
        isOpen={isAddFundsOpen}
        onClose={() => setIsAddFundsOpen(false)}
        initialMode={addFundsMode}
      />

    </div>
  );
};
export default DashboardLayout;
