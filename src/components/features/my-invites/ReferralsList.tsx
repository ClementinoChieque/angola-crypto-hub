
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Referral } from './types';
import MobileReferralCard from './MobileReferralCard';
import ReferralsTable from './ReferralsTable';

interface ReferralsListProps {
  referrals: Referral[];
}

const ReferralsList: React.FC<ReferralsListProps> = ({ referrals }) => {
  const isMobile = useIsMobile();

  return (
    <div className="rounded-lg border">
      {isMobile ? (
        <div className="space-y-2 p-2">
          {referrals.map((referral) => (
            <MobileReferralCard key={referral.id} referral={referral} />
          ))}
        </div>
      ) : (
        <ReferralsTable referrals={referrals} />
      )}
    </div>
  );
};

export default ReferralsList;
