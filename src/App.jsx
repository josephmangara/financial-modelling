import { Analytics } from "@vercel/analytics/react";

import { useMemo, useState } from "react";
import { defaultModel } from "./data/defaultModel.js";
import { calculateFinancialModel } from "./calculations/financialModel.js";
import FinancialKPIs from "./components/FinancialKPIs.jsx";
import FinancialCharts from "./components/FinancialCharts.jsx";
import AssumptionsPanel from "./components/AssumptionsPanel.jsx";
import ScenarioComparison from "./components/ScenarioComparison.jsx";
import Header from "./layout/Header.jsx";
import Footer from "./layout/Footer.jsx";

import ImportFinancialModel from "./components/ImportFinancialModel";
import { exportFinancialModel } from "./utils/exportFinancialModel";



function cloneModel(model) {
  return {
    assumptions: Object.fromEntries(
      Object.entries(model.assumptions).map(([key, values]) => [
        key,
        [...values],
      ])
    ),
    opening: { ...model.opening },
  };
}

export default function App() {
  const [model, setModel] = useState(() => cloneModel(defaultModel));
  const [selectedMonth, setSelectedMonth] = useState(0);

  const results = useMemo(
    () => calculateFinancialModel(model),
    [model]
  );

  function updateAssumption(key, monthIndex, value) {
    setModel((current) => ({
      ...current,
      assumptions: {
        ...current.assumptions,
        [key]: current.assumptions[key].map((item, index) =>
          index === monthIndex ? value : item
        ),
      },
    }));
  }

  function resetAssumptions() {
    setModel(cloneModel(defaultModel));
    setSelectedMonth(0);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-(--bg) p-2 text-(--text) sm:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-(--accent)">
                FINANCIAL PLANNING
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                Overview
              </h1>

              <p className="mt-2 text-sm text-(--muted)">
                Startup financial projections · 12 months
              </p>
            </div>

            <span className="rounded-full border border-(--border) px-3 py-1.5 text-sm">
              Base scenario
            </span>
          </header>

          <ImportFinancialModel
            model={model}
            onImport={setModel}
          />
          
          <button
  type="button"
  onClick={() => exportFinancialModel(model, results)}
  className="rounded-md border border-(--border) px-4 py-2 text-sm font-medium transition-opacity hover:opacity-70"
>
  Export Excel
</button>

          <FinancialKPIs results={results} />

          <FinancialCharts results={results} />

          <AssumptionsPanel
            model={model}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            onChange={updateAssumption}
            onReset={resetAssumptions}
          />

            <ScenarioComparison model={model} />
        </div>
      </main>
      <Footer />
      <Analytics />
    </>
  );
}
