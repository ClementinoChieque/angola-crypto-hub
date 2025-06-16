
import * as z from "zod";

// Função para obter mensagens de erro traduzidas
const getErrorMessages = () => {
  // Para simplicidade, vou manter as mensagens em português por padrão
  // mas elas podem ser traduzidas dinamicamente conforme necessário
  return {
    phoneRequired: "Número de telefone deve ter pelo menos 9 dígitos",
    passwordRequired: "Senha deve ter pelo menos 6 caracteres",
    fullNameRequired: "Nome completo é obrigatório",
    inviteCodeRequired: "Código de convite é obrigatório"
  };
};

const messages = getErrorMessages();

// Schema de validação para login
export const loginSchema = z.object({
  phoneNumber: z.string().min(9, messages.phoneRequired),
  countryCode: z.string(),
  password: z.string().min(6, messages.passwordRequired),
});

// Schema de validação para registro
export const registerSchema = z.object({
  phoneNumber: z.string().min(9, messages.phoneRequired),
  countryCode: z.string(),
  password: z.string().min(6, messages.passwordRequired),
  fullName: z.string().min(3, messages.fullNameRequired),
  inviteCode: z.string().min(1, messages.inviteCodeRequired),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
