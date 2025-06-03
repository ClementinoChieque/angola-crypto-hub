
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { 
  Users, 
  FileText, 
  Settings, 
  CreditCard, 
  Wallet,
  AlertCircle
} from 'lucide-react';
import UserManagement from './UserManagement';
import WithdrawalRequests from './WithdrawalRequests';
import PaymentProofs from './PaymentProofs';
import BrokerAccounts from './BrokerAccounts';
import AdminSettings from './AdminSettings';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');

  const menuItems = [
    { id: 'users', label: 'Gestão de Usuários', icon: <Users size={20} /> },
    { id: 'withdrawals', label: 'Solicitações de Saque', icon: <CreditCard size={20} /> },
    { id: 'proofs', label: 'Comprovativos', icon: <FileText size={20} /> },
    { id: 'accounts', label: 'Contas da Corretora', icon: <Wallet size={20} /> },
    { id: 'settings', label: 'Configurações', icon: <Settings size={20} /> },
  ];

  return (
    <div className="container mx-auto py-6 max-w-7xl px-4">
      <div className="flex items-center gap-2 mb-6">
        <AlertCircle className="text-red-500" size={24} />
        <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6 h-auto p-1">
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
        
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="withdrawals">
          <WithdrawalRequests />
        </TabsContent>
        
        <TabsContent value="proofs">
          <PaymentProofs />
        </TabsContent>
        
        <TabsContent value="accounts">
          <BrokerAccounts />
        </TabsContent>
        
        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
