import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier/recommended';

export default defineConfig(
  // ignores 必须放最前面
  {
    ignores: [
      '*.sh',
      'node_modules',
      '*.md',
      '*.woff',
      '*.ttf',
      '.vscode',
      '.idea',
      'dist',
      '/public',
      '.husky',
      '.local',
      '/bin',
      '.eslintrc.js',
      'prettier.config.js',
      '/src/mock/*',
      'coverage',
      '.github',
      'pnpm-lock.yaml',
      '.output',
      '*.d.ts',
      'temp',
      '.prettierrc.js',
      'dist-electron',
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  prettier,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
    },
  },
);
