
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser, getCurrentSession } from '@/services/auth';
import { Country } from '@/types/auth';
import { getCountryFromCode, extractCountryCodeFromPhone } from '@/utils/countryMapping';

type User = {
  phoneNumber: string;
  countryCode: string;
  country: Country;
  isAuthenticated: boolean;
  email?: string;
  id?: string;
};

interface UseAuthInitializationProps {
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuthInitialization = ({ setUser, setIsAuthenticated }: UseAuthInitializationProps) => {
  useEffect(() => {
    const initAuth = async () => {
      try {
        const session = await getCurrentSession();
        if (session) {
          const sbUser = await getCurrentUser();
          
          const phone = sbUser.phone || '';
          const countryCode = extractCountryCodeFromPhone(phone);
          const country = getCountryFromCode(countryCode);
          
          const userFromSupabase = {
            id: sbUser.id,
            phoneNumber: phone,
            countryCode: countryCode,
            country,
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

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          const supabaseUser = session.user;
          
          const phone = supabaseUser.phone || '';
          const countryCode = extractCountryCodeFromPhone(phone);
          const country = getCountryFromCode(countryCode);
          
          const userUpdate = {
            id: supabaseUser.id,
            phoneNumber: phone,
            countryCode,
            country,
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

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setUser, setIsAuthenticated]);
};
