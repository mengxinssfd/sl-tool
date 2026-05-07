import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export function Modal({
  isOpen,
  title,
  onClose,
  children,
  confirmText,
  cancelText,
  onConfirm,
  disabled,
  icon,
  size = 'medium',
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-w-[400px]',
    medium: 'max-w-[50vw]',
    large: 'max-w-[70vw]',
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-md animate-fadeIn p-4">
      <div
        className={`bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-bg-card)] rounded-2xl p-8 w-full min-w-[320px] ${sizeClasses[size]} shadow-[var(--shadow-xl)] animate-scaleIn border border-[var(--color-border)] glass max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl flex items-center justify-center shadow-[var(--shadow-glow)]">
                {icon}
              </div>
            )}
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-[var(--color-bg-tertiary)] rounded-xl transition-all duration-[var(--transition-fast)] hover:scale-105"
          >
            <svg
              className="w-5 h-5 text-[var(--color-text-muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="space-y-5">
          {children}
          {(onConfirm || cancelText) && (
            <div className="flex gap-3 pt-2">
              {cancelText && (
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-border-hover)] text-[var(--color-text-secondary)] rounded-xl hover:from-[var(--color-border-hover)] hover:to-[var(--color-border-light)] hover:text-white transition-all duration-[var(--transition-normal)] font-medium hover:scale-105"
                >
                  {cancelText}
                </button>
              )}
              {onConfirm && confirmText && (
                <button
                  onClick={onConfirm}
                  disabled={disabled}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-light)] to-[var(--color-secondary)] text-white rounded-xl hover:shadow-[var(--shadow-glow-lg)] hover:scale-105 transition-all duration-[var(--transition-normal)] font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    {confirmText}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
