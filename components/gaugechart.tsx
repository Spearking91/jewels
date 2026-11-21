"use client";

import { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export interface GaugeSlice {
  name: string;
  value: number;
  fill: string;
}

export interface RepeatRateSummary {
  rate: number; // 0 - 100
  repeatUsers: number;
  totalUsers: number;
  target?: number;
}

interface GaugechartProps {
  gaugeData: GaugeSlice[];
  summary: RepeatRateSummary;
}

const Gaugechart = ({ gaugeData, summary }: GaugechartProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const target = summary.target ?? 80;
  const isOnTrack = summary.rate >= target;

  return (
    <>
      <div className="relative h-40 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gaugeData}
              cx="50%"
              cy="80%"
              startAngle={180}
              endAngle={0}
              innerRadius={65}
              outerRadius={85}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              {gaugeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute bottom-2 flex flex-col items-center">
          <span className="text-3xl font-extrabold tracking-tight">
            {summary.rate}%
          </span>
          <span className="text-xs text-base-content/50 mt-0.5">
            {isOnTrack
              ? `Above ${target}% target`
              : `Target: ${target}% repeat rate`}
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-3 pt-3 border-t border-base-200 text-xs text-base-content/70 space-y-1">
          <div className="flex justify-between">
            <span>Returning IDs (30d):</span>
            <span className="font-semibold text-emerald-600">
              {summary.repeatUsers.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Total Unique IDs (30d):</span>
            <span className="font-semibold">
              {summary.totalUsers.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowDetails((prev) => !prev)}
          className="btn btn-xs btn-outline border-base-300 normal-case rounded-lg px-4"
        >
          {showDetails ? "Hide details" : "Show details"}
        </button>
      </div>
    </>
  );
};

export default Gaugechart;