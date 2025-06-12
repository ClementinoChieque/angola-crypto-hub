
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import BankAccountCard from './BankAccountCard';
import type { UserBankAccountWithPhone } from '../types';

interface BankAccountsSectionProps {
  bankAccounts: UserBankAccountWithPhone[];
  onDeleteAccount: (accountId: string) => void;
  deletingId: string | null;
}

const BankAccountsSection: React.FC<BankAccountsSectionProps> = ({
  bankAccounts,
  onDeleteAccount,
  deletingId
}) => {
  return (
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
              <BankAccountCard
                key={account.id}
                account={account}
                onDelete={onDeleteAccount}
                isDeleting={deletingId === account.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhuma conta bancária encontrada
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BankAccountsSection;
