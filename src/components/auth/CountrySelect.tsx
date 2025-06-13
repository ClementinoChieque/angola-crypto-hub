
import React, { useState, useMemo } from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countryCodes } from '@/constants/countryCodes';
import { ControllerRenderProps } from "react-hook-form";

interface CountrySelectProps {
  field: ControllerRenderProps<any, "countryCode">;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ field }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Memoizar a lista de países para evitar re-renderização desnecessária
  const countryOptions = useMemo(() => {
    return countryCodes.map((country) => (
      <SelectItem key={country.code} value={country.code}>
        {country.country} ({country.code})
      </SelectItem>
    ));
  }, []);

  return (
    <FormItem>
      <FormLabel>País</FormLabel>
      <Select 
        onValueChange={field.onChange} 
        value={field.value}
        onOpenChange={setIsOpen}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o país" />
          </SelectTrigger>
        </FormControl>
        <SelectContent className="max-h-60 overflow-y-auto">
          {isOpen && countryOptions}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
};

export default CountrySelect;
