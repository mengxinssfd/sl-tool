import { contextBridge, ipcRenderer } from 'electron';

function emit<T>(signal: string, ...args: unknown[]) {
  return new Promise<T>((resolve) => {
    const channel = `${signal}:${Date.now()}`;
    ipcRenderer.once(channel, (_e, result) => {
      resolve(result);
    });
    ipcRenderer.send(signal, channel, ...args);
  });
}

const preload = {
  // 打开指定路径的文件夹
  openFolder: async (path: string[]) => {
    return emit<void | string>(import.meta.env.VITE_SIGNAL_OPEN_FOLDER, path);
  },
  // 打开目录选择弹窗
  openDirectoryDialog: async () => {
    return emit<string | null>(
      import.meta.env.VITE_SIGNAL_OPEN_DIRECTORY_DIALOG,
    );
  },
  // 打开文件选择弹窗
  openFileDialog: async () => {
    return emit<string | null>(import.meta.env.VITE_SIGNAL_OPEN_FILE_DIALOG);
  },
  // 创建存档：从游戏存档位置复制到备份位置
  saveBackup: async (from: string[], to: string[]) => {
    return emit<void | string>(
      import.meta.env.VITE_SIGNAL_SAVE_BACKUP,
      from,
      to,
    );
  },
  // 重命名存档文件夹
  renameBackup: async (from: string[], to: string[]) => {
    return emit<void | string>(
      import.meta.env.VITE_SIGNAL_RENAME_BACKUP,
      from,
      to,
    );
  },
  // 删除存档文件
  deleteSaveFile: async (dirPath: string[]) => {
    return emit<void | string>(
      import.meta.env.VITE_SIGNAL_DELETE_SAVE_FILE,
      dirPath,
    );
  },
  // 启动游戏
  startGame: async (executablePath: string) => {
    return emit<void | string>(
      import.meta.env.VITE_SIGNAL_EXE_FILE,
      executablePath,
    );
  },
  // 迁移备份文件
  migrateBackups: async (
    fromPath: string,
    toPath: string,
    backupFileNames: string[],
  ) => {
    return emit<void | string>(
      import.meta.env.VITE_SIGNAL_MIGRATE_BACKUPS,
      fromPath,
      toPath,
      backupFileNames,
    );
  },
  // 导出配置
  exportConfig: async (configData: string) => {
    return emit<void | string>(
      import.meta.env.VITE_SIGNAL_EXPORT_CONFIG,
      configData,
    );
  },
  // 导入配置
  importConfig: async () => {
    return emit<string | null>(import.meta.env.VITE_SIGNAL_IMPORT_CONFIG);
  },
};
contextBridge.exposeInMainWorld(import.meta.env.VITE_API_KEY, preload);
export type Preload = typeof preload;
