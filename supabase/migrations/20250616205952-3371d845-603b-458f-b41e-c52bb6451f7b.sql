
-- Add status column to transactions table for deposit approval workflow
ALTER TABLE public.transactions 
ADD COLUMN status text DEFAULT 'completed';

-- Update existing records to have 'completed' status
UPDATE public.transactions 
SET status = 'completed' 
WHERE status IS NULL;
