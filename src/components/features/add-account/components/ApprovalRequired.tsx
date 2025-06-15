
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

const ApprovalRequired: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus size={24} />
          Adicionar Conta
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 font-medium mb-2">Conta não aprovada</p>
            <p className="text-yellow-700 text-sm">
              Você precisa ter sua conta aprovada  para poder adicionar contas bancárias e carteiras.
              Envie um comprovativo de pagamento e aguarde a aprovação.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApprovalRequired;
