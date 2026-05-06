import type { Preload } from '../electron/main/preload';

// declare global {
//   interface Window {
//     electronChannel: Preload;
//   }
// }

export const channel = (window as unknown as Record<string, Preload>)[
  import.meta.env.VITE_API_KEY
] as Preload;
