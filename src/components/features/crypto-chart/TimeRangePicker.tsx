
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartTimeRange, TIME_RANGES } from './types';

interface TimeRangePickerProps {
  timeRange: ChartTimeRange;
  setTimeRange: (range: ChartTimeRange) => void;
}

const TimeRangePicker: React.FC<TimeRangePickerProps> = ({ timeRange, setTimeRange }) => {
  const handleTimeRangeChange = (value: string) => {
    try {
      setTimeRange(value as ChartTimeRange);
    } catch (error) {
      console.error('Error changing time range:', error);
    }
  };

  return (
    <Tabs value={timeRange} onValueChange={handleTimeRangeChange} className="w-auto">
      <TabsList className="grid grid-cols-3 h-7 md:h-8 min-w-[180px]">
        {TIME_RANGES.map((range) => (
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
  );
};

export default TimeRangePicker;
