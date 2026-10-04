# 📈 Finance Forecast Engine

A zero-dependency, ultra-fast TypeScript engine for algorithmic financial time-series forecasting, statistical outlier detection, and multi-strategy debt amortization waterfalls.

---

## ⚡ Algorithmic Highlights & Complexity

| Algorithm | Method & Approach | Time Complexity | Space Complexity | Throughput |
| :--- | :--- | :--- | :--- | :--- |
| **Linear Regression** | Ordinary Least Squares (OLS) closed-form formula | (n)$ | (1)$ | **~4,500,000+ ops/sec** |
| **Adaptive Holt (EMA)** | Exponential smoothing with dynamic $\alpha, \beta$ tuned via coefficient of variation ($) + recency exponential decay | (n)$ | (n)$ | **~62,000+ ops/sec** |
| **Ensemble Model** | Variance-weighted blended estimator | (n)$ | (n)$ | **~34,000+ ops/sec** |
| **Debt Waterfall** | Multi-account rebalancing simulation (Snowball vs. Avalanche) with monthly interest compounding and rollover pools | (M \cdot K)$ | (K)$ | **~37,000+ sims/sec** |
| **Outlier Detection** | Interquartile Range (IQR) filter ( - 1.5 \cdot \text{IQR}$,  + 1.5 \cdot \text{IQR}$) | (n \log n)$ | (n)$ | **Instantaneous** |

*(Where $ is data points, $ is months to payoff, and $ is number of distinct debt liabilities)*

---

## 🧮 Mathematical Foundations

### 1. Adaptive Double Exponential Smoothing (Holt-Linear)
Instead of static smoothing coefficients, the smoothing factors adapt to volatility:

\alpha = \text{clamp}(0.3 + C_v, 0.3, 0.7), \quad C_v = \frac{\sigma}{\mu}

\ell_t = \alpha y_t + (1 - \alpha)(\ell_{t-1} + b_{t-1})

b_t = \beta(\ell_t - \ell_{t-1}) + (1 - \beta)b_{t-1}

\hat{y}_{t+h} = \ell_t + h \cdot b_t

### 2. Debt Waterfall Optimization
Simulates the payoff priority matrix across varying annual percentage rates (APR) and minimum payment constraints:
- **Debt Avalanche**: Prioritizes $\max(\text{APR}_i)$, minimizing total compound interest paid over time.
- **Debt Snowball**: Prioritizes $\min(\text{Balance}_i)$, maximizing behavioral psychological wins.
- **Pool Rollover**:
  \text{Pool}_{t+1} = \text{Extra} + \sum_{j \in \text{PaidOff}} \text{MinPayment}_j

---

## 🚀 Quick Start

### Installation
`ash
npm install
`

### Run Tests
`ash
npm test
`

### Run Algorithm Benchmark & Demo
`ash
npm run demo
npm run benchmark
`

---

## 💻 Code Examples

### 1. Adaptive Ensemble Forecast
`	ypescript
import { ensembleForecast, removeOutliers } from "finance-forecast-engine";

const rawMonthlyExpenses = [2100, 2050, 4800, 2150, 2300, 2250]; // Notice outlier 4800
const cleaned = removeOutliers(rawMonthlyExpenses);
const forecastNextMonth = ensembleForecast(cleaned);

console.log(Predicted next month spend: {forecastNextMonth.toFixed(2)});
`

### 2. Debt Waterfall Strategy Comparison
`	ypescript
import { calculatePayoffPlan, Debt } from "finance-forecast-engine";

const debts: Debt[] = [
  { id: "1", name: "Credit Card", balance: 7500, interestRate: 24.99, minimumPayment: 180 },
  { id: "2", name: "Auto Loan", balance: 14000, interestRate: 6.20, minimumPayment: 320 }
];

const avalanche = calculatePayoffPlan(debts, 500, "avalanche");
const snowball = calculatePayoffPlan(debts, 500, "snowball");

console.log(Avalanche Interest: {avalanche.totalInterestPaid.toFixed(2)});
console.log(Snowball Interest:  {snowball.totalInterestPaid.toFixed(2)});
`

---

## 📊 Architecture

`mermaid
flowchart TD
    Raw[Raw Time-Series / Transaction Data] --> Outlier[IQR Outlier Filter]
    Outlier --> Stats[Statistical Analysis: Mean, StdDev, Cv]
    
    Stats --> ModelA[Adaptive Holt Smoothing]
    Stats --> ModelB[Ordinary Least Squares Regression]
    
    ModelA --> Ensemble[Ensemble Estimator]
    ModelB --> Ensemble
    
    Ensemble --> Forecast[Next-Period Cashflow Projection]
    
    Debts[Debt Liabilities] --> Waterfall[Waterfall Engine]
    Strategy[Avalanche vs. Snowball Priority] --> Waterfall
    Waterfall --> Payoff[Amortization Schedule & Interest Curves]
`

---

## 📄 License
MIT
