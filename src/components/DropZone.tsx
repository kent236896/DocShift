import { open } from '@tauri-apps/plugin-dialog';
import { useTranslation } from '../i18n';

export default function DropZone({ onPathsAdded }: { onPathsAdded: (paths: string[]) => void }) {
  const { t } = useTranslation();
  const browse = async () => {
    const s = await open({ multiple: true, directory: false });
    if (!s) return;
    onPathsAdded(Array.isArray(s) ? s : [s]);
  };
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => void browse()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          void browse();
        }
      }}
      className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800"
    >
      <p className="text-base font-semibold text-gray-800 dark:text-gray-100">{t('dropzone.title')}</p>
      <p className="text-sm text-gray-600 dark:text-gray-300">{t('dropzone.subtitle')}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{t('dropzone.hint')}</p>
    </div>
  );
}
