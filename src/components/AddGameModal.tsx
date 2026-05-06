import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { useText } from '../i18n';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddGameModal({ isOpen, onClose }: AddGameModalProps) {
  const t = useText();
  const { addGame } = useGameStore();
  const [gameName, setGameName] = useState('');
  const [savePath, setSavePath] = useState('');

  const handleSubmit = () => {
    if (!gameName.trim() || !savePath.trim()) return;
    addGame(gameName.trim(), savePath.trim());
    setGameName('');
    setSavePath('');
    onClose();
  };

  const handlePathSelect = () => {
    const path = prompt(t('savePath'));
    if (path) {
      setSavePath(path);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-bold text-white mb-4">{t('addGame')}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">
              {t('saveManager')}
            </label>
            <input
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
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
                value={savePath}
                onChange={(e) => setSavePath(e.target.value)}
                placeholder={t('savePath')}
                className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handlePathSelect}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Browse
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">{t('savePath')}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!gameName.trim() || !savePath.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('addGame')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
