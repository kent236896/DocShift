import { useEffect, useRef, useState } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useTranslation } from '../i18n';
import { useAppStore } from '../store';

export default function TitleBar() {
  const { t } = useTranslation();
  const setA = useAppStore((s) => s.setActivePanel);
  const w = getCurrentWindow();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuOpen]);

  const iconBtn =
    'flex h-7 w-7 items-center justify-center rounded text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800';

  return (
    <header className="flex h-12 items-center border-b border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center gap-2" data-tauri-drag-region>
        <svg width="18" height="18" viewBox="0 0 24 24" className="text-brand-600 dark:text-brand-500">
          <path fill="currentColor" d="M6 3h9l5 5v13H6zm8 1.5V9h4.5zM8 12h8v1.5H8zm0 3h8V16.5H8z" />
        </svg>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">DocShift</span>
      </div>
      <div className="flex-1" data-tauri-drag-region />
      <div ref={menuRef} className="relative mr-2">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t('titlebar.more')}
        </button>
        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-full z-[100] mt-1 min-w-[9rem] rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <button
              type="button"
              role="menuitem"
              className="block w-full px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                setA('history');
                setMenuOpen(false);
              }}
            >
              {t('titlebar.history')}
            </button>
            <button
              type="button"
              role="menuitem"
              className="block w-full px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                setA('settings');
                setMenuOpen(false);
              }}
            >
              {t('titlebar.settings')}
            </button>
          </div>
        )}
      </div>
      <div className="flex gap-1">
        <button type="button" className={iconBtn} onClick={() => void w.minimize()} aria-label="Minimize">
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
            <path fill="currentColor" d="M0 5h12v2H0z" />
          </svg>
        </button>
        <button type="button" className={iconBtn} onClick={() => void w.toggleMaximize()} aria-label="Maximize">
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
            <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M1.5 2.5h9v7h-9z" />
          </svg>
        </button>
        <button
          type="button"
          className={`${iconBtn} hover:bg-red-500 hover:text-white dark:hover:bg-red-500`}
          onClick={() => void w.close()}
          aria-label="Close"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
            <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M3 3l6 6M9 3l-6 6" />
          </svg>
        </button>
      </div>
    </header>
  );
}
