
import React, { createContext, useState, useContext } from 'react';
import { AuthContextType, User } from '@/types/authContext';
import { useAuthInitialization } from '@/hooks/useAuthInitialization';
import { useAuthActions } from '@/hooks/useAuthActions';

const defaultContext: AuthContextType = {
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from Supabase
  useAuthInitialization({ setUser, setIsAuthenticated });

  // Get auth actions
  const { login, logout } = useAuthActions({ setUser, setIsAuthenticated });

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
