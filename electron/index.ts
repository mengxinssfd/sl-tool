import { app, BrowserWindow, IpcMain, Menu } from 'electron';
import path from 'path';
import {
  addOpenDirectoryDialogListener,
  addOpenFolderListener,
  addDeleteSaveFileListener,
  addSaveBackupListener,
  addRenameBackupListener,
  addOpenFileDialogListener,
  addStartGameListener,
  addMigrateBackupsListener,
  addExportConfigListener,
  addImportConfigListener,
} from './listeners';

(function init(): void {
  Menu.setApplicationMenu(null);
  let win: BrowserWindow | null = null;

  if (app.requestSingleInstanceLock()) {
    app.on('second-instance', () => {
      if (win) {
        if (win.isMinimized()) win.restore();
        win.show();
        win.focus();
      }
    });
    app.whenReady().then(createWindow);
  } else {
    app.quit();
  }

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length === 0) {
      createWindow();
    } else {
      allWindows[0]!.show();
      allWindows[0]!.focus();
    }
  });

  function createWindow() {
    win = createMainWindow();
    addListeners(win.webContents.ipc);
  }
})();

function addListeners(ipc: IpcMain): void {
  addOpenDirectoryDialogListener(ipc);
  addOpenFolderListener(ipc);
  addSaveBackupListener(ipc);
  addDeleteSaveFileListener(ipc);
  addRenameBackupListener(ipc);
  addOpenFileDialogListener(ipc);
  addStartGameListener(ipc);
  addMigrateBackupsListener(ipc);
  addExportConfigListener(ipc);
  addImportConfigListener(ipc);
}
function createMainWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1000,
    height: 680,
    minWidth: 800,
    minHeight: 600,
    title: import.meta.env.VITE_APP_TITLE,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  const url = process.env['VITE_DEV_SERVER_URL'];
  if (url) {
    win.loadURL(url);
    win.webContents.openDevTools();
  } else {
    win.loadFile('dist/index.html');
  }
  return win;
}
