import React from 'react';
import { Bookmark, FileText, Sparkles, Clock, ChevronRight, Share2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const SavedTab: React.FC = () => {
  const savedReports = [
    { title: 'Reliance Q1 Earnings Analysis & Valuation Model', date: 'Saved 2 days ago', type: 'PDF Report', size: '2.4 MB' },
    { title: 'Indian Banking Sector: Rising Credit & Asset Quality', date: 'Saved 1 week ago', type: 'Sector Report', size: '4.1 MB' },
  ];

  const savedBriefs = [
    { title: 'Automotive Sector Transition to EVs Outlook Brief', date: 'Brief generated on 24 Jul', length: '5 min read' },
    { title: 'FII Buying Trends in H1 FY27 Macro Brief', date: 'Brief generated on 18 Jul', length: '3 min read' },
  ];

  return (
    <div className="w-full flex flex-col gap-8 font-sans text-slate-800 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Column 1: Saved Reports */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Saved Reports</h3>
              <span className="text-[10px] text-slate-400 font-bold">Offline PDF files and full institutional notes</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {savedReports.map((r, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -2 }}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-500 text-[10px] font-black uppercase">
                    pdf
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight line-clamp-1">{r.title}</h4>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-bold">
                      <span>{r.date}</span>
                      <span>•</span>
                      <span>{r.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 transition"><Share2 className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 hover:bg-rose-50 border border-slate-200 rounded-lg text-slate-400 hover:text-rose-600 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Column 2: Saved AI Briefs */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100 shadow-sm shrink-0">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Saved AI Briefs</h3>
              <span className="text-[10px] text-slate-400 font-bold">Generated summaries and interactive briefings</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {savedBriefs.map((b, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -2 }}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-6 h-6 rounded bg-violet-50 flex items-center justify-center text-violet-500">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight line-clamp-1">{b.title}</h4>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-bold">
                      <span>{b.date}</span>
                      <span>•</span>
                      <span>{b.length}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 transition"><Share2 className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 hover:bg-rose-50 border border-slate-200 rounded-lg text-slate-400 hover:text-rose-600 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bookmarked Research & Recently Viewed Row */}
      <div className="border-t border-slate-200 pt-8 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4.5 h-4.5 text-slate-400" />
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Recently Bookmarked Research</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { symbol: 'TATASTEEL', title: 'Target break-out hit at ₹147.20', type: 'Technical call' },
            { symbol: 'TATAMOTORS', title: 'EV sales margins to drive growth expansion', type: 'Fundamental call' },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-xs hover:border-blue-300 transition-all cursor-pointer group">
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">{item.type}</span>
                <h4 className="text-xs font-black text-slate-900 mt-1 flex items-center gap-2">
                  <span className="text-blue-600">{item.symbol}</span>
                  <span>{item.title}</span>
                </h4>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedTab;
