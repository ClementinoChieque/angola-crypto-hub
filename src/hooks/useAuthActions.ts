
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Country } from '@/types/auth';
import { User } from '@/types/authContext';

interface UseAuthActionsProps {
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuthActions = ({ setUser, setIsAuthenticated }: UseAuthActionsProps) => {
  const { toast } = useToast();

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

  return { login, logout };
};
