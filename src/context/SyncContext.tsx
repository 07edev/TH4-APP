import React, {createContext, PropsWithChildren, useContext} from 'react';
import {useOutboxSync} from '../hooks/useOutboxSync';

type SyncContextValue = ReturnType<typeof useOutboxSync>;
const SyncContext = createContext<SyncContextValue | null>(null);

export function SyncProvider({children}: PropsWithChildren) {
  const sync = useOutboxSync();
  return <SyncContext.Provider value={sync}>{children}</SyncContext.Provider>;
}

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) throw new Error('useSync must be used inside SyncProvider');
  return context;
}
