
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import PhoneAuth from '@/components/auth/PhoneAuth';
import Dashboard from '@/components/layout/Dashboard';
import Navbar from '@/components/layout/Navbar';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Navbar />}
      
      <div className="container mx-auto px-4 py-8">
        {isAuthenticated ? (
          <Dashboard />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-crypto-dark mb-2">Angola Crypto Hub</h1>
              <p className="text-muted-foreground">
                Sua plataforma segura para compra, venda e investimento em criptomoedas
              </p>
            </div>
            <PhoneAuth />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
