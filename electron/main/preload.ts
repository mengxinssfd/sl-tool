import { contextBridge, ipcRenderer } from 'electron';
import Signal from '../Signal';

const preload = {
  send: (signal: Signal, ...args: unknown[]) => {
    ipcRenderer.send(signal, ...args);
  },
  on: (signal: Signal, listener: (...args: unknown[]) => void) => {
    ipcRenderer.on(signal, listener);
  },
  once: (signal: Signal, listener: (...args: unknown[]) => void) => {
    ipcRenderer.once(signal, listener);
  },
  removeAllListeners: (signal: Signal) => {
    ipcRenderer.removeAllListeners(signal);
  },
};
contextBridge.exposeInMainWorld(import.meta.env.VITE_API_KEY, preload);
export type Preload = typeof preload;
