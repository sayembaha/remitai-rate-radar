import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";

export default function SmartAlertCta() {
  const [limit, setLimit] = useState("");
  const [direction, setDirection] = useState("above");
  const { toast } = useToast();

  return (
    <form
      className="flex flex-col sm:flex-row gap-3 mt-6 items-center max-w-3xl mx-auto"
      onSubmit={e => {
        e.preventDefault();
        if (!limit) return toast({ title: "Invalid", description: "Please enter a threshold!", variant: "destructive" });
        toast({
          title: "Alert Set!",
          description: `We'll notify you when USD/BDT is ${direction} ${limit}`,
        });
        setLimit("");
      }}
    >
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
          onChange={e => setLimit(e.target.value)}
          required
        />
        <span className="font-medium">USD/BDT</span>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white rounded px-4 py-2 font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
      >
        <Bell className="w-5 h-5" /> Set Alert
      </button>
    </form>
  );
}
