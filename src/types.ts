export interface MonthlyData {
  income: number;
  expense: number;
}

export interface SeasonalIndex {
  incomeIndex: number;
  expenseIndex: number;
}

export type SeasonalIndices = Record<number, SeasonalIndex>;

export interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

export interface PayoffProjection {
  debtId: string;
  debtName: string;
  payoffDate: string;
  totalInterest: number;
  monthsToPayoff: number;
}

export type PayoffStrategy = "snowball" | "avalanche";

export interface AmortizationMonth {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  date: string;
}
