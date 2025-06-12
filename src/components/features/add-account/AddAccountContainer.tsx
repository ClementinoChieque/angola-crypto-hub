
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { useAccountApproval } from './hooks/useAccountApproval';
import BankAccountForm from './components/BankAccountForm';
import UsdtWalletForm from './components/UsdtWalletForm';
import ApprovalRequired from './components/ApprovalRequired';
import LoadingState from './components/LoadingState';

const AddAccountContainer: React.FC = () => {
  const { isAccountApproved, loading } = useAccountApproval();

  if (loading) {
    return <LoadingState />;
  }

  if (!isAccountApproved) {
    return <ApprovalRequired />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus size={24} />
          Adicionar Conta
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="akz" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="akz">AKZ (Conta Bancária)</TabsTrigger>
            <TabsTrigger value="usdt">USDT (Carteira)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="akz" className="mt-4">
            <BankAccountForm />
          </TabsContent>
          
          <TabsContent value="usdt" className="mt-4">
            <UsdtWalletForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AddAccountContainer;
