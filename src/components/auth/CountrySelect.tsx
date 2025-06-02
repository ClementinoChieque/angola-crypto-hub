
import React from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countryCodes } from '@/constants/countryCodes';
import { ControllerRenderProps } from "react-hook-form";

interface CountrySelectProps {
  field: ControllerRenderProps<any, "countryCode">;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ field }) => {
  return (
    <FormItem>
      <FormLabel>País</FormLabel>
      <Select 
        onValueChange={field.onChange} 
        defaultValue={field.value}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o país" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {countryCodes.map((country) => (
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

export default CountrySelect;
