
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Referral } from './types';
import { formatDate, getUserDisplayName, getStatusText } from './utils';
import StatusIcon from './StatusIcon';

interface ReferralsTableProps {
  referrals: Referral[];
}

const ReferralsTable: React.FC<ReferralsTableProps> = ({ referrals }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuário</TableHead>
          <TableHead>Código</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Data do Convite</TableHead>
          <TableHead>Data de Registro</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {referrals.map((referral) => (
          <TableRow key={referral.id}>
            <TableCell className="font-medium">
              {getUserDisplayName(referral)}
            </TableCell>
            <TableCell className="font-mono text-sm">
              {referral.referral_code}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <StatusIcon status={referral.status} />
                <span className="text-sm">
                  {getStatusText(referral.status)}
                </span>
              </div>
            </TableCell>
            <TableCell>
              {formatDate(referral.created_at)}
            </TableCell>
            <TableCell>
              {referral.completed_at ? (
                <span className="text-green-600">
                  {formatDate(referral.completed_at)}
                </span>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ReferralsTable;
