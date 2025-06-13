
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { UserUsdtWallet } from '../types';

interface UserUsdtWalletsListProps {
  usdtWallets: UserUsdtWallet[];
  loading: boolean;
}

const UserUsdtWalletsList: React.FC<UserUsdtWalletsListProps> = ({
  usdtWallets,
  loading
}) => {
  const isMobile = useIsMobile();

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Wallet size={isMobile ? 18 : 20} />
            Suas Carteiras USDT
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-16 sm:h-20 bg-gray-200 rounded"></div>
            <div className="h-16 sm:h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Wallet size={isMobile ? 18 : 20} />
          <span>Suas Carteiras USDT ({usdtWallets.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {usdtWallets.length > 0 ? (
          <div className="space-y-3">
            {usdtWallets.map((wallet) => (
              <div key={wallet.id} className="border rounded-lg p-3 sm:p-4 bg-gray-50">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium font-mono text-xs sm:text-sm break-all">
                      {wallet.wallet_address}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">
                      Rede: {wallet.network}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Adicionado: {new Date(wallet.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <Badge variant="default" className="text-xs shrink-0">
                    USDT
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <p className="text-sm sm:text-base">Nenhuma carteira USDT adicionada ainda</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserUsdtWalletsList;
