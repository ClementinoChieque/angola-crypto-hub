
import React, { useState, useEffect } from 'react';
import { useCryptoRates } from '@/utils/cryptoRates';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUp, ArrowDown, Bitcoin } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CryptoRates: React.FC = () => {
  const { rates, isLoading } = useCryptoRates();
  const [displayMode, setDisplayMode] = useState<'all' | 'popular'>('popular');
  const [animatedPrices, setAnimatedPrices] = useState<Record<string, number>>({});
  
  // Define popular cryptocurrencies to show in compact mode
  const popularCryptos = ['bitcoin', 'ethereum', 'binancecoin'];
  
  // Helper to format prices with appropriate precision
  const formatPrice = (price: number) => {
    if (price < 0.01) return price.toFixed(6);
    if (price < 1) return price.toFixed(4);
    if (price < 10) return price.toFixed(2);
    return price.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };
  
  // Get cryptocurrencies to display based on mode
  const getCryptosToDisplay = () => {
    if (displayMode === 'popular') {
      return Object.keys(rates.cryptoPrices).filter(crypto => popularCryptos.includes(crypto));
    }
    return Object.keys(rates.cryptoPrices);
  };

  // Effect for price animation every 2 seconds
  useEffect(() => {
    if (isLoading || Object.keys(rates.cryptoPrices).length === 0) return;
    
    // Initialize animated prices with current values
    const initialPrices: Record<string, number> = {};
    Object.keys(rates.cryptoPrices).forEach(crypto => {
      initialPrices[crypto] = rates.cryptoPrices[crypto].currentPrice;
    });
    setAnimatedPrices(initialPrices);
    
    // Update prices every 2 seconds
    const interval = setInterval(() => {
      const updatedPrices: Record<string, number> = {};
      Object.keys(rates.cryptoPrices).forEach(crypto => {
        // Small random variation (±0.15%)
        const basePrice = rates.cryptoPrices[crypto].currentPrice;
        const variation = (Math.random() * 0.003) - 0.0015; // -0.15% to +0.15%
        updatedPrices[crypto] = basePrice * (1 + variation);
      });
      setAnimatedPrices(updatedPrices);
    }, 2000);
    
    // Cleanup
    return () => clearInterval(interval);
  }, [isLoading, rates.cryptoPrices]);

  // Function to get the displayed price (animated if available, otherwise actual)
  const getDisplayPrice = (cryptoId: string) => {
    if (animatedPrices[cryptoId]) {
      return animatedPrices[cryptoId];
    }
    return rates.cryptoPrices[cryptoId]?.currentPrice || 0;
  };

  // Determine if price went up or down from previous
  const getPriceChange = (cryptoId: string) => {
    if (!animatedPrices[cryptoId] || !rates.cryptoPrices[cryptoId]) return 'neutral';
    return animatedPrices[cryptoId] > rates.cryptoPrices[cryptoId].currentPrice ? 'up' : 'down';
  };

  return (
    <Card className="p-3 md:p-4">
      <div className="space-y-3 md:space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Cotações</h3>
          <div className="flex items-center gap-2">
            <Bitcoin size={18} className="text-amber-500" />
            <span className="text-xs md:text-sm text-muted-foreground">Atualizado em tempo real</span>
          </div>
        </div>
        
        <Tabs value={displayMode} onValueChange={(v) => setDisplayMode(v as 'all' | 'popular')} className="w-full">
          <TabsList className="grid grid-cols-2 h-8 w-full max-w-[200px]">
            <TabsTrigger value="popular" className="text-xs">Populares</TabsTrigger>
            <TabsTrigger value="all" className="text-xs">Todas</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {/* Cryptocurrencies */}
            {getCryptosToDisplay().map(cryptoId => {
              const crypto = rates.cryptoPrices[cryptoId];
              const priceChangeClass = getPriceChange(cryptoId) === 'up' 
                ? 'text-green-500 transition-colors' 
                : getPriceChange(cryptoId) === 'down' 
                ? 'text-red-500 transition-colors' 
                : '';
              
              return (
                <div key={cryptoId} className="bg-muted p-3 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium">
                      {cryptoId.charAt(0).toUpperCase() + cryptoId.slice(1)} ({crypto.symbol})
                    </p>
                    <p className={`font-medium ${priceChangeClass}`}>
                      ${formatPrice(getDisplayPrice(cryptoId))} USDT
                    </p>
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <ArrowUp size={12} className="text-green-500" />
                      <span>Max: ${formatPrice(crypto.maxPrice)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ArrowDown size={12} className="text-red-500" />
                      <span>Min: ${formatPrice(crypto.minPrice)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* AOcripto info atualizado conforme solicitado */}
            <div className="bg-muted p-3 rounded">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium">AOcripto</p>
                <p className="font-medium">1 USDT = 1.350,00 AOcripto</p>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <p>1 AOcripto = 0.000690 USDT</p>
                <p>1350 AOcripto = 1350 AKZ</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CryptoRates;
