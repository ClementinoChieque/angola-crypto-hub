
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { UserUsdtWalletWithPhone } from '../types';

interface UsdtWalletCardProps {
  wallet: UserUsdtWalletWithPhone;
  onDelete: (walletId: string) => void;
  isDeleting: boolean;
}

const UsdtWalletCard: React.FC<UsdtWalletCardProps> = ({ 
  wallet, 
  onDelete, 
  isDeleting 
}) => {
  return (
    <div className="border rounded-lg p-4">
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
        <div className="flex items-center gap-2">
          <Badge variant="default">USDT</Badge>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(wallet.id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <Trash2 size={16} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UsdtWalletCard;
