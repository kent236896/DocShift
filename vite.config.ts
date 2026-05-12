import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_', 'TAURI_'],
  server: { port: 1420, strictPort: true },
  build: { target: ['es2021', 'chrome100', 'safari13'] }
});
