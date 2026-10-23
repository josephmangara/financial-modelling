
export function calculateProfit({ grossProfit, totalOperatingExpenses }) {
  const operatingIncome = grossProfit - totalOperatingExpenses;

  // The workbook has no interest or income-tax calculation.
  const netIncome = operatingIncome;

  return {
    operatingIncome,
    netIncome,
  };
}
