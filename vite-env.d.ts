/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  readonly VITE_SIGNAL_OPEN_DIRECTORY_DIALOG: string;
  readonly VITE_SIGNAL_SAVE_BACKUP: string;
  readonly VITE_SIGNAL_RENAME_BACKUP: string;
  readonly VITE_SIGNAL_DELETE_SAVE_FILE: string;
  readonly VITE_SIGNAL_OPEN_FILE_DIALOG: string;
  readonly VITE_SIGNAL_EXE_FILE: string;
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
