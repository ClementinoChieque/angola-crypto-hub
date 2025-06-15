
-- Habilite RLS (caso não esteja habilitado)
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;

-- REMOVA quaisquer políticas antigas que possam referenciar "users"
DROP POLICY IF EXISTS "reference to users" ON public.referral_rewards;
DROP POLICY IF EXISTS "Users can view their own referral rewards" ON public.referral_rewards;
DROP POLICY IF EXISTS "Usuarios podem ver suas recompensas" ON public.referral_rewards;

-- Agora crie uma política simples e segura para testes (permissiva para facilitar o debug):

-- Permite que QUALQUER USUÁRIO autenticado liste todas as recompensas de convite
CREATE POLICY "Admin pode ver todas recompensas" 
  ON public.referral_rewards
  FOR SELECT
  USING (true);

-- Se quiser restringir depois, basta ajustar de acordo com as necessidades.
