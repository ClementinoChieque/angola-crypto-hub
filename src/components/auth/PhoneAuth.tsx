
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { Country } from '@/types/auth';

type CountryData = {
  code: string;
  name: Country;
  flag: string;
};

const countries: CountryData[] = [
  // Países Africanos originais
  { code: '+244', name: 'Angola', flag: '🇦🇴' },
  { code: '+258', name: 'Moçambique', flag: '🇲🇿' },
  { code: '+238', name: 'Cabo Verde', flag: '🇨🇻' },
  { code: '+264', name: 'Namibia', flag: '🇳🇦' },
  { code: '+27', name: 'Africa do Sul', flag: '🇿🇦' },
  // Novos países Africanos
  { code: '+234', name: 'Nigéria', flag: '🇳🇬' },
  { code: '+233', name: 'Gana', flag: '🇬🇭' },
  { code: '+254', name: 'Quênia', flag: '🇰🇪' },
  { code: '+255', name: 'Tanzânia', flag: '🇹🇿' },
  { code: '+256', name: 'Uganda', flag: '🇺🇬' },
  { code: '+250', name: 'Ruanda', flag: '🇷🇼' },
  { code: '+237', name: 'Camarões', flag: '🇨🇲' },
  { code: '+225', name: 'Costa do Marfim', flag: '🇨🇮' },
  { code: '+221', name: 'Senegal', flag: '🇸🇳' },
  { code: '+223', name: 'Mali', flag: '🇲🇱' },
  // Países Europeus
  { code: '+351', name: 'Portugal', flag: '🇵🇹' },
  { code: '+34', name: 'Espanha', flag: '🇪🇸' },
  { code: '+33', name: 'França', flag: '🇫🇷' },
  { code: '+49', name: 'Alemanha', flag: '🇩🇪' },
  { code: '+39', name: 'Itália', flag: '🇮🇹' },
  { code: '+44', name: 'Reino Unido', flag: '🇬🇧' },
  { code: '+31', name: 'Holanda', flag: '🇳🇱' },
  { code: '+32', name: 'Bélgica', flag: '🇧🇪' },
  { code: '+41', name: 'Suíça', flag: '🇨🇭' },
  { code: '+43', name: 'Áustria', flag: '🇦🇹' },
];

const PhoneAuth: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(countries[0]);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();

  const handleCountryChange = (value: string) => {
    try {
      const country = countries.find(c => c.code === value);
      if (country) {
        setSelectedCountry(country);
      }
    } catch (error) {
      console.error('Error changing country:', error);
      toast({
        title: "Erro",
        description: "Erro ao selecionar país",
        variant: "destructive",
      });
    }
  };

  const validatePhoneNumber = (number: string, countryCode: string) => {
    try {
      // Basic validation - can be enhanced based on specific country rules
      const numericPhone = number.replace(/\D/g, '');
      
      // Validações básicas por país (podem ser expandidas)
      if (['+244', '+258', '+238', '+264', '+27', '+234', '+233', '+254', '+255', '+256', '+250', '+237', '+225', '+221', '+223'].includes(countryCode) && numericPhone.length < 7) return false;
      if (['+351', '+34', '+33', '+49', '+39', '+44', '+31', '+32', '+41', '+43'].includes(countryCode) && numericPhone.length < 8) return false;
      
      return true;
    } catch (error) {
      console.error('Error validating phone number:', error);
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);

    try {
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
        try {
          login(phoneNumber, selectedCountry.code, selectedCountry.name);
          toast({
            title: "Login bem-sucedido",
            description: "Bem-vindo à nossa corretora",
          });
        } catch (error) {
          console.error('Login error:', error);
          toast({
            title: "Erro no login",
            description: "Erro ao fazer login. Tente novamente.",
            variant: "destructive",
          });
        } finally {
          setIsLoginLoading(false);
        }
      }, 1000);
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Erro",
        description: "Erro na autenticação. Tente novamente.",
        variant: "destructive",
      });
      setIsLoginLoading(false);
    }
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
