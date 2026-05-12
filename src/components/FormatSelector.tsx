import { useMemo, useState } from 'react';
import { ALL_FORMATS, ALL_OUTPUT_FORMAT_IDS, COMMON_FORMATS, getFormatById } from '../formats';
import { useTranslation } from '../i18n';
import { useAppStore } from '../store';
import OutputFormatModal from './OutputFormatModal';

export default function FormatSelector({
  value,
  onChange,
  disabled
}: {
  value: string;
  onChange: (format: string) => void;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const extraOutputFormats = useAppStore((s) => s.extraOutputFormats);
  const addExtraOutputFormats = useAppStore((s) => s.addExtraOutputFormats);
  const [modalOpen, setModalOpen] = useState(false);

  const extrasShown = useMemo(
    () => extraOutputFormats.filter((x) => !ALL_OUTPUT_FORMAT_IDS.includes(x)),
    [extraOutputFormats]
  );

  const knownSet = useMemo(
    () => new Set<string>([...ALL_OUTPUT_FORMAT_IDS, ...extrasShown]),
    [extrasShown]
  );

  const orphan = value && !knownSet.has(value) ? value : null;

  return (
    <div className="w-full space-y-2">
      <label className="mb-1 block text-sm text-gray-700 dark:text-gray-200">{t('formats.selectOutput')}</label>
      <div className="flex gap-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="min-w-0 flex-1 rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          <optgroup label={t('formats.common')}>
            {COMMON_FORMATS.map((id) => {
              const f = getFormatById(id);
              return f ? (
                <option key={id} value={id}>
                  {f.label}
                </option>
              ) : null;
            })}
          </optgroup>
          {ALL_FORMATS.map((g) => (
            <optgroup key={g.label} label={t(`formats.groups.${g.label}`)}>
              {g.formats
                .filter((f) => f.canOutput)
                .map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
            </optgroup>
          ))}
          {extrasShown.length > 0 && (
            <optgroup label={t('formats.addedGroup')}>
              {extrasShown.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </optgroup>
          )}
          {orphan && (
            <optgroup label={t('formats.otherGroup')}>
              <option value={orphan}>{orphan}</option>
            </optgroup>
          )}
        </select>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setModalOpen(true)}
          className="shrink-0 rounded border border-brand-600 bg-white px-3 py-2 text-xs font-medium text-brand-700 hover:bg-brand-50 dark:border-brand-500 dark:bg-gray-800 dark:text-brand-300 dark:hover:bg-brand-900/20"
        >
          {t('formats.addMore')}
        </button>
      </div>
      <OutputFormatModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onPick={(fmts) => {
          if (!fmts.length) return;
          addExtraOutputFormats(fmts);
          const sorted = [...fmts].sort((a, b) => a.localeCompare(b));
          onChange(sorted[sorted.length - 1]!);
        }}
      />
    </div>
  );
}
