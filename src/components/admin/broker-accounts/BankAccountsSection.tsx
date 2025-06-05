
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();

  const [form, setForm] = useState<BankAccountForm>({
    bank_name: '',
    account_number: '',
    account_holder: '',
    is_active: true
  });

  const saveAccount = async () => {
    try {
      if (editing) {
        const updatedAccounts = accounts.map(acc => 
          acc.id === editing.id 
            ? { ...acc, ...form, id: editing.id, created_at: editing.created_at }
            : acc
        );
        onAccountsChange(updatedAccounts);
        toast({ title: "Conta bancária atualizada" });
      } else {
        const newAccount: BankAccount = {
          ...form,
          id: Date.now().toString(),
          created_at: new Date().toISOString()
        };
        onAccountsChange([...accounts, newAccount]);
        toast({ title: "Conta bancária adicionada" });
      }
      resetForm();
    } catch (error) {
      console.error('Error saving bank account:', error);
      toast({
        title: "Erro ao salvar conta",
        description: "Não foi possível salvar a conta bancária",
        variant: "destructive"
      });
    }
  };

  const deleteAccount = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta conta bancária?')) return;

    try {
      onAccountsChange(accounts.filter(acc => acc.id !== id));
      toast({ title: "Conta bancária excluída" });
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
