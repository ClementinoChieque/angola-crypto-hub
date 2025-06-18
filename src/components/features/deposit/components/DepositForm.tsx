
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Banknote } from 'lucide-react';
import { useDepositForm } from './hooks/useDepositForm';
import AccountDetails from './AccountDetails';
import AmountInput from './AmountInput';
import DescriptionInput from './DescriptionInput';
import DepositInstructions from './DepositInstructions';
import DepositFormActions from './DepositFormActions';

interface DepositFormProps {
  selectedMethod: 'bank' | 'crypto';
  selectedAccount?: any;
  onCancel: () => void;
  onSuccess: () => void;
}

const DepositForm: React.FC<DepositFormProps> = ({
  selectedMethod,
  selectedAccount,
  onCancel,
  onSuccess
}) => {
  const {
    amount,
    setAmount,
    description,
    setDescription,
    loading,
    handleSubmit,
  } = useDepositForm({ onSuccess });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {selectedMethod === 'bank' ? <Banknote className="h-5 w-5" /> : <DollarSign className="h-5 w-5" />}
          Confirmar Depósito - {selectedMethod === 'bank' ? 'Banco' : 'USDT'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AccountDetails 
            selectedMethod={selectedMethod} 
            selectedAccount={selectedAccount} 
          />

          <AmountInput
            selectedMethod={selectedMethod}
            amount={amount}
            onAmountChange={setAmount}
          />

          <DescriptionInput
            description={description}
            onDescriptionChange={setDescription}
          />

          <DepositInstructions />

          <DepositFormActions
            loading={loading}
            onCancel={onCancel}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default DepositForm;
