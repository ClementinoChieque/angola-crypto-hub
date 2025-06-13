
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAccountApproval } from './hooks/useAccountApproval';
import { useUserAccounts } from './hooks/useUserAccounts';
import BankAccountForm from './components/BankAccountForm';
import UsdtWalletForm from './components/UsdtWalletForm';
import UserBankAccountsList from './components/UserBankAccountsList';
import UserUsdtWalletsList from './components/UserUsdtWalletsList';
import ApprovalRequired from './components/ApprovalRequired';
import LoadingState from './components/LoadingState';

const AddAccountContainer: React.FC = () => {
  const isMobile = useIsMobile();
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
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      <Card>
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Plus size={isMobile ? 20 : 24} />
            Adicionar Nova Conta
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs defaultValue="akz" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-auto">
              <TabsTrigger 
                value="akz" 
                className="text-xs sm:text-sm py-2 px-2 sm:px-3 data-[state=active]:bg-background"
              >
                <span className="hidden sm:inline">AKZ (Conta Bancária)</span>
                <span className="sm:hidden">AKZ</span>
              </TabsTrigger>
              <TabsTrigger 
                value="usdt" 
                className="text-xs sm:text-sm py-2 px-2 sm:px-3 data-[state=active]:bg-background"
              >
                <span className="hidden sm:inline">USDT (Carteira)</span>
                <span className="sm:hidden">USDT</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="akz" className="mt-4 sm:mt-6">
              <BankAccountForm 
                onSuccess={handleAccountAdded} 
                hasExistingAccount={hasExistingBankAccount}
              />
            </TabsContent>
            
            <TabsContent value="usdt" className="mt-4 sm:mt-6">
              <UsdtWalletForm 
                onSuccess={handleAccountAdded} 
                hasExistingWallet={hasExistingUsdtWallet}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Lista das contas existentes */}
      <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-2 sm:gap-6">
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
