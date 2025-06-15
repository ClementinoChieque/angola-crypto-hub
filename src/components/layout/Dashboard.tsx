import React, { useState } from 'react';
import { 
  Upload, 
  Circle, 
  UserPlus,
  Users,
  TrendingUp,
  Plus,
  telegram
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/context/UserContext';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import UploadProof from '../features/UploadProof';
import Quantify from '../features/Quantify';
import InviteUsers from '../features/InviteUsers';
import MyInvites from '../features/MyInvites';
import InvestmentPlans from '../features/InvestmentPlans';
import CryptoRates from '../features/CryptoRates';
import CryptoChart from '../features/CryptoChart';
import BalanceStatus from '../features/BalanceStatus';
import AddAccount from '../features/AddAccount';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('quantify');
  const { user } = useAuth();
  const { isDepositVerified } = useUser();
  const isMobile = useIsMobile();
  
  const menuItems = [
    { id: 'quantify', label: 'Quantificar', icon: <Circle size={isMobile ? 16 : 20} /> },
    { id: 'investment', label: 'Plano de Investimento', icon: <TrendingUp size={isMobile ? 16 : 20} /> },
    { id: 'add-account', label: 'Adicionar Conta', icon: <Plus size={isMobile ? 16 : 20} /> },
    { id: 'invite', label: 'Convidar', icon: <UserPlus size={isMobile ? 16 : 20} /> },
    { id: 'my-invites', label: 'Meus Convidados', icon: <Users size={isMobile ? 16 : 20} /> },
    { id: 'suporte', label: 'Suporte', icon: telegram({ size: isMobile ? 16 : 20 }), link: 'https://web.telegram.org/a/' },
  ];

  return (
    <div 
      className="container mx-auto py-2 md:py-6 max-w-4xl px-2 md:px-4 min-h-screen"
      style={{
        backgroundImage: 'url(/lovable-uploads/2ad2720c-6e09-4a8d-9446-2b6bd63bacb6.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay for better readability with transparency */}
      <div className="absolute inset-0 bg-black/50 -z-10"></div>
      
      {/* Welcome Header */}
      <div className="mb-6 md:mb-8 relative z-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white drop-shadow-lg">
          Bem-vindo, {user?.phoneNumber}
        </h1>
        <p className="text-white/90 drop-shadow-md">
          Gerencie seus investimentos e maximize seus lucros
        </p>
      </div>
      
      {/* Balance Status Component */}
      <div className="mb-6 relative z-10">
        <BalanceStatus />
      </div>
      
      {/* Top section with crypto rates and chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-12 relative z-10">
        <div>
          <CryptoRates />
        </div>
        <div>
          <CryptoChart />
        </div>
      </div>
      
      {/* Clear separation between chart section and menu section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-16 relative z-10">
        {/* Menu sidebar on desktop, tabs on mobile */}
        <div className="hidden md:block">
          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <div className="flex flex-col space-y-2">
              <h3 className="font-semibold text-lg mb-4 text-primary">Menu Principal</h3>
              {menuItems.map((item) =>
                item.id === 'suporte' ? (
                  <a
                    key={item.id}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 cursor-pointer hover:bg-gray-50 text-primary font-semibold`}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100">
                      {item.icon}
                    </div>
                    <span className="flex-1 text-left">{item.label}</span>
                  </a>
                ) : (
                  <button
                    key={item.id}
                    className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                      activeTab === item.id
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100">
                      {item.icon}
                    </div>
                    <span className="flex-1 text-left">{item.label}</span>
                  </button>
                )
              )}
            </div>
          </Card>
        </div>
        
        {/* Mobile tabs */}
        <div className="md:hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-3 bg-white/90 backdrop-blur-sm">
              {menuItems.slice(0, 2).map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="flex flex-col items-center py-2 text-xs"
                >
                  {item.icon}
                  <span className="mt-1">{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsList className="grid grid-cols-2 mb-3 bg-white/90 backdrop-blur-sm">
              {menuItems.slice(2, 4).map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="flex flex-col items-center py-2 text-xs"
                >
                  {item.icon}
                  <span className="mt-1 text-center">{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsList className="grid grid-cols-2 mb-3 bg-white/90 backdrop-blur-sm">
              {menuItems.slice(4, 6).map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="flex flex-col items-center py-2 text-xs"
                >
                  {item.icon}
                  <span className="mt-1 text-center">{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {/* Content area - Span 2 columns on desktop */}
        <div className="md:col-span-2">
          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            {/* Quantify Tab */}
            {activeTab === 'quantify' && <Quantify />}
            
            {/* Investment Plans Tab */}
            {activeTab === 'investment' && <InvestmentPlans />}
            
            {/* Add Account Tab */}
            {activeTab === 'add-account' && <AddAccount />}
            
            {/* Invite Tab */}
            {activeTab === 'invite' && <InviteUsers />}
            
            {/* My Invites Tab */}
            {activeTab === 'my-invites' && <MyInvites />}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
