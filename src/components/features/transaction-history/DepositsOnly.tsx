
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, ArrowUp } from 'lucide-react';
import { Transaction } from './types';
import MobileTransactionCard from './MobileTransactionCard';

interface DepositsOnlyProps {
  deposits: Transaction[];
  loading: boolean;
  isMobile: boolean;
}

const DepositsOnly: React.FC<DepositsOnlyProps> = ({ deposits, loading, isMobile }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin mr-2" size={20} />
        Carregando depósitos...
      </div>
    );
  }

  if (deposits.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">Nenhum depósito encontrado</div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-3">
        {deposits.map((deposit) => (
          <MobileTransactionCard key={deposit.id} transaction={deposit} />
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
            <TableHead>Valor</TableHead>
            <TableHead>Moeda</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deposits.map((deposit) => (
            <TableRow key={deposit.id}>
              <TableCell>{new Date(deposit.created_at).toLocaleString()}</TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 font-semibold text-green-600">
                  <ArrowUp size={14} />
                  {Number(deposit.amount).toLocaleString()}
                </span>
              </TableCell>
              <TableCell>{deposit.currency}</TableCell>
              <TableCell>{deposit.description || 'Depósito'}</TableCell>
              <TableCell>
                <span className="rounded bg-green-100 text-green-700 px-2 py-0.5 text-xs">Completo</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DepositsOnly;
