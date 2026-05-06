import { useState } from 'react';
import { GameList } from './components/GameList';
import { SaveDetail } from './components/SaveDetail';
import { AddGameModal } from './components/AddGameModal';
import { useText, changeLanguage } from './i18n';

export function App() {
  const t = useText();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
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
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                {t('saveManager')}
              </h1>
              <p className="text-sm text-gray-400">Game Save Manager</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => changeLanguage('en')}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              {t('english')}
            </button>
            <button
              onClick={() => changeLanguage('zh')}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              {t('chinese')}
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 flex-shrink-0 border-r border-gray-700">
          <GameList onAddGame={() => setShowAddModal(true)} />
        </div>
        <div className="flex-1 overflow-hidden">
          <SaveDetail />
        </div>
      </div>

      <AddGameModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}
