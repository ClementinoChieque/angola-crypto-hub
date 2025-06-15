
import React, { useState, useEffect } from 'react';
import { useUsers } from './user-management/hooks/useUsers';
import { useReferralRewards } from './user-management/hooks/useReferralRewards';
import { useUserActions } from './user-management/hooks/useUserActions';
import UsersList from './user-management/components/UsersList';
import ReferralRewardsList from './user-management/components/ReferralRewardsList';
import { useInvestmentPlans } from './user-management/hooks/useInvestmentPlans';
import { UserWithReferrals } from './user-management/types';

const UserManagement: React.FC = () => {
  const [rewardAmount, setRewardAmount] = useState('10');
  // Remover rewardCurrency
  const [selectedUser, setSelectedUser] = useState<UserWithReferrals | null>(null);
  
  const [investmentPlanId, setInvestmentPlanId] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('');
  const [dailyLimit, setDailyLimit] = useState<string>('');

  const { users, loading, refetchUsers } = useUsers();
  const { referralRewards, addReferralReward, refetchReferralRewards } = useReferralRewards();
  const { toggleQuantification, deleteUser, deletingUserId, updateUserInvestment } = useUserActions();
  const { plans: investmentPlans, loading: plansLoading } = useInvestmentPlans();

  useEffect(() => {
    if (selectedUser) {
      setInvestmentPlanId(selectedUser.investment_plan_id);
      setBalance(selectedUser.balance.toString());
      setDailyLimit(selectedUser.daily_limit.toString());
    } else {
      setInvestmentPlanId(null);
      setBalance('');
      setDailyLimit('');
    }
  }, [selectedUser]);

  const handleSelectUser = (userId: string | null) => {
    if (userId === null) {
      setSelectedUser(null);
    } else {
      const user = users.find(u => u.id === userId);
      setSelectedUser(user || null);
    }
  };

  const handleAddReward = async (userId: string) => {
    const amount = parseFloat(rewardAmount);
    // Chamar addReferralReward com apenas USDT
    const success = await addReferralReward(userId, amount);
    if (success) {
      setSelectedUser(null);
      setRewardAmount('10');
      await refetchUsers();
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

  const handleUpdateInvestment = async (userId: string) => {
    const success = await updateUserInvestment(
      userId,
      investmentPlanId,
      parseFloat(balance || '0'),
      parseInt(dailyLimit || '1')
    );
    if (success) {
      await refetchUsers();
      setSelectedUser(null);
    }
  };

  return (
    <div className="space-y-6">
      <UsersList
        users={users}
        loading={loading || plansLoading}
        selectedUser={selectedUser?.id || null}
        deletingUserId={deletingUserId}
        rewardAmount={rewardAmount}
        onSelectUser={handleSelectUser}
        onRewardAmountChange={setRewardAmount}
        onAddReward={handleAddReward}
        onToggleQuantification={handleToggleQuantification}
        onDeleteUser={handleDeleteUser}
        investmentPlans={investmentPlans}
        investmentPlanId={investmentPlanId}
        onInvestmentPlanChange={setInvestmentPlanId}
        balance={balance}
        onBalanceChange={setBalance}
        dailyLimit={dailyLimit}
        onDailyLimitChange={setDailyLimit}
        onUpdateInvestment={handleUpdateInvestment}
      />

      <ReferralRewardsList referralRewards={referralRewards} />
    </div>
  );
};

export default UserManagement;
