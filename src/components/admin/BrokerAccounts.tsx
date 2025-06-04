
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, CreditCard, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BankAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  is_active: boolean;
  created_at: string;
}

interface UsdtWallet {
  id: string;
  wallet_address: string;
  network: string;
  is_active: boolean;
  created_at: string;
}

const BrokerAccounts: React.FC = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      bank_name: 'Banco BAI',
      account_number: '123456789',
      account_holder: 'Bitget12 Angola',
      is_active: true,
      created_at: new Date().toISOString()
    }
  ]);
  
  const [usdtWallets, setUsdtWallets] = useState<UsdtWallet[]>([
    {
      id: '1',
      wallet_address: 'TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax',
      network: 'TRC-20',
      is_active: true,
      created_at: new Date().toISOString()
    }
  ]);

  const [showBankForm, setShowBankForm] = useState(false);
  const [showWalletForm, setShowWalletForm] = useState(false);
  const [editingBank, setEditingBank] = useState<BankAccount | null>(null);
  const [editingWallet, setEditingWallet] = useState<UsdtWallet | null>(null);
  const { toast } = useToast();

  const [bankForm, setBankForm] = useState({
    bank_name: '',
    account_number: '',
    account_holder: '',
    is_active: true
  });

  const [walletForm, setWalletForm] = useState({
    wallet_address: '',
    network: 'TRC-20',
    is_active: true
  });

  const saveBankAccount = async () => {
    try {
      if (editingBank) {
        setBankAccounts(prev => prev.map(acc => 
          acc.id === editingBank.id 
            ? { ...acc, ...bankForm, id: editingBank.id, created_at: editingBank.created_at }
            : acc
        ));
        toast({ title: "Conta bancária atualizada" });
      } else {
        const newAccount: BankAccount = {
          ...bankForm,
          id: Date.now().toString(),
          created_at: new Date().toISOString()
        };
        setBankAccounts(prev => [...prev, newAccount]);
        toast({ title: "Conta bancária adicionada" });
      }

      resetBankForm();
    } catch (error) {
      console.error('Error saving bank account:', error);
      toast({
        title: "Erro ao salvar conta",
        description: "Não foi possível salvar a conta bancária",
        variant: "destructive"
      });
    }
  };

  const saveUsdtWallet = async () => {
    try {
      if (editingWallet) {
        setUsdtWallets(prev => prev.map(wallet => 
          wallet.id === editingWallet.id 
            ? { ...wallet, ...walletForm, id: editingWallet.id, created_at: editingWallet.created_at }
            : wallet
        ));
        toast({ title: "Carteira USDT atualizada" });
      } else {
        const newWallet: UsdtWallet = {
          ...walletForm,
          id: Date.now().toString(),
          created_at: new Date().toISOString()
        };
        setUsdtWallets(prev => [...prev, newWallet]);
        toast({ title: "Carteira USDT adicionada" });
      }

      resetWalletForm();
    } catch (error) {
      console.error('Error saving USDT wallet:', error);
      toast({
        title: "Erro ao salvar carteira",
        description: "Não foi possível salvar a carteira USDT",
        variant: "destructive"
      });
    }
  };

  const deleteBankAccount = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta conta bancária?')) return;

    try {
      setBankAccounts(prev => prev.filter(acc => acc.id !== id));
      toast({ title: "Conta bancária excluída" });
    } catch (error) {
      console.error('Error deleting bank account:', error);
      toast({
        title: "Erro ao excluir conta",
        variant: "destructive"
      });
    }
  };

  const deleteUsdtWallet = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta carteira USDT?')) return;

    try {
      setUsdtWallets(prev => prev.filter(wallet => wallet.id !== id));
      toast({ title: "Carteira USDT excluída" });
    } catch (error) {
      console.error('Error deleting USDT wallet:', error);
      toast({
        title: "Erro ao excluir carteira",
        variant: "destructive"
      });
    }
  };

  const resetBankForm = () => {
    setBankForm({ bank_name: '', account_number: '', account_holder: '', is_active: true });
    setShowBankForm(false);
    setEditingBank(null);
  };

  const resetWalletForm = () => {
    setWalletForm({ wallet_address: '', network: 'TRC-20', is_active: true });
    setShowWalletForm(false);
    setEditingWallet(null);
  };

  const startEditBank = (account: BankAccount) => {
    setBankForm({
      bank_name: account.bank_name,
      account_number: account.account_number,
      account_holder: account.account_holder,
      is_active: account.is_active
    });
    setEditingBank(account);
    setShowBankForm(true);
  };

  const startEditWallet = (wallet: UsdtWallet) => {
    setWalletForm({
      wallet_address: wallet.wallet_address,
      network: wallet.network,
      is_active: wallet.is_active
    });
    setEditingWallet(wallet);
    setShowWalletForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Contas Bancárias */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <CreditCard size={24} />
              Contas Bancárias da Corretora
            </CardTitle>
            <Button onClick={() => setShowBankForm(true)}>
              <Plus size={16} className="mr-1" />
              Adicionar Conta
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showBankForm && (
            <div className="border rounded-lg p-4 mb-4 bg-gray-50">
              <h3 className="font-medium mb-3">
                {editingBank ? 'Editar Conta Bancária' : 'Nova Conta Bancária'}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bank_name">Nome do Banco</Label>
                  <Input
                    id="bank_name"
                    value={bankForm.bank_name}
                    onChange={(e) => setBankForm({ ...bankForm, bank_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="account_holder">Titular da Conta</Label>
                  <Input
                    id="account_holder"
                    value={bankForm.account_holder}
                    onChange={(e) => setBankForm({ ...bankForm, account_holder: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="account_number">Número da Conta</Label>
                  <Input
                    id="account_number"
                    value={bankForm.account_number}
                    onChange={(e) => setBankForm({ ...bankForm, account_number: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="is_active"
                    checked={bankForm.is_active}
                    onCheckedChange={(checked) => setBankForm({ ...bankForm, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Conta Ativa</Label>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={saveBankAccount}>
                  {editingBank ? 'Atualizar' : 'Adicionar'}
                </Button>
                <Button variant="outline" onClick={resetBankForm}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {bankAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium">{account.bank_name}</div>
                  <div className="text-sm text-gray-500">
                    {account.account_holder} - {account.account_number}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={account.is_active ? 'default' : 'secondary'}>
                    {account.is_active ? 'Ativa' : 'Inativa'}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => startEditBank(account)}>
                    <Edit size={14} />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteBankAccount(account.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Carteiras USDT */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Wallet size={24} />
              Carteiras USDT da Corretora
            </CardTitle>
            <Button onClick={() => setShowWalletForm(true)}>
              <Plus size={16} className="mr-1" />
              Adicionar Carteira
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showWalletForm && (
            <div className="border rounded-lg p-4 mb-4 bg-gray-50">
              <h3 className="font-medium mb-3">
                {editingWallet ? 'Editar Carteira USDT' : 'Nova Carteira USDT'}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="wallet_address">Endereço da Carteira</Label>
                  <Input
                    id="wallet_address"
                    value={walletForm.wallet_address}
                    onChange={(e) => setWalletForm({ ...walletForm, wallet_address: e.target.value })}
                    placeholder="TRC-20 wallet address"
                  />
                </div>
                <div>
                  <Label htmlFor="network">Rede</Label>
                  <Input
                    id="network"
                    value={walletForm.network}
                    onChange={(e) => setWalletForm({ ...walletForm, network: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="wallet_active"
                    checked={walletForm.is_active}
                    onCheckedChange={(checked) => setWalletForm({ ...walletForm, is_active: checked })}
                  />
                  <Label htmlFor="wallet_active">Carteira Ativa</Label>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={saveUsdtWallet}>
                  {editingWallet ? 'Atualizar' : 'Adicionar'}
                </Button>
                <Button variant="outline" onClick={resetWalletForm}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {usdtWallets.map((wallet) => (
              <div key={wallet.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium font-mono text-sm">{wallet.wallet_address}</div>
                  <div className="text-sm text-gray-500">{wallet.network}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={wallet.is_active ? 'default' : 'secondary'}>
                    {wallet.is_active ? 'Ativa' : 'Inativa'}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => startEditWallet(wallet)}>
                    <Edit size={14} />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteUsdtWallet(wallet.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrokerAccounts;
