import {useCallback, useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {request} from '../api/client';
import {getAll, remove} from '../storage/outbox';

export function useOutboxSync() {
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  const syncNow = useCallback(async () => {
    const actions = await getAll();
    setPendingCount(actions.length);
    if (!actions.length) return;
    setSyncing(true);
    for (const action of actions) {
      try {
        const body = action.body as {updatedAt?: string};
        if (body.updatedAt && action.method === 'PATCH') {
          const remote = await request<{updatedAt?: string}>('GET', action.url);
          if (remote.updatedAt && remote.updatedAt > body.updatedAt) {
            await remove(action.id);
            continue;
          }
        }
        await request(action.method, action.url, action.body);
        await remove(action.id);
      } catch {
        break;
      }
    }
    setPendingCount((await getAll()).length);
    setSyncing(false);
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable !== false) void syncNow();
    });
    void getAll().then(actions => setPendingCount(actions.length));
    return unsubscribe;
  }, [syncNow]);

  return {pendingCount, syncing, syncNow};
}
