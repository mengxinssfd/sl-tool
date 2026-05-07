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
  readonly VITE_SIGNAL_MIGRATE_BACKUPS: string;
  readonly VITE_SIGNAL_EXPORT_CONFIG: string;
  readonly VITE_SIGNAL_IMPORT_CONFIG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
