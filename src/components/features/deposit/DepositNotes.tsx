
import React from 'react';

const DepositNotes: React.FC = () => {
  return (
    <div className="mt-6 text-sm text-muted-foreground">
      <p>Observações:</p>
      <ul className="list-disc pl-5 mt-2">
        <li>Após o depósito, faça o upload do comprovativo.</li>
        <li>O saldo será habilitado após confirmação pelo administrador.</li>
        
      </ul>
    </div>
  );
};

export default DepositNotes;
