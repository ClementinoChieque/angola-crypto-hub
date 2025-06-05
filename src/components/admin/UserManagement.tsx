
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Users, Gift, UserCheck, Zap } from 'lucide-react';

interface UserWithReferrals {
  id: string;
  phone: string;
  created_at: string;
  referral_count: number;
  quantification_active: boolean;
}

interface ReferralReward {
  id: string;
  referrer_id: string;
  referred_user_id: string;
  reward_amount: number;
  reward_currency: string;
  status: string;
  created_at: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserWithReferrals[]>([]);
  const [referralRewards, setReferralRewards] = useState<ReferralReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [rewardAmount, setRewardAmount] = useState('10');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    fetchReferralRewards();
  }, []);

  const fetchUsers = async () => {
    try {
      // Get unique users from referrals table and payment_proofs table
      const { data: referralUsers, error: referralError } = await supabase
        .from('referrals')
        .select('referrer_id, created_at')
        .order('created_at', { ascending: false });

      const { data: proofUsers, error: proofError } = await supabase
        .from('payment_proofs')
        .select('user_id, created_at')
        .order('created_at', { ascending: false });

      if (referralError && referralError.code !== 'PGRST116') {
        console.error('Error fetching referral users:', referralError);
      }

      if (proofError && proofError.code !== 'PGRST116') {
        console.error('Error fetching proof users:', proofError);
      }

      // Combine and deduplicate user IDs
      const allUserIds = new Set<string>();
      
      if (referralUsers) {
        referralUsers.forEach(ref => allUserIds.add(ref.referrer_id));
      }
      
      if (proofUsers) {
        proofUsers.forEach(proof => allUserIds.add(proof.user_id));
      }

      // Get user data for each unique user ID
      const usersWithData = await Promise.all(
        Array.from(allUserIds).map(async (userId) => {
          // Count referrals
          const { data: referrals } = await supabase
            .from('referrals')
            .select('id')
            .eq('referrer_id', userId);

          // Check quantification status
          const { data: quantification } = await supabase
            .from('user_quantifications')
            .select('is_active')
            .eq('user_id', userId)
            .single();

          // Get user creation date from the first referral or payment proof
          let createdAt = new Date().toISOString();
          if (referralUsers) {
            const userReferral = referralUsers.find(ref => ref.referrer_id === userId);
            if (userReferral) createdAt = userReferral.created_at;
          }
          if (proofUsers) {
            const userProof = proofUsers.find(proof => proof.user_id === userId);
            if (userProof) createdAt = userProof.created_at;
          }

          return {
            id: userId,
            phone: `Usuário ${userId.slice(0, 8)}...`, // Placeholder since we can't access auth.users
            created_at: createdAt,
            referral_count: referrals?.length || 0,
            quantification_active: quantification?.is_active || false
          };
        })
      );

      setUsers(usersWithData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReferralRewards = async () => {
    try {
      const { data, error } = await supabase
        .from('referral_rewards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReferralRewards(data || []);
    } catch (error) {
      console.error('Error fetching referral rewards:', error);
    }
  };

  const addReferralReward = async (userId: string) => {
    try {
      const amount = parseFloat(rewardAmount);
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Valor inválido",
          description: "Por favor, insira um valor válido para a recompensa",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('referral_rewards')
        .insert({
          referrer_id: userId,
          referred_user_id: userId, // Placeholder - adjust as needed
          reward_amount: amount,
          reward_currency: 'USDT',
          status: 'completed'
        });

      if (error) throw error;

      toast({
        title: "Recompensa adicionada",
        description: `Recompensa de ${amount} USDT adicionada com sucesso`
      });

      await fetchReferralRewards();
      setSelectedUser(null);
    } catch (error) {
      console.error('Error adding referral reward:', error);
      toast({
        title: "Erro ao adicionar recompensa",
        description: "Não foi possível adicionar a recompensa",
        variant: "destructive"
      });
    }
  };

  const toggleQuantification = async (userId: string, currentStatus: boolean) => {
    try {
      const { data: existing, error: fetchError } = await supabase
        .from('user_quantifications')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existing) {
        const { error } = await supabase
          .from('user_quantifications')
          .update({
            is_active: !currentStatus,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_quantifications')
          .insert({
            user_id: userId,
            is_active: !currentStatus,
            daily_limit: 1,
            used_today: 0,
            last_reset_date: new Date().toISOString().split('T')[0]
          });

        if (error) throw error;
      }

      toast({
        title: `Quantificação ${!currentStatus ? 'ativada' : 'desativada'}`,
        description: `A quantificação foi ${!currentStatus ? 'ativada' : 'desativada'} para o usuário`
      });

      await fetchUsers();
    } catch (error) {
      console.error('Error toggling quantification:', error);
      toast({
        title: "Erro ao alterar quantificação",
        description: "Não foi possível alterar o status da quantificação",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={24} />
            Gestão de Usuários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando usuários...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={24} />
            Gestão de Usuários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-medium">{user.phone}</div>
                    <div className="text-sm text-gray-500">
                      Registrado: {new Date(user.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Convites: {user.referral_count}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={user.quantification_active ? 'default' : 'secondary'}>
                      <Zap size={14} className="mr-1" />
                      {user.quantification_active ? 'Quantificação Ativa' : 'Quantificação Inativa'}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedUser(user.id)}
                  >
                    <Gift size={16} className="mr-1" />
                    Adicionar Recompensa
                  </Button>
                  <Button
                    size="sm"
                    variant={user.quantification_active ? "destructive" : "default"}
                    onClick={() => toggleQuantification(user.id, user.quantification_active)}
                  >
                    <Zap size={16} className="mr-1" />
                    {user.quantification_active ? 'Desativar' : 'Ativar'} Quantificação
                  </Button>
                </div>

                {selectedUser === user.id && (
                  <div className="mt-4 p-4 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="reward_amount">Valor da Recompensa (USDT)</Label>
                        <Input
                          id="reward_amount"
                          type="number"
                          value={rewardAmount}
                          onChange={(e) => setRewardAmount(e.target.value)}
                          placeholder="10.00"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        onClick={() => addReferralReward(user.id)}
                      >
                        Confirmar Recompensa
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedUser(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {users.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum usuário encontrado
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {referralRewards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift size={24} />
              Recompensas de Convites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {referralRewards.map((reward) => (
                <div key={reward.id} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <div className="font-medium">
                      {reward.reward_amount} {reward.reward_currency}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(reward.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant={reward.status === 'completed' ? 'default' : 'secondary'}>
                    {reward.status === 'completed' ? 'Concluído' : 'Pendente'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagement;
