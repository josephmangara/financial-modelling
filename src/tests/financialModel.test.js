
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
      expect(month.balanceCheck).toBe(0);
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
});
