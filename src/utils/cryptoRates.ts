
import { useState, useEffect } from 'react';

// Types for the API response
interface CryptoRates {
  bitcoin: {
    usd: number;
  };
}

interface ConversionRates {
  btcToUsd: number;
  usdtToAoc: number; // AOcripto
  btcToAoc: number;
  aocToAkz: number; // Kwanza conversion rate
}

interface HistoricalData {
  date: string;
  btcPrice: number;
  aocValue: number;
}

// Fixed rate for AOcripto to USDT as specified
const FIXED_AOC_TO_USDT_RATE = 1450;

export const fetchBitcoinRate = async (): Promise<number> => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const data: CryptoRates = await response.json();
    return data.bitcoin.usd;
  } catch (error) {
    console.error('Error fetching Bitcoin rate:', error);
    // Return a default value if API fails
    return 65000; // Default approximate BTC value
  }
};

// Generate mock historical data based on actual current rate
const generateHistoricalData = (days: number, currentBtcPrice: number): HistoricalData[] => {
  const data: HistoricalData[] = [];
  const now = new Date();
  
  // Create some volatility around the current price
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random variation (+/- 10%)
    const volatility = 0.10;
    const randomFactor = 1 + (Math.random() * volatility * 2 - volatility);
    
    // Create a trend pattern
    const trend = Math.sin(i / (days / 2) * Math.PI) * 0.05;
    
    // Combine factors
    const btcPrice = currentBtcPrice * (randomFactor + trend);
    const aocValue = btcPrice * FIXED_AOC_TO_USDT_RATE;
    
    data.push({
      date: date.toISOString(),
      btcPrice,
      aocValue,
    });
  }
  
  return data;
};

export const useCryptoRates = () => {
  const [rates, setRates] = useState<ConversionRates>({
    btcToUsd: 0,
    usdtToAoc: FIXED_AOC_TO_USDT_RATE,
    btcToAoc: 0,
    aocToAkz: 100 // Default conversion rate AOcripto to Kwanza
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getRates = async () => {
      try {
        setIsLoading(true);
        const btcRate = await fetchBitcoinRate();
        
        // Calculate BTC to AOcripto rate
        const btcToAoc = btcRate * FIXED_AOC_TO_USDT_RATE;
        
        setRates({
          btcToUsd: btcRate,
          usdtToAoc: FIXED_AOC_TO_USDT_RATE,
          btcToAoc: btcToAoc,
          aocToAkz: 100
        });
      } catch (error) {
        console.error('Error calculating rates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getRates();
    
    // Update rates every 5 minutes
    const intervalId = setInterval(getRates, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return { rates, isLoading };
};

export const useCryptoHistory = (timeRange: string = '7d') => {
  const [historyData, setHistoryData] = useState<HistoricalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { rates } = useCryptoRates();

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setIsLoading(true);
      try {
        // Convert timeRange to days
        const days = timeRange === '1d' ? 1 : timeRange === '7d' ? 7 : 30;
        
        // In a real app, you would fetch historical data from an API
        // For this demo, we'll generate mock data based on the current price
        const data = generateHistoricalData(days, rates.btcToUsd);
        setHistoryData(data);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (rates.btcToUsd > 0) {
      fetchHistoricalData();
    }
  }, [timeRange, rates.btcToUsd]);

  return { historyData, isLoading };
};
