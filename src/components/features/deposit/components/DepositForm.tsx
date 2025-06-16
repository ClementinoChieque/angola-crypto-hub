
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface DepositFormProps {
  selectedMethod: 'bank' | 'crypto';
  currency: string;
  onBack: () => void;
}

const DepositForm: React.FC<DepositFormProps> = ({ selectedMethod, currency, onBack }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleConfirmDeposit = async () => {
    console.log('Starting deposit confirmation...', { user: user?.id, amount, currency });
    
    if (!user?.id) {
      console.error('User not authenticated');
      toast({
        title: "Erro",
        description: "Usuário não autenticado. Por favor, faça login novamente.",
        variant: "destructive",
      });
      return;
    }

    if (!amount || Number(amount) <= 0) {
      console.error('Invalid amount:', amount);
      toast({
        title: "Erro",
        description: "Por favor, insira um valor válido",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Inserting transaction into database...');
      
      const transactionData = {
        user_id: user.id,
        amount: Number(amount),
        currency: currency,
        type: 'deposit',
        description: `Depósito via ${selectedMethod === 'bank' ? 'Transferência Bancária' : 'USDT'}`,
        status: 'pending'
      };
      
      console.log('Transaction data:', transactionData);

      const { data, error } = await supabase
        .from('transactions')
        .insert(transactionData)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Transaction created successfully:', data);

      toast({
        title: "Sucesso",
        description: "Depósito enviado para aprovação do administrador",
      });

      setAmount('');
      onBack();
    } catch (error) {
      console.error('Erro completo ao confirmar depósito:', error);
      toast({
        title: "Erro",
        description: `Erro ao processar depósito: ${error.message || 'Erro desconhecido'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Confirmar Depósito - {currency}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="amount">Valor do Depósito</Label>
          <Input
            id="amount"
            type="number"
            placeholder={`Valor em ${currency}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Atenção:</strong> Após confirmar, seu depósito será enviado para aprovação do administrador. 
            Você será notificado quando for aprovado.
          </p>
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Voltar
          </Button>
          <Button 
            onClick={handleConfirmDeposit} 
            disabled={loading || !amount || Number(amount) <= 0}
            className="flex-1"
          >
            {loading ? 'Processando...' : 'Confirmar Depósito'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepositForm;
