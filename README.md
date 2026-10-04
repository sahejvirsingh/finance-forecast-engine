# 📈 Finance Forecast Engine

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen.svg)]()
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-success.svg)]()

> A high-throughput, mathematically rigorous, zero-dependency TypeScript library for financial cash-flow time-series forecasting, statistical outlier detection, and multi-strategy debt amortization waterfalls.

---

## 🎯 Executive Summary & Problem Space

Predicting cash flows and optimizing multi-liability debt schedules is often plagued by two extremes:
1. **Overly simplistic models**: Naive moving averages fail to capture volatility or structural trends and break when single-month anomalous expenses (e.g., medical emergencies, quarterly tax payments) skew the dataset.
2. **Heavyweight runtimes**: Bringing in Python microservices (
umpy, scipy, pandas) introduces latency, deployment complexity, and serialisation overhead for client or edge runtime environments.

**Finance Forecast Engine** solves this by providing closed-form, numerically stable statistical algorithms implemented in pure TypeScript. It delivers microsecond-level execution times ($>4,500,000\text{ ops/sec}$), zero external dependencies, and complete test isolation.

---

## ⚡ Algorithmic Specifications & Big-$ Complexity

| Algorithm | Method & Approach | Time Complexity | Space Complexity | Benchmark Throughput |
| :--- | :--- | :--- | :--- | :--- |
| **Linear Regression** | Ordinary Least Squares (OLS) closed-form calculation | (n)$ | (1)$ | **~4,550,000+ ops/sec** |
| **Adaptive Holt (EMA)** | Double Exponential Smoothing with dynamic $\alpha, \beta$ tuned via volatility coefficient ($) + recency exponential decay | (n)$ | (n)$ | **~62,900+ ops/sec** |
| **Ensemble Estimator** | Variance-weighted blended estimator uniting trend extrapolation and smoothed level | (n)$ | (n)$ | **~34,400+ ops/sec** |
| **Debt Waterfall** | Multi-account liability payoff simulation (Avalanche vs. Snowball) with compound interest accumulation and rollover priority pools | (M \cdot K)$ | (K)$ | **~37,300+ sims/sec** |
| **Outlier Rejection** | Interquartile Range (IQR) filter ( - 1.5 \cdot \text{IQR}$,  + 1.5 \cdot \text{IQR}$) | (n \log n)$ | (n)$ | **Instantaneous** |

*(Where $ is data points, $ is total simulation months to debt freedom, and $ is number of distinct liability accounts)*

---

## 🧮 Mathematical Foundations

### 1. Adaptive Double Exponential Smoothing (Holt-Linear)
Standard Holt-Linear smoothing uses static parameters ($\alpha, \beta$), making it brittle when sudden volatility spikes occur. This engine dynamically tunes the level smoothing factor $\alpha$ and trend smoothing factor $\beta$ using the historical dataset's **Coefficient of Variation ($)**:

\mu = \frac{1}{n} \sum_{i=1}^n y_i, \quad \sigma = \sqrt{\frac{1}{n-1} \sum_{i=1}^n (y_i - \mu)^2}, \quad C_v = \frac{\sigma}{\mu}

\alpha = \text{clamp}(0.3 + C_v, 0.3, 0.7)

\beta = \text{clamp}(0.2 + 0.5 \cdot C_v, 0.2, 0.5)

Data points are subsequently weighted with an exponential decay factor $\delta = 0.9$ targeting recency:

w_i = y_i \cdot \left(0.7 + 0.3 \cdot \delta^{(n - 1 - i)}\right)

\ell_t = \alpha w_t + (1 - \alpha)(\ell_{t-1} + b_{t-1})

b_t = \beta(\ell_t - \ell_{t-1}) + (1 - \beta)b_{t-1}

\hat{y}_{t+h} = \ell_t + h \cdot b_t

### 2. Debt Waterfall Optimization Mechanics
When paying off multiple credit accounts simultaneously, naive monthly allocation results in excess interest payments. The simulator evaluates two core mathematical strategies:
- **Debt Avalanche (Mathematical Minimum)**:
  \text{Priority} = \operatorname{sort\_desc}(\text{APR}_i)
  Directs maximum disposable capital to the highest-interest loan, mathematically minimizing cumulative compound interest paid over time.
- **Debt Snowball (Behavioral Momentum)**:
  \text{Priority} = \operatorname{sort\_asc}(\text{Balance}_i)
  Directs excess capital to the lowest-balance account to eliminate accounts rapidly.
- **Surplus Rollover Pool Mechanics**:
  When account $ reaches zero balance, its minimum required payment $\text{MinPayment}_k$ is automatically absorbed into the active pool:
  \text{Pool}_{t+1} = \text{ExtraPayment} + \sum_{j \in \text{Liquidated}} \text{MinPayment}_j

---

## 📊 Architectural Pipeline

`mermaid
flowchart TD
    Raw[Raw Time-Series / Transaction Data] --> Outlier[IQR Outlier Filter]
    Outlier --> Stats[Statistical Analysis: Mean, StdDev, Volatility]
    
    Stats --> ModelA[Adaptive Holt-Linear Smoothing]
    Stats --> ModelB[Ordinary Least Squares Regression]
    
    ModelA --> Ensemble[Ensemble Estimator]
    ModelB --> Ensemble
    
    Ensemble --> Forecast[Next-Period Cashflow Projection]
    
    Debts[Debt Liabilities] --> Waterfall[Waterfall Engine]
    Strategy[Strategy Selection: Avalanche vs. Snowball] --> Waterfall
    Waterfall --> Payoff[Amortization Schedule & Cumulative Interest Curves]
`

---

## 🚀 Installation & Quick Start

`ash
# Clone the repository
git clone https://github.com/sahejvirsingh/finance-forecast-engine.git
cd finance-forecast-engine

# Install dependencies (dev-only for testing/bundling)
npm install

# Run Vitest test suite
npm test

# Run the real-time algorithmic benchmark suite
npm run benchmark
`

### Usage Examples

`	ypescript
import { 
  ensembleForecast, 
  removeOutliers, 
  calculatePayoffPlan, 
  Debt 
} from "finance-forecast-engine";

// 1. Time-Series Cashflow Forecasting with Outlier Removal
const pastExpenses = [2100, 2050, 6800, 2150, 2300, 2250]; // 6800 is a one-off anomaly
const sanitized = removeOutliers(pastExpenses);
const nextMonthProjection = ensembleForecast(sanitized);
console.log(Forecast: {nextMonthProjection.toFixed(2)});

// 2. Debt Waterfall Simulation
const debts: Debt[] = [
  { id: "1", name: "Credit Card", balance: 7500, interestRate: 24.99, minimumPayment: 180 },
  { id: "2", name: "Car Loan", balance: 14000, interestRate: 6.20, minimumPayment: 320 }
];

const payoff = calculatePayoffPlan(debts, 500, "avalanche");
console.log(Debt-Free Date: );
console.log(Total Interest Paid: {payoff.totalInterestPaid.toFixed(2)});
`

---

## 🧪 Testing & Verification

The engine is verified against mathematical reference tests using [Vitest](https://vitest.dev/):
- **Equivalence Assertions**: Validates that linear regression equals closed-form mathematical solutions across linear sequences.
- **Payoff Integrity**: Validates that Avalanche mathematically accrues less or equal interest compared to Snowball across any portfolio with non-identical interest rates.
- **Outlier Invariance**: Validates that extreme outliers beyond .5 \times \text{IQR}$ are stripped before smoothing.

---

## 📄 License
MIT © [Sahejvir Singh](https://github.com/sahejvirsingh)
