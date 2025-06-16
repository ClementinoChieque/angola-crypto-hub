
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
    console.log('TransactionHistory - useEffect triggered, user:', user?.id);
    
    const fetchData = async () => {
      if (!user?.id) {
        console.log('TransactionHistory - No user ID, skipping fetch');
        return;
      }
      
      console.log('TransactionHistory - Starting data fetch for user:', user.id);
      setLoading(true);

      try {
        console.log('TransactionHistory - Fetching deposits...');
        // Fetch deposit transactions
        const { data: depositsData, error: depositError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .eq('type', 'deposit');

        console.log('TransactionHistory - Deposits data:', depositsData);
        console.log('TransactionHistory - Deposits error:', depositError);

        console.log('TransactionHistory - Fetching withdrawals...');
        // Fetch withdrawal requests
        const { data: withdrawalsData, error: withdrawalError } = await supabase
          .from('withdrawal_requests')
          .select('*')
          .eq('user_id', user.id);

        console.log('TransactionHistory - Withdrawals data:', withdrawalsData);
        console.log('TransactionHistory - Withdrawals error:', withdrawalError);

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

        console.log('TransactionHistory - Combined transactions:', combinedTransactions);
        setTransactions(combinedTransactions);
      } catch (error) {
        console.error("TransactionHistory - Error fetching transaction history:", error);
      } finally {
        setLoading(false);
        console.log('TransactionHistory - Fetch completed');
      }
    };

    fetchData();
  }, [user?.id]);

  const withdrawals = transactions.filter(tx => tx.type === 'withdraw');

  console.log('TransactionHistory - Rendering component, transactions count:', transactions.length);

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
