
-- Remover índices não utilizados conforme relatório de performance

-- referrals
DROP INDEX IF EXISTS idx_referrals_referrer_status;
DROP INDEX IF EXISTS idx_referrals_referred_user_id;
DROP INDEX IF EXISTS idx_referrals_code;
DROP INDEX IF EXISTS idx_referrals_status;

-- payment_proofs
DROP INDEX IF EXISTS idx_payment_proofs_status;
DROP INDEX IF EXISTS idx_payment_proofs_admin_view;

-- user_usdt_wallets
DROP INDEX IF EXISTS idx_user_usdt_wallets_user_id;
DROP INDEX IF EXISTS idx_user_usdt_wallets_created_at;

-- transactions
DROP INDEX IF EXISTS idx_transactions_user_id;
DROP INDEX IF EXISTS idx_transactions_type;
DROP INDEX IF EXISTS idx_transactions_currency;
DROP INDEX IF EXISTS idx_transactions_user_type;
DROP INDEX IF EXISTS idx_transactions_created_at;

-- referral_rewards
DROP INDEX IF EXISTS idx_referral_rewards_referrer_id;
DROP INDEX IF EXISTS idx_referral_rewards_referred_user_id;
DROP INDEX IF EXISTS idx_referral_rewards_status;
DROP INDEX IF EXISTS idx_referral_rewards_created_at;

-- user_quantifications
DROP INDEX IF EXISTS idx_user_quantifications_user_id;
DROP INDEX IF EXISTS idx_user_quantifications_is_active;
DROP INDEX IF EXISTS idx_user_quantifications_last_reset_date;
DROP INDEX IF EXISTS idx_user_quantifications_investment_plan_id;

-- referral_codes
DROP INDEX IF EXISTS idx_referral_codes_is_active;

-- profiles
DROP INDEX IF EXISTS idx_profiles_username;
DROP INDEX IF EXISTS idx_profiles_created_at;
