import { useCallback, useEffect } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import TitleBar from './components/TitleBar';
import DropZone from './components/DropZone';
import FormatSelector from './components/FormatSelector';
import ConversionQueue from './components/ConversionQueue';
import HistoryPanel from './components/HistoryPanel';
import PresetManager from './components/PresetManager';
import SettingsPanel from './components/SettingsPanel';
import { detectFormatFromExtension } from './formats';
import { useConversion } from './hooks/useConversion';
import { useTauriFileDrop } from './hooks/useTauriFileDrop';
import { useTheme } from './hooks/useTheme';
import { useTranslation } from './i18n';
import { useAppStore } from './store';

function queuePaths(paths: string[], toFormat: string, defaultFrom: string) {
  return paths.map((p) => ({
    inputPath: p,
    outputPath: '',
    fileName: p.split(/[\\/]/).pop() || p,
    fileSize: 0,
    fromFormat: detectFormatFromExtension(p) ?? defaultFrom,
    toFormat
  }));
}

export default function App() {
  useTheme();
  const { t } = useTranslation();
  const panel = useAppStore((s) => s.activePanel);
  const setPanel = useAppStore((s) => s.setActivePanel);
  const add = useAppStore((s) => s.addToQueue);
  const to = useAppStore((s) => s.selectedToFormat);
  const setTo = useAppStore((s) => s.setSelectedToFormat);
  const q = useAppStore((s) => s.queue);
  const settings = useAppStore((s) => s.settings);
  const defaultFrom = (settings.defaultFromFormat ?? 'markdown').trim() || 'markdown';
  const { startConversion, isConverting } = useConversion();

  const closeOverlay = useCallback(() => setPanel('queue'), [setPanel]);
  const overlayOpen = panel === 'history' || panel === 'settings';

  const addPaths = useCallback(
    (paths: string[]) => {
      const unique = [...new Set(paths)];
      if (!unique.length) return;
      add(queuePaths(unique, to, defaultFrom));
    },
    [add, defaultFrom, to]
  );

  useTauriFileDrop(addPaths);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        void (async () => {
          const s = await open({ multiple: true, directory: false });
          if (!s) return;
          const paths = [...new Set(Array.isArray(s) ? s : [s])];
          add(queuePaths(paths, to, defaultFrom));
        })();
      }
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        void startConversion();
      }
      if (e.ctrlKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setPanel('history');
      }
      if (e.ctrlKey && e.key === ',') {
        e.preventDefault();
        setPanel('settings');
      }
      if (e.key === 'Escape' && overlayOpen) {
        closeOverlay();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [add, closeOverlay, defaultFrom, overlayOpen, setPanel, startConversion, to]);

  return (
    <div
      className={`h-screen overflow-hidden bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 ${overlayOpen ? 'max-h-screen' : ''}`}
    >
      <TitleBar />
      <main className="mx-auto flex h-[calc(100vh-48px)] max-w-5xl flex-col gap-3 p-3">
        <DropZone onPathsAdded={addPaths} />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="md:col-span-2 rounded border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
            <FormatSelector value={to} onChange={setTo} disabled={isConverting} />
          </div>
          <PresetManager fromFormat={q[0]?.fromFormat ?? defaultFrom} toFormat={to} />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto rounded border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
          <ConversionQueue onConvertAll={() => void startConversion()} />
        </div>
      </main>

      {overlayOpen && (
        <div className="fixed inset-0 z-50 flex">
          <button
            type="button"
            className="min-h-0 flex-1 cursor-default bg-black/40"
            aria-label={t('titlebar.closePanel')}
            onClick={closeOverlay}
          />
          <aside className="flex max-h-full w-full max-w-md flex-col border-l border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-3 py-2 dark:border-gray-700">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {panel === 'history' ? t('history.title') : t('settings.title')}
              </span>
              <button
                type="button"
                onClick={closeOverlay}
                className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {t('titlebar.closePanel')}
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-3">{panel === 'history' ? <HistoryPanel /> : <SettingsPanel />}</div>
          </aside>
        </div>
      )}
    </div>
  );
}
