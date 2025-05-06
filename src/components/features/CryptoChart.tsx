
import React from 'react';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCryptoHistory } from '@/utils/cryptoRates';
import { ChartLine } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const timeRanges = [
  { value: '1d', label: '24h' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
];

const CryptoChart: React.FC = () => {
  const [timeRange, setTimeRange] = React.useState('7d');
  const { historyData, isLoading } = useCryptoHistory(timeRange);
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <Card className="p-2 md:p-4 h-[220px] md:h-[250px] flex items-center justify-center">
        <div className="animate-pulse text-center">
          <ChartLine size={isMobile ? 20 : 24} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground text-xs md:text-sm">Carregando dados históricos...</p>
        </div>
      </Card>
    );
  }

  const chartConfig = {
    bitcoin: { label: 'Bitcoin', theme: { light: '#f7931a', dark: '#f7931a' } },
    aocripto: { label: 'AOcripto', theme: { light: '#2563eb', dark: '#3b82f6' } },
  };

  return (
    <Card className="p-3 md:p-4 overflow-hidden bg-white shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 md:mb-5 gap-2">
        <h3 className="font-semibold text-base md:text-lg">Análise do Gráfico</h3>
        <Tabs value={timeRange} onValueChange={setTimeRange} className="w-auto">
          <TabsList className="grid grid-cols-3 h-7 md:h-8 min-w-[180px]">
            {timeRanges.map((range) => (
              <TabsTrigger 
                key={range.value} 
                value={range.value}
                className="text-xs px-2 md:px-3"
              >
                {range.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      {/* Legend above the chart with clearer formatting for mobile */}
      <div className="flex flex-wrap justify-start items-center gap-4 md:gap-8 mb-2 md:mb-4">
        <div className="flex items-center">
          <div className="w-4 h-4 md:w-5 md:h-5 bg-[#f7931a] rounded-sm mr-1 md:mr-2"></div>
          <span className="text-xs md:text-sm text-gray-700">Bitcoin</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 md:w-5 md:h-5 bg-[#3b82f6] rounded-sm mr-1 md:mr-2"></div>
          <span className="text-xs md:text-sm text-gray-700">AOcripto</span>
        </div>
      </div>
      
      {/* Optimized chart height and margins for mobile */}
      <div className="h-[170px] md:h-[240px]">
        <ChartContainer config={chartConfig}>
          <LineChart 
            data={historyData}
            margin={isMobile ? { top: 5, right: 10, left: 0, bottom: 25 } : { top: 10, right: 30, left: 5, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => format(new Date(value), isMobile ? 'd/M' : 'dd/MM')}
              stroke="var(--foreground)"
              fontSize={isMobile ? 10 : 12}
              tick={{ fontSize: isMobile ? 10 : 12 }}
              tickCount={isMobile ? 4 : 5}
              height={isMobile ? 25 : 35}
            />
            <YAxis 
              yAxisId="btc"
              orientation="left"
              stroke="var(--foreground)"
              fontSize={isMobile ? 9 : 11}
              tickCount={isMobile ? 3 : 4}
              tickFormatter={(value) => isMobile ? `$${Math.round(value/1000)}k` : `$${Math.round(value).toLocaleString()}`}
              tick={{ fontSize: isMobile ? 9 : 11 }}
              width={isMobile ? 35 : 70}
              domain={['dataMin - 5000', 'dataMax + 5000']}
            />
            <YAxis 
              yAxisId="aoc"
              orientation="right"
              stroke="var(--foreground)"
              fontSize={isMobile ? 9 : 11}
              tickCount={isMobile ? 3 : 4}
              tickFormatter={(value) => isMobile ? 
                `${(value/1000000).toFixed(1)}M` : 
                `${Math.round(value).toLocaleString()}`}
              tick={{ fontSize: isMobile ? 9 : 11 }}
              width={isMobile ? 35 : 75}
              domain={['dataMin - 5000000', 'dataMax + 5000000']}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="btcPrice"
              name="bitcoin"
              stroke="#f7931a"
              yAxisId="btc"
              activeDot={{ r: isMobile ? 4 : 6 }}
              strokeWidth={isMobile ? 2 : 2.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="aocValue"
              name="aocripto"
              stroke="#3b82f6"
              yAxisId="aoc"
              activeDot={{ r: isMobile ? 4 : 6 }}
              strokeWidth={isMobile ? 2 : 2.5}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </div>
      
      <div className="mt-3 md:mt-4 text-xs md:text-sm text-gray-600">
        <p className="font-medium mb-0.5 md:mb-1">Análise:</p>
        {timeRange === '1d' && (
          <p>Análise de curto prazo mostra variações dentro das últimas 24 horas.</p>
        )}
        {timeRange === '7d' && (
          <p>Análise de médio prazo indica tendência de {historyData[historyData.length - 1]?.btcPrice > historyData[0]?.btcPrice ? 'alta' : 'baixa'} na semana.</p>
        )}
        {timeRange === '30d' && (
          <p>Análise de longo prazo revela padrão de {historyData[historyData.length - 1]?.btcPrice > historyData[0]?.btcPrice ? 'valorização' : 'desvalorização'} no mês.</p>
        )}
      </div>
    </Card>
  );
};

export default CryptoChart;
