
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DollarSign, Banknote } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface DepositFormProps {
  selectedMethod: 'bank' | 'crypto';
  selectedAccount?: any;
  onCancel: () => void;
  onSuccess: () => void;
}

const DepositForm: React.FC<DepositFormProps> = ({
  selectedMethod,
  selectedAccount,
  onCancel,
  onSuccess
}) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Por favor, insira um valor válido');
      return;
    }

    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return;
    }

    setLoading(true);

    try {
      // Determine currency based on method
      const currency = selectedMethod === 'bank' ? 'AKZ' : 'USDT';
      
      // Create deposit record
      const { error: depositError } = await supabase
        .from('user_deposits')
        .insert([
          {
            user_id: user.id,
            amount: parseFloat(amount),
            currency: currency,
            description: description || `Depósito via ${selectedMethod === 'bank' ? 'Banco' : 'USDT'}`,
            status: 'pending'
          }
        ]);

      if (depositError) throw depositError;

      // Also create a transaction record for backward compatibility
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user.id,
            amount: parseFloat(amount),
            currency: currency,
            type: 'deposit',
            description: description || `Depósito via ${selectedMethod === 'bank' ? 'Banco' : 'USDT'}`,
            status: 'pending'
          }
        ]);

      if (transactionError) throw transactionError;

      toast.success('Depósito registrado com sucesso! Aguarde a aprovação do administrador.');
      setAmount('');
      setDescription('');
      onSuccess();
    } catch (error) {
      console.error('Erro ao registrar depósito:', error);
      toast.error('Erro ao registrar depósito. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const currency = selectedMethod === 'bank' ? 'AKZ' : 'USDT';
  const currencySymbol = selectedMethod === 'bank' ? 'Kz' : '$';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {selectedMethod === 'bank' ? <Banknote className="h-5 w-5" /> : <DollarSign className="h-5 w-5" />}
          Confirmar Depósito - {selectedMethod === 'bank' ? 'Banco' : 'USDT'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {selectedAccount && (
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Conta Selecionada:</h4>
              {selectedMethod === 'bank' ? (
                <div className="text-sm">
                  <p><strong>Banco:</strong> {selectedAccount.bank_name}</p>
                  <p><strong>Conta:</strong> {selectedAccount.account_number}</p>
                  <p><strong>Titular:</strong> {selectedAccount.account_holder}</p>
                </div>
              ) : (
                <div className="text-sm">
                  <p><strong>Carteira:</strong> {selectedAccount.wallet_address}</p>
                  <p><strong>Rede:</strong> {selectedAccount.network}</p>
                </div>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="amount">Valor ({currency})</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder={`0.00 ${currencySymbol}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pr-12"
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                {currencySymbol}
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Adicione uma descrição para este depósito..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Instruções:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Realize a transferência para a conta/carteira selecionada</li>
              <li>• Certifique-se de que o valor transferido corresponde ao informado</li>
              <li>• Após confirmar, o depósito ficará pendente de aprovação</li>
              <li>• Você pode acompanhar o status na seção de transações</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Processando...' : 'Confirmar Depósito'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DepositForm;
