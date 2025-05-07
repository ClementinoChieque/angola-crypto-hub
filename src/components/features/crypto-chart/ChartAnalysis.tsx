
import React from 'react';
import { ChartTimeRange } from './types';

interface ChartAnalysisProps {
  timeRange: ChartTimeRange;
  selectedCryptos: string[];
  processedData: any[];
}

const ChartAnalysis: React.FC<ChartAnalysisProps> = ({ 
  timeRange, 
  selectedCryptos, 
  processedData 
}) => {
  return (
    <div className="mt-3 md:mt-4 text-xs md:text-sm text-gray-600">
      <p className="font-medium mb-0.5 md:mb-1">Análise:</p>
      {timeRange === '1d' && (
        <p>Análise de curto prazo mostra variações dentro das últimas 24 horas.</p>
      )}
      {timeRange === '7d' && (
        <p>Análise de médio prazo indica tendência de {
          selectedCryptos.length > 0 && processedData.length > 0 ? 
          (processedData[processedData.length - 1][selectedCryptos[0]] > processedData[0][selectedCryptos[0]] ? 'alta' : 'baixa') 
          : 'variação'
        } na semana.</p>
      )}
      {timeRange === '30d' && (
        <p>Análise de longo prazo revela padrão de {
          selectedCryptos.length > 0 && processedData.length > 0 ? 
          (processedData[processedData.length - 1][selectedCryptos[0]] > processedData[0][selectedCryptos[0]] ? 'valorização' : 'desvalorização') 
          : 'variação'
        } no mês.</p>
      )}
    </div>
  );
};

export default ChartAnalysis;
