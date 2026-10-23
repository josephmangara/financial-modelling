
export function calculateRevenue({
  newCustomers,
  revenuePerCustomer,
  churnRate,
  grossMargin,
  previousCustomers,
}) {
  // Excel ROUND(..., 0) for non-negative customer counts.
  const customers = Math.round(
    previousCustomers * (1 - churnRate) + newCustomers
  );

  const revenue = customers * revenuePerCustomer;
  const costOfRevenue = revenue * (1 - grossMargin);
  const grossProfit = revenue - costOfRevenue;

  return {
    customers,
    revenue,
    costOfRevenue,
    grossProfit,
    grossMargin: revenue === 0 ? null : grossProfit / revenue,
  };
}
