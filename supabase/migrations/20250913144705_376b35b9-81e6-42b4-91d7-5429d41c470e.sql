-- Add sender_country column to exchange_rates table
ALTER TABLE public.exchange_rates 
ADD COLUMN sender_country text NOT NULL DEFAULT 'UAE';

-- Update existing records to have UAE as default
UPDATE public.exchange_rates 
SET sender_country = 'UAE' 
WHERE sender_country IS NULL;

-- Add constraint to ensure only valid sender countries
ALTER TABLE public.exchange_rates 
ADD CONSTRAINT valid_sender_country 
CHECK (sender_country IN ('UAE', 'Saudi Arabia', 'USA'));