import { useState } from 'react';
import {
  useGameStore,
  useSelectedGame,
  SaveData,
  getUpdatedSaveData,
} from '../store/useGameStore';
import { useText } from '../i18n';
import { channel } from '@/channel';
import { SaveList } from './SaveList';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ToastType } from '../components/Toast';
import { AddSaveModal } from '../components/AddSaveModal';
import { EditGameModal } from '../components/EditGameModal';

interface SaveDetailProps {
  onToast: (type: ToastType, message: string) => void;
}

export function SaveDetail({ onToast }: SaveDetailProps) {
  const t = useText();
  const selectedGame = useSelectedGame();
  const { addSave, deleteSave, updateSave, updateGame } = useGameStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditGameModal, setShowEditGameModal] = useState(false);
  const [editingSave, setEditingSave] = useState<SaveData | null>(null);
  const [showUpdateConfirmModal, setShowUpdateConfirmModal] = useState(false);
  const [updateTargetSaveId, setUpdateTargetSaveId] = useState<string | null>(
    null,
  );
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteTargetSaveId, setDeleteTargetSaveId] = useState<string | null>(
    null,
  );
  const [showRestoreConfirmModal, setShowRestoreConfirmModal] = useState(false);
  const [restoreTargetSave, setRestoreTargetSave] = useState<SaveData | null>(
    null,
  );

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAddSave = async (
    name: string,
    note: string,
    banUpdate: boolean,
  ) => {
    if (!name.trim() || !selectedGame) return;

    if (!selectedGame.backupPath) {
      onToast('warning', t('backupPathNotSet'));
      return;
    }

    const newSaveData = addSave(selectedGame.id, name, note, banUpdate);

    const reason = await channel.saveBackup(
      [selectedGame.savePath],
      [selectedGame.backupPath, newSaveData.backupFileName],
    );

    if (!reason) {
      onToast('success', t('saveCreated'));
    } else {
      console.error('saveCreateFailed', reason);
      onToast('error', t('saveCreateFailed'));
    }
  };

  const handleDeleteSave = (saveId: string) => {
    setDeleteTargetSaveId(saveId);
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedGame || !deleteTargetSaveId) return;

    const save = selectedGame.saves.find((s) => s.id === deleteTargetSaveId);
    if (!save) {
      setShowDeleteConfirmModal(false);
      setDeleteTargetSaveId(null);
      return;
    }

    let reason: string | void = '';
    if (selectedGame.backupPath && save.backupFileName) {
      reason = await channel.deleteSaveFile([
        selectedGame.backupPath,
        save.backupFileName,
      ]);
    }

    if (!reason) {
      onToast('success', t('saveDeleted'));
    } else {
      console.error('saveDeleteFailed', reason);
      onToast('error', t('saveDeleteFailed'));
    }
    deleteSave(selectedGame.id, deleteTargetSaveId);
    setShowDeleteConfirmModal(false);
    setDeleteTargetSaveId(null);
  };

  const handleSaveEdit = () => {
    if (!editingSave || !selectedGame) return;
    const originSave = selectedGame.saves.find((s) => s.id === editingSave.id);
    if (!originSave) return;
    const newSaveData = getUpdatedSaveData({
      ...originSave,
      name: editingSave.name,
      note: editingSave.note,
      banUpdate: editingSave.banUpdate,
    });
    updateSave(selectedGame.id, editingSave.id, newSaveData);
    setEditingSave(null);
    if (editingSave.name !== originSave.name) {
      channel.renameBackup(
        [selectedGame.backupPath, originSave.backupFileName],
        [selectedGame.backupPath, newSaveData.backupFileName],
      );
    }
  };

  const handleEditGame = async (
    name: string,
    savePath: string,
    backupPath: string,
    executablePath: string,
  ) => {
    if (!selectedGame || !name.trim() || !savePath.trim()) return;

    const oldBackupPath = selectedGame.backupPath;
    const newBackupPath = backupPath;
    const backupFileNames = selectedGame.saves.map(
      (save) => save.backupFileName,
    );

    if (
      oldBackupPath &&
      newBackupPath &&
      oldBackupPath !== newBackupPath &&
      backupFileNames.length > 0
    ) {
      const result = await channel.migrateBackups(
        oldBackupPath,
        newBackupPath,
        backupFileNames,
      );
      if (result) {
        console.error('Failed to migrate backups:', result);
        onToast('error', t('migrateBackupFailed'));
        return;
      }
    }

    updateGame(selectedGame.id, name, savePath, newBackupPath, executablePath);
  };

  const handleStartGame = async () => {
    if (!selectedGame || !selectedGame.gameExecutablePath) {
      onToast('warning', t('gameExecutablePath'));
      return;
    }
    const reason = await channel.startGame(selectedGame.gameExecutablePath);
    if (reason) {
      console.error('Failed to start game:', reason);
      onToast('error', t('startGameFailed'));
    }
  };

  const handleOpenSaveFolder = async () => {
    if (!selectedGame) return;
    const reason = await channel.openFolder([selectedGame.savePath]);
    if (reason) {
      console.error('Failed to open save folder:', reason);
      onToast('error', t('openFolderFailed'));
    }
  };

  const handleOpenBackupFolder = async (save: SaveData) => {
    if (!selectedGame) return;
    if (!selectedGame.backupPath || !save.backupFileName) {
      onToast('warning', t('noBackupFile'));
      return;
    }
    const reason = await channel.openFolder([
      selectedGame.backupPath,
      save.backupFileName,
    ]);
    if (reason) {
      console.error('Failed to open backup folder:', reason);
      onToast('error', t('openFolderFailed'));
    }
  };

  const handleOpenBackupFolderDirectly = async () => {
    if (!selectedGame || !selectedGame.backupPath) return;
    const reason = await channel.openFolder([selectedGame.backupPath]);
    if (reason) {
      console.error('Failed to open backup folder:', reason);
      onToast('error', t('openFolderFailed'));
    }
  };

  const handleUpdateSave = (targetSaveId: string) => {
    if (!selectedGame) return;
    setUpdateTargetSaveId(targetSaveId);
    setShowUpdateConfirmModal(true);
  };

  const handleConfirmUpdate = async () => {
    if (!selectedGame || !updateTargetSaveId) return;

    const targetSave = selectedGame.saves.find(
      (s) => s.id === updateTargetSaveId,
    );
    if (!targetSave) {
      setShowUpdateConfirmModal(false);
      setUpdateTargetSaveId(null);
      return;
    }

    if (!selectedGame.backupPath) {
      onToast('warning', t('backupPathNotSet'));
      setShowUpdateConfirmModal(false);
      setUpdateTargetSaveId(null);
      return;
    }

    const reason = await channel.saveBackup(
      [selectedGame.savePath],
      [selectedGame.backupPath, targetSave.backupFileName],
    );

    if (!reason) {
      updateSave(selectedGame.id, updateTargetSaveId, {
        updatedAt: Date.now(),
      });
      onToast('success', t('saveUpdated'));
    } else {
      console.error('saveUpdateFailed', reason);
      onToast('error', t('saveUpdateFailed'));
    }
    setShowUpdateConfirmModal(false);
    setUpdateTargetSaveId(null);
  };

  const handleRestoreSave = (save: SaveData) => {
    if (!selectedGame) return;

    if (!selectedGame.backupPath || !save.backupFileName) {
      onToast('warning', t('noBackupFile'));
      return;
    }

    setRestoreTargetSave(save);
    setShowRestoreConfirmModal(true);
  };

  const handleConfirmRestore = async () => {
    if (!selectedGame || !restoreTargetSave) return;

    const reason = await channel.saveBackup(
      [selectedGame.backupPath, restoreTargetSave.backupFileName],
      [selectedGame.savePath],
    );

    if (!reason) {
      onToast('success', t('saveRestored'));
    } else {
      console.error('saveRestoreFailed', reason);
      onToast('error', t('saveRestoreFailed'));
    }
    setShowRestoreConfirmModal(false);
    setRestoreTargetSave(null);
  };

  const handleCopySave = async (save: SaveData) => {
    if (!selectedGame) return;

    if (!selectedGame.backupPath || !save.backupFileName) {
      onToast('warning', t('noBackupFile'));
      return;
    }
    const name = `${save.name} (${t('copy')})`;
    const newSaveData = addSave(
      selectedGame.id,
      name,
      save.note,
      save.banUpdate,
    );
    const reason = await channel.saveBackup(
      [selectedGame.backupPath, save.backupFileName],
      [selectedGame.backupPath, newSaveData.backupFileName],
    );

    if (!reason) {
      onToast('success', t('saveCopied'));
    } else {
      console.error('saveCopyFailed', reason);
      onToast('error', t('saveCopyFailed'));
    }
  };

  if (!selectedGame) {
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

  return (
    <div className="h-full flex flex-col bg-[var(--color-bg-primary)]">
      <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 backdrop-blur-sm">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl flex items-center justify-center shadow-[var(--shadow-glow)]">
                  <svg
                    className="w-7 h-7 text-white"
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
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                  {selectedGame.name}
                  <span className="px-3 py-1 bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 text-[var(--color-primary-light)] text-xs font-medium rounded-full">
                    {selectedGame.saves.length} {t('saves')}
                  </span>
                </h2>
                <div className="flex flex-wrap gap-4 mt-2 text-sm">
                  <button
                    onClick={handleOpenSaveFolder}
                    className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary-light)] transition-colors cursor-pointer"
                  >
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="line-clamp-1 max-w-[200px] break-all">
                      {t('savePath')}: {selectedGame.savePath}
                    </span>
                  </button>
                  <button
                    onClick={handleOpenBackupFolderDirectly}
                    disabled={!selectedGame.backupPath}
                    className={`flex items-center gap-2 transition-colors cursor-pointer ${
                      selectedGame.backupPath
                        ? 'text-[var(--color-text-muted)] hover:text-[var(--color-primary-light)]'
                        : 'text-[var(--color-text-muted)] cursor-not-allowed'
                    }`}
                  >
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
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    <span className="line-clamp-1 max-w-[200px] break-all">
                      {t('backupPath')}:{' '}
                      {selectedGame.backupPath || t('notSet')}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-6">
            <button
              onClick={() => setShowEditGameModal(true)}
              className="w-11 h-11 px-3 py-2.5 bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] rounded-xl hover:bg-[var(--color-border-hover)] hover:text-white transition-all duration-[var(--transition-normal)] font-medium flex items-center justify-center border border-transparent hover:border-[var(--color-border)]"
              title={t('edit')}
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            {selectedGame.gameExecutablePath && (
              <button
                onClick={handleStartGame}
                className="w-11 h-11 px-3 py-2.5 bg-gradient-to-r from-[var(--color-success)] to-[var(--color-success-hover)] text-white rounded-xl hover:shadow-[var(--shadow-md)] transition-all duration-[var(--transition-normal)] font-medium flex items-center justify-center"
                title={t('startGame')}
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
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="w-11 h-11 px-3 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-xl hover:shadow-[var(--shadow-glow)] transition-all duration-[var(--transition-normal)] font-medium flex items-center justify-center hover:-translate-y-0.5 active:translate-y-0"
              title={t('newSave')}
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
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="max-w-5xl mx-auto">
          <SaveList
            saves={selectedGame.saves}
            editingSave={editingSave}
            formatDate={formatDate}
            onDelete={handleDeleteSave}
            onSaveEdit={handleSaveEdit}
            onUpdate={handleUpdateSave}
            onRestore={(save) => handleRestoreSave(save)}
            onCopy={(save) => handleCopySave(save)}
            onOpenFolder={(save) => handleOpenBackupFolder(save)}
            onEdit={setEditingSave}
            setEditingSave={setEditingSave}
          />
        </div>
      </div>

      <AddSaveModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onConfirm={handleAddSave}
      />

      <EditGameModal
        isOpen={showEditGameModal}
        onClose={() => setShowEditGameModal(false)}
        game={selectedGame}
        onConfirm={handleEditGame}
      />

      <ConfirmDialog
        isOpen={showUpdateConfirmModal}
        title={t('warning')}
        message={t('overwriteWarning')}
        onConfirm={handleConfirmUpdate}
        onCancel={() => {
          setShowUpdateConfirmModal(false);
          setUpdateTargetSaveId(null);
        }}
        variant="warning"
      />

      <ConfirmDialog
        isOpen={showDeleteConfirmModal}
        title={t('delete')}
        message={t('deleteConfirm')}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteConfirmModal(false);
          setDeleteTargetSaveId(null);
        }}
        variant="danger"
      />

      <ConfirmDialog
        isOpen={showRestoreConfirmModal}
        title={t('restore')}
        message={t('restoreConfirm')}
        onConfirm={handleConfirmRestore}
        onCancel={() => {
          setShowRestoreConfirmModal(false);
          setRestoreTargetSave(null);
        }}
        variant="info"
      />
    </div>
  );
}
