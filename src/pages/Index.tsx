
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Dashboard from '@/components/layout/Dashboard';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import Footer from '@/components/layout/Footer';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      // Don't redirect, show landing page instead
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return (
      <div 
        className="min-h-screen flex flex-col"
        style={{
          backgroundImage: 'url(/lovable-uploads/2ad2720c-6e09-4a8d-9446-2b6bd63bacb6.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay for better readability with transparency */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
        <div className="relative z-10 flex-grow">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Dashboard />
          </div>
        </div>
        <div className="relative z-10">
          <Footer variant="dark" />
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
          <Button onClick={() => navigate('/auth?mode=login')} variant="default">
            {t('login')}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('language') === 'pt' ? (
              <>Maximize Seus <span className="text-primary">Investimentos</span></>
            ) : (
              <>Maximize Your <span className="text-primary">Investments</span></>
            )}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('language') === 'pt' 
              ? 'Plataforma de investimento em criptomoedas com altos rendimentos e segurança garantida'
              : 'Cryptocurrency investment platform with high returns and guaranteed security'
            }
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth?mode=register')}
            className="px-8 py-4 text-lg"
          >
            {t('register')}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
