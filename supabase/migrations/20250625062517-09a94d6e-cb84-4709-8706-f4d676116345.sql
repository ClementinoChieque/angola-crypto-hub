
-- Adicionar política RLS para permitir que admins vejam todas as solicitações de saque
CREATE POLICY "Admin pode ver todas as solicitacoes de saque"
  ON public.withdrawal_requests
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Adicionar política RLS para permitir que admins atualizem qualquer solicitação de saque
CREATE POLICY "Admin pode atualizar qualquer solicitacao de saque"
  ON public.withdrawal_requests
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
