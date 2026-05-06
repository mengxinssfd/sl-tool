import { SaveData } from '../store/useGameStore';
import { useText } from '../i18n';

interface SaveListProps {
  saves: SaveData[];
  editingSave: SaveData | null;
  formatDate: (timestamp: number) => string;
  onDelete: (saveId: string) => void;
  onSaveEdit: () => void;
  onUpdate: (saveId: string) => void;
  onRestore: (save: SaveData) => void;
  onCopy: (save: SaveData) => void;
  onOpenFolder: (save: SaveData) => void;
  onEdit: (save: SaveData) => void;
  setEditingSave: (save: SaveData | null) => void;
}

export function SaveList({
  saves,
  editingSave,
  formatDate,
  onDelete,
  onSaveEdit,
  onUpdate,
  onRestore,
  onCopy,
  onOpenFolder,
  onEdit,
  setEditingSave,
}: SaveListProps) {
  const t = useText();

  if (saves.length === 0) {
    return (
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
    );
  }

  return (
    <div className="space-y-4">
      {saves
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
                    onClick={onSaveEdit}
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
                    <h3 className="font-semibold text-white">{save.name}</h3>
                    <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded-full">
                      {save.createdAt === save.updatedAt
                        ? t('new')
                        : t('updatedLabel')}
                    </span>
                  </div>
                  {save.note && (
                    <p className="text-gray-400 text-sm mt-2">{save.note}</p>
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
                    onClick={() => onEdit(save)}
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
                    onClick={() => onCopy(save)}
                    className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20 rounded-lg transition-all"
                    title={t('copy')}
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
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onOpenFolder(save)}
                    className="p-2 text-orange-400 hover:text-orange-300 hover:bg-orange-900/20 rounded-lg transition-all"
                    title={t('openBackupFolder')}
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
                        d="M20 20H4a2 2 0 01-2-2V6a2 2 0 012-2h5.172a1 1 0 01.707.293l5.858 5.857a1 1 0 01.293.707V18a2 2 0 01-2 2z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onUpdate(save.id)}
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
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onRestore(save)}
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
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(save.id)}
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
  );
}
