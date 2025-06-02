
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { Users, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Referral {
  id: string;
  referral_code: string;
  invited_email?: string;
  invited_phone?: string;
  status: 'pending' | 'completed' | 'expired';
  created_at: string;
  completed_at?: string;
  referred_user?: {
    username?: string;
    full_name?: string;
  };
}

const MyInvites: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchReferrals();
    }
  }, [user]);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      
      const { data: referralsData, error } = await supabase
        .from('referrals')
        .select(`
          *,
          profiles:referred_user_id (
            username,
            full_name
          )
        `)
        .eq('referrer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedReferrals = referralsData?.map(referral => ({
        ...referral,
        referred_user: referral.profiles
      })) || [];

      setReferrals(formattedReferrals);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      toast({
        title: "Erro ao carregar convites",
        description: "Não foi possível carregar a lista de convites",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'expired':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Registrado';
      case 'pending':
        return 'Pendente';
      case 'expired':
        return 'Expirado';
      default:
        return 'Desconhecido';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getUserDisplayName = (referral: Referral) => {
    if (referral.referred_user?.full_name) {
      return referral.referred_user.full_name;
    }
    if (referral.referred_user?.username) {
      return referral.referred_user.username;
    }
    if (referral.invited_email) {
      return referral.invited_email;
    }
    if (referral.invited_phone) {
      return referral.invited_phone;
    }
    return 'Usuário convidado';
  };

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-center">Meus Convidados</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crypto-blue mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Carregando convites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-center">Meus Convidados</h2>
      
      <div className="bg-muted rounded-lg p-3 md:p-4 text-center">
        <Users className="h-6 w-6 md:h-8 md:w-8 mx-auto text-crypto-blue mb-1 md:mb-2" />
        <p className="font-medium mb-1 text-sm md:text-base">
          {referrals.length} convite(s) enviado(s)
        </p>
        <p className="text-xs md:text-sm text-muted-foreground">
          {referrals.filter(r => r.status === 'completed').length} usuário(s) registrado(s)
        </p>
      </div>

      {referrals.length === 0 ? (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Você ainda não convidou ninguém</p>
          <p className="text-sm text-muted-foreground mt-1">
            Use a aba "Convidar" para enviar convites
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          {isMobile ? (
            <div className="space-y-2 p-2">
              {referrals.map((referral) => (
                <div key={referral.id} className="bg-card border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(referral.status)}
                      <span className="text-sm font-medium">
                        {getStatusText(referral.status)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(referral.created_at)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {getUserDisplayName(referral)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Código: {referral.referral_code}
                    </p>
                    {referral.completed_at && (
                      <p className="text-xs text-green-600">
                        Registrado em: {formatDate(referral.completed_at)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data do Convite</TableHead>
                  <TableHead>Data de Registro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell className="font-medium">
                      {getUserDisplayName(referral)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {referral.referral_code}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(referral.status)}
                        <span className="text-sm">
                          {getStatusText(referral.status)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(referral.created_at)}
                    </TableCell>
                    <TableCell>
                      {referral.completed_at ? (
                        <span className="text-green-600">
                          {formatDate(referral.completed_at)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      <div className="text-center">
        <Button 
          variant="outline" 
          onClick={fetchReferrals}
          size={isMobile ? "sm" : "default"}
        >
          Atualizar Lista
        </Button>
      </div>
    </div>
  );
};

export default MyInvites;
