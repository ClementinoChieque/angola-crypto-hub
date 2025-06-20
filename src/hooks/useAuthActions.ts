
import { signOut } from '@/services/auth';
import { Country } from '@/types/auth';

type User = {
  phoneNumber: string;
  countryCode: string;
  country: Country;
  isAuthenticated: boolean;
  email?: string;
  id?: string;
  fullName?: string;
};

interface UseAuthActionsProps {
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuthActions = ({ setUser, setIsAuthenticated }: UseAuthActionsProps) => {
  const login = (phoneNumber: string, countryCode: string, country: Country, fullName?: string) => {
    const userData: User = {
      phoneNumber,
      countryCode,
      country,
      isAuthenticated: true,
      fullName
    };
    
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('crypto_user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('crypto_user');
    }
  };

  return { login, logout };
};
