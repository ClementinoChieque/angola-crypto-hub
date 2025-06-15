import React, { useState } from 'react';
import { 
  Upload, 
  Circle, 
  UserPlus,
  Users,
  TrendingUp,
  Plus,
  Send
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
import DashboardMenu from './DashboardMenu';
import DashboardTabsMobile from './DashboardTabsMobile';
import DashboardContent from './DashboardContent';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('quantify');
  const { user } = useAuth();
  const { isDepositVerified } = useUser();
  const isMobile = useIsMobile();
  
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
      <div className="absolute inset-0 bg-black/50 -z-10"></div>
      
      <div className="mb-6 md:mb-8 relative z-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white drop-shadow-lg">
          Bem-vindo, {user?.phoneNumber}
        </h1>
        <p className="text-white/90 drop-shadow-md">
          Gerencie seus investimentos e maximize seus lucros
        </p>
      </div>
      
      <div className="mb-6 relative z-10">
        <BalanceStatus />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-12 relative z-10">
        <div>
          <CryptoRates />
        </div>
        <div>
          <CryptoChart />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-16 relative z-10">
        {/* Menu sidebar on desktop */}
        <div className="hidden md:block">
          <DashboardMenu activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        {/* Tabs on mobile */}
        <div className="md:hidden">
          <DashboardTabsMobile activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        {/* Content area */}
        <div className="md:col-span-2">
          <DashboardContent activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
