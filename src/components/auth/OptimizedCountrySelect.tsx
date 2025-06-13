
import React, { useState, useMemo, useCallback } from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countryCodes } from '@/constants/countryCodes';
import { ControllerRenderProps } from "react-hook-form";

interface OptimizedCountrySelectProps {
  field: ControllerRenderProps<any, "countryCode">;
}

const OptimizedCountrySelect: React.FC<OptimizedCountrySelectProps> = ({ field }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtrar países baseado na busca
  const filteredCountries = useMemo(() => {
    if (!searchTerm) {
      // Mostrar todos os países por padrão
      return countryCodes;
    }
    
    return countryCodes.filter(country => 
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
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
};

export default OptimizedCountrySelect;
