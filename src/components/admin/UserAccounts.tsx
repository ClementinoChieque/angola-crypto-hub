
import React from 'react';
import { useUserAccounts } from './user-accounts/hooks/useUserAccounts';
import { useDeleteAccount } from './user-accounts/hooks/useDeleteAccount';
import BankAccountsSection from './user-accounts/components/BankAccountsSection';
import UsdtWalletsSection from './user-accounts/components/UsdtWalletsSection';
import LoadingState from './user-accounts/components/LoadingState';

const UserAccounts: React.FC = () => {
  const {
    bankAccounts,
    setBankAccounts,
    usdtWallets,
    setUsdtWallets,
    loading
  } = useUserAccounts();

  const { deletingId, deleteBankAccount, deleteUsdtWallet } = useDeleteAccount();

  const handleDeleteBankAccount = (accountId: string) => {
    deleteBankAccount(accountId, (id) => {
      setBankAccounts(prev => prev.filter(account => account.id !== id));
    });
  };

  const handleDeleteUsdtWallet = (walletId: string) => {
    deleteUsdtWallet(walletId, (id) => {
      setUsdtWallets(prev => prev.filter(wallet => wallet.id !== id));
    });
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <BankAccountsSection
        bankAccounts={bankAccounts}
        onDeleteAccount={handleDeleteBankAccount}
        deletingId={deletingId}
      />
      <UsdtWalletsSection
        usdtWallets={usdtWallets}
        onDeleteWallet={handleDeleteUsdtWallet}
        deletingId={deletingId}
      />
    </div>
  );
};

export default UserAccounts;
