
import React from 'react';
import { Card } from '@/components/ui/card';
import type { UsdtWallet } from '../types';

interface UsdtWalletListProps {
  wallets: UsdtWallet[];
  isLoading: boolean;
}

const UsdtWalletList: React.FC<UsdtWalletListProps> = ({ wallets, isLoading }) => {
  if (isLoading) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Carregando carteiras...
      </div>
    );
  }

  if (wallets.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Nenhuma carteira USDT disponível.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Carteiras USDT Disponíveis</h3>
      <div className="space-y-3">
        {wallets.map((wallet) => (
          <Card key={wallet.id} className="p-4">
            <div>
              <div className="text-sm mb-1">
                Rede: <span className="font-semibold">{wallet.network}</span>
              </div>
              <div className="font-mono break-all text-base bg-gray-100 rounded p-2">
                {wallet.wallet_address}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UsdtWalletList;
