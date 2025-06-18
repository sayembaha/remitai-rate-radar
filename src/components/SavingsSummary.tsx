
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { RechartsSavingsChart } from "./SavingsSummaryChart";

export default function SavingsSummary() {
  const [savings, setSavings] = useState(200);

  useEffect(() => {
    // Generate random savings amount between $200-$350 when component mounts
    const randomSavings = Math.floor(Math.random() * (350 - 200 + 1)) + 200;
    setSavings(randomSavings);
  }, []);

  return (
    <Card className="max-w-3xl mx-auto mt-6 rounded-xl shadow bg-gradient-to-r from-sky-400 to-indigo-500 py-4 px-6 flex flex-col md:flex-row gap-4 items-center text-white">
      <div className="flex-1">
        <div className="text-2xl font-bold text-green-600">Savings Dashboard</div>
        <div className="text-md text-gray-600 mt-1 mb-2">
          You could save <span className="font-bold text-blue-700">${savings}</span> yearly by using RemitAI's AI-suggested platform.
        </div>
        <div className="mt-2">
          <RechartsSavingsChart />
        </div>
      </div>
    </Card>
  );
}
