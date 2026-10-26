
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);

const metrics = [
  {
    label: "Annual Revenue",
    key: "revenue",
  },
  {
    label: "Net Income",
    key: "netIncome",
  },
  {
    label: "Closing Cash",
    key: "closingCash",
  },
  {
    label: "Gross Margin",
    key: "grossMargin",
    percentage: true,
  },
];

export default function FinancialKPIs({ results }) {
  const totals = results.reduce(
    (acc, month) => ({
      revenue: acc.revenue + month.revenue,
      netIncome: acc.netIncome + month.netIncome,
    }),
    { revenue: 0, netIncome: 0 }
  );

  const finalMonth = results.at(-1);

  const values = {
    ...totals,
    closingCash: finalMonth?.closingCash ?? 0,
    grossMargin:
      totals.revenue === 0
        ? 0
        : results.reduce(
            (sum, month) => sum + month.grossProfit,
            0
          ) / totals.revenue,
  };

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(({ label, key, percentage }) => (
        <article
          key={key}
          className="rounded-xl border border-(--border) bg-(--surface) p-5"
        >
          <p className="text-sm text-(--muted)">{label}</p>

          <p className="mt-3 text-2xl font-semibold tracking-tight">
            {percentage
              ? `${(values[key] * 100).toFixed(1)}%`
              : formatCurrency(values[key])}
          </p>

          <p className="mt-2 text-xs text-(--muted)">
            {key === "closingCash"
              ? "Balance at year end"
              : key === "grossMargin"
                ? "Gross profit / revenue"
                : "Full-year projection"}
          </p>
        </article>
      ))}
    </section>
  );
}
