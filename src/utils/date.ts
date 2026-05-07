export interface RelativeTimeOptions {
  daysAgo: string;
  hoursAgo: string;
  minutesAgo: string;
  justNow: string;
}

export function getRelativeTime(
  updatedAt: number,
  options: RelativeTimeOptions,
): string | null {
  const now = Date.now();
  const diff = now - updatedAt;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 30) return null;
  if (days > 0) return options.daysAgo.replace('{{days}}', days.toString());
  if (hours > 0) return options.hoursAgo.replace('{{hours}}', hours.toString());
  if (minutes > 0) {
    return options.minutesAgo.replace('{{minutes}}', minutes.toString());
  }
  return options.justNow;
}
