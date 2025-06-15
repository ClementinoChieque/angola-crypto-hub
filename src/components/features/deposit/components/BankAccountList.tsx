
import React from 'react';
import { Card } from '@/components/ui/card';
import type { BankAccount } from '../types';

interface BankAccountListProps {
  accounts: BankAccount[];
  isLoading: boolean;
}

const BankAccountList: React.FC<BankAccountListProps> = ({ accounts, isLoading }) => {
  if (isLoading) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Carregando contas bancárias...
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Nenhuma conta bancária disponível.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Contas Bancárias Disponíveis</h3>
      <div className="space-y-3">
        {accounts.map((b) => (
          <Card key={b.id} className="p-4">
            <div className="flex flex-col gap-1">
              <div className="font-medium">{b.bank_name}</div>
              <div className="text-sm">Titular: {b.account_holder}</div>
              <div className="text-sm">Conta: {b.account_number}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BankAccountList;
