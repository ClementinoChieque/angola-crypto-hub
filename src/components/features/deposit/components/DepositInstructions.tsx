
import React from 'react';

const DepositInstructions: React.FC = () => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h4 className="font-medium text-blue-900 mb-2">Instruções:</h4>
      <ul className="text-sm text-blue-800 space-y-1">
        <li>• Realize a transferência para a conta/carteira selecionada</li>
        <li>• Certifique-se de que o valor transferido corresponde ao informado</li>
        <li>• Após confirmar, o depósito ficará pendente de aprovação</li>
        <li>• Você pode acompanhar o status na seção de transações</li>
      </ul>
    </div>
  );
};

export default DepositInstructions;
