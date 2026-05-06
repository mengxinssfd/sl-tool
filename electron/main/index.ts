import { app, BrowserWindow } from 'electron';
import path from 'path';
import {
  addOpenDirectoryDialogListener,
  addDeleteSaveFileListener,
  addSaveBackupListener,
  addRenameBackupListener,
} from './listeners';

let win: BrowserWindow | null = null;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    title: 'Electron React Template',
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
  addSaveBackupListener(win.webContents.ipc);
  addDeleteSaveFileListener(win.webContents.ipc);
  addRenameBackupListener(win.webContents.ipc);
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
