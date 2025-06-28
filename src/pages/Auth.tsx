
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { useLanguage } from '@/context/LanguageContext';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuthHandlers } from '@/hooks/useAuthHandlers';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'login';
  const { handleLogin, handleRegister, isLoading } = useAuthHandlers();
  const { t } = useLanguage();
  const [inviteCode, setInviteCode] = useState<string>('');

  useEffect(() => {
    // Verificar se há código de convite no localStorage
    const storedCode = localStorage.getItem('referralCode');
    if (storedCode) {
      setInviteCode(storedCode);
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-crypto-blue">Bitget12</h1>
        
        {mode === 'register' ? (
          <RegisterForm 
            onSubmit={handleRegister} 
            isLoading={isLoading} 
            initialInviteCode={inviteCode}
          />
        ) : (
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        )}
      </Card>
    </div>
  );
};

export default Auth;
