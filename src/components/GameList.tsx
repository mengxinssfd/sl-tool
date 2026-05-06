import { useGameStore } from '../store/useGameStore';
import { useText } from '../i18n';

interface GameListProps {
  onAddGame: () => void;
}

export function GameList({ onAddGame }: GameListProps) {
  const t = useText();
  const { games, selectedGameId, selectGame, deleteGame } = useGameStore();

  const handleDelete = (id: string) => {
    if (confirm(t('deleteGameConfirm'))) {
      deleteGame(id);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-800">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">{t('gameList')}</h2>
        <button
          onClick={onAddGame}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          + {t('addGame')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {games.length === 0 ? (
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>{t('noGames')}</p>
            <p className="text-sm">{t('addGameHint')}</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-700">
            {games.map((game) => (
              <li
                key={game.id}
                className={`p-4 hover:bg-gray-700 transition-colors cursor-pointer group ${
                  selectedGameId === game.id
                    ? 'bg-gray-700 border-l-4 border-blue-500'
                    : ''
                }`}
                onClick={() => selectGame(game.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white">{game.name}</h3>
                    <p className="text-sm text-gray-400 truncate mt-1">
                      {game.savePath}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(game.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all"
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
