
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BankAccount, BankAccountForm } from './types';

interface BankAccountFormProps {
  form: BankAccountForm;
  setForm: (form: BankAccountForm) => void;
  onSave: () => void;
  onCancel: () => void;
  editing: BankAccount | null;
}

const BankAccountFormComponent: React.FC<BankAccountFormProps> = ({
  form,
  setForm,
  onSave,
  onCancel,
  editing
}) => {
  return (
    <div className="border rounded-lg p-4 mb-4 bg-gray-50">
      <h3 className="font-medium mb-3">
        {editing ? 'Editar Conta Bancária' : 'Nova Conta Bancária'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bank_name">Nome do Banco</Label>
          <Input
            id="bank_name"
            value={form.bank_name}
            onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="account_holder">Titular da Conta</Label>
          <Input
            id="account_holder"
            value={form.account_holder}
            onChange={(e) => setForm({ ...form, account_holder: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="account_number">Número da Conta</Label>
          <Input
            id="account_number"
            value={form.account_number}
            onChange={(e) => setForm({ ...form, account_number: e.target.value })}
          />
        </div>
        <div className="flex items-center space-x-2 pt-6">
          <Switch
            id="is_active"
            checked={form.is_active}
            onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
          />
          <Label htmlFor="is_active">Conta Ativa</Label>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button onClick={onSave}>
          {editing ? 'Atualizar' : 'Adicionar'}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default BankAccountFormComponent;
