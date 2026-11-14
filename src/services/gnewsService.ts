/**
 * =======================================================================
 * GNEWS.IO LIVE API INTEGRATION SERVICE
 * =======================================================================
 * Connects directly to GNews.io (v4) REST API to fetch real-time breaking news.
 * 
 * HOW TO ADD YOUR API KEY:
 * Option 1 (Recommended): Add to your .env file:
 *   GNEWS_API_KEY="your_api_key_here"
 *   or
 *   VITE_GNEWS_API_KEY="your_api_key_here"
 * 
 * Option 2: Replace the placeholder constant below:
 */
export const GNEWS_API_KEY_PLACEHOLDER: string = 'YOUR_GNEWS_API_KEY_HERE';

import { LiveWireItem } from './liveNewsService';
import { Article } from '../data/newsData';
import { PodcastEpisode, TranscriptSegment } from '../data/podcastData';

export interface GNewsSource {
  name: string;
  url: string;
}

export interface GNewsRawArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: GNewsSource;
}

export interface GNewsApiResponse {
  totalArticles?: number;
  articles?: GNewsRawArticle[];
  errors?: string[];
  message?: string;
  status?: string;
  configured?: boolean;
}

interface CacheEntry {
  timestamp: number;
  items: LiveWireItem[];
}

class GNewsService {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly CACHE_TTL_MS = 60 * 1000; // 60-second cache for real-time updates without 12-hour delay
  private lastFetchError: string | null = null;
  private isConfiguredState: boolean = false;

  constructor() {
    this.checkServerStatus();
  }

  /**
   * Proactively checks backend proxy /api/gnews/status to detect server-side API key configuration
   */
  public async checkServerStatus(): Promise<boolean> {
    try {
      const res = await fetch('/api/gnews/status');
      if (res.ok) {
        const data = await res.json();
        if (data.configured) {
          this.isConfiguredState = true;
          return true;
        }
      }
    } catch {
      // proxy might be booting
    }
    return this.isConfiguredState;
  }

  /**
   * Resolves the active GNews API key from localStorage, environment variables, or fallback placeholder
   */
  public getApiKey(): string {
    // 1. Check browser localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('politics_world_gnews_api_key');
        if (stored && stored.trim().length > 5 && !stored.includes('YOUR_')) {
          return stored.trim();
        }
      } catch {
        // ignore storage errors
      }
    }

    // 2. Check Vite env variables
    const envKey = (import.meta as any).env?.VITE_GNEWS_API_KEY || (import.meta as any).env?.GNEWS_API_KEY || '';
    if (envKey && envKey.trim() !== '' && !envKey.includes('YOUR_')) {
      return envKey.trim();
    }

    // 3. Fallback placeholder
    if (
      GNEWS_API_KEY_PLACEHOLDER &&
      GNEWS_API_KEY_PLACEHOLDER.trim() !== '' &&
      !GNEWS_API_KEY_PLACEHOLDER.includes('YOUR_')
    ) {
      return GNEWS_API_KEY_PLACEHOLDER.trim();
    }

    return '';
  }

  /**
   * Sets or clears the user GNews API key in localStorage
   */
  public setApiKey(key: string): void {
    if (typeof window !== 'undefined') {
      try {
        if (key && key.trim().length > 5) {
          localStorage.setItem('politics_world_gnews_api_key', key.trim());
          this.isConfiguredState = true;
          this.lastFetchError = null;
        } else {
          localStorage.removeItem('politics_world_gnews_api_key');
          this.isConfiguredState = false;
        }
      } catch {
        // ignore storage errors
      }
      this.cache.clear();
    }
  }

  /**
   * Checks whether a valid GNews API key is configured either on server, client, or storage
   */
  public isConfigured(): boolean {
    if (this.isConfiguredState) return true;
    const key = this.getApiKey();
    return Boolean(key && key.length > 5);
  }

  /**
   * Returns current status information for display in the UI
   */
  public getStatus(): { configured: boolean; lastError: string | null; keyMasked: string | null } {
    const key = this.getApiKey();
    const configured = this.isConfigured();
    const keyMasked = configured ? `${key ? key.slice(0, 4) : 'gnew'}••••${key ? key.slice(-3) : 'live'}` : null;
    return {
      configured,
      lastError: this.lastFetchError,
      keyMasked,
    };
  }

  /**
   * Calculates dynamic localized relative time badge (e.g., '4m ago · Live', '4 मिनट पहले · लाइव')
   */
  public getRelativeTime(isoDateStr: string, langCode: string = 'en'): string {
    try {
      const now = Date.now();
      const articleTime = new Date(isoDateStr).getTime();
      if (Number.isNaN(articleTime)) {
        return langCode === 'hi' ? 'अभी-अभी · लाइव' : 'Just now · Live';
      }
      const diffMs = Math.max(0, now - articleTime);
      const diffMinutes = Math.floor(diffMs / (60 * 1000));

      if (langCode === 'hi') {
        if (diffMinutes < 1) return 'अभी-अभी · लाइव';
        if (diffMinutes < 60) return `${diffMinutes} मिनट पहले · लाइव`;
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours} घंटे पहले · लाइव`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} दिन पहले`;
      }

      if (diffMinutes < 1) return 'Just now · Live';
      if (diffMinutes < 60) return `${diffMinutes}m ago · Live`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h ago · Live`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return langCode === 'hi' ? 'अभी-अभी · लाइव' : 'Just now · Live';
    }
  }

  /**
   * Maps a raw wire article to Politics World LiveWireItem schema
   */
  private mapGNewsToWireItem(raw: GNewsRawArticle, index: number, langCode: string = 'en'): LiveWireItem {
    const agencyName = raw.source?.name || 'Global Live Wire';
    const rawMs = new Date(raw.publishedAt).getTime();
    const publishedTimestamp = Number.isNaN(rawMs) ? Date.now() : Math.min(rawMs, Date.now());
    const fallbackImage = '/src/assets/images/diplomatic_press_briefing_1791859432958.jpg';

    return {
      id: `gnews-${index}-${encodeURIComponent(raw.url.slice(-32))}`,
      title: raw.title,
      deck: raw.description || raw.title,
      source: agencyName,
      publisherChannel: `${agencyName} · Real-Time Wire`,
      sourceUrl: raw.url,
      country: 'Global International',
      countryCode: 'GL',
      category: 'Geopolitics',
      publishedAt: raw.publishedAt,
      relativeTime: this.getRelativeTime(raw.publishedAt, langCode),
      timestamp: publishedTimestamp,
      urgency: 'flash',
      image: raw.image && (raw.image.startsWith('http') || raw.image.startsWith('/')) ? raw.image : fallbackImage,
      caption: `Live Syndication: Dispatched by ${agencyName}. Original wire coverage verified.`,
      byline: `${agencyName} International Newsroom`,
      leadParagraph: (raw.description || raw.content || raw.title).replace(/\[\+\d+\s*chars\]/gi, '').trim(),
      bodyParagraphs: [
        (raw.description || raw.title).replace(/\[\+\d+\s*chars\]/gi, '').trim(),
        ...(raw.content && raw.content !== raw.description
          ? [raw.content.replace(/\[\+\d+\s*chars\]/gi, '').trim()]
          : []),
      ],
      keyTakeaways: [
        `Topic: ${raw.title}`,
        `Origin Bureau: ${agencyName}`,
        `Published: ${new Date(publishedTimestamp).toLocaleString()}`,
      ],
      tags: ['Live Wire', agencyName, 'Global Wire'],
    };
  }

  /**
   * Fetches latest real-time live news via backend wire proxy (/api/gnews/top-headlines)
   */
  public async fetchLiveHeadlines(
    category: string = 'general',
    lang: string = 'en',
    max: number = 10,
    forceRefresh: boolean = false
  ): Promise<LiveWireItem[]> {
    const cacheKey = `${category}-${lang}-${max}`;
    const cached = this.cache.get(cacheKey);
    const now = Date.now();

    // Return cached items if fresh and not forced
    if (!forceRefresh && cached && now - cached.timestamp < this.CACHE_TTL_MS) {
      return cached.items.map((item) => ({
        ...item,
        relativeTime: this.getRelativeTime(item.publishedAt, lang),
      }));
    }

    // Try 1: Call backend real-time wire proxy route /api/gnews/top-headlines
    try {
      const freshParam = forceRefresh ? '&fresh=1' : '';
      const proxyUrl = `/api/gnews/top-headlines?category=${encodeURIComponent(category)}&lang=${encodeURIComponent(lang)}&max=${max}${freshParam}`;
      const proxyHeaders: Record<string, string> = { Accept: 'application/json' };
      const currentKey = this.getApiKey();
      if (currentKey) {
        proxyHeaders['x-gnews-api-key'] = currentKey;
      }
      const proxyRes = await fetch(proxyUrl, {
        headers: proxyHeaders,
      });

      if (proxyRes.ok) {
        const data: GNewsApiResponse = await proxyRes.json();
        if (data.articles && Array.isArray(data.articles) && data.articles.length > 0) {
          const wireItems = data.articles
            .map((a, i) => this.mapGNewsToWireItem(a, i, lang))
            .sort((a, b) => b.timestamp - a.timestamp);
          this.cache.set(cacheKey, { timestamp: now, items: wireItems });
          this.lastFetchError = null;
          this.isConfiguredState = true;
          return wireItems;
        }
      }
    } catch {
      // fallback
    }

    return [];
  }

  /**
   * Maps a raw GNews article to an Article object for Front-Page Hero & Global Briefing feeds
   */
  public mapGNewsToArticle(raw: GNewsRawArticle, index: number, categoryNamespace: string = 'feed', langCode: string = 'en'): Article {
    const agencyName = raw.source?.name || 'Global Live Wire';
    const rawMs = new Date(raw.publishedAt).getTime();
    const safeMs = Number.isNaN(rawMs) ? Date.now() : Math.min(rawMs, Date.now());
    const publishedDate = new Date(safeMs);
    const relativeLabel = this.getRelativeTime(publishedDate.toISOString(), langCode);
    const timeFormatted = publishedDate.toLocaleTimeString(langCode === 'hi' ? 'hi-IN' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const fallbackImage = '/src/assets/images/diplomatic_press_briefing_1791859432958.jpg';

    // Smart category classification based on news headlines and keywords
    const textCorpus = `${raw.title} ${raw.description || ''} ${raw.content || ''}`.toLowerCase();
    let category: Article['category'] = 'Geopolitics';
    const tags: string[] = ['Live Wire', agencyName, 'Global Briefing', 'World News'];

    if (
      textCorpus.includes('election') ||
      textCorpus.includes('vote') ||
      textCorpus.includes('poll') ||
      textCorpus.includes('ballot') ||
      textCorpus.includes('voter') ||
      textCorpus.includes('चुनाव') ||
      textCorpus.includes('मतदान')
    ) {
      category = 'Elections 2026';
      tags.push('Elections');
    } else if (
      textCorpus.includes('economy') ||
      textCorpus.includes('trade') ||
      textCorpus.includes('market') ||
      textCorpus.includes('tariff') ||
      textCorpus.includes('bank') ||
      textCorpus.includes('dollar') ||
      textCorpus.includes('rupee') ||
      textCorpus.includes('inflation') ||
      textCorpus.includes('stock') ||
      textCorpus.includes('व्यापार') ||
      textCorpus.includes('अर्थव्यवस्था')
    ) {
      category = 'Economy & Trade';
      tags.push('Economy');
    } else if (
      textCorpus.includes('summit') ||
      textCorpus.includes('g20') ||
      textCorpus.includes('g7') ||
      textCorpus.includes('treaty') ||
      textCorpus.includes('accord') ||
      textCorpus.includes('bilateral') ||
      textCorpus.includes('un ') ||
      textCorpus.includes('शिखर सम्मेलन')
    ) {
      category = 'Global Summits';
      tags.push('Global Summits');
    } else if (
      textCorpus.includes('congress') ||
      textCorpus.includes('senate') ||
      textCorpus.includes('parliament') ||
      textCorpus.includes('white house') ||
      textCorpus.includes('capitol') ||
      textCorpus.includes('biden') ||
      textCorpus.includes('trump') ||
      textCorpus.includes('modi') ||
      textCorpus.includes('supreme court') ||
      textCorpus.includes('संसद') ||
      textCorpus.includes('विधेयक')
    ) {
      category = 'White House & Congress';
      tags.push('Capitol & Governance');
    }

    if (
      textCorpus.includes('india') ||
      textCorpus.includes('delhi') ||
      textCorpus.includes('modi') ||
      textCorpus.includes('bjp') ||
      textCorpus.includes('bharat') ||
      textCorpus.includes('भारत')
    ) {
      tags.push('India', 'South Asia');
    }

    // Unique slug from raw.title or raw.url
    const titleSlug = (raw.title || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 32);
    const urlHash = Math.abs(
      (raw.url || raw.title || '').split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
    ).toString(36);

    return {
      id: `gnews-art-${categoryNamespace}-${index}-${titleSlug || urlHash}`,
      title: raw.title,
      deck: raw.description || raw.title,
      category,
      author: `${agencyName} Bureau`,
      authorRole: 'Live International Correspondent',
      date: `${relativeLabel} · ${timeFormatted}`,
      publishedAt: publishedDate.toISOString(),
      timestamp: safeMs,
      readTime: '4 min read',
      image: raw.image && (raw.image.startsWith('http') || raw.image.startsWith('/')) ? raw.image : fallbackImage,
      caption: `Live syndicated coverage dispatched by ${agencyName}. Original wire coverage verified.`,
      priority: index === 0 ? 'lead' : index <= 2 ? 'secondary' : 'standard',
      featured: true,
      sourceAgency: agencyName,
      sourceCountry: 'International',
      sourceUrl: raw.url,
      tags,
      keyTakeaways: [
        `Topic: ${raw.title}`,
        `Origin Wire Agency: ${agencyName}`,
        `Published: ${publishedDate.toLocaleString()}`,
      ],
      leadParagraph: (raw.description || raw.title).replace(/\[\+\d+\s*chars\]/gi, '').trim(),
      bodyParagraphs: [
        (raw.content || raw.description || raw.title).replace(/\[\+\d+\s*chars\]/gi, '').trim(),
      ],
    };
  }

  /**
   * Fetches live articles for the Global Briefing and front-page news section
   */
  public async fetchLiveArticlesForFeed(
    lang: string = 'en',
    category: string = 'general',
    max: number = 10
  ): Promise<Article[]> {
    const apiKey = this.getApiKey();
    try {
      const proxyUrl = `/api/gnews/top-headlines?category=${encodeURIComponent(category)}&lang=${encodeURIComponent(lang)}&max=${max}`;
      const headers: Record<string, string> = { Accept: 'application/json' };
      if (apiKey) {
        headers['x-gnews-api-key'] = apiKey;
      }
      const proxyRes = await fetch(proxyUrl, { headers });

      if (proxyRes.ok) {
        const data: GNewsApiResponse = await proxyRes.json();
        if (data.articles && Array.isArray(data.articles) && data.articles.length > 0) {
          return data.articles
            .map((a, i) => this.mapGNewsToArticle(a, i, category, lang))
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        }
      }
    } catch (e) {
      console.warn('Live feed proxy error:', e);
    }

    return [];
  }

  /**
   * Fetches rich composite live feeds combining top headlines and world news, sorted strictly newest-first
   */
  public async fetchAllLiveFeeds(lang: string = 'en'): Promise<Article[]> {
    const [generalArticles, worldArticles, nationArticles] = await Promise.all([
      this.fetchLiveArticlesForFeed(lang, 'general', 10),
      this.fetchLiveArticlesForFeed(lang, 'world', 10).catch(() => []),
      this.fetchLiveArticlesForFeed(lang, 'nation', 8).catch(() => []),
    ]);

    const combined = [...generalArticles, ...worldArticles, ...nationArticles];
    const seenTitles = new Set<string>();
    const seenIds = new Set<string>();
    const unique: Article[] = [];
    for (const art of combined) {
      const titleKey = art.title.trim().toLowerCase();
      if (!seenTitles.has(titleKey) && !seenIds.has(art.id)) {
        seenTitles.add(titleKey);
        seenIds.add(art.id);
        unique.push(art);
      }
    }
    unique.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    return unique.length > 0 ? unique : generalArticles;
  }

  /**
   * Generates a dynamic live audio podcast episode based on today's latest news
   */
  public generateLivePodcastEpisode(
    articles: (Article | LiveWireItem)[],
    langCode: string = 'en'
  ): PodcastEpisode {
    const todayFormatted = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date());

    const topArticle = articles[0];

    const isHindi = langCode === 'hi';

    const title = isHindi
      ? `${topArticle ? topArticle.title : 'प्रमुख अंतरराष्ट्रीय समाचार बुलेटिन'}`
      : `${topArticle ? topArticle.title : 'Lead International News Dispatch'}`;

    const topSource = (topArticle as any)?.sourceAgency || (topArticle as any)?.source || 'GNews Wire';

    const description = topArticle?.deck
      ? topArticle.deck
      : isHindi
      ? `${topSource} से प्राप्त इस प्रमुख समाचार का विस्तृत ऑडियो विश्लेषण।`
      : `Dedicated audio report covering this verified dispatch from ${topSource}.`;

    const leadText = (topArticle as any)?.leadParagraph || topArticle?.deck || '';
    const extraPara = Array.isArray((topArticle as any)?.bodyParagraphs)
      ? (topArticle as any).bodyParagraphs.find((p: string) => p && p !== leadText && !p.toLowerCase().includes('syndicated in real-time'))
      : '';

    const segments: TranscriptSegment[] = [
      {
        time: '00:00',
        seconds: 0,
        speaker: isHindi ? 'समाचार वाचक' : 'Chief Anchor',
        text: topArticle
          ? topArticle.title
          : isHindi
          ? 'पॉलिटिक्स वर्ल्ड लाइव ऑडियो ब्रीफिंग में आपका स्वागत है'
          : 'Welcome to Politics World Audio Dispatch',
      },
      {
        time: '00:10',
        seconds: 10,
        speaker: isHindi ? 'वरिष्ठ संवाददाता' : 'Senior Correspondent',
        text: leadText || description,
      },
    ];

    if (extraPara) {
      segments.push({
        time: '00:28',
        seconds: 28,
        speaker: isHindi ? 'संपादकीय डेस्क' : 'Editorial Desk',
        text: extraPara,
      });
    }

    return {
      id: 'pod-live-today',
      episodeNumber: 143,
      title,
      series: isHindi ? 'दैनिक लाइव बुलेटिन' : 'Daily Live Dispatch',
      host: isHindi ? 'पॉलिटिक्स वर्ल्ड एडिटोरियल डेस्क' : 'Politics World Editorial Bureau',
      hostRole: isHindi ? 'लाइव सिंडिकेशन संवाददाता' : 'Live Syndication Desk',
      date: `${todayFormatted} · Live Edition`,
      durationSeconds: 120,
      durationFormatted: '02:00',
      description,
      topics: ['GNews Live', 'Breaking Wire', 'Global Diplomacy', 'Capitol Policy'],
      keyQuotes: topArticle ? topArticle.title : 'Real-time syndicated dispatches direct from global bureaus.',
      transcriptSample: segments,
    };
  }

  /**
   * Generates a dynamic catalog of live audio broadcast episodes from fresh GNews wire stories
   */
  public generateLivePodcastEpisodesList(
    articles: (Article | LiveWireItem)[],
    langCode: string = 'en'
  ): PodcastEpisode[] {
    const isHindi = langCode === 'hi';
    const now = new Date();
    const todayFormatted = new Intl.DateTimeFormat(isHindi ? 'hi-IN' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(now);

    if (!articles || articles.length === 0) {
      return [this.generateLivePodcastEpisode([], langCode)];
    }

    const seriesNamesEn = [
      'Breaking Wire Dispatch',
      'Geopolitics & Defense',
      'Global Economy & Markets',
      'Capitol & Legislative Radar',
      'Technology & AI Briefing',
      'International Investigation',
    ];

    const seriesNamesHi = [
      'ब्रेकिंग वायर बुलेटिन',
      'भू-राजनीति व कूटनीति',
      'वैश्विक अर्थव्यवस्था व बाज़ार',
      'संसद व विधायी रडार',
      'प्रौद्योगिकी व AI समीक्षा',
      'अंतरराष्ट्रीय विशेष जांच',
    ];

    const episodes: PodcastEpisode[] = [];

    // First episode: Comprehensive daily live bulletin covering top stories
    episodes.push(this.generateLivePodcastEpisode(articles, langCode));

    // Next episodes: 1 dedicated in-depth broadcast dispatch per live story
    const candidateArticles = articles.slice(0, 6);
    candidateArticles.forEach((art, idx) => {
      const epNum = 144 + idx;
      const series = isHindi
        ? seriesNamesHi[idx % seriesNamesHi.length]
        : seriesNamesEn[idx % seriesNamesEn.length];
      const source = (art as any)?.sourceAgency || (art as any)?.source || 'GNews.io Live';
      const cleanTitle = art.title;
      const cleanDeck = art.deck || art.title;
      const timeAgo = (art as any)?.relativeTime || `${(idx + 1) * 6}m ago · Live`;

      const segments: TranscriptSegment[] = [
        {
          time: '00:00',
          seconds: 0,
          speaker: isHindi ? 'समाचार वाचक' : 'Announcer',
          text: isHindi
            ? `पॉलिटिक्स वर्ल्ड ऑडियो पॉडकास्ट में आपका स्वागत है। विशेष बुलेटिन: ${cleanTitle}।`
            : `Welcome to Politics World Audio Briefings. Special broadcast: ${cleanTitle}.`,
        },
        {
          time: '00:08',
          seconds: 8,
          speaker: isHindi ? 'वरिष्ठ संवाददाता' : 'Senior Correspondent',
          text: isHindi
            ? `मुख्य रिपोर्ट: ${cleanDeck}।`
            : `In-depth reporting: ${cleanDeck}.`,
        },
      ];

      const body = (art as any)?.leadParagraph || ((art as any)?.bodyParagraphs && (art as any).bodyParagraphs[0]);
      if (body) {
        segments.push({
          time: '00:25',
          seconds: 25,
          speaker: isHindi ? 'वैश्विक डेस्क' : 'Bureau Chief',
          text: body,
        });
      }

      segments.push({
        time: '00:48',
        seconds: 48,
        speaker: isHindi ? 'समाचार वाचक' : 'Announcer',
        text: isHindi
          ? `यह समाचार ${source} द्वारा संप्रेषित किया गया। ताज़ा जानकारी के लिए पॉलिटिक्स वर्ल्ड पर बने रहें।`
          : `Dispatched in real-time from ${source}. Stay tuned to Politics World for continuous live updates.`,
      });

      episodes.push({
        id: `pod-live-${art.id || idx}`,
        episodeNumber: epNum,
        title: cleanTitle,
        series,
        host: `${source} Newsroom`,
        hostRole: isHindi ? 'लाइव ऑडियो संवाददाता' : 'Live Audio Correspondent',
        date: `${todayFormatted} · ${timeAgo}`,
        durationSeconds: 90,
        durationFormatted: '01:30',
        description: cleanDeck,
        topics: art.tags && art.tags.length > 0 ? art.tags.slice(0, 4) : ['GNews Live', 'Breaking News', 'World Wire'],
        keyQuotes: (art as any)?.leadParagraph?.slice(0, 120) || cleanTitle,
        transcriptSample: segments,
      });
    });

    return episodes;
  }
}

export const gnewsService = new GNewsService();
