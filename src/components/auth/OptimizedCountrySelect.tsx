
import React, { useState, useMemo, useCallback } from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { africanCountries, europeanCountries } from '@/constants/countryCodes';
import { ControllerRenderProps } from "react-hook-form";

interface OptimizedCountrySelectProps {
  field: ControllerRenderProps<any, "countryCode">;
}

const OptimizedCountrySelect: React.FC<OptimizedCountrySelectProps> = ({ field }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtrar países baseado na busca
  const filteredCountries = useMemo(() => {
    if (!searchTerm) {
      // Mostrar apenas os primeiros 10 países africanos por padrão
      return africanCountries.slice(0, 10);
    }
    
    const allCountries = [...africanCountries, ...europeanCountries];
    return allCountries.filter(country => 
      country.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.includes(searchTerm)
    );
  }, [searchTerm]);

  const handleValueChange = useCallback((value: string) => {
    field.onChange(value);
  }, [field]);

  return (
    <FormItem>
      <FormLabel>País</FormLabel>
      <Select 
        onValueChange={handleValueChange} 
        value={field.value}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o país" />
          </SelectTrigger>
        </FormControl>
        <SelectContent className="max-h-60">
          {filteredCountries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.country} ({country.code})
            </SelectItem>
          ))}
          {!searchTerm && filteredCountries.length > 0 && (
            <div className="text-muted-foreground text-xs px-8 py-1.5 pointer-events-none">
              Digite para buscar mais países...
            </div>
          )}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
};

export default OptimizedCountrySelect;
