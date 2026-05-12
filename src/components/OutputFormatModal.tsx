import { useCallback, useEffect, useMemo, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useTranslation } from '../i18n';

export default function OutputFormatModal({
  open,
  onClose,
  onPick
}: {
  open: boolean;
  onClose: () => void;
  onPick: (formats: string[]) => void;
}) {
  const { t } = useTranslation();
  const [list, setList] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (!open) return;
    setQ('');
    setError('');
    setSelected(new Set());
    setLoading(true);
    void invoke<string[]>('list_pandoc_output_formats')
      .then(setList)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter((x) => x.toLowerCase().includes(s));
  }, [list, q]);

  const toggle = useCallback((fmt: string) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(fmt)) n.delete(fmt);
      else n.add(fmt);
      return n;
    });
  }, []);

  const selectAllFiltered = useCallback(() => {
    setSelected((prev) => {
      const n = new Set(prev);
      filtered.forEach((f) => n.add(f));
      return n;
    });
  }, [filtered]);

  const clearSelection = useCallback(() => setSelected(new Set()), []);

  const addSelected = useCallback(() => {
    if (selected.size === 0) return;
    const sorted = [...selected].sort((a, b) => a.localeCompare(b));
    onPick(sorted);
    onClose();
  }, [onClose, onPick, selected]);

  if (!open) return null;

  const nSel = selected.size;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/50" aria-label={t('formats.closeModal')} onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="output-format-modal-title"
        className="relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <h2 id="output-format-modal-title" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {t('formats.pickFormatTitle')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {t('formats.closeModal')}
          </button>
        </div>
        <div className="shrink-0 space-y-2 border-b border-gray-200 p-3 dark:border-gray-700">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('formats.searchFormats')}
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            autoFocus
          />
          {!loading && !error && filtered.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={selectAllFiltered}
                className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                {t('formats.selectAllFiltered')}
              </button>
              <button
                type="button"
                onClick={clearSelection}
                disabled={nSel === 0}
                className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                {t('formats.clearSelection')}
              </button>
              <span className="text-xs text-gray-500 dark:text-gray-400">{t('formats.selectedCount', { count: nSel })}</span>
            </div>
          )}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {loading && <p className="px-2 py-4 text-center text-sm text-gray-500">{t('formats.loadingFormats')}</p>}
          {!loading && error && <p className="px-2 py-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
          {!loading && !error && filtered.length === 0 && (
            <p className="px-2 py-4 text-center text-sm text-gray-500">{t('formats.noMatches')}</p>
          )}
          {!loading && !error && filtered.length > 0 && (
            <ul className="space-y-0.5">
              {filtered.map((fmt) => (
                <li key={fmt}>
                  <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm text-gray-800 hover:bg-brand-50 dark:text-gray-100 dark:hover:bg-brand-900/20">
                    <input type="checkbox" className="rounded border-gray-300" checked={selected.has(fmt)} onChange={() => toggle(fmt)} />
                    <span className="select-none">{fmt}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex shrink-0 justify-end gap-2 border-t border-gray-200 px-4 py-3 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            {t('formats.closeModal')}
          </button>
          <button
            type="button"
            disabled={nSel === 0}
            onClick={addSelected}
            className="rounded bg-brand-600 px-3 py-1.5 text-sm text-white disabled:opacity-40"
          >
            {t('formats.addSelected', { count: nSel })}
          </button>
        </div>
      </div>
    </div>
  );
}
