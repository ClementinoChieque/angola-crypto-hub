
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { BankAccount } from './types';

interface BankAccountsListProps {
  accounts: BankAccount[];
  onEdit: (account: BankAccount) => void;
  onDelete: (id: string) => void;
}

const BankAccountsList: React.FC<BankAccountsListProps> = ({
  accounts,
  onEdit,
  onDelete
}) => {
  return (
    <div className="space-y-3">
      {accounts.map((account) => (
        <div key={account.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded gap-2">
          <div className="flex-1">
            <div className="font-medium">{account.bank_name}</div>
            <div className="text-sm text-gray-500">
              {account.account_holder} - {account.account_number}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={account.is_active ? 'default' : 'secondary'}>
              {account.is_active ? 'Ativa' : 'Inativa'}
            </Badge>
            <Button size="sm" variant="outline" onClick={() => onEdit(account)}>
              <Edit size={14} />
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(account.id)}>
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BankAccountsList;
