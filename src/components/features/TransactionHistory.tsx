import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, ArrowDown, ArrowUp } from 'lucide-react';

type Transaction = {
  id: string;
  amount: number;
  currency: string;
  type: string; // 'deposit' ou 'withdraw'
  description?: string | null;
  created_at: string;
  status?: string; // Usado apenas para saque
};

type WithdrawalRequest = {
  id: string;
  amount: number;
  currency: string;
  status: string; // 'pending', 'approved', 'rejected', 'completed'
  created_at: string;
};

const withdrawalStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return <span className="rounded bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs">Pendente</span>;
    case 'approved':
      return <span className="rounded bg-green-100 text-green-700 px-2 py-0.5 text-xs">Aprovado</span>;
    case 'rejected':
      return <span className="rounded bg-red-100 text-red-700 px-2 py-0.5 text-xs">Rejeitado</span>;
    case 'completed':
      return <span className="rounded bg-blue-100 text-blue-700 px-2 py-0.5 text-xs">Completo</span>;
    default:
      return <span className="text-xs">-</span>;
  }
};

const TransactionHistory: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      setLoading(true);

      // Busca transações (depósito e saque)
      const { data: txs, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Busca solicitações de saque (com status do admin)
      const { data: wd, error: wdError } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // LOGS PARA DEBUG
      console.log('[TransactionHistory] user.id:', user.id);
      console.log('[TransactionHistory] txError:', txError);
      console.log('[TransactionHistory] wdError:', wdError);
      console.log('[TransactionHistory] txs:', txs);
      console.log('[TransactionHistory] withdrawals:', wd);

      const transactionsData = Array.isArray(txs) ? txs : [];
      const withdrawalsData = Array.isArray(wd) ? wd : [];

      // Cria um mapa rápido de saque pelo valor e data próximos
      // Como não existe relação direta, faz match pelo valor, moeda e data próxima (±3 minutos)
      const statusForWithdrawal = (tx: Transaction) => {
        if (tx.type !== 'withdraw') return undefined;
        // Busca saque do mesmo valor/moeda em até 3min de diferença
        const txDate = new Date(tx.created_at);
        const w = withdrawalsData.find(wd =>
          Number(wd.amount) === Number(tx.amount) &&
          wd.currency === tx.currency &&
          Math.abs(new Date(wd.created_at).getTime() - txDate.getTime()) < 3 * 60 * 1000
        );
        return w ? w.status : undefined;
      };

      // Adiciona o campo status ao tipo saque
      const txWithStatus = transactionsData.map(tx =>
        tx.type === 'withdraw'
          ? { ...tx, status: statusForWithdrawal(tx) }
          : { ...tx }
      );

      setTransactions(txWithStatus);
      setWithdrawals(withdrawalsData);
      setLoading(false);
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
                      : <span className="text-xs">-</span>
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
