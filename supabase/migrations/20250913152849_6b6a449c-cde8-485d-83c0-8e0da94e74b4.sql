-- Fix security vulnerability: Remove public access to email addresses
-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can view email alerts" ON public.email_alerts;

-- Keep the existing INSERT policy for public alert creation
-- Keep the existing authenticated user management policy

-- Add a more secure SELECT policy that only allows authenticated users
CREATE POLICY "Only authenticated users can view email alerts" 
ON public.email_alerts 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Ensure the service role can still access alerts for processing
-- (Service role automatically bypasses RLS, so no additional policy needed)