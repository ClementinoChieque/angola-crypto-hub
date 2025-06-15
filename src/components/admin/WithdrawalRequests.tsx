
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface WithdrawalRequest {
  id: string;
  amount: number;
  currency: string;
  withdrawal_method: string;
  wallet_address?: string | null;
  bank_name?: string | null;
  bank_account?: string | null;
  status: string;
  admin_notes?: string | null;
  created_at: string;
  user_id: string;
}

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

const WithdrawalRequests: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
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
    setSelectedRequest(null);
    setAdminNotes('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock size={14} className="mr-1" />Pendente</Badge>;
      case 'approved':
        return <Badge variant="default"><CheckCircle size={14} className="mr-1" />Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle size={14} className="mr-1" />Rejeitado</Badge>;
      case 'completed':
        return <Badge variant="outline"><CheckCircle size={14} className="mr-1" />Completo</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
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
          {requests && requests.length > 0 && requests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-medium text-lg">
                    {Number(request.amount).toLocaleString()} {request.currency}
                  </div>
                  <div className="text-sm text-gray-500">
                    {request.withdrawal_method} • {new Date(request.created_at).toLocaleDateString()}
                  </div>
                  {request.wallet_address && (
                    <div className="text-xs text-gray-400 mt-1">
                      Carteira: {request.wallet_address}
                    </div>
                  )}
                  {request.bank_name && (
                    <div className="text-xs text-gray-400 mt-1">
                      Banco: {request.bank_name} - {request.bank_account}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(request.status)}
                </div>
              </div>

              {request.admin_notes && (
                <div className="bg-gray-50 p-2 rounded text-sm mb-3">
                  <strong>Notas do Admin:</strong> {request.admin_notes}
                </div>
              )}

              {request.status === 'pending' && (
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={() => setSelectedRequest(request.id)}
                  >
                    Gerenciar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(request.id, 'approved')}
                  >
                    <CheckCircle size={16} className="mr-1" />
                    Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleUpdateStatus(request.id, 'rejected')}
                  >
                    <XCircle size={16} className="mr-1" />
                    Rejeitar
                  </Button>
                </div>
              )}

              {request.status === 'approved' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStatus(request.id, 'completed')}
                  className="mt-3"
                >
                  Marcar como Completo
                </Button>
              )}

              {selectedRequest === request.id && (
                <div className="mt-4 p-4 border-t">
                  <Textarea
                    placeholder="Adicionar notas administrativas..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="mb-3"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(request.id, 'approved', adminNotes)}
                    >
                      Aprovar com Notas
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleUpdateStatus(request.id, 'rejected', adminNotes)}
                    >
                      Rejeitar com Notas
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedRequest(null);
                        setAdminNotes('');
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

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

