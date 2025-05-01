
import React, { createContext, useState, useContext, useEffect } from 'react';

type Country = 'Angola' | 'Moçambique' | 'Cabo Verde' | 'Namibia' | 'Africa do Sul';

type User = {
  phoneNumber: string;
  countryCode: string;
  country: Country;
  isAuthenticated: boolean;
};

type AuthContextType = {
  user: User | null;
  login: (phoneNumber: string, countryCode: string, country: Country) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

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

  // Check if user is already logged in from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem('crypto_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (phoneNumber: string, countryCode: string, country: Country) => {
    const newUser = { phoneNumber, countryCode, country, isAuthenticated: true };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('crypto_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('crypto_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
