
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  phone: string;
  created_at: string;
  level?: {
    level_name: string;
    daily_quantifications: number;
  };
  role?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const levels = ['BitcoinL1', 'BitcoinL2', 'BitcoinL3', 'BitcoinL4', 'BitcoinL5', 'BitcoinL6'];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Buscar usuários da tabela auth via API
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Buscar níveis de usuários
      const { data: userLevels, error: levelsError } = await supabase
        .from('user_levels')
        .select('*');

      if (levelsError) throw levelsError;

      // Buscar roles de usuários
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Combinar dados
      const combinedUsers = profiles.map(profile => ({
        id: profile.id,
        email: profile.username || 'N/A',
        phone: 'N/A', // Será necessário implementar forma de buscar phone
        created_at: profile.created_at,
        level: userLevels.find(level => level.user_id === profile.id),
        role: userRoles.find(role => role.user_id === profile.id)?.role || 'user'
      }));

      setUsers(combinedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserLevel = async (userId: string, levelName: string, dailyQuantifications: number) => {
    try {
      const { error } = await supabase
        .from('user_levels')
        .upsert({
          user_id: userId,
          level_name: levelName,
          daily_quantifications: dailyQuantifications,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Nível atualizado",
        description: "O nível do usuário foi atualizado com sucesso"
      });

      fetchUsers();
    } catch (error) {
      console.error('Error updating user level:', error);
      toast({
        title: "Erro ao atualizar nível",
        description: "Não foi possível atualizar o nível do usuário",
        variant: "destructive"
      });
    }
  };

  const removeUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja remover este usuário?')) {
      return;
    }

    try {
      // Remover role do usuário
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (roleError) throw roleError;

      // Remover nível do usuário
      const { error: levelError } = await supabase
        .from('user_levels')
        .delete()
        .eq('user_id', userId);

      if (levelError) throw levelError;

      toast({
        title: "Usuário removido",
        description: "O usuário foi removido com sucesso"
      });

      fetchUsers();
    } catch (error) {
      console.error('Error removing user:', error);
      toast({
        title: "Erro ao remover usuário",
        description: "Não foi possível remover o usuário",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Carregando usuários...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestão de Usuários</CardTitle>
        <div className="flex gap-4">
          <Input
            placeholder="Buscar por email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium">{user.email}</div>
                <div className="text-sm text-gray-500">{user.phone}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                    {user.role === 'admin' ? 'Admin' : 'Usuário'}
                  </Badge>
                  {user.level && (
                    <Badge variant="outline">
                      {user.level.level_name} - {user.level.daily_quantifications} quantificações/dia
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Select
                  defaultValue={user.level?.level_name || 'BitcoinL1'}
                  onValueChange={(levelName) => {
                    const dailyQuantifications = levels.indexOf(levelName) + 1;
                    updateUserLevel(user.id, levelName, dailyQuantifications);
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  type="number"
                  placeholder="Quantificações"
                  defaultValue={user.level?.daily_quantifications || 1}
                  className="w-24"
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value > 0) {
                      updateUserLevel(user.id, user.level?.level_name || 'BitcoinL1', value);
                    }
                  }}
                />
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeUser(user.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
