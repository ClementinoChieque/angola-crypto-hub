
import React from 'react';
import { RadioGroup } from "@/components/ui/radio-group";
import { ChartLine, BarChart3, CandlestickChart } from 'lucide-react';
import { ChartType, CHART_TYPES } from './types';

interface ChartTypePickerProps {
  chartType: ChartType;
  setChartType: (type: ChartType) => void;
}

const ChartTypePicker: React.FC<ChartTypePickerProps> = ({ chartType, setChartType }) => {
  // Helper to render the correct icon based on icon name
  const renderIcon = (iconName: string, size: number = 16) => {
    switch (iconName) {
      case 'ChartLine':
        return <ChartLine size={size} />;
      case 'CandlestickChart':
        return <CandlestickChart size={size} />;
      case 'BarChart3':
        return <BarChart3 size={size} />;
      default:
        return null;
    }
  };

  return (
    <RadioGroup 
      value={chartType} 
      onValueChange={(value) => setChartType(value as ChartType)}
      className="flex items-center space-x-1"
      orientation="horizontal"
    >
      {CHART_TYPES.map((type) => (
        <div key={type.value} className="flex items-center space-x-1">
          <div 
            className={`flex items-center justify-center p-1 rounded cursor-pointer ${
              chartType === type.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`} 
            onClick={() => setChartType(type.value as ChartType)}
          >
            {renderIcon(type.icon)}
            <span className="ml-1 text-xs hidden md:inline">{type.label}</span>
          </div>
        </div>
      ))}
    </RadioGroup>
  );
};

export default ChartTypePicker;
