
import { useMemo } from "react";
import { defaultModel } from "./data/defaultModel.js";
import { calculateFinancialModel } from "./calculations/financialModel.js";
import FinancialKPIs from "./components/FinancialKPIs.jsx";
import FinancialCharts from "./components/FinancialCharts.jsx";

export default function App() {
  const results = useMemo(
    () => calculateFinancialModel(defaultModel),
    []
  );

  return (
    <main className="min-h-screen bg-(--bg) p-5 text-(--text) sm:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-(--accent)">
              FINANCIAL PLANNING
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Financial overview
            </h1>

            <p className="mt-2 text-sm text-(--muted)">
              Startup financial projections · 12 months
            </p>
          </div>

          <span className="rounded-full border border-(--border) px-3 py-1.5 text-sm">
            Base scenario
          </span>
        </header>

        <FinancialKPIs results={results} />

        <FinancialCharts results={results} />
      </div>
    </main>
  );
}
