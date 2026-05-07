import { useState } from 'react';
import { SaveData } from '@/store/useGameStore';
import { useText } from '@/i18n';
import { SaveListItem, SaveListItemEdit } from '@/components';

interface SaveListProps {
  saves: SaveData[];
  formatDate: (timestamp: number) => string;
  onDelete: (saveId: string) => void;
  onSaveEdit: (save: SaveData) => void;
  onUpdate: (saveId: string) => void;
  onRestore: (save: SaveData) => void;
  onCopy: (save: SaveData) => void;
  onOpenFolder: (save: SaveData) => void;
}

export function SaveList({
  saves,
  formatDate,
  onDelete,
  onSaveEdit,
  onUpdate,
  onRestore,
  onCopy,
  onOpenFolder,
}: SaveListProps) {
  const t = useText();
  const [editingSave, setEditingSave] = useState<SaveData | null>(null);

  const handleEdit = (save: SaveData) => {
    setEditingSave(save);
  };

  const handleSaveEdit = () => {
    if (editingSave) {
      onSaveEdit(editingSave);
      setEditingSave(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingSave(null);
  };

  const handleChange = (save: SaveData) => {
    setEditingSave(save);
  };

  if (saves.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn">
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-bg-card)] rounded-full flex items-center justify-center shadow-[var(--shadow-lg)]">
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-[var(--color-text-secondary)] mb-2">
          {t('noSaves')}
        </h3>
        <p className="text-sm text-[var(--color-text-muted)]">
          {t('noSavesHint')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {saves
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .map((save, index) => {
          if (editingSave?.id === save.id) {
            return (
              <SaveListItemEdit
                key={save.id}
                save={editingSave}
                index={index}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
                onChange={handleChange}
              />
            );
          }
          return (
            <SaveListItem
              key={save.id}
              save={save}
              index={index}
              formatDate={formatDate}
              onEdit={handleEdit}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onRestore={onRestore}
              onCopy={onCopy}
              onOpenFolder={onOpenFolder}
            />
          );
        })}
    </div>
  );
}
