import { CalculationResult, StatResult, Matrix2x2, ComplexNumber } from "./types";
import { validateArray } from "./utils/validator";
import {
  evaluateExpression, batchEvaluate, deepAnalyze, runFullAnalysis,
  matrixDet, matrixApply, complexAbs,
} from "./comprehensive";
import { computeAllStats, normalizeValues, confidenceInterval } from "./statistics";
import { analyzeGraph, Edge, GraphResult, computeGraphEigenvectorCentrality } from "./network";

export interface VisualSeries {
  label: string;
  dataPoints: number[];
  color: string;
  stats: StatResult;
}

export function createSeries(label: string, data: number[], color: string): VisualSeries {
  const arr = validateArray(data);
  const stats = computeAllStats(arr);
  return { label, dataPoints: arr, color, stats };
}

export function seriesReport(series: VisualSeries): string {
  const s = series.stats;
  return [
    `Series: ${series.label}`,
    `  Mean: ${s.mean.toFixed(2)}`,
    `  StdDev: ${s.stddev.toFixed(2)}`,
    `  Range: [${s.min}, ${s.max}]`,
    `  Count: ${s.count}`,
  ].join("\n");
}

export function compareSeries(a: VisualSeries, b: VisualSeries): {
  diff: number[];
  meanDiff: number;
  correlation: number;
} {
  const maxLen = Math.max(a.dataPoints.length, b.dataPoints.length);
  const diff: number[] = [];
  for (let i = 0; i < maxLen; i++) {
    const av = a.dataPoints[i] ?? 0;
    const bv = b.dataPoints[i] ?? 0;
    diff.push(av - bv);
  }
  const meanDiff = diff.reduce((s, v) => s + v, 0) / diff.length;
  const aNorm = normalizeValues(a.dataPoints);
  const bNorm = normalizeValues(b.dataPoints);
  const minLen = Math.min(aNorm.length, bNorm.length);
  let corrNum = 0;
  let corrDenA = 0;
  let corrDenB = 0;
  const ma = aNorm.slice(0, minLen).reduce((s, v) => s + v, 0) / minLen;
  const mb = bNorm.slice(0, minLen).reduce((s, v) => s + v, 0) / minLen;
  for (let i = 0; i < minLen; i++) {
    const da = aNorm[i] - ma;
    const db = bNorm[i] - mb;
    corrNum += da * db;
    corrDenA += da * da;
    corrDenB += db * db;
  }
  const correlation = corrDenA && corrDenB ? corrNum / Math.sqrt(corrDenA * corrDenB) : 0;
  return { diff, meanDiff, correlation };
}

export function matrixHeatmap(m: Matrix2x2): string[][] {
  return [
    [m.a.toFixed(2), m.b.toFixed(2)],
    [m.c.toFixed(2), m.d.toFixed(2)],
  ];
}

export function complexSeries(z: ComplexNumber): VisualSeries {
  const data = [complexAbs(z), z.real, z.imag];
  return createSeries(`complex(${z.real},${z.imag})`, data, "#000");
}

export function expressionGraph(expr: string): VisualSeries {
  const analysis = deepAnalyze(expr);
  const data = [analysis.complexity, analysis.tokenCount, analysis.result.value];
  return createSeries(expr, data, "#00f");
}

export function fullVisualReport(expressions: string[]): {
  series: VisualSeries[];
  summary: StatResult;
} {
  const { results, stats } = runFullAnalysis(expressions);
  const series = results.map((r, i) =>
    createSeries(`expr-${i}`, [r.value, results.length, i], `#${i}f0${i}`),
  );
  return { series, summary: stats };
}

export function graphVisualReport(edges: Edge[], nodeCount: number): {
  graph: GraphResult;
  centrality: VisualSeries;
} {
  const graph = analyzeGraph(nodeCount, edges);
  const cent = computeGraphEigenvectorCentrality(edges, nodeCount, 10);
  const centrality = createSeries("centrality", cent, "#f00");
  return { graph, centrality };
}

export function confidenceReport(values: number[]): {
  series: VisualSeries;
  interval: { lower: number; upper: number; mean: number };
} {
  const arr = validateArray(values);
  const series = createSeries("data", arr, "#0f0");
  const interval = confidenceInterval(arr);
  return { series, interval };
}