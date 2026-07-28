import React, { useState } from 'react';
import { 
  Building2, Laptop, ShieldCheck, Flame, Car, Shield, 
  ArrowUpRight, ArrowDownRight, Compass, ChevronRight, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SectorConfig {
  id: string;
  name: string;
  icon: any;
  overview: string;
  performance: string;
  positive: boolean;
  color: string;
  topCompanies: Array<{ name: string; symbol: string; change: string; positive: boolean }>;
  latestResearch: Array<{ title: string; target: string; upside: string }>;
}

const SECTORS_LIST: SectorConfig[] = [
  {
    id: 'banking',
    name: 'Banking & Financials',
    icon: Building2,
    overview: 'Strong credit growth and improving asset quality continue to drive structural expansion across leading private and public sector lenders.',
    performance: '+2.45% today',
    positive: true,
    color: 'from-blue-600 to-indigo-700 bg-blue-50 border-blue-100 text-blue-600',
    topCompanies: [
      { name: 'HDFC Bank Ltd', symbol: 'HDFCBANK', change: '+1.85%', positive: true },
      { name: 'ICICI Bank Ltd', symbol: 'ICICIBANK', change: '+2.90%', positive: true },
      { name: 'State Bank of India', symbol: 'SBIN', change: '+1.10%', positive: true },
    ],
    latestResearch: [
      { title: 'Q1 Banking Outlook: NIM pressure to ease off', target: '₹1,950 (HDFCBANK)', upside: '+16%' },
      { title: 'Retail Lending Growth trends remain robust', target: '₹1,250 (ICICIBANK)', upside: '+14%' },
    ]
  },
  {
    id: 'it',
    name: 'Information Technology',
    icon: Laptop,
    overview: 'Valuations have turned attractive after a recent correction. Transition to cloud and AI opportunities remain key long-term structural tailwinds.',
    performance: '-0.85% today',
    positive: false,
    color: 'from-violet-600 to-purple-700 bg-violet-50 border-violet-100 text-violet-600',
    topCompanies: [
      { name: 'Infosys Ltd', symbol: 'INFY', change: '-1.20%', positive: false },
      { name: 'Tata Consultancy Services', symbol: 'TCS', change: '-0.40%', positive: false },
      { name: 'Wipro Ltd', symbol: 'WIPRO', change: '-0.95%', positive: false },
    ],
    latestResearch: [
      { title: 'Generative AI monetization strategies & adoption rates', target: '₹4,350 (TCS)', upside: '+9%' },
      { title: 'IT spending outlook for FY27: Margin analysis', target: '₹1,620 (INFY)', upside: '+12%' },
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Pharma',
    icon: ShieldCheck,
    overview: 'Fueled by strong domestic formulation growth and expansion in emerging international regulated export markets.',
    performance: '+1.65% today',
    positive: true,
    color: 'from-emerald-600 to-teal-700 bg-emerald-50 border-emerald-100 text-emerald-600',
    topCompanies: [
      { name: 'Sun Pharmaceutical', symbol: 'SUNPHARMA', change: '+2.10%', positive: true },
      { name: 'Cipla Ltd', symbol: 'CIPLA', change: '+1.45%', positive: true },
      { name: 'Apollo Hospitals', symbol: 'APOLLOHOSP', change: '+1.20%', positive: true },
    ],
    latestResearch: [
      { title: 'US FDA inspections clearance pipeline & product launches', target: '₹1,650 (SUNPHARMA)', upside: '+8%' },
      { title: 'Biomedical research development expansion opportunities', target: '₹1,540 (CIPLA)', upside: '+11%' },
    ]
  },
  {
    id: 'energy',
    name: 'Energy & Power',
    icon: Flame,
    overview: 'Increasing power generation capacity and transition to clean solar/wind energy setups are driving massive long-term capital deployments.',
    performance: '+3.10% today',
    positive: true,
    color: 'from-amber-600 to-orange-700 bg-amber-50 border-amber-100 text-amber-600',
    topCompanies: [
      { name: 'Reliance Industries', symbol: 'RELIANCE', change: '+1.25%', positive: true },
      { name: 'NTPC Ltd', symbol: 'NTPC', change: '+4.20%', positive: true },
      { name: 'Power Grid Corp', symbol: 'POWERGRID', change: '+2.85%', positive: true },
    ],
    latestResearch: [
      { title: 'Green Energy CAPEX: Detailed asset allocation breakdown', target: '₹380 (NTPC)', upside: '+15%' },
      { title: 'Refinery margin spreads analysis & domestic tariffs policy', target: '₹3,200 (RELIANCE)', upside: '+10%' },
    ]
  },
  {
    id: 'auto',
    name: 'Automotive & Ancillaries',
    icon: Car,
    overview: 'Robust passenger vehicle demand and rapidly rising EV adoption rates are transforming profitability profiles of major OEMs.',
    performance: '+1.15% today',
    positive: true,
    color: 'from-rose-600 to-red-700 bg-rose-50 border-rose-100 text-rose-600',
    topCompanies: [
      { name: 'Tata Motors Ltd', symbol: 'TATAMOTORS', change: '+2.40%', positive: true },
      { name: 'Mahindra & Mahindra', symbol: 'M&M', change: '+0.95%', positive: true },
      { name: 'Maruti Suzuki India', symbol: 'MARUTI', change: '+0.45%', positive: true },
    ],
    latestResearch: [
      { title: 'EV ecosystem expansion and margin enhancement models', target: '₹1,180 (TATAMOTORS)', upside: '+18%' },
      { title: 'Agricultural tractor demand recovery outlook', target: '₹2,350 (M&M)', upside: '+12%' },
    ]
  },
  {
    id: 'defence',
    name: 'Defence & Aerospace',
    icon: Shield,
    overview: 'Indigenization policies and expanding export pipelines are leading to multi-decade record-high order books for domestic defense manufacturers.',
    performance: '+4.85% today',
    positive: true,
    color: 'from-cyan-600 to-blue-700 bg-cyan-50 border-cyan-100 text-cyan-600',
    topCompanies: [
      { name: 'Hindustan Aeronautics', symbol: 'HAL', change: '+5.20%', positive: true },
      { name: 'Bharat Electronics Ltd', symbol: 'BEL', change: '+4.10%', positive: true },
      { name: 'Mazagon Dock Shipbuilders', symbol: 'MAZDOCK', change: '+3.95%', positive: true },
    ],
    latestResearch: [
      { title: 'Defence Capital Allocations: Order book sustainability analysis', target: '₹4,600 (HAL)', upside: '+20%' },
      { title: 'Export order pipeline assessment for precision systems', target: '₹240 (BEL)', upside: '+16%' },
    ]
  }
];

export const SectorsTab: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState<SectorConfig | null>(null);

  return (
    <div className="w-full flex flex-col gap-6 font-sans text-slate-800 animate-in fade-in duration-300">
      
      {/* Sector Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SECTORS_LIST.map((sector) => {
          const Icon = sector.icon;
          return (
            <motion.div
              key={sector.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedSector(sector)}
              className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${sector.color.split(' ')[0]} ${sector.color.split(' ')[1]} text-white flex items-center justify-center shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                    sector.positive ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
                  }`}>
                    {sector.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {sector.performance}
                  </span>
                </div>

                <h3 className="text-base font-black text-[#0F172A] leading-tight group-hover:text-blue-600 transition-colors">
                  {sector.name}
                </h3>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed line-clamp-3 font-medium">
                  {sector.overview}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-6 flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400">READ PERFORMANCE DETAILED OUTLOOK</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Sector Details Modal/Overlay */}
      <AnimatePresence>
        {selectedSector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSector(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-[28px] p-6 md:p-8 shadow-2xl z-10 flex flex-col gap-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${selectedSector.color.split(' ')[0]} ${selectedSector.color.split(' ')[1]} text-white flex items-center justify-center`}>
                    <selectedSector.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">{selectedSector.name}</h2>
                    <span className={`text-[10px] font-black uppercase mt-1 inline-flex items-center gap-1 ${
                      selectedSector.positive ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {selectedSector.performance}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedSector(null)}
                  className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-xl transition cursor-pointer text-slate-400 hover:text-slate-900"
                >
                  ✕
                </button>
              </div>

              <div>
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Sector Overview</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{selectedSector.overview}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-3">Top Performing Companies</h4>
                  <div className="space-y-2">
                    {selectedSector.topCompanies.map((c) => (
                      <div key={c.symbol} className="flex justify-between items-center bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-xs font-black text-slate-900">{c.symbol}</span>
                          <span className="text-[10px] text-slate-400 block font-medium">{c.name}</span>
                        </div>
                        <span className={`text-xs font-black ${c.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {c.change}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-3">Latest Sector Research</h4>
                  <div className="space-y-2">
                    {selectedSector.latestResearch.map((r, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1">
                        <span className="text-xs font-black text-slate-900 line-clamp-1">{r.title}</span>
                        <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold mt-1">
                          <span>Target: {r.target}</span>
                          <span className="text-blue-600 font-black">{r.upside} Upside</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SectorsTab;
