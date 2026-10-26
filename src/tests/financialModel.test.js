
import { describe, it, expect } from "vitest";
import { defaultModel } from "../data/defaultModel.js";
import { calculateFinancialModel } from "../calculations/financialModel.js";

describe("Financial model", () => {
  const results = calculateFinancialModel(defaultModel);

  it("calculates all 12 months", () => {
    expect(results).toHaveLength(12);
  });

  it("calculates January revenue correctly", () => {
    expect(results[0].customers).toBe(124);
    expect(results[0].revenue).toBe(148800);
    expect(results[0].costOfRevenue).toBeCloseTo(32736);
    expect(results[0].grossProfit).toBeCloseTo(116064);
  });

  it("calculates January payroll correctly", () => {
    expect(results[0].payroll).toBe(99000);
    expect(results[0].otherOperatingCosts).toBe(24000);
  });

  it("maintains the balance sheet identity", () => {
    for (const month of results) {
      expect(month.balanceCheck).toBeCloseTo(0, 2);
    }
  });

  it("carries customer balances into the next month", () => {
    expect(results[1].customers).toBe(
      Math.round(results[0].customers * 0.98 + 7)
    );
  });

  it("carries closing cash into the next month", () => {
    expect(results[1].openingCash).toBeCloseTo(
      results[0].closingCash
    );
  });

  
it("matches the Excel P&L for all 12 months", () => {
  const expected = {
    customers: [
      124, 129, 134, 140, 147, 155,
      164, 174, 185, 196, 208, 221,
    ],
    revenue: [
      148800, 154800, 160800, 168000, 176400, 186000,
      196800, 208800, 222000, 235200, 249600, 265200,
    ],
    grossProfit: [
      116064, 120744, 125424, 131040, 137592, 145080,
      153504, 162864, 173160, 183456, 194688, 206856,
    ],
    payroll: [
      99000, 99000, 110000, 110000, 121000, 121000,
      132000, 132000, 143000, 143000, 154000, 154000,
    ],
    depreciation: [
      1111.111111, 1111.111111, 1111.111111,
      1527.777778, 1527.777778, 1527.777778,
      1527.777778, 1527.777778, 1861.111111,
      1861.111111, 1861.111111, 1861.111111,
    ],
    netIncome: [
      -8047.111111, -3367.111111, -9687.111111,
      -4487.777778, -8935.777778, -1447.777778,
      -4023.777778, 5002.888889, 4298.888889,
      14594.888889, 14826.888889, 26994.888889,
    ],
  };

  for (const key of Object.keys(expected)) {
    results.forEach((month, index) => {
      expect(month[key], `${key} in ${month.month}`)
        .toBeCloseTo(expected[key][index], 2);
    });
  }
});


});
