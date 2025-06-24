
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UserDeposit {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    full_name: string;
  } | null;
}

interface DepositTableProps {
  deposits: UserDeposit[];
  updating: string | null;
  onUpdateStatus: (depositId: string, status: string) => void;
}

const DepositTable: React.FC<DepositTableProps> = ({
  deposits,
  updating,
  onUpdateStatus
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuário</TableHead>
          <TableHead>ID do Usuário</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Moeda</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {deposits.map((deposit) => (
          <TableRow key={deposit.id}>
            <TableCell>
              <div>
                <p className="font-medium">
                  {deposit.profiles?.full_name || deposit.profiles?.username || 'Usuário'}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                {deposit.user_id}
              </code>
            </TableCell>
            <TableCell className="font-medium">
              {deposit.amount}
            </TableCell>
            <TableCell>{deposit.currency}</TableCell>
            <TableCell>
              {deposit.description || '-'}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {deposit.status === 'approved' && <CheckCircle className="h-4 w-4 text-green-600" />}
                {deposit.status === 'rejected' && <XCircle className="h-4 w-4 text-red-600" />}
                {deposit.status === 'pending' && <Clock className="h-4 w-4 text-yellow-600" />}
                <Badge className={
                  deposit.status === 'approved' ? "bg-green-100 text-green-800" :
                  deposit.status === 'rejected' ? "bg-red-100 text-red-800" :
                  "bg-yellow-100 text-yellow-800"
                }>
                  {deposit.status === 'approved' ? 'Aprovado' :
                   deposit.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                </Badge>
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                <p>{new Date(deposit.created_at).toLocaleDateString('pt-BR')}</p>
                <p className="text-muted-foreground text-xs">
                  {new Date(deposit.created_at).toLocaleTimeString('pt-BR')}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-2 flex-wrap">
                {deposit.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => onUpdateStatus(deposit.id, 'approved')}
                      disabled={updating === deposit.id}
                    >
                      {updating === deposit.id ? '...' : 'Aprovar'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateStatus(deposit.id, 'rejected')}
                      disabled={updating === deposit.id}
                    >
                      {updating === deposit.id ? '...' : 'Rejeitar'}
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DepositTable;
