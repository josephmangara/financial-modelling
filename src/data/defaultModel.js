
export const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const defaultModel = {
  assumptions: {
    newCustomers: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    revenuePerCustomer: Array(12).fill(1200),
    churnRate: Array(12).fill(0.02),
    grossMargin: Array(12).fill(0.78),
    headcount: [9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14],
    costPerEmployee: Array(12).fill(11000),
    operatingCosts: Array(12).fill(24000),
    capitalExpenditure: [
      0, 0, 15000, 0, 0, 0, 0, 12000, 0, 0, 0, 0,
    ],
    daysSalesOutstanding: Array(12).fill(38),
    daysPayableOutstanding: Array(12).fill(30),
    equityRaised: Array(12).fill(0),
  },

  opening: {
    cash: 1200000,
    accountsReceivable: 95000,
    accountsPayable: 48000,
    fixedAssets: 40000,
    paidInCapital: 2500000,
    retainedEarnings: -1213000,
    customers: 120,
    depreciationLifeMonths: 36,
  },
};
