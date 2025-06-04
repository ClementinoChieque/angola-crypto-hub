
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    default_daily_quantifications: '1',
    withdrawal_fee_usdt: '1',
    withdrawal_fee_akz: '200',
    min_withdrawal_usdt: '10',
    min_withdrawal_akz: '5000',
    platform_maintenance: 'false',
    maintenance_message: ''
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Simulate saving - in a real app this would save to the database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configurações salvas",
        description: "Todas as configurações foram atualizadas com sucesso"
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings size={24} />
          Configurações Administrativas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configurações de Quantificação */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-4">Configurações de Quantificação</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="default_daily_quantifications">
                Quantificações Diárias Padrão
              </Label>
              <Input
                id="default_daily_quantifications"
                type="number"
                value={settings.default_daily_quantifications}
                onChange={(e) => updateSetting('default_daily_quantifications', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Configurações de Saque */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-4">Configurações de Saque</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="withdrawal_fee_usdt">Taxa de Saque USDT</Label>
              <Input
                id="withdrawal_fee_usdt"
                type="number"
                step="0.01"
                value={settings.withdrawal_fee_usdt}
                onChange={(e) => updateSetting('withdrawal_fee_usdt', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="withdrawal_fee_akz">Taxa de Saque AKZ</Label>
              <Input
                id="withdrawal_fee_akz"
                type="number"
                value={settings.withdrawal_fee_akz}
                onChange={(e) => updateSetting('withdrawal_fee_akz', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="min_withdrawal_usdt">Saque Mínimo USDT</Label>
              <Input
                id="min_withdrawal_usdt"
                type="number"
                step="0.01"
                value={settings.min_withdrawal_usdt}
                onChange={(e) => updateSetting('min_withdrawal_usdt', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="min_withdrawal_akz">Saque Mínimo AKZ</Label>
              <Input
                id="min_withdrawal_akz"
                type="number"
                value={settings.min_withdrawal_akz}
                onChange={(e) => updateSetting('min_withdrawal_akz', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Configurações de Plataforma */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-4">Configurações da Plataforma</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="platform_maintenance">Modo de Manutenção</Label>
              <Input
                id="platform_maintenance"
                value={settings.platform_maintenance}
                onChange={(e) => updateSetting('platform_maintenance', e.target.value)}
                placeholder="true/false"
              />
            </div>
            <div>
              <Label htmlFor="maintenance_message">Mensagem de Manutenção</Label>
              <Input
                id="maintenance_message"
                value={settings.maintenance_message}
                onChange={(e) => updateSetting('maintenance_message', e.target.value)}
                placeholder="Sistema em manutenção..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={saveSettings} disabled={saving}>
            <Save size={16} className="mr-2" />
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSettings;
