import { dialog, IpcMainEvent, IpcMain, shell } from 'electron';
import fs from 'node:fs';
import path from 'node:path';

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
    import.meta.env['VITE_SIGNAL_OPEN_FOLDER'],
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
