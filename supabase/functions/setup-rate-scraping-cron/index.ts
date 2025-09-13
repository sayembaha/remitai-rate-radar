import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Setting up cron job for exchange rate scraping...');

    // Create or update the cron job to run every 6 hours
    const { data, error } = await supabase.rpc('cron_schedule', {
      job_name: 'scrape-exchange-rates-every-6h',
      cron_expression: '0 */6 * * *', // Every 6 hours at minute 0
      sql_command: `
        select
          net.http_post(
            url := '${supabaseUrl}/functions/v1/scrape-exchange-rates',
            headers := '{"Content-Type": "application/json", "Authorization": "Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}"}'::jsonb,
            body := '{"scheduled": true, "timestamp": "' || now() || '"}'::jsonb
          ) as request_id;
      `
    });

    if (error) {
      throw error;
    }

    console.log('Cron job setup successful');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Exchange rate scraping cron job has been set up to run every 6 hours',
        cron_expression: '0 */6 * * *',
        next_run: 'Every 6 hours at minute 0',
        setup_time: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error setting up cron job:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});