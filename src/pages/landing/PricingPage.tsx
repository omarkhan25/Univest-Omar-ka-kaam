import React from 'react';
import { ArthSetuNavbar } from '../../components/landing/ArthSetuNavbar';
import { Footer } from '../../components/landing/Footer';
import { Check, ShieldCheck, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      <ArthSetuNavbar />

      <main className="flex-1 pt-32 pb-24 px-6 sm:px-10 md:px-[50px]">
        <div className="max-w-[88rem] mx-auto">
          
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-700 block mb-3">
              INTELLIGENCE TIERS
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-gray-950 leading-tight mb-4">
              Invest in better research, not brokerages.
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Transparent, subscription-based access to institutional-grade research, opportunity radars, and decision simulation. Zero trading commissions, zero hidden fees.
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20 items-stretch">
            
            {/* Free Tier */}
            <div className="rounded-3xl bg-white border border-gray-200/80 p-8 sm:p-10 flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Free Forever</span>
                <h3 className="text-2xl font-bold text-gray-950 mb-1">Standard Research</h3>
                <p className="text-xs text-gray-500 mb-6">For thoughtful investors who want to understand the market with clarity.</p>
                <div className="text-4xl font-black text-gray-950 mb-8">
                  ₹0 <span className="text-sm font-normal text-gray-400">/ forever</span>
                </div>

                <ul className="space-y-4 mb-8 text-sm text-gray-700">
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Real-time Market & Sector Overview</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Basic ArthSetu View (6 Fundamental Pillars)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Contextual News with "Why This Matters"</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Custom Watchlists with Catalyst Alerts</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Limited AI Copilot Queries (5 per day)</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => navigate('/signup')}
                className="w-full bg-black text-white text-sm font-semibold py-3.5 rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro Tier */}
            <div className="rounded-3xl bg-[#211C38] text-white p-8 sm:p-10 flex flex-col justify-between shadow-2xl relative border border-purple-800/60">
              <div className="absolute -top-3 right-8 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[11px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-sm">
                Most Popular
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300 block mb-2">Deep Intelligence</span>
                <h3 className="text-2xl font-bold text-white mb-1">ArthSetu Pro</h3>
                <p className="text-xs text-purple-200/70 mb-6">For investors seeking proprietary radars, small-cap screening, and simulation.</p>
                <div className="text-4xl font-black text-white mb-8">
                  ₹999 <span className="text-sm font-normal text-purple-300">/ month</span>
                </div>

                <ul className="space-y-4 mb-8 text-sm text-purple-100">
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Everything included in Free Standard</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Growth, Value & Momentum Radars</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Small-Cap & Mid-Cap Intelligence Watch</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Daily Research Upgrades & Downgrades Tracker</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Unlimited AI Copilot Research Queries</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Investment Lab Decision Simulator & Virtual Capital</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Portfolio Concentration & Benchmark Diagnostics</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => navigate('/signup')}
                className="w-full bg-white text-gray-950 text-sm font-semibold py-3.5 rounded-full hover:bg-purple-100 transition-colors cursor-pointer"
              >
                Start Pro 14-Day Trial
              </button>
            </div>

          </div>

          {/* Pricing FAQ / Guarantee */}
          <div className="max-w-3xl mx-auto rounded-2xl bg-white border border-gray-200/80 p-8">
            <h3 className="text-lg font-bold text-gray-950 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-700" />
              Frequently Asked Questions About Plans
            </h3>
            <div className="space-y-4 text-xs sm:text-sm text-gray-600">
              <div>
                <strong className="block text-gray-900 font-semibold mb-1">Does ArthSetu charge brokerage or trading fees?</strong>
                No. ArthSetu is purely an investment research and intelligence platform. We do not execute trades or charge commissions.
              </div>
              <div>
                <strong className="block text-gray-900 font-semibold mb-1">Can I cancel my ArthSetu Pro subscription anytime?</strong>
                Yes, you can cancel your subscription at any time with a single click. You will retain access until the end of your billing cycle.
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
