
-- Vamos corrigir a política de update para administradores
DROP POLICY IF EXISTS "Admins can update transactions" ON public.transactions;

-- Criar a política correta para UPDATE (só precisa de USING)
CREATE POLICY "Admins can update transactions"
  ON public.transactions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Vamos verificar se existe algum usuário com role de admin
-- SELECT * FROM public.user_roles WHERE role = 'admin';
