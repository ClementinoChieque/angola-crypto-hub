
import React from 'react';

export const withdrawalStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return <span className="rounded bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs">Pendente</span>;
    case 'approved':
      return <span className="rounded bg-green-100 text-green-700 px-2 py-0.5 text-xs">Aprovado</span>;
    case 'rejected':
      return <span className="rounded bg-red-100 text-red-700 px-2 py-0.5 text-xs">Rejeitado</span>;
    case 'completed':
      return <span className="rounded bg-blue-100 text-blue-700 px-2 py-0.5 text-xs">Completo</span>;
    default:
      return <span className="text-xs">-</span>;
  }
};
