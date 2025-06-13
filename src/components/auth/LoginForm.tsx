import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { loginSchema, LoginFormData } from '@/schemas/authSchemas';
import OptimizedCountrySelect from './OptimizedCountrySelect';

interface LoginFormProps {
  onSubmit: (values: LoginFormData) => Promise<void>;
  isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: '',
      countryCode: '+244',
      password: '',
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
  );
};

export default LoginForm;
