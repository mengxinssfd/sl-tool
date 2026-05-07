import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import electron from 'vite-plugin-electron/simple';
import * as process from 'node:process';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const APP_TITLE = env['VITE_APP_TITLE'];
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'html-title',
        transformIndexHtml(html) {
          return html.replace(
            /<title>.*?<\/title>/,
            `<title>${APP_TITLE}</title>`,
          );
        },
      },
      electron({
        main: { entry: 'electron/index.ts' },
        preload: { input: 'electron/preload.ts' },
        // Optional: Use Node.js API in the Renderer process
        // renderer: {},
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
    },
  };
});
