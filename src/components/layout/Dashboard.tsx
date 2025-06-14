
import React, { useState } from 'react';
import { 
  Upload, 
  Circle, 
  UserPlus,
  Users,
  TrendingUp,
  Plus
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
  const [activeTab, setActiveTab] = useState('upload');
  const { user } = useAuth();
  const { isDepositVerified } = useUser();
  const isMobile = useIsMobile();
  
  const menuItems = [
    { id: 'upload', label: 'Upload Comprovativo', icon: <Upload size={isMobile ? 16 : 20} /> },
    { id: 'quantify', label: 'Quantificar', icon: <Circle size={isMobile ? 16 : 20} /> },
    { id: 'investment', label: 'Plano de Investimento', icon: <TrendingUp size={isMobile ? 16 : 20} /> },
    { id: 'add-account', label: 'Adicionar Conta', icon: <Plus size={isMobile ? 16 : 20} /> },
    { id: 'invite', label: 'Convidar', icon: <UserPlus size={isMobile ? 16 : 20} /> },
    { id: 'my-invites', label: 'Meus Convidados', icon: <Users size={isMobile ? 16 : 20} /> },
  ];

  return (
    <div className="container mx-auto py-2 md:py-6 max-w-4xl px-2 md:px-4">
      {/* Welcome Header */}
      <div className="mb-6 md:mb-8 animated-entrance">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 crypto-gradient-text">
          Bem-vindo, {user?.phoneNumber}
        </h1>
        <p className="text-muted-foreground">
          Gerencie seus investimentos e maximize seus lucros
        </p>
      </div>
      
      {/* Balance Status Component */}
      <div className="animated-fade delay-100">
        <BalanceStatus />
      </div>
      
      {/* Top section with crypto rates and chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-12">
        <div className="animated-fade delay-200">
          <CryptoRates />
        </div>
        <div className="animated-fade delay-300">
          <CryptoChart />
        </div>
      </div>
      
      {/* Clear separation between chart section and menu section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-16">
        {/* Menu sidebar on desktop, tabs on mobile */}
        <div className="hidden md:block relative z-20 animated-fade delay-400">
          <Card className="professional-card h-full">
            <div className="flex flex-col space-y-2">
              <h3 className="font-semibold text-lg mb-4 crypto-gradient-text">Menu Principal</h3>
              {menuItems.map((item, index) => (
                <button
                  key={item.id}
                  className={`menu-item ${activeTab === item.id ? 'menu-item-active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                  style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-crypto-blue/20 to-crypto-purple/20 group-hover:from-crypto-blue/30 group-hover:to-crypto-purple/30 transition-all duration-300">
                    {item.icon}
                  </div>
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Mobile tabs */}
        <div className="md:hidden animated-fade delay-400">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-3 glass-card border border-white/20">
              {menuItems.slice(0, 2).map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="flex flex-col items-center py-2 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-crypto-blue/20 data-[state=active]:to-crypto-purple/20"
                >
                  {item.icon}
                  <span className="mt-1">{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsList className="grid grid-cols-2 mb-3 glass-card border border-white/20">
              {menuItems.slice(2, 4).map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="flex flex-col items-center py-2 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-crypto-blue/20 data-[state=active]:to-crypto-purple/20"
                >
                  {item.icon}
                  <span className="mt-1 text-center">{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsList className="grid grid-cols-2 mb-3 glass-card border border-white/20">
              {menuItems.slice(4, 6).map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="flex flex-col items-center py-2 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-crypto-blue/20 data-[state=active]:to-crypto-purple/20"
                >
                  {item.icon}
                  <span className="mt-1 text-center">{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {/* Content area - Span 2 columns on desktop */}
        <div className="md:col-span-2 relative z-10 animated-fade delay-500">
          <Card className="professional-card">
            {/* Upload Tab */}
            {activeTab === 'upload' && <UploadProof />}
            
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
