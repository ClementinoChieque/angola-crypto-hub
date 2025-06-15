import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import WithdrawalRequestCard, { WithdrawalRequest } from './withdrawals/WithdrawalRequestCard';
import { Trash } from "lucide-react";

const fetchWithdrawalRequests = async (): Promise<WithdrawalRequest[]> => {
  const { data, error } = await supabase
    .from('withdrawal_requests')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as WithdrawalRequest[];
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

const deleteWithdrawalRequest = async (id: string) => {
  const { error } = await supabase
    .from('withdrawal_requests')
    .delete()
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
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da solicitação",
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWithdrawalRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawal_requests'] });
      toast({
        title: "Solicitação eliminada",
        description: "A solicitação de saque foi removida com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao eliminar",
        description: "Não foi possível eliminar a solicitação.",
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
    toast({
      title: "Status atualizado",
      description: `Solicitação ${status === 'approved' ? 'aprovada' : status === 'rejected' ? 'rejeitada' : 'marcada como completa'}`
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign size={24} />
          Solicitações de Saque
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
              Erro ao carregar solicitações de saque.
            </div>
          )}
          {requests && requests.length > 0 && (
            requests.map((request) => (
              <WithdrawalRequestCard
                key={request.id}
                request={request}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDelete}
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
