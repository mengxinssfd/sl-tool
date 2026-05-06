import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { useText } from '../i18n';
import { ConfirmDialog } from './ConfirmDialog';
import { ToastType } from './Toast';

interface GameListProps {
  onAddGame: () => void;
  onToast: (type: ToastType, message: string) => void;
}

export function GameList({ onAddGame, onToast }: GameListProps) {
  const t = useText();
  const { games, selectedGameId, selectGame, deleteGame } = useGameStore();
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteTargetGameId, setDeleteTargetGameId] = useState<string | null>(
    null,
  );

  const handleDelete = (id: string) => {
    setDeleteTargetGameId(id);
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetGameId) return;
    deleteGame(deleteTargetGameId);
    onToast('success', t('gameDeleted'));
    setShowDeleteConfirmModal(false);
    setDeleteTargetGameId(null);
  };

  return (
    <div className="h-full flex flex-col bg-[var(--color-bg-secondary)]">
      <div className="p-5 border-b border-[var(--color-border)]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl flex items-center justify-center shadow-[var(--shadow-glow)]">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                {t('gameList')}
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                {games.length} {t('games')}
              </p>
            </div>
          </div>
          <button
            onClick={onAddGame}
            className="w-11 h-11 px-3 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] text-white rounded-xl hover:shadow-[var(--shadow-glow)] transition-all duration-[var(--transition-normal)] text-sm font-medium flex items-center justify-center hover:-translate-y-0.5 active:translate-y-0"
            title={t('addGame')}
          >
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {games.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn">
            <div className="w-24 h-24 bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-card)] rounded-full flex items-center justify-center mb-6 shadow-[var(--shadow-lg)]">
              <svg
                className="w-12 h-12 text-[var(--color-text-muted)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-text-secondary)] mb-2">
              {t('noGames')}
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] max-w-[200px]">
              {t('addGameHint')}
            </p>
            <button
              onClick={onAddGame}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-xl hover:shadow-[var(--shadow-glow)] transition-all duration-[var(--transition-normal)] font-medium flex items-center gap-2"
            >
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {t('addGame')}
            </button>
          </div>
        ) : (
          <ul className="space-y-3">
            {games.map((game, index) => (
              <li
                key={game.id}
                className={`group relative p-4 rounded-2xl cursor-pointer transition-all duration-[var(--transition-normal)] animate-slideIn hover-lift ${
                  selectedGameId === game.id
                    ? 'bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-secondary)]/10 border border-[var(--color-primary)] shadow-[var(--shadow-glow)]'
                    : 'bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:bg-[var(--color-bg-card-hover)] hover:border-[var(--color-border-hover)]'
                }`}
                onClick={() => selectGame(game.id)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {selectedGameId === game.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)] rounded-r-full"></div>
                )}
                <div className="flex justify-between items-start">
                  <div className="flex-1 flex items-start gap-3 pl-1 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-[var(--transition-normal)] ${
                        selectedGameId === game.id
                          ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] shadow-[var(--shadow-glow)]'
                          : 'bg-[var(--color-bg-tertiary)] group-hover:bg-[var(--color-border-hover)]'
                      }`}
                    >
                      <svg
                        className={`w-5 h-5 ${
                          selectedGameId === game.id
                            ? 'text-white'
                            : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <h3
                        className={`font-semibold text-base transition-colors duration-[var(--transition-fast)] truncate ${
                          selectedGameId === game.id
                            ? 'text-white'
                            : 'text-[var(--color-text-primary)] group-hover:text-white'
                        }`}
                      >
                        {game.name}
                      </h3>
                      <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">
                        {game.savePath}
                      </p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-xs px-2 py-0.5 bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] rounded-lg">
                          {game.saves.length} {t('saves')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(game.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2.5 text-[var(--color-danger)] hover:text-white hover:bg-[var(--color-danger)]/20 rounded-xl transition-all duration-[var(--transition-fast)]"
                  >
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirmModal}
        title={t('delete')}
        message={t('deleteGameConfirm')}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteConfirmModal(false);
          setDeleteTargetGameId(null);
        }}
        variant="danger"
      />
    </div>
  );
}
