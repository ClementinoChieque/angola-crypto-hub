
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="outline" className="text-yellow-600 border-yellow-300">
          <Clock size={12} className="mr-1" />
          Pendente
        </Badge>
      );
    case 'approved':
      return (
        <Badge variant="outline" className="text-green-600 border-green-300">
          <CheckCircle size={12} className="mr-1" />
          Aprovado
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="outline" className="text-red-600 border-red-300">
          <XCircle size={12} className="mr-1" />
          Rejeitado
        </Badge>
      );
    default:
      return <Badge variant="outline">-</Badge>;
  }
};
