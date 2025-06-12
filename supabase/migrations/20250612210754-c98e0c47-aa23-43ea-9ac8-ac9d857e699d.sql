
-- Create table for user bank accounts
CREATE TABLE public.user_bank_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_holder TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'AKZ',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user USDT wallets
CREATE TABLE public.user_usdt_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  wallet_address TEXT NOT NULL,
  network TEXT NOT NULL DEFAULT 'TRC-20',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own accounts
ALTER TABLE public.user_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_usdt_wallets ENABLE ROW LEVEL SECURITY;

-- Create policies for user_bank_accounts
CREATE POLICY "Users can view their own bank accounts" 
  ON public.user_bank_accounts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bank accounts" 
  ON public.user_bank_accounts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all bank accounts"
  ON public.user_bank_accounts
  FOR SELECT
  USING (true);

-- Create policies for user_usdt_wallets
CREATE POLICY "Users can view their own USDT wallets" 
  ON public.user_usdt_wallets 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own USDT wallets" 
  ON public.user_usdt_wallets 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all USDT wallets"
  ON public.user_usdt_wallets
  FOR SELECT
  USING (true);
