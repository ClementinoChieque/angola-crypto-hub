
import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUp, 
  ArrowDown, 
  CircleDollarSign, 
  Upload, 
  Circle, 
  UserPlus 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/context/UserContext';
import { useAuth } from '@/context/AuthContext';
import DepositOptions from '../features/DepositOptions';
import WithdrawalOptions from '../features/WithdrawalOptions';
import UploadProof from '../features/UploadProof';
import Quantify from '../features/Quantify';
import InviteUsers from '../features/InviteUsers';
import CryptoRates from '../features/CryptoRates';
import CryptoChart from '../features/CryptoChart';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('balance');
  const { user } = useAuth();
  const { balance, isDepositVerified } = useUser();

  const menuItems = [
    { id: 'balance', label: 'Ver Saldo', icon: <Wallet size={20} /> },
    { id: 'deposit', label: 'Deposito', icon: <ArrowUp size={20} /> },
    { id: 'withdrawal', label: 'Saque', icon: <ArrowDown size={20} /> },
    { id: 'invest', label: 'Investir', icon: <CircleDollarSign size={20} />, disabled: !isDepositVerified },
    { id: 'upload', label: 'Upload Comprovativo', icon: <Upload size={20} /> },
    { id: 'quantify', label: 'Quantificar', icon: <Circle size={20} /> },
    { id: 'invite', label: 'Convidar', icon: <UserPlus size={20} /> },
  ];

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Bem-vindo, {user?.phoneNumber}</h1>
      
      {/* Top section with crypto rates and chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <CryptoRates />
        <CryptoChart />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Menu sidebar on desktop, tabs on mobile */}
        <div className="hidden md:block">
          <Card className="p-4 h-full">
            <div className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`menu-item ${activeTab === item.id ? 'menu-item-active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                  disabled={item.disabled}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Mobile tabs */}
        <div className="md:hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              {menuItems.slice(0, 4).map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  disabled={item.disabled}
                  className="flex flex-col items-center py-2 text-xs"
                >
                  {item.icon}
                  <span className="mt-1">{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsList className="grid grid-cols-3 mb-4">
              {menuItems.slice(4).map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  disabled={item.disabled}
                  className="flex flex-col items-center py-2 text-xs"
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
          <Card className="p-6">
            {/* Balance Tab */}
            {activeTab === 'balance' && (
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">Seu Saldo</h2>
                <div className="text-4xl font-bold text-crypto-blue">
                  {balance.amount.toLocaleString()} {balance.currency}
                </div>
                <p className="mt-4 text-muted-foreground">
                  {isDepositVerified 
                    ? "Seu depósito foi verificado. Você pode investir agora!" 
                    : "Aguardando verificação do depósito pelo administrador."}
                </p>
              </div>
            )}
            
            {/* Deposit Tab */}
            {activeTab === 'deposit' && <DepositOptions />}
            
            {/* Withdrawal Tab */}
            {activeTab === 'withdrawal' && <WithdrawalOptions />}
            
            {/* Invest Tab */}
            {activeTab === 'invest' && (
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">Investir</h2>
                <p>Opções de investimento disponíveis</p>
                {/* Investment options would go here */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <Card className="p-4 text-left hover:bg-muted/50 cursor-pointer transition-colors">
                    <h3 className="font-medium">Cripto Staking</h3>
                    <p className="text-sm text-muted-foreground">Rentabilidade até 12% ao ano</p>
                  </Card>
                  <Card className="p-4 text-left hover:bg-muted/50 cursor-pointer transition-colors">
                    <h3 className="font-medium">Trading Automatizado</h3>
                    <p className="text-sm text-muted-foreground">Rentabilidade variável</p>
                  </Card>
                </div>
              </div>
            )}
            
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
