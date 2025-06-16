
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
  status: string;
  created_at: string;
  type: string;
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

  const updateDepositStatus = async (depositId: string, status: string) => {
    setUpdating(depositId);
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status })
        .eq('id', depositId);

      if (error) throw error;

      await fetchDeposits();
      toast({
        title: "Sucesso",
        description: `Depósito ${status === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso`,
      });
    } catch (error) {
      console.error('Error updating deposit:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status do depósito",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-300"><Clock size={12} className="mr-1" />Pendente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-300"><CheckCircle size={12} className="mr-1" />Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-300"><XCircle size={12} className="mr-1" />Rejeitado</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

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
                  {getStatusBadge(deposit.status)}
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
                      onClick={() => updateDepositStatus(deposit.id, 'approved')}
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
                      onClick={() => updateDepositStatus(deposit.id, 'rejected')}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDeposits;
