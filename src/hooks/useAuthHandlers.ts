
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { signIn, signUp } from '@/services/auth';
import { useAuth } from '@/context/AuthContext';
import { countryCodes } from '@/constants/countryCodes';
import { Country } from '@/types/auth';
import { LoginFormData, RegisterFormData } from '@/schemas/authSchemas';

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
        // Find country name based on code
        const countryData = countryCodes.find(c => c.code === values.countryCode);
        const country = countryData ? countryData.country as Country : 'Angola';
        
        login(formattedPhone, values.countryCode, country);
        
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
      // Format phone number
      const formattedPhone = `${values.countryCode}${values.phoneNumber.replace(/\D/g, '')}`;
      
      const { session } = await signUp({
        phone: formattedPhone,
        password: values.password,
        username: values.username,
        fullName: values.fullName
      });
      
      if (session) {
        // Find country name based on code
        const countryData = countryCodes.find(c => c.code === values.countryCode);
        const country = countryData ? countryData.country as Country : 'Angola';
        
        login(formattedPhone, values.countryCode, country);
        
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
