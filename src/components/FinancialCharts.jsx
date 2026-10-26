
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area, Bar, ReferenceLine, } from "recharts";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-KE", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

const formatTooltipCurrency = (value) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);

export default function FinancialCharts({ results }) {
  return (
    <section className="rounded-xl border border-(--border) bg-(--surface) p-5 sm:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          Financial performance
        </h2>
        <p className="mt-1 text-sm text-(--muted)">
          Monthly revenue, net income and closing cash
        </p>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={results}
            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
            />

            <YAxis
              yAxisId="money"
              tickFormatter={formatCurrency}
              tickLine={false}
              axisLine={false}
              width={55}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
            />

            <YAxis
              yAxisId="cash"
              orientation="right"
              tickFormatter={formatCurrency}
              tickLine={false}
              axisLine={false}
              width={55}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
            />

            <Tooltip
              formatter={(value, name) => [
                formatTooltipCurrency(value),
                name,
              ]}
              contentStyle={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                color: "var(--text)",
              }}
            />

            <Legend />

            <ReferenceLine
              y={0}
              yAxisId="money"
              stroke="var(--muted)"
              strokeDasharray="4 4"
            />

            <Bar
              yAxisId="money"
              dataKey="revenue"
              name="Revenue"
              fill="var(--accent)"
              fillOpacity={0.85}
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />

            <Area
              yAxisId="money"
              type="monotone"
              dataKey="netIncome"
              name="Net income"
              stroke="#16a34a"
              fill="#16a34a"
              fillOpacity={0.08}
              strokeWidth={2}
            />

            <Area
              yAxisId="cash"
              type="monotone"
              dataKey="closingCash"
              name="Closing cash"
              stroke="#64748b"
              fill="#64748b"
              fillOpacity={0.05}
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
