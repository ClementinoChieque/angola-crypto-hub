
import React from 'react';

interface AccountDetailsProps {
  selectedMethod: 'bank' | 'crypto';
  selectedAccount?: any;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({
  selectedMethod,
  selectedAccount
}) => {
  if (!selectedAccount) return null;

  return (
    <div className="p-3 bg-muted rounded-lg">
      <h4 className="font-medium mb-2">Conta Selecionada:</h4>
      {selectedMethod === 'bank' ? (
        <div className="text-sm">
          <p><strong>Banco:</strong> {selectedAccount.bank_name}</p>
          <p><strong>Conta:</strong> {selectedAccount.account_number}</p>
          <p><strong>Titular:</strong> {selectedAccount.account_holder}</p>
        </div>
      ) : (
        <div className="text-sm">
          <p><strong>Carteira:</strong> {selectedAccount.wallet_address}</p>
          <p><strong>Rede:</strong> {selectedAccount.network}</p>
        </div>
      )}
    </div>
  );
};

export default AccountDetails;
