
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WithdrawalRequest {
  id: string;
  amount: number;
  currency: string;
  withdrawal_method: string;
  wallet_address?: string;
  bank_name?: string;
  bank_account?: string;
  status: string;
  admin_notes?: string;
  created_at: string;
  user_id: string;
}

const WithdrawalRequests: React.FC = () => {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchWithdrawalRequests();
    
    // Configurar real-time para notificações
    const channel = supabase
      .channel('withdrawal-requests')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'withdrawal_requests'
      }, (payload) => {
        toast({
          title: "Nova solicitação de saque",
          description: `Usuário solicitou saque de ${payload.new.amount} ${payload.new.currency}`,
        });
        fetchWithdrawalRequests();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchWithdrawalRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching withdrawal requests:', error);
      toast({
        title: "Erro ao carregar solicitações",
        description: "Não foi possível carregar as solicitações de saque",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, status: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .update({
          status,
          admin_notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `Solicitação ${status === 'approved' ? 'aprovada' : status === 'rejected' ? 'rejeitada' : 'marcada como completa'}`
      });

      fetchWithdrawalRequests();
      setSelectedRequest(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Error updating request status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da solicitação",
        variant: "destructive"
      });
    }
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

  if (loading) {
    return <div className="text-center py-8">Carregando solicitações...</div>;
  }

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
          {requests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-medium text-lg">
                    {request.amount.toLocaleString()} {request.currency}
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
                    onClick={() => updateRequestStatus(request.id, 'approved')}
                  >
                    <CheckCircle size={16} className="mr-1" />
                    Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => updateRequestStatus(request.id, 'rejected')}
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
                  onClick={() => updateRequestStatus(request.id, 'completed')}
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
                      onClick={() => updateRequestStatus(request.id, 'approved', adminNotes)}
                    >
                      Aprovar com Notas
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateRequestStatus(request.id, 'rejected', adminNotes)}
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

          {requests.length === 0 && (
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
