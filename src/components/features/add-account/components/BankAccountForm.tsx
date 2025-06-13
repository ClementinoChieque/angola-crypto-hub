
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const bankAccountSchema = z.object({
  bank_name: z.string().min(1, 'Selecione um banco'),
  account_number: z.string().min(5, 'Número da conta deve ter pelo menos 5 dígitos'),
  account_holder: z.string().min(2, 'Nome do titular é obrigatório'),
});

type BankAccountFormData = z.infer<typeof bankAccountSchema>;

const angolaBanks = [
  'BAI - Banco Angolano de Investimentos',
  'BFA - Banco de Fomento Angola',
  'BIC - Banco BIC',
  'BPC - Banco de Poupança e Crédito',
  'BDA - Banco de Desenvolvimento de Angola',
  'Banco Económico',
  'Banco Millennium Atlântico',
  'Banco Sol',
  'Banco Prestígio',
  'Banco Keve'
];

interface BankAccountFormProps {
  onSuccess?: () => void;
}

const BankAccountForm: React.FC<BankAccountFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<BankAccountFormData>({
    resolver: zodResolver(bankAccountSchema)
  });

  const selectedBank = watch('bank_name');

  const onSubmit = async (data: BankAccountFormData) => {
    if (!user?.id) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para adicionar uma conta bancária",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('user_bank_accounts')
        .insert([
          {
            user_id: user.id,
            bank_name: data.bank_name,
            account_number: data.account_number,
            account_holder: data.account_holder,
            currency: 'AKZ'
          }
        ]);

      if (error) {
        throw error;
      }

      toast({
        title: "Conta bancária adicionada",
        description: "Sua conta bancária foi adicionada com sucesso!"
      });

      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error adding bank account:', error);
      toast({
        title: "Erro ao adicionar conta",
        description: "Não foi possível adicionar sua conta bancária. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="bank_name">Banco</Label>
        <Select onValueChange={(value) => setValue('bank_name', value)} value={selectedBank}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o banco" />
          </SelectTrigger>
          <SelectContent>
            {angolaBanks.map((bank) => (
              <SelectItem key={bank} value={bank}>
                {bank}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.bank_name && (
          <p className="text-sm text-red-500 mt-1">{errors.bank_name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="account_number">Número da Conta</Label>
        <Input
          id="account_number"
          {...register('account_number')}
          placeholder="Digite o número da conta"
        />
        {errors.account_number && (
          <p className="text-sm text-red-500 mt-1">{errors.account_number.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="account_holder">Nome do Titular</Label>
        <Input
          id="account_holder"
          {...register('account_holder')}
          placeholder="Digite o nome do titular da conta"
        />
        {errors.account_holder && (
          <p className="text-sm text-red-500 mt-1">{errors.account_holder.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Adicionando...' : 'Adicionar Conta Bancária'}
      </Button>
    </form>
  );
};

export default BankAccountForm;
