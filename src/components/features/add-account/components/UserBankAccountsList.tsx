
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard } from 'lucide-react';
import type { UserBankAccount } from '../types';

interface UserBankAccountsListProps {
  bankAccounts: UserBankAccount[];
  loading: boolean;
}

const UserBankAccountsList: React.FC<UserBankAccountsListProps> = ({
  bankAccounts,
  loading
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard size={20} />
            Suas Contas Bancárias
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
          <CreditCard size={20} />
          Suas Contas Bancárias ({bankAccounts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bankAccounts.length > 0 ? (
          <div className="space-y-3">
            {bankAccounts.map((account) => (
              <div key={account.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium">{account.account_holder}</div>
                    <div className="text-sm text-gray-600">
                      Banco: {account.bank_name}
                    </div>
                    <div className="text-sm text-gray-600">
                      Conta: {account.account_number}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Adicionado: {new Date(account.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <Badge variant="default">{account.currency}</Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhuma conta bancária adicionada ainda
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserBankAccountsList;
