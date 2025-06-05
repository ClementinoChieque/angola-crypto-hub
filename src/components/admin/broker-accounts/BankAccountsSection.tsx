
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BankAccount, BankAccountForm } from './types';
import BankAccountFormComponent from './BankAccountForm';
import BankAccountsList from './BankAccountsList';

interface BankAccountsSectionProps {
  accounts: BankAccount[];
  onAccountsChange: (accounts: BankAccount[]) => void;
}

const BankAccountsSection: React.FC<BankAccountsSectionProps> = ({
  accounts,
  onAccountsChange
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BankAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState<BankAccountForm>({
    bank_name: '',
    account_number: '',
    account_holder: '',
    is_active: true
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('broker_bank_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedAccounts = data?.map(account => ({
        id: account.id,
        bank_name: account.bank_name,
        account_number: account.account_number,
        account_holder: account.account_holder,
        is_active: account.is_active,
        created_at: account.created_at
      })) || [];

      onAccountsChange(formattedAccounts);
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      toast({
        title: "Erro ao carregar contas",
        description: "Não foi possível carregar as contas bancárias",
        variant: "destructive"
      });
    }
  };

  const saveAccount = async () => {
    setLoading(true);
    try {
      if (editing) {
        const { error } = await supabase
          .from('broker_bank_accounts')
          .update({
            bank_name: form.bank_name,
            account_number: form.account_number,
            account_holder: form.account_holder,
            is_active: form.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editing.id);

        if (error) throw error;
        toast({ title: "Conta bancária atualizada" });
      } else {
        const { error } = await supabase
          .from('broker_bank_accounts')
          .insert({
            bank_name: form.bank_name,
            account_number: form.account_number,
            account_holder: form.account_holder,
            is_active: form.is_active
          });

        if (error) throw error;
        toast({ title: "Conta bancária adicionada" });
      }
      
      await fetchAccounts();
      resetForm();
    } catch (error) {
      console.error('Error saving bank account:', error);
      toast({
        title: "Erro ao salvar conta",
        description: "Não foi possível salvar a conta bancária",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta conta bancária?')) return;

    try {
      const { error } = await supabase
        .from('broker_bank_accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({ title: "Conta bancária excluída" });
      await fetchAccounts();
    } catch (error) {
      console.error('Error deleting bank account:', error);
      toast({
        title: "Erro ao excluir conta",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setForm({ bank_name: '', account_number: '', account_holder: '', is_active: true });
    setShowForm(false);
    setEditing(null);
  };

  const startEdit = (account: BankAccount) => {
    setForm({
      bank_name: account.bank_name,
      account_number: account.account_number,
      account_holder: account.account_holder,
      is_active: account.is_active
    });
    setEditing(account);
    setShowForm(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <CardTitle className="flex items-center gap-2">
            <CreditCard size={24} />
            Contas Bancárias da Corretora
          </CardTitle>
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus size={16} className="mr-1" />
            Adicionar Conta
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <BankAccountFormComponent
            form={form}
            setForm={setForm}
            onSave={saveAccount}
            onCancel={resetForm}
            editing={editing}
            loading={loading}
          />
        )}
        <BankAccountsList
          accounts={accounts}
          onEdit={startEdit}
          onDelete={deleteAccount}
        />
      </CardContent>
    </Card>
  );
};

export default BankAccountsSection;
