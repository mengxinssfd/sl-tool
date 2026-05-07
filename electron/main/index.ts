import { app, BrowserWindow, Menu } from 'electron';
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

let win: BrowserWindow | null = null;

function createWindow() {
  Menu.setApplicationMenu(null);

  win = new BrowserWindow({
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
    win.loadFile(path.join(__dirname, '../../dist/index.html'));
  }
  addOpenDirectoryDialogListener(win.webContents.ipc);
  addOpenFolderListener(win.webContents.ipc);
  addSaveBackupListener(win.webContents.ipc);
  addDeleteSaveFileListener(win.webContents.ipc);
  addRenameBackupListener(win.webContents.ipc);
  addOpenFileDialogListener(win.webContents.ipc);
  addStartGameListener(win.webContents.ipc);
  addMigrateBackupsListener(win.webContents.ipc);
  addExportConfigListener(win.webContents.ipc);
  addImportConfigListener(win.webContents.ipc);
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.show();
      win.focus();
    }
  });

  app.whenReady().then(createWindow);
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
