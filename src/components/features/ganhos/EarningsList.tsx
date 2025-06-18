
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Earning {
  id: string;
  amount: number;
  currency: string;
  created_at: string;
  description: string;
}

interface EarningsListProps {
  earnings: Earning[];
}

const EarningsList: React.FC<EarningsListProps> = ({ earnings }) => {
  if (earnings.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Nenhum ganho registrado ainda.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Seus ganhos de quantificação aparecerão aqui.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Ganhos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {earnings.map((earning) => (
            <div
              key={earning.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium">{earning.description}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(earning.created_at), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </p>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  +{earning.amount.toFixed(2)} {earning.currency}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EarningsList;
