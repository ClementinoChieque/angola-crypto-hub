
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { UserBankAccountWithPhone, UserUsdtWalletWithPhone } from '../types';

export const useUserAccounts = () => {
  const [bankAccounts, setBankAccounts] = useState<UserBankAccountWithPhone[]>([]);
  const [usdtWallets, setUsdtWallets] = useState<UserUsdtWalletWithPhone[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const getUserPhone = async (userId: string): Promise<string> => {
    try {
      // Try to get phone from auth.users using the admin API
      const { data, error } = await supabase.auth.admin.getUserById(userId);
      
      if (error || !data.user?.phone) {
        // Fallback to showing shortened ID if we can't get phone
        return `User ${userId.slice(0, 8)}...`;
      }
      
      return data.user.phone;
    } catch (error) {
      console.error('Error fetching user phone:', error);
      return `User ${userId.slice(0, 8)}...`;
    }
  };

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
        // Get phone numbers for bank accounts
        const bankAccountsWithPhone = await Promise.all(
          bankData.map(async (account) => ({
            ...account,
            user_phone: await getUserPhone(account.user_id)
          }))
        );
        setBankAccounts(bankAccountsWithPhone);
      }
      
      if (walletError) {
        console.error('Error fetching USDT wallets:', walletError);
      } else if (walletData) {
        // Get phone numbers for USDT wallets
        const usdtWalletsWithPhone = await Promise.all(
          walletData.map(async (wallet) => ({
            ...wallet,
            user_phone: await getUserPhone(wallet.user_id)
          }))
        );
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
