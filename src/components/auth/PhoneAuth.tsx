
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';

type Country = 'Angola' | 'Moçambique' | 'Cabo Verde' | 'Namibia' | 'Africa do Sul';

type CountryData = {
  code: string;
  name: Country;
  flag: string;
};

const countries: CountryData[] = [
  { code: '+244', name: 'Angola', flag: '🇦🇴' },
  { code: '+258', name: 'Moçambique', flag: '🇲🇿' },
  { code: '+238', name: 'Cabo Verde', flag: '🇨🇻' },
  { code: '+264', name: 'Namibia', flag: '🇳🇦' },
  { code: '+27', name: 'Africa do Sul', flag: '🇿🇦' },
];

const PhoneAuth: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(countries[0]);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();

  const handleCountryChange = (value: string) => {
    const country = countries.find(c => c.code === value);
    if (country) setSelectedCountry(country);
  };

  const validatePhoneNumber = (number: string, countryCode: string) => {
    // Basic validation - can be enhanced based on specific country rules
    const numericPhone = number.replace(/\D/g, '');
    
    if (countryCode === '+244' && numericPhone.length !== 9) return false; // Angola
    if (countryCode === '+258' && numericPhone.length !== 9) return false; // Mozambique
    if (countryCode === '+238' && numericPhone.length !== 7) return false; // Cape Verde
    if (countryCode === '+264' && numericPhone.length !== 9) return false; // Namibia
    if (countryCode === '+27' && numericPhone.length !== 9) return false; // South Africa
    
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);

    if (!validatePhoneNumber(phoneNumber, selectedCountry.code)) {
      toast({
        title: "Número inválido",
        description: "Por favor, verifique o número de telefone",
        variant: "destructive",
      });
      setIsLoginLoading(false);
      return;
    }

    // Simulate authentication delay
    setTimeout(() => {
      login(phoneNumber, selectedCountry.code, selectedCountry.name);
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo à nossa corretora",
      });
      setIsLoginLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 p-6 bg-white rounded-lg shadow-md animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-crypto-blue">
          Bem-vindo à Corretora
        </h2>
        <p className="text-muted-foreground mt-2">
          Faça login com seu número de telefone
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="country">País</Label>
          <Select value={selectedCountry.code} onValueChange={handleCountryChange}>
            <SelectTrigger id="country" className="w-full">
              <SelectValue placeholder="Selecione o país" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <span className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                      <span className="text-muted-foreground">{country.code}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Número de Telefone</Label>
          <div className="flex">
            <div className="flex items-center justify-center bg-muted px-3 border border-r-0 rounded-l-md">
              {selectedCountry.code}
            </div>
            <Input
              id="phone"
              type="tel"
              placeholder="Número de telefone"
              className="rounded-l-none"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-crypto-blue hover:bg-crypto-light-blue" 
          disabled={isLoginLoading}
        >
          {isLoginLoading ? "Processando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
};

export default PhoneAuth;
