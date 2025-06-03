
import React from 'react';
import { Users } from 'lucide-react';
import { Referral } from './types';

interface InvitesSummaryProps {
  referrals: Referral[];
}

const InvitesSummary: React.FC<InvitesSummaryProps> = ({ referrals }) => {
  return (
    <div className="bg-muted rounded-lg p-3 md:p-4 text-center">
      <Users className="h-6 w-6 md:h-8 md:w-8 mx-auto text-crypto-blue mb-1 md:mb-2" />
      <p className="font-medium mb-1 text-sm md:text-base">
        {referrals.length} convite(s) enviado(s)
      </p>
      <p className="text-xs md:text-sm text-muted-foreground">
        {referrals.filter(r => r.status === 'completed').length} usuário(s) registrado(s)
      </p>
    </div>
  );
};

export default InvitesSummary;
