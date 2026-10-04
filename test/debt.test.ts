import { describe, it, expect } from "vitest";
import { calculateAmortizationSchedule, calculatePayoffPlan } from "../src/debt";
import type { Debt } from "../src/types";

describe("Debt Amortization & Payoff", () => {
  it("should calculate correct amortization schedule", () => {
    const schedule = calculateAmortizationSchedule(10000, 5, 12, "2024-01-01");
    expect(schedule.length).toBe(12);
    expect(schedule[11].remainingBalance).toBe(0);
  });

  it("should prioritize avalanche over snowball when chosen", () => {
    const debts: Debt[] = [
      { id: "1", name: "Credit Card", balance: 5000, interestRate: 20, minimumPayment: 100 },
      { id: "2", name: "Car Loan", balance: 15000, interestRate: 5, minimumPayment: 300 }
    ];

    const avalanche = calculatePayoffPlan(debts, 500, "avalanche");
    const snowball = calculatePayoffPlan(debts, 500, "snowball");
    
    expect(avalanche.projections.length).toBe(2);
    expect(snowball.projections.length).toBe(2);
    
    // Avalanche pays off the high interest one first
    const avCC = avalanche.projections.find(p => p.debtId === "1")!;
    const sbCC = snowball.projections.find(p => p.debtId === "1")!;
    
    // Total interest paid should be less in avalanche for this specific configuration
    expect(avalanche.totalInterestPaid).toBeLessThan(snowball.totalInterestPaid);
  });
});
