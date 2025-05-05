
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/context/UserContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { UserPlus, Copy } from 'lucide-react';

const InviteUsers: React.FC = () => {
  const { toast } = useToast();
  const { referralCount } = useUser();
  const isMobile = useIsMobile();

  // Generate a random referral code
  const referralCode = "ANGOLACRYPTO" + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const referralLink = `https://crypto-hub.com/referral?code=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      toast({
        title: "Link copiado",
        description: "Link de convite copiado para a área de transferência",
      });
    });
  };

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
