
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserDeposits } from './user-deposits/hooks/useUserDeposits';
import LoadingState from './user-deposits/LoadingState';
import ErrorState from './user-deposits/ErrorState';
import EmptyState from './user-deposits/EmptyState';
import MobileView from './user-deposits/MobileView';
import DepositTable from './user-deposits/DepositTable';

const UserDeposits = () => {
  const {
    deposits,
    loading,
    updating,
    error,
    fetchDeposits,
    updateDepositStatus
  } = useUserDeposits();
  const isMobile = useIsMobile();

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchDeposits} />;
  }

  if (isMobile) {
    return (
      <MobileView
        deposits={deposits}
        updating={updating}
        onUpdateStatus={updateDepositStatus}
        onRetry={fetchDeposits}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Depósitos Users ({deposits.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {deposits.length === 0 ? (
          <EmptyState onRetry={fetchDeposits} />
        ) : (
          <DepositTable
            deposits={deposits}
            updating={updating}
            onUpdateStatus={updateDepositStatus}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default UserDeposits;
