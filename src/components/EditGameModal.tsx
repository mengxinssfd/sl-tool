import { useState, useEffect } from 'react';
import { useText } from '../i18n';
import { channel } from '@/channel';
import { Modal } from './Modal';
import type { Game } from '../store/useGameStore';

interface EditGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
  onConfirm: (
    name: string,
    savePath: string,
    backupPath: string,
    executablePath: string,
  ) => void;
}

export function EditGameModal({
  isOpen,
  onClose,
  game,
  onConfirm,
}: EditGameModalProps) {
  const t = useText();
  const [name, setName] = useState('');
  const [savePath, setSavePath] = useState('');
  const [backupPath, setBackupPath] = useState('');
  const [executablePath, setExecutablePath] = useState('');

  useEffect(() => {
    if (game) {
      setName(game.name);
      setSavePath(game.savePath);
      setBackupPath(game.backupPath || '');
      setExecutablePath(game.gameExecutablePath || '');
    }
  }, [game, isOpen]);

  const handleConfirm = () => {
    if (!name.trim() || !savePath.trim()) return;
    onConfirm(
      name.trim(),
      savePath.trim(),
      backupPath.trim(),
      executablePath.trim(),
    );
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

  const handleExecutablePathSelect = async () => {
    const filePath = await channel.openFileDialog();
    if (filePath) {
      setExecutablePath(filePath);
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
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );

  return (
    <Modal
      isOpen={isOpen}
      title={`${t('edit')} ${t('saveManager')}`}
      onClose={onClose}
      confirmText={t('save')}
      cancelText={t('cancel')}
      onConfirm={handleConfirm}
      disabled={!name.trim() || !savePath.trim() || !backupPath.trim()}
      icon={icon}
    >
      <div>
        <label className="block text-[var(--color-text-secondary)] text-sm font-medium mb-2">
          {t('saveManager')}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('saveManager')}
          className="w-full px-4 py-3 bg-[var(--color-bg-card)] text-[var(--color-text-primary)] rounded-xl border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-[var(--transition-fast)]"
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
            placeholder={t('savePath')}
            className="flex-1 px-4 py-3 bg-[var(--color-bg-card)] text-[var(--color-text-primary)] rounded-xl border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-[var(--transition-fast)]"
          />
          <button
            onClick={handleSavePathSelect}
            className="px-4 py-3 bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] rounded-xl hover:bg-[var(--color-border-hover)] hover:text-white transition-all duration-[var(--transition-normal)]"
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
            placeholder={t('backupPath')}
            className="flex-1 px-4 py-3 bg-[var(--color-bg-card)] text-[var(--color-text-primary)] rounded-xl border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-[var(--transition-fast)]"
          />
          <button
            onClick={handleBackupPathSelect}
            className="px-4 py-3 bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] rounded-xl hover:bg-[var(--color-border-hover)] hover:text-white transition-all duration-[var(--transition-normal)]"
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
      </div>
      <div>
        <label className="block text-[var(--color-text-secondary)] text-sm font-medium mb-2">
          {t('gameExecutablePath')}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={executablePath}
            onChange={(e) => setExecutablePath(e.target.value)}
            placeholder={t('selectGameExecutablePath')}
            className="flex-1 px-4 py-3 bg-[var(--color-bg-card)] text-[var(--color-text-primary)] rounded-xl border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-[var(--transition-fast)]"
          />
          <button
            onClick={handleExecutablePathSelect}
            className="px-4 py-3 bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] rounded-xl hover:bg-[var(--color-border-hover)] hover:text-white transition-all duration-[var(--transition-normal)]"
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
      </div>
    </Modal>
  );
}
