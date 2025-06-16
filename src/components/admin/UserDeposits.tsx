
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Clock, ArrowUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface DepositRequest {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  description: string | null;
  created_at: string;
  profiles?: {
    username: string;
  };
}

const UserDeposits: React.FC = () => {
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const fetchDeposits = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          profiles (username)
        `)
        .eq('type', 'deposit')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeposits(data || []);
    } catch (error) {
      console.error('Error fetching deposits:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar depósitos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin mr-2" size={20} />
        Carregando depósitos...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <ArrowUp className="text-green-500" size={24} />
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Depósitos Users</h2>
      </div>

      {deposits.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Nenhum depósito encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {deposits.map((deposit) => (
            <Card key={deposit.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <CardTitle className="text-lg">
                    {deposit.profiles?.username || 'Usuário desconhecido'}
                  </CardTitle>
                  <Badge variant="outline" className="text-green-600 border-green-300">
                    <CheckCircle size={12} className="mr-1" />
                    Completo
                  </Badge>
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDeposits;
