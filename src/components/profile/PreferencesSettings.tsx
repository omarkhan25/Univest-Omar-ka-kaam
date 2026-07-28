import React, { useState } from 'react';
import { Settings, Bell, Globe, Shield, Sparkles, Moon, Sun, DollarSign, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export const PreferencesSettings: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'EUR'>('INR');
  const [language, setLanguage] = useState<'en' | 'hi' | 'gu'>('en');
  
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [aiRebalanceAlerts, setAiRebalanceAlerts] = useState(true);
  const [marketVolatilityAlerts, setMarketVolatilityAlerts] = useState(true);

  const handleSave = () => {
    toast.success('Preferences updated successfully');
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-[#0F172A]">Account & Platform Preferences</h3>
          <p className="text-xs text-slate-500 font-medium">Customize your workspace appearance, currency, and AI notification triggers.</p>
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition shadow-sm"
        >
          Save Preferences
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Appearance & Localization */}
        <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 shadow-sm flex flex-col gap-6">
          <h4 className="font-black text-base text-[#0F172A] flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" /> Display & Localization
          </h4>

          <div className="flex flex-col gap-4 text-xs">
            <div>
              <span className="font-bold text-slate-500 block mb-2">Base Currency</span>
              <div className="grid grid-cols-3 gap-2">
                {(['INR', 'USD', 'EUR'] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`py-2.5 rounded-xl font-black border transition ${
                      currency === c ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {c === 'INR' ? '₹ INR' : c === 'USD' ? '$ USD' : '€ EUR'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-500 block mb-2">Platform Language</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'en', label: 'English' },
                  { id: 'hi', label: 'हिंदी (Hindi)' },
                  { id: 'gu', label: 'ગુજરાતી (Gujarati)' }
                ].map(l => (
                  <button
                    key={l.id}
                    onClick={() => setLanguage(l.id as any)}
                    className={`py-2.5 rounded-xl font-bold border text-xs transition ${
                      language === l.id ? 'bg-blue-50 border-blue-200 text-blue-600 font-black' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI & Notification Settings */}
        <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 shadow-sm flex flex-col gap-6">
          <h4 className="font-black text-base text-[#0F172A] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" /> AI & Market Alert Triggers
          </h4>

          <div className="flex flex-col gap-4 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
              <div>
                <span className="font-black text-[#0F172A] block">AI Rebalance Signals</span>
                <span className="text-[10px] text-slate-500">Get notified when AI detects sector concentration risk</span>
              </div>
              <input
                type="checkbox"
                checked={aiRebalanceAlerts}
                onChange={e => setAiRebalanceAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
              <div>
                <span className="font-black text-[#0F172A] block">Market Volatility Spike Alerts</span>
                <span className="text-[10px] text-slate-500">Instant alerts when holding swings &gt; 3%</span>
              </div>
              <input
                type="checkbox"
                checked={marketVolatilityAlerts}
                onChange={e => setMarketVolatilityAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
              <div>
                <span className="font-black text-[#0F172A] block">WhatsApp Advisory Digest</span>
                <span className="text-[10px] text-slate-500">Receive morning market overview on WhatsApp</span>
              </div>
              <input
                type="checkbox"
                checked={whatsappAlerts}
                onChange={e => setWhatsappAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PreferencesSettings;
