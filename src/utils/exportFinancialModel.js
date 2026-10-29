
import * as XLSX from "xlsx";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function createSheet(rows) {
  return XLSX.utils.aoa_to_sheet(rows);
}

export function exportFinancialModel(model, results) {
  const workbook = XLSX.utils.book_new();

  // Assumptions
  const assumptions = [
    ["Assumption", ...MONTHS],
    ["New customers per month", ...model.newCustomers],
    ["Average revenue per customer", ...model.revenuePerCustomer],
    ["Monthly churn rate", ...model.churnRate],
    ["Gross margin", ...model.grossMargin],
    ["Headcount", ...model.headcount],
    ["Cost per employee", ...model.costPerEmployee],
    ["Other operating costs", ...model.operatingCosts],
    ["Capital expenditure", ...model.capitalExpenditure],
    ["Days sales outstanding", ...model.daysSalesOutstanding],
    ["Days payable outstanding", ...model.daysPayableOutstanding],
    ["Equity raised", ...model.equityRaised],
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    createSheet(assumptions),
    "Assumptions",
  );

  // Opening balances
  const opening = [
    ["Opening balance", "Value"],
    ["Cash", model.opening.cash],
    ["Accounts receivable", model.opening.accountsReceivable],
    ["Accounts payable", model.opening.accountsPayable],
    ["Fixed assets", model.opening.fixedAssets],
    ["Paid-in capital", model.opening.paidInCapital],
    ["Retained earnings", model.opening.retainedEarnings],
    ["Opening customers", model.opening.customers],
    ["Depreciation life (months)", model.opening.depreciationLifeMonths],
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    createSheet(opening),
    "Opening Balances",
  );

  // Calculated results
  const resultKeys = [
    ["Revenue", "revenue"],
    ["Cost of revenue", "costOfRevenue"],
    ["Gross profit", "grossProfit"],
    ["Gross margin", "grossMargin"],
    ["Payroll", "payroll"],
    ["Depreciation", "depreciation"],
    ["Operating costs", "operatingCosts"],
    ["Total operating expenses", "totalOperatingExpenses"],
    ["Operating income", "operatingIncome"],
    ["Net income", "netIncome"],
    ["Closing cash", "closingCash"],
    ["Accounts receivable", "accountsReceivable"],
    ["Accounts payable", "accountsPayable"],
    ["Fixed assets", "fixedAssets"],
    ["Total assets", "totalAssets"],
    ["Total liabilities", "totalLiabilities"],
    ["Total equity", "totalEquity"],
    ["Balance check", "balanceCheck"],
    ["Months of runway", "monthsOfRunway"],
  ];

  const financialRows = [
    ["Financial metric", ...MONTHS],
    ...resultKeys.map(([label, key]) => [
      label,
      ...results.map((month) => month[key] ?? null),
    ]),
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    createSheet(financialRows),
    "Financial Results",
  );

  XLSX.writeFile(workbook, "financial-model-export.xlsx");
}
