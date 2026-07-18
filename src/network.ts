import { StatResult, CalculationResult } from "./types";
import { validateArray, ValidationError } from "./utils/validator";
import { aggregateResults, averageResults, batchEvaluate } from "./comprehensive";
import { computeMean, computeStddev, computeAllStats } from "./statistics";

export interface Edge {
  source: number;
  target: number;
  weight: number;
}

export interface GraphResult {
  nodeCount: number;
  edgeCount: number;
  density: number;
  avgWeight: number;
  totalWeight: number;
  isolatedNodes: number[];
}

export function createEdge(source: number, target: number, weight: number): Edge {
  if (source < 0 || target < 0) throw new ValidationError("Node index must be non-negative");
  return { source, target, weight };
}

export function graphDensity(nodeCount: number, edgeCount: number): number {
  if (nodeCount <= 1) return 0;
  const maxEdges = nodeCount * (nodeCount - 1);
  return edgeCount / maxEdges;
}

export function averageEdgeWeight(edges: Edge[]): number {
  if (edges.length === 0) throw new ValidationError("No edges in graph");
  return edges.reduce((s, e) => s + e.weight, 0) / edges.length;
}

export function analyzeGraph(nodeCount: number, edges: Edge[]): GraphResult {
  const n = nodeCount;
  const e = edges.length;
  const density = graphDensity(n, e);
  const avgWeight = averageEdgeWeight(edges);
  const totalWeight = edges.reduce((s, e) => s + e.weight, 0);
  const connected = new Set<number>();
  for (const edge of edges) {
    connected.add(edge.source);
    connected.add(edge.target);
  }
  const isolatedNodes: number[] = [];
  for (let i = 0; i < n; i++) {
    if (!connected.has(i)) isolatedNodes.push(i);
  }
  return { nodeCount: n, edgeCount: e, density, avgWeight, totalWeight, isolatedNodes };
}

export function graphStats(nodeCount: number, edges: Edge[]): StatResult {
  const weights = edges.map((e) => e.weight);
  return computeAllStats(weights);
}

export function multiplyMatrices(
  a: number[][], b: number[][],
): number[][] {
  if (a.length === 0 || b.length === 0) throw new ValidationError("Empty matrix");
  if (a[0].length !== b.length) throw new ValidationError("Incompatible matrix dimensions");
  const n = a.length;
  const m = b[0].length;
  const p = b.length;
  const result: number[][] = [];
  for (let i = 0; i < n; i++) {
    result[i] = [];
    for (let j = 0; j < m; j++) {
      let sum = 0;
      for (let k = 0; k < p; k++) {
        sum += a[i][k] * b[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

export function transposeMatrix(m: number[][]): number[][] {
  if (m.length === 0) return [];
  const rows = m.length;
  const cols = m[0].length;
  const result: number[][] = [];
  for (let j = 0; j < cols; j++) {
    result[j] = [];
    for (let i = 0; i < rows; i++) {
      result[j][i] = m[i][j];
    }
  }
  return result;
}

export function computeGraphEigenvectorCentrality(
  edges: Edge[], nodeCount: number, iterations: number,
): number[] {
  let centrality = new Array(nodeCount).fill(1);
  for (let iter = 0; iter < iterations; iter++) {
    const next = new Array(nodeCount).fill(0);
    for (const edge of edges) {
      next[edge.target] += centrality[edge.source] * edge.weight;
    }
    const norm = Math.sqrt(next.reduce((s, v) => s + v * v, 0)) || 1;
    centrality = next.map((v) => v / norm);
  }
  return centrality;
}

export function evaluateExpressionNetwork(expr: string): {
  result: CalculationResult;
  graphRank: number;
} {
  const result = batchEvaluate([expr])[0];
  const localRank = Math.abs(result.value) / (1 + Math.abs(result.value));
  return { result, graphRank: localRank };
}

export function computeDeepStats(calcResults: CalculationResult[]): {
  stats: StatResult;
  distribution: Record<string, number>;
} {
  const stats = aggregateResults(calcResults);
  const distribution: Record<string, number> = {};
  for (const r of calcResults) {
    const bucket = r.value < 0 ? "negative" : r.value === 0 ? "zero" : "positive";
    distribution[bucket] = (distribution[bucket] || 0) + 1;
  }
  return { stats, distribution };
}