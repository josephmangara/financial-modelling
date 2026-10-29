
import { useMemo, useState } from "react";
// import { defaultModel } from "../data/defaultModel.js";
import { calculateFinancialModel } from "../calculations/financialModel.js";

const scenarios = {
  Base: {
    growth: 1,
    revenue: 1,
    costs: 1,
  },
  Optimistic: {
    growth: 1.25,
    revenue: 1.1,
    costs: 0.9,
  },
  Pessimistic: {
    growth: 0.75,
    revenue: 0.9,
    costs: 1.1,
  },
};

function buildScenario(model, settings) {
  const copy = {
    assumptions: Object.fromEntries(
      Object.entries(model.assumptions).map(([key, values]) => [
        key,
        [...values],
      ])
    ),
    opening: { ...model.opening },
  };

  copy.assumptions.newCustomers =
    copy.assumptions.newCustomers.map((value) =>
      Math.round(value * settings.growth)
    );

  copy.assumptions.revenuePerCustomer =
    copy.assumptions.revenuePerCustomer.map(
      (value) => value * settings.revenue
    );

  for (const key of [
    "costPerEmployee",
    "operatingCosts",
    "capitalExpenditure",
  ]) {
    copy.assumptions[key] = copy.assumptions[key].map(
      (value) => value * settings.costs
    );
  }

  return copy;
}

const currency = (value) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);

export default function ScenarioComparison({ model }) {
  const [selected, setSelected] = useState([
    "Base",
    "Optimistic",
    "Pessimistic",
  ]);

  const results = useMemo(() => {
    return Object.entries(scenarios).map(([name, settings]) => {
      const scenarioModel =
        name === "Base" ? model : buildScenario(model, settings);

      const months = calculateFinancialModel(scenarioModel);

      return {
        name,
        revenue: months.reduce(
          (sum, month) => sum + month.revenue,
          0
        ),
        netIncome: months.reduce(
          (sum, month) => sum + month.netIncome,
          0
        ),
        closingCash: months.at(-1)?.closingCash ?? 0,
      };
    });
  }, [model]);

  const visibleResults = results.filter((item) =>
    selected.includes(item.name)
  );

  function toggleScenario(name) {
    setSelected((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
    );
  }

  return (
    <section className="rounded-xl border border-(--border) bg-(--surface) p-2 sm:p-6">
      <div>
        <h2 className="text-lg font-semibold">
          Scenario comparison
        </h2>
        <p className="mt-1 text-sm text-(--muted)">
          Compare how different assumptions affect your projections.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {Object.keys(scenarios).map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={selected.includes(name)}
            onClick={() => toggleScenario(name)}
            className={`rounded-lg border px-3 py-2 text-sm transition ${
              selected.includes(name)
                ? "border-(--accent) bg-(--accent) text-white"
                : "border-(--border) hover:bg-(--bg)"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-130 text-left text-sm">
          <thead>
            <tr className="border-b border-(--border) text-(--muted)">
              <th className="py-3 pr-4 font-medium">Scenario</th>
              <th className="py-3 pr-4 font-medium">Annual revenue</th>
              <th className="py-3 pr-4 font-medium">Net income</th>
              <th className="py-3 font-medium">Closing cash</th>
            </tr>
          </thead>

          <tbody>
            {visibleResults.map((item) => (
              <tr
                key={item.name}
                className="border-b border-(--border)"
              >
                <td className="py-4 pr-4 font-medium">
                  {item.name}
                </td>
                <td className="py-4 pr-4 tabular-nums">
                  {currency(item.revenue)}
                </td>
                <td className="py-4 pr-4 tabular-nums">
                  {currency(item.netIncome)}
                </td>
                <td className="py-4 tabular-nums">
                  {currency(item.closingCash)}
                </td>
              </tr>
            ))}

            {visibleResults.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="py-6 text-center text-(--muted)"
                >
                  Select a scenario to compare results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
