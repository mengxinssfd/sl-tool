import { app, BrowserWindow } from 'electron';
import path from 'path';
import {
  addOpenDirectoryDialogListener,
  addOpenFolderListener,
  addDeleteSaveFileListener,
  addSaveBackupListener,
  addRenameBackupListener,
  addOpenFileDialogListener,
  addStartGameListener,
} from './listeners';

let win: BrowserWindow | null = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 680,
    minWidth: 800,
    minHeight: 600,
    title: '单机游戏存档管理工具',
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
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
