import { contextBridge, ipcRenderer } from 'electron';
import Signal from './signal';

function _fetch<T>(signal: string, ...args: unknown[]) {
  return new Promise<T>((resolve) => {
    const channel = `${signal}:${Math.random()}`;
    ipcRenderer.once(channel, (_e, result) => resolve(result));
    ipcRenderer.send(signal, channel, ...args);
  });
}

// 暴露给渲染端调用的函数，类似web的api请求
const preload = {
  // 打开指定路径的文件夹
  openFolder: async (path: string[]) => {
    return _fetch<void | string>(Signal.OPEN_FOLDER, path);
  },
  // 打开目录选择弹窗
  openDirectoryDialog: async () => {
    return _fetch<string | null>(Signal.OPEN_DIRECTORY_DIALOG);
  },
  // 打开文件选择弹窗
  openFileDialog: async () => {
    return _fetch<string | null>(Signal.OPEN_FILE_DIALOG);
  },
  // 创建存档：从游戏存档位置复制到备份位置
  saveBackup: async (from: string[], to: string[]) => {
    return _fetch<void | string>(Signal.SAVE_BACKUP, from, to);
  },
  // 重命名存档文件夹
  renameBackup: async (from: string[], to: string[]) => {
    return _fetch<void | string>(Signal.RENAME_BACKUP, from, to);
  },
  // 删除存档文件
  deleteSaveFile: async (dirPath: string[]) => {
    return _fetch<void | string>(Signal.DELETE_SAVE_FILE, dirPath);
  },
  // 启动游戏
  startGame: async (executablePath: string) => {
    return _fetch<void | string>(Signal.EXE_FILE, executablePath);
  },
  // 迁移备份文件
  migrateBackups: async (
    fromPath: string,
    toPath: string,
    backupFileNames: string[],
  ) => {
    return _fetch<void | string>(
      Signal.MIGRATE_BACKUPS,
      fromPath,
      toPath,
      backupFileNames,
    );
  },
  // 导出配置
  exportConfig: async (configData: string) => {
    return _fetch<void | string>(Signal.EXPORT_CONFIG, configData);
  },
  // 导入配置
  importConfig: async () => {
    return _fetch<string | null>(Signal.IMPORT_CONFIG);
  },
};
contextBridge.exposeInMainWorld(import.meta.env.VITE_API_KEY, preload);
export type Preload = typeof preload;
