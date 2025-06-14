
-- Step 1: Create a new table to store investment plan details
CREATE TABLE public.investment_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  level_name TEXT NOT NULL,
  currency VARCHAR(10) NOT NULL,
  investment NUMERIC NOT NULL,
  daily_earning NUMERIC NOT NULL,
  monthly_earning NUMERIC NOT NULL,
  yearly_earning NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(level_name, currency)
);

-- Step 2: Enable Row Level Security for the new table
ALTER TABLE public.investment_plans ENABLE ROW LEVEL SECURITY;

-- Step 3: Create a policy to allow authenticated users to read investment plans
CREATE POLICY "Allow authenticated users to read investment plans"
ON public.investment_plans FOR SELECT
TO authenticated
USING (true);

-- Step 4: Populate the investment_plans table with USDT plans
INSERT INTO public.investment_plans (level_name, currency, investment, daily_earning, monthly_earning, yearly_earning) VALUES
('BitcoinL1', 'USDT', 10, 0.20, 6.00, 73.00),
('BitcoinL2', 'USDT', 20, 0.8, 18, 292),
('BitcoinL3', 'USDT', 30, 1.2, 27, 438),
('BitcoinL4', 'USDT', 40, 1.6, 36, 584),
('BitcoinL5', 'USDT', 50, 2, 45, 730),
('BitcoinL6', 'USDT', 100, 4, 90, 1460);

-- Step 5: Populate the investment_plans table with AKZ plans
INSERT INTO public.investment_plans (level_name, currency, investment, daily_earning, monthly_earning, yearly_earning) VALUES
('BitcoinL1', 'AKZ', 8000, 200, 6000, 73000),
('BitcoinL2', 'AKZ', 12000, 300, 9000, 109500),
('BitcoinL3', 'AKZ', 20000, 500, 15000, 182500),
('BitcoinL4', 'AKZ', 30000, 750, 22500, 273750),
('BitcoinL5', 'AKZ', 50000, 1250, 37500, 456250),
('BitcoinL6', 'AKZ', 150000, 3750, 112500, 1368750),
('BitcoinL7', 'AKZ', 300000, 7500, 225000, 2737500),
('BitcoinL8', 'AKZ', 1000000, 25000, 750000, 9125000);

-- Step 6: Alter user_quantifications table to add investment plan and balance fields
ALTER TABLE public.user_quantifications
ADD COLUMN investment_plan_id UUID,
ADD COLUMN balance NUMERIC NOT NULL DEFAULT 0;

-- Step 7: Add foreign key constraint to link user_quantifications to investment_plans
ALTER TABLE public.user_quantifications
ADD CONSTRAINT fk_investment_plan
FOREIGN KEY (investment_plan_id)
REFERENCES public.investment_plans(id)
ON DELETE SET NULL;
