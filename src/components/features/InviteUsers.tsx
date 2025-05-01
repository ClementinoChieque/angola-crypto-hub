
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/context/UserContext';
import { UserPlus, Share2, Copy } from 'lucide-react';

const InviteUsers: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { incrementReferralCount, referralCount } = useUser();

  // Generate a random referral code
  const referralCode = "ANGOLACRYPTO" + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  const referralLink = `https://crypto-hub.com/referral?code=${referralCode}`;

  const handleInvite = () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      toast({
        title: "Número inválido",
        description: "Por favor, insira um número de telefone válido",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    
    // Simulate invitation delay
    setTimeout(() => {
      incrementReferralCount();
      
      toast({
        title: "Convite enviado",
        description: `Convite enviado para ${phoneNumber}`,
      });
      
      setPhoneNumber('');
      setIsSending(false);
    }, 1000);
  };

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
          <Label htmlFor="phone-number">Número de Telefone</Label>
          <div className="flex space-x-2">
            <Input
              id="phone-number"
              type="tel"
              placeholder="Ex: 923456789"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Button 
              onClick={handleInvite}
              disabled={isSending}
              className="bg-crypto-blue hover:bg-crypto-light-blue"
            >
              {isSending ? "Enviando..." : "Enviar"}
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Ou compartilhe seu link de convite</Label>
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
        
        <div className="flex justify-center mt-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 size={16} />
            Compartilhar
          </Button>
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
