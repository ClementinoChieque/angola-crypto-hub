
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, ArrowDown, ArrowUp } from 'lucide-react';
import { Transaction } from './types';
import { withdrawalStatusLabel } from './utils';
import MobileTransactionCard from './MobileTransactionCard';

interface TransactionsListProps {
  transactions: Transaction[];
  loading: boolean;
  isMobile: boolean;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions, loading, isMobile }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin mr-2" size={20} />
        Carregando transações...
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">Nenhuma transação encontrada</div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-3">
        {transactions.map((tx) => (
          <MobileTransactionCard key={tx.id} transaction={tx} />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Moeda</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>{new Date(tx.created_at).toLocaleString()}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center gap-1 font-semibold ${tx.type === 'deposit' ? 'text-green-600' : 'text-blue-700'}`}>
                  {tx.type === 'deposit' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  {tx.type === 'deposit' ? 'Depósito' : 'Saque'}
                </span>
              </TableCell>
              <TableCell>{Number(tx.amount).toLocaleString()}</TableCell>
              <TableCell>{tx.currency}</TableCell>
              <TableCell>{tx.description || '-'}</TableCell>
              <TableCell>
                {tx.type === 'withdraw'
                  ? withdrawalStatusLabel(tx.status || 'pending')
                  : <span className="rounded bg-green-100 text-green-700 px-2 py-0.5 text-xs">Completo</span>
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsList;
