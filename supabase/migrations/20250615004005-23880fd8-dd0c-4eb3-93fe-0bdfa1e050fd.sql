
-- 1. Criar o tipo enum para roles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
    END IF;
END
$$;

-- 2. Criar tabela para roles de usuários
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    unique (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Função para verificar se usuário possui role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. Política de RLS para permitir que admin acesse tudo:
-- Exemplo para a tabela referral_rewards (repita/adapte para as tabelas que o admin precisa acessar!)
DROP POLICY IF EXISTS "Admins can select all referral_rewards" ON public.referral_rewards;
CREATE POLICY "Admins can select all referral_rewards"
  ON public.referral_rewards
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can insert all referral_rewards" ON public.referral_rewards;
CREATE POLICY "Admins can insert all referral_rewards"
  ON public.referral_rewards
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update all referral_rewards" ON public.referral_rewards;
CREATE POLICY "Admins can update all referral_rewards"
  ON public.referral_rewards
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete all referral_rewards" ON public.referral_rewards;
CREATE POLICY "Admins can delete all referral_rewards"
  ON public.referral_rewards
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Repita/adapte as políticas acima para as OUTRAS TABELAS necessárias!

-- 5. (INSTRUÇÃO): Para adicionar o admin
-- APÓS os comandos acima, rode um comando para pegar o user_id do telefone +244947896752:
-- SELECT id, phone FROM auth.users WHERE phone = '+244947896752';

-- Então insira manualmente:
-- INSERT INTO public.user_roles (user_id, role) VALUES ('PEGA_O_ID_DO_PASSO_ACIMA', 'admin');

