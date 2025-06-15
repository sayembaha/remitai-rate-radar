
import FXComparisonTable from "@/components/FXComparisonTable";
import RecommendationBanner from "@/components/RecommendationBanner";
import SavingsSummary from "@/components/SavingsSummary";
import SmartAlertCta from "@/components/SmartAlertCta";

export default function Index() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-100 via-white to-green-50 pt-6 pb-16">
      <header className="bg-white/80 sticky top-0 z-20 border-b shadow-sm mb-8 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-2xl font-bold tracking-tight text-blue-700">
          <span className="bg-gradient-to-tr from-blue-500 to-green-400 text-white px-3 py-1 rounded-xl mr-2">RemitAI</span>
          <span className="hidden sm:inline text-lg text-gray-700 font-medium tracking-wide">FX Rate Comparator</span>
        </div>
        <nav>
          {/* Reserved for user menu, links, etc */}
        </nav>
      </header>
      <main className="px-1 flex flex-col items-center w-full">
        <RecommendationBanner />
        <FXComparisonTable />
        <SmartAlertCta />
        <SavingsSummary />
      </main>
      <footer className="fixed bottom-0 left-0 w-full bg-white/90 border-t shadow-sm p-3 text-center text-xs text-gray-600 z-30">
        &copy; {new Date().getFullYear()} RemitAI — Modern FX Platform Comparison
      </footer>
    </div>
  );
}
