
import React, { useState } from 'react';
import { 
  Upload, 
  Circle, 
  UserPlus 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/context/UserContext';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import UploadProof from '../features/UploadProof';
import Quantify from '../features/Quantify';
import InviteUsers from '../features/InviteUsers';
import CryptoRates from '../features/CryptoRates';
import CryptoChart from '../features/CryptoChart';
import BalanceStatus from '../features/BalanceStatus';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const { user } = useAuth();
  const { isDepositVerified } = useUser();
  const isMobile = useIsMobile();
  
  const menuItems = [
    { id: 'upload', label: 'Upload Comprovativo', icon: <Upload size={isMobile ? 16 : 20} /> },
    { id: 'quantify', label: 'Quantificar', icon: <Circle size={isMobile ? 16 : 20} /> },
    { id: 'invite', label: 'Convidar', icon: <UserPlus size={isMobile ? 16 : 20} /> },
  ];

  return (
    <div className="container mx-auto py-2 md:py-6 max-w-4xl px-2 md:px-4">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Bem-vindo, {user?.phoneNumber}</h1>
      
      {/* Balance Status Component */}
      <BalanceStatus />
      
      {/* Top section with crypto rates and chart - hide chart on smaller screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 mb-3 md:mb-6">
        <CryptoRates />
        {!isMobile && <CryptoChart />}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        {/* Menu sidebar on desktop, tabs on mobile */}
        <div className="hidden md:block">
          <Card className="p-4 h-full">
            <div className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`menu-item ${activeTab === item.id ? 'menu-item-active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Mobile tabs - optimized with smaller padding */}
        <div className="md:hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-3">
              {menuItems.map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="flex flex-col items-center py-1.5 text-xs"
                >
                  {item.icon}
                  <span className="mt-1">{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {/* Content area - Span 2 columns on desktop */}
        <div className="md:col-span-2">
          <Card className="p-3 md:p-6">
            {/* Upload Tab */}
            {activeTab === 'upload' && <UploadProof />}
            
            {/* Quantify Tab */}
            {activeTab === 'quantify' && <Quantify />}
            
            {/* Invite Tab */}
            {activeTab === 'invite' && <InviteUsers />}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
