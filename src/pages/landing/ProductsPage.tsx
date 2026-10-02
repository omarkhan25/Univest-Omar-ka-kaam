import React from 'react';
import { ArthSetuNavbar } from '../../components/landing/ArthSetuNavbar';
import { Footer } from '../../components/landing/Footer';
import { ArrowRight, Compass, Activity, BrainCircuit, PieChart, FlaskConical, Crown, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();

  const products = [
    {
      title: 'ArthSetu View (Company Research)',
      tagline: 'Multi-Dimensional Fundamental Analysis',
      icon: Compass,
      description: 'Our proprietary 6-pillar framework (Business Quality, Growth, Valuation, Momentum, Financial Health, Risk) transforms hundreds of audited metrics into a transparent, contextual evaluation score.',
      features: ['6-Pillar Quality Breakdown', 'Historical Multiples Context', 'Red-Flag & Governance Audit', 'Reverse DCF Implied Expectations'],
      accent: 'purple',
      cta: 'Explore Research'
    },
    {
      title: 'Market Intelligence & Breadth',
      tagline: 'Contextual Market Signals & Sector Telemetry',
      icon: Activity,
      description: 'Go beyond raw price swings. Understand sector rotation, institutional flows, derivatives positioning (OI & PCR), and macroeconomic catalysts in real time.',
      features: ['Sector Advance/Decline Breadth', 'Derivatives Sentiment Context', 'Catalyst Decomposition', 'FII / DII Institutional Flow'],
      accent: 'emerald',
      cta: 'Explore Markets'
    },
    {
      title: 'AI Research Copilot',
      tagline: 'Your Personal Financial Analyst',
      icon: BrainCircuit,
      description: 'An intelligent research assistant powered by deep financial models. Ask complex questions about notes-to-accounts, concall transcripts, debt restructuring, or peer comparisons.',
      features: ['Concall & Filing Synthesis', 'Peer Comparison Matrices', 'Portfolio Risk Queries', 'Source-Attributed Answers'],
      accent: 'indigo',
      cta: 'Meet AI Copilot'
    },
    {
      title: 'Portfolio Diagnostics',
      tagline: 'Comprehensive Risk & Concentration Health',
      icon: PieChart,
      description: 'Analyze your holdings for hidden sector concentration, correlation risk, and benchmark tracking error so you always invest with disciplined risk control.',
      features: ['Concentration Alerts', 'Benchmark Beta Attribution', 'Drawdown Vulnerability', 'Rebalancing Context'],
      accent: 'blue',
      cta: 'Analyze Portfolio'
    },
    {
      title: 'Investment Lab Simulator',
      tagline: 'Simulate Investment Theses with Virtual Capital',
      icon: FlaskConical,
      description: 'Test your long-term investment ideas using virtual Tokens. Compare results against NIFTY benchmarks, evaluate post-decision outcomes, and learn from mistakes without financial risk.',
      features: ['Virtual Token Allocations', 'Multi-Horizon Thesis Tracking', 'Post-Decision Analysis', 'Zero Monetary Risk'],
      accent: 'amber',
      cta: 'Enter Investment Lab'
    },
    {
      title: 'ArthSetu Pro Radars',
      tagline: 'Advanced Radars & Small-Cap Intelligence',
      icon: Crown,
      description: 'Gain access to proprietary quantitative radar screens, daily research upgrades and downgrades, small-cap screening, and institutional dossiers.',
      features: ['Growth & Value Radars', 'Small-Cap Screening Watch', 'Daily Upgrades / Downgrades', '10-Page Research Dossiers'],
      accent: 'purple-dark',
      cta: 'Explore Pro Plans'
    }
  ];

  return (
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      <ArthSetuNavbar />

      <main className="flex-1 pt-32 pb-24 px-6 sm:px-10 md:px-[50px]">
        <div className="max-w-[88rem] mx-auto">
          
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-700 block mb-3">
              THE ARTHSETU ECOSYSTEM
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-gray-950 leading-tight mb-4">
              Intelligence tools built for thoughtful investors.
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Every tool is engineered to replace speculation with rigorous fundamental context, deep research, and risk awareness.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {products.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs hover:shadow-lg hover:border-purple-300 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-purple-800 mb-1">{p.tagline}</div>
                    <h3 className="text-xl font-bold text-gray-950 mb-3">{p.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">{p.description}</p>
                    
                    <ul className="space-y-2 mb-8">
                      {p.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => navigate('/signup')}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-900 group-hover:text-purple-800 transition-colors pt-4 border-t border-gray-100 cursor-pointer"
                  >
                    <span>{p.cta}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#2B2644] to-[#1E1A30] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-300 block mb-2">
                READY TO EXPERIENCE RESEARCH CLARITY?
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Start with free market and company intelligence.
              </h2>
              <p className="text-xs sm:text-sm text-purple-100/80 leading-relaxed">
                Join thousands of Indian investors who use ArthSetu to understand the market before making investment decisions.
              </p>
            </div>
            <button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center gap-2 bg-white text-gray-950 text-sm font-semibold px-8 py-4 rounded-full hover:bg-purple-100 transition-colors shrink-0 cursor-pointer shadow-md"
            >
              <span>Explore ArthSetu Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;
