import { useEffect, useState } from 'react';
import { useHistory } from '../hooks/useHistory';
import { useTranslation } from '../i18n';
import { useAppStore } from '../store';

export default function HistoryPanel() {
  const { t } = useTranslation();
  const { records, loading, fetchHistory, clearHistory } = useHistory();
  const add = useAppStore((s) => s.addToQueue);
  const to = useAppStore((s) => s.selectedToFormat);
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all');

  useEffect(() => {
    void fetchHistory();
  }, [fetchHistory]);

  const list = records.filter((r) =>
    filter === 'all' ? true : filter === 'success' ? r.success : !r.success
  );

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex gap-1">
          {(['all', 'success', 'failed'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-200"
            >
              {t(`history.filter.${f}`)}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(t('history.clearConfirm'))) void clearHistory();
          }}
          className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 dark:border-gray-700 dark:text-gray-200"
        >
          {t('history.clearAll')}
        </button>
      </div>
      {loading ? (
        <p className="text-sm text-gray-600 dark:text-gray-300">{t('history.loading')}</p>
      ) : list.length === 0 ? (
        <div className="rounded border border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('history.empty')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((r) => {
            const name = r.inputPath.split(/[\\/]/).pop() ?? r.inputPath;
            return (
              <div key={r.id} className="rounded border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-gray-800 dark:text-gray-100">
                    {name} ? {r.toFormat}
                  </p>
                  <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}
                  </span>
                </div>
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      add([
                        {
                          inputPath: r.inputPath,
                          outputPath: r.outputPath,
                          fileName: name,
                          fileSize: r.fileSize,
                          fromFormat: r.fromFormat,
                          toFormat: to
                        }
                      ])
                    }
                    className="rounded px-2 py-1 text-xs text-blue-700 dark:text-blue-300"
                  >
                    {t('history.convertAgain')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
