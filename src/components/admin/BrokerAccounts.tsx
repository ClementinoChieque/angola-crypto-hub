
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BankAccount, UsdtWallet } from './broker-accounts/types';
import BankAccountsSection from './broker-accounts/BankAccountsSection';
import UsdtWalletsSection from './broker-accounts/UsdtWalletsSection';

const BrokerAccounts: React.FC = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [usdtWallets, setUsdtWallets] = useState<UsdtWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBrokerAccounts();
  }, []);

  const fetchBrokerAccounts = async () => {
    try {
      console.log('Fetching broker accounts...');
      
      // Fetch bank accounts
      const { data: bankData, error: bankError } = await supabase
        .from('broker_bank_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (bankError) {
        console.error('Error fetching bank accounts:', bankError);
      } else {
        console.log('Fetched bank accounts:', bankData);
        setBankAccounts(bankData || []);
      }

      // Fetch USDT wallets
      const { data: walletData, error: walletError } = await supabase
        .from('broker_usdt_wallets')
        .select('*')
        .order('created_at', { ascending: false });

      if (walletError) {
        console.error('Error fetching USDT wallets:', walletError);
      } else {
        console.log('Fetched USDT wallets:', walletData);
        setUsdtWallets(walletData || []);
      }

      // If no data exists, create default entries
      if ((!bankData || bankData.length === 0) && !bankError) {
        const { error: insertBankError } = await supabase
          .from('broker_bank_accounts')
          .insert({
            bank_name: 'Banco BAI',
            account_number: '123456789',
            account_holder: 'Bitget12 Angola',
            is_active: true
          });
        
        if (!insertBankError) {
          fetchBrokerAccounts(); // Refetch after insert
        }
      }

      if ((!walletData || walletData.length === 0) && !walletError) {
        const { error: insertWalletError } = await supabase
          .from('broker_usdt_wallets')
          .insert({
            wallet_address: 'TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax',
            network: 'TRC-20',
            is_active: true
          });
        
        if (!insertWalletError) {
          fetchBrokerAccounts(); // Refetch after insert
        }
      }

    } catch (error) {
      console.error('Error in fetchBrokerAccounts:', error);
      toast({
        title: "Erro ao carregar contas",
        description: "Não foi possível carregar as contas da corretora",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando contas...</p>
        </div>
      </div>
    );
  }

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
