import { useState } from 'react';
import { useText } from '../i18n';
import { Modal } from './Modal';

interface AddSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, note: string, locked: boolean) => void;
}

export function AddSaveModal({
  isOpen,
  onClose,
  onConfirm,
}: AddSaveModalProps) {
  const t = useText();
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [locked, setLocked] = useState(false);

  const handleConfirm = () => {
    if (!name.trim()) return;
    onConfirm(name.trim(), note.trim(), locked);
    setName('');
    setNote('');
    setLocked(false);
    onClose();
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
      title={t('newSave')}
      onClose={onClose}
      confirmText={t('create')}
      cancelText={t('cancel')}
      onConfirm={handleConfirm}
      disabled={!name.trim()}
      icon={icon}
    >
      <div>
        <label className="block text-[var(--color-text-secondary)] text-sm font-medium mb-2">
          {t('saveName')}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('saveName')}
          className="w-full px-4 py-3 bg-[var(--color-bg-card)] text-[var(--color-text-primary)] rounded-xl border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-[var(--transition-fast)]"
          autoFocus
        />
      </div>
      <div>
        <label className="block text-[var(--color-text-secondary)] text-sm font-medium mb-2">
          {t('note')} ({t('cancel')})
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t('notePlaceholder')}
          className="w-full px-4 py-3 bg-[var(--color-bg-card)] text-[var(--color-text-primary)] rounded-xl border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-[var(--transition-fast)] resize-none"
          rows={3}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[var(--color-text-secondary)] text-sm font-medium">
          {t('locked')}
        </span>
        <button
          onClick={() => setLocked(!locked)}
          className={`relative w-12 h-6 rounded-full transition-all duration-[var(--transition-normal)] ${
            locked
              ? 'bg-gradient-to-r from-[var(--color-success)] to-[var(--color-success-hover)]'
              : 'bg-[var(--color-bg-tertiary)]'
          }`}
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-[var(--transition-normal)] ${
              locked ? 'left-7' : 'left-1'
            }`}
          />
        </button>
      </div>
    </Modal>
  );
}
