
import { Card } from "@/components/ui/card";
import { RechartsSavingsChart } from "./SavingsSummaryChart";

export default function SavingsSummary() {
  return (
    <Card className="max-w-3xl mx-auto mt-6 rounded-xl shadow bg-gradient-to-r from-blue-50 to-green-50 py-4 px-6 flex flex-col md:flex-row gap-4 items-center">
      <div className="flex-1">
        <div className="text-2xl font-bold text-green-600">Savings Dashboard</div>
        <div className="text-md text-gray-600 mt-1 mb-2">
          You could save <span className="font-bold text-blue-700">$180</span> yearly by using RemitAI's AI-suggested platform.
        </div>
        <div className="mt-2">
          <RechartsSavingsChart />
        </div>
      </div>
    </Card>
  );
}
