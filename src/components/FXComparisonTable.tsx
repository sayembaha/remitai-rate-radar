
import { BadgeEuro, Calendar, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import React from "react";

type Platform = {
  name: string;
  logo: string; // URL or emoji - for now, emoji as placeholder
  rate: number;
  fee: number;
  estDelivery: string;
  total: number;
  aiReco?: boolean;
};

const platformData: Platform[] = [
  {
    name: "Wise",
    logo: "🟦",
    rate: 124.2,
    fee: 3.2,
    estDelivery: "1 hr",
    total: 124.2 - 3.2,
    aiReco: true,
  },
  {
    name: "Remitly",
    logo: "🟩",
    rate: 123.5,
    fee: 4.5,
    estDelivery: "2 hr",
    total: 123.5 - 4.5,
  },
  {
    name: "Xoom",
    logo: "🟢",
    rate: 124.1,
    fee: 4.9,
    estDelivery: "10 min",
    total: 124.1 - 4.9,
  },
  {
    name: "Western Union",
    logo: "🟡",
    rate: 122.8,
    fee: 2.0,
    estDelivery: "1 day",
    total: 122.8 - 2,
  },
  {
    name: "Taptap Send",
    logo: "🟧",
    rate: 124.0,
    fee: 3.6,
    estDelivery: "2 hr",
    total: 124.0 - 3.6,
  },
];

export default function FXComparisonTable() {
  return (
    <Card className="w-full bg-white shadow-md rounded-xl p-0 overflow-x-auto border max-w-3xl mx-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-blue-50 via-green-50 to-cyan-50 text-gray-900">
            <th className="px-4 py-3 font-bold">Platform</th>
            <th className="px-4 py-3 font-medium flex items-center gap-1">
              FX Rate <DollarSign className="inline w-4 h-4 text-blue-500" />
            </th>
            <th className="px-4 py-3 font-medium">Fee</th>
            <th className="px-4 py-3 font-medium flex items-center gap-1">Est. Delivery <Calendar className="inline w-4 h-4" /></th>
            <th className="px-4 py-3 font-medium">Total Received</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {platformData.map((p) => (
            <tr key={p.name}
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
              <td className="px-4 py-2 whitespace-nowrap">{p.estDelivery}</td>
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
