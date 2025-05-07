
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { useCryptoHistory } from '@/utils/cryptoRates';
import { useIsMobile } from '@/hooks/use-mobile';

import LineChartComponent from './crypto-chart/LineChart';
import BarChartComponent from './crypto-chart/BarChart';
import CandleChartComponent from './crypto-chart/CandleChart';
import ChartTypePicker from './crypto-chart/ChartTypePicker';
import TimeRangePicker from './crypto-chart/TimeRangePicker';
import CryptoToggleGroup from './crypto-chart/CryptoToggleGroup';
import ChartAnalysis from './crypto-chart/ChartAnalysis';
import LoadingState from './crypto-chart/LoadingState';
import { processCandlestickData } from './crypto-chart/utils';
import { ChartType, ChartTimeRange, CRYPTO_COLORS } from './crypto-chart/types';

const CryptoChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<ChartTimeRange>('7d');
  const [selectedCryptos, setSelectedCryptos] = useState(['bitcoin', 'ethereum', 'aocripto']);
  const [chartType, setChartType] = useState<ChartType>('line');
  const [activeCrypto, setActiveCrypto] = useState('bitcoin');
  const { historyData, isLoading } = useCryptoHistory(timeRange);
  const isMobile = useIsMobile();

  // Process data for the chart to include all selected cryptocurrencies
  const processedData = historyData.map(item => {
    const result: any = { date: item.date };
    
    // Add price for each selected cryptocurrency
    Object.keys(item.prices).forEach(cryptoId => {
      if (selectedCryptos.includes(cryptoId)) {
        result[cryptoId] = item.prices[cryptoId];
      }
    });
    
    return result;
  });

  // Process data for candlestick chart (only for the active crypto)
  const candleData = processCandlestickData(historyData, activeCrypto);

  // Create chart config from selected cryptos
  const chartConfig = Object.fromEntries(
    Object.entries(CRYPTO_COLORS)
      .filter(([key]) => selectedCryptos.includes(key))
      .map(([key, color]) => [
        key, 
        { 
          label: key === 'aocripto' ? 'AOcripto' : key.charAt(0).toUpperCase() + key.slice(1), 
          theme: { light: color, dark: color } 
        }
      ])
  );

  // Function to render the appropriate chart based on selected type
  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChartComponent 
            processedData={processedData} 
            selectedCryptos={selectedCryptos}
            isMobile={isMobile}
          />
        );
      
      case 'bar':
        return (
          <BarChartComponent 
            processedData={processedData} 
            selectedCryptos={selectedCryptos}
            isMobile={isMobile}
          />
        );
      
      case 'candle':
        return (
          <CandleChartComponent 
            candleData={candleData}
            activeCrypto={activeCrypto}
            setActiveCrypto={setActiveCrypto}
            isMobile={isMobile}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return <LoadingState isMobile={isMobile} />;
  }

  return (
    <Card className="p-3 md:p-4 overflow-hidden bg-white shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 md:mb-5 gap-2">
        <h3 className="font-semibold text-base md:text-lg">Análise do Gráfico</h3>
        <div className="flex flex-col md:flex-row gap-2">
          {/* Chart type selector */}
          <ChartTypePicker chartType={chartType} setChartType={setChartType} />
          
          {/* Time range selector */}
          <TimeRangePicker timeRange={timeRange} setTimeRange={setTimeRange} />
        </div>
      </div>
      
      {/* Only show crypto selection for line and bar charts */}
      {chartType !== 'candle' && (
        <CryptoToggleGroup 
          selectedCryptos={selectedCryptos} 
          setSelectedCryptos={setSelectedCryptos}
        />
      )}
      
      {/* Optimized chart height and margins for mobile */}
      <div className="h-[170px] md:h-[240px]">
        <ChartContainer config={chartConfig}>
          {renderChart()}
        </ChartContainer>
      </div>
      
      <ChartAnalysis 
        timeRange={timeRange} 
        selectedCryptos={selectedCryptos} 
        processedData={processedData}
      />
    </Card>
  );
};

export default CryptoChart;
