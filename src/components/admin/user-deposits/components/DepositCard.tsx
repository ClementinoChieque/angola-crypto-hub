
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { DepositRequest } from '../types';
import { StatusBadge } from './StatusBadge';

interface DepositCardProps {
  deposit: DepositRequest;
  updating: string | null;
  onUpdateStatus: (depositId: string, status: string) => Promise<void>;
}

export const DepositCard: React.FC<DepositCardProps> = ({
  deposit,
  updating,
  onUpdateStatus
}) => {
  const isMobile = useIsMobile();

  return (
    <Card key={deposit.id}>
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <CardTitle className="text-lg">
            {deposit.profiles?.username || 'Usuário desconhecido'}
          </CardTitle>
          <StatusBadge status={deposit.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Valor</p>
            <p className="font-semibold text-green-600">
              {Number(deposit.amount).toLocaleString()} {deposit.currency}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Data</p>
            <p className="font-medium">
              {new Date(deposit.created_at).toLocaleString()}
            </p>
          </div>
          {deposit.description && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Descrição</p>
              <p className="font-medium">{deposit.description}</p>
            </div>
          )}
        </div>

        {deposit.status === 'pending' && (
          <div className="flex gap-2 pt-3 border-t">
            <Button
              onClick={() => onUpdateStatus(deposit.id, 'approved')}
              disabled={updating === deposit.id}
              className="bg-green-600 hover:bg-green-700 flex-1"
              size={isMobile ? "sm" : "default"}
            >
              {updating === deposit.id ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : (
                <CheckCircle className="mr-2" size={16} />
              )}
              Aprovar
            </Button>
            <Button
              onClick={() => onUpdateStatus(deposit.id, 'rejected')}
              disabled={updating === deposit.id}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 flex-1"
              size={isMobile ? "sm" : "default"}
            >
              {updating === deposit.id ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : (
                <XCircle className="mr-2" size={16} />
              )}
              Rejeitar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
