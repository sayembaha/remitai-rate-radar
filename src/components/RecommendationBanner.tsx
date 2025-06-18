
import { BadgeDollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function RecommendationBanner() {
  const [aiPickPlatform, setAiPickPlatform] = useState("Wise");

  useEffect(() => {
    fetchAiPickPlatform();
  }, []);

  const fetchAiPickPlatform = async () => {
    try {
      const { data, error } = await supabase
        .from("exchange_rates")
        .select("platform_name")
        .eq("is_ai_pick", true)
        .single();

      if (error) {
        console.error("Error fetching AI pick platform:", error);
        return;
      }

      if (data) {
        setAiPickPlatform(data.platform_name);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-gradient-to-tr from-green-400 via-blue-400 to-cyan-400 text-white shadow-lg rounded-xl p-4 mt-4 mb-6 flex items-center gap-4 max-w-3xl mx-auto animate-fade-in">
      <BadgeDollarSign className="w-8 h-8 flex-shrink-0" />
      <div>
        <div className="text-lg font-semibold">Recommended: {aiPickPlatform}</div>
        <div className="text-sm opacity-90">
          Our AI recommends <span className="font-bold">{aiPickPlatform}</span> for this corridor,<br className="hidden sm:inline"/> as it offers the best FX rate and lowest fees right now.
        </div>
      </div>
    </div>
  );
}
