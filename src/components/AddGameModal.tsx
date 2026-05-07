import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { useText } from '../i18n';
import { channel } from '@/channel';
import { Modal } from './Modal';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddGameModal({ isOpen, onClose }: AddGameModalProps) {
  const t = useText();
  const { addGame } = useGameStore();
  const [gameName, setGameName] = useState('');
  const [savePath, setSavePath] = useState('');
  const [backupPath, setBackupPath] = useState('');
  const [gameExecutablePath, setGameExecutablePath] = useState('');

  const handleSubmit = () => {
    if (!gameName.trim() || !savePath.trim()) return;
    addGame(
      gameName.trim(),
      savePath.trim(),
      backupPath.trim(),
      gameExecutablePath.trim(),
    );
    setGameName('');
    setSavePath('');
    setBackupPath('');
    setGameExecutablePath('');
    onClose();
  };

  const handleSavePathSelect = async () => {
    const path = await channel.openDirectoryDialog();
    if (path) {
      setSavePath(path);
    }
  };

  const handleBackupPathSelect = async () => {
    const path = await channel.openDirectoryDialog();
    if (path) {
      setBackupPath(path);
    }
  };

  const handleGameExecutablePathSelect = async () => {
    const filePath = await channel.openFileDialog();
    if (filePath) {
      setGameExecutablePath(filePath);
    }
  };

  const icon = (
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
        d="M12 4v16m8-8H4"
      />
    </svg>
  );

  return (
    <Modal
      isOpen={isOpen}
      title={t('addGame')}
      onClose={onClose}
      confirmText={t('addGame')}
      cancelText={t('cancel')}
      onConfirm={handleSubmit}
      disabled={!gameName.trim() || !savePath.trim() || !backupPath.trim()}
      icon={icon}
    >
      <div>
        <label className="block text-[var(--color-text-secondary)] text-sm font-medium mb-2">
          {t('gameName')}
        </label>
        <input
          type="text"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          placeholder={t('enterGameName')}
          className="w-full px-4 py-3 bg-[var(--color-bg-card)]/80 text-[var(--color-text-primary)] rounded-xl border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:shadow-[var(--shadow-glow)] transition-all duration-[var(--transition-fast)]"
          autoFocus
        />
      </div>
      <div>
        <label className="block text-[var(--color-text-secondary)] text-sm font-medium mb-2">
          {t('savePath')}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={savePath}
            onChange={(e) => setSavePath(e.target.value)}
            placeholder={t('selectSavePath')}
            className="flex-1 px-4 py-3 bg-[var(--color-bg-card)]/80 text-[var(--color-text-primary)] rounded-xl border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:shadow-[var(--shadow-glow)] transition-all duration-[var(--transition-fast)]"
          />
          <button
            onClick={handleSavePathSelect}
            className="px-4 py-3 bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-border-hover)] text-[var(--color-text-secondary)] rounded-xl hover:from-[var(--color-border-hover)] hover:to-[var(--color-border-light)] hover:text-white transition-all duration-[var(--transition-normal)] hover:scale-105"
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </button>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-2 flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {t('savePathDescription')}
        </p>
      </div>
      <div>
        <label className="block text-[var(--color-text-secondary)] text-sm font-medium mb-2">
          {t('backupPath')}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={backupPath}
            onChange={(e) => setBackupPath(e.target.value)}
            placeholder={t('selectBackupPath')}
            className="flex-1 px-4 py-3 bg-[var(--color-bg-card)]/80 text-[var(--color-text-primary)] rounded-xl border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:shadow-[var(--shadow-glow)] transition-all duration-[var(--transition-fast)]"
          />
          <button
            onClick={handleBackupPathSelect}
            className="px-4 py-3 bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-border-hover)] text-[var(--color-text-secondary)] rounded-xl hover:from-[var(--color-border-hover)] hover:to-[var(--color-border-light)] hover:text-white transition-all duration-[var(--transition-normal)] hover:scale-105"
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </button>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-2 flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          {t('backupPathDescription')}
        </p>
      </div>
      <div>
        <label className="block text-[var(--color-text-secondary)] text-sm font-medium mb-2">
          {t('gameExecutablePath')}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={gameExecutablePath}
            onChange={(e) => setGameExecutablePath(e.target.value)}
            placeholder={t('selectGameExecutablePath')}
            className="flex-1 px-4 py-3 bg-[var(--color-bg-card)]/80 text-[var(--color-text-primary)] rounded-xl border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:shadow-[var(--shadow-glow)] transition-all duration-[var(--transition-fast)]"
          />
          <button
            onClick={handleGameExecutablePathSelect}
            className="px-4 py-3 bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-border-hover)] text-[var(--color-text-secondary)] rounded-xl hover:from-[var(--color-border-hover)] hover:to-[var(--color-border-light)] hover:text-white transition-all duration-[var(--transition-normal)] hover:scale-105"
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
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </button>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-2 flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          {t('gameExecutablePathDescription')}
        </p>
      </div>
    </Modal>
  );
}
