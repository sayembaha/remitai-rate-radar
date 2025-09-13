
import { useState } from "react";
import FXComparisonTable from "@/components/FXComparisonTable";
import CountrySelector from "@/components/CountrySelector";
import RecommendationBanner from "@/components/RecommendationBanner";
import SavingsSummary from "@/components/SavingsSummary";
import SmartAlertCta from "@/components/SmartAlertCta";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";

export default function Index() {
  const [selectedCountry, setSelectedCountry] = useState("UAE");
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-100 via-white to-green-50 pt-6 pb-16">
      <header className="bg-white/80 sticky top-0 z-20 border-b shadow-sm mb-8 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-2xl font-bold tracking-tight text-blue-700">
          <span className="bg-gradient-to-tr from-blue-500 to-green-400 text-white px-3 py-1 rounded-xl mr-2">RemitBD</span>
          <span className="hidden sm:inline text-lg text-gray-700 font-medium tracking-wide">Global Remittance Hub</span>
        </div>
        <nav>
          <Link 
            to="/auth" 
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Admin
          </Link>
        </nav>
      </header>
      <main className="px-1 flex flex-col items-center w-full">
        <CountrySelector 
          selectedCountry={selectedCountry} 
          onCountryChange={setSelectedCountry}
        />
        <RecommendationBanner />
        <FXComparisonTable selectedCountry={selectedCountry} />
        <SmartAlertCta />
        <SavingsSummary />
      </main>
      <footer className="fixed bottom-0 left-0 w-full bg-white/90 border-t shadow-sm p-3 text-center text-xs text-gray-600 z-30">
        &copy; {new Date().getFullYear()} RemitBD — Modern FX Platform Comparison
      </footer>
    </div>
  );
}
