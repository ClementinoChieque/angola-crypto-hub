
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, ArrowDown, ArrowUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Transaction } from './transaction-history/types';
import { withdrawalStatusLabel } from './transaction-history/utils';
import MobileTransactionCard from './transaction-history/MobileTransactionCard';


const TransactionHistory: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      setLoading(true);

      try {
        // Fetch deposit transactions
        const { data: depositsData, error: depositError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .eq('type', 'deposit');

        // Fetch withdrawal requests
        const { data: withdrawalsData, error: withdrawalError } = await supabase
          .from('withdrawal_requests')
          .select('*')
          .eq('user_id', user.id);

        if (depositError) throw depositError;
        if (withdrawalError) throw withdrawalError;

        const deposits = (depositsData || []).map((d) => ({
          ...d,
          type: 'deposit' as const,
        }));

        const withdrawals = (withdrawalsData || []).map((w: any) => ({
          ...w,
          type: 'withdraw' as const,
          description: w.description || `Saque de ${w.amount} ${w.currency}`,
        }));

        const combinedTransactions: Transaction[] = [...deposits, ...withdrawals].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setTransactions(combinedTransactions);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-center">Transações</h2>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin mr-2" size={20} />
          Carregando transações...
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Nenhuma transação encontrada</div>
      ) : isMobile ? (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <MobileTransactionCard key={tx.id} transaction={tx} />
          ))}
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default TransactionHistory;
