
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { CRYPTO_COLORS } from './types';
import { getCryptoDisplayName, formatPrice } from './utils';
import { HistoricalDataPoint } from './types';

interface PerformanceComparisonProps {
  processedData: any[];
  selectedCryptos: string[];
  timeRange: string;
}

const PerformanceComparison: React.FC<PerformanceComparisonProps> = ({
  processedData,
  selectedCryptos,
  timeRange
}) => {
  const performanceData = useMemo(() => {
    if (!processedData || processedData.length < 2) return [];

    const firstData = processedData[0];
    const lastData = processedData[processedData.length - 1];

    return selectedCryptos.map(cryptoId => {
      const startPrice = firstData[cryptoId];
      const endPrice = lastData[cryptoId];
      
      if (!startPrice || !endPrice) return null;
      
      const percentChange = ((endPrice - startPrice) / startPrice) * 100;
      const priceChange = endPrice - startPrice;
      
      return {
        cryptoId,
        name: getCryptoDisplayName(cryptoId),
        startPrice,
        endPrice,
        percentChange,
        priceChange,
        color: CRYPTO_COLORS[cryptoId as keyof typeof CRYPTO_COLORS]
      };
    }).filter(Boolean);
  }, [processedData, selectedCryptos]);

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case '1d': return '24h';
      case '7d': return '7 dias';
      case '30d': return '30 dias';
      default: return range;
    }
  };

  if (!performanceData.length) return null;

  return (
    <Card className="p-3 md:p-4 mt-3 md:mt-4">
      <h4 className="font-semibold text-sm md:text-base mb-3">
        Performance ({getTimeRangeLabel(timeRange)})
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
        {performanceData.map((crypto) => {
          const isPositive = crypto.percentChange >= 0;
          
          return (
            <div
              key={crypto.cryptoId}
              className="flex items-center justify-between p-2 md:p-3 rounded-lg border"
              style={{ borderColor: crypto.color + '20' }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: crypto.color }}
                />
                <span className="font-medium text-xs md:text-sm">{crypto.name}</span>
              </div>
              
              <div className="text-right">
                <div className="text-xs md:text-sm font-mono">
                  ${formatPrice(crypto.endPrice)}
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    isPositive 
                      ? 'text-green-600 border-green-200 bg-green-50' 
                      : 'text-red-600 border-red-200 bg-red-50'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {isPositive ? '+' : ''}{crypto.percentChange.toFixed(2)}%
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default PerformanceComparison;
