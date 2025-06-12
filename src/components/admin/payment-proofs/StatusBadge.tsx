
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'pending':
      return <Badge variant="secondary"><Clock size={14} className="mr-1" />Pendente</Badge>;
    case 'verified':
      return <Badge variant="default"><CheckCircle size={14} className="mr-1" />Aprovado</Badge>;
    case 'rejected':
      return <Badge variant="destructive"><XCircle size={14} className="mr-1" />Rejeitado</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default StatusBadge;
