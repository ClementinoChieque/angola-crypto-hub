
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Dashboard from '@/components/layout/Dashboard';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { TrendingUp, Shield, Users, Zap } from 'lucide-react';

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
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo and Title */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="relative">
                  <img 
                    src="/lovable-uploads/a968357d-2b22-46e9-9a6c-d590de85e923.png" 
                    alt="Bitget12" 
                    className="h-16 w-16"
                  />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-primary">
                  Bitget12
                </h1>
              </div>
              <p className="text-xl md:text-2xl text-muted-foreground mb-4">
                Sua plataforma segura para compra, venda e investimento em criptomoedas
              </p>
              <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto">
                Junte-se a milhares de investidores que confiam em nossa tecnologia avançada 
                para maximizar seus lucros no mercado cripto
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Altos Rendimentos</h3>
                <p className="text-sm text-muted-foreground">
                  Maximize seus lucros com estratégias comprovadas
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Shield className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Segurança Total</h3>
                <p className="text-sm text-muted-foreground">
                  Tecnologia blockchain de última geração
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center">
                  <Users className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Comunidade Ativa</h3>
                <p className="text-sm text-muted-foreground">
                  Rede de investidores colaborativos
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                  <Zap className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Transações Rápidas</h3>
                <p className="text-sm text-muted-foreground">
                  Processamento instantâneo 24/7
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-white rounded-lg p-8 shadow-sm border max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-primary">
                Comece Hoje Mesmo
              </h2>
              <p className="text-muted-foreground mb-6">
                Cadastre-se gratuitamente e receba um bônus de boas-vindas
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')} 
                className="w-full text-lg py-4"
              >
                Entrar / Cadastrar
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                * Sem taxas de cadastro • Suporte 24/7 • Retiradas ilimitadas
              </p>
            </div>

            {/* Stats Section */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                <p className="text-muted-foreground">Usuários Ativos</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">$2.5M+</div>
                <p className="text-muted-foreground">Volume Negociado</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                <p className="text-muted-foreground">Uptime Garantido</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
