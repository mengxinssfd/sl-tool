import { dialog, IpcMainEvent, IpcMain, shell } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

export function addOpenDirectoryDialogListener(ipc: IpcMain) {
  ipc.on(
    import.meta.env.VITE_SIGNAL_OPEN_DIRECTORY_DIALOG,
    async (event: IpcMainEvent, channel: string) => {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
        title: '选择存档目录',
      });
      const path = result.filePaths[0] || null;
      event.reply(channel, path);
    },
  );
}

export function addOpenFileDialogListener(ipc: IpcMain) {
  ipc.on(
    import.meta.env.VITE_SIGNAL_OPEN_FILE_DIALOG,
    async (event: IpcMainEvent, channel: string) => {
      const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        title: '选择游戏执行文件',
        filters: [
          { name: '可执行文件', extensions: ['exe', 'bat', 'cmd'] },
          { name: '所有文件', extensions: ['*'] },
        ],
      });
      const filePath = result.filePaths[0] || null;
      event.reply(channel, filePath);
    },
  );
}

export function addSaveBackupListener(ipc: IpcMain) {
  ipc.on(
    import.meta.env.VITE_SIGNAL_SAVE_BACKUP,
    async (event, channel: string, from: string[], to: string[]) => {
      const fromDirPath = path.join(...from);
      const toDirPath = path.join(...to);
      console.log(fromDirPath, '----', toDirPath);
      try {
        if (!fs.existsSync(fromDirPath)) {
          event.reply(channel, `${fromDirPath} unexist`);
          return;
        }

        const files = fs.readdirSync(fromDirPath);

        if (fs.existsSync(toDirPath)) {
          fs.rmSync(toDirPath, { recursive: true, force: true });
        }
        fs.mkdirSync(toDirPath, { recursive: true });

        for (const file of files) {
          const srcPath = path.join(fromDirPath, file);
          const destPath = path.join(toDirPath, file);

          if (fs.statSync(srcPath).isFile()) {
            fs.copyFileSync(srcPath, destPath);
          } else if (fs.statSync(srcPath).isDirectory()) {
            fs.cpSync(srcPath, destPath, { recursive: true });
          }
        }

        event.reply(channel);
      } catch (error) {
        console.error('Error creating save:', error);
        event.reply(channel, String(error));
      }
    },
  );
}

export function addDeleteSaveFileListener(ipc: IpcMain) {
  ipc.on(
    import.meta.env.VITE_SIGNAL_DELETE_SAVE_FILE,
    async (event, channel, deletePath: string[]) => {
      try {
        const backupDir = path.join(...deletePath);

        if (!fs.existsSync(backupDir)) {
          event.reply(channel, `${backupDir} unexist`);
          return;
        }

        fs.rmSync(backupDir, { recursive: true });
        event.reply(channel);
      } catch (error) {
        console.error('Error deleting save:', error);
        event.reply(channel, String(error));
      }
    },
  );
}

export function addRenameBackupListener(ipc: IpcMain) {
  ipc.on(
    import.meta.env.VITE_SIGNAL_RENAME_BACKUP,
    async (event, channel, from: string[], to: string[]) => {
      try {
        const fromPath = path.join(...from);
        const toPath = path.join(...to);

        if (!fs.existsSync(fromPath)) {
          event.reply(channel, `${fromPath} unexist`);
          return;
        }

        fs.renameSync(fromPath, toPath);
        event.reply(channel);
      } catch (error) {
        console.error('Error rename save:', error);
        event.reply(channel, String(error));
      }
    },
  );
}

export function addOpenFolderListener(ipc: IpcMain) {
  ipc.on(
    import.meta.env.VITE_SIGNAL_OPEN_FOLDER,
    async (event: IpcMainEvent, channel: string, paths: string[]) => {
      const p = path.join(...paths);
      if (!fs.existsSync(p)) {
        event.reply(channel, `${p} unexist`);
        return;
      }
      try {
        await shell.openPath(p);
        event.reply(channel);
      } catch (error) {
        event.reply(channel, (error as Error).message);
      }
    },
  );
}

export function addStartGameListener(ipc: IpcMain) {
  ipc.on(
    import.meta.env.VITE_SIGNAL_EXE_FILE,
    async (event: IpcMainEvent, channel: string, executablePath: string) => {
      if (!fs.existsSync(executablePath)) {
        event.reply(channel, `${executablePath} unexist`);
        return;
      }
      try {
        const cwd = path.dirname(executablePath);
        spawn(executablePath, [], {
          cwd,
          detached: true,
          stdio: 'ignore',
        });
        event.reply(channel);
      } catch (error) {
        event.reply(channel, (error as Error).message);
      }
    },
  );
}

export function addMigrateBackupsListener(ipc: IpcMain) {
  ipc.on(
    import.meta.env.VITE_SIGNAL_MIGRATE_BACKUPS,
    async (
      event,
      channel: string,
      fromPath: string,
      toPath: string,
      backupFileNames: string[],
    ) => {
      try {
        if (!fs.existsSync(fromPath)) {
          event.reply(channel, `${fromPath} unexist`);
          return;
        }

        if (!fs.existsSync(toPath)) {
          fs.mkdirSync(toPath, { recursive: true });
        }

        for (const fileName of backupFileNames) {
          const srcPath = path.join(fromPath, fileName);
          const destPath = path.join(toPath, fileName);

          if (fs.existsSync(srcPath)) {
            fs.renameSync(srcPath, destPath);
          }
        }

        event.reply(channel);
      } catch (error) {
        console.error('Error migrating backups:', error);
        event.reply(channel, String(error));
      }
    },
  );
}

export function addExportConfigListener(ipc: IpcMain) {
  ipc.on(
    import.meta.env.VITE_SIGNAL_EXPORT_CONFIG,
    async (event: IpcMainEvent, channel: string, configData: string) => {
      const result = await dialog.showSaveDialog({
        title: '导出配置文件',
        filters: [
          { name: 'JSON 文件', extensions: ['json'] },
          { name: '所有文件', extensions: ['*'] },
        ],
        defaultPath: `game-save-config-${Date.now()}.json`,
      });

      if (result.canceled) {
        event.reply(channel, null);
        return;
      }

      try {
        fs.writeFileSync(result.filePath!, configData, 'utf-8');
        event.reply(channel, null);
      } catch (error) {
        console.error('Error exporting config:', error);
        event.reply(channel, String(error));
      }
    },
  );
}

export function addImportConfigListener(ipc: IpcMain) {
  ipc.on(
    import.meta.env.VITE_SIGNAL_IMPORT_CONFIG,
    async (event: IpcMainEvent, channel: string) => {
      const result = await dialog.showOpenDialog({
        title: '导入配置文件',
        properties: ['openFile'],
        filters: [
          { name: 'JSON 文件', extensions: ['json'] },
          { name: '所有文件', extensions: ['*'] },
        ],
      });
      if (result.canceled || result.filePaths.length === 0) {
        event.reply(channel, null);
        return;
      }

      try {
        const configData = fs.readFileSync(
          result.filePaths[0] as string,
          'utf-8',
        );
        event.reply(channel, configData);
      } catch (error) {
        console.error('Error importing config:', error);
        event.reply(channel, String(error));
      }
    },
  );
}
