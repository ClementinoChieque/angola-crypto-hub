
import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useReferrals } from './my-invites/useReferrals';
import LoadingState from './my-invites/LoadingState';
import EmptyState from './my-invites/EmptyState';
import InvitesSummary from './my-invites/InvitesSummary';
import ReferralsList from './my-invites/ReferralsList';

const MyInvites: React.FC = () => {
  const isMobile = useIsMobile();
  const { referrals, loading, fetchReferrals } = useReferrals();

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-center">Meus Convidados</h2>
      
      <InvitesSummary referrals={referrals} />

      {referrals.length === 0 ? (
        <EmptyState />
      ) : (
        <ReferralsList referrals={referrals} />
      )}

      <div className="text-center">
        <Button 
          variant="outline" 
          onClick={fetchReferrals}
          size={isMobile ? "sm" : "default"}
        >
          Atualizar Lista
        </Button>
      </div>
    </div>
  );
};

export default MyInvites;
