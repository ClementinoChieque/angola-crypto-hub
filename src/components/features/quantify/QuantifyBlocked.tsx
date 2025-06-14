
import React from 'react';
import { AlertCircle } from 'lucide-react';

const QuantifyBlocked: React.FC = () => {
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center max-w-md">
      <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
      <h3 className="font-medium text-orange-800 mb-1">Quantificação Bloqueada</h3>
      <p className="text-sm text-orange-700">
        Para ativar a quantificação, envie um comprovativo de pagamento na seção "Upload de Comprovativo"
      </p>
    </div>
  );
};

export default QuantifyBlocked;
