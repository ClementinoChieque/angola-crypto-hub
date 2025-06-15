
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gift, Zap, Trash2 } from 'lucide-react';
import { UserWithReferrals } from '../types';

interface UserCardProps {
  user: UserWithReferrals;
  isSelected: boolean;
  isDeletingUser: boolean;
  rewardAmount: string;
  // Remover rewardCurrency
  onSelectUser: (userId: string | null) => void;
  onRewardAmountChange: (amount: string) => void;
  onAddReward: (userId: string) => void;
  onToggleQuantification: (userId: string, currentStatus: boolean) => void;
  onDeleteUser: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  isSelected,
  isDeletingUser,
  rewardAmount,
  onSelectUser,
  onRewardAmountChange,
  onAddReward,
  onToggleQuantification,
  onDeleteUser
}) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-medium">{user.phone}</div>
          <div className="text-sm text-gray-500">
            Registrado: {new Date(user.created_at).toLocaleDateString()}
          </div>
          <div className="text-sm text-gray-500">
            Convites: {user.referral_count}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant={user.quantification_active ? 'default' : 'secondary'}>
            <Zap size={14} className="mr-1" />
            {user.quantification_active ? 'Quantificação Ativa' : 'Quantificação Inativa'}
          </Badge>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onSelectUser(user.id)}
        >
          <Gift size={16} className="mr-1" />
          Adicionar Recompensa
        </Button>
        <Button
          size="sm"
          variant={user.quantification_active ? "destructive" : "default"}
          onClick={() => onToggleQuantification(user.id, user.quantification_active)}
        >
          <Zap size={16} className="mr-1" />
          {user.quantification_active ? 'Desativar' : 'Ativar'} Quantificação
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDeleteUser(user.id)}
          disabled={isDeletingUser}
        >
          <Trash2 size={16} className="mr-1" />
          {isDeletingUser ? 'Eliminando...' : 'Eliminar Usuário'}
        </Button>
      </div>

      {isSelected && (
        <div className="mt-4 p-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reward_amount_usdt">Valor da Recompensa (USDT)</Label>
              <Input
                id="reward_amount_usdt"
                type="number"
                value={rewardAmount}
                onChange={(e) => onRewardAmountChange(e.target.value)}
                placeholder="10.00 (USDT)"
                min={0}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              onClick={() => onAddReward(user.id)}
            >
              Confirmar Recompensa em USDT
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSelectUser(null)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;
