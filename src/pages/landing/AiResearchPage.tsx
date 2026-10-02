import React, { useState } from 'react';
import { ArthSetuNavbar } from '../../components/landing/ArthSetuNavbar';
import { Footer } from '../../components/landing/Footer';
import { ArrowRight, Sparkles, BrainCircuit, FileSearch, CheckCircle2, ShieldCheck, Database, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AiResearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDemo, setSelectedDemo] = useState(0);

  const demoCapabilities = [
    {
      title: 'Earnings Call & Concall Synthesis',
      query: 'What was management\'s commentary on international margin drag in Q3?',
      response: 'Management indicated that international margins contracted by 180 bps due to Red Sea shipping rerouting and higher spot freight tariffs. However, domestic realizations rose 4.2%, offsetting 70% of the export pressure. Full margin recovery is guided for Q1 FY27 as dedicated freight corridors become operational.',
      source: 'Q3 FY26 Earnings Call Transcript (Page 14, Management Remarks)'
    },
    {
      title: 'Capital Allocation & Debt Analysis',
      query: 'Explain the company\'s capex plan and whether internal cash flows can fund it without debt.',
      response: 'The company has planned a ₹4,200 Cr capex over the next 24 months. With trailing 3-year average operating cash flow of ₹2,800 Cr/year and cash reserves of ₹1,450 Cr, internal accruals will fund ~85% of requirements. Projected Debt-to-Equity will peak at a manageable 0.35x vs industry average of 0.72x.',
      source: 'Annual Report Notes-to-Accounts & Cash Flow Statement'
    },
    {
      title: 'Peer Moat & Valuation Comparison',
      query: 'Compare return on capital employed (ROCE) and competitive moat between Company A and Company B.',
      response: 'Company A maintains a 5-year average ROCE of 28.4% compared to Company B at 19.2%. Company A\'s superior capital efficiency is driven by backward integration in raw material processing (35% captive supply) and proprietary distribution networks covering 12,000 retail touchpoints.',
      source: 'Segmental Disclosures & Industry Benchmarks'
    }
  ];

  return (
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      <ArthSetuNavbar />

      <main className="flex-1 pt-32 pb-24 px-6 sm:px-10 md:px-[50px]">
        <div className="max-w-[88rem] mx-auto">
          
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-purple-700" />
              <span>AI Investment Intelligence</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-gray-950 leading-tight mb-4">
              Ask better questions. Research with deep context.
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              ArthSetu AI Copilot is engineered specifically for Indian equity research. It analyzes quarterly disclosures, concall transcripts, annual reports, and macroeconomic data to deliver institutional-grade research in seconds.
            </p>
          </div>

          {/* Interactive AI Demo Workspace */}
          <div className="bg-[#211C38] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-purple-900/40 mb-20">
            <div className="max-w-4xl mx-auto">
              
              <div className="text-xs font-bold uppercase tracking-widest text-purple-300 mb-4">
                Select an AI Research Demonstration:
              </div>

              {/* Demo selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                {demoCapabilities.map((cap, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDemo(idx)}
                    className={`p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer text-xs font-semibold ${
                      selectedDemo === idx
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-white/5 text-purple-200 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    <div className="text-[10px] text-purple-300 uppercase mb-1">Capability #{idx + 1}</div>
                    <div className="line-clamp-2">{cap.title}</div>
                  </button>
                ))}
              </div>

              {/* Chat View */}
              {(() => {
                const current = demoCapabilities[selectedDemo];
                return (
                  <div className="space-y-6">
                    {/* Query */}
                    <div className="flex justify-end">
                      <div className="bg-purple-500/25 border border-purple-400/30 text-white p-4 rounded-2xl rounded-tr-xs text-sm max-w-lg">
                        <div className="text-[10px] uppercase font-bold text-purple-300 mb-1">Investor Query</div>
                        <div className="font-semibold">{current.query}</div>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center text-white shrink-0 mt-1">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl rounded-tl-xs p-6 text-sm">
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs text-purple-300">
                          <span className="font-bold uppercase tracking-wider">{current.title}</span>
                          <span>Verified Synthesis</span>
                        </div>
                        <p className="text-white/90 text-sm leading-relaxed mb-4">
                          {current.response}
                        </p>
                        <div className="p-3 rounded-xl bg-purple-900/40 border border-purple-500/30 text-xs text-purple-200 flex items-center gap-2">
                          <Database className="w-4 h-4 text-purple-400 shrink-0" />
                          <span><strong>Source Reference:</strong> {current.source}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-purple-200/60">
                  Backed by natural language processing trained on 10+ years of BSE/NSE filings.
                </div>
                <button
                  onClick={() => navigate('/signup')}
                  className="inline-flex items-center gap-2 bg-white text-gray-950 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-purple-100 transition-colors cursor-pointer"
                >
                  <span>Try ArthSetu AI Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

          {/* AI Ethics & Boundaries */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80">
              <FileSearch className="w-6 h-6 text-purple-700 mb-3" />
              <h3 className="font-bold text-gray-950 mb-1">Source-Attributed Insights</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Every AI summary links back to verifiable exchange disclosures, concall transcripts, and notes-to-accounts so you can verify facts directly.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200/80">
              <ShieldCheck className="w-6 h-6 text-purple-700 mb-3" />
              <h3 className="font-bold text-gray-950 mb-1">Zero Speculative Predictions</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Our AI does not guess tomorrow's stock price. It extracts fundamentals, quantifies historical trends, and identifies potential operating risks.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200/80">
              <BrainCircuit className="w-6 h-6 text-purple-700 mb-3" />
              <h3 className="font-bold text-gray-950 mb-1">Contextual to Indian Markets</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Specialized understanding of Indian corporate structures, SEBI regulatory mandates, promoter holdings, and domestic capex cycles.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AiResearchPage;
