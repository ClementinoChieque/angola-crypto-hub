
-- Adicionar políticas RLS para permitir que admins eliminem contas bancárias e carteiras USDT dos usuários
CREATE POLICY "Admins can delete all bank accounts"
  ON public.user_bank_accounts
  FOR DELETE
  USING (true);

CREATE POLICY "Admins can delete all USDT wallets"
  ON public.user_usdt_wallets
  FOR DELETE
  USING (true);

-- Adicionar política RLS para permitir que admins eliminem comprovativos de pagamento
CREATE POLICY "Admins can delete all payment proofs"
  ON public.payment_proofs
  FOR DELETE
  USING (true);
