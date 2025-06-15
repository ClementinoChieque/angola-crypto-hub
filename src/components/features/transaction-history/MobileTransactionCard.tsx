
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Transaction } from './types';
import { withdrawalStatusLabel } from './utils';

interface MobileTransactionCardProps {
  transaction: Transaction;
}

const MobileTransactionCard: React.FC<MobileTransactionCardProps> = ({ transaction: tx }) => {
  const isDeposit = tx.type === 'deposit';

  return (
    <Card className="bg-white/95">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={`text-sm font-medium flex items-center gap-1 ${isDeposit ? 'text-green-600' : 'text-blue-700'}`}>
          {isDeposit ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          {isDeposit ? 'Depósito' : 'Saque'}
        </CardTitle>
        <div className="text-sm font-bold">
          {isDeposit ? '+' : '-'} {Number(tx.amount).toLocaleString()} {tx.currency}
        </div>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground space-y-2 pt-2">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-600">Data:</span>
          <span className="text-gray-800">{new Date(tx.created_at).toLocaleString()}</span>
        </div>
        {tx.description && (
          <div className="flex justify-between items-start">
            <span className="font-medium text-gray-600 pr-2">Descrição:</span>
            <span className="text-gray-800 text-right">{tx.description}</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-600">Status:</span>
          {tx.type === 'withdraw'
            ? withdrawalStatusLabel(tx.status || 'pending')
            : <span className="rounded bg-green-100 text-green-700 px-2 py-0.5 text-xs">Completo</span>
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileTransactionCard;
