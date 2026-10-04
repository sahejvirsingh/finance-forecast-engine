import { ensembleForecast } from "../src/forecast";
import { calculatePayoffPlan } from "../src/debt";
import type { Debt } from "../src/types";

// Synthetic Data
const expenses = [2100, 2050, 2200, 2150, 2300, 2250]; // Trending slightly up
console.log("--- Forecasting ---");
console.log(`Past 6 Months Expenses: $${expenses.join(", $")}`);
console.log(`Forecasted Next Month: $${ensembleForecast(expenses).toFixed(2)}`);

console.log("\n--- Debt Payoff (Avalanche vs Snowball) ---");
const debts: Debt[] = [
  { id: "1", name: "High Interest Card", balance: 5000, interestRate: 22, minimumPayment: 150 },
  { id: "2", name: "Student Loan", balance: 15000, interestRate: 5, minimumPayment: 250 }
];

const avalanche = calculatePayoffPlan(debts, 400, "avalanche");
console.log(`Avalanche Strategy Total Interest: $${avalanche.totalInterestPaid.toFixed(2)}`);
console.log(`Avalanche Debt Free Date: ${avalanche.overallPayoffDate}`);

const snowball = calculatePayoffPlan(debts, 400, "snowball");
console.log(`Snowball Strategy Total Interest: $${snowball.totalInterestPaid.toFixed(2)}`);
console.log(`Snowball Debt Free Date: ${snowball.overallPayoffDate}`);

