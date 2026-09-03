import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, TrendingUp, TrendingDown, Layers, BarChart3, 
  ArrowUpRight, ArrowDownRight, Bookmark, BookmarkCheck,
  ChevronRight, Sparkles, Filter, Activity, ShieldCheck
} from 'lucide-react';
import marketService from '../../services/market.service';

interface MarketsCenterProps {
  onSelectStock: (stock: any) => void;
  watchlistStocks?: string[];
  onToggleWatchlist?: (symbol: string) => void;
}

export const MarketsCenter: React.FC<MarketsCenterProps> = ({
  onSelectStock,
  watchlistStocks = [],
  onToggleWatchlist
}) => {
  const [subTab, setSubTab] = useState<'overview' | 'stocks' | 'indices' | 'sectors' | 'movers'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectorFilter, setSelectedSectorFilter] = useState('All');
  
  // Dynamic API State
  const [indicesData, setIndicesData] = useState<any[]>([]);
  const [sectorsPerformance, setSectorsPerformance] = useState<any[]>([]);
  const [stocksDatabase, setStocksDatabase] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Top Movers Filters State
  const [moverCategory, setMoverCategory] = useState<'gainers' | 'losers' | 'highs' | 'lows' | 'volume'>('gainers');
  const [moverSectorFilter, setMoverSectorFilter] = useState('All');

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      marketService.getIndices(),
      marketService.getSectors(),
      marketService.getStocks('all')
    ]).then(([indices, sectors, stocks]) => {
      if (isMounted) {
        setIndicesData(indices as any[]);
        setSectorsPerformance(sectors as any[]);
        setStocksDatabase(stocks as any[]);
        setIsLoading(false);
      }
    }).catch(() => {
      if (isMounted) setIsLoading(false);
    });
    return () => { isMounted = false; };
  }, []);

  const filteredStocks = stocksDatabase.filter(stock => {
    const symbolMatch = (stock.symbol || '').toLowerCase().includes(searchQuery.toLowerCase());
    const nameMatch = (stock.name || stock.companyName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = symbolMatch || nameMatch;
    const matchesSector = selectedSectorFilter === 'All' || (stock.sector || '').toLowerCase().includes(selectedSectorFilter.toLowerCase());
    return matchesSearch && matchesSector;
  });

  const getMoverStocks = () => {
    let stocks = [...stocksDatabase];

    if (moverSectorFilter !== 'All') {
      stocks = stocks.filter(s => (s.sector || '').toLowerCase().includes(moverSectorFilter.toLowerCase()));
    }

    switch (moverCategory) {
      case 'gainers':
        return stocks.filter(s => s.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent);
      case 'losers':
        return stocks.filter(s => s.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent);
      case 'highs':
        return stocks.filter(s => {
          const priceStr = String(s.price || s.lastPrice || '0');
          const highStr = String(s.high52 || s.fiftyTwoWeekHigh || '0');
          const p = parseFloat(priceStr.replace(/,/g, ''));
          const h = parseFloat(highStr.replace(/,/g, ''));
          return h > 0 ? p >= h * 0.94 : true;
        });
      case 'lows':
        return stocks.filter(s => {
          const priceStr = String(s.price || s.lastPrice || '0');
          const lowStr = String(s.low52 || s.fiftyTwoWeekLow || '0');
          const p = parseFloat(priceStr.replace(/,/g, ''));
          const l = parseFloat(lowStr.replace(/,/g, ''));
          return l > 0 ? p <= l * 1.12 : true;
        });
      case 'volume':
        return stocks.sort((a, b) => parseFloat(String(b.volume || 0)) - parseFloat(String(a.volume || 0)));
      default:
        return stocks;
    }
  };

  const topGainers = [...stocksDatabase].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  const topLosers = [...stocksDatabase].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
  const high52 = stocksDatabase.filter(s => {
    const priceStr = String(s.price || s.lastPrice || '0');
    const highStr = String(s.high52 || s.fiftyTwoWeekHigh || '0');
    return parseFloat(priceStr.replace(/,/g, '')) >= parseFloat(highStr.replace(/,/g, '')) * 0.95;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Market Intelligence & Discovery</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time market overview, sector rotation analytics, and intelligent stock search engine.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stock symbol or name..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#15519D] focus:ring-1 focus:ring-[#15519D] transition-all"
          />
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'stocks', label: 'Stocks Discovery' },
          { id: 'indices', label: 'Indices' },
          { id: 'sectors', label: 'Sectors Heatmap' },
          { id: 'movers', label: 'Top Movers' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setSubTab(item.id as any)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              subTab === item.id
                ? 'bg-[#15519D] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW SUB TAB */}
      {subTab === 'overview' && (
        <div className="space-y-6">
          {/* Major Indices Cards */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Major Benchmark Indices</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {INDICES_DATA.map((idx, i) => (
                <div key={i} className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-blue-200 transition-all">
                  <div className="text-xs font-bold text-slate-500">{idx.name}</div>
                  <div className="text-lg font-extrabold text-slate-900 mt-1">{idx.value}</div>
                  <div className={`text-xs font-bold mt-1 flex items-center gap-0.5 ${idx.isPositive ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                    {idx.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    <span>{idx.change} ({idx.percent})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sector Heat Map Preview */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Sector Performance Heatmap</h3>
                <p className="text-xs text-slate-500">Live capital flows across major Indian market sectors</p>
              </div>
              <button 
                onClick={() => setSubTab('sectors')} 
                className="text-xs font-bold text-[#15519D] hover:underline flex items-center gap-1"
              >
                Full Heatmap <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {SECTORS_PERFORMANCE.map((sec, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-2xl border border-slate-100 flex flex-col justify-between"
                  style={{ 
                    backgroundColor: sec.change.startsWith('+') ? 'rgba(22, 163, 74, 0.05)' : 'rgba(220, 38, 38, 0.05)' 
                  }}
                >
                  <span className="text-xs font-bold text-slate-700 truncate">{sec.name}</span>
                  <div className="mt-3">
                    <span 
                      className="text-lg font-black"
                      style={{ color: sec.change.startsWith('+') ? '#16A34A' : '#DC2626' }}
                    >
                      {sec.change}
                    </span>
                    <div className="text-[11px] text-slate-400 font-medium">Top: {sec.leadStock}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Gainers & Losers Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gainers */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-emerald-50 text-[#16A34A] rounded-xl">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base">Top Market Gainers</h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">Today</span>
              </div>

              <div className="divide-y divide-slate-100">
                {topGainers.map((s) => (
                  <div 
                    key={s.symbol} 
                    onClick={() => onSelectStock(s)}
                    className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">{s.symbol}</div>
                      <div className="text-xs text-slate-400">{s.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900 text-sm">₹{s.price}</div>
                      <div className="text-xs font-black text-[#16A34A] flex items-center justify-end gap-0.5">
                        <ArrowUpRight className="w-3 h-3" /> +{s.changePercent}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Losers */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-rose-50 text-[#DC2626] rounded-xl">
                    <TrendingDown className="w-4 h-4" />
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base">Top Market Drag / Losers</h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">Today</span>
              </div>

              <div className="divide-y divide-slate-100">
                {topLosers.map((s) => (
                  <div 
                    key={s.symbol} 
                    onClick={() => onSelectStock(s)}
                    className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">{s.symbol}</div>
                      <div className="text-xs text-slate-400">{s.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900 text-sm">₹{s.price}</div>
                      <div className="text-xs font-black text-[#DC2626] flex items-center justify-end gap-0.5">
                        <ArrowDownRight className="w-3 h-3" /> {s.changePercent}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STOCKS DISCOVERY SUB TAB */}
      {subTab === 'stocks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Filter Sector:</span>
              {['All', 'Information Tech', 'Banking & Finance', 'Energy & Conglomerate', 'Auto & Ancillary', 'Telecom', 'Infrastructure', 'Metals & Mining', 'Pharma & Healthcare'].map(sec => (
                <button
                  key={sec}
                  onClick={() => setSelectedSectorFilter(sec)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedSectorFilter === sec
                      ? 'bg-[#15519D] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-extrabold uppercase border-b border-slate-200/80">
                <tr>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Sector</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">Change</th>
                  <th className="py-3 px-4 text-right">Market Cap</th>
                  <th className="py-3 px-4 text-right">P/E Ratio</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredStocks.map(stock => {
                  const isSaved = watchlistStocks.includes(stock.symbol);
                  return (
                    <tr key={stock.symbol} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex flex-col">
                          <span 
                            onClick={() => onSelectStock(stock)} 
                            className="font-extrabold text-sm text-[#172033] hover:text-[#15519D] transition cursor-pointer"
                          >
                            {stock.symbol}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">{stock.name || stock.companyName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">{stock.sector}</td>
                      <td className="py-3.5 px-4 text-right font-black text-slate-900">₹{stock.price || stock.lastPrice}</td>
                      <td className={`py-3.5 px-4 text-right font-extrabold ${stock.changePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {stock.change} ({stock.changePercent > 0 ? `+${stock.changePercent}%` : `${stock.changePercent}%`})
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-600">{stock.mcap || stock.marketCap || '₹10,000 Cr'}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-600">{stock.pe || stock.peRatio || '25.0'}</td>
                      <td className="py-3.5 px-4 text-center">
                        {onToggleWatchlist && (
                          <button
                            onClick={() => onToggleWatchlist(stock.symbol)}
                            className={`p-1.5 rounded-lg border text-xs transition cursor-pointer ${
                              isSaved ? 'bg-amber-50 border-amber-300 text-amber-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                            }`}
                            title={isSaved ? "Saved in Watchlist" : "Add to Watchlist"}
                          >
                            {isSaved ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INDICES SUB TAB */}
      {subTab === 'indices' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {indicesData.map((idx, i) => (
            <div key={i} className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 hover:border-blue-200 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Benchmark Index</span>
                <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${idx.isPositive ? 'bg-emerald-50 text-[#16A34A] border border-emerald-200/60' : 'bg-rose-50 text-[#DC2626] border border-rose-200/60'}`}>
                  {idx.percent}
                </span>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">{idx.name}</h3>
                <div className="text-lg sm:text-xl font-black text-[#15519D] mt-0.5">₹{idx.value}</div>
              </div>
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Net Daily Change:</span>
                <span className={`font-bold ${idx.isPositive ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>{idx.change}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTORS SUB TAB */}
      {subTab === 'sectors' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sectorsPerformance.map((sec, i) => (
            <div key={i} className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">{sec.name}</h3>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-slate-100 text-slate-700">
                  {sec.status || 'Active'}
                </span>
              </div>
              <div className="text-xl font-black" style={{ color: sec.color || '#15519D' }}>
                {sec.change || `${sec.changePercent}%`}
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center justify-between">
                <span>Leading Constituent:</span>
                <span className="font-bold text-slate-900">{sec.leadStock || sec.topGainer || 'TCS'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TOP MOVERS SUB TAB */}
      {subTab === 'movers' && (
        <div className="space-y-5">
          
          {/* CATEGORY & SECTOR FILTER BAR */}
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-extrabold text-[#172033] text-base">Top Movers & Breakouts</h3>
                <p className="text-xs text-slate-500 font-medium">Filter top gaining, declining, 52W breakout, and volume surge stocks</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                <Filter className="w-3.5 h-3.5 text-[#15519D]" />
                <span>Sector Filter:</span>
                <select
                  value={moverSectorFilter}
                  onChange={(e) => setMoverSectorFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 outline-none focus:border-[#15519D] cursor-pointer"
                >
                  {['All', 'Information Tech', 'Banking & Finance', 'Energy & Conglomerate', 'Auto & Ancillary', 'Metals & Mining', 'Pharma & Healthcare', 'Telecom', 'Infrastructure'].map(sec => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* MOVER CATEGORY CHIPS */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
              {[
                { id: 'gainers', label: '🔥 Top Gainers' },
                { id: 'losers', label: '🔻 Top Losers' },
                { id: 'highs', label: '📈 52-Week Highs' },
                { id: 'lows', label: '📉 52-Week Lows' },
                { id: 'volume', label: '⚡ Volume Surge' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setMoverCategory(cat.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer border ${
                    moverCategory === cat.id
                      ? 'bg-[#15519D] text-white border-[#15519D] shadow-2xs'
                      : 'bg-[#F8FAFC] text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* MOVERS STOCK CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {getMoverStocks().map(stock => {
              const isSaved = watchlistStocks.includes(stock.symbol);
              const priceNum = parseFloat(stock.price.replace(/,/g, ''));
              const low52Num = parseFloat(stock.low52.replace(/,/g, ''));
              const high52Num = parseFloat(stock.high52.replace(/,/g, ''));
              const rangePct = Math.min(100, Math.max(0, ((priceNum - low52Num) / (high52Num - low52Num)) * 100));

              return (
                <div 
                  key={stock.symbol}
                  className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#15519D]/50 transition-all space-y-3 group"
                >
                  {/* Top Symbol & Price Row */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span 
                          onClick={() => onSelectStock(stock)}
                          className="font-black text-sm sm:text-base text-[#172033] group-hover:text-[#15519D] transition cursor-pointer"
                        >
                          {stock.symbol}
                        </span>
                        <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {stock.sector}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-slate-500 line-clamp-1">{stock.name}</span>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-sm sm:text-base text-[#172033]">₹{stock.price}</div>
                      <div className={`text-[11px] font-black inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md ${
                        stock.changePercent >= 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                      }`}>
                        {stock.changePercent >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        <span>{stock.change} ({stock.changePercent > 0 ? `+${stock.changePercent}%` : `${stock.changePercent}%`})</span>
                      </div>
                    </div>
                  </div>

                  {/* 52-Week Range Bar Indicator */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>52W Low: ₹{stock.low52}</span>
                      <span className="text-slate-600 font-extrabold">52W Position ({rangePct.toFixed(0)}%)</span>
                      <span>52W High: ₹{stock.high52}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full relative overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-500 rounded-full" style={{ width: `${rangePct}%` }} />
                    </div>
                  </div>

                  {/* Valuation & Actions Footer */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                      <span>P/E: <strong className="text-slate-800">{stock.pe}</strong></span>
                      <span>•</span>
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-[#15519D] font-extrabold text-[10px]">
                        {stock.peCategory}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {onToggleWatchlist && (
                        <button
                          onClick={() => onToggleWatchlist(stock.symbol)}
                          className={`p-1.5 rounded-lg border text-xs transition cursor-pointer ${
                            isSaved ? 'bg-amber-50 border-amber-300 text-amber-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                          }`}
                          title={isSaved ? "Remove from Watchlist" : "Add to Watchlist"}
                        >
                          {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 fill-current" /> : <Bookmark className="w-3.5 h-3.5" />}
                        </button>
                      )}

                      <button
                        onClick={() => onSelectStock(stock)}
                        className="text-xs font-extrabold text-[#15519D] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        View Intelligence →
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
};

export default MarketsCenter;
