
import * as XLSX from "xlsx";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

function findRow(rows, label) {
  return rows.find(
    (row) => normalize(row[0]) === normalize(label),
  );
}

function readNumber(value, label) {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    typeof value === "boolean"
  ) {
    throw new Error(`Missing numeric value: ${label}`);
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error(`Invalid numeric value: ${label}`);
  }

  return number;
}

function readMonthlyValues(rows, label) {
  const row = findRow(rows, label);

  if (!row) {
    throw new Error(`Could not find "${label}" in the workbook.`);
  }

  return MONTHS.map((month, index) =>
    readNumber(row[index + 1], `${label} (${month})`),
  );
}

function readOpeningValue(rows, label) {
  const row = findRow(rows, label);

  if (!row) {
    throw new Error(`Could not find "${label}" in the workbook.`);
  }

  return readNumber(row[1], label);
}

export async function importFinancialModel(file, baseModel) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!["xlsx", "xls"].includes(extension)) {
    throw new Error("Please select an Excel .xlsx or .xls file.");
  }

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });

  const requiredSheets = [
    "Assumptions",
    "Cash flow",
  ];

  for (const name of requiredSheets) {
    if (!workbook.Sheets[name]) {
      throw new Error(`The workbook is missing the "${name}" sheet.`);
    }
  }

  const assumptions = XLSX.utils.sheet_to_json(
    workbook.Sheets["Assumptions"],
    { header: 1, raw: true, defval: null },
  );

  const cashFlow = XLSX.utils.sheet_to_json(
    workbook.Sheets["Cash flow"],
    { header: 1, raw: true, defval: null },
  );

  // Confirm that the workbook has the expected month columns.
  const header = assumptions.find(
    (row) => normalize(row[0]) === "assumption",
  );

  if (
    !header ||
    !MONTHS.every(
      (month, index) => normalize(header[index + 1]) === normalize(month),
    )
  ) {
    throw new Error(
      "The Assumptions sheet must contain Jan–Dec columns in order.",
    );
  }

  const importedModel = {
    ...baseModel,

    newCustomers: readMonthlyValues(
      assumptions, "New customers per month",
    ),
    revenuePerCustomer: readMonthlyValues(
      assumptions, "Average revenue per customer per month",
    ),
    churnRate: readMonthlyValues(
      assumptions, "Monthly logo churn %",
    ),
    grossMargin: readMonthlyValues(
      assumptions, "Gross margin %",
    ),
    headcount: readMonthlyValues(
      assumptions, "Headcount",
    ),
    costPerEmployee: readMonthlyValues(
      assumptions, "Average fully loaded cost per head per month",
    ),
    operatingCosts: readMonthlyValues(
      assumptions, "Other operating costs per month",
    ),
    capitalExpenditure: readMonthlyValues(
      assumptions, "Capital expenditure",
    ),
    daysSalesOutstanding: readMonthlyValues(
      assumptions, "Days sales outstanding",
    ),
    daysPayableOutstanding: readMonthlyValues(
      assumptions, "Days payable outstanding",
    ),
    equityRaised: readMonthlyValues(
      cashFlow, "Equity raised",
    ),

    opening: {
      ...baseModel.opening,
      cash: readOpeningValue(assumptions, "Opening cash"),
      accountsReceivable: readOpeningValue(
        assumptions, "Opening accounts receivable",
      ),
      accountsPayable: readOpeningValue(
        assumptions, "Opening accounts payable",
      ),
      fixedAssets: readOpeningValue(
        assumptions, "Opening fixed assets (net)",
      ),
      paidInCapital: readOpeningValue(
        assumptions, "Opening paid-in capital",
      ),
      retainedEarnings: readOpeningValue(
        assumptions, "Opening retained earnings",
      ),
      depreciationLifeMonths: readOpeningValue(
        assumptions, "Depreciation life, months",
      ),
      customers: readOpeningValue(
        assumptions, "Opening customers",
      ),
    },
  };

  // Basic validation before returning the model.
  const monthlyArrays = [
    "newCustomers",
    "revenuePerCustomer",
    "churnRate",
    "grossMargin",
    "headcount",
    "costPerEmployee",
    "operatingCosts",
    "capitalExpenditure",
    "daysSalesOutstanding",
    "daysPayableOutstanding",
    "equityRaised",
  ];

  for (const key of monthlyArrays) {
    if (
      importedModel[key].some((value) => !Number.isFinite(value))
    ) {
      throw new Error(`Invalid monthly values in "${key}".`);
    }
  }

  if (importedModel.opening.depreciationLifeMonths <= 0) {
    throw new Error("Depreciation life must be greater than zero.");
  }

  return importedModel;
}
