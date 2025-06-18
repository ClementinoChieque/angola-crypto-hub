
-- Create a table to store user deposits
CREATE TABLE public.user_deposits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USDT',
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.user_deposits ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all deposits
CREATE POLICY "Admins can view all deposits" 
  ON public.user_deposits 
  FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create policy for users to insert their own deposits
CREATE POLICY "Users can create their own deposits" 
  ON public.user_deposits 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policy for admins to update deposits
CREATE POLICY "Admins can update deposits" 
  ON public.user_deposits 
  FOR UPDATE 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
