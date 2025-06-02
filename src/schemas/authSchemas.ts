
import * as z from "zod";

// Schema de validação para login
export const loginSchema = z.object({
  phoneNumber: z.string().min(9, "Número de telefone deve ter pelo menos 9 dígitos"),
  countryCode: z.string(),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

// Schema de validação para registro
export const registerSchema = z.object({
  phoneNumber: z.string().min(9, "Número de telefone deve ter pelo menos 9 dígitos"),
  countryCode: z.string(),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  username: z.string().min(3, "Nome de usuário deve ter pelo menos 3 caracteres"),
  fullName: z.string().min(3, "Nome completo é obrigatório"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
