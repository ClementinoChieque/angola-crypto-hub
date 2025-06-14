import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Banknote } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DepositMethod } from './types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface BankDepositProps {
  amount: string;
  setAmount: (value: string) => void;
  onDeposit: (method: DepositMethod) => void;
}

interface BankAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  is_active: boolean;
}

const BankDeposit: React.FC<BankDepositProps> = ({ amount, setAmount, onDeposit }) => {
  const [selectedBankId, setSelectedBankId] = useState<string>('');
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const selectedBankInfo = bankAccounts.find(bank => bank.id === selectedBankId);

  // Fetch active bank accounts from database
  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        const { data, error } = await supabase
          .from('broker_bank_accounts')
          .select('*')
          .eq('is_active', true)
          .order('bank_name', { ascending: true });

        if (error) {
          console.error('Error fetching bank accounts:', error);
          toast({
            title: "Erro ao carregar contas",
            description: "Não foi possível carregar as contas bancárias",
            variant: "destructive"
          });
        } else {
          setBankAccounts(data || []);
          // Auto-select first bank if available
          if (data && data.length > 0) {
            setSelectedBankId(data[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching bank accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBankAccounts();
  }, [toast]);

  const handleDeposit = () => {
    if (selectedBankInfo) {
      // Map bank name to DepositMethod type
      const bankNameToMethod: Record<string, DepositMethod> = {
        'Banco Angolano de Investimentos': 'BAI',
        'BAI': 'BAI',
        'Banco de Fomento Angola': 'BFA',
        'BFA': 'BFA',
        'Banco BIC': 'BIC',
        'BIC': 'BIC',
        'Banco Atlântico': 'ATL',
        'ATL': 'ATL'
      };

      const method = bankNameToMethod[selectedBankInfo.bank_name] || 'BAI';
      onDeposit(method);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-crypto-blue mx-auto"></div>
          <p className="text-sm text-muted-foreground mt-2">Carregando contas bancárias...</p>
        </div>
      </div>
    );
  }

  if (bankAccounts.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <Banknote className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhuma conta bancária disponível no momento</p>
          <p className="text-sm text-muted-foreground mt-1">
            Entre em contato com o suporte para mais informações
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="bank-select">Nome do Banco</Label>
        <Select value={selectedBankId} onValueChange={setSelectedBankId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o banco" />
          </SelectTrigger>
          <SelectContent>
            {bankAccounts.map(bank => (
              <SelectItem key={bank.id} value={bank.id}>
                {bank.bank_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedBankInfo && (
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Banknote size={24} className="text-crypto-blue" />
            <div>
              <h3 className="font-medium">{selectedBankInfo.bank_name}</h3>
              <p className="text-sm text-muted-foreground">
                Titular: {selectedBankInfo.account_holder}
              </p>
              <p className="text-sm text-muted-foreground">
                Conta: {selectedBankInfo.account_number}
              </p>
            </div>
          </div>
        </Card>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="amount-bank">Valor (AKZ)</Label>
        <Input
          id="amount-bank"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      
      <Button 
        onClick={handleDeposit}
        className="w-full bg-blue-500 hover:bg-blue-600"
        disabled={!selectedBankInfo}
      >
        {selectedBankInfo ? 'Confirmar Depósito' : 'Conta Indisponível'}
      </Button>
    </div>
  );
};

export default BankDeposit;
