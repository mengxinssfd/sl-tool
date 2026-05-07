import { create } from 'zustand';
import { useEffect } from 'react';

export interface SaveData {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  note: string;
  backupFileName: string;
  banUpdate: boolean;
}

export interface Game {
  id: string;
  name: string;
  savePath: string;
  backupPath: string;
  gameExecutablePath: string;
  saves: SaveData[];
}

interface GameStore {
  games: Game[];
  selectedGameId: string | null;
  addGame: (
    name: string,
    savePath: string,
    backupPath?: string,
    gameExecutablePath?: string,
  ) => void;
  appendGame: (games: Game[]) => void;
  deleteGame: (id: string) => void;
  updateGame: (
    id: string,
    name: string,
    savePath: string,
    backupPath: string,
    gameExecutablePath: string,
  ) => void;
  selectGame: (id: string | null) => void;
  addSave: (
    gameId: string,
    name: string,
    note?: string,
    banUpdate?: boolean,
  ) => SaveData;
  deleteSave: (gameId: string, saveId: string) => void;
  updateSave: (
    gameId: string,
    saveId: string,
    updates: Partial<SaveData>,
  ) => void;
  loadGames: (games: Game[]) => void;
}

const STORAGE_KEY = 'game-save-manager-data';

const loadFromStorage = (): Game[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (games: Game[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  } catch {
    console.error('Failed to save games to storage');
  }
};

export const useGameStore = create<GameStore>((set) => ({
  games: loadFromStorage(),
  selectedGameId: null,

  addGame: (name, savePath, backupPath = '', gameExecutablePath = '') => {
    const newGame: Game = {
      id: crypto.randomUUID(),
      name,
      savePath,
      backupPath,
      gameExecutablePath,
      saves: [],
    };
    set((state) => {
      const newGames = [...state.games, newGame];
      saveToStorage(newGames);
      return { games: newGames };
    });
  },
  appendGame: (games) => {
    set((state) => {
      const newGames = [...state.games, ...games.map((g) => copyGame(g))];
      saveToStorage(newGames);
      return { games: newGames };
    });
  },
  deleteGame: (id) => {
    set((state) => {
      const newGames = state.games.filter((game) => game.id !== id);
      saveToStorage(newGames);
      return {
        games: newGames,
        selectedGameId:
          state.selectedGameId === id ? null : state.selectedGameId,
      };
    });
  },

  updateGame: (
    id: string,
    name: string,
    savePath: string,
    backupPath: string,
    gameExecutablePath: string,
  ) => {
    set((state) => {
      const newGames = state.games.map((game) =>
        game.id === id
          ? { ...game, name, savePath, backupPath, gameExecutablePath }
          : game,
      );
      saveToStorage(newGames);
      return { games: newGames };
    });
  },

  selectGame: (id) => {
    set({ selectedGameId: id });
  },

  addSave: (gameId, name, note = '', banUpdate = false) => {
    const newSave = createSaveData(name, note, banUpdate);
    set((state) => {
      const newGames = state.games.map((game) =>
        game.id === gameId
          ? { ...game, saves: [...game.saves, newSave] }
          : game,
      );
      saveToStorage(newGames);
      return { games: newGames };
    });
    return newSave;
  },

  deleteSave: (gameId, saveId) => {
    set((state) => {
      const newGames = state.games.map((game) =>
        game.id === gameId
          ? { ...game, saves: game.saves.filter((save) => save.id !== saveId) }
          : game,
      );
      saveToStorage(newGames);
      return { games: newGames };
    });
  },

  updateSave: (gameId, saveId, updates) => {
    set((state) => {
      const newGames = state.games.map((game) =>
        game.id === gameId
          ? {
              ...game,
              saves: game.saves.map((save) =>
                save.id === saveId ? { ...save, ...updates } : save,
              ),
            }
          : game,
      );
      saveToStorage(newGames);
      return { games: newGames };
    });
  },

  loadGames: (games) => {
    set({ games });
    saveToStorage(games);
  },
}));

function copyGame(game: Game): Game {
  return {
    id: game.id,
    name: game.name,
    backupPath: game.backupPath,
    savePath: game.savePath,
    gameExecutablePath: game.gameExecutablePath,
    saves: game.saves.map((save) => copySave(save)),
  };
}
function copySave(save: SaveData): SaveData {
  return {
    id: save.id,
    name: save.name,
    note: save.note,
    backupFileName: save.backupFileName,
    updatedAt: save.updatedAt,
    createdAt: save.createdAt,
    banUpdate: save.banUpdate,
  };
}

function createSaveData(
  name: string,
  note: string,
  banUpdate: boolean,
): SaveData {
  const timestamp = Date.now();
  const id = crypto.randomUUID();
  return {
    id,
    name,
    createdAt: timestamp,
    updatedAt: timestamp,
    note,
    backupFileName: getBackupFileName(name, id),
    banUpdate,
  };
}

export function getUpdatedSaveData(data: SaveData): SaveData {
  return {
    ...data,
    backupFileName: getBackupFileName(data.name, data.id),
  };
}

function getBackupFileName(name: string, id: string): string {
  return `save_${name.trim()}_${id}`;
}

export const useSelectedGame = () => {
  const { games, selectedGameId } = useGameStore();
  return games.find((game) => game.id === selectedGameId) || null;
};

export const useAutoSave = () => {
  const games = useGameStore((state) => state.games);
  useEffect(() => {
    saveToStorage(games);
  }, [games]);
};
