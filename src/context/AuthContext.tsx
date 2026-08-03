import React, { createContext, useContext, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import userService from '../services/user.service';
import type { UserProfile } from '../services/user.service';
import authService from '../services/auth.service';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  login: (token: string, userData: UserProfile) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));

  // Use React Query to fetch the user profile if there's a token
  const { data: user = null, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: () => userService.getProfile(),
    enabled: !!token,
    retry: false,
  });

  const login = (newToken: string, userData: UserProfile) => {
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
    // Optimistically set the user data in the query cache
    queryClient.setQueryData(['authUser'], userData);
  };

  const logout = async () => {
    await authService.logout();
    setToken(null);
    queryClient.setQueryData(['authUser'], null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
