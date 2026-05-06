import { useState } from 'react';
import { useGameStore, useSelectedGame, SaveData } from '../store/useGameStore';
import { useText } from '../i18n';
import { channel } from '@/channel';
import { SaveList } from './SaveList';

export function SaveDetail() {
  const t = useText();
  const selectedGame = useSelectedGame();
  const { addSave, deleteSave, updateSave, updateGame } = useGameStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditGameModal, setShowEditGameModal] = useState(false);
  const [editingSave, setEditingSave] = useState<SaveData | null>(null);
  const [newSaveName, setNewSaveName] = useState('');
  const [newSaveNote, setNewSaveNote] = useState('');
  const [editGameName, setEditGameName] = useState('');
  const [editGameSavePath, setEditGameSavePath] = useState('');
  const [editGameBackupPath, setEditGameBackupPath] = useState('');
  const [showUpdateConfirmModal, setShowUpdateConfirmModal] = useState(false);
  const [updateTargetSaveId, setUpdateTargetSaveId] = useState<string | null>(
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

  const handleAddSave = async () => {
    if (!newSaveName.trim() || !selectedGame) return;

    if (!selectedGame.backupPath) {
      alert(t('backupPathNotSet'));
      return;
    }

    const backupFileName = getBackupFileName(newSaveName);

    const reason = await channel.saveBackup(
      [selectedGame.savePath],
      [selectedGame.backupPath, backupFileName],
    );

    if (!reason) {
      addSave(
        selectedGame.id,
        newSaveName.trim(),
        newSaveNote.trim(),
        backupFileName,
      );
      setNewSaveName('');
      setNewSaveNote('');
      setShowAddModal(false);
      alert(t('saveCreated'));
    } else {
      console.error('saveCreateFailed', reason);
      alert(t('saveCreateFailed'));
    }
  };

  const handleDeleteSave = async (saveId: string) => {
    if (!selectedGame) return;

    const save = selectedGame.saves.find((s) => s.id === saveId);
    if (!save) return;

    if (!confirm(t('deleteConfirm'))) {
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
      alert(t('saveDeleted'));
    } else {
      console.error('saveDeleteFailed', reason);
      alert(t('saveDeleteFailed'));
    }
    deleteSave(selectedGame.id, saveId);
  };

  const handleSaveEdit = () => {
    if (!editingSave || !selectedGame) return;
    const originSave = selectedGame.saves.find((s) => s.id === editingSave.id);
    if (!originSave) return;
    const newBackupFileName = getBackupFileName(
      editingSave.name,
      editingSave.createdAt,
    );
    updateSave(selectedGame.id, editingSave.id, {
      name: editingSave.name,
      note: editingSave.note,
      backupFileName: newBackupFileName,
    });
    setEditingSave(null);
    if (editingSave.name !== originSave.name) {
      channel.renameBackup(
        [selectedGame.backupPath, originSave.backupFileName],
        [selectedGame.backupPath, newBackupFileName],
      );
    }
  };

  const handleOpenEditGameModal = () => {
    if (!selectedGame) return;
    setEditGameName(selectedGame.name);
    setEditGameSavePath(selectedGame.savePath);
    setEditGameBackupPath(selectedGame.backupPath || '');
    setShowEditGameModal(true);
  };

  const handleEditGame = () => {
    if (!selectedGame || !editGameName.trim() || !editGameSavePath.trim())
      return;
    updateGame(
      selectedGame.id,
      editGameName.trim(),
      editGameSavePath.trim(),
      editGameBackupPath.trim(),
    );
    setShowEditGameModal(false);
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
    if (!targetSave) return;

    if (!selectedGame.backupPath) {
      alert(t('backupPathNotSet'));
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
      setUpdateTargetSaveId(null);
      alert(t('saveUpdated'));
    } else {
      console.error('saveUpdateFailed', reason);
      alert(t('saveUpdateFailed'));
    }
  };

  const handleRestoreSave = async (save: SaveData) => {
    if (!selectedGame) return;

    if (!selectedGame.backupPath || !save.backupFileName) {
      alert(t('noBackupFile'));
      return;
    }

    if (!confirm(t('restoreConfirm'))) {
      return;
    }

    const reason = await channel.saveBackup(
      [selectedGame.backupPath, save.backupFileName],
      [selectedGame.savePath],
    );

    if (!reason) {
      alert(t('saveRestored'));
    } else {
      console.error('saveRestoreFailed', reason);
      alert(t('saveRestoreFailed'));
    }
  };

  const handleCopySave = async (save: SaveData) => {
    if (!selectedGame) return;

    if (!selectedGame.backupPath || !save.backupFileName) {
      alert(t('noBackupFile'));
      return;
    }
    const name = `${save.name} (${t('copy')})`;
    const newBackupFileName = getBackupFileName(name);

    const reason = await channel.saveBackup(
      [selectedGame.backupPath, save.backupFileName],
      [selectedGame.backupPath, newBackupFileName],
    );

    if (!reason) {
      addSave(selectedGame.id, name, save.note, newBackupFileName);
      alert(t('saveCopied'));
    } else {
      console.error('saveCopyFailed', reason);
      alert(t('saveCopyFailed'));
    }
  };

  function getBackupFileName(
    backupName: string,
    timestamp = Date.now(),
  ): string {
    return `save_${backupName.trim()}_${timestamp}`;
  }

  if (!selectedGame) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-900 text-gray-500">
        <svg
          className="w-24 h-24 mb-6"
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
        <h3 className="text-xl font-semibold mb-2">{t('selectGame')}</h3>
        <p>{t('selectGameHint')}</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="p-6 border-b border-gray-700">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {selectedGame.name}
            </h2>
            <p className="text-gray-400 mt-1">
              {t('savePath')}: {selectedGame.savePath}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleOpenEditGameModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
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
              {t('edit')}
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
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
              {t('newSave')}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <SaveList
          saves={selectedGame.saves}
          editingSave={editingSave}
          formatDate={formatDate}
          onDelete={handleDeleteSave}
          onSaveEdit={handleSaveEdit}
          onUpdate={handleUpdateSave}
          onRestore={(save) => handleRestoreSave(save)}
          onCopy={(save) => handleCopySave(save)}
          onEdit={setEditingSave}
          setEditingSave={setEditingSave}
        />
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">
              {t('newSave')}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  {t('saveName')}
                </label>
                <input
                  type="text"
                  value={newSaveName}
                  onChange={(e) => setNewSaveName(e.target.value)}
                  placeholder={t('saveName')}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  {t('note')} ({t('cancel')})
                </label>
                <textarea
                  value={newSaveNote}
                  onChange={(e) => setNewSaveNote(e.target.value)}
                  placeholder={t('notePlaceholder')}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 resize-none"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleAddSave}
                  disabled={!newSaveName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('create')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditGameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">
              {t('edit')} {t('saveManager')}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  {t('saveManager')}
                </label>
                <input
                  type="text"
                  value={editGameName}
                  onChange={(e) => setEditGameName(e.target.value)}
                  placeholder={t('saveManager')}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  {t('savePath')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editGameSavePath}
                    onChange={(e) => setEditGameSavePath(e.target.value)}
                    placeholder={t('savePath')}
                    className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={async () => {
                      const path = await channel.openDirectoryDialog();
                      if (path) {
                        setEditGameSavePath(path);
                      }
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Browse
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  {t('backupPath')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editGameBackupPath}
                    onChange={(e) => setEditGameBackupPath(e.target.value)}
                    placeholder={t('backupPath')}
                    className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={async () => {
                      const path = await channel.openDirectoryDialog();
                      if (path) {
                        setEditGameBackupPath(path);
                      }
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Browse
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditGameModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleEditGame}
                  disabled={
                    !editGameName.trim() ||
                    !editGameSavePath.trim() ||
                    !editGameBackupPath.trim()
                  }
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUpdateConfirmModal && selectedGame && updateTargetSaveId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-red-400 mb-4">
              {t('warning')}
            </h3>
            <p className="text-gray-300 mb-6">{t('overwriteWarning')}</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowUpdateConfirmModal(false);
                  setUpdateTargetSaveId(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => {
                  setShowUpdateConfirmModal(false);
                  handleConfirmUpdate();
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {t('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
