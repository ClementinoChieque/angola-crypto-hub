
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { 
  Users, 
  FileText, 
  Settings, 
  CreditCard, 
  Wallet,
  AlertCircle,
  UserCheck,
  PiggyBank
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Import components individually to avoid bundling issues
import UserManagement from './UserManagement';
import WithdrawalRequests from './WithdrawalRequests';
import PaymentProofs from './PaymentProofs';
import BrokerAccounts from './BrokerAccounts';
import AdminSettings from './AdminSettings';
import UserAccounts from './UserAccounts';
import UserDeposits from './UserDeposits';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const isMobile = useIsMobile();

  const menuItems = [
    { id: 'users', label: 'Gestão de Usuários', shortLabel: 'Usuários', icon: <Users size={20} /> },
    { id: 'user-accounts', label: 'Contas Users', shortLabel: 'Contas Users', icon: <UserCheck size={20} /> },
    { id: 'deposits', label: 'Depósitos Users', shortLabel: 'Depósitos', icon: <PiggyBank size={20} /> },
    { id: 'withdrawals', label: 'Solicitações de Saque', shortLabel: 'Saques', icon: <CreditCard size={20} /> },
    { id: 'proofs', label: 'Comprovativos', shortLabel: 'Comprovativos', icon: <FileText size={20} /> },
    { id: 'accounts', label: 'Contas da Corretora', shortLabel: 'Contas', icon: <Wallet size={20} /> },
    { id: 'settings', label: 'Configurações', shortLabel: 'Config', icon: <Settings size={20} /> },
  ];

  // Error boundary component for debugging
  const ErrorBoundary = ({ children, tabName }: { children: React.ReactNode, tabName: string }) => {
    try {
      return <>{children}</>;
    } catch (error) {
      console.error(`Error in ${tabName}:`, error);
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar {tabName}</h3>
            <p className="text-gray-600">Verifique o console para mais detalhes</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto py-4 md:py-6 max-w-7xl px-2 md:px-4">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <AlertCircle className="text-red-500" size={24} />
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Painel Administrativo</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Mobile layout - 4 rows for 7 items */}
        {isMobile ? (
          <div className="space-y-2 mb-6">
            <TabsList className="grid grid-cols-2 h-auto p-1 w-full">
              {menuItems.slice(0, 2).map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="flex flex-col items-center gap-1 py-2 text-xs font-medium min-h-[60px]"
                >
                  {item.icon}
                  <span className="text-center leading-tight">{item.shortLabel}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsList className="grid grid-cols-2 h-auto p-1 w-full">
              {menuItems.slice(2, 4).map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="flex flex-col items-center gap-1 py-2 text-xs font-medium min-h-[60px]"
                >
                  {item.icon}
                  <span className="text-center leading-tight">{item.shortLabel}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsList className="grid grid-cols-2 h-auto p-1 w-full">
              {menuItems.slice(4, 6).map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="flex flex-col items-center gap-1 py-2 text-xs font-medium min-h-[60px]"
                >
                  {item.icon}
                  <span className="text-center leading-tight">{item.shortLabel}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsList className="grid grid-cols-1 h-auto p-1 w-full">
              {menuItems.slice(6, 7).map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="flex flex-col items-center gap-1 py-2 text-xs font-medium min-h-[60px]"
                >
                  {item.icon}
                  <span className="text-center leading-tight">{item.shortLabel}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        ) : (
          /* Desktop layout */
          <TabsList className="grid grid-cols-7 mb-6 h-auto p-1">
            {menuItems.map((item) => (
              <TabsTrigger
                key={item.id}
                value={item.id}
                className="flex flex-col items-center gap-2 py-3 text-xs font-medium"
              >
                {item.icon}
                <span className="text-center">{item.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        )}
        
        <TabsContent value="users" className="mt-0">
          <ErrorBoundary tabName="Gestão de Usuários">
            <UserManagement />
          </ErrorBoundary>
        </TabsContent>
        
        <TabsContent value="user-accounts" className="mt-0">
          <ErrorBoundary tabName="Contas Users">
            <UserAccounts />
          </ErrorBoundary>
        </TabsContent>
        
        <TabsContent value="deposits" className="mt-0">
          <ErrorBoundary tabName="Depósitos Users">
            <UserDeposits />
          </ErrorBoundary>
        </TabsContent>
        
        <TabsContent value="withdrawals" className="mt-0">
          <ErrorBoundary tabName="Solicitações de Saque">
            <WithdrawalRequests />
          </ErrorBoundary>
        </TabsContent>
        
        <TabsContent value="proofs" className="mt-0">
          <ErrorBoundary tabName="Comprovativos">
            <PaymentProofs />
          </ErrorBoundary>
        </TabsContent>
        
        <TabsContent value="accounts" className="mt-0">
          <ErrorBoundary tabName="Contas da Corretora">
            <BrokerAccounts />
          </ErrorBoundary>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0">
          <ErrorBoundary tabName="Configurações">
            <AdminSettings />
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
