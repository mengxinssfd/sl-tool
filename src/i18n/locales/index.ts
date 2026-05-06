import { enTranslation } from './en';
import { zhTranslation } from './zh';
import type { TranslationKeys } from '../types';

export const resources = {
  en: {
    translation: enTranslation,
  },
  zh: {
    translation: zhTranslation,
  },
} as const;
export type SupportedLanguage = keyof typeof resources;
export const supportedLanguages: SupportedLanguage[] = ['en', 'zh'];
export type { TranslationKeys };
