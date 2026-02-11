import { getFileMtime } from './file-resolver';

interface CacheEntry<T> {
  data: T;
  mtime: number;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

// Cache TTL: 5 minutes (in addition to mtime checks)
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function cachedParse<T>(
  filePath: string,
  parser: (filePath: string) => Promise<T>
): Promise<T> {
  const currentMtime = getFileMtime(filePath);
  const cached = cache.get(filePath) as CacheEntry<T> | undefined;

  if (cached) {
    const isStale = Date.now() - cached.timestamp > CACHE_TTL_MS;
    const isModified = currentMtime !== cached.mtime;

    if (!isStale && !isModified) {
      return cached.data;
    }
  }

  const data = await parser(filePath);
  cache.set(filePath, {
    data,
    mtime: currentMtime,
    timestamp: Date.now(),
  });

  return data;
}

export async function cachedMultiParse<T>(
  filePaths: string[],
  parser: (filePaths: string[]) => Promise<T>,
  cacheKey: string
): Promise<T> {
  const currentMtimes = filePaths.map(getFileMtime);
  const combinedMtime = currentMtimes.reduce((a, b) => Math.max(a, b), 0);
  const cached = cache.get(cacheKey) as CacheEntry<T> | undefined;

  if (cached) {
    const isStale = Date.now() - cached.timestamp > CACHE_TTL_MS;
    const isModified = combinedMtime !== cached.mtime;

    if (!isStale && !isModified) {
      return cached.data;
    }
  }

  const data = await parser(filePaths);
  cache.set(cacheKey, {
    data,
    mtime: combinedMtime,
    timestamp: Date.now(),
  });

  return data;
}

export function clearCache(): void {
  cache.clear();
}
