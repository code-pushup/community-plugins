import type { AuditOutput } from '@code-pushup/models';
import type { BundleStatsConfig } from '../types.js';
import type { UnifiedStats } from '../unify/unified-stats.types.js';
import { createDisplayValue, createEmptyAudit } from '../utils.js';
import { createAuditOutputDetails } from './details/audit-details.js';
import { getIssues } from './details/issues.js';
import { createBundleStatsScoring } from './scoring.js';
import { selectBundles } from './selection.js';

/**
 * Calculates total bytes from unified stats tree. Aggregates byte counts across all artefacts.
 */
export function calculateTotalBytes(statsSlice: UnifiedStats): number {
  return Object.values(statsSlice).reduce((acc, curr) => acc + curr.bytes, 0);
}

/**
 * Creates audit output from processed tree data and configuration. Combines size scoring with penalty calculations from actual issues.
 */
export function createAuditOutput(
  statsSlice: UnifiedStats,
  config: BundleStatsConfig,
): AuditOutput {
  const trees = Object.values(statsSlice);
  const totalBytes = calculateTotalBytes(statsSlice);

  console.time('⚡ GET_ISSUES');
  const issues = getIssues(statsSlice, config);
  console.timeEnd('⚡ GET_ISSUES');

  const calculateScore = createBundleStatsScoring({
    mode: config.scoring.mode,
    totalSize: config.scoring.totalSize,
    penalty: config.scoring.penalty,
  });

  return {
    slug: config.slug,
    score: calculateScore(totalBytes, issues),
    value: totalBytes,
    displayValue: createDisplayValue(totalBytes, trees.length),
    details: createAuditOutputDetails(issues, statsSlice, config),
  };
}

/**
 * Generates audit outputs from bundle stats tree and configurations
 */
export function generateAuditOutputs(
  bundleStatsTree: UnifiedStats,
  configs: BundleStatsConfig[],
): AuditOutput[] {
  return configs.map((config) => {
    console.time(`🔍 SELECT_BUNDLES - ${config.slug}`);

    const filteredTree = selectBundles(bundleStatsTree, config.selection);
    console.timeEnd(`🔍 SELECT_BUNDLES - ${config.slug}`);

    if (!filteredTree || Object.keys(filteredTree).length === 0) {
      return createEmptyAudit(config);
    }

    console.time(`📝 CREATE_AUDIT_OUTPUT - ${config.slug}`);
    const result = createAuditOutput(filteredTree, config);
    console.timeEnd(`📝 CREATE_AUDIT_OUTPUT - ${config.slug}`);

    return result;
  });
}
