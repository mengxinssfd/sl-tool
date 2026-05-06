import { dialog, IpcMainEvent, IpcMain } from 'electron';

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
