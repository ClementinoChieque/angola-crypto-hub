
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Referral: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const code = searchParams.get('code');
    
    if (code) {
      // Armazenar o código de convite no localStorage para usar no registro
      localStorage.setItem('referralCode', code);
      
      toast({
        title: "Código de convite recebido!",
        description: `Você foi convidado com o código: ${code}`,
      });
      
      // Redirecionar para a página de registro
      navigate('/auth?mode=register');
    } else {
      // Se não há código, redirecionar para a página inicial
      navigate('/');
    }
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crypto-blue mx-auto mb-4"></div>
        <p className="text-gray-600">Processando convite...</p>
      </div>
    </div>
  );
};

export default Referral;
