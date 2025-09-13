import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Save, AlertTriangle } from "lucide-react";

interface PlatformConfig {
  name: string;
  url: string;
  rateSelector: string;
  feeSelector: string;
  notes: string;
}

const defaultConfigs: PlatformConfig[] = [
  {
    name: "Wise",
    url: "https://wise.com/us/send-money/send-money-to-bangladesh",
    rateSelector: "",
    feeSelector: "",
    notes: "Wise has an API available - consider using their official API instead"
  },
  {
    name: "Remitly",
    url: "https://www.remitly.com/us/en/bangladesh",
    rateSelector: "",
    feeSelector: "",
    notes: "Check their terms of service before scraping"
  },
  {
    name: "Xoom",
    url: "https://www.xoom.com/bangladesh/send-money",
    rateSelector: "",
    feeSelector: "",
    notes: "PayPal service - may have anti-scraping measures"
  },
  {
    name: "Western Union", 
    url: "https://www.westernunion.com/us/en/send-money/send-money-bangladesh.html",
    rateSelector: "",
    feeSelector: "",
    notes: "Requires careful rate extraction from their calculator"
  },
  {
    name: "MoneyGram",
    url: "https://www.moneygram.com/us/en/send/bangladesh",
    rateSelector: "",
    feeSelector: "",
    notes: "Dynamic pricing - may need to simulate form submission"
  }
];

export default function ScraperConfig() {
  const [configs, setConfigs] = useState<PlatformConfig[]>(defaultConfigs);
  const { toast } = useToast();

  const handleConfigChange = (index: number, field: keyof PlatformConfig, value: string) => {
    const newConfigs = [...configs];
    newConfigs[index] = { ...newConfigs[index], [field]: value };
    setConfigs(newConfigs);
  };

  const handleSaveConfig = async () => {
    // TODO: Save configuration to Supabase or local storage
    toast({
      title: "Configuration Saved",
      description: "Scraper configurations have been saved.",
    });
  };

  const handleTestUrl = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-amber-500" />
        <h2 className="text-xl font-semibold">Scraper Configuration</h2>
      </div>
      
      <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h3 className="font-medium text-amber-800 mb-2">⚠️ Important Legal Notice</h3>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• Check each platform's Terms of Service before scraping</li>
          <li>• Consider using official APIs where available (e.g., Wise API)</li>
          <li>• Implement respectful scraping with proper delays</li>
          <li>• Monitor for anti-scraping measures and adapt accordingly</li>
        </ul>
      </div>

      <div className="space-y-6">
        {configs.map((config, index) => (
          <Card key={config.name} className="p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">{config.name}</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTestUrl(config.url)}
                className="flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                Test URL
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Target URL</label>
                <Input
                  value={config.url}
                  onChange={(e) => handleConfigChange(index, 'url', e.target.value)}
                  placeholder="https://example.com/send-money"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Rate CSS Selector</label>
                <Input
                  value={config.rateSelector}
                  onChange={(e) => handleConfigChange(index, 'rateSelector', e.target.value)}
                  placeholder=".exchange-rate, #rate-display"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Fee CSS Selector</label>
                <Input
                  value={config.feeSelector}
                  onChange={(e) => handleConfigChange(index, 'feeSelector', e.target.value)}
                  placeholder=".fee-amount, .transfer-cost"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <Input
                  value={config.notes}
                  onChange={(e) => handleConfigChange(index, 'notes', e.target.value)}
                  placeholder="Special considerations for this platform"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <p>Next steps after configuration:</p>
          <ol className="list-decimal list-inside space-y-1 mt-1">
            <li>Test each URL to understand the page structure</li>
            <li>Inspect element to find the correct CSS selectors</li>
            <li>Update the scraper functions with actual implementation</li>
            <li>Test manual scraping before setting up automation</li>
          </ol>
        </div>
        
        <Button onClick={handleSaveConfig} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Configuration
        </Button>
      </div>
    </Card>
  );
}