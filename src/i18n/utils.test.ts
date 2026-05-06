import { renderHook } from '@testing-library/react';
import { initI18n, useText, changeLanguage, getCurrentLanguage } from './index';

beforeAll(() => {
  initI18n();
});

describe('i18n utils', () => {
  it('useText hook returns correct English translation', () => {
    const { result } = renderHook(() => useText());
    const t = result.current;
    expect(t('hello')).toBe('Hello World!');
    expect(t('welcome')).toBe('Welcome');
    expect(t('changeLanguage')).toBe('Change Language');
  });

  it('useText hook returns correct Chinese translation after switching', async () => {
    await changeLanguage('zh');

    const { result } = renderHook(() => useText());
    const t = result.current;
    expect(t('hello')).toBe('你好世界！');
    expect(t('welcome')).toBe('欢迎');

    await changeLanguage('en');
  });

  it('changeLanguage switches to Chinese', async () => {
    await changeLanguage('zh');
    expect(getCurrentLanguage()).toBe('zh');

    const { result } = renderHook(() => useText());
    const t = result.current;
    expect(t('hello')).toBe('你好世界！');
    expect(t('welcome')).toBe('欢迎');
  });

  it('changeLanguage switches back to English', async () => {
    await changeLanguage('zh');

    const { result: resultZh } = renderHook(() => useText());
    expect(resultZh.current('hello')).toBe('你好世界！');

    await changeLanguage('en');
    expect(getCurrentLanguage()).toBe('en');

    const { result: resultEn } = renderHook(() => useText());
    expect(resultEn.current('hello')).toBe('Hello World!');
  });

  it('getCurrentLanguage returns current language', () => {
    expect(getCurrentLanguage()).toBe('en');
  });
});
