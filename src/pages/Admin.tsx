
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { LogOut, Save } from "lucide-react";
import type { User } from "@supabase/supabase-js";

type ExchangeRate = {
  id: string;
  platform_name: string;
  exchange_rate: number;
  transfer_fee: number;
  delivery_time: string;
  is_ai_pick: boolean;
};

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    try {
      const { data, error } = await supabase
        .from("exchange_rates")
        .select("*")
        .order("platform_name");

      if (error) throw error;
      setExchangeRates(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch exchange rates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (id: string, field: keyof ExchangeRate, value: string | number | boolean) => {
    setExchangeRates(prev =>
      prev.map(rate =>
        rate.id === id ? { ...rate, [field]: value } : rate
      )
    );
  };

  const handleAiPickChange = (selectedId: string) => {
    setExchangeRates(prev =>
      prev.map(rate => ({
        ...rate,
        is_ai_pick: rate.id === selectedId
      }))
    );
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const updates = exchangeRates.map(rate => ({
        id: rate.id,
        platform_name: rate.platform_name,
        exchange_rate: rate.exchange_rate,
        transfer_fee: rate.transfer_fee,
        delivery_time: rate.delivery_time,
        is_ai_pick: rate.is_ai_pick,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from("exchange_rates")
        .upsert(updates);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Exchange rates updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update exchange rates",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">RemitAI Admin Panel</h1>
            <p className="text-gray-600">Manage exchange rates and platform data</p>
            {user && <p className="text-sm text-gray-500">Logged in as: {user.email}</p>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
            >
              View Site
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Exchange Rates</h2>
            <button
              onClick={saveChanges}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="space-y-4">
            {exchangeRates.map((rate) => (
              <div key={rate.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Platform
                    </label>
                    <div className="font-semibold text-lg">{rate.platform_name}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exchange Rate
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={rate.exchange_rate}
                      onChange={(e) => handleInputChange(rate.id, "exchange_rate", parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Transfer Fee ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={rate.transfer_fee}
                      onChange={(e) => handleInputChange(rate.id, "transfer_fee", parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Time
                    </label>
                    <input
                      type="text"
                      value={rate.delivery_time}
                      onChange={(e) => handleInputChange(rate.id, "delivery_time", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      AI Pick
                    </label>
                    <input
                      type="radio"
                      name="ai_pick"
                      checked={rate.is_ai_pick}
                      onChange={() => handleAiPickChange(rate.id)}
                      className="w-4 h-4 text-blue-600"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
