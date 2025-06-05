
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { UsdtWallet } from './types';

interface UsdtWalletsListProps {
  wallets: UsdtWallet[];
  onEdit: (wallet: UsdtWallet) => void;
  onDelete: (id: string) => void;
}

const UsdtWalletsList: React.FC<UsdtWalletsListProps> = ({
  wallets,
  onEdit,
  onDelete
}) => {
  return (
    <div className="space-y-3">
      {wallets.map((wallet) => (
        <div key={wallet.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded gap-2">
          <div className="flex-1">
            <div className="font-medium font-mono text-sm break-all">{wallet.wallet_address}</div>
            <div className="text-sm text-gray-500">{wallet.network}</div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={wallet.is_active ? 'default' : 'secondary'}>
              {wallet.is_active ? 'Ativa' : 'Inativa'}
            </Badge>
            <Button size="sm" variant="outline" onClick={() => onEdit(wallet)}>
              <Edit size={14} />
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(wallet.id)}>
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsdtWalletsList;
