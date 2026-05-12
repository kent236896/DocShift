import { useTranslation } from '../i18n';
import { useAppStore } from '../store';

export default function ConversionQueue({ onConvertAll }: { onConvertAll: () => void }) {
  const { t } = useTranslation();
  const queue = useAppStore((s) => s.queue);
  const isConverting = useAppStore((s) => s.isConverting);
  const remove = useAppStore((s) => s.removeFromQueue);
  const update = useAppStore((s) => s.updateQueueItem);
  if (!queue.length) {
    return (
      <div className="rounded border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
        <p className="text-gray-700 dark:text-gray-200">{t('queue.empty')}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('queue.emptyHint')}</p>
      </div>
    );
  }
  const done = queue.filter((q) => q.status === 'done').length;
  const failed = queue.filter((q) => q.status === 'error').length;
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-300">{t('queue.summary', { total: queue.length, done, failed })}</p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={isConverting}
            onClick={onConvertAll}
            className="rounded bg-brand-600 px-3 py-1.5 text-sm text-white"
          >
            {t('queue.convertAll')}
          </button>
          <button
            type="button"
            onClick={() =>
              queue.forEach((q) => {
                if (q.status !== 'pending' && q.status !== 'converting') remove(q.id);
              })
            }
            className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-200"
          >
            {t('queue.clearAll')}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {queue.map((q) => (
          <div key={q.id} className="rounded border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm text-gray-800 dark:text-gray-100">{q.fileName}</p>
              <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">{t(`queue.status.${q.status}`)}</span>
            </div>
            <div className="my-2 h-2 rounded bg-gray-200 dark:bg-gray-700">
              <div className="h-2 rounded bg-brand-600 transition-all" style={{ width: `${q.progress}%` }} />
            </div>
            {q.status === 'error' && q.errorMessage && (
              <p className="mb-2 whitespace-pre-wrap break-words text-xs text-red-600 dark:text-red-400">{q.errorMessage}</p>
            )}
            <div className="flex justify-end gap-1">
              {q.status === 'error' && (
                <button
                  type="button"
                  onClick={() => update(q.id, { status: 'pending', progress: 0, errorMessage: undefined })}
                  className="rounded px-2 py-1 text-xs text-blue-700 dark:text-blue-300"
                >
                  {t('queue.retry')}
                </button>
              )}
              {q.status !== 'converting' && (
                <button type="button" onClick={() => remove(q.id)} className="rounded px-2 py-1 text-xs text-red-700 dark:text-red-300">
                  {t('queue.remove')}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
