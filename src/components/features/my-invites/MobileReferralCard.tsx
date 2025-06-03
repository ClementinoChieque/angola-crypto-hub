
import React from 'react';
import { Referral } from './types';
import { formatDate, getUserDisplayName, getStatusText } from './utils';
import StatusIcon from './StatusIcon';

interface MobileReferralCardProps {
  referral: Referral;
}

const MobileReferralCard: React.FC<MobileReferralCardProps> = ({ referral }) => {
  return (
    <div className="bg-card border rounded-lg p-3">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <StatusIcon status={referral.status} />
          <span className="text-sm font-medium">
            {getStatusText(referral.status)}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDate(referral.created_at)}
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">
          {getUserDisplayName(referral)}
        </p>
        <p className="text-xs text-muted-foreground">
          Código: {referral.referral_code}
        </p>
        {referral.completed_at && (
          <p className="text-xs text-green-600">
            Registrado em: {formatDate(referral.completed_at)}
          </p>
        )}
      </div>
    </div>
  );
};

export default MobileReferralCard;
