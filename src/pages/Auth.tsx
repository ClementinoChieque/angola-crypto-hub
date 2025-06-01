import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { signIn, signUp } from '@/services/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/context/AuthContext';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const countryCodes = [
  // Países Africanos originais
  { code: '+244', country: 'Angola' },
  { code: '+258', country: 'Moçambique' },
  { code: '+238', country: 'Cabo Verde' },
  { code: '+264', country: 'Namibia' },
  { code: '+27', country: 'Africa do Sul' },
  // Novos países Africanos
  { code: '+234', country: 'Nigéria' },
  { code: '+233', country: 'Gana' },
  { code: '+254', country: 'Quênia' },
  { code: '+255', country: 'Tanzânia' },
  { code: '+256', country: 'Uganda' },
  { code: '+250', country: 'Ruanda' },
  { code: '+237', country: 'Camarões' },
  { code: '+225', country: 'Costa do Marfim' },
  { code: '+221', country: 'Senegal' },
  { code: '+223', country: 'Mali' },
  // Países Europeus
  { code: '+351', country: 'Portugal' },
  { code: '+34', country: 'Espanha' },
  { code: '+33', country: 'França' },
  { code: '+49', country: 'Alemanha' },
  { code: '+39', country: 'Itália' },
  { code: '+44', country: 'Reino Unido' },
  { code: '+31', country: 'Holanda' },
  { code: '+32', country: 'Bélgica' },
  { code: '+41', country: 'Suíça' },
  { code: '+43', country: 'Áustria' },
];

type Country = 'Angola' | 'Moçambique' | 'Cabo Verde' | 'Namibia' | 'Africa do Sul' | 
  'Portugal' | 'Espanha' | 'França' | 'Alemanha' | 'Itália' | 'Reino Unido' | 'Holanda' | 'Bélgica' | 'Suíça' | 'Áustria' |
  'Nigéria' | 'Gana' | 'Quênia' | 'Tanzânia' | 'Uganda' | 'Ruanda' | 'Camarões' | 'Costa do Marfim' | 'Senegal' | 'Mali';

// Schema de validação para login
const loginSchema = z.object({
  phoneNumber: z.string().min(9, "Número de telefone deve ter pelo menos 9 dígitos"),
  countryCode: z.string(),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

// Schema de validação para registro
const registerSchema = z.object({
  phoneNumber: z.string().min(9, "Número de telefone deve ter pelo menos 9 dígitos"),
  countryCode: z.string(),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  username: z.string().min(3, "Nome de usuário deve ter pelo menos 3 caracteres"),
  fullName: z.string().min(3, "Nome completo é obrigatório"),
});

const Auth = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form para login
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: '',
      countryCode: '+244',
      password: '',
    },
  });

  // Form para registro
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phoneNumber: '',
      countryCode: '+244',
      password: '',
      username: '',
      fullName: '',
    },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);

    try {
      // Format phone number
      const formattedPhone = `${values.countryCode}${values.phoneNumber.replace(/\D/g, '')}`;
      
      const { session } = await signIn({
        phone: formattedPhone,
        password: values.password,
      });
      
      if (session) {
        // Find country name based on code
        const countryData = countryCodes.find(c => c.code === values.countryCode);
        const country = countryData ? countryData.country as Country : 'Angola';
        
        login(formattedPhone, values.countryCode, country);
        
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta!"
        });
        
        navigate('/');
      }
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

  const handleRegister = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);

    try {
      // Format phone number
      const formattedPhone = `${values.countryCode}${values.phoneNumber.replace(/\D/g, '')}`;
      
      const { session } = await signUp({
        phone: formattedPhone,
        password: values.password,
        username: values.username,
        fullName: values.fullName
      });
      
      if (session) {
        // Find country name based on code
        const countryData = countryCodes.find(c => c.code === values.countryCode);
        const country = countryData ? countryData.country as Country : 'Angola';
        
        login(formattedPhone, values.countryCode, country);
        
        toast({
          title: "Registro bem-sucedido",
          description: "Sua conta foi criada com sucesso!"
        });
        
        navigate('/');
      } else {
        toast({
          title: "Registro realizado",
          description: "Verifique seu telefone para confirmar o registro",
        });
      }
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
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="countryCode"
                  render={({ field }) => (
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
                  )}
                />
                
                <FormField
                  control={loginForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Telefone</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel"
                          placeholder="Número de telefone sem código do país"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="Sua senha"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-crypto-blue hover:bg-crypto-light-blue"
                  disabled={isLoading}
                >
                  {isLoading ? "Processando..." : "Entrar"}
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="register">
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="countryCode"
                  render={({ field }) => (
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
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Telefone</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel"
                          placeholder="Número de telefone sem código do país"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="Crie uma senha forte"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome de usuário</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Seu nome de usuário único"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Seu nome completo"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-crypto-blue hover:bg-crypto-light-blue"
                  disabled={isLoading}
                >
                  {isLoading ? "Processando..." : "Cadastrar"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
