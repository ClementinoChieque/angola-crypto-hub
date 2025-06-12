
import React, { useState } from 'react';
import { useUsers } from './user-management/hooks/useUsers';
import { useReferralRewards } from './user-management/hooks/useReferralRewards';
import { useUserActions } from './user-management/hooks/useUserActions';
import UsersList from './user-management/components/UsersList';
import ReferralRewardsList from './user-management/components/ReferralRewardsList';

const UserManagement: React.FC = () => {
  const [rewardAmount, setRewardAmount] = useState('10');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const { users, loading, refetchUsers } = useUsers();
  const { referralRewards, addReferralReward, refetchReferralRewards } = useReferralRewards();
  const { toggleQuantification, deleteUser, deletingUserId } = useUserActions();

  const handleAddReward = async (userId: string) => {
    const amount = parseFloat(rewardAmount);
    const success = await addReferralReward(userId, amount);
    if (success) {
      setSelectedUser(null);
    }
  };

  const handleToggleQuantification = async (userId: string, currentStatus: boolean) => {
    const success = await toggleQuantification(userId, currentStatus);
    if (success) {
      await refetchUsers();
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const success = await deleteUser(userId);
    if (success) {
      await refetchUsers();
      await refetchReferralRewards();
    }
  };

  return (
    <div className="space-y-6">
      <UsersList
        users={users}
        loading={loading}
        selectedUser={selectedUser}
        deletingUserId={deletingUserId}
        rewardAmount={rewardAmount}
        onSelectUser={setSelectedUser}
        onRewardAmountChange={setRewardAmount}
        onAddReward={handleAddReward}
        onToggleQuantification={handleToggleQuantification}
        onDeleteUser={handleDeleteUser}
      />

      <ReferralRewardsList referralRewards={referralRewards} />
    </div>
  );
};

export default UserManagement;
