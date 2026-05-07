import { describe, it, expect, vi } from 'vitest';
import { getRelativeTime } from './date';

const defaultOptions = {
  daysAgo: '{{days}}天前更新',
  hoursAgo: '{{hours}}小时前更新',
  minutesAgo: '{{minutes}}分钟前更新',
  justNow: '刚刚更新',
};

describe('getRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return null when updatedAt is more than 30 days ago', () => {
    const now = Date.now();
    const thirtyOneDaysAgo = now - 31 * 24 * 60 * 60 * 1000;
    const result = getRelativeTime(thirtyOneDaysAgo, defaultOptions);
    expect(result).toBeNull();
  });

  it('should return days ago when updatedAt is days ago', () => {
    const now = Date.now();
    const fiveDaysAgo = now - 5 * 24 * 60 * 60 * 1000;
    const result = getRelativeTime(fiveDaysAgo, defaultOptions);
    expect(result).toBe('5天前更新');
  });

  it('should return hours ago when updatedAt is hours ago', () => {
    const now = Date.now();
    const threeHoursAgo = now - 3 * 60 * 60 * 1000;
    const result = getRelativeTime(threeHoursAgo, defaultOptions);
    expect(result).toBe('3小时前更新');
  });

  it('should return minutes ago when updatedAt is minutes ago', () => {
    const now = Date.now();
    const twentyMinutesAgo = now - 20 * 60 * 1000;
    const result = getRelativeTime(twentyMinutesAgo, defaultOptions);
    expect(result).toBe('20分钟前更新');
  });

  it('should return justNow when updatedAt is just now', () => {
    const now = Date.now();
    const justNow = now - 30 * 1000;
    const result = getRelativeTime(justNow, defaultOptions);
    expect(result).toBe('刚刚更新');
  });

  it('should work with custom options', () => {
    const customOptions = {
      daysAgo: 'Updated {{days}}d ago',
      hoursAgo: 'Updated {{hours}}h ago',
      minutesAgo: 'Updated {{minutes}}m ago',
      justNow: 'Just updated',
    };
    const now = Date.now();
    const twoDaysAgo = now - 2 * 24 * 60 * 60 * 1000;
    const result = getRelativeTime(twoDaysAgo, customOptions);
    expect(result).toBe('Updated 2d ago');
  });

  it('should handle exactly 30 days ago', () => {
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const result = getRelativeTime(thirtyDaysAgo, defaultOptions);
    expect(result).toBe('30天前更新');
  });

  it('should handle edge case of exactly 1 day', () => {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const result = getRelativeTime(oneDayAgo, defaultOptions);
    expect(result).toBe('1天前更新');
  });

  it('should handle edge case of exactly 1 hour', () => {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    const result = getRelativeTime(oneHourAgo, defaultOptions);
    expect(result).toBe('1小时前更新');
  });

  it('should handle edge case of exactly 1 minute', () => {
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    const result = getRelativeTime(oneMinuteAgo, defaultOptions);
    expect(result).toBe('1分钟前更新');
  });
});
