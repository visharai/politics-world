export interface CricketMatch {
  id: string;
  matchTitle: string;
  team1: string;
  team1Score: string;
  team1Batting: boolean;
  team2: string;
  team2Score: string;
  team2Batting: boolean;
  isLive: boolean;
  statusText: string;
  matchType: string;
  venue?: string;
  matchUrl: string;
  source: string;
}

export interface CricketFeedResponse {
  status: 'ok' | 'error';
  provider?: string;
  feedPubDate?: string;
  updatedAt?: string;
  cached?: boolean;
  matches: CricketMatch[];
  error?: string;
}

const CRICAPI_STORAGE_KEY = 'politics_world_cricapi_key';

class CricketScoreService {
  public getSavedApiKey(): string {
    if (typeof window === 'undefined') return '';
    try {
      return localStorage.getItem(CRICAPI_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  }

  public setSavedApiKey(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      if (key && key.trim().length > 5) {
        localStorage.setItem(CRICAPI_STORAGE_KEY, key.trim());
      } else {
        localStorage.removeItem(CRICAPI_STORAGE_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }

  public async fetchLiveScores(forceRefresh: boolean = false): Promise<CricketFeedResponse> {
    const headers: Record<string, string> = { Accept: 'application/json' };
    const savedKey = this.getSavedApiKey();
    if (savedKey) {
      headers['x-cricapi-key'] = savedKey;
    }

    const url = forceRefresh ? '/api/cricket/live?refresh=1' : '/api/cricket/live';
    const res = await fetch(url, { headers });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data: CricketFeedResponse = await res.json();
    return data;
  }
}

export const cricketScoreService = new CricketScoreService();
