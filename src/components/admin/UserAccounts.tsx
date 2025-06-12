
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Wallet } from 'lucide-react';

interface UserBankAccount {
  id: string;
  user_id: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  currency: string;
  created_at: string;
}

interface UserUsdtWallet {
  id: string;
  user_id: string;
  wallet_address: string;
  network: string;
  created_at: string;
}

const UserAccounts: React.FC = () => {
  const [bankAccounts, setBankAccounts] = useState<UserBankAccount[]>([]);
  const [usdtWallets, setUsdtWallets] = useState<UserUsdtWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserAccounts();
  }, []);

  const fetchUserAccounts = async () => {
    try {
      // Fetch user bank accounts using direct query
      const bankQuery = supabase
        .from('user_bank_accounts' as any)
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch user USDT wallets using direct query
      const walletQuery = supabase
        .from('user_usdt_wallets' as any)
        .select('*')
        .order('created_at', { ascending: false });

      const [bankResult, walletResult] = await Promise.all([
        bankQuery,
        walletQuery
      ]);

      if (bankResult.error) {
        console.error('Error fetching bank accounts:', bankResult.error);
      } else if (bankResult.data) {
        setBankAccounts(bankResult.data as UserBankAccount[]);
      }
      
      if (walletResult.error) {
        console.error('Error fetching USDT wallets:', walletResult.error);
      } else if (walletResult.data) {
        setUsdtWallets(walletResult.data as UserUsdtWallet[]);
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
                        ID do Usuário: {account.user_id.slice(0, 8)}...
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
                        ID do Usuário: {wallet.user_id.slice(0, 8)}...
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
