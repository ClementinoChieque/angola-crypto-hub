import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { UserPlus, Copy } from 'lucide-react';

const InviteUsers: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      initializeReferralCode();
      fetchReferralCount();
    }
  }, [user]);

  const generateReferralCode = () => {
    return "ANGOLACRYPTO" + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  };

  const initializeReferralCode = async () => {
    try {
      // Verificar se já existe um código para o usuário
      const { data: existingCode } = await supabase
        .from('referral_codes')
        .select('code')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .single();

      if (existingCode) {
        setReferralCode(existingCode.code);
      } else {
        // Criar novo código
        const newCode = generateReferralCode();
        const { error } = await supabase
          .from('referral_codes')
          .insert({
            user_id: user?.id,
            code: newCode,
            is_active: true
          });

        if (error) throw error;
        setReferralCode(newCode);
      }
    } catch (error) {
      console.error('Error initializing referral code:', error);
      // Fallback para código local se houver erro
      setReferralCode(generateReferralCode());
    } finally {
      setLoading(false);
    }
  };

  const fetchReferralCount = async () => {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('id')
        .eq('referrer_id', user?.id);

      if (error) throw error;
      setReferralCount(data?.length || 0);
    } catch (error) {
      console.error('Error fetching referral count:', error);
    }
  };

  const referralLink = `https://bitget12.com/referral?code=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      toast({
        title: "Link copiado",
        description: "Link de convite copiado para a área de transferência",
      });
    });
  };

  const createReferralRecord = async (invitedContact: string, isEmail: boolean = false) => {
    try {
      const { error } = await supabase
        .from('referrals')
        .insert({
          referrer_id: user?.id,
          referral_code: referralCode,
          invited_email: isEmail ? invitedContact : null,
          invited_phone: !isEmail ? invitedContact : null,
          status: 'pending'
        });

      if (error) throw error;
      
      // Atualizar contador
      fetchReferralCount();
      
      toast({
        title: "Convite registrado",
        description: "O convite foi registrado com sucesso",
      });
    } catch (error) {
      console.error('Error creating referral record:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-center">Convidar Novos Usuários</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crypto-blue mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-center">Convidar Novos Usuários</h2>
      
      <div className="bg-muted rounded-lg p-3 md:p-4 text-center">
        <UserPlus className="h-6 w-6 md:h-8 md:w-8 mx-auto text-crypto-blue mb-1 md:mb-2" />
        <p className="font-medium mb-1 text-sm md:text-base">Você convidou {referralCount} usuário(s)</p>
        <p className="text-xs md:text-sm text-muted-foreground">
          Convide amigos e ganhe bônus!
        </p>
      </div>
      
      <div className="space-y-3 md:space-y-4">
        <div className="space-y-1 md:space-y-2">
          <Label className="text-xs md:text-sm">Seu link de convite</Label>
          <div className="flex space-x-2">
            <Input
              value={referralLink}
              readOnly
              className="font-mono text-xs md:text-sm"
            />
            <Button 
              variant="outline"
              onClick={copyToClipboard}
              className="flex-shrink-0"
              size={isMobile ? "sm" : "icon"}
            >
              <Copy size={isMobile ? 14 : 16} />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border p-3 md:p-4 mt-3 md:mt-4">
        <h3 className="font-medium mb-1 md:mb-2 text-xs md:text-sm">Benefícios do Programa</h3>
        <ul className="text-[10px] md:text-sm space-y-0.5 md:space-y-1">
          <li>• Ganhe 5% do primeiro depósito de cada amigo</li>
          <li>• Acesso antecipado a novas funcionalidades</li>
          {!isMobile ? <li>• Desconto em taxas de transação</li> : null}
        </ul>
      </div>
    </div>
  );
};

export default InviteUsers;
