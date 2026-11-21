"use client";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

export interface DayVisitPoint {
  day: string;
  value: number;
  highlight?: boolean;
}

const CustomDayTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as DayVisitPoint;
    return (
      <div className="bg-base-100 px-3 py-2 rounded-xl shadow-lg border border-base-200 text-xs font-sans">
        <p className="font-semibold text-base-content/70">{item.day}</p>
        <p className="text-primary font-bold mt-0.5">
          {item.value.toLocaleString()}{" "}
          <span className="font-normal text-base-content/50">visits</span>
        </p>
      </div>
    );
  }
  return null;
};

const BarchartDays = ({ barData }: { barData: DayVisitPoint[] }) => {
  return (
    <div className="h-52 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={barData}
          margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
          />
          <Tooltip
            cursor={{ fill: "transparent" }}
            content={<CustomDayTooltip />}
          />
          <Bar dataKey="value" radius={[6, 6, 6, 6]}>
            {barData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.highlight ? "#2563eb" : "#f1f5f9"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarchartDays;