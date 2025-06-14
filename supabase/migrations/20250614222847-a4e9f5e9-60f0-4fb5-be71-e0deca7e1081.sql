
-- Recriar políticas de RLS para melhor performance em user_bank_accounts
DROP POLICY IF EXISTS "Users can view their own bank accounts" ON public.user_bank_accounts;
CREATE POLICY "Users can view their own bank accounts" 
  ON public.user_bank_accounts 
  FOR SELECT 
  USING ((user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can create their own bank accounts" ON public.user_bank_accounts;
CREATE POLICY "Users can create their own bank accounts" 
  ON public.user_bank_accounts 
  FOR INSERT 
  WITH CHECK (user_id = (select auth.uid()));

-- Recriar políticas de RLS para melhor performance em user_usdt_wallets
DROP POLICY IF EXISTS "Users can view their own USDT wallets" ON public.user_usdt_wallets;
CREATE POLICY "Users can view their own USDT wallets" 
  ON public.user_usdt_wallets 
  FOR SELECT 
  USING ((user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can create their own USDT wallets" ON public.user_usdt_wallets;
CREATE POLICY "Users can create their own USDT wallets" 
  ON public.user_usdt_wallets 
  FOR INSERT 
  WITH CHECK (user_id = (select auth.uid()));
