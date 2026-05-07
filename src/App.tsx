import { useState } from 'react';
import { GameList } from './layout/GameList';
import { SaveDetail } from './layout/SaveDetail';
import {
  AddGameModal,
  ActionMenu,
  Toast,
  ToastType,
  ToastData,
} from '@/components';
import { useText, changeLanguage, getCurrentLanguage } from './i18n';

export function App() {
  const t = useText();
  const [showAddModal, setShowAddModal] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (type: ToastType, message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg-primary)] overflow-hidden">
      <header className="bg-[var(--color-bg-secondary)]/80 z-200 backdrop-blur-xl border-b border-[var(--color-border)] px-6 py-4 shadow-[var(--shadow-lg)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-light)] to-[var(--color-secondary)] rounded-2xl flex items-center justify-center shadow-[var(--shadow-glow-lg)]">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">
                {t('saveManager')}
              </h1>
              <p className="text-sm text-[var(--color-text-muted)]">
                Game Save Manager
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ActionMenu
              items={[
                {
                  icon: (
                    <span className="w-5 h-5 flex items-center justify-center text-xs font-bold">
                      EN
                    </span>
                  ),
                  title: 'English',
                  onClick: () => changeLanguage('en'),
                  className:
                    getCurrentLanguage() === 'en'
                      ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary-light)]'
                      : '',
                },
                {
                  icon: (
                    <span className="w-5 h-5 flex items-center justify-center text-xs font-bold">
                      CN
                    </span>
                  ),
                  title: '中文',
                  onClick: () => changeLanguage('zh'),
                  className:
                    getCurrentLanguage() === 'zh'
                      ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary-light)]'
                      : '',
                },
              ]}
            />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 flex-shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <GameList
            onAddGame={() => setShowAddModal(true)}
            onToast={addToast}
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <SaveDetail onToast={addToast} />
        </div>
      </div>

      <AddGameModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
