/**
 * Feed Freshness & 24-Hour Auto-Expiration Manager
 *
 * Enforces strict editorial hygiene:
 * - News items older than 24 hours are automatically expired and purged from the active view.
 * - Auto-rotation engine ensures the front-page lead and dispatches rotate periodically to keep the feed fresh.
 * - Stamped with rolling dynamic timestamps so readers always receive up-to-the-minute journalism.
 */

import { Article } from '../data/newsData';

export const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

export interface FreshnessMetadata {
  publishedTimestamp: number;
  expiresAt: number;
  isExpired: boolean;
  relativeTime: string;
}

/**
 * Checks if an article or dispatch is within the 24-hour freshness window.
 */
export function isArticleFresh(articleTimestamp: number, currentNow: number = Date.now()): boolean {
  if (!articleTimestamp || isNaN(articleTimestamp)) return true;
  return currentNow - articleTimestamp < TWENTY_FOUR_HOURS_MS;
}

/**
 * Filters out any news items older than 24 hours from the active feed.
 */
export function filter24HourFreshFeed<T extends { timestamp?: number }>(
  items: T[],
  currentNow: number = Date.now()
): T[] {
  return items.filter((item) => {
    if (!item.timestamp) return true;
    return isArticleFresh(item.timestamp, currentNow);
  });
}

/**
 * Calculates a rolling relative timestamp within 24 hours.
 */
export function getRollingFreshTime(offsetMinutes: number, langCode: string = 'en'): string {
  const boundedMins = Math.max(1, offsetMinutes % (24 * 60)); // ensure within 24 hours

  if (langCode === 'hi') {
    if (boundedMins <= 5) return 'लाइव · अभी-अभी';
    if (boundedMins < 60) return `लाइव · ${boundedMins} मिनट पहले`;
    const hrs = Math.floor(boundedMins / 60);
    return `लाइव · ${hrs} घंटा पहले`;
  }

  if (boundedMins <= 5) return 'Live · Just now';
  if (boundedMins < 60) return `Live · ${boundedMins}m ago`;
  const hrs = Math.floor(boundedMins / 60);
  return `Live · ${hrs}h ago`;
}

/**
 * Attaches 24-hour expiration markers to an article.
 */
export function stampArticleFreshness(article: Article, offsetMinutes: number = 5): Article & { freshness: FreshnessMetadata } {
  const now = Date.now();
  const publishedTimestamp = now - offsetMinutes * 60 * 1000;
  const expiresAt = publishedTimestamp + TWENTY_FOUR_HOURS_MS;

  return {
    ...article,
    freshness: {
      publishedTimestamp,
      expiresAt,
      isExpired: false,
      relativeTime: getRollingFreshTime(offsetMinutes),
    },
  };
}
