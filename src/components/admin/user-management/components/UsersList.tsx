
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { UserWithReferrals } from '../types';
import UserCard from './UserCard';

interface UsersListProps {
  users: UserWithReferrals[];
  loading: boolean;
  selectedUser: string | null;
  deletingUserId: string | null;
  rewardAmount: string;
  onSelectUser: (userId: string | null) => void;
  onRewardAmountChange: (amount: string) => void;
  onAddReward: (userId: string) => void;
  onToggleQuantification: (userId: string, currentStatus: boolean) => void;
  onDeleteUser: (userId: string) => void;
}

const UsersList: React.FC<UsersListProps> = ({
  users,
  loading,
  selectedUser,
  deletingUserId,
  rewardAmount,
  onSelectUser,
  onRewardAmountChange,
  onAddReward,
  onToggleQuantification,
  onDeleteUser
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
            <UserCard
              key={user.id}
              user={user}
              isSelected={selectedUser === user.id}
              isDeletingUser={deletingUserId === user.id}
              rewardAmount={rewardAmount}
              onSelectUser={onSelectUser}
              onRewardAmountChange={onRewardAmountChange}
              onAddReward={onAddReward}
              onToggleQuantification={onToggleQuantification}
              onDeleteUser={onDeleteUser}
            />
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
