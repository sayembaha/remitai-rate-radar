
-- Create a table to store user email alerts
CREATE TABLE public.email_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  threshold_rate DECIMAL(10,6) NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('above', 'below')),
  currency_pair TEXT NOT NULL DEFAULT 'BDT/USD',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.email_alerts ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to create alerts (for public use)
CREATE POLICY "Anyone can create email alerts" 
  ON public.email_alerts 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy that allows anyone to view alerts (for admin purposes)
CREATE POLICY "Anyone can view email alerts" 
  ON public.email_alerts 
  FOR SELECT 
  USING (true);

-- Create policy that allows authenticated users to manage alerts (for admin)
CREATE POLICY "Authenticated users can manage email alerts" 
  ON public.email_alerts 
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
