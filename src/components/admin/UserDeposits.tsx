
import React from 'react';
import { ArrowUp } from 'lucide-react';
import { useDeposits } from './user-deposits/hooks/useDeposits';
import { LoadingState } from './user-deposits/components/LoadingState';
import { EmptyState } from './user-deposits/components/EmptyState';
import { DepositCard } from './user-deposits/components/DepositCard';

const UserDeposits: React.FC = () => {
  const { deposits, loading, updating, updateDepositStatus } = useDeposits();

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <ArrowUp className="text-green-500" size={24} />
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Depósitos Users</h2>
      </div>

      {deposits.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4">
          {deposits.map((deposit) => (
            <DepositCard
              key={deposit.id}
              deposit={deposit}
              updating={updating}
              onUpdateStatus={updateDepositStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDeposits;
