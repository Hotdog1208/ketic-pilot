"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatShortDate } from "@/lib/format";

type Point = { date: string; cost: number };

type Props = {
  data: Point[];
};

export function TrendChart({ data }: Props) {
  const total = data.reduce((sum, p) => sum + p.cost, 0);

  return (
    <Card padding="lg" className="animate-card-in [animation-delay:120ms]">
      <div className="flex items-baseline justify-between">
        <h2 className="text-title text-text-primary">Daily waste — 30 days</h2>
        <span className="text-body tnum text-text-muted">
          {formatCurrency(total)}
        </span>
      </div>
      <div className="mt-6 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
            barCategoryGap="10%"
          >
            <CartesianGrid
              vertical={false}
              stroke="#1F232C"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#4A4F5A", fontSize: 11, fontWeight: 500 }}
              tickFormatter={(value, index) =>
                index % 5 === 0 ? formatShortDate(value) : ""
              }
              interval={0}
            />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: "rgba(245,245,247,0.04)" }}
              contentStyle={{
                backgroundColor: "#181B22",
                border: "1px solid #1F232C",
                borderRadius: 6,
                padding: "8px 10px",
                fontSize: 12,
                color: "#F5F5F7",
              }}
              labelStyle={{ color: "#8A8F9B", marginBottom: 4 }}
              formatter={(value: number) => [
                `${formatCurrency(value)} wasted`,
                "",
              ]}
              labelFormatter={(label: string) => formatShortDate(label)}
              separator=""
            />
            <Bar
              dataKey="cost"
              fill="#E5484D"
              radius={[4, 4, 0, 0]}
              animationDuration={600}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
