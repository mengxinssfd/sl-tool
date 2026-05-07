import { useText } from '@/i18n';

export function UnselectedGame() {
  const t = useText();
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[var(--color-bg-primary)]">
      <div className="text-center animate-fadeIn">
        <div className="relative mb-8">
          <div className="w-28 h-28 bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-bg-card)] rounded-full flex items-center justify-center shadow-[var(--shadow-xl)]">
            <svg
              className="w-14 h-14 text-[var(--color-text-muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[var(--color-bg-card)] rounded-full border border-[var(--color-border)] shadow-[var(--shadow-md)]">
            <span className="text-xs text-[var(--color-text-muted)]">
              {t('selectGame')}
            </span>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-[var(--color-text-secondary)] mb-3">
          {t('selectGame')}
        </h3>
        <p className="text-[var(--color-text-muted)] max-w-[300px] mx-auto">
          {t('selectGameHint')}
        </p>
        <div className="mt-8 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-[var(--color-border)]"></div>
          <span>{t('getStarted')}</span>
          <div className="w-8 h-px bg-gradient-to-l from-transparent to-[var(--color-border)]"></div>
        </div>
      </div>
    </div>
  );
}
