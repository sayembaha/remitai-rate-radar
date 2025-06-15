
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const savingsData = [
  { month: "Jan", savings: 12 },
  { month: "Feb", savings: 17 },
  { month: "Mar", savings: 24 },
  { month: "Apr", savings: 28 },
  { month: "May", savings: 34 },
  { month: "Jun", savings: 49 },
];

export function RechartsSavingsChart() {
  return (
    <div className="w-full h-32">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={savingsData}>
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip
            contentStyle={{ background: "#fff", borderRadius: 6, fontSize: 14, boxShadow: "0 3px 16px 0 #0002" }}
            cursor={{ fill: "#d8f3ff" }}
            labelClassName="text-xs font-bold"
          />
          <Line type="monotone" dataKey="savings" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
