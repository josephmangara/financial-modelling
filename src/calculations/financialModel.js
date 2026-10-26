
import { months } from "../data/defaultModel.js";
import { calculateRevenue } from "./revenue.js";
import { calculateExpenses } from "./expenses.js";
import { calculateProfit } from "./profit.js";

export function calculateFinancialModel(model) {
  const { assumptions: a, opening: o } = model;

  if (
    Object.values(a).some(
      (values) => !Array.isArray(values) || values.length !== 12
    )
  ) {
    throw new Error("Each monthly assumption must contain 12 values.");
  }

  if (
    !Number.isFinite(o.depreciationLifeMonths) ||
    o.depreciationLifeMonths <= 0
  ) {
    throw new Error("Depreciation life must be greater than zero.");
  }

  const results = [];
  let previousCustomers = o.customers;
  let previousDepreciation = 0;
  let previousCapitalExpenditure = 0;

  let cash = o.cash;
  let accountsReceivable = o.accountsReceivable;
  let accountsPayable = o.accountsPayable;
  let fixedAssets = o.fixedAssets;
  let paidInCapital = o.paidInCapital;
  let retainedEarnings = o.retainedEarnings;

  for (let i = 0; i < 12; i++) {
    const revenue = calculateRevenue({
      newCustomers: a.newCustomers[i],
      revenuePerCustomer: a.revenuePerCustomer[i],
      churnRate: a.churnRate[i],
      grossMargin: a.grossMargin[i],
      previousCustomers,
    });

    const expenses = calculateExpenses({
      headcount: a.headcount[i],
      costPerEmployee: a.costPerEmployee[i],
      operatingCosts: a.operatingCosts[i],
      capitalExpenditure: a.capitalExpenditure[i],
      previousDepreciation,
      previousCapitalExpenditure,
      openingFixedAssets: o.fixedAssets,
      depreciationLifeMonths: o.depreciationLifeMonths,
      isFirstMonth: i === 0,
    });

    const profit = calculateProfit({
      grossProfit: revenue.grossProfit,
      totalOperatingExpenses: expenses.totalOperatingExpenses,
    });

    // Balance sheet: working capital.
    const newAR =
      revenue.revenue * 12 / 365 * a.daysSalesOutstanding[i];

    const newAP =
      revenue.costOfRevenue * 12 / 365 *
      a.daysPayableOutstanding[i];

    const changeAR = newAR - accountsReceivable;
    const changeAP = newAP - accountsPayable;

    // Cash flow statement.
    const cashFromOperations =
      profit.netIncome + expenses.depreciation - changeAR + changeAP;

    const cashFromInvesting = -a.capitalExpenditure[i];
    const cashFromFinancing = a.equityRaised[i];

    const netChangeInCash =
      cashFromOperations + cashFromInvesting + cashFromFinancing;

    const openingCash = cash;
    cash += netChangeInCash;

    // Fixed assets and equity balances.
    fixedAssets +=
      a.capitalExpenditure[i] - expenses.depreciation;

    paidInCapital += a.equityRaised[i];
    retainedEarnings += profit.netIncome;

    const totalAssets = cash + newAR + fixedAssets;
    const totalLiabilities = newAP;
    const totalEquity = paidInCapital + retainedEarnings;
    const totalLiabilitiesAndEquity =
      totalLiabilities + totalEquity;

    const balanceCheck = Math.round(
      (totalAssets - totalLiabilitiesAndEquity) * 100
    ) / 100;

    results.push({
      month: months[i],

      ...revenue,
      ...expenses,
      ...profit,

      openingCash,
      closingCash: cash,
      cashFromOperations,
      cashFromInvesting,
      cashFromFinancing,
      netChangeInCash,

      accountsReceivable: newAR,
      accountsPayable: newAP,
      fixedAssets,

      totalAssets,
      totalLiabilities,
      paidInCapital,
      retainedEarnings,
      totalEquity,
      totalLiabilitiesAndEquity,
      balanceCheck,

      monthsOfRunway:
        netChangeInCash < 0
          ? cash / -netChangeInCash
          : "n/a",
    });

    previousCustomers = revenue.customers;
    previousDepreciation = expenses.depreciation;
    previousCapitalExpenditure = a.capitalExpenditure[i];
    accountsReceivable = newAR;
    accountsPayable = newAP;
  }

  return results;
}
