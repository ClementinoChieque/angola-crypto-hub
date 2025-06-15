
-- Permitir que admin possa deletar qualquer solicitação de saque
CREATE POLICY "Admin pode deletar qualquer retirada"
  ON public.withdrawal_requests
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
