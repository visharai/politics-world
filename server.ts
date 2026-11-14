import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory caches
const cache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds for near-real-time updates
const rssCache = new Map<string, { timestamp: number; articles: any[] }>();
const RSS_CACHE_TTL_MS = 60 * 1000; // 60 seconds for instant real-time breaking updates

function stripXmlAndHtml(raw: string): string {
  return unescapeHtml(
    raw
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

interface RssSourceConfig {
  url: string;
  name: string;
  sourceUrl: string;
  fallbackImage: string;
}

const REALTIME_RSS_SOURCES: Record<string, RssSourceConfig[]> = {
  general: [
    {
      url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
      name: 'BBC World News',
      sourceUrl: 'https://www.bbc.com/news/world',
      fallbackImage: '/src/assets/images/diplomatic_press_briefing_1791859432958.jpg',
    },
    {
      url: 'https://www.aljazeera.com/xml/rss/all.xml',
      name: 'Al Jazeera Live',
      sourceUrl: 'https://www.aljazeera.com',
      fallbackImage: '/src/assets/images/geneva_trade_summit_1792380631472.jpg',
    },
    {
      url: 'https://www.theguardian.com/world/rss',
      name: 'The Guardian',
      sourceUrl: 'https://www.theguardian.com/world',
      fallbackImage: '/src/assets/images/geopolitical_trade_port_1791859433200.jpg',
    },
  ],
  world: [
    {
      url: 'https://www.aljazeera.com/xml/rss/all.xml',
      name: 'Al Jazeera Live',
      sourceUrl: 'https://www.aljazeera.com',
      fallbackImage: '/src/assets/images/geneva_trade_summit_1792380631472.jpg',
    },
    {
      url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
      name: 'BBC World News',
      sourceUrl: 'https://www.bbc.com/news/world',
      fallbackImage: '/src/assets/images/diplomatic_press_briefing_1791859432958.jpg',
    },
    {
      url: 'https://www.theguardian.com/world/rss',
      name: 'The Guardian',
      sourceUrl: 'https://www.theguardian.com/world',
      fallbackImage: '/src/assets/images/geopolitical_trade_port_1791859433200.jpg',
    },
  ],
  nation: [
    {
      url: 'https://feeds.bbci.co.uk/news/world/asia/india/rss.xml',
      name: 'BBC India & South Asia',
      sourceUrl: 'https://www.bbc.com/news/world/asia/india',
      fallbackImage: '/src/assets/images/india_parliament_news_1792118846447.jpg',
    },
    {
      url: 'https://feeds.bbci.co.uk/news/politics/rss.xml',
      name: 'BBC Politics',
      sourceUrl: 'https://www.bbc.com/news/politics',
      fallbackImage: '/src/assets/images/capitol_night_session_1791859431318.jpg',
    },
    {
      url: 'https://www.theguardian.com/politics/rss',
      name: 'The Guardian Politics',
      sourceUrl: 'https://www.theguardian.com/politics',
      fallbackImage: '/src/assets/images/supreme_court_bench_1792002466101.jpg',
    },
  ],
  business: [
    {
      url: 'https://feeds.bbci.co.uk/news/business/rss.xml',
      name: 'BBC Business',
      sourceUrl: 'https://www.bbc.com/news/business',
      fallbackImage: '/src/assets/images/geopolitical_trade_port_1791859433200.jpg',
    },
    {
      url: 'https://www.theguardian.com/uk/business/rss',
      name: 'The Guardian Business',
      sourceUrl: 'https://www.theguardian.com/business',
      fallbackImage: '/src/assets/images/geneva_trade_summit_1792380631472.jpg',
    },
  ],
  technology: [
    {
      url: 'https://feeds.bbci.co.uk/news/technology/rss.xml',
      name: 'BBC Technology',
      sourceUrl: 'https://www.bbc.com/news/technology',
      fallbackImage: '/src/assets/images/semiconductor_cleanroom_1792002503650.jpg',
    },
    {
      url: 'https://www.theguardian.com/uk/technology/rss',
      name: 'The Guardian Tech',
      sourceUrl: 'https://www.theguardian.com/technology',
      fallbackImage: '/src/assets/images/semiconductor_cleanroom_1792002503650.jpg',
    },
  ],
  science: [
    {
      url: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
      name: 'BBC Science & Climate',
      sourceUrl: 'https://www.bbc.com/news/science_and_environment',
      fallbackImage: '/src/assets/images/clean_energy_offshore_1792002484185.jpg',
    },
  ],
};

function parseRssFeedArticles(xml: string, src: RssSourceConfig, lang: string): any[] {
  const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];
  const results: any[] = [];

  for (const itemXml of itemMatches.slice(0, 12)) {
    const titleRaw = itemXml.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '';
    const linkRaw = itemXml.match(/<link>([\s\S]*?)<\/link>/i)?.[1] || '';
    const descRaw = itemXml.match(/<description>([\s\S]*?)<\/description>/i)?.[1] || '';
    const pubDateRaw = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1] || itemXml.match(/<dc:date>([\s\S]*?)<\/dc:date>/i)?.[1] || '';

    const title = stripXmlAndHtml(titleRaw);
    if (!title || title.length < 8) continue;

    const cleanLink = stripXmlAndHtml(linkRaw) || src.sourceUrl;
    const rawDescription = stripXmlAndHtml(descRaw)
      .replace(/Continue reading\.\.\.$/i, '')
      .trim();
    const description = rawDescription || title;

    let imageUrl = src.fallbackImage;
    const mediaContents = [...itemXml.matchAll(/<media:content[^>]*url=["']([^"']+)["'][^>]*>/gi)];
    if (mediaContents.length > 0) {
      imageUrl = unescapeHtml(mediaContents[mediaContents.length - 1][1]);
    } else {
      const thumbMatch = itemXml.match(/<media:thumbnail[^>]*url=["']([^"']+)["']/i);
      if (thumbMatch?.[1]) {
        imageUrl = unescapeHtml(thumbMatch[1]).replace('/ace/standard/240/', '/ace/standard/800/').replace('/ace/ws/240/', '/ace/ws/800/');
      }
    }

    const parsedDate = pubDateRaw ? new Date(stripXmlAndHtml(pubDateRaw)) : new Date();
    const validMs = Number.isNaN(parsedDate.getTime()) ? Date.now() : Math.min(parsedDate.getTime(), Date.now());
    const publishedAt = new Date(validMs).toISOString();

    results.push({
      title,
      description,
      content: description,
      url: cleanLink,
      image: imageUrl,
      publishedAt,
      lang,
      source: {
        name: src.name,
        url: src.sourceUrl,
      },
      _ts: validMs,
    });
  }

  return results;
}

async function fetchRealtimeRssNews(category: string = 'general', lang: string = 'en', max: number = 10, forceFresh: boolean = false): Promise<any[]> {
  const cacheKey = `rss-${category}-${lang}-${max}`;
  const cached = rssCache.get(cacheKey);
  const now = Date.now();

  if (!forceFresh && cached && now - cached.timestamp < RSS_CACHE_TTL_MS) {
    return cached.articles;
  }

  const sources: RssSourceConfig[] = [...(REALTIME_RSS_SOURCES[category] || REALTIME_RSS_SOURCES.general)];
  if (lang === 'hi' && (category === 'general' || category === 'world' || category === 'nation')) {
    sources.unshift({
      url: 'https://feeds.bbci.co.uk/hindi/rss.xml',
      name: 'BBC News हिन्दी',
      sourceUrl: 'https://www.bbc.com/hindi',
      fallbackImage: '/src/assets/images/india_parliament_news_1792118846447.jpg',
    });
  }

  const fetchedLists = await Promise.all(
    sources.map(async (src) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);
        const r = await fetch(src.url, {
          signal: controller.signal,
          headers: { 'User-Agent': 'PoliticsWorldWire/2.0' },
        });
        clearTimeout(timeout);
        if (!r.ok) return [];
        const xml = await r.text();
        return parseRssFeedArticles(xml, src, lang);
      } catch {
        return [];
      }
    })
  );

  const merged = fetchedLists.flat().sort((a, b) => b._ts - a._ts);
  const seenTitles = new Set<string>();
  const unique: any[] = [];
  for (const item of merged) {
    const key = item.title.toLowerCase().trim();
    if (!seenTitles.has(key)) {
      seenTitles.add(key);
      const { _ts, ...cleanArticle } = item;
      unique.push(cleanArticle);
    }
  }

  const sliced = unique.slice(0, max);
  if (sliced.length > 0) {
    rssCache.set(cacheKey, { timestamp: now, articles: sliced });
  }
  return sliced;
}

function getGNewsApiKey(req?: Request): string {
  const headerKey = req?.headers?.['x-gnews-api-key'];
  if (typeof headerKey === 'string' && headerKey.trim().length > 5 && !headerKey.includes('YOUR_')) {
    return headerKey.trim();
  }
  const key = process.env.GNEWS_API_KEY || process.env.VITE_GNEWS_API_KEY || '';
  if (key && !key.includes('YOUR_') && key.trim().length > 5) {
    return key.trim();
  }
  return '';
}

// 1. Status endpoint for live wire integration
app.get('/api/gnews/status', (req: Request, res: Response) => {
  const key = getGNewsApiKey(req);
  const configured = Boolean(key);
  res.json({
    status: 'ok',
    configured: true,
    gnewsKeyConfigured: configured,
    keyMasked: configured ? `${key.slice(0, 4)}••••${key.slice(-3)}` : null,
    provider: 'Real-Time Wire (0-Delay) + GNews.io',
  });
});

// 1b. Dedicated Real-Time 0-Delay Wire Endpoint
app.get('/api/news/realtime', async (req: Request, res: Response) => {
  const category = (req.query.category as string) || 'general';
  const lang = (req.query.lang as string) || 'en';
  const max = Math.min(Number(req.query.max) || 12, 20);
  const fresh = req.query.fresh === '1';

  const articles = await fetchRealtimeRssNews(category, lang, max, fresh);
  return res.json({
    configured: true,
    realtime: true,
    delayHours: 0,
    fetchedAt: new Date().toISOString(),
    articles,
  });
});

// 2. Top headlines route: prioritizes 0-delay real-time news (fixes GNews Free Plan 12-hour delay!)
app.get('/api/gnews/top-headlines', async (req: Request, res: Response) => {
  const apiKey = getGNewsApiKey(req);
  const category = (req.query.category as string) || 'general';
  const lang = (req.query.lang as string) || 'en';
  const max = Math.min(Number(req.query.max) || 10, 15);
  const country = (req.query.country as string) || '';
  const forceFresh = req.query.fresh === '1';

  const cacheKey = `top-${category}-${lang}-${max}-${country}`;
  const cached = cache.get(cacheKey);
  const now = Date.now();

  if (!forceFresh && cached && now - cached.timestamp < CACHE_TTL_MS) {
    return res.json({ ...cached.data, cached: true });
  }

  // Always fetch 0-delay real-time global wire feeds in parallel
  const realtimePromise = fetchRealtimeRssNews(category, lang, max, forceFresh);

  let gnewsFreshArticles: any[] = [];
  if (apiKey && !country) {
    try {
      let url = `https://gnews.io/api/v4/top-headlines?category=${encodeURIComponent(category)}&lang=${encodeURIComponent(lang)}&max=${max}&apikey=${apiKey}`;
      const response = await fetch(url);
      if (response.ok) {
        const gData = await response.json();
        const isFreeDelayed = Boolean(gData?.information?.realTimeArticles?.message?.includes('12-hour delay'));
        if (Array.isArray(gData?.articles)) {
          // Only keep GNews articles that are actually fresh (< 4 hours old) and not 12h delayed
          gnewsFreshArticles = gData.articles.filter((art: any) => {
            if (isFreeDelayed) return false;
            const ageHours = (now - new Date(art.publishedAt).getTime()) / (3600 * 1000);
            return ageHours <= 4;
          });
        }
      }
    } catch {
      // ignore and rely on real-time RSS feeds
    }
  } else if (apiKey && country) {
    try {
      const url = `https://gnews.io/api/v4/top-headlines?category=${encodeURIComponent(category)}&lang=${encodeURIComponent(lang)}&max=${max}&country=${encodeURIComponent(country)}&apikey=${apiKey}`;
      const response = await fetch(url);
      if (response.ok) {
        const gData = await response.json();
        const isFreeDelayed = Boolean(gData?.information?.realTimeArticles?.message?.includes('12-hour delay'));
        if (Array.isArray(gData?.articles) && !isFreeDelayed) {
          gnewsFreshArticles = gData.articles;
        }
      }
    } catch {
      // ignore
    }
  }

  const realtimeArticles = await realtimePromise;

  // Combine & deduplicate, sorted strictly newest-first (0-delay real-time news first!)
  const combined = [...gnewsFreshArticles, ...realtimeArticles];
  const seen = new Set<string>();
  const finalArticles: any[] = [];
  for (const art of combined) {
    const k = (art.title || '').toLowerCase().trim();
    if (k && !seen.has(k)) {
      seen.add(k);
      finalArticles.push(art);
    }
  }
  finalArticles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const payload = {
    configured: true,
    realtime: true,
    fetchedAt: new Date().toISOString(),
    articles: finalArticles.slice(0, max),
  };

  cache.set(cacheKey, { timestamp: now, data: payload });
  return res.json(payload);
});

// 3. Search proxy route
app.get('/api/gnews/search', async (req: Request, res: Response) => {
  const apiKey = getGNewsApiKey(req);
  if (!apiKey) {
    return res.json({
      configured: false,
      message: 'GNews API key is not configured. Set GNEWS_API_KEY in .env or pass x-gnews-api-key.',
      articles: [],
    });
  }

  const q = (req.query.q as string) || 'world';
  const lang = (req.query.lang as string) || 'en';
  const max = Math.min(Number(req.query.max) || 10, 10);

  const cacheKey = `search-${q}-${lang}-${max}`;
  const cached = cache.get(cacheKey);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return res.json({ ...cached.data, cached: true });
  }

  try {
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=${encodeURIComponent(lang)}&max=${max}&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        configured: true,
        error: data.errors?.[0] || data.message || 'GNews API error',
        articles: [],
      });
    }

    cache.set(cacheKey, { timestamp: now, data });
    return res.json({ ...data, configured: true });
  } catch (err: any) {
    return res.status(500).json({
      configured: true,
      error: err?.message || 'Failed to fetch from GNews.io',
      articles: [],
    });
  }
});

// 4. Universal 16-Language Instant Translation Proxy with In-Memory Cache
const translationCache = new Map<string, string>();

const GT_LANG_MAP: Record<string, string> = {
  en: 'en',
  es: 'es',
  fr: 'fr',
  de: 'de',
  hi: 'hi',
  zh: 'zh-CN',
  ar: 'ar',
  ja: 'ja',
  ru: 'ru',
  pt: 'pt',
  it: 'it',
  ko: 'ko',
  tr: 'tr',
  nl: 'nl',
  id: 'id',
  pl: 'pl',
};

function unescapeHtml(str: string): string {
  return str
    .replace(/&#39;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

async function translateSingleText(text: string, targetLang: string): Promise<string> {
  const trimmed = text?.trim();
  if (!trimmed) return text || '';
  if (targetLang === 'en') return text;

  const targetCode = GT_LANG_MAP[targetLang] || targetLang;
  const cacheKey = `${targetCode}:::${trimmed}`;

  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const langpair = `en|${targetCode}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=${encodeURIComponent(langpair)}&de=politicsworld@gmail.com`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const rawTranslated = data?.responseData?.translatedText;
      if (rawTranslated && typeof rawTranslated === 'string' && !rawTranslated.startsWith('MYMEMORY WARNING')) {
        const cleaned = unescapeHtml(rawTranslated);
        translationCache.set(cacheKey, cleaned);
        return cleaned;
      }
    }
  } catch {
    // Return original text on timeout or network error
  }

  return trimmed;
}

app.post('/api/translate', async (req: Request, res: Response) => {
  const { texts, targetLang } = req.body;

  if (!targetLang || targetLang === 'en' || !Array.isArray(texts)) {
    return res.json({ translated: texts || [] });
  }

  try {
    const slice = texts.slice(0, 60);
    const translated = await Promise.all(
      slice.map((t: string) => (typeof t === 'string' ? translateSingleText(t, targetLang) : t))
    );
    res.json({ translated, lang: targetLang });
  } catch (err: any) {
    res.json({ translated: texts, error: err?.message });
  }
});

// 5. Real-Time Live Cricket Scoreboard Proxy (/api/cricket/live)
export interface CricketMatchPayload {
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

const cricketCache: { timestamp: number; data: any } = { timestamp: 0, data: null };
const CRICKET_CACHE_TTL_MS = 25 * 1000; // 25 seconds for near-real-time updates

function parseTeamSide(rawSide: string): { name: string; score: string; isBatting: boolean } {
  const cleaned = unescapeHtml(rawSide).replace(/\s+/g, ' ').trim();
  const isBatting = cleaned.includes('*');
  const withoutStar = cleaned.replace(/\*/g, '').replace(/\s+/g, ' ').trim();
  const match = withoutStar.match(/^(.*?)\s+(\d+\/\d+.*)$/);
  if (match) {
    return {
      name: match[1].trim(),
      score: match[2].trim(),
      isBatting,
    };
  }
  return {
    name: withoutStar,
    score: '',
    isBatting,
  };
}

function parseCricinfoRss(xml: string): { pubDate: string; matches: CricketMatchPayload[] } {
  const pubMatch = xml.match(/<pubDate>(.*?)<\/pubDate>/i);
  const pubDate = pubMatch ? pubMatch[1].trim() : new Date().toUTCString();
  const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];

  const matches: CricketMatchPayload[] = [];
  itemMatches.forEach((itemXml, index) => {
    const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/i);
    const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/i);
    const guidMatch = itemXml.match(/<guid>([\s\S]*?)<\/guid>/i);

    if (!titleMatch) return;
    const rawTitle = unescapeHtml(titleMatch[1]).replace(/\s+/g, ' ').trim();
    const rawLink = (linkMatch?.[1] || guidMatch?.[1] || 'https://www.espncricinfo.com').trim();
    const idExtract = rawLink.match(/match\/(\d+)/)?.[1] || `cric-${index}`;

    const sides = rawTitle.split(/\s+v\s+/i);
    const left = parseTeamSide(sides[0] || rawTitle);
    const right = sides[1] ? parseTeamSide(sides[1]) : { name: '', score: '', isBatting: false };

    const hasScores = Boolean(left.score || right.score);
    const isActivelyBatting = left.isBatting || right.isBatting;
    const isLive = isActivelyBatting || hasScores;

    let statusText = 'Scheduled / Upcoming Fixture';
    if (isActivelyBatting) {
      const battingTeam = left.isBatting ? left.name : right.name;
      statusText = `LIVE · ${battingTeam} Batting`;
    } else if (hasScores) {
      statusText = 'LIVE / Innings Summary';
    }

    const matchType = rawTitle.includes('&')
      ? 'First-Class / Test'
      : rawTitle.includes('Women')
      ? "Women's Cricket"
      : rawTitle.includes('(NPL)')
      ? 'T20 League'
      : 'International / Pro';

    matches.push({
      id: `cricinfo-${idExtract}`,
      matchTitle: `${left.name}${right.name ? ` vs ${right.name}` : ''}`,
      team1: left.name,
      team1Score: left.score,
      team1Batting: left.isBatting,
      team2: right.name,
      team2Score: right.score,
      team2Batting: right.isBatting,
      isLive,
      statusText,
      matchType,
      matchUrl: rawLink.replace('http://', 'https://'),
      source: 'ESPNcricinfo Live Wire',
    });
  });

  // Sort active live matches first
  matches.sort((a, b) => Number(b.isLive) - Number(a.isLive));
  return { pubDate, matches };
}

app.get('/api/cricket/live', async (req: Request, res: Response) => {
  const headerCricKey = req.headers?.['x-cricapi-key'];
  const cricApiKey =
    (typeof headerCricKey === 'string' && headerCricKey.trim().length > 5 ? headerCricKey.trim() : '') ||
    process.env.CRICAPI_KEY ||
    '';

  const forceRefresh = req.query.refresh === '1';
  const now = Date.now();

  if (!forceRefresh && !cricApiKey && cricketCache.data && now - cricketCache.timestamp < CRICKET_CACHE_TTL_MS) {
    return res.json({ ...cricketCache.data, cached: true });
  }

  // Optional Tier 1: CricketData.org / CricAPI if API key provided
  if (cricApiKey && !cricApiKey.includes('YOUR_')) {
    try {
      const apiRes = await fetch(`https://api.cricapi.com/v1/currentMatches?apikey=${encodeURIComponent(cricApiKey)}&offset=0`);
      if (apiRes.ok) {
        const json = await apiRes.json();
        if (json?.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
          const formatted: CricketMatchPayload[] = json.data.slice(0, 18).map((m: any) => {
            const t1 = m.teams?.[0] || 'Team A';
            const t2 = m.teams?.[1] || 'Team B';
            const s1Obj = Array.isArray(m.score) ? m.score.find((s: any) => s.inning?.toLowerCase().includes(t1.toLowerCase())) : null;
            const s2Obj = Array.isArray(m.score) ? m.score.find((s: any) => s.inning?.toLowerCase().includes(t2.toLowerCase())) : null;
            const fmtScore = (s: any) => (s ? `${s.r}/${s.w} (${s.o} ov)` : '');
            return {
              id: `cricapi-${m.id}`,
              matchTitle: m.name || `${t1} vs ${t2}`,
              team1: t1,
              team1Score: fmtScore(s1Obj),
              team1Batting: Boolean(m.matchStarted && !m.matchEnded && s1Obj && !s2Obj),
              team2: t2,
              team2Score: fmtScore(s2Obj),
              team2Batting: Boolean(m.matchStarted && !m.matchEnded && s2Obj),
              isLive: Boolean(m.matchStarted && !m.matchEnded),
              statusText: m.status || 'Live Update',
              matchType: (m.matchType || 'CRICKET').toUpperCase(),
              venue: m.venue,
              matchUrl: 'https://www.espncricinfo.com/live-cricket-score',
              source: 'CricketData Live API',
            };
          });
          formatted.sort((a, b) => Number(b.isLive) - Number(a.isLive));
          const payload = {
            status: 'ok',
            provider: 'CricketData Live API',
            updatedAt: new Date().toISOString(),
            matches: formatted,
          };
          return res.json(payload);
        }
      }
    } catch {
      // Fall back to Cricinfo live wire RSS cleanly
    }
  }

  // Primary Keyless Live Feed: ESPNcricinfo Official Live Scores RSS
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const rssRes = await fetch('https://static.cricinfo.com/rss/livescores.xml', {
      signal: controller.signal,
      headers: { 'User-Agent': 'PoliticsWorld-LiveCricketWire/1.0' },
    });
    clearTimeout(timeout);

    if (!rssRes.ok) {
      throw new Error(`Cricket wire status ${rssRes.status}`);
    }

    const xml = await rssRes.text();
    const parsed = parseCricinfoRss(xml);
    const payload = {
      status: 'ok',
      provider: 'ESPNcricinfo Live Wire',
      feedPubDate: parsed.pubDate,
      updatedAt: new Date().toISOString(),
      matches: parsed.matches,
    };
    cricketCache.timestamp = now;
    cricketCache.data = payload;
    return res.json(payload);
  } catch (err: any) {
    if (cricketCache.data) {
      return res.json({ ...cricketCache.data, cached: true });
    }
    return res.status(502).json({
      status: 'error',
      error: err?.message || 'Unable to reach live cricket score feed',
      matches: [],
    });
  }
});

// 6. Dynamic SEO Routes (/robots.txt & /sitemap.xml) bound to live host / APP_URL
function resolvePublicBaseUrl(req: Request): string {
  const configured = process.env.APP_URL?.trim();
  if (configured && /^https?:\/\//i.test(configured)) {
    return configured.replace(/\/+$/, '');
  }
  const forwardedProto = (req.headers['x-forwarded-proto'] as string)?.split(',')[0]?.trim();
  const proto = forwardedProto || req.protocol || 'https';
  const host = (req.headers['x-forwarded-host'] as string) || req.get('host') || 'ais-pre-5ybfu37d43e2ycuf3t3ush-370038772633.asia-east1.run.app';
  return `${proto}://${host}`;
}

app.get('/robots.txt', (req: Request, res: Response) => {
  const baseUrl = resolvePublicBaseUrl(req);
  res.type('text/plain').send(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /api/',
      '',
      'User-agent: Googlebot',
      'Allow: /',
      '',
      'User-agent: Googlebot-News',
      'Allow: /',
      '',
      'User-agent: Googlebot-Image',
      'Allow: /',
      '',
      `Sitemap: ${baseUrl}/sitemap.xml`,
    ].join('\n')
  );
});

app.get('/sitemap.xml', (req: Request, res: Response) => {
  const baseUrl = resolvePublicBaseUrl(req);
  const nowIso = new Date().toISOString();
  const langs = ['en', 'hi', 'es', 'fr', 'de', 'ar', 'zh', 'ja', 'ru', 'pt', 'it', 'ko', 'tr', 'nl', 'id', 'pl'];
  const hrefLangLinks = [
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/" />`,
    ...langs.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${baseUrl}/?lang=${l}" />`),
  ].join('\n');

  const sectionEntries = [
    { path: '/#live-wire', changefreq: 'always', priority: '0.95' },
    { path: '/#cricket-live', changefreq: 'always', priority: '0.92' },
    { path: '/#latest-news', changefreq: 'hourly', priority: '0.90' },
    { path: '/#leader-rankings', changefreq: 'daily', priority: '0.80' },
    { path: '/#policy-tracker', changefreq: 'daily', priority: '0.80' },
    { path: '/#fact-checks', changefreq: 'daily', priority: '0.80' },
    { path: '/#audio-digest', changefreq: 'daily', priority: '0.80' },
    { path: '/?article=item-1', changefreq: 'daily', priority: '0.85' },
    { path: '/?article=item-2', changefreq: 'daily', priority: '0.85' },
    { path: '/?article=item-3', changefreq: 'daily', priority: '0.85' },
    { path: '/?article=item-4', changefreq: 'daily', priority: '0.85' },
    { path: '/?article=item-5', changefreq: 'daily', priority: '0.85' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${nowIso}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
${hrefLangLinks}
    <news:news>
      <news:publication>
        <news:name>Politics World</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${nowIso}</news:publication_date>
      <news:title>Politics World - Real-Time Breaking Political News, Live Cricket &amp; Global Policy Dispatches</news:title>
    </news:news>
  </url>
${sectionEntries
  .map(
    (entry) => `  <url>
    <loc>${baseUrl}${entry.path}</loc>
    <lastmod>${nowIso}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.type('application/xml').send(xml);
});

app.get('/.well-known/assetlinks.json', async (_req: Request, res: Response) => {
  const fs = await import('fs');
  const filePath = path.resolve(__dirname, 'public', '.well-known', 'assetlinks.json');
  const distPath = path.resolve(__dirname, 'dist', '.well-known', 'assetlinks.json');
  const target = fs.existsSync(distPath) ? distPath : filePath;
  if (fs.existsSync(target)) {
    res.type('application/json').sendFile(target);
  } else {
    res.status(404).json([]);
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const httpServer = http.createServer(app);

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: { server: httpServer },
        hmr: { server: httpServer },
        ws: { server: httpServer },
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist'), { dotfiles: 'allow' }));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Politics World Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
