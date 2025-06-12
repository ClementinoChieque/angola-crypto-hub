
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard } from 'lucide-react';

const BankAccountForm: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [bankForm, setBankForm] = useState({
    bank_name: '',
    account_number: '',
    account_holder: ''
  });

  const handleBankAccountSubmit = async () => {
    if (!bankForm.bank_name || !bankForm.account_number || !bankForm.account_holder) {
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
        .from('user_bank_accounts' as any)
        .insert({
          user_id: user?.id,
          bank_name: bankForm.bank_name,
          account_number: bankForm.account_number,
          account_holder: bankForm.account_holder,
          currency: 'AKZ'
        });

      if (error) throw error;

      toast({
        title: "Conta bancária adicionada",
        description: "Sua conta bancária foi adicionada com sucesso"
      });

      setBankForm({ bank_name: '', account_number: '', account_holder: '' });
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
          value={bankForm.bank_name}
          onChange={(e) => setBankForm({ ...bankForm, bank_name: e.target.value })}
          placeholder="Ex: Banco BAI"
          disabled={submitting}
        />
      </div>
      
      <div>
        <Label htmlFor="account_holder">Nome Completo (Titular da Conta)</Label>
        <Input
          id="account_holder"
          value={bankForm.account_holder}
          onChange={(e) => setBankForm({ ...bankForm, account_holder: e.target.value })}
          placeholder="Seu nome completo"
          disabled={submitting}
        />
      </div>
      
      <div>
        <Label htmlFor="account_number">Número da Conta</Label>
        <Input
          id="account_number"
          value={bankForm.account_number}
          onChange={(e) => setBankForm({ ...bankForm, account_number: e.target.value })}
          placeholder="Número da sua conta bancária"
          disabled={submitting}
        />
      </div>
      
      <Button 
        onClick={handleBankAccountSubmit}
        disabled={submitting}
        className="w-full"
      >
        {submitting ? "Adicionando..." : "Adicionar Conta Bancária"}
      </Button>
    </div>
  );
};

export default BankAccountForm;
