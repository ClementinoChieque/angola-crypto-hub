
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift } from 'lucide-react';
import { ReferralReward } from '../types';

interface ReferralRewardsListProps {
  referralRewards: ReferralReward[];
}

const ReferralRewardsList: React.FC<ReferralRewardsListProps> = ({ referralRewards }) => {
  if (referralRewards.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift size={24} />
          Recompensas de Convites
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {referralRewards.map((reward) => (
            <div key={reward.id} className="flex justify-between items-center p-3 border rounded">
              <div>
                <div className="font-medium">
                  {reward.reward_amount} {reward.reward_currency}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(reward.created_at).toLocaleDateString()}
                </div>
              </div>
              <Badge variant={reward.status === 'completed' ? 'default' : 'secondary'}>
                {reward.status === 'completed' ? 'Concluído' : 'Pendente'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralRewardsList;
