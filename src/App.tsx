import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import HomeDashboard from './components/dashboard/HomeDashboard';
import { Button } from './components/atoms/Button';
import { Input } from './components/atoms/Input';
import { Switch } from './components/atoms/Switch';
import { SegmentedControl } from './components/molecules/SegmentedControl';
import { Modal } from './components/molecules/Modal';
import { StockPrice } from './components/financial/StockPrice';
import { RiskMeter } from './components/financial/RiskMeter';
import { Allocation } from './components/financial/Allocation';
import { ResearchCard } from './components/financial/ResearchCard';
import type { ResearchCall } from './components/financial/ResearchCard';
import { IndexCard } from './components/financial/IndexCard';
import { Info } from 'lucide-react';

// Onboarding & Flow Screens
import SplashScreen from './components/molecules/SplashScreen';
import GetStarted from './components/molecules/GetStarted';
import LoginWithOtp from './components/molecules/LoginWithOtp';
import InvestorOnboarding from './components/molecules/InvestorOnboarding';
import InvestorPersonalization from './components/molecules/InvestorPersonalization';

// Auth Pages
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OnboardingFlowContainer from './pages/onboarding/OnboardingFlowContainer';
import AnalystDashboard from './pages/admin/AnalystDashboard';
import Pricing from './pages/Pricing';
import LandingPage from './pages/LandingPage';

// Mock Data for Design System Showcase
const MOCK_CALLS: ResearchCall[] = [
  {
    id: '1',
    symbol: 'TATASTEEL',
    companyName: 'Tata Steel Limited',
    category: 'Short Term',
    recommendation: 'buy',
    entryPriceRange: '₹145 - ₹148',
    targetPrice: 165.00,
    stopLoss: 138.00,
    potentialUpside: 12.5,
    confidenceScore: 94,
    publishedDate: '17 Jul 2026',
    risk: 'Low',
  },
  {
    id: '2',
    symbol: 'RELIANCE',
    companyName: 'Reliance Industries Ltd',
    category: 'Positional',
    recommendation: 'hold',
    entryPriceRange: '₹2,420 - ₹2,450',
    targetPrice: 2700.00,
    stopLoss: 2310.00,
    potentialUpside: 10.2,
    confidenceScore: 88,
    publishedDate: '16 Jul 2026',
    risk: 'Moderate',
  }
];

const MOCK_ALLOCATION = [
  { assetClass: 'Equities', percentage: 55, value: 550000, color: '#2563EB' },
  { assetClass: 'Mutual Funds', percentage: 25, value: 250000, color: '#10B981' },
  { assetClass: 'Gold / Commodity', percentage: 12, value: 120000, color: '#F59E0B' },
  { assetClass: 'Liquid Cash', percentage: 8, value: 80000, color: '#64748B' },
];

function ShowcaseContent() {
  const [switchVal, setSwitchVal] = useState(false);
  const [segmentVal, setSegmentVal] = useState('1D');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [textInput, setTextInput] = useState('');

  return (
    <div className="flex flex-col gap-8 w-full font-sans text-slate-800">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-[#0F172A]">
          Design System Foundation Showcase
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Explore design tokens, micro-interactions, responsive grids, and premium financial components.
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <IndexCard name="Nifty 50" value={22045.25} change={128.40} changePercent={0.58} sparklineData={[21900, 21950, 21920, 21980, 22010, 22045]} />
        <IndexCard name="Bank Nifty" value={46210.80} change={-245.10} changePercent={-0.53} sparklineData={[46500, 46420, 46460, 46310, 46250, 46210]} />
        <IndexCard name="SENSEX" value={72426.64} change={480.20} changePercent={0.67} sparklineData={[71900, 72100, 72050, 72200, 72350, 72426]} />
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-base font-black text-[#0F172A]">Live Advisory Signals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_CALLS.map((call) => (
            <ResearchCard key={call.id} call={call} onTrack={() => setIsModalOpen(true)} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-xs flex flex-col gap-6">
          <h3 className="text-sm font-black text-[#0F172A] border-b border-slate-100 pb-3">Core Controls & Form Atoms</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Search Input" placeholder="Search stock..." isSearch value={textInput} onChange={(e) => setTextInput(e.target.value)} />
              <Input label="Secure Password Input" placeholder="Enter password" type="password" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch checked={switchVal} onChange={setSwitchVal} />
                <span className="text-xs text-slate-600 font-bold">Push Notifications</span>
              </div>
              <SegmentedControl options={[{ label: '1D', value: '1D' }, { label: '1W', value: '1W' }, { label: '1M', value: '1M' }]} selectedValue={segmentVal} onChange={setSegmentVal} />
            </div>
            
            <Button variant="secondary" className="w-full" onClick={() => setIsModalOpen(true)}>
              Trigger Modal Component
            </Button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-xs flex flex-col gap-6">
          <h3 className="text-sm font-black text-[#0F172A] border-b border-slate-100 pb-3">Financial Widgets</h3>
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-bold block mb-1">Current Stock Price (TATASTEEL)</span>
                <StockPrice price={147.20} change={3.45} changePercent={2.40} size="md" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-bold block mb-1">Loss Price (INFY)</span>
                <StockPrice price={1560.00} change={-42.50} changePercent={-2.65} size="md" />
              </div>
            </div>
            <RiskMeter level="Moderate" />
            <Allocation items={MOCK_ALLOCATION} />
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Research Call Execution Details">
        <div className="flex flex-col gap-4 text-slate-800">
          <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold">
            <Info className="w-4 h-4 shrink-0" />
            <span>Advisory recommendations are validated by SEBI registered analysts.</span>
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>Confirm Advisory</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Main Dashboard as default primary route */}
            <Route
              path="/"
              element={
                <DashboardLayout />
              }
            />
            <Route
              path="/dashboard"
              element={
                <DashboardLayout />
              }
            />
            <Route
              path="/design-system"
              element={
                <DashboardLayout>
                  <ShowcaseContent />
                </DashboardLayout>
              }
            />
            
            {/* Onboarding & Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/splash" element={<SplashScreen />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/login-otp" element={<LoginWithOtp />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/onboarding" element={<OnboardingFlowContainer />} />
            <Route path="/personalization" element={<InvestorPersonalization />} />
            <Route path="/pricing" element={<DashboardLayout><Pricing /></DashboardLayout>} />
            <Route path="/analyst" element={<DashboardLayout><AnalystDashboard /></DashboardLayout>} />

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
