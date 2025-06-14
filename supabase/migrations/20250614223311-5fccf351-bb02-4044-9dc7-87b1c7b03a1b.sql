
-- Ajustar políticas de RLS na tabela transactions para melhor desempenho
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.transactions;
CREATE POLICY "Users can insert their own transactions"
  ON public.transactions
  FOR INSERT
  WITH CHECK (user_id = (select auth.uid()));

-- (Se houver outras políticas usando auth.uid(), sugiro revisar e corrigir também, mas esta é a mencionada pelo aviso.)
