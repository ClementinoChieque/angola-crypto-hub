
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { UsdtWallet, UsdtWalletForm } from './types';

interface UsdtWalletFormProps {
  form: UsdtWalletForm;
  setForm: (form: UsdtWalletForm) => void;
  onSave: () => void;
  onCancel: () => void;
  editing: UsdtWallet | null;
}

const UsdtWalletFormComponent: React.FC<UsdtWalletFormProps> = ({
  form,
  setForm,
  onSave,
  onCancel,
  editing
}) => {
  return (
    <div className="border rounded-lg p-4 mb-4 bg-gray-50">
      <h3 className="font-medium mb-3">
        {editing ? 'Editar Carteira USDT' : 'Nova Carteira USDT'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="wallet_address">Endereço da Carteira</Label>
          <Input
            id="wallet_address"
            value={form.wallet_address}
            onChange={(e) => setForm({ ...form, wallet_address: e.target.value })}
            placeholder="TRC-20 wallet address"
          />
        </div>
        <div>
          <Label htmlFor="network">Rede</Label>
          <Input
            id="network"
            value={form.network}
            onChange={(e) => setForm({ ...form, network: e.target.value })}
          />
        </div>
        <div className="flex items-center space-x-2 pt-6">
          <Switch
            id="wallet_active"
            checked={form.is_active}
            onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
          />
          <Label htmlFor="wallet_active">Carteira Ativa</Label>
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

export default UsdtWalletFormComponent;
