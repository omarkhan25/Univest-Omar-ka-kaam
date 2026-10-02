import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck, 
  BrainCircuit, 
  Activity, 
  PieChart, 
  Zap, 
  Search, 
  Compass, 
  FlaskConical, 
  Crown, 
  ChevronRight, 
  AlertTriangle, 
  Sliders, 
  Scale,
  Target,
  FileText,
  BadgeCheck,
  Radio
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ArthSetuNavbar } from './ArthSetuNavbar';
import { Footer } from './Footer';
import { FloatingMoneyBackground } from './FloatingMoneyBackground';
import { authService } from '../../services/auth.service';

export const ArthSetuLanding: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Interactive state for tabs and demos
  const [activeResearchTab, setActiveResearchTab] = useState<'quality' | 'growth' | 'valuation' | 'momentum' | 'health' | 'risk'>('quality');
  const [selectedStockMoving, setSelectedStockMoving] = useState<number>(0);
  const [selectedAiPrompt, setSelectedAiPrompt] = useState<number>(0);
  const [labSimulationCapital, setLabSimulationCapital] = useState<number>(100000);
  const [selectedLabThesis, setSelectedLabThesis] = useState<'renewables' | 'banking' | 'capex'>('renewables');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      const checkRes = await authService.checkEmail(email);
      if (checkRes.exists) {
        navigate('/login', { state: { email } });
      } else {
        navigate('/signup', { state: { email } });
      }
    } catch (error) {
      navigate('/signup', { state: { email } });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Stock Research Dimension Data (ArthSetu View)
  const researchDimensions = {
    quality: {
      title: 'Business Quality',
      score: '88/100',
      status: 'Strong Moat',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      description: 'Evaluates competitive advantage, pricing power, return on capital (ROCE/ROE), and management capital allocation history.',
      metrics: [
        { label: '5-Yr Avg ROCE', value: '18.4%', benchmark: 'Sector: 12.1%' },
        { label: 'Free Cash Conversion', value: '76.2%', benchmark: 'Sector: 58.0%' },
        { label: 'Moat Strength', value: 'High', benchmark: 'Network & Cost Advantage' },
        { label: 'Governance Score', value: '92/100', benchmark: 'Clean Audit Record' },
      ],
      insight: 'Demonstrates consistent market share retention with industry-leading capital efficiency over the last 10 operating cycles.'
    },
    growth: {
      title: 'Growth Trajectory',
      score: '74/100',
      status: 'Steady Compounder',
      statusColor: 'text-blue-700 bg-blue-50 border-blue-200',
      description: 'Analyzes forward revenue runway, addressable market expansion, margin progression, and sector tailwinds.',
      metrics: [
        { label: '3-Yr Revenue CAGR', value: '14.8%', benchmark: 'Sector: 11.2%' },
        { label: 'EBITDA Margin Delta', value: '+140 bps', benchmark: 'Operating Leverage Visible' },
        { label: 'Order Book Runway', value: '2.4x Annual Rev', benchmark: 'High Visibility' },
        { label: 'Capex Execution', value: 'On Track', benchmark: 'Phase II Commissioned' },
      ],
      insight: 'New capacity ramp-up expected to drive steady top-line growth, with margin expansion from premium mix.'
    },
    valuation: {
      title: 'Valuation Context',
      score: '65/100',
      status: 'Fairly Valued',
      statusColor: 'text-amber-700 bg-amber-50 border-amber-200',
      description: 'Historical multiple sanity checks, reverse DCF implied expectations, peer comparisons, and cash flow yields.',
      metrics: [
        { label: 'Current P/E', value: '24.2x', benchmark: '5-Yr Median: 23.8x' },
        { label: 'EV / EBITDA', value: '14.6x', benchmark: 'Peer Median: 15.2x' },
        { label: 'Implied Growth Rate', value: '11.5%', benchmark: 'DCF Base Case: 13.0%' },
        { label: 'Earnings Yield', value: '4.1%', benchmark: '10-Yr G-Sec: 6.9%' },
      ],
      insight: 'Valuation is reasonably anchored to long-term averages; limited re-rating trigger but solid earnings-led compounding room.'
    },
    momentum: {
      title: 'Market Momentum',
      score: '82/100',
      status: 'Accumulation Trend',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      description: 'Assesses institutional accumulation, sector relative strength (RS), delivery volume percentage, and trend stability.',
      metrics: [
        { label: 'Relative Strength vs NIFTY', value: '+6.4%', benchmark: '90-Day Horizon' },
        { label: 'Delivery Volume Avg', value: '62.4%', benchmark: 'Historical Avg: 48%' },
        { label: 'Moving Avg Alignment', value: '50D > 200D', benchmark: 'Bullish Stack' },
        { label: 'Institutional Net Flow', value: 'Net Inflow', benchmark: 'DII + FII Active' },
      ],
      insight: 'High delivery percentage indicates genuine institutional absorption rather than short-term speculative volume.'
    },
    health: {
      title: 'Financial Health',
      score: '91/100',
      status: 'Pristine Balance Sheet',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      description: 'Solvency ratios, debt coverage, working capital cycle, and contingency buffer review.',
      metrics: [
        { label: 'Debt to Equity', value: '0.12x', benchmark: 'Industry Safe Zone: < 0.6x' },
        { label: 'Interest Coverage', value: '14.8x', benchmark: 'Strong Buffer' },
        { label: 'Working Capital Days', value: '38 Days', benchmark: 'Improving (Down 6d)' },
        { label: 'Altman Z-Score', value: '4.8', benchmark: 'Safe Zone (> 3.0)' },
      ],
      insight: 'Negligible net debt and robust operating cash flow provide strong insulation against interest rate spikes or downturns.'
    },
    risk: {
      title: 'Risk & Headwinds',
      score: '70/100',
      status: 'Moderate Watch',
      statusColor: 'text-purple-700 bg-purple-50 border-purple-200',
      description: 'Downside catalysts, raw material volatility, regulatory shifts, customer concentration, and macro risks.',
      metrics: [
        { label: 'Raw Material Exposure', value: 'Crude Derivatives', benchmark: 'Margin Sensitivity' },
        { label: 'Top 5 Customer Share', value: '28.0%', benchmark: 'Moderate Diversification' },
        { label: 'Regulatory Sensitivity', value: 'Medium', benchmark: 'Tariff & Duty Policies' },
        { label: 'Beta vs Benchmark', value: '0.88', benchmark: 'Lower Volatility' },
      ],
      insight: 'Primary vulnerability lies in global input commodity cost fluctuations; mitigated by long-term pass-through contracts.'
    }
  };

  // 2. Why Is This Stock Moving? Mock Data
  const stockMovements = [
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd.',
      move: '+2.35%',
      isPositive: true,
      price: '₹2,984.50',
      sector: 'Energy & Retail Conglomerate',
      catalysts: [
        {
          type: 'Company Development',
          title: 'Retail Subsidiary EBITDA Expansion',
          detail: 'Announced commissioning of 450 new digital fulfillment stores with operating margins expanding by 90 bps.'
        },
        {
          type: 'Sector Movement',
          title: 'Gross Refining Margin (GRM) Uptick',
          detail: 'Regional benchmark Singapore GRMs climbed to $7.8/bbl (+14% WoW), bolstering downstream earnings outlook.'
        },
        {
          type: 'Market & Sentiment',
          title: 'FII Institutional Inflow Concentration',
          detail: 'Institutional block window recorded net absorption of ₹640 Cr with delivery volume at 64%.'
        }
      ],
      takeaway: 'Movement is fundamentally driven by margin support in energy refining paired with positive retail unit economics, not speculative momentum.'
    },
    {
      symbol: 'HDFCBANK',
      name: 'HDFC Bank Ltd.',
      move: '+1.60%',
      isPositive: true,
      price: '₹1,692.10',
      sector: 'Private Banking & Financial Services',
      catalysts: [
        {
          type: 'Fundamental Progress',
          title: 'Credit-to-Deposit (CD) Ratio Normalization',
          detail: 'Q3 update signaled CD ratio cooled from 110% to 102%, ahead of consensus banking analyst forecasts.'
        },
        {
          type: 'Regulatory & Macro',
          title: 'RBI Liquidity Infusion Guidance',
          detail: 'Central bank liquidity measures ease deposit mobilization cost pressure across tier-1 scheduled commercial banks.'
        },
        {
          type: 'Valuation Context',
          title: 'Mean Reversion from Multi-Year Valuation Lows',
          detail: 'Stock trading at 2.3x FY26e P/B vs 10-year historical average of 3.4x, prompting value accumulation.'
        }
      ],
      takeaway: 'Re-rating catalyst stems from structural balance sheet adjustment post-merger rather than short-term trading liquidity.'
    },
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      move: '-1.15%',
      isPositive: false,
      price: '₹3,940.00',
      sector: 'Information Technology Services',
      catalysts: [
        {
          type: 'Sector Macro',
          title: 'US Fed Interest Rate Path Uncertainty',
          detail: 'Sticky inflation readings in North America pushed back expectations for BFSI discretionary enterprise tech spend.'
        },
        {
          type: 'Earnings Headwind',
          title: 'Cross-Currency Headwind in European Deals',
          detail: 'Euro and GBP depreciation against USD slightly compresses constant-currency margin realization.'
        },
        {
          type: 'Valuation Sanity',
          title: 'Premium Multiple Consolidation',
          detail: 'Trading at 28x TTM P/E, institutional desks are taking partial profits ahead of the upcoming quarterly earnings release.'
        }
      ],
      takeaway: 'Softness reflects macro caution in overseas discretionary tech budgets rather than any deterioration in long-term execution moat.'
    }
  ];

  // 3. AI Copilot Interactive Prompts Data
  const aiPrompts = [
    {
      question: 'Why is Reliance moving today?',
      category: 'Market Catalyst',
      answer: {
        summary: 'Reliance Industries is up +2.35% today, driven by a confluence of retail margin expansion and a recovery in regional gross refining margins.',
        points: [
          'Downstream Energy: Singapore Gross Refining Margins rose +14% week-on-week, improving O2C earnings projections.',
          'Retail Scaling: Q3 update highlighted rapid traction in merchant grocery format with unit-level profitability.',
          'Institutional Positioning: Delivery percentage stands at 64%, indicating long-term accumulation rather than intraday noise.'
        ],
        verdict: 'Research View: Fundamentally supported catalyst. Key watch: sustainment of global refining spreads over the next quarter.'
      }
    },
    {
      question: 'Is my portfolio too concentrated in Indian IT?',
      category: 'Portfolio Risk',
      answer: {
        summary: 'Based on your simulated portfolio structure, your exposure to IT Services stands at 38% vs the NIFTY 50 benchmark weight of ~11.8%.',
        points: [
          'Macro Dependency: 38% IT exposure makes your portfolio highly sensitive to US BFSI tech spending and USD-INR rate movements.',
          'Correlation Factor: Top 3 IT holdings have a 0.89 correlation, reducing true diversification benefit.',
          'Research Rebalance: Consider evaluating resilient domestic consumption or capital goods sectors to balance geographic exposure.'
        ],
        verdict: 'Advisory Insight: High concentration risk flagged. Portfolio volatility is 1.34x higher than a balanced asset mix.'
      }
    },
    {
      question: 'Compare TCS vs Infosys across quality and valuation.',
      category: 'Company Comparison',
      answer: {
        summary: 'Both are Tier-1 IT leaders, but their capital efficiency and risk profiles diverge noticeably under ArthSetu View analysis.',
        points: [
          'Business Quality: TCS leads in return metrics with ROCE of 54% vs Infosys at 38%, driven by superior employee retention and margin discipline.',
          'Growth Trajectory: Infosys has slightly higher volatility in deal wins but faster acceleration in generative AI services.',
          'Valuation Context: TCS trades at 28.2x P/E (fair to premium), while Infosys trades at 24.5x P/E with a higher dividend yield.'
        ],
        verdict: 'Research View: TCS offers higher defensive predictability; Infosys offers higher valuation cushion if discretionary spend rebounds.'
      }
    },
    {
      question: 'Explain HDFC Bank\'s valuation relative to historical averages.',
      category: 'Valuation Intelligence',
      answer: {
        summary: 'HDFC Bank is currently trading near a 10-year valuation discount following the HDFC Ltd. mortgage merger balance-sheet consolidation.',
        points: [
          'Price-to-Book: Currently at 2.3x FY26e P/B vs 10-year historical average of 3.4x.',
          'Return on Assets (RoA): Normalized at 1.95%, expected to stabilize as high-cost liabilities mature over the next 18 months.',
          'Deposit Growth Pace: System deposit growth remains the single most critical variable governing credit expansion runway.'
        ],
        verdict: 'Research View: Favorable risk-reward for long-term compounders with high safety margin against historical downside.'
      }
    }
  ];

  // 4. Investment Lab Thesis Simulator
  const labTheses = {
    renewables: {
      title: 'India Clean Energy Transition Thesis',
      horizon: '18 Months Simulation',
      allocated: labSimulationCapital,
      thesis: 'Testing whether capital goods manufacturers in solar & transmission will compound faster than utilities as national grid capex accelerates.',
      holdings: [
        { name: 'Grid Equipment Leader', allocation: '40%', tokens: (labSimulationCapital * 0.4).toLocaleString('en-IN') },
        { name: 'Solar Cell Manufacturer', allocation: '35%', tokens: (labSimulationCapital * 0.35).toLocaleString('en-IN') },
        { name: 'Green Hydrogen Developer', allocation: '25%', tokens: (labSimulationCapital * 0.25).toLocaleString('en-IN') },
      ],
      simulationResult: '+18.4% Alpha vs NIFTY 50 (Simulated Past 6 Months)',
      learningInsight: 'Capital goods equipment makers captured margin expansion early in the capex cycle, whereas project developers faced interest rate headwinds.'
    },
    banking: {
      title: 'Private Banking Re-rating Thesis',
      horizon: '12 Months Simulation',
      allocated: labSimulationCapital,
      thesis: 'Evaluating if tier-1 private lenders with pristine CASA ratios will outperform PSU banks as systemic deposit rates peak.',
      holdings: [
        { name: 'Tier-1 Private Bank Alpha', allocation: '50%', tokens: (labSimulationCapital * 0.5).toLocaleString('en-IN') },
        { name: 'Retail Focus Bank', allocation: '30%', tokens: (labSimulationCapital * 0.3).toLocaleString('en-IN') },
        { name: 'Specialty NBFC Compounder', allocation: '20%', tokens: (labSimulationCapital * 0.2).toLocaleString('en-IN') },
      ],
      simulationResult: '+9.2% Alpha vs NIFTY Bank (Simulated Past 6 Months)',
      learningInsight: 'CASA deposit resilience protected net interest margins (NIMs) far better than aggressive unsecured lending books.'
    },
    capex: {
      title: 'Domestic Infrastructure & Railway Capex',
      horizon: '24 Months Simulation',
      allocated: labSimulationCapital,
      thesis: 'Investigating if order book visibility of 3x annual revenue in railway infrastructure can sustain high ROIC through cyclical raw material shocks.',
      holdings: [
        { name: 'Railway Wagons & Components', allocation: '45%', tokens: (labSimulationCapital * 0.45).toLocaleString('en-IN') },
        { name: 'Power Transmission Towers', allocation: '35%', tokens: (labSimulationCapital * 0.35).toLocaleString('en-IN') },
        { name: 'Defense Electronics Specialist', allocation: '20%', tokens: (labSimulationCapital * 0.2).toLocaleString('en-IN') },
      ],
      simulationResult: '+26.8% Alpha vs NIFTY Midcap (Simulated Past 6 Months)',
      learningInsight: 'Government budgetary allocation predictability created strong earnings visibility, reducing downside variance.'
    }
  };

  return (
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen font-sans text-slate-900 selection:bg-purple-200 selection:text-purple-950">
      <ArthSetuNavbar />

      {/* =========================================================================
          1. HERO SECTION
          ========================================================================= */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-[#F2EFFC]/70 via-[#F8FAFC] to-[#F8FAFC]">
        {/* Animated Floating Money, Rupee Coins & Alpha Badges Background */}
        <FloatingMoneyBackground />
        
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-purple-200/40 via-indigo-100/30 to-blue-200/40 blur-3xl -z-10 pointer-events-none rounded-full" />
        
        <div className="max-w-[88rem] mx-auto px-6 sm:px-10 md:px-[50px] relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            
            {/* Positioning Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/80 border border-purple-200/60 text-purple-900 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-purple-700" />
              <span>AI Investment Advisory & Research Intelligence Platform</span>
            </div>

            {/* Core Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-gray-950 leading-[1.12] mb-6">
              Invest with more <span className="bg-gradient-to-r from-purple-800 via-indigo-700 to-purple-950 bg-clip-text text-transparent">understanding.</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-normal leading-relaxed max-w-3xl mx-auto mb-10">
              ArthSetu combines AI-powered research, market intelligence, and multi-dimensional analysis to help you understand companies, discover opportunities, and make informed investment decisions.
            </p>

            {/* Email / Get Started Form */}
            <div className="max-w-xl mx-auto mb-8">
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row items-center gap-2.5 p-1.5 rounded-2xl sm:rounded-full bg-white border border-gray-200/80 shadow-lg shadow-purple-950/5">
                <div className="relative w-full flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email to start researching"
                    required
                    className="w-full bg-transparent text-gray-900 placeholder:text-gray-400 text-base py-3 pl-5 pr-3 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white text-base font-semibold px-7 py-3 rounded-xl sm:rounded-full hover:bg-gray-900 transition-all duration-200 shrink-0 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Explore ArthSetu</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Secondary CTA & Trust Points */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-gray-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Speculation / Pure Research</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>6-Pillar Fundamental Framework</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Context-First Indian Market Coverage</span>
              </div>
            </div>

          </div>

          {/* =========================================================================
              HERO VISUAL: RESEARCH PIPELINE + LIVE DASHBOARD PREVIEW
              ========================================================================= */}
          <div className="mt-8 rounded-3xl bg-white border border-gray-200/80 shadow-2xl shadow-purple-950/5 overflow-hidden p-4 sm:p-6 md:p-8">
            
            {/* Visual Philosophy Step Pipeline: Research -> Intelligence -> Understanding -> Decision */}
            <div className="mb-8 p-4 rounded-2xl bg-[#F8FAFC] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-900">
                <Sliders className="w-4 h-4 text-purple-700" />
                <span>The ArthSetu Philosophy</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold">
                <span className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 shadow-2xs">01 Research</span>
                <span className="text-gray-400">→</span>
                <span className="px-3 py-1.5 rounded-lg bg-purple-100/70 border border-purple-200 text-purple-900 shadow-2xs">02 Intelligence</span>
                <span className="text-gray-400">→</span>
                <span className="px-3 py-1.5 rounded-lg bg-indigo-100/70 border border-indigo-200 text-indigo-900 shadow-2xs">03 Understanding</span>
                <span className="text-gray-400">→</span>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-100/70 border border-emerald-200 text-emerald-900 shadow-2xs">04 Informed Decision</span>
              </div>

              <div className="text-xs text-gray-500 font-medium hidden lg:block">
                Not order books • Not trading execution
              </div>
            </div>

            {/* Interactive Hero Preview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Live ArthSetu View Card (78/100 Composite Score) */}
              <div className="lg:col-span-7 bg-[#FAF9FE] rounded-2xl p-5 sm:p-6 border border-purple-100">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-purple-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-md">
                        ArthSetu View
                      </span>
                      <span className="text-xs text-gray-500 font-medium">Updated Q3 FY26</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mt-1">Reliance Industries Ltd. (NSE: RELIANCE)</h3>
                    <p className="text-xs text-gray-600">Energy • Digital Services • Retail Ecosystem</p>
                  </div>

                  <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-purple-200 shadow-xs">
                    <div className="text-right">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Composite Score</div>
                      <div className="text-xs font-semibold text-emerald-600">High Conviction Horizon</div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-purple-900 tracking-tight">
                      78<span className="text-sm font-semibold text-gray-400">/100</span>
                    </div>
                  </div>
                </div>

                {/* 6 Dimension Mini Radars */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  <div className="bg-white p-3 rounded-xl border border-gray-100">
                    <div className="text-[11px] text-gray-500 font-medium">Business Quality</div>
                    <div className="text-lg font-bold text-gray-900">88/100</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">Moat: High</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100">
                    <div className="text-[11px] text-gray-500 font-medium">Growth Trajectory</div>
                    <div className="text-lg font-bold text-gray-900">74/100</div>
                    <div className="text-[10px] text-blue-600 font-semibold">CAGR: +14.8%</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100">
                    <div className="text-[11px] text-gray-500 font-medium">Valuation Sanity</div>
                    <div className="text-lg font-bold text-gray-900">65/100</div>
                    <div className="text-[10px] text-amber-600 font-semibold">P/E: 24.2x (Fair)</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100">
                    <div className="text-[11px] text-gray-500 font-medium">Momentum Quality</div>
                    <div className="text-lg font-bold text-gray-900">82/100</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">Delivery: 62%</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100">
                    <div className="text-[11px] text-gray-500 font-medium">Financial Health</div>
                    <div className="text-lg font-bold text-gray-900">91/100</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">D/E: 0.12x</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100">
                    <div className="text-[11px] text-gray-500 font-medium">Risk & Headwinds</div>
                    <div className="text-lg font-bold text-gray-900">70/100</div>
                    <div className="text-[10px] text-purple-600 font-semibold">Moderate Risk</div>
                  </div>
                </div>

                {/* Analytical Insight */}
                <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-100 text-xs text-purple-950 font-medium flex items-start gap-2.5">
                  <BrainCircuit className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>ArthSetu Analyst Summary:</strong> Strong ROCE resilience supported by digital subscriber ARPU growth and retail cash generation. Score reflects sustainable competitive advantage with reasonable downside protection.
                  </span>
                </div>
              </div>

              {/* Right Column: "Why is it moving?" & AI Prompt Preview */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                
                {/* Catalyst Module */}
                <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-900">Why It's Moving Today</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">+2.35% (Context)</span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed mb-3">
                    <strong>Primary Catalyst:</strong> Singapore Gross Refining Margins widened +14% WoW to $7.8/bbl, easing downstream operating margin drag for Q4.
                  </p>

                  <div className="text-[11px] text-gray-500 flex items-center justify-between pt-2 border-t border-gray-100">
                    <span>Catalyst Confidence: 94%</span>
                    <span className="text-purple-700 font-semibold">Sector: Nifty Energy (+1.8%)</span>
                  </div>
                </div>

                {/* AI Assistant Preview Snippet */}
                <div className="bg-gradient-to-br from-[#2B2644] to-[#1E1A30] text-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-purple-300" />
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-200">ArthSetu AI Copilot</span>
                  </div>
                  <div className="text-xs text-purple-100/90 font-medium mb-3 italic">
                    "Is Reliance's current valuation attractive compared to its 5-year average?"
                  </div>
                  <div className="text-xs text-white/80 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
                    At 24.2x P/E, the stock is trading within 2% of its 5-year median (23.8x). However, retail and digital EBITDA contributions now represent over 52% of operating profit, justifying multiple resilience.
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
          2. THE PROBLEM SECTION (Noise vs Signal)
          ========================================================================= */}
      <section className="py-20 bg-white border-y border-gray-200/70">
        <div className="max-w-[88rem] mx-auto px-6 sm:px-10 md:px-[50px]">
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-700 block mb-3">
              THE INVESTOR'S REAL CHALLENGE
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-950 tracking-tight leading-tight mb-4">
              Investing isn't difficult because there isn't enough information.
            </h2>
            <p className="text-2xl sm:text-3xl text-purple-900 font-medium tracking-tight mb-6">
              It's difficult because there is too much of it.
            </p>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Every day, investors are flooded with breaking noise, speculative telegram tips, complex 80-page financial reports, and sensational headlines. Finding what actually matters to an investment decision is nearly impossible.
            </p>
          </div>

          {/* Contrast Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* The Market Noise (What is wrong) */}
            <div className="rounded-2xl p-8 bg-red-50/40 border border-red-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 text-red-700 font-bold text-sm uppercase tracking-wider mb-4">
                  <AlertTriangle className="w-5 h-5" />
                  <span>The Market Noise Problem</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  "What should I buy next?"
                </h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Speculative social media recommendations and unverified rumors</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Sensationalized breaking news with zero context on company earnings impact</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Confusing jargon, unstructured PDF filings, and candlestick overload</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Emotional reactions to day-to-day market swings</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-red-100 text-xs text-red-900 font-medium">
                Result: Fear of missing out, impulsive decisions, and poor long-term outcomes.
              </div>
            </div>

            {/* The ArthSetu Solution (What is right) */}
            <div className="rounded-2xl p-8 bg-purple-50/50 border border-purple-200/80 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center gap-2.5 text-purple-800 font-bold text-sm uppercase tracking-wider mb-4">
                  <BadgeCheck className="w-5 h-5 text-purple-700" />
                  <span>The ArthSetu Intelligence Layer</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  "What is actually happening, and why?"
                </h3>
                <ul className="space-y-3 text-sm text-gray-800">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Evidence-based 6-pillar fundamental research and quality scoring</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Instant translation of price movements into verifiable catalysts</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>AI Copilot that answers your specific portfolio and stock questions</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Investment Lab simulator to test hypotheses with virtual capital</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-purple-200 text-xs text-purple-950 font-semibold">
                Result: Clarity, structured risk awareness, and disciplined decision-making.
              </div>
            </div>

          </div>

          {/* Philosophy Statement */}
          <div className="mt-12 text-center max-w-2xl mx-auto">
            <p className="text-base sm:text-lg font-medium text-gray-800 italic">
              "Instead of asking 'What should I buy?', ArthSetu helps you understand what is happening, why it matters, what the risks are, and what deserves deeper research."
            </p>
          </div>

        </div>
      </section>


      {/* =========================================================================
          3. WHAT ARTHSETU DOES (7 Core Capabilities)
          ========================================================================= */}
      <section id="research" className="py-24 bg-[#F8FAFC]">
        <div className="max-w-[88rem] mx-auto px-6 sm:px-10 md:px-[50px]">
          
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-700 block mb-3">
              INTELLIGENCE ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-950 tracking-tight leading-tight mb-4">
              Everything you need to understand an investment.
            </h2>
            <p className="text-lg text-gray-600">
              Built as a comprehensive research and advisory layer between you and the Indian stock market.
            </p>
          </div>

          {/* 7 Capability Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Market Intelligence */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200/80 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-950/5 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-950 mb-2">Market Intelligence</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Understand what is moving across NIFTY, SENSEX, and sector indices in real-time, accompanied by structured macroeconomic and sector context.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 text-xs font-semibold text-purple-800 flex items-center gap-1.5">
                <span>Real-Time Breadth & Sector Heatmaps</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 2. Company Research */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200/80 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-950/5 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-950 mb-2">Company Research</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Explore business quality, growth trajectory, valuation sanity, momentum strength, financial health, and key downside risks under one unified framework.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 text-xs font-semibold text-blue-800 flex items-center gap-1.5">
                <span>ArthSetu View Multi-Dimensional Analysis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 3. AI Research Copilot */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200/80 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-950/5 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-950 mb-2">AI Research Copilot</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Ask natural language questions about complex corporate actions, balance sheet shifts, sector tailwinds, or specific company comparisons.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 text-xs font-semibold text-purple-900 flex items-center gap-1.5">
                <span>Contextual Advisory Assistant</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 4. Opportunity Discovery */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200/80 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-950/5 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-950 mb-2">Opportunity Discovery</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Filter through 2,000+ NSE/BSE companies using quantitative fundamental screens, capital efficiency metrics, and sector growth catalysts.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                <span>Radar Screens & Screening Filters</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 5. Portfolio Intelligence */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200/80 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-950/5 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <PieChart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-950 mb-2">Portfolio Intelligence</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Understand your true risk exposures, sector concentration, benchmark correlations, and performance attribution beyond simple profit numbers.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 text-xs font-semibold text-indigo-800 flex items-center gap-1.5">
                <span>Risk Diagnostics & Rebalancing Views</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 6. Investment Lab Simulator */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200/80 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-950/5 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-950 mb-2">Investment Lab</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Simulate investment hypotheses using virtual Tokens without risking real capital. Review decisions, compare against benchmarks, and learn from mistakes.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                <span>Decision Simulator & Learning Hub</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 7. Pro Intelligence (Spans 3 on large or stands out) */}
            <div className="lg:col-span-3 bg-gradient-to-r from-[#2B2644] to-[#1F1B30] text-white p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-3">
                  <Crown className="w-3.5 h-3.5 text-purple-300" />
                  <span>ArthSetu Pro</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Advanced Institutional-Grade Research</h3>
                <p className="text-sm text-purple-100/80 leading-relaxed">
                  Unlock small-cap intelligence, daily research upgrade/downgrade trackers, proprietary opportunity scoring, and curated sectoral collections designed for deep research.
                </p>
              </div>
              <button
                onClick={() => navigate('/pricing')}
                className="inline-flex items-center gap-2 bg-white text-gray-950 font-semibold text-sm px-6 py-3 rounded-full hover:bg-purple-50 transition-colors shrink-0 cursor-pointer"
              >
                <span>Explore ArthSetu Pro</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>


      {/* =========================================================================
          4. STOCK RESEARCH SECTION & "ARTHSETU VIEW"
          ========================================================================= */}
      <section className="py-24 bg-white border-y border-gray-200/80">
        <div className="max-w-[88rem] mx-auto px-6 sm:px-10 md:px-[50px]">
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-700 block mb-3">
              THE ARTHSETU VIEW FRAMEWORK
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-950 tracking-tight leading-tight mb-4">
              Don't just see a stock price. Understand the company.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              A holistic research methodology that brings 6 crucial dimensions of a business into one transparent, evidence-backed evaluation score.
            </p>
          </div>

          {/* Interactive 6 Dimension Explorer */}
          <div className="max-w-5xl mx-auto bg-[#FAF9FE] rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-xs">
            
            {/* Dimension Selection Tabs */}
            <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-purple-100">
              {(['quality', 'growth', 'valuation', 'momentum', 'health', 'risk'] as const).map((tabKey) => {
                const item = researchDimensions[tabKey];
                const isActive = activeResearchTab === tabKey;
                return (
                  <button
                    key={tabKey}
                    onClick={() => setActiveResearchTab(tabKey)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? 'bg-purple-900 text-white shadow-sm'
                        : 'bg-white text-gray-700 hover:bg-purple-50 border border-purple-100'
                    }`}
                  >
                    <span>{item.title}</span>
                    <span className={`text-[11px] px-1.5 py-0.2 rounded font-bold ${
                      isActive ? 'bg-purple-800 text-purple-100' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.score}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Dimension Detail Card */}
            {(() => {
              const current = researchDimensions[activeResearchTab];
              return (
                <div className="pt-8">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold text-gray-900">{current.title}</h3>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${current.statusColor}`}>
                          {current.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                        {current.description}
                      </p>
                    </div>

                    <div className="bg-white px-5 py-3 rounded-2xl border border-purple-100 shadow-xs text-right">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Dimension Rating</div>
                      <div className="text-3xl font-black text-purple-900">{current.score}</div>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {current.metrics.map((metric, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200/70 shadow-2xs">
                        <div className="text-xs text-gray-500 font-medium mb-1">{metric.label}</div>
                        <div className="text-xl font-bold text-gray-900 mb-1">{metric.value}</div>
                        <div className="text-[11px] text-purple-700 font-semibold">{metric.benchmark}</div>
                      </div>
                    ))}
                  </div>

                  {/* Research Takeaway Callout */}
                  <div className="bg-white p-5 rounded-2xl border border-purple-100 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-1">
                        ArthSetu Research Interpretation
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {current.insight}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Section CTA */}
            <div className="mt-8 pt-6 border-t border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-500">
                Scores are derived from 40+ audited financial and operating metrics, updated daily.
              </div>
              <button
                onClick={() => navigate('/signup')}
                className="inline-flex items-center gap-2 bg-black text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <span>Explore Stock Research</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>


      {/* =========================================================================
          5. "WHY IS THIS STOCK MOVING?" SECTION
          ========================================================================= */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-[88rem] mx-auto px-6 sm:px-10 md:px-[50px]">
          
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-700 block mb-3">
              CONTEXT-FIRST MARKET INTELLIGENCE
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-950 tracking-tight leading-tight mb-2">
              Stop asking why the market moved.
            </h2>
            <p className="text-2xl sm:text-3xl text-purple-900 font-semibold tracking-tight mb-4">
              Start understanding why.
            </p>
            <p className="text-lg text-gray-600">
              Instead of showing a naked percentage change, ArthSetu analyzes news, supply chain developments, sector correlations, earnings revisions, and institutional flow to explain the exact catalysts behind every move.
            </p>
          </div>

          {/* Interactive Stock Movement Explainer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Stock Selector List (Left) */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              {stockMovements.map((stk, idx) => {
                const isSelected = selectedStockMoving === idx;
                return (
                  <button
                    key={stk.symbol}
                    onClick={() => setSelectedStockMoving(idx)}
                    className={`p-5 rounded-2xl text-left transition-all duration-200 border cursor-pointer ${
                      isSelected
                        ? 'bg-white border-purple-300 shadow-md shadow-purple-950/5'
                        : 'bg-white/70 border-gray-200/80 hover:bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-base text-gray-950">{stk.symbol}</span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                        stk.isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {stk.move}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 font-medium mb-1">{stk.name}</div>
                    <div className="text-[11px] text-purple-700 font-semibold">{stk.sector}</div>
                  </button>
                );
              })}
            </div>

            {/* Catalyst Breakdown View (Right) */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-sm">
              {(() => {
                const currentStock = stockMovements[selectedStockMoving];
                return (
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md">
                            Catalyst Decomposition
                          </span>
                          <span className="text-xs text-gray-400">Live Context Analysis</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-950">{currentStock.name} ({currentStock.symbol})</h3>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-950">{currentStock.price}</div>
                        <div className={`text-xs font-bold ${currentStock.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                          {currentStock.move} Today
                        </div>
                      </div>
                    </div>

                    {/* Three Catalysts */}
                    <div className="space-y-4 mb-8">
                      {currentStock.catalysts.map((cat, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-[#FAF9FE] border border-purple-100/80">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-purple-900">
                              {cat.type}
                            </span>
                            <span className="text-[11px] text-gray-400 font-medium">Catalyst #{idx + 1}</span>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 mb-1">{cat.title}</h4>
                          <p className="text-xs text-gray-600 leading-relaxed">{cat.detail}</p>
                        </div>
                      ))}
                    </div>

                    {/* Key Advisory Takeaway */}
                    <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-start gap-3">
                      <Target className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-1">
                          Investor Takeaway
                        </div>
                        <p className="text-xs text-purple-950 font-medium leading-relaxed">
                          {currentStock.takeaway}
                        </p>
                      </div>
                    </div>

                  </div>
                );
              })()}
            </div>

          </div>

        </div>
      </section>


      {/* =========================================================================
          6. AI COPILOT SECTION
          ========================================================================= */}
      <section id="ai-copilot" className="py-24 bg-gradient-to-b from-white to-[#F6F4FC] border-y border-gray-200/80">
        <div className="max-w-[88rem] mx-auto px-6 sm:px-10 md:px-[50px]">
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-purple-700" />
              <span>Contextual AI Research Layer</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-950 tracking-tight leading-tight mb-4">
              Meet ArthSetu AI Copilot
            </h2>
            <p className="text-2xl text-purple-900 font-semibold tracking-tight mb-4">
              Your personal investment research assistant.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Not an AI that makes blind buy/sell predictions. An intelligent research copilot designed to help you ask better questions, understand financial nuances, and analyze risk.
            </p>
          </div>

          {/* Interactive AI Chat Explorer */}
          <div className="max-w-5xl mx-auto bg-[#211C38] text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-purple-900/40">
            
            {/* Top Bar with suggested prompts */}
            <div className="mb-8">
              <div className="text-xs font-bold uppercase tracking-widest text-purple-300 mb-3">
                Try asking ArthSetu AI Copilot:
              </div>
              <div className="flex flex-wrap gap-2.5">
                {aiPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedAiPrompt(idx)}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer text-left ${
                      selectedAiPrompt === idx
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-white/10 text-white/80 hover:bg-white/15 border border-white/5'
                    }`}
                  >
                    "{p.question}"
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Window Display */}
            {(() => {
              const currentPrompt = aiPrompts[selectedAiPrompt];
              return (
                <div className="space-y-6">
                  {/* User Query Bubble */}
                  <div className="flex items-start justify-end gap-3">
                    <div className="bg-purple-500/20 border border-purple-400/30 text-white px-5 py-3 rounded-2xl rounded-tr-xs text-sm max-w-lg">
                      <div className="text-[10px] uppercase font-bold text-purple-300 mb-1">
                        Investor Query • {currentPrompt.category}
                      </div>
                      <div className="font-semibold text-base">{currentPrompt.question}</div>
                    </div>
                  </div>

                  {/* AI Response Card */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl rounded-tl-xs p-6 text-sm">
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-xs text-purple-300 font-semibold">
                        <span>ArthSetu Research Intelligence Output</span>
                        <span>Evidence-backed Synthesis</span>
                      </div>

                      <p className="text-white/95 text-base leading-relaxed mb-4 font-normal">
                        {currentPrompt.answer.summary}
                      </p>

                      <div className="space-y-2.5 mb-6">
                        {currentPrompt.answer.points.map((pt, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-purple-100/85">
                            <span className="text-purple-400 font-bold">•</span>
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>

                      <div className="p-3.5 rounded-xl bg-purple-900/40 border border-purple-500/30 text-xs text-purple-200 font-medium flex items-center justify-between">
                        <span>{currentPrompt.answer.verdict}</span>
                        <span className="text-[10px] text-purple-400">Timestamp: Live</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Bottom Input Preview */}
            <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-purple-200/60">
                AI synthesizes quarterly filings, concalls, exchange disclosures & macro data.
              </div>
              <button
                onClick={() => navigate('/signup')}
                className="inline-flex items-center gap-2 bg-white text-gray-950 text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-purple-100 transition-colors cursor-pointer"
              >
                <span>Meet ArthSetu AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>


      {/* =========================================================================
          7. PORTFOLIO INTELLIGENCE SECTION
          ========================================================================= */}
      <section className="py-24 bg-white border-b border-gray-200/80">
        <div className="max-w-[88rem] mx-auto px-6 sm:px-10 md:px-[50px]">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-700 block mb-3">
                PORTFOLIO DIAGNOSTICS
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-950 tracking-tight leading-tight mb-4">
                Understand your portfolio, not just its value.
              </h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6">
                Your portfolio should tell you much more than today's profit or loss. ArthSetu analyzes sector concentration, risk exposures, benchmark attribution, and over-correlation to ensure you stay diversified.
              </p>

              <div className="space-y-3.5 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700"><strong>Concentration Risk Alerts:</strong> Identify when a single holding or sector silently exceeds safe risk thresholds.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700"><strong>Benchmark Attribution:</strong> Understand whether your returns come from sector beta or genuine company alpha.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700"><strong>Research-Driven Rebalancing:</strong> Receive transparent suggestions to reduce downside vulnerability.</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/signup')}
                className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-7 py-3.5 rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <span>Explore Portfolio Intelligence</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Interactive Portfolio Diagnostic Card */}
            <div className="lg:col-span-7 bg-[#FAF9FE] rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-sm">
              
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-purple-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Simulated Portfolio Health</h3>
                  <p className="text-xs text-gray-500">12 Holdings • NIFTY 50 Comparison</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  Health Score: 84/100
                </div>
              </div>

              {/* Sector Exposure Breakdown */}
              <div className="mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Sector Allocation vs Safe Limit
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                      <span>Banking & Financials</span>
                      <span className="font-bold text-gray-900">32% (Balanced)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div className="h-full bg-purple-700 rounded-full" style={{ width: '32%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                      <span>IT & Digital Services</span>
                      <span className="font-bold text-amber-600">26% (High vs 12% Nifty)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '26%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                      <span>Capital Goods & Infra</span>
                      <span className="font-bold text-gray-900">20% (Tailwind Sector)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: '20%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                      <span>Automobile & Healthcare</span>
                      <span className="font-bold text-gray-900">22% (Defensive Mix)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: '22%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning Diagnostic Alert */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <strong className="block font-bold mb-0.5">Concentration Advisory Insight:</strong>
                  Your top 3 holdings constitute 58% of total portfolio variance. Consider evaluating lower-correlated domestic consumer franchises to dampen cyclical swings.
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================================
          8. INVESTMENT LAB SECTION (Decision Simulator)
          ========================================================================= */}
      <section id="investment-lab" className="py-24 bg-[#F8FAFC]">
        <div className="max-w-[88rem] mx-auto px-6 sm:px-10 md:px-[50px]">
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-4">
              <FlaskConical className="w-3.5 h-3.5 text-amber-700" />
              <span>Investment Decision Simulator</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-950 tracking-tight leading-tight mb-3">
              Learn by testing your investment ideas.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Investment Lab provides virtual capital Tokens to test investment theses without risking real money. The goal isn't to simulate day-trading—it is to help you become better at making long-term investment decisions.
            </p>
          </div>

          {/* Interactive Simulation Dashboard */}
          <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-10 shadow-sm">
            
            {/* Simulation Header with capital selector */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-100">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Virtual Simulation Capital</div>
                <div className="text-2xl sm:text-3xl font-black text-gray-950">
                  ₹{labSimulationCapital.toLocaleString('en-IN')} <span className="text-xs text-purple-700 font-semibold">(Virtual Tokens)</span>
                </div>
              </div>

              {/* Thesis switcher */}
              <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-xl">
                <button
                  onClick={() => setSelectedLabThesis('renewables')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedLabThesis === 'renewables' ? 'bg-white text-gray-950 shadow-xs' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Renewables
                </button>
                <button
                  onClick={() => setSelectedLabThesis('banking')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedLabThesis === 'banking' ? 'bg-white text-gray-950 shadow-xs' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Private Banking
                </button>
                <button
                  onClick={() => setSelectedLabThesis('capex')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedLabThesis === 'capex' ? 'bg-white text-gray-950 shadow-xs' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Rail & Infra Capex
                </button>
              </div>
            </div>

            {/* Selected Thesis Body */}
            {(() => {
              const currentThesis = labTheses[selectedLabThesis];
              return (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <h3 className="text-xl font-bold text-gray-950">{currentThesis.title}</h3>
                    <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                      Horizon: {currentThesis.horizon}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    <strong>Hypothesis Tested:</strong> {currentThesis.thesis}
                  </p>

                  {/* Simulated Allocations */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {currentThesis.holdings.map((h, i) => (
                      <div key={i} className="p-4 rounded-xl bg-[#FAF9FE] border border-purple-100">
                        <div className="text-xs text-gray-500 font-medium mb-1">{h.name}</div>
                        <div className="text-lg font-bold text-gray-900 mb-1">₹{h.tokens}</div>
                        <div className="text-xs text-purple-700 font-semibold">Weight: {h.allocation}</div>
                      </div>
                    ))}
                  </div>

                  {/* Backtest & Learning Review */}
                  <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                        Decision Outcome Review
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-white px-2.5 py-0.5 rounded-md border border-emerald-200">
                        {currentThesis.simulationResult}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                      <strong>Post-Decision Analysis:</strong> {currentThesis.learningInsight}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Action CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
              <div className="text-xs text-gray-500 font-medium">
                Track decisions across 30, 90, and 180-day horizons. Completely non-monetary.
              </div>
              <button
                onClick={() => navigate('/signup')}
                className="inline-flex items-center gap-2 bg-black text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <span>Explore Investment Lab</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>


      {/* =========================================================================
          9. PRO ARTH / ARTHSETU PRO SECTION
          ========================================================================= */}
      <section id="pro" className="py-24 bg-[#211C38] text-white">
        <div className="max-w-[88rem] mx-auto px-6 sm:px-10 md:px-[50px]">
          
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-4 border border-purple-400/20">
              <Crown className="w-3.5 h-3.5 text-purple-300" />
              <span>Deep Research & Radars</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight leading-tight mb-4">
              Go beyond the market.
            </h2>
            <p className="text-lg text-purple-100/80 leading-relaxed">
              ArthSetu Pro gives serious investors deeper research, curated opportunity radars, and advanced market intelligence designed to eliminate hundreds of hours of manual report reading.
            </p>
          </div>

          {/* Pro Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/30 transition-all">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-white">
                <Search className="w-5 h-5 text-purple-400" />
                Small-Cap Watch & Screening
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Filter high-potential emerging businesses through our 6-pillar framework before they become obvious to institutional desks.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/30 transition-all">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-white">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Growth, Value & Momentum Radars
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Dynamic quantitative rankings tracking operating leverage, valuation compression, and institutional accumulation trends.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/30 transition-all">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-white">
                <Zap className="w-5 h-5 text-amber-400" />
                Research Upgrades & Downgrades
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Daily alert stream highlighting meaningful shifts in governance scores, debt ratios, margin guidance, or earnings visibility.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/30 transition-all">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-white">
                <FileText className="w-5 h-5 text-blue-400" />
                Institutional-Grade Reports
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Comprehensive 10-page analytical dossiers synthesizing 5 years of balance sheets, management commentary, and risk sensitivity.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/30 transition-all">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-white">
                <BrainCircuit className="w-5 h-5 text-purple-400" />
                Unlimited AI Research Copilot
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Unlimited deep queries into complex notes-to-accounts, auditor comments, segmental profitability, and macro scenarios.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/30 transition-all">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-white">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Governance & Red-Flag Audit
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Automated detection of related-party transactions, auditor resignations, promoter pledging, and contingent liabilities.
              </p>
            </div>

          </div>

          <div className="p-6 rounded-2xl bg-white/10 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-purple-200">
              <strong>Responsible Advisory Promise:</strong> ArthSetu does not promise "guaranteed multibaggers" or speculative tips. We highlight businesses that fundamentally deserve your research attention.
            </div>
            <button
              onClick={() => navigate('/pricing')}
              className="inline-flex items-center gap-2 bg-white text-gray-950 text-sm font-semibold px-7 py-3 rounded-full hover:bg-purple-100 transition-colors shrink-0 cursor-pointer"
            >
              <span>Explore ArthSetu Pro</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>


      {/* =========================================================================
          10. MARKET INTELLIGENCE & DERIVATIVES (F&O) POSITIONING
          ========================================================================= */}
      <section id="markets" className="py-24 bg-white border-b border-gray-200/80">
        <div className="max-w-[88rem] mx-auto px-6 sm:px-10 md:px-[50px]">
          
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-700 block mb-3">
              MARKET BREADTH & SENTIMENT
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-950 tracking-tight leading-tight mb-4">
              Know what's happening across the market.
            </h2>
            <p className="text-lg text-gray-600">
              Live index telemetry, sectoral advance/decline breadth, and derivatives intelligence used purely to understand institutional positioning—not day-trading orders.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Derivatives Context Box */}
            <div className="lg:col-span-6 bg-[#FAF9FE] rounded-3xl p-6 sm:p-8 border border-purple-100">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-800 mb-4">
                <Radio className="w-4 h-4 text-purple-700" />
                <span>Derivatives Data for Macro Context</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-950 mb-3">
                Understand what derivatives data is telling you.
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                We decode Open Interest (OI), Put/Call Ratio (PCR), and volatility to reveal institutional support zones and sentiment shifts, helping long-term investors gauge market extremes without trading futures.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white p-3.5 rounded-xl border border-gray-200/70">
                  <div className="text-xs text-gray-500 font-medium">NIFTY PCR (OI)</div>
                  <div className="text-lg font-bold text-gray-900">1.24</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">Mild Bullish Support</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-gray-200/70">
                  <div className="text-xs text-gray-500 font-medium">India VIX</div>
                  <div className="text-lg font-bold text-gray-900">13.20</div>
                  <div className="text-[10px] text-blue-600 font-semibold">Low Regime (-2.4%)</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-gray-200/70">
                  <div className="text-xs text-gray-500 font-medium">Max Pain Zone</div>
                  <div className="text-lg font-bold text-gray-900">24,800</div>
                  <div className="text-[10px] text-purple-700 font-semibold">Monthly Expiry Concentration</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-gray-200/70">
                  <div className="text-xs text-gray-500 font-medium">Market Breadth</div>
                  <div className="text-lg font-bold text-gray-900">32 Adv / 18 Dec</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">Broad-Based Participation</div>
                </div>
              </div>

              <div className="text-xs text-purple-900 font-medium bg-purple-50 p-3 rounded-xl border border-purple-100">
                <strong>Key Takeaway:</strong> Low VIX combined with PCR above 1.2 suggests institutional accumulation on dips with firm support near 24,750.
              </div>
            </div>

            {/* Right: Sector Heatmap Overview */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
                <h4 className="text-base font-bold text-gray-950">Sectoral Leadership & Flow</h4>
                <span className="text-xs text-gray-500 font-medium">NSE Daily Sector Overview</span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-gray-900">NIFTY Energy</div>
                    <div className="text-xs text-gray-500">Refining Margins & Power Demand</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-700">+1.85%</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">Inflow Leader</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-gray-900">NIFTY Auto</div>
                    <div className="text-xs text-gray-500">Festive Inventory Clearance & SUV Mix</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-700">+1.20%</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">Strong Volumes</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-gray-900">NIFTY Financial Services</div>
                    <div className="text-xs text-gray-500">CD Ratio Stabilization Across Majors</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-purple-700">+0.65%</div>
                    <div className="text-[10px] text-purple-600 font-semibold">Stable Beta</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-100 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-gray-900">NIFTY IT</div>
                    <div className="text-xs text-gray-500">US Discretionary Tech Spend Lag</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-red-700">-0.95%</div>
                    <div className="text-[10px] text-red-600 font-semibold">Profit Taking</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* =========================================================================
          11. NEWS SECTION ("WHY IT MATTERS")
          ========================================================================= */}
      <section id="news" className="py-24 bg-[#F8FAFC]">
        <div className="max-w-[88rem] mx-auto px-6 sm:px-10 md:px-[50px]">
          
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-700 block mb-3">
              CONTEXT-RICH NEWS INTELLIGENCE
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-950 tracking-tight leading-tight mb-4">
              Don't just read the news. Understand why it matters.
            </h2>
            <p className="text-lg text-gray-600">
              Every major corporate action and macroeconomic development is analyzed through two essential lenses: Why It Matters and Potential Sector Impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Story 1 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  Economy & Monetary Policy
                </span>
                <h3 className="text-lg font-bold text-gray-950 mt-3 mb-2">
                  RBI Maintains Benchmark Repo Rate at 6.50% with Neutral Stance
                </h3>
                <div className="mt-4 p-3 rounded-xl bg-purple-50/80 border border-purple-100 text-xs text-purple-950">
                  <strong className="block font-bold mb-1 text-purple-900">Why This Matters:</strong>
                  Signals that deposit cost pressures for commercial banks have peaked, preserving net interest margins for high CASA lenders.
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 font-medium">
                <strong>Affected Sectors:</strong> Private Banks, Housing Finance, Auto
              </div>
            </div>

            {/* Story 2 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Manufacturing & Capex
                </span>
                <h3 className="text-lg font-bold text-gray-950 mt-3 mb-2">
                  Government Expands Production-Linked Incentive (PLI) for Advanced Solar Cells
                </h3>
                <div className="mt-4 p-3 rounded-xl bg-blue-50/80 border border-blue-100 text-xs text-blue-950">
                  <strong className="block font-bold mb-1 text-blue-900">Why This Matters:</strong>
                  Lowers capital payback period for domestic wafer and module manufacturers by 18-24 months.
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 font-medium">
                <strong>Affected Sectors:</strong> Renewable Energy, Power Equipment
              </div>
            </div>

            {/* Story 3 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Corporate Governance
                </span>
                <h3 className="text-lg font-bold text-gray-950 mt-3 mb-2">
                  SEBI Tightens Disclosure Standards on Related-Party Transactions
                </h3>
                <div className="mt-4 p-3 rounded-xl bg-emerald-50/80 border border-emerald-100 text-xs text-emerald-950">
                  <strong className="block font-bold mb-1 text-emerald-900">Why This Matters:</strong>
                  Improves minority shareholder protection and boosts institutional conviction in mid-cap compounders.
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 font-medium">
                <strong>Affected Sectors:</strong> Broad Market Mid-Caps & Small-Caps
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* =========================================================================
          12. RESEARCH METHODOLOGY & THE 6 PILLARS
          ========================================================================= */}
      <section className="py-24 bg-white border-y border-gray-200/80">
        <div className="max-w-[88rem] mx-auto px-6 sm:px-10 md:px-[50px]">
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-700 block mb-3">
              METHODOLOGY TRANSPARENCY
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-950 tracking-tight leading-tight mb-4">
              How ArthSetu evaluates companies
            </h2>
            <p className="text-lg text-gray-600">
              No black-box predictions. Every research score is rooted in fundamental corporate finance and transparent quantitative principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="p-6 rounded-2xl bg-[#FAF9FE] border border-purple-100">
              <div className="text-sm font-bold text-purple-900 mb-1">01. Business Quality</div>
              <h3 className="text-lg font-bold text-gray-950 mb-2">How strong is the underlying business?</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                We measure economic moats, pricing power, return on equity (ROE), return on capital employed (ROCE), and promoter integrity over full economic cycles.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF9FE] border border-purple-100">
              <div className="text-sm font-bold text-purple-900 mb-1">02. Growth Trajectory</div>
              <h3 className="text-lg font-bold text-gray-950 mb-2">How is the growth runway evolving?</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Evaluation of revenue and PAT compounding rates, market share capture, addressable market (TAM) expansion, and operating margin expansion.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF9FE] border border-purple-100">
              <div className="text-sm font-bold text-purple-900 mb-1">03. Valuation Context</div>
              <h3 className="text-lg font-bold text-gray-950 mb-2">How does valuation compare with reality?</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Multi-year historical P/E, EV/EBITDA, price-to-book percentiles, reverse DCF implied growth sanity checks, and earnings yield against risk-free rates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF9FE] border border-purple-100">
              <div className="text-sm font-bold text-purple-900 mb-1">04. Market Momentum</div>
              <h3 className="text-lg font-bold text-gray-950 mb-2">What is the market behaviour signaling?</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Relative strength against benchmark indices, delivery volume absorption, institutional ownership changes, and moving average alignment.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF9FE] border border-purple-100">
              <div className="text-sm font-bold text-purple-900 mb-1">05. Financial Health</div>
              <h3 className="text-lg font-bold text-gray-950 mb-2">What does the balance sheet tell us?</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Debt-to-equity ratios, interest coverage, free cash flow generation, working capital cycle stability, and contingency reserves.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF9FE] border border-purple-100">
              <div className="text-sm font-bold text-purple-900 mb-1">06. Risk & Headwinds</div>
              <h3 className="text-lg font-bold text-gray-950 mb-2">What could go wrong?</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Downside triggers including raw material price volatility, customer concentration, regulatory sensitivity, promoter pledging, and macro headwinds.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* =========================================================================
          13. PRODUCT JOURNEY & WHY ARTHSETU
          ========================================================================= */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-[88rem] mx-auto px-6 sm:px-10 md:px-[50px]">
          
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-700 block mb-3">
              THE ARTHSETU ADVANTAGE
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-950 tracking-tight leading-tight mb-2">
              Information is everywhere.
            </h2>
            <p className="text-2xl sm:text-3xl text-purple-900 font-semibold tracking-tight mb-4">
              Context isn't.
            </p>
            <p className="text-lg text-gray-600">
              Traditional platforms show you price, charts, and breaking noise. ArthSetu provides the context, multidimensional research, and decision-testing tools you need to invest with conviction.
            </p>
          </div>

          {/* 6-Step Visual Journey */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            
            <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="text-2xl font-black text-purple-900 mb-1">01</div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-2">SEE</div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Understand what is happening across the market and sectors in real-time.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="text-2xl font-black text-purple-900 mb-1">02</div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-2">UNDERSTAND</div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Learn why stocks and sectors are moving with verified catalyst decompositions.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="text-2xl font-black text-purple-900 mb-1">03</div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-2">RESEARCH</div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Evaluate quality, growth, valuation, and balance sheet strength via ArthSetu View.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="text-2xl font-black text-purple-900 mb-1">04</div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-2">COMPARE</div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Examine peer alternatives, downside scenarios, and valuation risk margins.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="text-2xl font-black text-purple-900 mb-1">05</div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-2">TEST</div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Use the Investment Lab to simulate your investment thesis with virtual Tokens.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="text-2xl font-black text-purple-900 mb-1">06</div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-2">LEARN</div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Review your decisions over time, analyze what worked, and continuously improve.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* =========================================================================
          14. PRICING & INTELLIGENCE TIERS
          ========================================================================= */}
      <section id="pricing" className="py-24 bg-white border-y border-gray-200/80">
        <div className="max-w-[88rem] mx-auto px-6 sm:px-10 md:px-[50px]">
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-700 block mb-3">
              TRANSPARENT PLANS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-950 tracking-tight leading-tight mb-4">
              Choose the level of intelligence you need.
            </h2>
            <p className="text-lg text-gray-600">
              Pricing centered on research depth, opportunity discovery, and decision intelligence. No brokerage or trading fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            
            {/* Free Tier */}
            <div className="rounded-3xl bg-[#FAF9FE] border border-purple-100 p-8 flex flex-col justify-between shadow-xs">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Basic Access</div>
                <h3 className="text-2xl font-bold text-gray-950 mb-1">Free Intelligence</h3>
                <p className="text-xs text-gray-600 mb-6">For investors who want to understand the market with clarity.</p>
                <div className="text-4xl font-black text-gray-950 mb-8">
                  ₹0 <span className="text-sm font-semibold text-gray-500">/ forever</span>
                </div>

                <ul className="space-y-3.5 text-sm text-gray-700 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Real-time Market & Sector Overview</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Basic ArthSetu View Stock Research</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Personalized Watchlists & Catalyst Alerts</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Contextual News with "Why It Matters"</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Limited AI Copilot Queries (5 / day)</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => navigate('/signup')}
                className="w-full bg-black text-white text-sm font-semibold py-3.5 rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Start Free Research
              </button>
            </div>

            {/* Pro Tier */}
            <div className="rounded-3xl bg-[#211C38] text-white p-8 flex flex-col justify-between shadow-xl relative border border-purple-800/60">
              <div className="absolute -top-3 right-8 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[11px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-sm">
                Most Popular
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">Professional Grade</div>
                <h3 className="text-2xl font-bold text-white mb-1">ArthSetu Pro</h3>
                <p className="text-xs text-purple-200/70 mb-6">For investors seeking deep research, radars, and simulation.</p>
                <div className="text-4xl font-black text-white mb-8">
                  ₹999 <span className="text-sm font-normal text-purple-300">/ month</span>
                </div>

                <ul className="space-y-3.5 text-sm text-purple-100 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span>Everything in Free</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span>Growth, Value & Momentum Radars</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span>Small-Cap & Mid-Cap Intelligence Watch</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span>Daily Research Upgrades & Downgrades</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span>Unlimited AI Copilot Research Queries</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span>Investment Lab Virtual Simulation & Analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span>Advanced Portfolio Concentration Diagnostics</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => navigate('/signup')}
                className="w-full bg-white text-gray-950 text-sm font-semibold py-3.5 rounded-full hover:bg-purple-100 transition-colors cursor-pointer"
              >
                Upgrade to ArthSetu Pro
              </button>
            </div>

          </div>

        </div>
      </section>


      {/* =========================================================================
          15. TRUST, ETHICS & SEBI-ALIGNED ADVISORY PHILOSOPHY
          ========================================================================= */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-[88rem] mx-auto px-6 sm:px-10 md:px-[50px]">
          
          <div className="max-w-4xl mx-auto text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-700 block mb-3">
              TRANSPARENCY & GOVERNANCE
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-950 tracking-tight mb-4">
              Research-Driven. Transparent. Evidence-Based.
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              ArthSetu is built on strict research governance. We do not operate a brokerage, handle user custody, execute orders, or provide speculative tips. All intelligence is provided to empower informed investor decision-making.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80">
              <ShieldCheck className="w-8 h-8 text-purple-700 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-sm mb-1">Evidence-Backed Data</h3>
              <p className="text-xs text-gray-500">Directly sourced from audited exchange filings and verified corporate disclosures.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200/80">
              <Scale className="w-8 h-8 text-purple-700 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-sm mb-1">Independent Research</h3>
              <p className="text-xs text-gray-500">Zero commission from brokers or promoted listings. Complete alignment with investors.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200/80">
              <BrainCircuit className="w-8 h-8 text-purple-700 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-sm mb-1">Transparent AI Boundaries</h3>
              <p className="text-xs text-gray-500">AI assists in information synthesis and data extraction, with clear source attribution.</p>
            </div>
          </div>

          <div className="mt-12 text-center text-xs text-gray-500 max-w-3xl mx-auto leading-relaxed border-t border-gray-200/70 pt-6">
            <strong>Statutory Disclosure:</strong> Investment in securities market are subject to market risks. Read all the related documents carefully before investing. Registration granted by SEBI and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors.
          </div>

        </div>
      </section>


      {/* =========================================================================
          16. FINAL CALL TO ACTION
          ========================================================================= */}
      <section className="py-24 bg-gradient-to-b from-[#2B2644] to-[#1A1729] text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 text-center relative z-10">
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-tight mb-6">
            Start researching with ArthSetu.
          </h2>

          <p className="text-lg sm:text-xl text-purple-100/80 font-normal leading-relaxed mb-10 max-w-2xl mx-auto">
            Join thousands of thoughtful Indian investors who research with clarity, understand market context, and make better-informed investment decisions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-gray-950 text-base font-semibold px-8 py-4 rounded-full hover:bg-purple-100 transition-colors shadow-lg cursor-pointer"
            >
              <span>Explore ArthSetu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const elem = document.getElementById('research');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 text-white text-base font-semibold px-8 py-4 rounded-full hover:bg-white/20 transition-colors border border-white/15 cursor-pointer"
            >
              <span>Explore Research</span>
            </button>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ArthSetuLanding;
