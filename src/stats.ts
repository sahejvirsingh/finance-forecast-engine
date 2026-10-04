export function calculateStdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

export function calculateWeightedAverage(values: number[]): number {
  if (values.length === 0) return 0;
  let totalWeight = 0;
  let weightedSum = 0;
  for (let i = 0; i < values.length; i++) {
    const weight = Math.exp((i - values.length + 1) * 0.1); 
    totalWeight += weight;
    weightedSum += values[i] * weight;
  }
  return weightedSum / totalWeight;
}

export function removeOutliers(values: number[]): number[] {
  if (values.length < 4) return values;
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(values.length / 4)];
  const q3 = sorted[Math.floor((values.length * 3) / 4)];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  return values.filter((v) => v >= lowerBound && v <= upperBound);
}
