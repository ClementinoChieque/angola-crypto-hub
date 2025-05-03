
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Dashboard from '@/components/layout/Dashboard';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
            <div className="flex flex-col gap-4 items-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')} 
                className="bg-crypto-blue hover:bg-crypto-light-blue"
              >
                Entrar com Telefone
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
