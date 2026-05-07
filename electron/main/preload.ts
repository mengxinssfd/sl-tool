import { contextBridge, ipcRenderer } from 'electron';

const preload = {
  // 打开指定路径的文件夹
  openFolder: async (path: string[]) => {
    return new Promise<void | string>((resolve) => {
      const channel = `OpenFolder:${Date.now()}`;
      ipcRenderer.once(channel, (_e, result) => {
        resolve(result);
      });
      ipcRenderer.send(
        import.meta.env['VITE_SIGNAL_OPEN_FOLDER'],
        channel,
        path,
      );
    });
  },
  // 打开目录选择弹窗
  openDirectoryDialog: async () => {
    return new Promise<string | null>((resolve) => {
      const channel = `OpenDirectoryDialog:${Date.now()}`;
      ipcRenderer.once(channel, (_e, result) => {
        resolve(result);
      });
      ipcRenderer.send(
        import.meta.env.VITE_SIGNAL_OPEN_DIRECTORY_DIALOG,
        channel,
      );
    });
  },
  // 打开文件选择弹窗
  openFileDialog: async () => {
    return new Promise<string | null>((resolve) => {
      const channel = `OpenFileDialog:${Date.now()}`;
      ipcRenderer.once(channel, (_e, result) => {
        resolve(result);
      });
      ipcRenderer.send(import.meta.env.VITE_SIGNAL_OPEN_FILE_DIALOG, channel);
    });
  },
  // 创建存档：从游戏存档位置复制到备份位置
  saveBackup: async (from: string[], to: string[]) => {
    return new Promise<void | string>((resolve) => {
      const channel = `CreateSave:${Date.now()}`;
      ipcRenderer.once(channel, (_e, result) => {
        resolve(result);
      });
      ipcRenderer.send(
        import.meta.env.VITE_SIGNAL_SAVE_BACKUP,
        channel,
        from,
        to,
      );
    });
  },
  // 重命名存档文件夹
  renameBackup: async (from: string[], to: string[]) => {
    return new Promise<void | string>((resolve) => {
      const channel = `CreateSave:${Date.now()}`;
      ipcRenderer.once(channel, (_e, result) => {
        resolve(result);
      });
      ipcRenderer.send(
        import.meta.env.VITE_SIGNAL_RENAME_BACKUP,
        channel,
        from,
        to,
      );
    });
  },
  // 删除存档文件
  deleteSaveFile: async (dirPath: string[]) => {
    return new Promise<void | string>((resolve) => {
      const channel = `DeleteSaveFile:${Date.now()}`;
      ipcRenderer.once(channel, (_e, result) => {
        resolve(result);
      });
      ipcRenderer.send(
        import.meta.env.VITE_SIGNAL_DELETE_SAVE_FILE,
        channel,
        dirPath,
      );
    });
  },
  // 启动游戏
  startGame: async (executablePath: string) => {
    return new Promise<void | string>((resolve) => {
      const channel = `StartGame:${Date.now()}`;
      ipcRenderer.once(channel, (_e, result) => {
        resolve(result);
      });
      ipcRenderer.send(
        import.meta.env.VITE_SIGNAL_EXE_FILE,
        channel,
        executablePath,
      );
    });
  },
  // 迁移备份文件
  migrateBackups: async (
    fromPath: string,
    toPath: string,
    backupFileNames: string[],
  ) => {
    return new Promise<void | string>((resolve) => {
      const channel = `MigrateBackups:${Date.now()}`;
      ipcRenderer.once(channel, (_e, result) => {
        resolve(result);
      });
      ipcRenderer.send(
        import.meta.env.VITE_SIGNAL_MIGRATE_BACKUPS,
        channel,
        fromPath,
        toPath,
        backupFileNames,
      );
    });
  },
};
contextBridge.exposeInMainWorld(import.meta.env.VITE_API_KEY, preload);
export type Preload = typeof preload;
