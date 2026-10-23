
export function calculateExpenses({
  headcount,
  costPerEmployee,
  operatingCosts,
//   capitalExpenditure,
  previousDepreciation,
  previousCapitalExpenditure,
  openingFixedAssets,
  depreciationLifeMonths,
  isFirstMonth,
}) {
  const payroll = headcount * costPerEmployee;

  const depreciation = isFirstMonth
    ? openingFixedAssets / depreciationLifeMonths
    : previousDepreciation +
      previousCapitalExpenditure / depreciationLifeMonths;

  const totalOperatingExpenses =
    payroll + operatingCosts + depreciation;

  return {
    payroll,
    otherOperatingCosts: operatingCosts,
    depreciation,
    totalOperatingExpenses,
  };
}
