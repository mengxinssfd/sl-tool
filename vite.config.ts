/* eslint-disable @typescript-eslint/ban-ts-comment */
import { rmSync } from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
// @ts-ignore
import electron from 'vite-electron-plugin';
// @ts-ignore
import { customStart, loadViteEnv } from 'vite-electron-plugin/plugin';
import * as process from 'node:process';

rmSync('dist-electron', { recursive: true, force: true });

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
        include: ['electron'],
        transformOptions: { sourcemap: !!process.env['VSCODE_DEBUG'] },
        plugins: [
          ...(process.env['VSCODE_DEBUG']
            ? [
                // Will start Electron via VSCode Debug
                customStart(
                  debounce(() =>
                    console.log(
                      /* For `.vscode/.debug.script.mjs` */ '[startup] Electron App',
                    ),
                  ),
                ),
              ]
            : []),
          // Allow use `import.meta.env.VITE_SOME_KEY` in Electron-Main
          loadViteEnv(),
        ],
      }),
      // renderer(),
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

function debounce<Fn extends (...args: never[]) => void>(fn: Fn, delay = 299) {
  let t: NodeJS.Timeout;
  return ((...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  }) as Fn;
}
