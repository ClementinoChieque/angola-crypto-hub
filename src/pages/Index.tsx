
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
    <div className="min-h-screen bg-gray-50 bitcoin-bg">
      {isAuthenticated && <Navbar />}
      
      <div className="container mx-auto px-4 py-8">
        {isAuthenticated ? (
          <Dashboard />
        ) : (
          <div className="hero-section">
            <div className="max-w-4xl mx-auto text-center">
              {/* Logo and Title */}
              <div className="animated-entrance mb-8">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="relative">
                    <img 
                      src="/lovable-uploads/a968357d-2b22-46e9-9a6c-d590de85e923.png" 
                      alt="Bitget12" 
                      className="h-16 w-16 glow-effect"
                    />
                  </div>
                  <h1 className="text-5xl md:text-6xl font-bold crypto-gradient-text">
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
                <div className="professional-card animated-fade delay-100 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-crypto-blue to-crypto-light-blue rounded-full flex items-center justify-center">
                    <TrendingUp className="text-white" size={24} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Altos Rendimentos</h3>
                  <p className="text-sm text-muted-foreground">
                    Maximize seus lucros com estratégias comprovadas
                  </p>
                </div>

                <div className="professional-card animated-fade delay-200 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <Shield className="text-white" size={24} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Segurança Total</h3>
                  <p className="text-sm text-muted-foreground">
                    Tecnologia blockchain de última geração
                  </p>
                </div>

                <div className="professional-card animated-fade delay-300 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-crypto-purple to-purple-600 rounded-full flex items-center justify-center">
                    <Users className="text-white" size={24} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Comunidade Ativa</h3>
                  <p className="text-sm text-muted-foreground">
                    Rede de investidores colaborativos
                  </p>
                </div>

                <div className="professional-card animated-fade delay-400 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                    <Zap className="text-white" size={24} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Transações Rápidas</h3>
                  <p className="text-sm text-muted-foreground">
                    Processamento instantâneo 24/7
                  </p>
                </div>
              </div>

              {/* CTA Section */}
              <div className="animated-fade delay-500">
                <div className="professional-card max-w-md mx-auto">
                  <h2 className="text-2xl font-bold mb-4 crypto-gradient-text">
                    Comece Hoje Mesmo
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Cadastre-se gratuitamente e receba um bônus de boas-vindas
                  </p>
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/auth')} 
                    className="crypto-button w-full text-lg py-4"
                  >
                    Entrar / Cadastrar
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    * Sem taxas de cadastro • Suporte 24/7 • Retiradas ilimitadas
                  </p>
                </div>
              </div>

              {/* Stats Section */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center animated-fade delay-300">
                  <div className="text-3xl font-bold crypto-gradient-text mb-2">50K+</div>
                  <p className="text-muted-foreground">Usuários Ativos</p>
                </div>
                <div className="text-center animated-fade delay-400">
                  <div className="text-3xl font-bold crypto-gradient-text mb-2">$2.5M+</div>
                  <p className="text-muted-foreground">Volume Negociado</p>
                </div>
                <div className="text-center animated-fade delay-500">
                  <div className="text-3xl font-bold crypto-gradient-text mb-2">99.9%</div>
                  <p className="text-muted-foreground">Uptime Garantido</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
