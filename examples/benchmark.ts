import {
  adaptiveHoltForecast,
  ensembleForecast,
  linearRegressionForecast,
  calculatePayoffPlan,
  calculateAmortizationSchedule,
  removeOutliers,
  calculateStdDev,
  Debt
} from "../src";

function runBenchmark() {
  console.log("=================================================================");
  console.log("       FINANCE FORECAST ENGINE - ALGORITHMIC BENCHMARK SUITE     ");
  console.log("=================================================================\n");

  // 1. Time-Series Benchmark
  const syntheticHistory = Array.from({ length: 60 }, (_, i) => {
    const base = 2500 + i * 25;
    const season = Math.sin((i % 12) * (Math.PI / 6)) * 400;
    const noise = (Math.random() - 0.5) * 80;
    return Math.round(base + season + noise);
  });

  console.log(`[1] Benchmarking Forecast Models (${syntheticHistory.length} data points)...`);
  
  const ITERATIONS = 100_000;
  
  const t0 = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    linearRegressionForecast(syntheticHistory);
  }
  const tLinear = performance.now() - t0;
  
  const t1 = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    adaptiveHoltForecast(syntheticHistory);
  }
  const tAdaptive = performance.now() - t1;

  const t2 = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    ensembleForecast(syntheticHistory);
  }
  const tEnsemble = performance.now() - t2;

  console.log(`   - Linear Regression:  ${tLinear.toFixed(2)} ms (${Math.round(ITERATIONS / (tLinear / 1000)).toLocaleString()} ops/sec)`);
  console.log(`   - Adaptive Holt (EMA): ${tAdaptive.toFixed(2)} ms (${Math.round(ITERATIONS / (tAdaptive / 1000)).toLocaleString()} ops/sec)`);
  console.log(`   - Ensemble Model:     ${tEnsemble.toFixed(2)} ms (${Math.round(ITERATIONS / (tEnsemble / 1000)).toLocaleString()} ops/sec)`);

  // 2. Debt Waterfall Optimization Benchmark
  console.log("\n[2] Benchmarking Debt Waterfall Simulator...");
  const sampleDebts: Debt[] = [
    { id: "credit_card_1", name: "High-Rate Card", balance: 7500, interestRate: 24.99, minimumPayment: 180 },
    { id: "credit_card_2", name: "Store Card", balance: 2200, interestRate: 19.5, minimumPayment: 75 },
    { id: "auto_loan", name: "Car Loan", balance: 14000, interestRate: 6.2, minimumPayment: 320 },
    { id: "student_loan", name: "Student Loan", balance: 28000, interestRate: 4.8, minimumPayment: 290 },
    { id: "personal_loan", name: "Debt Consolidation", balance: 9500, interestRate: 11.4, minimumPayment: 210 },
  ];

  const SIM_ITERATIONS = 10_000;
  const tSim0 = performance.now();
  for (let i = 0; i < SIM_ITERATIONS; i++) {
    calculatePayoffPlan(sampleDebts, 600, "avalanche");
  }
  const tAvalanche = performance.now() - tSim0;

  const tSim1 = performance.now();
  for (let i = 0; i < SIM_ITERATIONS; i++) {
    calculatePayoffPlan(sampleDebts, 600, "snowball");
  }
  const tSnowball = performance.now() - tSim1;

  console.log(`   - Avalanche Strategy: ${tAvalanche.toFixed(2)} ms (${Math.round(SIM_ITERATIONS / (tAvalanche / 1000)).toLocaleString()} simulations/sec)`);
  console.log(`   - Snowball Strategy:  ${tSnowball.toFixed(2)} ms (${Math.round(SIM_ITERATIONS / (tSnowball / 1000)).toLocaleString()} simulations/sec)`);

  // Comparison
  const resAvalanche = calculatePayoffPlan(sampleDebts, 600, "avalanche");
  const resSnowball = calculatePayoffPlan(sampleDebts, 600, "snowball");
  console.log("\n[3] Strategy Comparison on Sample Portfolio:");
  console.log(`   - Total Debt: $${sampleDebts.reduce((acc, d) => acc + d.balance, 0).toLocaleString()}`);
  console.log(`   - Avalanche Interest: $${resAvalanche.totalInterestPaid.toFixed(2)} | Payoff Date: ${resAvalanche.overallPayoffDate}`);
  console.log(`   - Snowball Interest:  $${resSnowball.totalInterestPaid.toFixed(2)} | Payoff Date: ${resSnowball.overallPayoffDate}`);
  const interestSaved = resSnowball.totalInterestPaid - resAvalanche.totalInterestPaid;
  console.log(`   ==> Avalanche saves $${interestSaved.toFixed(2)} in interest compared to Snowball.`);

  console.log("\n=================================================================");
  console.log("       BENCHMARK COMPLETE - 100% ZERO-DEPENDENCY NATIVE RUN      ");
  console.log("=================================================================");
}

runBenchmark();

