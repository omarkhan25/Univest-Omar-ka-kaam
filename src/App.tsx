import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DashboardLayout } from './layouts/DashboardLayout';

import { ProtectedRoute } from './components/routing/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import AnalystDashboard from './pages/admin/AnalystDashboard';
import Pricing from './pages/Pricing';
import InvestorPersonalization from './components/molecules/InvestorPersonalization';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/register" element={<SignUp />} />

            {/* Protected Routes (Now Public) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />} />
              <Route path="/pricing" element={<DashboardLayout><Pricing /></DashboardLayout>} />
              <Route path="/analyst" element={<DashboardLayout><AnalystDashboard /></DashboardLayout>} />
              <Route path="/personalization" element={<InvestorPersonalization />} />
            </Route>
            
            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
