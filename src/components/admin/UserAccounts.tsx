
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Wallet } from 'lucide-react';
import type { UserBankAccount, UserUsdtWallet } from '../features/add-account/types';

interface UserBankAccountWithPhone extends UserBankAccount {
  user_phone?: string;
}

interface UserUsdtWalletWithPhone extends UserUsdtWallet {
  user_phone?: string;
}

const UserAccounts: React.FC = () => {
  const [bankAccounts, setBankAccounts] = useState<UserBankAccountWithPhone[]>([]);
  const [usdtWallets, setUsdtWallets] = useState<UserUsdtWalletWithPhone[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserAccounts();
  }, []);

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

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando contas dos usuários...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bank Accounts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard size={24} />
            Contas Bancárias dos Usuários (AKZ)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bankAccounts.length > 0 ? (
            <div className="space-y-3">
              {bankAccounts.map((account) => (
                <div key={account.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium">{account.account_holder}</div>
                      <div className="text-sm text-gray-600">
                        Banco: {account.bank_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        Conta: {account.account_number}
                      </div>
                      <div className="text-xs text-gray-500">
                        Usuário: {account.user_phone}
                      </div>
                      <div className="text-xs text-gray-500">
                        Adicionado: {new Date(account.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant="default">{account.currency}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhuma conta bancária encontrada
            </div>
          )}
        </CardContent>
      </Card>

      {/* USDT Wallets Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet size={24} />
            Carteiras USDT dos Usuários
          </CardTitle>
        </CardHeader>
        <CardContent>
          {usdtWallets.length > 0 ? (
            <div className="space-y-3">
              {usdtWallets.map((wallet) => (
                <div key={wallet.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium font-mono text-sm break-all">
                        {wallet.wallet_address}
                      </div>
                      <div className="text-sm text-gray-600">
                        Rede: {wallet.network}
                      </div>
                      <div className="text-xs text-gray-500">
                        Usuário: {wallet.user_phone}
                      </div>
                      <div className="text-xs text-gray-500">
                        Adicionado: {new Date(wallet.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant="default">USDT</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhuma carteira USDT encontrada
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAccounts;
