
-- Adicionar índice para melhorar a performance de queries e integridade envolvendo o FK referrals_referred_user_id_fkey
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON public.referrals(referred_user_id);
