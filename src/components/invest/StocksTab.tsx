import React, { useState, useMemo } from 'react';
import { 
  BarChart3, Search, Filter, ShieldCheck, ArrowUpRight, 
  ChevronRight, Bookmark, ArrowRight, Zap, RefreshCw, LayoutGrid, List
} from 'lucide-react';
import { motion } from 'framer-motion';

export interface StockItem {
  id: string;
  symbol: string;
  companyName: string;
  sector: string;
  marketCapTier: 'Large' | 'Mid' | 'Small' | 'Micro';
  marketCap: number; // Cr
  currentPrice: number;
  changePercent: number;
  peRatio: number;
  dividendYield: number;
  isFNO: boolean;
  isMomentum: boolean;
  volume: string;
}

export const MOCK_STOCKS_DATA: StockItem[] = [
  { id: '1', symbol: 'RELIANCE', companyName: 'Reliance Industries Ltd', sector: 'Energy', marketCapTier: 'Large', marketCap: 1932456, currentPrice: 2934.50, changePercent: 1.25, peRatio: 24.2, dividendYield: 0.45, isFNO: true, isMomentum: true, volume: '4.2M' },
  { id: '2', symbol: 'HDFCBANK', companyName: 'HDFC Bank Limited', sector: 'Banking', marketCapTier: 'Large', marketCap: 1284500, currentPrice: 1682.40, changePercent: 0.85, peRatio: 18.6, dividendYield: 1.10, isFNO: true, isMomentum: false, volume: '6.8M' },
  { id: '3', symbol: 'TATASTEEL', companyName: 'Tata Steel Limited', sector: 'Metals', marketCapTier: 'Large', marketCap: 182400, currentPrice: 147.20, changePercent: 2.40, peRatio: 14.1, dividendYield: 2.40, isFNO: true, isMomentum: true, volume: '14.5M' },
  { id: '4', symbol: 'INFY', companyName: 'Infosys Limited', sector: 'IT', marketCapTier: 'Large', marketCap: 648900, currentPrice: 1562.10, changePercent: -0.85, peRatio: 23.5, dividendYield: 2.15, isFNO: true, isMomentum: false, volume: '3.1M' },
  { id: '5', symbol: 'TCS', companyName: 'Tata Consultancy Services', sector: 'IT', marketCapTier: 'Large', marketCap: 1515000, currentPrice: 4185.10, changePercent: -0.42, peRatio: 28.4, dividendYield: 1.40, isFNO: true, isMomentum: false, volume: '1.9M' },
  { id: '6', symbol: 'ICICIBANK', companyName: 'ICICI Bank Limited', sector: 'Banking', marketCapTier: 'Large', marketCap: 874500, currentPrice: 1240.50, changePercent: 1.40, peRatio: 17.8, dividendYield: 0.85, isFNO: true, isMomentum: true, volume: '5.4M' },
  { id: '7', symbol: 'LT', companyName: 'Larsen & Toubro Ltd', sector: 'Capital Goods', marketCapTier: 'Large', marketCap: 485000, currentPrice: 3456.90, changePercent: 1.05, peRatio: 31.2, dividendYield: 0.70, isFNO: true, isMomentum: true, volume: '1.4M' },
  { id: '8', symbol: 'SUNPHARMA', companyName: 'Sun Pharmaceutical Ind', sector: 'Pharma', marketCapTier: 'Large', marketCap: 378900, currentPrice: 1580.20, changePercent: 2.10, peRatio: 34.5, dividendYield: 0.80, isFNO: true, isMomentum: true, volume: '2.1M' },
  { id: '9', symbol: 'SUZLON', companyName: 'Suzlon Energy Limited', sector: 'Energy', marketCapTier: 'Mid', marketCap: 74500, currentPrice: 54.80, changePercent: 4.80, peRatio: 45.2, dividendYield: 0.00, isFNO: true, isMomentum: true, volume: '48.2M' },
  { id: '10', symbol: 'IDEA', companyName: 'Vodafone Idea Limited', sector: 'Telecom', marketCapTier: 'Mid', marketCap: 52400, currentPrice: 16.40, changePercent: -2.10, peRatio: 0.0, dividendYield: 0.00, isFNO: true, isMomentum: false, volume: '112.5M' },
];

export const StocksTab: React.FC<{
  onSelectStock: (stock: StockItem) => void;
  onTrade: (stock: StockItem) => void;
}> = ({ onSelectStock, onTrade }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const categories = [
    { key: 'All', label: 'All Stocks' },
    { key: 'Large', label: 'Large Cap' },
    { key: 'Mid', label: 'Mid Cap' },
    { key: 'Momentum', label: 'Momentum Stocks' },
    { key: 'FNO', label: 'F&O Stocks' },
    { key: 'Dividend', label: 'High Dividend' }
  ];

  const sectors = ['All', 'Banking', 'IT', 'Energy', 'Metals', 'Capital Goods', 'Pharma'];

  const filteredStocks = useMemo(() => {
    return MOCK_STOCKS_DATA.filter((stk) => {
      let matchesCat = true;
      if (selectedCategory === 'Large') matchesCat = stk.marketCapTier === 'Large';
      else if (selectedCategory === 'Mid') matchesCat = stk.marketCapTier === 'Mid';
      else if (selectedCategory === 'Momentum') matchesCat = stk.isMomentum;
      else if (selectedCategory === 'FNO') matchesCat = stk.isFNO;
      else if (selectedCategory === 'Dividend') matchesCat = stk.dividendYield > 1.0;

      const matchesSec = selectedSector === 'All' || stk.sector === selectedSector;
      const matchesSearch = 
        stk.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stk.companyName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCat && matchesSec && matchesSearch;
    });
  }, [selectedCategory, selectedSector, searchQuery]);

  return (
    <div className="flex flex-col gap-6 w-full font-sans text-slate-800 animate-in fade-in duration-300">
      
      {/* 2.1 CATEGORY & SECTOR FILTER BAR */}
      <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold w-full md:w-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.key
                  ? 'bg-[#0F172A] text-white font-black'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none cursor-pointer"
          >
            {sectors.map((sec) => (
              <option key={sec} value={sec}>Sector: {sec}</option>
            ))}
          </select>

          <div className="relative flex-1 md:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* RESULT METRICS */}
      <div className="flex justify-between items-center text-xs font-bold text-slate-500">
        <span>Showing {filteredStocks.length} NSE/BSE Listed Equities</span>
        <span>SEBI Regulated Order Execution</span>
      </div>

      {/* 2.3 STOCK LIST VIEW */}
      {viewMode === 'list' ? (
        <div className="bg-white border border-[#E2E8F0] rounded-[24px] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs font-medium border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-black text-[10px] uppercase border-b border-slate-200">
                <th className="py-3.5 px-5">Symbol & Company</th>
                <th className="py-3.5 px-4">Sector</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Change</th>
                <th className="py-3.5 px-4">P/E Ratio</th>
                <th className="py-3.5 px-4">Div Yield</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStocks.map((stk) => (
                <tr key={stk.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-5 cursor-pointer" onClick={() => onSelectStock(stk)}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#0F172A] text-white font-black text-[11px] flex items-center justify-center">
                        {stk.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <span className="font-black text-[#0F172A] text-sm block">{stk.symbol}</span>
                        <span className="text-[10px] text-slate-400 font-medium block truncate max-w-[160px]">{stk.companyName}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      {stk.sector}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-900">₹{stk.currentPrice.toLocaleString('en-IN')}</td>
                  <td className={`py-3.5 px-4 font-black ${stk.changePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {stk.changePercent >= 0 ? `+${stk.changePercent}%` : `${stk.changePercent}%`}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">{stk.peRatio ? stk.peRatio : 'N/A'}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">{stk.dividendYield}%</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onTrade(stk)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs transition cursor-pointer shadow-2xs"
                    >
                      Trade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredStocks.map((stk) => (
            <motion.div
              key={stk.id}
              whileHover={{ y: -3 }}
              className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-black text-base text-[#0F172A]">{stk.symbol}</h3>
                    <span className="text-xs text-slate-400 font-medium block truncate max-w-[160px]">{stk.companyName}</span>
                  </div>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {stk.sector}
                  </span>
                </div>

                <div className="my-4 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-[#0F172A]">₹{stk.currentPrice.toLocaleString('en-IN')}</span>
                  <span className={`text-xs font-black ${stk.changePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {stk.changePercent >= 0 ? `+${stk.changePercent}%` : `${stk.changePercent}%`}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button onClick={() => onSelectStock(stk)} className="text-xs font-black text-slate-600 hover:text-blue-600 cursor-pointer">
                  Details
                </button>
                <button onClick={() => onTrade(stk)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black cursor-pointer shadow-xs">
                  Trade
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StocksTab;
