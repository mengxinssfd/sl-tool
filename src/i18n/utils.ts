import i18n from 'i18next';
import type { TranslationKeys } from './types';
import { useTranslation } from 'react-i18next';
import type { SupportedLanguage } from './locales';

export function changeLanguage(lng: SupportedLanguage): Promise<unknown> {
  return i18n.changeLanguage(lng);
}

export function getCurrentLanguage(): SupportedLanguage {
  return i18n.language as SupportedLanguage;
}

export function useText() {
  const { t } = useTranslation();
  return <T extends keyof TranslationKeys>(key: T): TranslationKeys[T] =>
    t(key);
}
