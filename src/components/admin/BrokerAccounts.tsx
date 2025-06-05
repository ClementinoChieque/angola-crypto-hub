
import React, { useState } from 'react';
import { BankAccount, UsdtWallet } from './broker-accounts/types';
import BankAccountsSection from './broker-accounts/BankAccountsSection';
import UsdtWalletsSection from './broker-accounts/UsdtWalletsSection';

const BrokerAccounts: React.FC = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      bank_name: 'Banco BAI',
      account_number: '123456789',
      account_holder: 'Bitget12 Angola',
      is_active: true,
      created_at: new Date().toISOString()
    }
  ]);
  
  const [usdtWallets, setUsdtWallets] = useState<UsdtWallet[]>([
    {
      id: '1',
      wallet_address: 'TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax',
      network: 'TRC-20',
      is_active: true,
      created_at: new Date().toISOString()
    }
  ]);

  return (
    <div className="space-y-6">
      <BankAccountsSection 
        accounts={bankAccounts}
        onAccountsChange={setBankAccounts}
      />
      <UsdtWalletsSection 
        wallets={usdtWallets}
        onWalletsChange={setUsdtWallets}
      />
    </div>
  );
};

export default BrokerAccounts;
