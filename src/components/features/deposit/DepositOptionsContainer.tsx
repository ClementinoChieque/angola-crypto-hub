
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/context/UserContext';
import { ArrowUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
// Corrigido: importar o componente correto
import UploadProofContainer from '@/components/features/uploadproof/UploadProofContainer';
import { useAuth } from '@/context/AuthContext';

type DepositMethod = 'USDT' | 'BAE' | 'BFA' | 'BIC' | 'ATL';

const DepositOptionsContainer: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<DepositMethod | null>(null);
  const [proofImageUrl, setProofImageUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const { setDepositMethod, addProofUpload } = useUser();
  const { user } = useAuth();

  const handleMethodSelect = (method: DepositMethod) => {
    setSelectedMethod(method);
    setDepositMethod(method);
  };

  const handleProofUpload = (url: string) => {
    setProofImageUrl(url);
  };

  const handleDeposit = async (depositAmount: number, depositCurrency: string) => {
    if (!selectedMethod) {
      toast({
        title: "Método de depósito não selecionado",
        description: "Por favor, selecione um método de depósito.",
        variant: "destructive",
      });
      return;
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido para o depósito.",
        variant: "destructive",
      });
      return;
    }

    if (!proofImageUrl) {
      toast({
        title: "Comprovante de depósito não enviado",
        description: "Por favor, envie o comprovante de depósito.",
        variant: "destructive",
      });
      return;
    }

    addProofUpload(proofImageUrl);

    toast({
      title: "Depósito solicitado",
      description: "Seu depósito foi solicitado e está aguardando aprovação.",
    });

    setAmount('');
    setSelectedMethod(null);
    setProofImageUrl(null);

    if (user?.id) {
      await supabase.from('transactions').insert([
        {
          user_id: user.id,
          amount: depositAmount,
          currency: depositCurrency,
          type: 'deposit',
          description: 'Depósito realizado',
        }
      ]);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-center">Opções de Depósito</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button
          variant={selectedMethod === 'USDT' ? 'default' : 'outline'}
          onClick={() => handleMethodSelect('USDT')}
          className="w-full"
        >
          USDT
        </Button>
        <Button
          variant={selectedMethod === 'BAE' ? 'default' : 'outline'}
          onClick={() => handleMethodSelect('BAE')}
          className="w-full"
        >
          BAE
        </Button>
        <Button
          variant={selectedMethod === 'BFA' ? 'default' : 'outline'}
          onClick={() => handleMethodSelect('BFA')}
          className="w-full"
        >
          BFA
        </Button>
        <Button
          variant={selectedMethod === 'BIC' ? 'default' : 'outline'}
          onClick={() => handleMethodSelect('BIC')}
          className="w-full"
        >
          BIC
        </Button>
        <Button
          variant={selectedMethod === 'ATL' ? 'default' : 'outline'}
          onClick={() => handleMethodSelect('ATL')}
          className="w-full"
        >
          ATL
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="amount">Valor a Depositar</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Usa o componente correto para upload, mas mantém a interface esperada */}
        <UploadProofContainer onUpload={handleProofUpload} />

        <Button
          onClick={() => handleDeposit(parseFloat(amount), 'AKZ')}
          className="w-full bg-green-500 hover:bg-green-600"
          disabled={!selectedMethod || !amount || !proofImageUrl}
        >
          <ArrowUp size={16} className="mr-2" />
          Confirmar Depósito
        </Button>
      </div>
    </div>
  );
};

export default DepositOptionsContainer;
