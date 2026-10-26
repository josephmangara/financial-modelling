
const fields = [
  {
    key: "newCustomers",
    label: "New customers",
    description: "New customers acquired each month",
    min: 0,
    max: 500,
    step: 1,
  },
  {
    key: "revenuePerCustomer",
    label: "Revenue per customer (KES)",
    description: "Average monthly revenue per customer",
    min: 0,
    max: 100000,
    step: 100,
  },
  {
    key: "churnRate",
    label: "Monthly churn (%)",
    description: "Percentage of customers lost each month",
    min: 0,
    max: 100,
    step: 0.5,
    percentage: true,
  },
  {
    key: "grossMargin",
    label: "Gross margin (%)",
    description: "Share of revenue remaining after direct costs",
    min: 0,
    max: 100,
    step: 1,
    percentage: true,
  },
  {
    key: "headcount",
    label: "Headcount",
    description: "Number of employees",
    min: 0,
    max: 1000,
    step: 1,
  },
  {
    key: "costPerEmployee",
    label: "Cost per employee (KES)",
    description: "Monthly cost per employee",
    min: 0,
    max: 1000000,
    step: 500,
  },
  {
    key: "operatingCosts",
    label: "Other operating costs (KES)",
    description: "Monthly operating expenses, excluding payroll",
    min: 0,
    max: 10000000,
    step: 1000,
  },
];

export default function AssumptionsPanel({
  model,
  onChange,
  selectedMonth,
  onMonthChange,
  onReset,
}) {
  const assumptions = model.assumptions;

  return (
    <section className="rounded-xl border border-(--border) bg-(--surface) p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">
            Model assumptions
          </h2>
          <p className="mt-1 text-sm text-(--muted)">
            Adjust inputs to explore different outcomes.
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-(--border) px-3 py-2 text-sm transition hover:bg-(--bg)"
        >
          Reset assumptions
        </button>
      </div>

      <div className="mt-5 max-w-xs">
        <label
          htmlFor="assumption-month"
          className="mb-2 block text-sm font-medium"
        >
          Month to edit
        </label>

        <select
          id="assumption-month"
          value={selectedMonth}
          onChange={(event) =>
            onMonthChange(Number(event.target.value))
          }
          className="w-full rounded-lg border border-(--border) bg-(--bg) px-3 py-2 text-sm"
        >
          {assumptions.newCustomers.map((_, index) => (
            <option key={index} value={index}>
              {new Date(2000, index).toLocaleString("en", {
                month: "long",
              })}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
        {fields.map((field) => {
          const storedValue =
            assumptions[field.key][selectedMonth];

          const displayedValue = field.percentage
            ? storedValue * 100
            : storedValue;

          return (
            <div key={field.key}>
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor={field.key}
                  className="text-sm font-medium"
                >
                  {field.label}
                </label>

                <span className="text-sm tabular-nums text-(--muted)">
                  {displayedValue.toLocaleString("en-KE")}
                </span>
              </div>

              <p className="mt-1 text-xs text-(--muted)">
                {field.description}
              </p>

              <input
                id={field.key}
                type="number"
                min={field.min}
                max={field.max}
                step={field.step}
                value={displayedValue}
                onChange={(event) => {
                  const raw = event.target.value;

                  if (raw === "") return;

                  const parsed = Number(raw);

                  if (
                    !Number.isFinite(parsed) ||
                    parsed < field.min ||
                    parsed > field.max
                  ) {
                    return;
                  }

                  onChange(
                    field.key,
                    selectedMonth,
                    field.percentage ? parsed / 100 : parsed
                  );
                }}
                className="mt-3 w-full rounded-lg border border-(--border) bg-(--bg) px-3 py-2 text-sm outline-none focus:border-(--accent)"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
