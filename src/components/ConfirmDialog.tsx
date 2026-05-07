import { useText } from '@/i18n';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  variant = 'warning',
}: ConfirmDialogProps) {
  const t = useText();

  if (!isOpen) return null;

  const variants = {
    danger: {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
      bg: 'bg-gradient-to-br from-[var(--color-danger)]/20 to-[var(--color-danger-light)]/10',
      iconBg:
        'bg-gradient-to-br from-[var(--color-danger)] to-[var(--color-danger-hover)]',
      text: 'text-[var(--color-danger)]',
      button:
        'bg-gradient-to-r from-[var(--color-danger)] to-[var(--color-danger-hover)]',
    },
    warning: {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      ),
      bg: 'bg-gradient-to-br from-[var(--color-warning)]/20 to-[var(--color-warning-light)]/10',
      iconBg:
        'bg-gradient-to-br from-[var(--color-warning)] to-[var(--color-warning-light)]',
      text: 'text-[var(--color-warning)]',
      button:
        'bg-gradient-to-r from-[var(--color-warning)] to-[var(--color-warning-light)]',
    },
    info: {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
      bg: 'bg-gradient-to-br from-[var(--color-info)]/20 to-[var(--color-info-light)]/10',
      iconBg:
        'bg-gradient-to-br from-[var(--color-info)] to-[var(--color-info-light)]',
      text: 'text-[var(--color-info)]',
      button:
        'bg-gradient-to-r from-[var(--color-info)] to-[var(--color-info-light)]',
    },
  };

  const currentVariant = variants[variant];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-1000 backdrop-blur-md animate-fadeIn p-4">
      <div className="bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-bg-card)] rounded-2xl p-8 w-full max-w-[50vw] min-w-[320px] shadow-[var(--shadow-xl)] animate-scaleIn border border-[var(--color-border)] glass max-h-[90vh] overflow-y-auto">
        <div className="flex items-start gap-5 mb-6">
          <div
            className={`w-16 h-16 ${currentVariant.iconBg} rounded-2xl flex items-center justify-center shadow-[var(--shadow-md)] flex-shrink-0`}
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {currentVariant.icon}
            </svg>
          </div>
          <div className="flex-1">
            <h3 className={`text-2xl font-bold ${currentVariant.text} mb-3`}>
              {title}
            </h3>
            <p className="text-base text-[var(--color-text-muted)] leading-relaxed">
              {message}
            </p>
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3.5 bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-border-hover)] text-[var(--color-text-secondary)] rounded-xl hover:from-[var(--color-border-hover)] hover:to-[var(--color-border-light)] hover:text-white transition-all duration-[var(--transition-normal)] font-medium hover:scale-105"
          >
            {cancelText || t('cancel')}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-6 py-3.5 ${currentVariant.button} text-white rounded-xl hover:shadow-[var(--shadow-glow)] transition-all duration-[var(--transition-normal)] font-medium hover:scale-105`}
          >
            {confirmText || t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
