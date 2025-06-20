
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser, getCurrentSession, getProfile } from '@/services/auth';
import { Country } from '@/types/auth';
import { getCountryFromCode, extractCountryCodeFromPhone } from '@/utils/countryMapping';

type User = {
  phoneNumber: string;
  countryCode: string;
  country: Country;
  isAuthenticated: boolean;
  email?: string;
  id?: string;
  fullName?: string;
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
          
          // Try to get full name from user metadata or profile
          let fullName = sbUser.user_metadata?.full_name || sbUser.user_metadata?.fullName;
          
          // If not in metadata, try to get from profiles table
          if (!fullName && sbUser.id) {
            try {
              const profile = await getProfile(sbUser.id);
              fullName = profile?.full_name;
            } catch (error) {
              console.log('Profile not found, using metadata only');
            }
          }
          
          const userFromSupabase = {
            id: sbUser.id,
            phoneNumber: phone,
            countryCode: countryCode,
            country,
            isAuthenticated: true,
            email: sbUser.email,
            fullName
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
          
          // Try to get full name from user metadata or profile
          let fullName = supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.fullName;
          
          // If not in metadata, try to get from profiles table
          if (!fullName && supabaseUser.id) {
            try {
              const profile = await getProfile(supabaseUser.id);
              fullName = profile?.full_name;
            } catch (error) {
              console.log('Profile not found, using metadata only');
            }
          }
          
          const userUpdate = {
            id: supabaseUser.id,
            phoneNumber: phone,
            countryCode,
            country,
            isAuthenticated: true,
            email: supabaseUser.email,
            fullName
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
