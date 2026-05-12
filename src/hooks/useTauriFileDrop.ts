import { useEffect } from 'react';
import { getCurrentWebview } from '@tauri-apps/api/webview';

/** Windows 上 WebView 默认启用系统拖放时，HTML5/react-dropzone 收不到 drop；此处用 Tauri 提供的真实路径。 */
export function useTauriFileDrop(onPathsDropped: (paths: string[]) => void) {
  useEffect(() => {
    let cancelled = false;
    let unlisten: (() => void) | undefined;
    void getCurrentWebview()
      .onDragDropEvent((event) => {
        if (cancelled) return;
        if (event.payload.type === 'drop') {
          onPathsDropped(event.payload.paths);
        }
      })
      .then((fn) => {
        if (cancelled) {
          fn();
          return;
        }
        unlisten = fn;
      });
    return () => {
      cancelled = true;
      unlisten?.();
    };
  }, [onPathsDropped]);
}
