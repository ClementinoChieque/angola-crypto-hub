
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { UserBankAccountWithPhone, UserUsdtWalletWithPhone } from '../types';

export const useUserAccounts = () => {
  const [bankAccounts, setBankAccounts] = useState<UserBankAccountWithPhone[]>([]);
  const [usdtWallets, setUsdtWallets] = useState<UserUsdtWalletWithPhone[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserAccounts = async () => {
    try {
      // Fetch user bank accounts
      const { data: bankData, error: bankError } = await supabase
        .from('user_bank_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch user USDT wallets
      const { data: walletData, error: walletError } = await supabase
        .from('user_usdt_wallets')
        .select('*')
        .order('created_at', { ascending: false });

      if (bankError) {
        console.error('Error fetching bank accounts:', bankError);
      } else if (bankData) {
        // Add user_phone as shortened user ID since we can't access phone numbers
        const bankAccountsWithPhone = bankData.map(account => ({
          ...account,
          user_phone: `User ${account.user_id.slice(0, 8)}...`
        }));
        setBankAccounts(bankAccountsWithPhone);
      }
      
      if (walletError) {
        console.error('Error fetching USDT wallets:', walletError);
      } else if (walletData) {
        // Add user_phone as shortened user ID since we can't access phone numbers
        const usdtWalletsWithPhone = walletData.map(wallet => ({
          ...wallet,
          user_phone: `User ${wallet.user_id.slice(0, 8)}...`
        }));
        setUsdtWallets(usdtWalletsWithPhone);
      }
    } catch (error) {
      console.error('Error fetching user accounts:', error);
      toast({
        title: "Erro ao carregar contas",
        description: "Não foi possível carregar as contas dos usuários",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAccounts();
  }, []);

  return {
    bankAccounts,
    setBankAccounts,
    usdtWallets,
    setUsdtWallets,
    loading,
    fetchUserAccounts
  };
};
