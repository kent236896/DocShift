import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ConversionItem, Preset, AppSettings } from '../types';
import { ALL_OUTPUT_FORMAT_IDS } from '../formats';
interface AppStore {
  queue: ConversionItem[];
  addToQueue: (items: Omit<ConversionItem, 'id' | 'status' | 'progress'>[]) => void;
  updateQueueItem: (id: string, updates: Partial<ConversionItem>) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  selectedToFormat: string;
  setSelectedToFormat: (fmt: string) => void;
  extraOutputFormats: string[];
  addExtraOutputFormat: (fmt: string) => void;
  addExtraOutputFormats: (fmts: string[]) => void;
  presets: Preset[];
  addPreset: (preset: Omit<Preset, 'id' | 'createdAt'>) => void;
  deletePreset: (id: string) => void;
  applyPreset: (preset: Preset) => void;
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  activePanel: 'queue' | 'history' | 'settings';
  setActivePanel: (panel: 'queue' | 'history' | 'settings') => void;
  isConverting: boolean;
  setIsConverting: (v: boolean) => void;
}
const defaultSettings: AppSettings = { language: 'auto', theme: 'system', outputDir: 'same', customOutputDir: '', maxConcurrent: 3, openAfterDone: true, pandocExtraArgs: '', defaultFromFormat: 'markdown' };
const id = () => Math.random().toString(36).slice(2);
export const useAppStore = create<AppStore>()(persist((set, get) => ({
  queue: [],
  addToQueue: (items) => set((s) => ({ queue: [...s.queue, ...items.map((i) => ({ ...i, id: id(), status: 'pending', progress: 0 }))] })),
  updateQueueItem: (idv, updates) => set((s) => ({ queue: s.queue.map((q) => q.id === idv ? { ...q, ...updates } : q) })),
  removeFromQueue: (idv) => set((s) => ({ queue: s.queue.filter((q) => q.id !== idv) })),
  clearQueue: () => set({ queue: [] }),
  selectedToFormat: 'docx',
  setSelectedToFormat: (fmt) => set({ selectedToFormat: fmt }),
  extraOutputFormats: [],
  addExtraOutputFormat: (fmt) =>
    set((s) => {
      const t = fmt.trim();
      if (!t || ALL_OUTPUT_FORMAT_IDS.includes(t)) return {};
      if (s.extraOutputFormats.includes(t)) return {};
      return { extraOutputFormats: [...s.extraOutputFormats, t].sort((a, b) => a.localeCompare(b)) };
    }),
  addExtraOutputFormats: (fmts) =>
    set((s) => {
      const next = new Set(s.extraOutputFormats);
      let changed = false;
      for (const f of fmts) {
        const t = f.trim();
        if (!t || ALL_OUTPUT_FORMAT_IDS.includes(t)) continue;
        if (!next.has(t)) {
          next.add(t);
          changed = true;
        }
      }
      if (!changed) return {};
      return { extraOutputFormats: [...next].sort((a, b) => a.localeCompare(b)) };
    }),
  presets: [],
  addPreset: (preset) => set((s) => ({ presets: [...s.presets, { ...preset, id: id(), createdAt: Date.now() }] })),
  deletePreset: (idv) => set((s) => ({ presets: s.presets.filter((p) => p.id !== idv) })),
  applyPreset: (preset) => set({ selectedToFormat: preset.toFormat, settings: { ...get().settings, customOutputDir: preset.outputDir ?? get().settings.customOutputDir, pandocExtraArgs: preset.pandocArgs || get().settings.pandocExtraArgs } }),
  settings: defaultSettings,
  updateSettings: (updates) => set((s) => ({ settings: { ...s.settings, ...updates } })),
  activePanel: 'queue',
  setActivePanel: (panel) => set({ activePanel: panel }),
  isConverting: false,
  setIsConverting: (v) => set({ isConverting: v })
}), { name: 'docshift-store', partialize: (s) => ({ presets: s.presets, settings: s.settings, selectedToFormat: s.selectedToFormat, extraOutputFormats: s.extraOutputFormats }) }));
