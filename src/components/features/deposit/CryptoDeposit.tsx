import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCryptoRates } from '@/utils/cryptoRates';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface CryptoDepositProps {
  amount: string;
  setAmount: (value: string) => void;
  onDeposit: () => void;
}

interface UsdtWallet {
  id: string;
  wallet_address: string;
  network: string;
  is_active: boolean;
}

const CryptoDeposit: React.FC<CryptoDepositProps> = ({ amount, setAmount, onDeposit }) => {
  const { rates, isLoading } = useCryptoRates();
  const [aocAmount, setAocAmount] = useState<string>('');
  const [activeWallet, setActiveWallet] = useState<UsdtWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Calculate AOcripto equivalent when USDT amount changes
  useEffect(() => {
    if (amount && !isNaN(parseFloat(amount))) {
      const usdtValue = parseFloat(amount);
      const aocValue = usdtValue * rates.usdtToAoc;
      setAocAmount(aocValue.toLocaleString());
    } else {
      setAocAmount('');
    }
  }, [amount, rates.usdtToAoc]);

  // Fetch active USDT wallet from database
  useEffect(() => {
    const fetchActiveWallet = async () => {
      try {
        const { data, error } = await supabase
          .from('broker_usdt_wallets')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching USDT wallet:', error);
          toast({
            title: "Erro ao carregar carteira",
            description: "Não foi possível carregar a carteira USDT",
            variant: "destructive"
          });
        } else if (data) {
          setActiveWallet(data);
        }
      } catch (error) {
        console.error('Error fetching USDT wallet:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveWallet();
  }, [toast]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-crypto-blue mx-auto"></div>
          <p className="text-sm text-muted-foreground mt-2">Carregando carteira...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-muted p-4 rounded-md text-center">
        <p className="text-sm mb-1">
          Endereço da carteira ({activeWallet?.network || 'TRC-20'})
        </p>
        {activeWallet ? (
          <>
            <p className="font-mono bg-white p-2 rounded border select-all break-all">
              {activeWallet.wallet_address}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Envie apenas USDT pela rede {activeWallet.network}
            </p>
          </>
        ) : (
          <p className="text-sm text-red-500">
            Nenhuma carteira USDT ativa disponível no momento
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="amount-usdt">Valor (USDT)</Label>
        <Input
          id="amount-usdt"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {aocAmount && (
          <div className="text-sm text-muted-foreground mt-1">
            Equivalente a <span className="font-medium">{aocAmount} AOcripto</span>
            <span className="block text-xs">Taxa de conversão: 1 USDT = {rates.usdtToAoc} AOcripto</span>
          </div>
        )}
      </div>
      
      <Button 
        onClick={onDeposit}
        className="w-full bg-blue-500 hover:bg-blue-600"
        disabled={!activeWallet}
      >
        {activeWallet ? 'Confirmar Depósito' : 'Carteira Indisponível'}
      </Button>
    </div>
  );
};

export default CryptoDeposit;
