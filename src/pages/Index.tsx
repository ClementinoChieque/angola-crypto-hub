
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Dashboard from '@/components/layout/Dashboard';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, TrendingUp, Users, Zap } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      // Don't redirect, show landing page instead
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Dashboard />
        </div>
      </div>
    );
  }

  // Landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/a968357d-2b22-46e9-9a6c-d590de85e923.png" 
              alt="Bitget12" 
              className="h-8 w-8"
            />
            <span className="font-bold text-2xl text-primary">Bitget12</span>
          </div>
          <Button onClick={() => navigate('/auth')} variant="default">
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Maximize Seus <span className="text-primary">Investimentos</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plataforma de investimento em criptomoedas com altos rendimentos e segurança garantida
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="px-8 py-4 text-lg"
          >
            Comece Hoje Mesmo
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Altos Rendimentos</h3>
            <p className="text-gray-600">Até 15% de retorno mensal nos seus investimentos</p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Segurança Total</h3>
            <p className="text-gray-600">Seus fundos protegidos com tecnologia de ponta</p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Comunidade Ativa</h3>
            <p className="text-gray-600">Mais de 50.000 investidores confiam em nós</p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Transações Rápidas</h3>
            <p className="text-gray-600">Depósitos e saques processados em minutos</p>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-gray-600">Usuários Ativos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">$2.5M+</div>
              <div className="text-gray-600">Volume Negociado</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-gray-600">Uptime Garantido</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pronto para Começar?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Junte-se a milhares de investidores e comece a multiplicar seu dinheiro
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="px-8 py-4 text-lg"
          >
            Criar Conta Grátis
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
