import { contextBridge, ipcRenderer } from 'electron';

const preload = {
  openDirectoryDialog: async () => {
    return new Promise<string | null>((resolve) => {
      const channel = `OpenDirectoryDialog:${Date.now()}`;
      ipcRenderer.once(channel, (_e, result) => {
        resolve(result);
      });
      ipcRenderer.send(
        import.meta.env.VITE_SIGNAL_OPEN_DIRECTORY_DIALOG,
        channel,
      );
    });
  },
};
contextBridge.exposeInMainWorld(import.meta.env.VITE_API_KEY, preload);
export type Preload = typeof preload;
