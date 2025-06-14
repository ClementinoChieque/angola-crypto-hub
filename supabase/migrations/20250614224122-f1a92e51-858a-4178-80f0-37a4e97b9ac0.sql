
-- Criar índice para melhorar a performance do FK user_quantifications.investment_plan_id
CREATE INDEX IF NOT EXISTS idx_user_quantifications_investment_plan_id ON public.user_quantifications(investment_plan_id);
