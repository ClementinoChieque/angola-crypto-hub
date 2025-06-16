
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Transaction } from './transaction-history/types';
import TransactionsList from './transaction-history/TransactionsList';

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

  const withdrawals = transactions.filter(tx => tx.type === 'withdraw');

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-center">Transações</h2>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="withdrawals">Saques</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <TransactionsList 
            transactions={transactions} 
            loading={loading} 
            isMobile={isMobile} 
          />
        </TabsContent>
        
        <TabsContent value="withdrawals">
          <TransactionsList 
            transactions={withdrawals} 
            loading={loading} 
            isMobile={isMobile} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransactionHistory;
