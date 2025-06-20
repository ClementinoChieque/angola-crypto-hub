
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { registerSchema, RegisterFormData } from '@/schemas/authSchemas';
import { useLanguage } from '@/context/LanguageContext';
import { Eye, EyeOff } from 'lucide-react';
import OptimizedCountrySelect from './OptimizedCountrySelect';

interface RegisterFormProps {
  onSubmit: (values: RegisterFormData) => Promise<void>;
  isLoading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading }) => {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phoneNumber: '',
      countryCode: '+244',
      password: '',
      fullName: '',
      inviteCode: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="inviteCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('inviteCode')}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={t('enterInviteCode')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
              <FormLabel>{t('phoneNumber')}</FormLabel>
              <FormControl>
                <Input 
                  type="tel"
                  placeholder={t('phoneNumberWithoutCountry')}
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
              <FormLabel>{t('password')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"}
                    placeholder={t('createStrongPassword')}
                    {...field}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
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
              <FormLabel>{t('fullName')}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={t('enterFullName')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? t('processing') : t('register')}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
