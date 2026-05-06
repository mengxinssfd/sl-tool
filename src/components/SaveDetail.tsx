import { useState } from 'react';
import { useGameStore, useSelectedGame, SaveData } from '../store/useGameStore';
import { useText } from '../i18n';

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

  const handleAddSave = () => {
    if (!newSaveName.trim() || !selectedGame) return;
    addSave(selectedGame.id, newSaveName.trim(), newSaveNote.trim());
    setNewSaveName('');
    setNewSaveNote('');
    setShowAddModal(false);
  };

  const handleDeleteSave = (saveId: string) => {
    if (!selectedGame) return;
    if (confirm(t('delete'))) {
      deleteSave(selectedGame.id, saveId);
    }
  };

  const handleSaveEdit = () => {
    if (!editingSave || !selectedGame) return;
    updateSave(selectedGame.id, editingSave.id, {
      name: editingSave.name,
      note: editingSave.note,
    });
    setEditingSave(null);
  };

  const handleOpenEditGameModal = () => {
    if (!selectedGame) return;
    setEditGameName(selectedGame.name);
    setEditGameSavePath(selectedGame.savePath);
    setShowEditGameModal(true);
  };

  const handleEditGame = () => {
    if (!selectedGame || !editGameName.trim() || !editGameSavePath.trim())
      return;
    updateGame(selectedGame.id, editGameName.trim(), editGameSavePath.trim());
    setShowEditGameModal(false);
  };

  const handleUpdateSave = (targetSaveId: string) => {
    if (!selectedGame) return;
    const otherSaves = selectedGame.saves.filter((s) => s.id !== targetSaveId);
    if (otherSaves.length === 0) {
      alert(t('noOtherSaves'));
      return;
    }

    const sourceSaveNames = otherSaves.map(
      (s) => `${s.name} (${formatDate(s.updatedAt)})`,
    );
    const selectedIndex = prompt(
      `${t('selectSourceSave')}:\n${sourceSaveNames.map((name, i) => `${i + 1}. ${name}`).join('\n')}`,
    );

    if (selectedIndex !== null && selectedIndex !== '') {
      const index = parseInt(selectedIndex) - 1;
      if (index >= 0 && index < otherSaves.length) {
        const sourceSave = otherSaves[index]!;
        updateSave(selectedGame.id, targetSaveId, {
          name: sourceSave.name,
          note: sourceSave.note,
          updatedAt: Date.now(),
        });
        alert(`${t('updatedFrom')} "${sourceSave.name}"`);
      }
    }
  };

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
        {selectedGame.saves.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg
              className="w-16 h-16 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <p>{t('noSaves')}</p>
            <p className="text-sm">{t('noSavesHint')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedGame.saves
              .sort((a, b) => b.updatedAt - a.updatedAt)
              .map((save) => (
                <div
                  key={save.id}
                  className="bg-gray-800 p-4 transition-all duration-200 hover:bg-gray-700 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/30 border border-transparent"
                >
                  {editingSave?.id === save.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editingSave.name}
                        onChange={(e) =>
                          setEditingSave({
                            ...editingSave,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                      />
                      <textarea
                        value={editingSave.note}
                        onChange={(e) =>
                          setEditingSave({
                            ...editingSave,
                            note: e.target.value,
                          })
                        }
                        placeholder={t('notePlaceholder')}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 resize-none"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          {t('save')}
                        </button>
                        <button
                          onClick={() => setEditingSave(null)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                        >
                          {t('cancel')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-white">
                            {save.name}
                          </h3>
                          <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded-full">
                            {save.createdAt === save.updatedAt
                              ? t('new')
                              : t('updatedLabel')}
                          </span>
                        </div>
                        {save.note && (
                          <p className="text-gray-400 text-sm mt-2">
                            {save.note}
                          </p>
                        )}
                        <div className="flex gap-6 mt-3 text-xs text-gray-500">
                          <span>
                            {t('created')}: {formatDate(save.createdAt)}
                          </span>
                          <span>
                            {t('updated')}: {formatDate(save.updatedAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingSave(save)}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-lg transition-all"
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
                        <button
                          onClick={() => handleUpdateSave(save.id)}
                          className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/20 rounded-lg transition-all"
                          title={t('update')}
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
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => alert(`${t('restore')}: ${save.name}`)}
                          className="p-2 text-green-400 hover:text-green-300 hover:bg-green-900/20 rounded-lg transition-all"
                          title={t('restore')}
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
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteSave(save.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all"
                          title={t('delete')}
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
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
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
                    onClick={() => {
                      const path = prompt(t('savePath'));
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
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditGameModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleEditGame}
                  disabled={!editGameName.trim() || !editGameSavePath.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
