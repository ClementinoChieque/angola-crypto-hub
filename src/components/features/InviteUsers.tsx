
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/context/UserContext';
import { UserPlus, Copy } from 'lucide-react';

const InviteUsers: React.FC = () => {
  const { toast } = useToast();
  const { referralCount } = useUser();

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
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Convidar Novos Usuários</h2>
      
      <div className="bg-muted rounded-lg p-4 text-center">
        <UserPlus className="h-8 w-8 mx-auto text-crypto-blue mb-2" />
        <p className="font-medium mb-1">Você convidou {referralCount} usuário(s)</p>
        <p className="text-sm text-muted-foreground">
          Convide amigos e ganhe bônus!
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Seu link de convite</Label>
          <div className="flex space-x-2">
            <Input
              value={referralLink}
              readOnly
              className="font-mono text-sm"
            />
            <Button 
              variant="outline"
              onClick={copyToClipboard}
              className="flex-shrink-0"
            >
              <Copy size={16} />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border p-4 mt-4">
        <h3 className="font-medium mb-2">Benefícios do Programa de Indicação</h3>
        <ul className="text-sm space-y-1">
          <li>• Ganhe 5% do primeiro depósito de cada amigo indicado</li>
          <li>• Acesso antecipado a novas funcionalidades</li>
          <li>• Desconto em taxas de transação</li>
        </ul>
      </div>
    </div>
  );
};

export default InviteUsers;
