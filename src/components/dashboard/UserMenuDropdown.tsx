import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, RefreshCcw, LogOut, ArrowUpRight, Plus, ShieldCheck, UserCheck, KeyRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import authService from '../../services/auth.service';

interface UserMenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tabName: string) => void;
  onOpenWorkspace?: () => void;
  onAddFunds?: () => void;
  onSwitchAccount?: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
  user?: any;
}

export const UserMenuDropdown: React.FC<UserMenuDropdownProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onAddFunds,
  onSwitchAccount,
  onLogout,
  isAuthenticated,
  user
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const isUserAuthenticated = isAuthenticated ?? (!!user || !!localStorage.getItem('access_token'));

  const handleAddFunds = () => {
    onClose();
    if (onAddFunds) {
      onAddFunds();
    } else {
      toast.success('Add Funds modal opened');
    }
  };

  const handleSwitchAccount = () => {
    onClose();
    if (onSwitchAccount) {
      onSwitchAccount();
    } else {
      navigate('/');
    }
  };

  const handleLogout = async () => {
    onClose();
    if (onLogout) {
      onLogout();
    } else {
      await authService.logout();
      toast.success('Logged out successfully');
      navigate('/');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* Click outside backdrop */}
        <div className="fixed inset-0 pointer-events-auto" onClick={onClose} />
        
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.96 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="absolute right-6 top-[72px] w-[280px] bg-white border border-[#E2E8F0] rounded-[24px] shadow-2xl z-50 overflow-hidden font-sans text-slate-800 pointer-events-auto flex flex-col p-3.5 gap-3"
        >
          {/* 1. USER PROFILE IDENTITY HEADER */}
          <div className="p-3.5 bg-gradient-to-r from-slate-900 via-[#123B63] to-[#15519D] text-white rounded-2xl flex items-center gap-3 shadow-md relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950 text-xs font-black flex items-center justify-center shrink-0 shadow-xs">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'AK'}
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-white truncate">
                  {user?.name || 'Aman Kumar'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" title="Active Account" />
              </div>
              <div className="text-[11px] text-slate-300 font-semibold truncate">
                {user?.email || user?.mobile || '+91 98765 43210'}
              </div>
              <div className="inline-flex items-center gap-1 mt-1 text-[9px] font-black uppercase text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-300/30">
                <ShieldCheck className="w-3 h-3 text-amber-300" />
                <span>Pro Gold Active</span>
              </div>
            </div>
          </div>

          {/* 2. UPGRADE TO UNIVEST PRIME BUTTON */}
          <button
            onClick={handleAddFunds}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>ArthSetu Pro Gold Membership</span>
          </button>

          {/* MENU ACTIONS */}
          <div className="flex flex-col gap-0.5 border-t border-slate-100 pt-2">
            {/* AI Personalization */}
            <button
              onClick={() => {
                onClose();
                navigate('/personalization');
              }}
              className="w-full px-3 py-2 rounded-xl hover:bg-primary-light text-[#172033] font-bold text-xs transition flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Plus className="w-4 h-4 text-primary rotate-45" />
                <span>AI Investor Personalization</span>
              </div>
            </button>

            {!isUserAuthenticated ? (
              <>
                {/* Login Screen */}
                <button
                  onClick={() => {
                    onClose();
                    navigate('/login');
                  }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-primary-light text-primary font-bold text-xs transition flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <KeyRound className="w-4 h-4 text-primary" />
                    <span>Sign In / Login</span>
                  </div>
                </button>

                {/* Create Account */}
                <button
                  onClick={() => {
                    onClose();
                    navigate('/signup');
                  }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 font-bold text-xs transition flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <UserCheck className="w-4 h-4 text-slate-500" />
                    <span>Register New Account</span>
                  </div>
                </button>
              </>
            ) : (
              <>
                {/* Switch Accounts */}
                <button
                  onClick={handleSwitchAccount}
                  className="w-full px-3 py-2.5 rounded-xl hover:bg-slate-100 text-[#172033] font-bold text-xs transition flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <RefreshCcw className="w-4 h-4 text-slate-500" />
                    <span>Switch Accounts</span>
                  </div>
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2.5 rounded-xl hover:bg-rose-50 text-danger font-black text-xs transition flex items-center gap-2.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UserMenuDropdown;
