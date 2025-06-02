
import { Country } from '@/types/auth';

export type User = {
  phoneNumber: string;
  countryCode: string;
  country: Country;
  isAuthenticated: boolean;
  email?: string;
  id?: string;
};

export type AuthContextType = {
  user: User | null;
  login: (phoneNumber: string, countryCode: string, country: Country) => void;
  logout: () => void;
  isAuthenticated: boolean;
};
