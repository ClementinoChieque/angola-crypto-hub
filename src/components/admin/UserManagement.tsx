
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus } from 'lucide-react';
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
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: '244947896752',
      phone: '+244947896752',
      created_at: new Date().toISOString(),
      level: {
        level_name: 'BitcoinL1',
        daily_quantifications: 1
      },
      role: 'admin'
    },
    {
      id: '2',
      email: 'user@example.com',
      phone: '+244999999999',
      created_at: new Date().toISOString(),
      level: {
        level_name: 'BitcoinL2',
        daily_quantifications: 2
      },
      role: 'user'
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const levels = ['BitcoinL1', 'BitcoinL2', 'BitcoinL3', 'BitcoinL4', 'BitcoinL5', 'BitcoinL6'];

  const updateUserLevel = async (userId: string, levelName: string, dailyQuantifications: number) => {
    try {
      setUsers(prev => prev.map(user =>
        user.id === userId
          ? {
              ...user,
              level: {
                level_name: levelName,
                daily_quantifications: dailyQuantifications
              }
            }
          : user
      ));

      toast({
        title: "Nível atualizado",
        description: "O nível do usuário foi atualizado com sucesso"
      });
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
      setUsers(prev => prev.filter(user => user.id !== userId));

      toast({
        title: "Usuário removido",
        description: "O usuário foi removido com sucesso"
      });
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
