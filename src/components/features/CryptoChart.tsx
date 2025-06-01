
import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { useCryptoHistory } from '@/utils/cryptoRates';
import { useIsMobile } from '@/hooks/use-mobile';

import ChartTypePicker from './crypto-chart/ChartTypePicker';
import TimeRangePicker from './crypto-chart/TimeRangePicker';
import CryptoToggleGroup from './crypto-chart/CryptoToggleGroup';
import ChartAnalysis from './crypto-chart/ChartAnalysis';
import LoadingState from './crypto-chart/LoadingState';
import ChartRenderer from './crypto-chart/ChartRenderer';
import PerformanceComparison from './crypto-chart/PerformanceComparison';
import { useOptimizedChartData } from './crypto-chart/hooks/useOptimizedChartData';
import { ChartType, ChartTimeRange } from './crypto-chart/types';

const CryptoChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<ChartTimeRange>('7d');
  const [selectedCryptos, setSelectedCryptos] = useState(['bitcoin', 'ethereum', 'aocripto']);
  const [chartType, setChartType] = useState<ChartType>('line');
  const [activeCrypto, setActiveCrypto] = useState('bitcoin');
  const { historyData, isLoading } = useCryptoHistory(timeRange);
  const isMobile = useIsMobile();

  // Use optimized data hook
  const { processedData } = useOptimizedChartData({
    historyData,
    selectedCryptos,
    isMobile
  });

  // Memoize callback functions to prevent unnecessary re-renders
  const handleTimeRangeChange = useCallback((range: ChartTimeRange) => {
    setTimeRange(range);
  }, []);

  const handleChartTypeChange = useCallback((type: ChartType) => {
    setChartType(type);
  }, []);

  const handleSelectedCryptosChange = useCallback((cryptos: string[]) => {
    setSelectedCryptos(cryptos);
  }, []);

  const handleActiveCryptoChange = useCallback((crypto: string) => {
    setActiveCrypto(crypto);
  }, []);

  if (isLoading) {
    return <LoadingState isMobile={isMobile} />;
  }

  return (
    <div>
      <Card className="p-3 md:p-4 overflow-hidden bg-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 md:mb-5 gap-2">
          <h3 className="font-semibold text-base md:text-lg">Análise do Gráfico</h3>
          <div className="flex flex-col md:flex-row gap-2">
            <ChartTypePicker chartType={chartType} setChartType={handleChartTypeChange} />
            <TimeRangePicker timeRange={timeRange} setTimeRange={handleTimeRangeChange} />
          </div>
        </div>
        
        {/* Only show crypto selection for line and bar charts */}
        {chartType !== 'candle' && (
          <CryptoToggleGroup 
            selectedCryptos={selectedCryptos} 
            setSelectedCryptos={handleSelectedCryptosChange}
          />
        )}
        
        <ChartRenderer
          chartType={chartType}
          processedData={processedData}
          selectedCryptos={selectedCryptos}
          historyData={historyData}
          activeCrypto={activeCrypto}
          setActiveCrypto={handleActiveCryptoChange}
          isMobile={isMobile}
        />
        
        <ChartAnalysis 
          timeRange={timeRange} 
          selectedCryptos={selectedCryptos} 
          processedData={processedData}
        />
      </Card>
      
      {/* Performance Comparison - Only show for line and bar charts with multiple cryptos */}
      {chartType !== 'candle' && selectedCryptos.length > 1 && (
        <PerformanceComparison
          processedData={processedData}
          selectedCryptos={selectedCryptos}
          timeRange={timeRange}
        />
      )}
    </div>
  );
};

export default CryptoChart;
