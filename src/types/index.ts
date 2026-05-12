export type ConversionStatus = 'pending' | 'converting' | 'done' | 'error';
export interface ConversionItem { id: string; inputPath: string; outputPath: string; fileName: string; fileSize: number; fromFormat: string; toFormat: string; status: ConversionStatus; progress: number; errorMessage?: string; startedAt?: number; completedAt?: number; }
export interface HistoryRecord { id: number; inputPath: string; outputPath: string; fromFormat: string; toFormat: string; success: boolean; errorMsg: string | null; createdAt: string; fileSize: number; }
export interface Preset { id: string; name: string; fromFormat: string; toFormat: string; outputDir: string | null; pandocArgs: string; createdAt: number; }
export interface FormatGroup { label: string; formats: FormatDef[]; }
export interface FormatDef { id: string; label: string; extensions: string[]; canInput: boolean; canOutput: boolean; }
export interface AppSettings { language: 'zh' | 'en' | 'auto'; theme: 'light' | 'dark' | 'system'; outputDir: 'same' | 'custom'; customOutputDir: string; maxConcurrent: number; openAfterDone: boolean; pandocExtraArgs: string; defaultFromFormat: string; }
export interface ConversionProgressEvent { id: string; progress: number; status: ConversionStatus; errorMessage?: string; outputPath?: string; }
