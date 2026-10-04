import { describe, it, expect } from "vitest";
import { linearRegressionForecast, holtForecast, ensembleForecast, adaptiveHoltForecast } from "../src/forecast";
import { removeOutliers } from "../src/stats";

describe("Forecasting Engine", () => {
  it("should calculate linear regression for simple linear data", () => {
    const data = [10, 20, 30, 40, 50]; // y = 10x + 10 (0-indexed) => next is 60
    const forecast = linearRegressionForecast(data);
    expect(forecast).toBeCloseTo(60);
  });

  it("should remove outliers correctly", () => {
    const data = [10, 12, 11, 13, 100, 10, 11, 12];
    const filtered = removeOutliers(data);
    expect(filtered).not.toContain(100);
    expect(filtered.length).toBe(7);
  });

  it("should forecast using Holt smoothing", () => {
    const data = [100, 110, 120, 130];
    const forecast = holtForecast(data);
    expect(forecast).toBeGreaterThan(130); 
  });
  
  it("should adaptively forecast with ensemble method", () => {
    const data = [50, 55, 60, 65, 70];
    const forecast = ensembleForecast(data);
    expect(forecast).toBeGreaterThan(70);
  });
});
