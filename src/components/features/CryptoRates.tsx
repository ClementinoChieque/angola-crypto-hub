
import React from 'react';
import { useCryptoRates } from '@/utils/cryptoRates';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bitcoin } from 'lucide-react';

const CryptoRates: React.FC = () => {
  const { rates, isLoading } = useCryptoRates();

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Cotações</h3>
          <div className="flex items-center gap-2">
            <Bitcoin size={18} className="text-amber-500" />
            <span className="text-sm text-muted-foreground">Atualizado em tempo real</span>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted p-3 rounded">
              <p className="text-sm text-muted-foreground">Bitcoin (BTC)</p>
              <p className="font-medium">{rates.btcToUsd.toLocaleString()} USD</p>
              <p className="text-xs text-muted-foreground">
                ≈ {rates.btcToAoc.toLocaleString()} AOcripto
              </p>
            </div>
            
            <div className="bg-muted p-3 rounded">
              <p className="text-sm text-muted-foreground">AOcripto</p>
              <p className="font-medium">1 USDT = {rates.usdtToAoc.toLocaleString()} AOcripto</p>
              <p className="text-xs text-muted-foreground">
                1 AOcripto = {(1/rates.usdtToAoc).toFixed(6)} USDT
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CryptoRates;
