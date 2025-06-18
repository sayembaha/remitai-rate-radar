
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function SmartAlertCta() {
  const [limit, setLimit] = useState("");
  const [direction, setDirection] = useState("above");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!limit) {
      return toast({ 
        title: "Invalid", 
        description: "Please enter a threshold!", 
        variant: "destructive" 
      });
    }

    if (!email) {
      return toast({ 
        title: "Invalid", 
        description: "Please enter your email!", 
        variant: "destructive" 
      });
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("email_alerts")
        .insert({
          email: email,
          threshold_rate: parseFloat(limit),
          direction: direction,
          currency_pair: "BDT/USD"
        });

      if (error) {
        console.error("Error saving alert:", error);
        toast({
          title: "Error",
          description: "Failed to save alert. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Alert Set!",
        description: `We'll notify you at ${email} when BDT/USD is ${direction} ${limit}`,
      });
      
      setLimit("");
      setEmail("");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-4 mt-6 items-center max-w-3xl mx-auto"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex items-center gap-2">
          <span className="font-medium">Notify me when</span>
          <select
            className="border bg-white px-2 py-1 rounded focus:ring-2 ring-blue-300"
            value={direction}
            onChange={e => setDirection(e.target.value)}
          >
            <option value="above">above</option>
            <option value="below">below</option>
          </select>
          <input
            type="number"
            placeholder="e.g. 125"
            className="border px-2 py-1 rounded w-24 text-center focus:ring-2 ring-blue-300"
            value={limit}
            min={0}
            step="0.000001"
            onChange={e => setLimit(e.target.value)}
            required
          />
          <span className="font-medium">BDT/USD</span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="email"
          placeholder="Enter your email"
          className="border px-3 py-2 rounded focus:ring-2 ring-blue-300"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white rounded px-4 py-2 font-bold hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Bell className="w-5 h-5" /> 
          {isSubmitting ? "Setting..." : "Set Alert"}
        </button>
      </div>
    </form>
  );
}
