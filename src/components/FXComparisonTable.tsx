
import { useEffect, useState } from "react";
import { BadgeEuro, Calendar, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type Platform = {
  id: string;
  name: string;
  logo: string;
  rate: number;
  fee: number;
  estDelivery: string;
  total: number;
  aiReco?: boolean;
};

const platformLogos: Record<string, string> = {
  "Wise": "🟦",
  "Remitly": "🟩",
  "Xoom": "🟢",
  "MoneyGram": "🟨",
  "Western Union": "🟡",
  "WorldRemit": "🟧",
};

export default function FXComparisonTable() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    try {
      const { data, error } = await supabase
        .from("exchange_rates")
        .select("*")
        .order("exchange_rate", { ascending: false });

      if (error) {
        console.error("Error fetching exchange rates:", error);
        // Fall back to static data if there's an error
        setPlatforms(getStaticPlatforms());
        return;
      }

      const platformData: Platform[] = data.map((rate) => ({
        id: rate.id,
        name: rate.platform_name,
        logo: platformLogos[rate.platform_name] || "🟪",
        rate: rate.exchange_rate,
        fee: rate.transfer_fee,
        estDelivery: rate.delivery_time,
        total: rate.exchange_rate - rate.transfer_fee,
        aiReco: rate.is_ai_pick,
      }));

      setPlatforms(platformData);
    } catch (error) {
      console.error("Error:", error);
      setPlatforms(getStaticPlatforms());
    } finally {
      setLoading(false);
    }
  };

  const getStaticPlatforms = (): Platform[] => [
    {
      id: "1",
      name: "Wise",
      logo: "🟦",
      rate: 124.2,
      fee: 3.2,
      estDelivery: "1 hr",
      total: 124.2 - 3.2,
      aiReco: true,
    },
    {
      id: "2",
      name: "Remitly",
      logo: "🟩",
      rate: 123.5,
      fee: 4.5,
      estDelivery: "2 hr",
      total: 123.5 - 4.5,
    },
    {
      id: "3",
      name: "Xoom",
      logo: "🟢",
      rate: 124.1,
      fee: 4.9,
      estDelivery: "10 min",
      total: 124.1 - 4.9,
    },
    {
      id: "4",
      name: "Western Union",
      logo: "🟡",
      rate: 122.8,
      fee: 2.0,
      estDelivery: "1 day",
      total: 122.8 - 2,
    },
    {
      id: "5",
      name: "Taptap Send",
      logo: "🟧",
      rate: 124.0,
      fee: 3.6,
      estDelivery: "2 hr",
      total: 124.0 - 3.6,
    },
  ];

  if (loading) {
    return (
      <Card className="w-full bg-white shadow-md rounded-xl p-8 border max-w-3xl mx-auto">
        <div className="text-center">Loading exchange rates...</div>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white shadow-md rounded-xl p-0 overflow-x-auto border max-w-3xl mx-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-sky-400 to-indigo-500 text-white">
            <th className="px-4 py-3 font-bold">Platform</th>
            <th className="px-4 py-3 font-medium flex items-center gap-1">
              FX Rate <DollarSign className="inline w-4 h-4 text-blue-500" />
            </th>
            <th className="px-4 py-3 font-medium">Fee</th>
            <th className="px-4 py-3 font-medium">Total Received</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {platforms.map((p) => (
            <tr key={p.id}
              className={`border-t hover:bg-blue-50 transition ${
                p.aiReco ? "bg-green-50/60 font-semibold" : ""
              }`}
            >
              <td className="px-4 py-2 whitespace-nowrap">
                <span className="text-lg mr-2">{p.logo}</span>
                {p.name}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {p.rate.toFixed(2)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                ${p.fee.toFixed(2)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap font-bold text-blue-600">{p.total.toFixed(2)}</td>
              <td className="px-4 py-2">
                {p.aiReco && (
                  <span className="bg-green-500 text-white rounded px-2 py-1 text-xs font-semibold ml-1">
                    AI Pick
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
