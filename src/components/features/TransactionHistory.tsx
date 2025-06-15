
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, ArrowDown, ArrowUp } from 'lucide-react';

type Transaction = {
  id: string;
  amount: number;
  currency: string;
  type: string; // 'deposit' or 'withdraw'
  description?: string | null;
  created_at: string;
};

const TransactionHistory: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        setTransactions(data as Transaction[]);
      }
      setLoading(false);
    };
    fetchTransactions();
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
