
-- Create a table to store exchange rate data
CREATE TABLE public.exchange_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform_name TEXT NOT NULL,
  exchange_rate DECIMAL(10,6) NOT NULL,
  transfer_fee DECIMAL(10,2) NOT NULL,
  delivery_time TEXT NOT NULL,
  is_ai_pick BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to read exchange rates (for public display)
CREATE POLICY "Anyone can view exchange rates" 
  ON public.exchange_rates 
  FOR SELECT 
  USING (true);

-- Create policy that allows authenticated users to insert/update rates (for admin)
CREATE POLICY "Authenticated users can manage exchange rates" 
  ON public.exchange_rates 
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Insert initial data for the platforms
INSERT INTO public.exchange_rates (platform_name, exchange_rate, transfer_fee, delivery_time, is_ai_pick) VALUES
('Wise', 0.7845, 4.24, 'Within 1 hour', true),
('Remitly', 0.7821, 0.00, '2-3 hours', false),
('Xoom', 0.7798, 2.99, '30 mins', false),
('MoneyGram', 0.7776, 4.99, '10 mins', false),
('Western Union', 0.7754, 8.00, '5 mins', false),
('WorldRemit', 0.7732, 2.99, '1-2 hours', false);
