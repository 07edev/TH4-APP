import {useCallback, useEffect, useState} from 'react';
import {getCache, setCache} from '../storage/cache';

export function useCachedQuery<T>(key: string, fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const value = await fetcher();
      setData(value);
      await setCache(key, value);
      setLastUpdated(new Date().toISOString());
    } catch (reason) {
      setError(reason instanceof Error ? reason : new Error('Không thể tải dữ liệu.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetcher, key]);

  useEffect(() => {
    let active = true;
    getCache<T>(key)
      .then(entry => {
        if (!active || !entry) return;
        setData(entry.data);
        setLastUpdated(entry.savedAt);
        setLoading(false);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) void refresh();
      });
    return () => {
      active = false;
    };
  }, [key, refresh]);

  return {data, loading, error, refreshing, lastUpdated, refresh};
}
