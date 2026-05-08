import { SaveData } from '@/store/useGameStore';
import { useText } from '@/i18n';
import { getRelativeTime } from '@/utils/date';
import { ActionMenu } from '@/components/ActionMenu';

interface SaveListItemProps {
  save: SaveData;
  index: number;
  formatDate: (timestamp: number) => string;
  onEdit: (save: SaveData) => void;
  onDelete: (saveId: string) => void;
  onUpdate: (saveId: string) => void;
  onRestore: (save: SaveData) => void;
  onCopy: (save: SaveData) => void;
  onOpenFolder: (save: SaveData) => void;
}

export function SaveListItem({
  save,
  index,
  formatDate,
  onEdit,
  onDelete,
  onUpdate,
  onRestore,
  onCopy,
  onOpenFolder,
}: SaveListItemProps) {
  const t = useText();

  const relativeTime =
    save.updatedAt !== save.createdAt
      ? getRelativeTime(save.updatedAt, {
          daysAgo: t('daysAgo'),
          hoursAgo: t('hoursAgo'),
          minutesAgo: t('minutesAgo'),
          justNow: t('justNow'),
        })
      : null;

  return (
    <div
      key={save.id}
      className="group relative bg-gradient-to-br from-[var(--color-bg-card)] to-[var(--color-bg-secondary)] rounded-2xl p-5 transition-all duration-[var(--transition-normal)] hover:shadow-[var(--shadow-lg)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] animate-slideIn hover-lift cursor-pointer"
      style={{ animationDelay: `${index * 50}ms`, zIndex: 10 - index }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/10 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[var(--color-primary-light)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-text-primary)] text-lg">
                {save.name}
              </h3>
              {relativeTime && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-1 bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]">
                  {relativeTime}
                </span>
              )}
            </div>
          </div>
          {save.note && (
            <p className="text-[var(--color-text-secondary)] text-sm mt-3 pl-13 line-clamp-2">
              {save.note}
            </p>
          )}
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-[var(--color-text-muted)]">
            <span className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {t('created')}: {formatDate(save.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {t('updated')}: {formatDate(save.updatedAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--transition-normal)]">
          <ActionMenu
            items={[
              {
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                ),
                title: t('edit'),
                onClick: () => onEdit(save),
              },
              {
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                ),
                title: t('copy'),
                onClick: () => onCopy(save),
              },
              {
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 20H4a2 2 0 01-2-2V6a2 2 0 012-2h5.172a1 1 0 01.707.293l5.858 5.857a1 1 0 01.293.707V18a2 2 0 01-2 2z"
                    />
                  </svg>
                ),
                title: t('openBackupFolder'),
                onClick: () => onOpenFolder(save),
              },
              ...(!save.locked
                ? [
                    {
                      icon: (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      ),
                      title: t('update'),
                      onClick: () => onUpdate(save.id),
                    },
                  ]
                : []),
              {
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                ),
                title: t('restore'),
                onClick: () => onRestore(save),
              },
              ...(!save.locked
                ? [
                    {
                      icon: (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      ),
                      title: t('delete'),
                      onClick: () => onDelete(save.id),
                    },
                  ]
                : []),
            ]}
          />
        </div>
      </div>
    </div>
  );
}
