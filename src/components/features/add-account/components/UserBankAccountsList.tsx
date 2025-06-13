
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { UserBankAccount } from '../types';

interface UserBankAccountsListProps {
  bankAccounts: UserBankAccount[];
  loading: boolean;
}

const UserBankAccountsList: React.FC<UserBankAccountsListProps> = ({
  bankAccounts,
  loading
}) => {
  const isMobile = useIsMobile();

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <CreditCard size={isMobile ? 18 : 20} />
            Suas Contas Bancárias
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
          <CreditCard size={isMobile ? 18 : 20} />
          <span>Suas Contas Bancárias ({bankAccounts.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bankAccounts.length > 0 ? (
          <div className="space-y-3">
            {bankAccounts.map((account) => (
              <div key={account.id} className="border rounded-lg p-3 sm:p-4 bg-gray-50">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm sm:text-base truncate">
                      {account.account_holder}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">
                      <div className="truncate">Banco: {account.bank_name}</div>
                      <div className="truncate">Conta: {account.account_number}</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Adicionado: {new Date(account.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <Badge variant="default" className="text-xs shrink-0">
                    {account.currency}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <p className="text-sm sm:text-base">Nenhuma conta bancária adicionada ainda</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserBankAccountsList;
