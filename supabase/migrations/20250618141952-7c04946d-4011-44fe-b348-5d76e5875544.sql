
-- Add foreign key constraint to link user_deposits to profiles
ALTER TABLE public.user_deposits 
ADD CONSTRAINT user_deposits_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
