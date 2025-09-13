import { useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";

type Country = {
  code: string;
  name: string;
  flag: string;
};

const countries: Country[] = [
  { code: "UAE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "Saudi Arabia", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "USA", name: "United States", flag: "🇺🇸" },
];

type CountrySelectorProps = {
  selectedCountry: string;
  onCountryChange: (country: string) => void;
};

export default function CountrySelector({ selectedCountry, onCountryChange }: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedCountryData = countries.find(c => c.code === selectedCountry) || countries[0];

  return (
    <div className="relative mb-6 max-w-md mx-auto">
      <Card className="bg-white/80 border border-blue-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Sending from:</span>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{selectedCountryData.flag}</span>
                <span className="font-medium text-gray-800">{selectedCountryData.name}</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => {
                      onCountryChange(country.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 hover:bg-blue-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      selectedCountry === country.code ? 'bg-blue-50 text-blue-700' : 'text-gray-800'
                    }`}
                  >
                    <span className="text-xl">{country.flag}</span>
                    <span className="font-medium">{country.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}