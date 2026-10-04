import { calculateStdDev, calculateWeightedAverage, removeOutliers } from "./stats";
import type { MonthlyData, SeasonalIndices } from "./types";

export function linearRegressionForecast(values: number[]): number {
  const n = values.length;
  if (n === 0) return 0;
  if (n === 1) return values[0];

  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumXX += i * i;
  }
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return Math.max(0, slope * n + intercept);
}

export function holtForecast(rawValues: number[]): number {
  const values = removeOutliers(rawValues);
  if (values.length === 0) return 0;
  if (values.length === 1) return values[0];
  if (values.length === 2) return values[0] * 0.3 + values[1] * 0.7;

  const alpha = 0.5;
  const beta = 0.4;
  let level = values[0];
  let trend = values[1] - values[0];

  for (let i = 1; i < values.length; i++) {
    const val = values[i];
    const lastLevel = level;
    const lastTrend = trend;
    level = alpha * val + (1 - alpha) * (lastLevel + lastTrend);
    trend = beta * (level - lastLevel) + (1 - beta) * lastTrend;
  }
  return Math.max(0, level + trend);
}

export function adaptiveHoltForecast(rawValues: number[]): number {
  const values = removeOutliers(rawValues);
  if (values.length === 0) return 0;
  if (values.length === 1) return values[0];
  if (values.length === 2) return calculateWeightedAverage(values);

  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const stdDev = calculateStdDev(values);
  const coefficientOfVariation = mean > 0 ? stdDev / mean : 0;

  const adaptiveAlpha = Math.min(0.7, Math.max(0.3, 0.3 + coefficientOfVariation));
  const adaptiveBeta = Math.min(0.5, Math.max(0.2, 0.2 + coefficientOfVariation * 0.5));

  const decayFactor = 0.9;
  const weightedValues = values.map((val, i) => {
    const distanceFromNewest = values.length - 1 - i;
    const weight = Math.pow(decayFactor, distanceFromNewest);
    return val * (0.7 + 0.3 * weight);
  });

  let level = weightedValues[0];
  let trend = weightedValues[1] - weightedValues[0];

  for (let i = 1; i < weightedValues.length; i++) {
    const val = weightedValues[i];
    const lastLevel = level;
    const lastTrend = trend;
    level = adaptiveAlpha * val + (1 - adaptiveAlpha) * (lastLevel + lastTrend);
    trend = adaptiveBeta * (level - lastLevel) + (1 - adaptiveBeta) * lastTrend;
  }
  return Math.max(0, level + trend);
}

export function ensembleForecast(rawValues: number[]): number {
  const values = removeOutliers(rawValues);
  if (values.length < 3) return adaptiveHoltForecast(values);
  return (adaptiveHoltForecast(values) + linearRegressionForecast(values)) / 2;
}

export function calculateSeasonalIndices(monthlyData: Record<string, MonthlyData>): SeasonalIndices {
  const monthlyIncomes: Record<number, number[]> = {};
  const monthlyExpenses: Record<number, number[]> = {};

  Object.keys(monthlyData).forEach((monthLabel) => {
    const date = new Date(monthLabel);
    const monthIndex = date.getMonth();
    if (!monthlyIncomes[monthIndex]) monthlyIncomes[monthIndex] = [];
    if (!monthlyExpenses[monthIndex]) monthlyExpenses[monthIndex] = [];
    monthlyIncomes[monthIndex].push(monthlyData[monthLabel].income);
    monthlyExpenses[monthIndex].push(monthlyData[monthLabel].expense);
  });

  const allIncomes = Object.values(monthlyData).map((d) => d.income);
  const allExpenses = Object.values(monthlyData).map((d) => d.expense);
  const overallIncomeAvg = allIncomes.length > 0 ? allIncomes.reduce((a, b) => a + b, 0) / allIncomes.length : 1;
  const overallExpenseAvg = allExpenses.length > 0 ? allExpenses.reduce((a, b) => a + b, 0) / allExpenses.length : 1;

  const indices: SeasonalIndices = {};
  for (let m = 0; m < 12; m++) {
    const incomes = monthlyIncomes[m] || [];
    const expenses = monthlyExpenses[m] || [];
    const monthIncomeAvg = incomes.length > 0 ? incomes.reduce((a, b) => a + b, 0) / incomes.length : overallIncomeAvg;
    const monthExpenseAvg = expenses.length > 0 ? expenses.reduce((a, b) => a + b, 0) / expenses.length : overallExpenseAvg;
    indices[m] = {
      incomeIndex: Math.min(2.0, Math.max(0.5, monthIncomeAvg / (overallIncomeAvg || 1))),
      expenseIndex: Math.min(2.0, Math.max(0.5, monthExpenseAvg / (overallExpenseAvg || 1))),
    };
  }
  return indices;
}
