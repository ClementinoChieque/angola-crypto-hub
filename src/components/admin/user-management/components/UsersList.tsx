import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { UserWithReferrals, InvestmentPlan } from '../types';
import UserCard from './UserCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UsersListProps {
  users: UserWithReferrals[];
  loading: boolean;
  selectedUser: string | null;
  deletingUserId: string | null;
  rewardAmount: string;
  rewardCurrency: 'USDT' | 'AKZ'; // NOVO
  onSelectUser: (userId: string | null) => void;
  onRewardAmountChange: (amount: string) => void;
  onRewardCurrencyChange: (currency: 'USDT' | 'AKZ') => void; // NOVO
  onAddReward: (userId: string) => void;
  onToggleQuantification: (userId: string, currentStatus: boolean) => void;
  onDeleteUser: (userId: string) => void;
  investmentPlans: InvestmentPlan[];
  investmentPlanId: string | null;
  onInvestmentPlanChange: (planId: string | null) => void;
  balance: string;
  onBalanceChange: (balance: string) => void;
  dailyLimit: string;
  onDailyLimitChange: (limit: string) => void;
  onUpdateInvestment: (userId: string) => void;
}

const UsersList: React.FC<UsersListProps> = ({
  users,
  loading,
  selectedUser,
  deletingUserId,
  rewardAmount,
  rewardCurrency, // NOVO
  onSelectUser,
  onRewardAmountChange,
  onRewardCurrencyChange, // NOVO
  onAddReward,
  onToggleQuantification,
  onDeleteUser,
  investmentPlans,
  investmentPlanId,
  onInvestmentPlanChange,
  balance,
  onBalanceChange,
  dailyLimit,
  onDailyLimitChange,
  onUpdateInvestment
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={24} />
            Gestão de Usuários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando usuários...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users size={24} />
          Gestão de Usuários
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id}>
              <UserCard
                user={user}
                isSelected={selectedUser === user.id}
                isDeletingUser={deletingUserId === user.id}
                rewardAmount={rewardAmount}
                rewardCurrency={rewardCurrency} // passa moeda
                onSelectUser={() => onSelectUser(selectedUser === user.id ? null : user.id)}
                onRewardAmountChange={onRewardAmountChange}
                onRewardCurrencyChange={onRewardCurrencyChange} // novo prop
                onAddReward={onAddReward}
                onToggleQuantification={onToggleQuantification}
                onDeleteUser={onDeleteUser}
              />
               {selectedUser === user.id && (
                <div className="bg-gray-50 p-4 rounded-b-md border-t-0 border">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="investment-plan">Plano de Investimento</Label>
                        <Select
                          value={investmentPlanId || 'none'}
                          onValueChange={(value) => onInvestmentPlanChange(value === 'none' ? null : value)}
                        >
                          <SelectTrigger id="investment-plan">
                            <SelectValue placeholder="Selecione um plano" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Nenhum</SelectItem>
                            {investmentPlans.map(plan => (
                              <SelectItem key={plan.id} value={plan.id}>
                                {plan.level_name} ({plan.currency}) - {plan.investment}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="balance">Saldo de Quantificação</Label>
                        <Input
                          id="balance"
                          type="number"
                          value={balance}
                          onChange={(e) => onBalanceChange(e.target.value)}
                          placeholder="e.g., 100.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="daily-limit">Quantificações Diárias</Label>
                        <Input
                          id="daily-limit"
                          type="number"
                          value={dailyLimit}
                          onChange={(e) => onDailyLimitChange(e.target.value)}
                          placeholder="e.g., 1"
                        />
                      </div>
                   </div>
                  <Button onClick={() => onUpdateInvestment(user.id)} className="mt-4 w-full">
                    Salvar Alterações de Investimento
                  </Button>
                </div>
              )}
            </div>
          ))}

          {users.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum usuário encontrado
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersList;
