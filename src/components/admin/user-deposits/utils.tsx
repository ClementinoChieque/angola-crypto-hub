
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800">Rejeitado</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'rejected':
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-yellow-600" />;
  }
};
