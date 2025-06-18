
import React from 'react';
import { Button } from '@/components/ui/button';

interface DepositFormActionsProps {
  loading: boolean;
  onCancel: () => void;
}

const DepositFormActions: React.FC<DepositFormActionsProps> = ({
  loading,
  onCancel
}) => {
  return (
    <div className="flex gap-3 pt-4">
      <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
        Cancelar
      </Button>
      <Button type="submit" disabled={loading} className="flex-1">
        {loading ? 'Processando...' : 'Confirmar Depósito'}
      </Button>
    </div>
  );
};

export default DepositFormActions;
