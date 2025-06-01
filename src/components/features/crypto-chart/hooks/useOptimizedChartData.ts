
import { useMemo } from 'react';
import { HistoricalDataPoint } from '../types';

interface UseOptimizedChartDataProps {
  historyData: HistoricalDataPoint[];
  selectedCryptos: string[];
  isMobile: boolean;
}

export const useOptimizedChartData = ({ 
  historyData, 
  selectedCryptos, 
  isMobile 
}: UseOptimizedChartDataProps) => {
  // Optimize data processing with memoization
  const processedData = useMemo(() => {
    // Reduce data points on mobile for better performance
    const dataToProcess = isMobile && historyData.length > 20 
      ? historyData.filter((_, index) => index % 2 === 0) // Take every other point on mobile
      : historyData;

    return dataToProcess.map(item => {
      const result: any = { date: item.date };
      
      // Only include selected cryptocurrencies to reduce data size
      selectedCryptos.forEach(cryptoId => {
        if (item.prices[cryptoId]) {
          result[cryptoId] = item.prices[cryptoId];
        }
      });
      
      return result;
    });
  }, [historyData, selectedCryptos, isMobile]);

  return { processedData };
};
