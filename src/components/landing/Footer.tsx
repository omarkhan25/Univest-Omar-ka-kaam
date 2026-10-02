import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ShieldCheck, FileText, Scale, Mail, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LogoIcon = () => (
  <svg
    viewBox="0 0 256 256"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8"
  >
    <path d="M 128.005 191.173 C 128.448 156.208 156.93 128 192 128 L 192 64 L 128 64 C 128 99.346 99.346 128 64 128 L 64 192 L 128 192 Z M 192 256 L 64 256 C 28.654 256 0 227.346 0 192 L 0 64 L 64 64 L 64 0 L 192 0 C 227.346 0 256 28.654 256 64 L 256 192 L 192 192 Z" />
  </svg>
);

const FooterLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <li>
    <a 
      href={href} 
      className="text-gray-600 hover:text-gray-950 text-sm font-medium transition-colors relative group inline-flex"
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gray-950 transition-all duration-300 group-hover:w-full"></span>
    </a>
  </li>
);

export const Footer = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-5%" });

  return (
    <footer ref={containerRef} className="bg-white border-t border-gray-200/80 pt-20 pb-12 overflow-hidden font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[88rem] mx-auto px-6 sm:px-10 md:px-[50px]"
      >
        
        {/* Main Footer Layout */}
        <div className="flex flex-col xl:flex-row justify-between items-start gap-16 xl:gap-20 mb-16">
          
          {/* Left Side: Brand & Mission */}
          <div className="w-full xl:max-w-[22rem] shrink-0">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-white">
                <LogoIcon />
              </div>
              <span className="text-2xl font-bold tracking-tight text-gray-950">ArthSetu</span>
            </div>
            
            <h4 className="text-base font-semibold text-purple-900 mb-3 tracking-tight">
              AI Investment Advisory & Research Intelligence
            </h4>
            
            <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-sm">
              Helping Indian investors make informed decisions through multi-dimensional research, verified market context, and AI investment intelligence.
            </p>
            
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Weekly Research Newsletter
              </h5>
              <div className="flex items-center gap-2 relative">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 text-sm rounded-full py-3 pl-5 pr-28 focus:outline-none focus:bg-white focus:border-purple-600 transition-all shadow-2xs"
                />
                <button className="absolute right-1 top-1 bottom-1 bg-black text-white text-xs font-semibold px-4 rounded-full hover:bg-gray-800 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-gray-400 font-medium pl-1">
                Context-first market research. Zero spam.
              </p>
            </div>
          </div>

          {/* Right Side: Navigation Columns */}
          <div className="w-full flex-1">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10">
              
              <div>
                <h5 className="text-xs font-bold text-gray-900 mb-5 uppercase tracking-wider">Research Intelligence</h5>
                <ul className="space-y-3">
                  <FooterLink href="/#research">ArthSetu View (6 Pillars)</FooterLink>
                  <FooterLink href="/#research">Why It's Moving</FooterLink>
                  <FooterLink href="/#ai-copilot">AI Research Copilot</FooterLink>
                  <FooterLink href="/#markets">Market & Breadth</FooterLink>
                  <FooterLink href="/#markets">F&O Sentiment Context</FooterLink>
                </ul>
              </div>

              <div>
                <h5 className="text-xs font-bold text-gray-900 mb-5 uppercase tracking-wider">Radars & Simulator</h5>
                <ul className="space-y-3">
                  <FooterLink href="/#pro">Small-Cap Watch</FooterLink>
                  <FooterLink href="/#pro">Growth & Value Radars</FooterLink>
                  <FooterLink href="/#investment-lab">Investment Lab</FooterLink>
                  <FooterLink href="/#pro">Research Upgrades</FooterLink>
                  <FooterLink href="/#pricing">Pro Plans</FooterLink>
                </ul>
              </div>

              <div>
                <h5 className="text-xs font-bold text-gray-900 mb-5 uppercase tracking-wider">Company & Ethics</h5>
                <ul className="space-y-3">
                  <FooterLink href="/about">About ArthSetu</FooterLink>
                  <FooterLink href="/about">Research Methodology</FooterLink>
                  <FooterLink href="/contact">Contact Support</FooterLink>
                  <FooterLink href="/contact">Editorial Guidelines</FooterLink>
                </ul>
              </div>

              <div>
                <h5 className="text-xs font-bold text-gray-900 mb-5 uppercase tracking-wider">Legal & Trust</h5>
                <ul className="space-y-3">
                  <FooterLink href="/privacy">Privacy Policy</FooterLink>
                  <FooterLink href="/terms">Terms of Service</FooterLink>
                  <FooterLink href="/disclaimer">SEBI Advisory Disclosure</FooterLink>
                  <FooterLink href="/disclaimer">AI Limitations</FooterLink>
                </ul>
              </div>

            </div>

            {/* Social Links Bar */}
            <div className="mt-12 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-purple-800 transition-colors">
                  <LinkedinIcon className="w-4 h-4" /> LinkedIn
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-purple-800 transition-colors">
                  <TwitterIcon className="w-4 h-4" /> X (Twitter)
                </a>
                <a href="mailto:research@arthsetu.ai" className="flex items-center gap-1.5 hover:text-purple-800 transition-colors">
                  <Mail className="w-4 h-4" /> research@arthsetu.ai
                </a>
              </div>

              <div className="text-xs text-gray-400 font-medium">
                © 2026 ArthSetu Research Technologies Pvt. Ltd. All rights reserved.
              </div>
            </div>

          </div>

        </div>

        {/* Regulatory Disclosure Box */}
        <div className="p-5 rounded-2xl bg-[#FAF9FE] border border-purple-100/80 text-xs text-gray-500 leading-relaxed space-y-2">
          <p>
            <strong>Regulatory & Research Disclaimer:</strong> ArthSetu is a research, market intelligence, and decision support platform. ArthSetu is NOT a stockbroker, portfolio manager, or custodian. We do not execute trades or hold client capital. All scores, commentary, and AI outputs are generated for educational and analytical purposes based on publicly available exchange filings, audited reports, and quantitative models.
          </p>
          <p>
            Securities investments are subject to market risks. Please read all scheme- and company-related information and evaluate your personal risk tolerance before making any financial investment. Past performance is not indicative of future returns.
          </p>
        </div>

      </motion.div>
    </footer>
  );
};

export default Footer;
