
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import WithdrawalRequestCard, { WithdrawalRequest } from './withdrawals/WithdrawalRequestCard';

interface WithdrawalRequestWithProfile extends WithdrawalRequest {
  profiles?: {
    username: string;
    full_name: string;
  } | null;
}

const fetchWithdrawalRequests = async (): Promise<WithdrawalRequestWithProfile[]> => {
  const { data, error } = await supabase
    .from('withdrawal_requests')
    .select(`
      *,
      profiles:user_id (
        username,
        full_name
      )
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Erro ao buscar solicitações de saque:', error);
    throw error;
  }
  
  return data as WithdrawalRequestWithProfile[];
};

const updateWithdrawalStatus = async ({
  id,
  status,
  notes,
}: {
  id: string;
  status: string;
  notes?: string;
}) => {
  const { error } = await supabase
    .from('withdrawal_requests')
    .update({ status, admin_notes: notes ?? null })
    .eq('id', id);

  if (error) throw error;
};

const WithdrawalRequests: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['withdrawal_requests'],
    queryFn: fetchWithdrawalRequests,
  });

  const mutation = useMutation({
    mutationFn: updateWithdrawalStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawal_requests'] });
      toast({
        title: "Status atualizado",
        description: "Status da solicitação atualizado com sucesso"
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da solicitação",
        variant: "destructive"
      });
    }
  });

  const handleUpdateStatus = (requestId: string, status: string, notes?: string) => {
    mutation.mutate({
      id: requestId,
      status,
      notes
    });
  };

  if (error) {
    console.error('Erro ao carregar solicitações:', error);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign size={24} />
          Solicitações de Saque ({requests?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading && (
            <div className="text-center py-8 text-gray-500">
              Carregando solicitações de saque...
            </div>
          )}
          {error && (
            <div className="text-center py-8 text-red-500">
              Erro ao carregar solicitações de saque: {error.message}
            </div>
          )}
          {requests && requests.length > 0 && (
            requests.map((request) => (
              <WithdrawalRequestCard
                key={request.id}
                request={request}
                onUpdateStatus={handleUpdateStatus}
              />
            ))
          )}
          {requests && requests.length === 0 && !isLoading && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma solicitação de saque encontrada
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WithdrawalRequests;
