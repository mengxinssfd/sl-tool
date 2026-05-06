import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toasts: ToastData[];
  removeToast: (id: string) => void;
}

export function Toast({ toasts, removeToast }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: ToastData;
  onRemove: (id: string) => void;
}) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const colors = {
    success: {
      bg: 'bg-gradient-to-r from-[var(--color-success)]/20 to-[var(--color-success-light)]/10',
      border: 'border-[var(--color-success)]/50',
      icon: 'text-[var(--color-success)]',
    },
    error: {
      bg: 'bg-gradient-to-r from-[var(--color-danger)]/20 to-[var(--color-danger-light)]/10',
      border: 'border-[var(--color-danger)]/50',
      icon: 'text-[var(--color-danger)]',
    },
    warning: {
      bg: 'bg-gradient-to-r from-[var(--color-warning)]/20 to-[var(--color-warning-light)]/10',
      border: 'border-[var(--color-warning)]/50',
      icon: 'text-[var(--color-warning)]',
    },
    info: {
      bg: 'bg-gradient-to-r from-[var(--color-info)]/20 to-[var(--color-info-light)]/10',
      border: 'border-[var(--color-info)]/50',
      icon: 'text-[var(--color-info)]',
    },
  };

  const currentColors = colors[toast.type];

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-[var(--shadow-lg)] backdrop-blur-md animate-slideInRight ${currentColors.bg} ${currentColors.border} ${
        isExiting ? 'animate-slideOutRight' : ''
      }`}
    >
      <div
        className={`w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center ${currentColors.icon}`}
      >
        {toast.type === 'success' && (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        {toast.type === 'error' && (
          <svg
            className="w-5 h-5"
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
        )}
        {toast.type === 'warning' && (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        )}
        {toast.type === 'info' && (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
      </div>
      <span className="text-sm font-medium text-white">{toast.message}</span>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onRemove(toast.id), 300);
        }}
        className="ml-2 p-1 hover:bg-white/10 rounded-lg transition-colors"
      >
        <svg
          className="w-4 h-4 text-white/70"
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
  );
}
