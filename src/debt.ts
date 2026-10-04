import type { AmortizationMonth, Debt, PayoffProjection, PayoffStrategy } from "./types";

export function calculateAmortizationSchedule(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  startDate: string,
  monthlyPayment?: number
): AmortizationMonth[] {
  const schedule: AmortizationMonth[] = [];
  const monthlyRate = annualRate / 12 / 100;
  let payment = monthlyPayment;

  if (!payment || payment === 0) {
    if (monthlyRate === 0) {
      payment = principal / tenureMonths;
    } else {
      payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    }
  }

  let remainingBalance = principal;
  const start = new Date(startDate);

  for (let m = 1; m <= tenureMonths; m++) {
    const interest = remainingBalance * monthlyRate;
    let principalPaid: number = (payment || 0) - interest;

    if (m === tenureMonths || principalPaid > remainingBalance) {
      principalPaid = remainingBalance;
      payment = principalPaid + interest;
    }

    remainingBalance -= principalPaid;
    const currentMonthDate = new Date(start);
    currentMonthDate.setMonth(start.getMonth() + m - 1);

    schedule.push({
      month: m,
      payment: payment || 0,
      principal: principalPaid,
      interest: interest,
      remainingBalance: Math.max(0, remainingBalance),
      date: currentMonthDate.toISOString().split("T")[0],
    });

    if (remainingBalance <= 0) break;
  }

  return schedule;
}

export function calculatePayoffPlan(
  debts: Debt[],
  extraMonthlyPayment: number,
  strategy: PayoffStrategy = "avalanche"
): { projections: PayoffProjection[]; totalInterestPaid: number; overallPayoffDate: string } {
  const sortedDebts = [...debts].sort((a, b) => {
    if (strategy === "snowball") return a.balance - b.balance;
    return b.interestRate - a.interestRate;
  });

  const projections: PayoffProjection[] = [];
  const currentBalances = sortedDebts.map((d) => ({ ...d }));
  let totalInterestPaid = 0;
  let months = 0;
  const today = new Date();

  while (currentBalances.some((d) => d.balance > 0) && months < 600) {
    months++;
    let monthlyPool = extraMonthlyPayment;

    for (const debt of currentBalances) {
      if (debt.balance <= 0) continue;
      const monthlyInterestRate = debt.interestRate / 12 / 100;
      const interest = debt.balance * monthlyInterestRate;
      totalInterestPaid += interest;
      debt.balance += interest;
      const payment = Math.min(debt.balance, debt.minimumPayment);
      debt.balance -= payment;
    }

    for (const debt of currentBalances) {
      if (debt.balance > 0) {
        const extra = Math.min(debt.balance, monthlyPool);
        debt.balance -= extra;
        monthlyPool -= extra;
        if (monthlyPool <= 0) break;
      }
    }

    for (const debt of currentBalances) {
      if (debt.balance <= 0 && !projections.find((p) => p.debtId === debt.id)) {
        const payoffDate = new Date(today);
        payoffDate.setMonth(today.getMonth() + months);
        projections.push({
          debtId: debt.id,
          debtName: debt.name,
          payoffDate: payoffDate.toISOString().split("T")[0],
          totalInterest: 0,
          monthsToPayoff: months,
        });
      }
    }
  }

  const overallPayoffDate = new Date(today);
  overallPayoffDate.setMonth(today.getMonth() + months);

  return {
    projections,
    totalInterestPaid,
    overallPayoffDate: overallPayoffDate.toISOString().split("T")[0],
  };
}
