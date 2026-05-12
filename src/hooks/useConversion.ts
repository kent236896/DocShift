import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { dirname, join } from '@tauri-apps/api/path';
import type { ConversionProgressEvent } from '../types';
import { useAppStore } from '../store';
export function useConversion() {
  const queue = useAppStore((s) => s.queue); const settings = useAppStore((s) => s.settings); const isConverting = useAppStore((s) => s.isConverting);
  const setIsConverting = useAppStore((s) => s.setIsConverting); const updateQueueItem = useAppStore((s) => s.updateQueueItem); const [progress, setProgress] = useState(0);
  useEffect(() => { let un: undefined | (() => void); void listen<ConversionProgressEvent>('conversion_progress', (e) => { const p = e.payload; updateQueueItem(p.id, { status: p.status, progress: p.progress, errorMessage: p.errorMessage, outputPath: p.outputPath }); }).then((u) => { un = u; }); return () => { if (un) un(); }; }, [updateQueueItem]);
  useEffect(() => { const done = queue.filter((q) => q.status === 'done' || q.status === 'error').length; setProgress(queue.length ? Math.round((done / queue.length) * 100) : 0); }, [queue]);
  const startConversion = async () => { const pending = useAppStore.getState().queue.filter((q) => q.status === 'pending'); if (!pending.length) return; setIsConverting(true); const n = Math.min(10, Math.max(1, settings.maxConcurrent));
    try { for (let i = 0; i < pending.length; i += n) { const batch = pending.slice(i, i + n); await Promise.all(batch.map(async (item) => { updateQueueItem(item.id, { status: 'converting', progress: 10 }); const outDir = settings.outputDir === 'custom' && settings.customOutputDir ? settings.customOutputDir : await dirname(item.inputPath); const out = await join(outDir, `${item.fileName.replace(/\.[^.]+$/, '')}.${item.toFormat}`); try { await invoke<string>('convert_file', { args: { id: item.id, inputPath: item.inputPath, outputPath: out, fromFormat: item.fromFormat, toFormat: item.toFormat, extraArgs: settings.pandocExtraArgs } }); updateQueueItem(item.id, { status: 'done', progress: 100, outputPath: out }); } catch (e) { updateQueueItem(item.id, { status: 'error', progress: 100, errorMessage: String(e) }); } })); } } finally { setIsConverting(false); } };
  return { startConversion, isConverting, progress };
}
