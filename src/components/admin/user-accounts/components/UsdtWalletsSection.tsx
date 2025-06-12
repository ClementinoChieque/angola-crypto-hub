
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';
import UsdtWalletCard from './UsdtWalletCard';
import type { UserUsdtWalletWithPhone } from '../types';

interface UsdtWalletsSectionProps {
  usdtWallets: UserUsdtWalletWithPhone[];
  onDeleteWallet: (walletId: string) => void;
  deletingId: string | null;
}

const UsdtWalletsSection: React.FC<UsdtWalletsSectionProps> = ({
  usdtWallets,
  onDeleteWallet,
  deletingId
}) => {
  return (
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
              <UsdtWalletCard
                key={wallet.id}
                wallet={wallet}
                onDelete={onDeleteWallet}
                isDeleting={deletingId === wallet.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhuma carteira USDT encontrada
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsdtWalletsSection;
