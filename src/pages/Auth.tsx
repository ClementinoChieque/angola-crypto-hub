
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { signInWithPhone, signUpWithPhone, verifyOTP } from '@/services/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/context/AuthContext';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const countryCodes = [
  { code: '+244', country: 'Angola' },
  { code: '+258', country: 'Moçambique' },
  { code: '+238', country: 'Cabo Verde' },
  { code: '+264', country: 'Namibia' },
  { code: '+27', country: 'Africa do Sul' },
];

type Country = 'Angola' | 'Moçambique' | 'Cabo Verde' | 'Namibia' | 'Africa do Sul';

const Auth = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otp, setOtp] = useState('');
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Phone login form state
  const [loginPhoneNumber, setLoginPhoneNumber] = useState('');
  const [loginCountryCode, setLoginCountryCode] = useState('+244');

  // Register form state
  const [registerPhoneNumber, setRegisterPhoneNumber] = useState('');
  const [registerCountryCode, setRegisterCountryCode] = useState('+244');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerFullName, setRegisterFullName] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Format phone number
      const formattedPhone = `${loginCountryCode}${loginPhoneNumber.replace(/\D/g, '')}`;
      
      await signInWithPhone(formattedPhone);
      setShowOTPVerification(true);
      toast({
        title: "Código enviado",
        description: "Verifique seu telefone para o código de confirmação"
      });
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Format phone number
      const formattedPhone = `${registerCountryCode}${registerPhoneNumber.replace(/\D/g, '')}`;
      
      await signUpWithPhone({
        phone: formattedPhone,
        username: registerUsername,
        fullName: registerFullName
      });
      
      setShowOTPVerification(true);
      toast({
        title: "Código enviado",
        description: "Verifique seu telefone para o código de confirmação"
      });
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);

    try {
      const phoneNumber = activeTab === 'login' 
        ? `${loginCountryCode}${loginPhoneNumber}` 
        : `${registerCountryCode}${registerPhoneNumber}`;

      const { session } = await verifyOTP(phoneNumber, otp);
      
      if (session) {
        // Find country name based on code
        const countryData = countryCodes.find(c => c.code === (activeTab === 'login' ? loginCountryCode : registerCountryCode));
        const country = countryData ? countryData.country as Country : 'Angola';
        
        login(phoneNumber, activeTab === 'login' ? loginCountryCode : registerCountryCode, country);
        
        toast({
          title: activeTab === 'login' ? "Login bem-sucedido" : "Registro bem-sucedido",
          description: activeTab === 'login' ? "Bem-vindo de volta!" : "Sua conta foi criada com sucesso!"
        });
        
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Erro na verificação",
        description: (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showOTPVerification) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md p-6">
          <h1 className="text-2xl font-bold text-center mb-6 text-crypto-blue">Verificação de Código</h1>
          <p className="text-center mb-6">
            Digite o código de verificação enviado para o seu telefone
          </p>
          
          <div className="flex justify-center mb-6">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          
          <Button 
            onClick={handleVerifyOTP}
            className="w-full bg-crypto-blue hover:bg-crypto-light-blue"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? "Verificando..." : "Verificar"}
          </Button>
          
          <Button
            variant="ghost"
            className="w-full mt-2"
            onClick={() => setShowOTPVerification(false)}
          >
            Voltar
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-crypto-blue">Angola Crypto Hub</h1>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-country-code">País</Label>
                <Select 
                  value={loginCountryCode} 
                  onValueChange={setLoginCountryCode}
                >
                  <SelectTrigger id="login-country-code">
                    <SelectValue placeholder="Selecione o país" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.country} ({country.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-phone">Número de Telefone</Label>
                <Input 
                  id="login-phone" 
                  type="tel"
                  value={loginPhoneNumber}
                  onChange={(e) => setLoginPhoneNumber(e.target.value)}
                  placeholder="Número de telefone sem código do país"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-crypto-blue hover:bg-crypto-light-blue"
                disabled={isLoading}
              >
                {isLoading ? "Processando..." : "Entrar"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-country-code">País</Label>
                <Select 
                  value={registerCountryCode} 
                  onValueChange={setRegisterCountryCode}
                >
                  <SelectTrigger id="register-country-code">
                    <SelectValue placeholder="Selecione o país" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.country} ({country.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-phone">Número de Telefone</Label>
                <Input 
                  id="register-phone"
                  type="tel"
                  value={registerPhoneNumber}
                  onChange={(e) => setRegisterPhoneNumber(e.target.value)}
                  placeholder="Número de telefone sem código do país"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-username">Nome de usuário</Label>
                <Input 
                  id="register-username"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-fullname">Nome completo</Label>
                <Input 
                  id="register-fullname"
                  value={registerFullName}
                  onChange={(e) => setRegisterFullName(e.target.value)}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-crypto-blue hover:bg-crypto-light-blue"
                disabled={isLoading}
              >
                {isLoading ? "Processando..." : "Cadastrar"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
