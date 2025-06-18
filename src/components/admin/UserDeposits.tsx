import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface UserDeposit {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    full_name: string;
  } | null;
}

const UserDeposits = () => {
  const [deposits, setDeposits] = useState<UserDeposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const fetchDeposits = async () => {
    try {
      const { data, error } = await supabase
        .from('user_deposits')
        .select(`
          *,
          profiles!user_deposits_user_id_fkey(
            username,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeposits(data || []);
    } catch (error) {
      console.error('Erro ao buscar depósitos:', error);
      toast.error('Erro ao carregar depósitos');
    } finally {
      setLoading(false);
    }
  };

  const updateDepositStatus = async (depositId: string, newStatus: string) => {
    setUpdating(depositId);
    try {
      const { error } = await supabase
        .from('user_deposits')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', depositId);

      if (error) throw error;

      toast.success(`Status do depósito atualizado para ${newStatus}`);
      fetchDeposits();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do depósito');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejeitado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Depósitos Users ({deposits.length})
            </CardTitle>
          </CardHeader>
        </Card>
        
        {deposits.map((deposit) => (
          <Card key={deposit.id} className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">
                    {deposit.profiles?.full_name || deposit.profiles?.username || 'Usuário'}
                  </p>
                  <p className="text-xs text-muted-foreground">ID: {deposit.user_id.slice(0, 8)}...</p>
                </div>
                {getStatusBadge(deposit.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Valor</p>
                  <p className="font-medium">{deposit.amount} {deposit.currency}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Data</p>
                  <p className="font-medium">{new Date(deposit.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              
              {deposit.description && (
                <div>
                  <p className="text-muted-foreground text-xs">Descrição</p>
                  <p className="text-sm">{deposit.description}</p>
                </div>
              )}
              
              {deposit.status === 'pending' && (
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => updateDepositStatus(deposit.id, 'approved')}
                    disabled={updating === deposit.id}
                  >
                    Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => updateDepositStatus(deposit.id, 'rejected')}
                    disabled={updating === deposit.id}
                  >
                    Rejeitar
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
        
        {deposits.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Nenhum depósito encontrado</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Depósitos Users ({deposits.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {deposits.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum depósito encontrado</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>ID do Usuário</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Moeda</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deposits.map((deposit) => (
                <TableRow key={deposit.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {deposit.profiles?.full_name || deposit.profiles?.username || 'Usuário'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                      {deposit.user_id}
                    </code>
                  </TableCell>
                  <TableCell className="font-medium">
                    {deposit.amount}
                  </TableCell>
                  <TableCell>{deposit.currency}</TableCell>
                  <TableCell>
                    {deposit.description || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(deposit.status)}
                      {getStatusBadge(deposit.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{new Date(deposit.created_at).toLocaleDateString('pt-BR')}</p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(deposit.created_at).toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {deposit.status === 'pending' ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateDepositStatus(deposit.id, 'approved')}
                          disabled={updating === deposit.id}
                        >
                          {updating === deposit.id ? '...' : 'Aprovar'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateDepositStatus(deposit.id, 'rejected')}
                          disabled={updating === deposit.id}
                        >
                          {updating === deposit.id ? '...' : 'Rejeitar'}
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default UserDeposits;
