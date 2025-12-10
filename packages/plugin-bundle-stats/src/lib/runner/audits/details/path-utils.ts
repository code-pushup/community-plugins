/**
 * Shared path utilities to avoid circular dependencies between formatting.ts and grouping.ts
 */

/**
 * Splits a path into segments, filtering out empty parts.
 */
export function splitPathSegments(path: string): string[] {
  return path.split('/').filter((part) => part !== '');
}

/**
 * Normalizes a path for pattern matching by removing leading './' and ensuring consistent format.
 */
export function normalizePathForMatching(path: string): string {
  // Remove all instances of ../, applying repeatedly to catch overlapping or regenerated cases
  let normalizedPath = path;
  let prev;
  do {
    prev = normalizedPath;
    normalizedPath = normalizedPath.replace(/\.\.\//g, '');
  } while (normalizedPath !== prev);
  return normalizedPath.replace(/^\/+/, '');
}

/**
 * Extracts concrete (non-wildcard) segments from a glob pattern.
 */
export function extractConcreteSegments(pattern: string): string[] {
  return splitPathSegments(pattern).filter(
    (segment) => segment !== '**' && segment !== '*' && !segment.includes('*'),
  );
}

/**
 * Finds the index of a specific segment in a file path.
 */
export function findSegmentIndex(filePath: string, segment: string): number {
  const segments = splitPathSegments(filePath);
  return segments.indexOf(segment);
}

/**
 * Extracts a slice of the path starting from a specific index with a maximum depth.
 */
export function extractPathSlice(
  filePath: string,
  startIndex: number,
  maxDepth: number,
): string {
  const segments = splitPathSegments(filePath);
  const endIndex = Math.min(startIndex + maxDepth, segments.length);
  return segments.slice(startIndex, endIndex).join('/');
}
