
-- Criar índices para melhorar o desempenho das consultas mais comuns

-- Índices para tabela referrals (consultas frequentes por referrer_id e status)
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_status ON public.referrals(referrer_id, status);
CREATE INDEX IF NOT EXISTS idx_referrals_created_at ON public.referrals(created_at DESC);

-- Índices para tabela payment_proofs (consultas por user_id e status)
CREATE INDEX IF NOT EXISTS idx_payment_proofs_user_id ON public.payment_proofs(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_proofs_status ON public.payment_proofs(status);
CREATE INDEX IF NOT EXISTS idx_payment_proofs_user_status ON public.payment_proofs(user_id, status);
CREATE INDEX IF NOT EXISTS idx_payment_proofs_created_at ON public.payment_proofs(created_at DESC);

-- Índices para tabela user_bank_accounts (consultas por user_id)
CREATE INDEX IF NOT EXISTS idx_user_bank_accounts_user_id ON public.user_bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bank_accounts_created_at ON public.user_bank_accounts(created_at DESC);

-- Índices para tabela user_usdt_wallets (consultas por user_id)
CREATE INDEX IF NOT EXISTS idx_user_usdt_wallets_user_id ON public.user_usdt_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_usdt_wallets_created_at ON public.user_usdt_wallets(created_at DESC);

-- Índices para tabela transactions (consultas por user_id, type e currency)
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_currency ON public.transactions(currency);
CREATE INDEX IF NOT EXISTS idx_transactions_user_type ON public.transactions(user_id, type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);

-- Índices para tabela referral_rewards (consultas por referrer_id e status)
CREATE INDEX IF NOT EXISTS idx_referral_rewards_referrer_id ON public.referral_rewards(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_referred_user_id ON public.referral_rewards(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_status ON public.referral_rewards(status);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_created_at ON public.referral_rewards(created_at DESC);

-- Índices para tabela user_quantifications (consultas por user_id e is_active)
CREATE INDEX IF NOT EXISTS idx_user_quantifications_user_id ON public.user_quantifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quantifications_is_active ON public.user_quantifications(is_active);
CREATE INDEX IF NOT EXISTS idx_user_quantifications_last_reset_date ON public.user_quantifications(last_reset_date);

-- Índices para tabela referral_codes (consultas por user_id e code)
CREATE INDEX IF NOT EXISTS idx_referral_codes_user_id ON public.referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON public.referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_is_active ON public.referral_codes(is_active);

-- Índices para tabela profiles (consultas por username)
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);

-- Índices compostos para consultas específicas comuns
CREATE INDEX IF NOT EXISTS idx_referrals_complete_lookup ON public.referrals(referrer_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_proofs_admin_view ON public.payment_proofs(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_summary ON public.transactions(user_id, currency, created_at DESC);
