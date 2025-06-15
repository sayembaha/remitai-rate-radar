
import { BadgeDollarSign } from "lucide-react";

export default function RecommendationBanner() {
  return (
    <div className="bg-gradient-to-tr from-green-400 via-blue-400 to-cyan-400 text-white shadow-lg rounded-xl p-4 mt-4 mb-6 flex items-center gap-4 max-w-3xl mx-auto animate-fade-in">
      <BadgeDollarSign className="w-8 h-8 flex-shrink-0" />
      <div>
        <div className="text-lg font-semibold">Recommended: Wise</div>
        <div className="text-sm opacity-90">
          Our AI recommends <span className="font-bold">Wise</span> for this corridor,<br className="hidden sm:inline"/> as it offers the best FX rate and lowest fees right now.
        </div>
      </div>
    </div>
  );
}
