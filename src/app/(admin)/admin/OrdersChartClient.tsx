"use client";

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

export default function OrdersChartClient({ data }: OrdersChartProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-brand-cream-dark p-6">
      <h2 className="text-xl font-display text-brand-green mb-6">
        Pedidos últimos 30 días
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E6E2D8" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#6B7280" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6B7280" }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #E6E2D8",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ color: "#2C4A2E", fontWeight: 600 }}
              formatter={(value) => [`${value} pedidos`, "Total"]}
            />
            <Bar
              dataKey="count"
              fill="#2C4A2E"
              radius={[4, 4, 0, 0]}
              name="Pedidos"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}