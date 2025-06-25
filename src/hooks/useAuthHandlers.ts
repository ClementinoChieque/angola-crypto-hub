
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { signIn, signUp } from '@/services/auth';
import { useAuth } from '@/context/AuthContext';
import { countryCodes } from '@/constants/countryCodes';
import { Country } from '@/types/auth';
import { LoginFormData, RegisterFormData } from '@/schemas/authSchemas';
import { supabase } from '@/integrations/supabase/client';

export const useAuthHandlers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (values: LoginFormData) => {
    setIsLoading(true);

    try {
      // Format phone number
      const formattedPhone = `${values.countryCode}${values.phoneNumber.replace(/\D/g, '')}`;
      
      const { session } = await signIn({
        phone: formattedPhone,
        password: values.password,
      });
      
      if (session) {
        // Clear any existing localStorage data before login
        const userKey = `crypto_user_data_${session.user.id}`;
        localStorage.removeItem(userKey);
        
        // Find country name based on code
        const countryData = countryCodes.find(c => c.code === values.countryCode);
        const country = countryData ? countryData.country as Country : 'Angola';
        
        // Get full name from user metadata
        const fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.fullName;
        
        login(formattedPhone, values.countryCode, country, fullName);
        
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta!"
        });
        
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (values: RegisterFormData) => {
    setIsLoading(true);

    try {
      // Obter código de convite do formulário ou do localStorage
      const inviteCode = values.inviteCode || localStorage.getItem('referralCode');
      
      if (!inviteCode) {
        toast({
          title: "Código de convite obrigatório",
          description: "É necessário um código de convite para se registrar",
          variant: "destructive"
        });
        return;
      }

      // Verificar se o código de convite é válido
      const { data: referralCodeData, error: referralError } = await supabase
        .from('referral_codes')
        .select('user_id, code')
        .eq('code', inviteCode)
        .eq('is_active', true)
        .single();

      if (referralError || !referralCodeData) {
        toast({
          title: "Código de convite inválido",
          description: "O código de convite não existe ou não está ativo",
          variant: "destructive"
        });
        return;
      }

      // Format phone number
      const formattedPhone = `${values.countryCode}${values.phoneNumber.replace(/\D/g, '')}`;
      
      const { session } = await signUp({
        phone: formattedPhone,
        password: values.password,
        username: formattedPhone, // Use phone as username since username field was removed
        fullName: values.fullName
      });
      
      if (session) {
        // Clear ALL localStorage data to prevent cross-contamination
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('crypto_user_data_')) {
            localStorage.removeItem(key);
          }
        });
        
        // Criar registro de convite aceito
        await supabase
          .from('referrals')
          .insert({
            referrer_id: referralCodeData.user_id,
            referred_user_id: session.user.id,
            referral_code: inviteCode,
            status: 'completed',
            completed_at: new Date().toISOString()
          });

        // Limpar o código de convite do localStorage após uso bem-sucedido
        localStorage.removeItem('referralCode');

        // Find country name based on code
        const countryData = countryCodes.find(c => c.code === values.countryCode);
        const country = countryData ? countryData.country as Country : 'Angola';
        
        login(formattedPhone, values.countryCode, country, values.fullName);
        
        toast({
          title: "Registro bem-sucedido",
          description: "Sua conta foi criada com sucesso!"
        });
        
        navigate('/');
      } else {
        toast({
          title: "Registro realizado",
          description: "Verifique seu telefone para confirmar o registro",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogin,
    handleRegister,
    isLoading,
  };
};
