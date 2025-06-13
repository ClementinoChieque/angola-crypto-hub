
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { useAccountApproval } from './hooks/useAccountApproval';
import { useUserAccounts } from './hooks/useUserAccounts';
import BankAccountForm from './components/BankAccountForm';
import UsdtWalletForm from './components/UsdtWalletForm';
import UserBankAccountsList from './components/UserBankAccountsList';
import UserUsdtWalletsList from './components/UserUsdtWalletsList';
import ApprovalRequired from './components/ApprovalRequired';
import LoadingState from './components/LoadingState';

const AddAccountContainer: React.FC = () => {
  const { isAccountApproved, loading: approvalLoading } = useAccountApproval();
  const { bankAccounts, usdtWallets, loading: accountsLoading, refetch } = useUserAccounts();

  if (approvalLoading) {
    return <LoadingState />;
  }

  if (!isAccountApproved) {
    return <ApprovalRequired />;
  }

  const handleAccountAdded = () => {
    refetch();
  };

  const hasExistingBankAccount = bankAccounts.length > 0;
  const hasExistingUsdtWallet = usdtWallets.length > 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus size={24} />
            Adicionar Nova Conta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="akz" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="akz">AKZ (Conta Bancária)</TabsTrigger>
              <TabsTrigger value="usdt">USDT (Carteira)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="akz" className="mt-4">
              <BankAccountForm 
                onSuccess={handleAccountAdded} 
                hasExistingAccount={hasExistingBankAccount}
              />
            </TabsContent>
            
            <TabsContent value="usdt" className="mt-4">
              <UsdtWalletForm 
                onSuccess={handleAccountAdded} 
                hasExistingWallet={hasExistingUsdtWallet}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Lista das contas existentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UserBankAccountsList 
          bankAccounts={bankAccounts} 
          loading={accountsLoading} 
        />
        <UserUsdtWalletsList 
          usdtWallets={usdtWallets} 
          loading={accountsLoading} 
        />
      </div>
    </div>
  );
};

export default AddAccountContainer;
