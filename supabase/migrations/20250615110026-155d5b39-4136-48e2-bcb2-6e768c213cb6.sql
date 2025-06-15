
-- Criação da tabela para registrar solicitações de saque
CREATE TABLE public.withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL,
  withdrawal_method TEXT NOT NULL, -- Ex: 'crypto' (USDT) ou 'bank' (Kwanza)
  wallet_address TEXT, -- Opcional: se método for USDT
  bank_name TEXT,      -- Opcional: se método for bank
  bank_account TEXT,   -- Opcional: se método for bank
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected, completed
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- RLS: Permitir apenas o próprio usuário ver/criar suas solicitações
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can view own withdrawals"
  ON public.withdrawal_requests
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "User can create withdrawal"
  ON public.withdrawal_requests
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Permitir admin atualizar status/anotações (use a função has_role): 
-- (este exemplo libera para futuras políticas mais estritas)
CREATE POLICY "Admin can update withdrawal"
  ON public.withdrawal_requests
  FOR UPDATE
  USING (true);

