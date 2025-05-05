
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
  Legend,
} from 'recharts';
import { Card } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
      <Card className="p-2 md:p-4 h-[220px] md:h-[300px] flex items-center justify-center">
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
    <Card className="p-2 md:p-4 relative z-0"> {/* Added z-index to ensure chart is below other elements */}
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <h3 className="font-semibold text-sm md:text-lg">Análise do Gráfico</h3>
        <Tabs value={timeRange} onValueChange={setTimeRange} className="w-auto">
          <TabsList className="grid grid-cols-3 h-7 md:h-9">
            {timeRanges.map((range) => (
              <TabsTrigger 
                key={range.value} 
                value={range.value}
                className="text-xs md:text-sm py-0.5 px-2 md:px-3"
              >
                {range.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      <div className="h-[180px] md:h-[250px]"> {/* Reduced height on desktop */}
        <ChartContainer config={chartConfig}>
          <LineChart data={historyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => format(new Date(value), 'dd/MM')}
              stroke="var(--foreground)"
              fontSize={isMobile ? 10 : 12}
              tick={{ fontSize: isMobile ? 8 : 12 }}
              tickCount={isMobile ? 3 : 5}
            />
            <YAxis 
              yAxisId="btc"
              orientation="left"
              stroke="var(--foreground)"
              fontSize={isMobile ? 8 : 12}
              tickCount={isMobile ? 3 : 5}
              tickFormatter={(value) => `$${Math.round(value).toLocaleString()}`}
              tick={{ fontSize: isMobile ? 8 : 12 }}
              width={isMobile ? 40 : 60}
            />
            <YAxis 
              yAxisId="aoc"
              orientation="right"
              stroke="var(--foreground)"
              fontSize={isMobile ? 8 : 12}
              tickCount={isMobile ? 3 : 5}
              tickFormatter={(value) => `${Math.round(value).toLocaleString()}`}
              tick={{ fontSize: isMobile ? 8 : 12 }}
              width={isMobile ? 35 : 50}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="btcPrice"
              name="bitcoin"
              stroke="var(--color-bitcoin)"
              yAxisId="btc"
              activeDot={{ r: isMobile ? 4 : 8 }}
              dot={false}
              strokeWidth={isMobile ? 1 : 2}
            />
            <Line
              type="monotone"
              dataKey="aocValue"
              name="aocripto"
              stroke="var(--color-aocripto)"
              yAxisId="aoc"
              activeDot={{ r: isMobile ? 4 : 6 }}
              dot={false}
              strokeWidth={isMobile ? 1 : 2}
            />
          </LineChart>
        </ChartContainer>
      </div>
      
      <div className="mt-2 md:mt-3 text-xs md:text-sm text-muted-foreground">
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
