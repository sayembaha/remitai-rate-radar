
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

interface ExchangeRate {
  platform_name: string;
  exchange_rate: number;
  is_ai_pick: boolean;
}

interface EmailAlert {
  id: string;
  email: string;
  threshold_rate: number;
  direction: string;
  currency_pair: string;
  last_triggered_rate: number | null;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting alert check...');

    // Get current exchange rates
    const { data: rates, error: ratesError } = await supabase
      .from('exchange_rates')
      .select('platform_name, exchange_rate, is_ai_pick')
      .order('exchange_rate', { ascending: false });

    if (ratesError) {
      console.error('Error fetching exchange rates:', ratesError);
      throw ratesError;
    }

    if (!rates || rates.length === 0) {
      console.log('No exchange rates found');
      return new Response(JSON.stringify({ message: 'No exchange rates found' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Get the current best rate (highest rate)
    const currentBestRate = rates[0].exchange_rate;
    console.log('Current best rate:', currentBestRate);

    // Get active alerts
    const { data: alerts, error: alertsError } = await supabase
      .from('email_alerts')
      .select('*')
      .eq('is_active', true);

    if (alertsError) {
      console.error('Error fetching alerts:', alertsError);
      throw alertsError;
    }

    if (!alerts || alerts.length === 0) {
      console.log('No active alerts found');
      return new Response(JSON.stringify({ message: 'No active alerts found' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    console.log(`Found ${alerts.length} active alerts`);

    let notificationsSent = 0;

    // Check each alert
    for (const alert of alerts as EmailAlert[]) {
      const shouldTrigger = checkIfAlertShouldTrigger(alert, currentBestRate);
      
      if (shouldTrigger) {
        console.log(`Triggering alert for ${alert.email}: ${alert.direction} ${alert.threshold_rate}`);
        
        // Send email notification
        await sendNotificationEmail(alert, currentBestRate, rates as ExchangeRate[]);
        
        // Update alert with last triggered info
        await supabase
          .from('email_alerts')
          .update({
            last_triggered_at: new Date().toISOString(),
            last_triggered_rate: currentBestRate,
            notification_count: (alert as any).notification_count ? (alert as any).notification_count + 1 : 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', alert.id);

        notificationsSent++;
      }
    }

    console.log(`Alert check completed. Sent ${notificationsSent} notifications.`);

    return new Response(JSON.stringify({ 
      message: 'Alert check completed',
      notificationsSent,
      currentRate: currentBestRate,
      alertsChecked: alerts.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Error in check-alerts function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

function checkIfAlertShouldTrigger(alert: EmailAlert, currentRate: number): boolean {
  // Don't trigger if already triggered recently with same or similar rate
  if (alert.last_triggered_rate && Math.abs(alert.last_triggered_rate - currentRate) < 0.001) {
    return false;
  }

  if (alert.direction === 'above') {
    return currentRate >= alert.threshold_rate;
  } else {
    return currentRate <= alert.threshold_rate;
  }
}

async function sendNotificationEmail(alert: EmailAlert, currentRate: number, rates: ExchangeRate[]) {
  const aiPickPlatform = rates.find(r => r.is_ai_pick)?.platform_name || 'Wise';
  
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Rate Alert Triggered! 🔔</h1>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #059669; margin-top: 0;">Current ${alert.currency_pair} Rate</h2>
        <p style="font-size: 24px; font-weight: bold; color: #1f2937; margin: 10px 0;">
          ${currentRate.toFixed(6)} BDT per USD
        </p>
        <p style="color: #6b7280;">
          You requested to be notified when the rate goes <strong>${alert.direction}</strong> 
          <strong>${alert.threshold_rate}</strong> BDT/USD
        </p>
      </div>

      <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #059669; margin-top: 0;">🤖 AI Recommendation</h3>
        <p style="margin: 10px 0;">
          Our AI currently recommends <strong>${aiPickPlatform}</strong> for the best rates and lowest fees.
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://vcuwakrhtojxhmshaikw.supabase.co" 
           style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          View Current Rates
        </a>
      </div>

      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; color: #6b7280; font-size: 14px;">
        <p>This alert was sent because you signed up for rate notifications on RemitAI.</p>
        <p>Current time: ${new Date().toISOString()}</p>
      </div>
    </div>
  `;

  try {
    const emailResponse = await resend.emails.send({
      from: "RemitAI Alerts <onboarding@resend.dev>",
      to: [alert.email],
      subject: `🔔 Rate Alert: ${alert.currency_pair} is ${alert.direction} ${alert.threshold_rate}`,
      html: emailHtml,
    });

    console.log(`Email sent successfully to ${alert.email}:`, emailResponse);
  } catch (error) {
    console.error(`Failed to send email to ${alert.email}:`, error);
    throw error;
  }
}

serve(handler);
