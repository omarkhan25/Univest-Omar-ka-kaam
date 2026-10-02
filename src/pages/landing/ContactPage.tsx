import React from 'react';
import { ArthSetuNavbar } from '../../components/landing/ArthSetuNavbar';
import { Footer } from '../../components/landing/Footer';
import { Mail, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="flex flex-col bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      <ArthSetuNavbar />

      <main className="flex-1 pt-32 pb-24 px-6 sm:px-10 md:px-[50px]">
        <div className="max-w-[72rem] mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            
            {/* Left Info */}
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-purple-700 block mb-3">
                GET IN TOUCH
              </span>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-950 leading-tight mb-4">
                Let's talk research & intelligence.
              </h1>
              <p className="text-base text-gray-600 leading-relaxed mb-8">
                Have questions about ArthSetu View, enterprise research access, methodology, or partnership opportunities? Our research and support team is here to assist.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-200/80">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Research & General Inquiries</div>
                    <a href="mailto:hello@arthsetu.ai" className="text-sm font-semibold text-gray-900 hover:text-purple-800">
                      hello@arthsetu.ai
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-200/80">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Institutional & Advisory Support</div>
                    <a href="mailto:advisory@arthsetu.ai" className="text-sm font-semibold text-gray-900 hover:text-purple-800">
                      advisory@arthsetu.ai
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="bg-[#211C38] text-white p-8 sm:p-10 rounded-3xl shadow-xl border border-purple-900/40">
              <h3 className="text-xl font-bold mb-2">Send us a message</h3>
              <p className="text-xs text-purple-200/70 mb-6">Our research team typically responds within 24 hours.</p>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400 focus:bg-white/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400 focus:bg-white/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1.5">Inquiry Type</label>
                  <select className="w-full bg-[#2B2446] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-400">
                    <option>Product & Research Feedback</option>
                    <option>ArthSetu Pro Subscription</option>
                    <option>Institutional Research Partnership</option>
                    <option>Methodology Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1.5">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can our research team help you?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400 focus:bg-white/10 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-white text-gray-950 font-semibold text-sm py-3.5 rounded-full hover:bg-purple-100 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Send Message</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
