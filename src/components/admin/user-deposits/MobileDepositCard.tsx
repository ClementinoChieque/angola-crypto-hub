
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

interface MobileDepositCardProps {
  deposit: UserDeposit;
  updating: string | null;
  onUpdateStatus: (depositId: string, status: string) => void;
}

const MobileDepositCard: React.FC<MobileDepositCardProps> = ({
  deposit,
  updating,
  onUpdateStatus
}) => {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium text-sm">
              {deposit.profiles?.full_name || deposit.profiles?.username || 'Usuário'}
            </p>
            <p className="text-xs text-muted-foreground">ID: {deposit.user_id.slice(0, 8)}...</p>
          </div>
          <Badge className={
            deposit.status === 'approved' ? "bg-green-100 text-green-800" :
            deposit.status === 'rejected' ? "bg-red-100 text-red-800" :
            "bg-yellow-100 text-yellow-800"
          }>
            {deposit.status === 'approved' ? 'Aprovado' :
             deposit.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Valor</p>
            <p className="font-medium">{deposit.amount} {deposit.currency}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Data</p>
            <p className="font-medium">{new Date(deposit.created_at).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
        
        {deposit.description && (
          <div>
            <p className="text-muted-foreground text-xs">Descrição</p>
            <p className="text-sm">{deposit.description}</p>
          </div>
        )}
        
        {deposit.status === 'pending' && (
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onUpdateStatus(deposit.id, 'approved')}
              disabled={updating === deposit.id}
            >
              Aprovar
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onUpdateStatus(deposit.id, 'rejected')}
              disabled={updating === deposit.id}
            >
              Rejeitar
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MobileDepositCard;
