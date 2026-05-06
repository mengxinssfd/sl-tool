import { app, BrowserWindow, dialog, IpcMainEvent } from 'electron';
import path from 'path';

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
  win.webContents.ipc.on(
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
  if (url) {
    win.loadURL(url);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../../dist/index.html'));
  }
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
