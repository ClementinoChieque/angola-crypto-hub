import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { registerSchema, RegisterFormData } from '@/schemas/authSchemas';
import OptimizedCountrySelect from './OptimizedCountrySelect';

interface RegisterFormProps {
  onSubmit: (values: RegisterFormData) => Promise<void>;
  isLoading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading }) => {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phoneNumber: '',
      countryCode: '+244',
      password: '',
      username: '',
      fullName: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="countryCode"
          render={({ field }) => <OptimizedCountrySelect field={field} />}
        />
        
        <FormField
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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
  );
};

export default RegisterForm;
