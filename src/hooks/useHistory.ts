import { useCallback, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { HistoryRecord } from '../types';

export function useHistory() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      setRecords(await invoke<HistoryRecord[]>('get_history'));
    } finally {
      setLoading(false);
    }
  }, []);

  const clearHistory = useCallback(async () => {
    await invoke('clear_history');
    await fetchHistory();
  }, [fetchHistory]);

  return { records, loading, fetchHistory, clearHistory };
}
