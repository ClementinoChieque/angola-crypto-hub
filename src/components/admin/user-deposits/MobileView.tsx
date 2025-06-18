
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import MobileDepositCard from './MobileDepositCard';
import EmptyState from './EmptyState';

interface UserDeposit {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    full_name: string;
  } | null;
}

interface MobileViewProps {
  deposits: UserDeposit[];
  updating: string | null;
  onUpdateStatus: (depositId: string, status: string) => void;
  onRetry: () => void;
}

const MobileView: React.FC<MobileViewProps> = ({
  deposits,
  updating,
  onUpdateStatus,
  onRetry
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Depósitos Users ({deposits.length})
          </CardTitle>
        </CardHeader>
      </Card>
      
      {deposits.map((deposit) => (
        <MobileDepositCard
          key={deposit.id}
          deposit={deposit}
          updating={updating}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
      
      {deposits.length === 0 && (
        <EmptyState onRetry={onRetry} />
      )}
    </div>
  );
};

export default MobileView;
