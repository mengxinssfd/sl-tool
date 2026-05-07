import { SaveData } from '@/store/useGameStore';
import { useText } from '@/i18n';

interface SaveListItemEditProps {
  save: SaveData;
  index: number;
  onSave: () => void;
  onCancel: () => void;
  onChange: (save: SaveData) => void;
}

export function SaveListItemEdit({
  save,
  index,
  onSave,
  onCancel,
  onChange,
}: SaveListItemEditProps) {
  const t = useText();

  const handleNameChange = (value: string) => {
    onChange({ ...save, name: value });
  };

  const handleNoteChange = (value: string) => {
    onChange({ ...save, note: value });
  };

  const handleBanUpdateChange = () => {
    onChange({ ...save, banUpdate: !save.banUpdate });
  };

  return (
    <div
      key={save.id}
      className="relative bg-gradient-to-br from-[var(--color-bg-card)] to-[var(--color-bg-secondary)] rounded-2xl p-5 transition-all duration-[var(--transition-normal)] shadow-[var(--shadow-lg)] border border-[var(--color-primary)] animate-slideIn"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="space-y-4">
        <input
          type="text"
          value={save.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full px-4 py-3 bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] rounded-xl border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-[var(--transition-fast)]"
          autoFocus
        />
        <textarea
          value={save.note}
          onChange={(e) => handleNoteChange(e.target.value)}
          placeholder={t('notePlaceholder')}
          className="w-full px-4 py-3 bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] rounded-xl border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-[var(--transition-fast)] resize-none"
          rows={2}
        />
        <div className="flex items-center justify-between">
          <span className="text-[var(--color-text-secondary)] text-sm font-medium">
            {t('banUpdate')}
          </span>
          <button
            onClick={handleBanUpdateChange}
            className={`relative w-12 h-6 rounded-full transition-all duration-[var(--transition-normal)] ${
              save.banUpdate
                ? 'bg-gradient-to-r from-[var(--color-success)] to-[var(--color-success-hover)]'
                : 'bg-[var(--color-bg-tertiary)]'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-[var(--transition-normal)] ${
                save.banUpdate ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onSave}
            className="px-5 py-2.5 bg-gradient-to-r from-[var(--color-success)] to-[var(--color-success-hover)] text-white rounded-xl hover:shadow-[var(--shadow-md)] transition-all duration-[var(--transition-normal)] text-sm font-medium"
          >
            {t('save')}
          </button>
          <button
            onClick={onCancel}
            className="px-5 py-2.5 bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] rounded-xl hover:bg-[var(--color-border-hover)] hover:text-white transition-all duration-[var(--transition-normal)] text-sm font-medium"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
