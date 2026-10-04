# 📈 Finance Forecast Engine

A zero-dependency, highly tested TypeScript engine for algorithmic financial forecasting and debt amortization strategies.

## ✨ Features

- **Time-Series Forecasting**: Implements Holt-Winters exponential smoothing and linear regression for predicting future financial trends.
- **Debt Amortization**: Supports advanced payoff algorithms including Avalanche (highest interest first) and Snowball (lowest balance first).
- **Statistical Analytics**: Calculate variance, standard deviation, and moving averages on raw transactional data.
- **Zero Dependencies**: Pure math and logic, ensuring lightning-fast execution and easy portability.
- **Fully Tested**: Covered by a comprehensive Vitest suite.

## 🚀 Quick Start

`ash
npm install
npm test
npm run demo
`

## 🧠 Architecture

`mermaid
flowchart LR
    Data[Raw Financial Data] --> Stats[Statistics Engine]
    Data --> Debt[Amortization Engine]
    Data --> Forecast[Forecasting Engine]
    
    Debt --> Strat[Avalanche / Snowball]
    Forecast --> HW[Holt-Winters]
    Forecast --> LR[Linear Regression]
`

## 📄 License
MIT
