import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExchangeRate {
  platform_name: string;
  exchange_rate: number;
  transfer_fee: number;
  delivery_time: string;
  sender_country: string;
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Scraper functions for different platforms
async function scrapeWise(senderCountry: string): Promise<ExchangeRate | null> {
  try {
    console.log(`Scraping Wise rates for ${senderCountry}`);
    
    // TODO: Implement actual Wise scraping logic
    // For now, return mock data - you'll need to implement the actual scraping
    const mockRate: ExchangeRate = {
      platform_name: "Wise",
      exchange_rate: 124.2 + (Math.random() - 0.5) * 2, // Mock fluctuation
      transfer_fee: 3.2,
      delivery_time: "1 hr",
      sender_country: senderCountry,
    };
    
    return mockRate;
  } catch (error) {
    console.error(`Error scraping Wise for ${senderCountry}:`, error);
    return null;
  }
}

async function scrapeRemitly(senderCountry: string): Promise<ExchangeRate | null> {
  try {
    console.log(`Scraping Remitly rates for ${senderCountry}`);
    
    // TODO: Implement actual Remitly scraping logic
    const mockRate: ExchangeRate = {
      platform_name: "Remitly",
      exchange_rate: 123.5 + (Math.random() - 0.5) * 2,
      transfer_fee: 4.5,
      delivery_time: "2 hr",
      sender_country: senderCountry,
    };
    
    return mockRate;
  } catch (error) {
    console.error(`Error scraping Remitly for ${senderCountry}:`, error);
    return null;
  }
}

async function scrapeXoom(senderCountry: string): Promise<ExchangeRate | null> {
  try {
    console.log(`Scraping Xoom rates for ${senderCountry}`);
    
    // TODO: Implement actual Xoom scraping logic
    const mockRate: ExchangeRate = {
      platform_name: "Xoom",
      exchange_rate: 124.1 + (Math.random() - 0.5) * 2,
      transfer_fee: 4.9,
      delivery_time: "10 min",
      sender_country: senderCountry,
    };
    
    return mockRate;
  } catch (error) {
    console.error(`Error scraping Xoom for ${senderCountry}:`, error);
    return null;
  }
}

async function scrapeWesternUnion(senderCountry: string): Promise<ExchangeRate | null> {
  try {
    console.log(`Scraping Western Union rates for ${senderCountry}`);
    
    // TODO: Implement actual Western Union scraping logic
    const mockRate: ExchangeRate = {
      platform_name: "Western Union",
      exchange_rate: 122.8 + (Math.random() - 0.5) * 2,
      transfer_fee: 2.0,
      delivery_time: "1 day",
      sender_country: senderCountry,
    };
    
    return mockRate;
  } catch (error) {
    console.error(`Error scraping Western Union for ${senderCountry}:`, error);
    return null;
  }
}

async function scrapeMoneyGram(senderCountry: string): Promise<ExchangeRate | null> {
  try {
    console.log(`Scraping MoneyGram rates for ${senderCountry}`);
    
    // TODO: Implement actual MoneyGram scraping logic
    const mockRate: ExchangeRate = {
      platform_name: "MoneyGram",
      exchange_rate: 123.0 + (Math.random() - 0.5) * 2,
      transfer_fee: 3.5,
      delivery_time: "3 hr",
      sender_country: senderCountry,
    };
    
    return mockRate;
  } catch (error) {
    console.error(`Error scraping MoneyGram for ${senderCountry}:`, error);
    return null;
  }
}

async function updateExchangeRates(rates: ExchangeRate[]): Promise<void> {
  try {
    console.log(`Updating ${rates.length} exchange rates in database`);
    
    for (const rate of rates) {
      // Check if record exists
      const { data: existing } = await supabase
        .from('exchange_rates')
        .select('id')
        .eq('platform_name', rate.platform_name)
        .eq('sender_country', rate.sender_country)
        .single();

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('exchange_rates')
          .update({
            exchange_rate: rate.exchange_rate,
            transfer_fee: rate.transfer_fee,
            delivery_time: rate.delivery_time,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (error) {
          console.error(`Error updating ${rate.platform_name}:`, error);
        } else {
          console.log(`Updated ${rate.platform_name} for ${rate.sender_country}`);
        }
      } else {
        // Insert new record
        const { error } = await supabase
          .from('exchange_rates')
          .insert(rate);

        if (error) {
          console.error(`Error inserting ${rate.platform_name}:`, error);
        } else {
          console.log(`Inserted new record for ${rate.platform_name} - ${rate.sender_country}`);
        }
      }
    }
  } catch (error) {
    console.error('Error updating exchange rates:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting exchange rate scraping process...');
    
    const countries = ['UAE', 'Saudi Arabia', 'USA'];
    const scrapers = [
      scrapeWise,
      scrapeRemitly,
      scrapeXoom,
      scrapeWesternUnion,
      scrapeMoneyGram,
    ];

    const allRates: ExchangeRate[] = [];

    // Scrape rates for each country and platform
    for (const country of countries) {
      console.log(`Scraping rates for ${country}...`);
      
      for (const scraper of scrapers) {
        try {
          const rate = await scraper(country);
          if (rate) {
            allRates.push(rate);
          }
        } catch (error) {
          console.error(`Error with scraper for ${country}:`, error);
        }
      }
    }

    console.log(`Scraped ${allRates.length} rates total`);

    // Update database with scraped rates
    if (allRates.length > 0) {
      await updateExchangeRates(allRates);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully scraped and updated ${allRates.length} exchange rates`,
        timestamp: new Date().toISOString(),
        rates_updated: allRates.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in scrape-exchange-rates function:', error);
    
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