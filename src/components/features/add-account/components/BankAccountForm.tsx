
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard } from 'lucide-react';
import type { BankAccountFormData } from '../types';

const BankAccountForm: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState<BankAccountFormData>({
    bank_name: '',
    account_number: '',
    account_holder: ''
  });

  const handleSubmit = async () => {
    if (!formData.bank_name || !formData.account_number || !formData.account_holder) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('user_bank_accounts')
        .insert({
          user_id: user?.id,
          bank_name: formData.bank_name,
          account_number: formData.account_number,
          account_holder: formData.account_holder,
          currency: 'AKZ'
        });

      if (error) throw error;

      toast({
        title: "Conta bancária adicionada",
        description: "Sua conta bancária foi adicionada com sucesso"
      });

      setFormData({ bank_name: '', account_number: '', account_holder: '' });
    } catch (error) {
      console.error('Error adding bank account:', error);
      toast({
        title: "Erro ao adicionar conta",
        description: "Não foi possível adicionar a conta bancária",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard size={20} />
        <h3 className="font-medium">Adicionar Conta Bancária (AKZ)</h3>
      </div>
      
      <div>
        <Label htmlFor="bank_name">Nome do Banco</Label>
        <Input
          id="bank_name"
          value={formData.bank_name}
          onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
          placeholder="Ex: Banco BAI"
          disabled={submitting}
        />
      </div>
      
      <div>
        <Label htmlFor="account_holder">Nome Completo (Titular da Conta)</Label>
        <Input
          id="account_holder"
          value={formData.account_holder}
          onChange={(e) => setFormData({ ...formData, account_holder: e.target.value })}
          placeholder="Seu nome completo"
          disabled={submitting}
        />
      </div>
      
      <div>
        <Label htmlFor="account_number">Número da Conta</Label>
        <Input
          id="account_number"
          value={formData.account_number}
          onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
          placeholder="Número da sua conta bancária"
          disabled={submitting}
        />
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-yellow-800 text-sm">
          <strong>Observação:</strong> Só pode adicionar conta bancária que usou no depósito.
        </p>
      </div>
      
      <Button 
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full"
      >
        {submitting ? "Adicionando..." : "Adicionar Conta Bancária"}
      </Button>
    </div>
  );
};

export default BankAccountForm;
