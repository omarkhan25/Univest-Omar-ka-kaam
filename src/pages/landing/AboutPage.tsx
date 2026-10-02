import React from 'react';
import { ArthSetuNavbar } from '../../components/landing/ArthSetuNavbar';
import { Footer } from '../../components/landing/Footer';
import { ShieldCheck, Target, BrainCircuit, Scale, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      <ArthSetuNavbar />

      <main className="flex-1 pt-32 pb-24 px-6 sm:px-10 md:px-[50px]">
        <div className="max-w-[88rem] mx-auto">
          
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-700 block mb-3">
              OUR MISSION & PHILOSOPHY
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-gray-950 leading-tight mb-4">
              Democratizing institutional research for Indian investors.
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              We believe every investor deserves access to clear, evidence-based fundamental research without having to navigate trading noise, speculative hype, or 80-page unstructured PDFs.
            </p>
          </div>

          {/* Philosophy Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            
            <div className="p-8 sm:p-10 rounded-3xl bg-[#211C38] text-white shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-purple-300 block mb-2">The Problem We Solve</span>
                <h3 className="text-2xl font-bold mb-4">Information without context is just noise.</h3>
                <p className="text-sm text-purple-100/80 leading-relaxed mb-6">
                  In India today, retail investors are surrounded by stock tips, short-term charts, and breaking news. Yet when asked why a company is fundamentally sound or what its true risk exposures are, clear answers are elusive.
                </p>
                <p className="text-sm text-purple-100/80 leading-relaxed">
                  ArthSetu was founded to bridge this knowledge gap by acting as an intelligent research layer between the investor and the Indian stock market.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 text-xs text-purple-200">
                Founded by financial analysts, data scientists, and long-term equity researchers.
              </div>
            </div>

            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-gray-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-purple-700 block mb-2">Our Guiding Principle</span>
                <h3 className="text-2xl font-bold text-gray-950 mb-4">See. Understand. Research. Decide.</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  We measure success not by how many trades our users execute, but by how well they understand the businesses they own. 
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-xs text-gray-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Evidence-based 6-pillar fundamental scoring</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-gray-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Zero trading brokerage or execution conflicts of interest</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-gray-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Transparent AI boundaries with direct source attribution</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-500">
                Headquartered in India • Dedicated to Indian Capital Markets
              </div>
            </div>

          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 text-center">
              <ShieldCheck className="w-8 h-8 text-purple-700 mx-auto mb-3" />
              <h4 className="font-bold text-gray-950 text-base mb-1">Research Rigor</h4>
              <p className="text-xs text-gray-500">We analyze 40+ fundamental ratios, balance sheet health, and corporate governance metrics for every company.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 text-center">
              <Scale className="w-8 h-8 text-purple-700 mx-auto mb-3" />
              <h4 className="font-bold text-gray-950 text-base mb-1">Strict Independence</h4>
              <p className="text-xs text-gray-500">We do not accept payments from listed companies or promote paid stock placements.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 text-center">
              <BrainCircuit className="w-8 h-8 text-purple-700 mx-auto mb-3" />
              <h4 className="font-bold text-gray-950 text-base mb-1">Empowering Technology</h4>
              <p className="text-xs text-gray-500">Harnessing advanced machine intelligence to summarize thousands of pages of financial filings instantly.</p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
