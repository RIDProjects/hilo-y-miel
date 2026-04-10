"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface OrdersChartProps {
  data: {
    date: string;
    count: number;
    label: string;
  }[];
}

function useCSSVar(variable: string, fallback: string): string {
  const [value, setValue] = useState(fallback);

  useEffect(() => {
    const computed = getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim();
    if (computed) setValue(computed);
  }, [variable]);

  return value;
}

export default function OrdersChartClient({ data }: OrdersChartProps) {
  const colorBg       = useCSSVar("--color-surface", "#FAFAF7");
  const colorBorder   = useCSSVar("--color-border",  "#E6E2D8");
  const colorMuted    = useCSSVar("--color-text-muted", "#5a7a57");
  const colorText     = useCSSVar("--color-text",    "#1E3820");
  const brandGreen    = useCSSVar("--brand-green",   "#2C4A2E");

  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
      <h2 className="text-xl font-display text-[var(--brand-green)] mb-6">
        Pedidos últimos 30 días
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colorBorder} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: colorMuted }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: colorMuted }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colorBg,
                border: `1px solid ${colorBorder}`,
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
              labelStyle={{ color: colorText, fontWeight: 600 }}
              formatter={(value) => [`${value} pedidos`, "Total"]}
            />
            <Bar
              dataKey="count"
              fill={brandGreen}
              radius={[4, 4, 0, 0]}
              name="Pedidos"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
