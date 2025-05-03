
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser, getCurrentSession } from '@/services/auth';
import { useToast } from '@/hooks/use-toast';

type Country = 'Angola' | 'Moçambique' | 'Cabo Verde' | 'Namibia' | 'Africa do Sul';

type User = {
  phoneNumber: string;
  countryCode: string;
  country: Country;
  isAuthenticated: boolean;
  email?: string;
  id?: string;
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
  const { toast } = useToast();

  // Initialize auth state from Supabase
  useEffect(() => {
    const initAuth = async () => {
      try {
        const session = await getCurrentSession();
        if (session) {
          const sbUser = await getCurrentUser();
          const userFromSupabase = {
            id: sbUser.id,
            phoneNumber: sbUser.phone || '',
            countryCode: sbUser.phone || '',
            country: 'Angola' as Country,
            isAuthenticated: true,
            email: sbUser.email
          };
          setUser(userFromSupabase);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      }
    };

    initAuth();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          const supabaseUser = session.user;
          const userUpdate = {
            id: supabaseUser.id,
            phoneNumber: supabaseUser.phone || '',
            countryCode: supabaseUser.phone || '',
            country: 'Angola' as Country,
            isAuthenticated: true,
            email: supabaseUser.email
          };
          setUser(userUpdate);
          setIsAuthenticated(true);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    // Clean up subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = (phoneNumber: string, countryCode: string, country: Country) => {
    const newUser = { phoneNumber, countryCode, country, isAuthenticated: true };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('crypto_user', JSON.stringify(newUser));
    toast({
      title: "Login bem-sucedido",
      description: "Bem-vindo à plataforma!"
    });
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('crypto_user');
      toast({
        title: "Logout realizado",
        description: "Até breve!"
      });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Erro ao fazer logout",
        description: "Tente novamente mais tarde",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
