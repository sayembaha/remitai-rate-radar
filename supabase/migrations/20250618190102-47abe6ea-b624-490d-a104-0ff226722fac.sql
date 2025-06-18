
-- Add columns to track notification status and prevent duplicates
ALTER TABLE public.email_alerts 
ADD COLUMN last_triggered_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN last_triggered_rate DECIMAL(10,6),
ADD COLUMN notification_count INTEGER DEFAULT 0;

-- Create an index for better performance when querying active alerts
CREATE INDEX idx_email_alerts_active ON public.email_alerts (is_active) WHERE is_active = true;

-- Enable pg_cron extension for scheduled tasks (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests (if not already enabled) 
CREATE EXTENSION IF NOT EXISTS pg_net;
