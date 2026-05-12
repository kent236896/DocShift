import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { useTranslation } from '../i18n';
import { useAppStore } from '../store';

export default function SettingsPanel() {
  const { t, i18n } = useTranslation();
  const s = useAppStore((x) => x.settings);
  const u = useAppStore((x) => x.updateSettings);
  const [pv, setPv] = useState('...');
  useEffect(() => {
    void invoke<string>('get_pandoc_version').then(setPv).catch(() => setPv('unknown'));
  }, []);
  useEffect(() => {
    const lang = s.language === 'auto' ? (navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en') : s.language;
    void i18n.changeLanguage(lang);
  }, [s.language, i18n]);

  return (
    <section className="space-y-4">
      <div className="rounded border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-100">{t('settings.title')}</h3>
        <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">{t('settings.language')}</label>
        <select
          value={s.language}
          onChange={(e) => u({ language: e.target.value as 'auto' | 'en' | 'zh' })}
          className="mb-3 w-full rounded border border-gray-300 bg-white px-2 py-1 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        >
          <option value="auto">{t('settings.langAuto')}</option>
          <option value="en">{t('settings.langEn')}</option>
          <option value="zh">{t('settings.langZh')}</option>
        </select>
        <div className="mb-2 flex flex-wrap gap-3">
          {(['light', 'dark', 'system'] as const).map((th) => (
            <label key={th} className="text-sm text-gray-700 dark:text-gray-200">
              <input type="radio" checked={s.theme === th} onChange={() => u({ theme: th })} className="mr-1" />
              {t(`settings.themes.${th}`)}
            </label>
          ))}
        </div>
        <div className="mb-2 flex flex-wrap gap-3">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            <input type="radio" checked={s.outputDir === 'same'} onChange={() => u({ outputDir: 'same' })} className="mr-1" />
            {t('settings.outputDirSame')}
          </label>
          <label className="text-sm text-gray-700 dark:text-gray-200">
            <input type="radio" checked={s.outputDir === 'custom'} onChange={() => u({ outputDir: 'custom' })} className="mr-1" />
            {t('settings.outputDirCustom')}
          </label>
        </div>
        {s.outputDir === 'custom' && (
          <div className="mb-2 flex gap-2">
            <input
              value={s.customOutputDir}
              onChange={(e) => u({ customOutputDir: e.target.value })}
              className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
            <button
              type="button"
              onClick={async () => {
                const d = await open({ directory: true, multiple: false });
                if (typeof d === 'string') u({ customOutputDir: d });
              }}
              className="rounded border border-gray-300 px-2 py-1 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-200"
            >
              {t('settings.browse')}
            </button>
          </div>
        )}
        <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">{t('settings.maxConcurrent')}</label>
        <input
          type="number"
          min={1}
          max={10}
          value={s.maxConcurrent}
          onChange={(e) => u({ maxConcurrent: Math.min(10, Math.max(1, Number(e.target.value) || 1)) })}
          className="mb-3 w-full rounded border border-gray-300 bg-white px-2 py-1 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
        <label className="mb-2 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
          <input type="checkbox" checked={s.openAfterDone} onChange={(e) => u({ openAfterDone: e.target.checked })} />
          {t('settings.openAfterDone')}
        </label>
        <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">{t('settings.pandocArgs')}</label>
        <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">{t('settings.pandocArgsHint')}</p>
        <input
          value={s.pandocExtraArgs}
          onChange={(e) => u({ pandocExtraArgs: e.target.value })}
          placeholder="--toc --number-sections"
          className="w-full rounded border border-gray-300 bg-white px-2 py-1 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
      </div>
      <div className="rounded border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-300">{t('settings.version', { version: '1.0.0' })}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">{t('settings.pandocVersion', { version: pv })}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{t('settings.license')}</p>
      </div>
    </section>
  );
}
