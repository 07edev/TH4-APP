import AsyncStorage from '@react-native-async-storage/async-storage';

type CacheEntry<T> = {data: T; savedAt: string};

export async function getCache<T>(key: string): Promise<CacheEntry<T> | null> {
  const raw = await AsyncStorage.getItem(key);
  return raw ? (JSON.parse(raw) as CacheEntry<T>) : null;
}

export async function setCache<T>(key: string, data: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify({data, savedAt: new Date().toISOString()}));
}
