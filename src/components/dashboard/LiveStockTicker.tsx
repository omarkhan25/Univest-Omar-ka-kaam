import React from 'react';

interface TickerItem {
  symbol: string;
  price: string;
  changePercent: number;
  isPositive: boolean;
  sparkline: number[];
}

const TICKER_DATA: TickerItem[] = [
  { symbol: 'RELIANCE', price: '2,975.80', changePercent: 2.35, isPositive: true, sparkline: [2910, 2930, 2945, 2975.8] },
  { symbol: 'TCS', price: '4,182.75', changePercent: -0.45, isPositive: false, sparkline: [4210, 4200, 4190, 4182.75] },
  { symbol: 'HDFCBANK', price: '1,678.40', changePercent: 1.81, isPositive: true, sparkline: [1650, 1662, 1670, 1678.4] },
  { symbol: 'INFY', price: '1,634.20', changePercent: 1.25, isPositive: true, sparkline: [1615, 1620, 1628, 1634.2] },
  { symbol: 'ICICIBANK', price: '1,248.65', changePercent: -0.32, isPositive: false, sparkline: [1255, 1252, 1250, 1248.65] },
  { symbol: 'LT', price: '3,620.45', changePercent: 1.92, isPositive: true, sparkline: [3550, 3575, 3600, 3620.45] },
  { symbol: 'SBIN', price: '857.10', changePercent: 1.68, isPositive: true, sparkline: [842, 848, 852, 857.1] },
  { symbol: 'BAJFINANCE', price: '6,912.30', changePercent: -0.16, isPositive: false, sparkline: [6930, 6925, 6918, 6912.3] },
  { symbol: 'AXISBANK', price: '1,166.30', changePercent: 0.76, isPositive: true, sparkline: [1156, 1160, 1162, 1166.3] },
  { symbol: 'SUNPHARMA', price: '1,782.55', changePercent: 0.55, isPositive: true, sparkline: [1770, 1775, 1778, 1782.55] },
];

export const LiveStockTicker: React.FC<{ onSelectStock?: (symbol: string) => void }> = ({ onSelectStock }) => {
  // Duplicate array to create seamless infinite loop
  const displayItems = [...TICKER_DATA, ...TICKER_DATA, ...TICKER_DATA];

  return (
    <div className="w-full bg-[#0F1F35] border-b border-slate-800/80 text-white overflow-hidden py-1.5 px-4 sticky top-0 z-50 select-none group">
      <style>{`
        @keyframes tickerMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-ticker-marquee {
          display: flex;
          width: max-content;
          animation: tickerMarquee 45s linear infinite;
        }
        .group:hover .animate-ticker-marquee {
          animation-play-state: paused;
        }
      `}</style>

      <div className="animate-ticker-marquee flex items-center gap-8">
        {displayItems.map((item, idx) => (
          <div
            key={`${item.symbol}-${idx}`}
            onClick={() => onSelectStock && onSelectStock(item.symbol)}
            className="flex items-center gap-2.5 text-xs font-bold whitespace-nowrap cursor-pointer hover:text-blue-300 transition-colors shrink-0"
          >
            <span className="text-slate-200 tracking-wide">{item.symbol}</span>
            <span className="text-white font-extrabold font-mono">₹{item.price}</span>

            <div className={`flex items-center gap-1 font-extrabold text-[11px] ${
              item.isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              <span>{item.isPositive ? '▲' : '▼'}</span>
              <span>{item.isPositive ? `${item.changePercent}%` : `${Math.abs(item.changePercent)}%`}</span>
            </div>

            {/* Sparkline */}
            <svg className="w-10 h-3 overflow-visible" viewBox="0 0 30 12">
              <polyline
                fill="none"
                stroke={item.isPositive ? '#10B981' : '#F43F5E'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={item.sparkline.map((val, i) => {
                  const min = Math.min(...item.sparkline);
                  const max = Math.max(...item.sparkline);
                  const range = max - min || 1;
                  const x = (i / (item.sparkline.length - 1)) * 30;
                  const y = 12 - ((val - min) / range) * 10;
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                }).join(' ')}
              />
            </svg>

            <span className="text-slate-700 font-normal ml-2">|</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveStockTicker;
