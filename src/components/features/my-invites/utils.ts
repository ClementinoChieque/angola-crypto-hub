
import { Referral } from './types';

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const getUserDisplayName = (referral: Referral) => {
  if (referral.invited_email) {
    return referral.invited_email;
  }
  if (referral.invited_phone) {
    return referral.invited_phone;
  }
  return 'Usuário convidado';
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Registrado';
    case 'pending':
      return 'Pendente';
    case 'expired':
      return 'Expirado';
    default:
      return 'Desconhecido';
  }
};
