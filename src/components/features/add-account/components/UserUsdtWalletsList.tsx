
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet } from 'lucide-react';
import type { UserUsdtWallet } from '../types';

interface UserUsdtWalletsListProps {
  usdtWallets: UserUsdtWallet[];
  loading: boolean;
}

const UserUsdtWalletsList: React.FC<UserUsdtWalletsListProps> = ({
  usdtWallets,
  loading
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet size={20} />
            Suas Carteiras USDT
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet size={20} />
          Suas Carteiras USDT ({usdtWallets.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {usdtWallets.length > 0 ? (
          <div className="space-y-3">
            {usdtWallets.map((wallet) => (
              <div key={wallet.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium font-mono text-sm break-all">
                      {wallet.wallet_address}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Rede: {wallet.network}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Adicionado: {new Date(wallet.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <Badge variant="default">USDT</Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhuma carteira USDT adicionada ainda
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserUsdtWalletsList;
