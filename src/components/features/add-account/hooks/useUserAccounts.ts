
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { UserBankAccount, UserUsdtWallet } from '../types';

export const useUserAccounts = () => {
  const [bankAccounts, setBankAccounts] = useState<UserBankAccount[]>([]);
  const [usdtWallets, setUsdtWallets] = useState<UserUsdtWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchUserAccounts = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      // Fetch user bank accounts
      const { data: bankData, error: bankError } = await supabase
        .from('user_bank_accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch user USDT wallets
      const { data: walletData, error: walletError } = await supabase
        .from('user_usdt_wallets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (bankError) {
        console.error('Error fetching bank accounts:', bankError);
        toast({
          title: "Erro ao carregar contas bancárias",
          description: "Não foi possível carregar suas contas bancárias",
          variant: "destructive"
        });
      } else {
        setBankAccounts(bankData || []);
      }

      if (walletError) {
        console.error('Error fetching USDT wallets:', walletError);
        toast({
          title: "Erro ao carregar carteiras USDT",
          description: "Não foi possível carregar suas carteiras USDT",
          variant: "destructive"
        });
      } else {
        setUsdtWallets(walletData || []);
      }
    } catch (error) {
      console.error('Error fetching user accounts:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar suas contas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAccounts();
  }, [user?.id]);

  return {
    bankAccounts,
    usdtWallets,
    loading,
    refetch: fetchUserAccounts
  };
};
