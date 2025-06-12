
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { UserBankAccountWithPhone } from '../types';

interface BankAccountCardProps {
  account: UserBankAccountWithPhone;
  onDelete: (accountId: string) => void;
  isDeleting: boolean;
}

const BankAccountCard: React.FC<BankAccountCardProps> = ({ 
  account, 
  onDelete, 
  isDeleting 
}) => {
  return (
    <div className="border rounded-lg p-4">
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
        <div className="flex items-center gap-2">
          <Badge variant="default">{account.currency}</Badge>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(account.id)}
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

export default BankAccountCard;
