
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

const usdtWalletSchema = z.object({
  wallet_address: z.string().min(25, 'Endereço da carteira deve ter pelo menos 25 caracteres'),
  network: z.string().min(1, 'Selecione a rede'),
});

type UsdtWalletFormData = z.infer<typeof usdtWalletSchema>;

const networks = [
  'TRC-20',
  'ERC-20',
  'BEP-20',
];

interface UsdtWalletFormProps {
  onSuccess?: () => void;
}

const UsdtWalletForm: React.FC<UsdtWalletFormProps> = ({ onSuccess }) => {
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
  } = useForm<UsdtWalletFormData>({
    resolver: zodResolver(usdtWalletSchema),
    defaultValues: {
      network: 'TRC-20'
    }
  });

  const selectedNetwork = watch('network');

  const onSubmit = async (data: UsdtWalletFormData) => {
    if (!user?.id) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para adicionar uma carteira USDT",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('user_usdt_wallets')
        .insert([
          {
            user_id: user.id,
            wallet_address: data.wallet_address,
            network: data.network
          }
        ]);

      if (error) {
        throw error;
      }

      toast({
        title: "Carteira USDT adicionada",
        description: "Sua carteira USDT foi adicionada com sucesso!"
      });

      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error adding USDT wallet:', error);
      toast({
        title: "Erro ao adicionar carteira",
        description: "Não foi possível adicionar sua carteira USDT. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="network">Rede</Label>
        <Select onValueChange={(value) => setValue('network', value)} value={selectedNetwork}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a rede" />
          </SelectTrigger>
          <SelectContent>
            {networks.map((network) => (
              <SelectItem key={network} value={network}>
                {network}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.network && (
          <p className="text-sm text-red-500 mt-1">{errors.network.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="wallet_address">Endereço da Carteira</Label>
        <Input
          id="wallet_address"
          {...register('wallet_address')}
          placeholder="Digite o endereço da carteira USDT"
          className="font-mono text-sm"
        />
        {errors.wallet_address && (
          <p className="text-sm text-red-500 mt-1">{errors.wallet_address.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Adicionando...' : 'Adicionar Carteira USDT'}
      </Button>
    </form>
  );
};

export default UsdtWalletForm;
