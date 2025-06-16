
import React from 'react';
import { Users } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const EmptyState: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="text-center py-8">
      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground">
        {t('language') === 'pt' ? 'Você ainda não convidou ninguém' : "You haven't invited anyone yet"}
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        {t('language') === 'pt' ? 'Use a aba "Convidar" para enviar convites' : 'Use the "Invite" tab to send invites'}
      </p>
    </div>
  );
};

export default EmptyState;
