import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const portArgIdx = process.argv.indexOf('--port');
const cliPort = portArgIdx !== -1 ? Number(process.argv[portArgIdx + 1]) : NaN;
const PORT = !Number.isNaN(cliPort) && cliPort > 0 ? cliPort : Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '8mb' }));

const AD_BANNERS_DIR = path.resolve(__dirname, 'uploads', 'ad-banners');
if (!fs.existsSync(AD_BANNERS_DIR)) {
  fs.mkdirSync(AD_BANNERS_DIR, { recursive: true });
}
app.use('/uploads/ad-banners', express.static(AD_BANNERS_DIR, { maxAge: '7d' }));

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

const EDITORIAL_FALLBACK_IMAGES = [
  '/src/assets/images/diplomatic_press_briefing_1791859432958.jpg',
  '/src/assets/images/india_parliament_news_1792118846447.jpg',
  '/src/assets/images/capitol_night_session_1791859431318.jpg',
  '/src/assets/images/geopolitical_trade_port_1791859433200.jpg',
  '/src/assets/images/geneva_trade_summit_1792380631472.jpg',
  '/src/assets/images/semiconductor_cleanroom_1792002503650.jpg',
  '/src/assets/images/clean_energy_offshore_1792002484185.jpg',
  '/src/assets/images/supreme_court_bench_1792002466101.jpg',
  '/src/assets/images/gulf_summit_riyadh_1792380285437.jpg',
  '/src/assets/images/berlin_bundestag_plenary_1792380322998.jpg',
  '/src/assets/images/mexico_nearshoring_rail_1792380630439.jpg',
  '/src/assets/images/india_election_rally_crowd_1792380255382.jpg',
];

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
      url: 'https://www.france24.com/en/rss',
      name: 'France 24',
      sourceUrl: 'https://www.france24.com/en/',
      fallbackImage: '/src/assets/images/berlin_bundestag_plenary_1792380322998.jpg',
    },
    {
      url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
      name: 'The New York Times',
      sourceUrl: 'https://www.nytimes.com/section/world',
      fallbackImage: '/src/assets/images/capitol_night_session_1791859431318.jpg',
    },
    {
      url: 'https://www.theguardian.com/world/rss',
      name: 'The Guardian',
      sourceUrl: 'https://www.theguardian.com/world',
      fallbackImage: '/src/assets/images/geopolitical_trade_port_1791859433200.jpg',
    },
    {
      url: 'https://feeds.feedburner.com/ndtvnews-world-news',
      name: 'NDTV World',
      sourceUrl: 'https://www.ndtv.com/world-news',
      fallbackImage: '/src/assets/images/gulf_summit_riyadh_1792380285437.jpg',
    },
  ],
  world: [
    {
      url: 'https://www.france24.com/en/rss',
      name: 'France 24',
      sourceUrl: 'https://www.france24.com/en/',
      fallbackImage: '/src/assets/images/berlin_bundestag_plenary_1792380322998.jpg',
    },
    {
      url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
      name: 'The New York Times',
      sourceUrl: 'https://www.nytimes.com/section/world',
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
      url: 'https://feeds.feedburner.com/ndtvnews-india-news',
      name: 'NDTV India',
      sourceUrl: 'https://www.ndtv.com/india',
      fallbackImage: '/src/assets/images/india_parliament_news_1792118846447.jpg',
    },
    {
      url: 'https://feeds.bbci.co.uk/news/world/asia/india/rss.xml',
      name: 'BBC India & South Asia',
      sourceUrl: 'https://www.bbc.com/news/world/asia/india',
      fallbackImage: '/src/assets/images/india_election_rally_crowd_1792380255382.jpg',
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
      url: 'https://www.france24.com/en/business/rss',
      name: 'France 24 Business',
      sourceUrl: 'https://www.france24.com/en/business/',
      fallbackImage: '/src/assets/images/mexico_nearshoring_rail_1792380630439.jpg',
    },
    {
      url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml',
      name: 'NYT Business',
      sourceUrl: 'https://www.nytimes.com/section/business',
      fallbackImage: '/src/assets/images/geneva_trade_summit_1792380631472.jpg',
    },
    {
      url: 'https://www.theguardian.com/uk/business/rss',
      name: 'The Guardian Business',
      sourceUrl: 'https://www.theguardian.com/business',
      fallbackImage: '/src/assets/images/geopolitical_trade_port_1791859433200.jpg',
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
      url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
      name: 'NYT Technology',
      sourceUrl: 'https://www.nytimes.com/section/technology',
      fallbackImage: '/src/assets/images/semiconductor_cleanroom_1792002503650.jpg',
    },
    {
      url: 'https://www.theguardian.com/uk/technology/rss',
      name: 'The Guardian Tech',
      sourceUrl: 'https://www.theguardian.com/technology',
      fallbackImage: '/src/assets/images/clean_energy_offshore_1792002484185.jpg',
    },
  ],
  science: [
    {
      url: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
      name: 'BBC Science & Climate',
      sourceUrl: 'https://www.bbc.com/news/science_and_environment',
      fallbackImage: '/src/assets/images/clean_energy_offshore_1792002484185.jpg',
    },
    {
      url: 'https://rss.nytimes.com/services/xml/rss/nyt/Science.xml',
      name: 'NYT Science',
      sourceUrl: 'https://www.nytimes.com/section/science',
      fallbackImage: '/src/assets/images/clean_energy_offshore_1792002484185.jpg',
    },
  ],
};

function parseRssFeedArticles(xml: string, src: RssSourceConfig, lang: string, sourceIndex: number = 0): any[] {
  const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];
  const results: any[] = [];

  for (let i = 0; i < Math.min(itemMatches.length, 10); i++) {
    const itemXml = itemMatches[i];
    const titleRaw = itemXml.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '';
    const linkRaw = itemXml.match(/<link>([\s\S]*?)<\/link>/i)?.[1] || '';
    const descRaw = itemXml.match(/<description>([\s\S]*?)<\/description>/i)?.[1] || '';
    const pubDateRaw =
      itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1] ||
      itemXml.match(/<dc:date>([\s\S]*?)<\/dc:date>/i)?.[1] ||
      '';

    const title = stripXmlAndHtml(titleRaw);
    if (!title || title.length < 8) continue;

    const cleanLink = stripXmlAndHtml(linkRaw) || src.sourceUrl;
    const rawDescription = stripXmlAndHtml(descRaw)
      .replace(/Continue reading\.\.\.$/i, '')
      .trim();
    const description = rawDescription || title;

    let imageUrl = '';
    const mediaContents = [...itemXml.matchAll(/<media:content[^>]*url=["']([^"']+)["'][^>]*>/gi)];
    if (mediaContents.length > 0) {
      imageUrl = unescapeHtml(mediaContents[mediaContents.length - 1][1]);
    } else {
      const thumbMatch = itemXml.match(/<media:thumbnail[^>]*url=["']([^"']+)["']/i);
      if (thumbMatch?.[1]) {
        imageUrl = unescapeHtml(thumbMatch[1])
          .replace('/ace/standard/240/', '/ace/standard/800/')
          .replace('/ace/ws/240/', '/ace/ws/800/');
      } else {
        const enclosureMatch = itemXml.match(/<enclosure[^>]*url=["']([^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/i);
        if (enclosureMatch?.[1]) {
          imageUrl = unescapeHtml(enclosureMatch[1]);
        } else {
          const imgInDesc = itemXml.match(/<img[^>]*src=["'](https?:\/\/[^"']+)["']/i);
          if (imgInDesc?.[1]) {
            imageUrl = unescapeHtml(imgInDesc[1]);
          }
        }
      }
    }

    const hasRealImage = Boolean(imageUrl && imageUrl.startsWith('http'));
    if (!hasRealImage) {
      imageUrl = EDITORIAL_FALLBACK_IMAGES[(sourceIndex * 3 + i) % EDITORIAL_FALLBACK_IMAGES.length] || src.fallbackImage;
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
      _hasRealImage: hasRealImage,
    });
  }

  return results;
}

function interleaveBySource(lists: any[][], maxPerSource: number = 3): any[] {
  const orderedLists = lists.map((list) =>
    [...list].sort((a, b) => {
      const imgDiff = Number(Boolean(b._hasRealImage)) - Number(Boolean(a._hasRealImage));
      if (imgDiff !== 0) return imgDiff;
      return (b._ts || 0) - (a._ts || 0);
    })
  );

  const interleaved: any[] = [];
  for (let round = 0; round < maxPerSource; round++) {
    for (const list of orderedLists) {
      if (round < list.length) {
        interleaved.push(list[round]);
      }
    }
  }
  return interleaved;
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
    sources.map(async (src, idx) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);
        const r = await fetch(src.url, {
          signal: controller.signal,
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PoliticsWorldWire/2.0)' },
        });
        clearTimeout(timeout);
        if (!r.ok) return [];
        const xml = await r.text();
        return parseRssFeedArticles(xml, src, lang, idx);
      } catch {
        return [];
      }
    })
  );

  // Interleave across all agencies (BBC, France 24, NYT, The Guardian, NDTV) so one bureau never dominates!
  const balanced = interleaveBySource(fetchedLists, 3);
  const seenTitles = new Set<string>();
  const usedImages = new Set<string>();
  const unique: any[] = [];
  let fallbackCounter = 0;

  for (const item of balanced) {
    const key = item.title.toLowerCase().trim();
    if (seenTitles.has(key)) continue;
    seenTitles.add(key);

    let chosenImage = item.image;
    if (usedImages.has(chosenImage)) {
      chosenImage = EDITORIAL_FALLBACK_IMAGES[fallbackCounter % EDITORIAL_FALLBACK_IMAGES.length];
      fallbackCounter++;
    }
    usedImages.add(chosenImage);

    const { _ts, _hasRealImage, ...cleanArticle } = item;
    cleanArticle.image = chosenImage;
    unique.push(cleanArticle);
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

  // Combine & deduplicate while preserving multi-agency interleaved order (never let 1 agency monopolize)
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

// 5b. POLITICS WORLD Server-Side Publisher Security Vault (/api/publisher-auth/*)
const PUBLISHER_BRAND_NAME = 'POLITICS WORLD';
const PUBLISHER_OWNER_EMAIL = (process.env.PUBLISHER_OWNER_EMAIL || 'vrai74918@gmail.com').trim().toLowerCase();
const VAULT_FILE_PATH = path.resolve(__dirname, '.publisher-vault.json');
const VAULT_MAX_ATTEMPTS = 5;
const VAULT_LOCKOUT_MS = 5 * 60 * 1000;
const VAULT_TOKEN_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

interface ServerPublisherVault {
  brandName: string;
  ownerEmail: string;
  pinHash: string;
  pinSalt: string;
  recoveryHash: string;
  recoverySalt: string;
  securityQuestion: string;
  securityAnswerHash: string;
  securityAnswerSalt: string;
  hmacSecret: string;
  failedAttempts: number;
  lockoutUntil: number;
  updatedAtIso: string;
}

const WEAK_PUBLISHER_PINS = new Set([
  '0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999',
  '1234', '4321', '12345', '54321', '123456', '654321',
  '1947', '1950', '2024', '2025', '2026', '1212', '1122', '2580', '0852',
]);

function validateServerStrongPin(pin: string): { valid: boolean; reasonHi?: string; reasonEn?: string } {
  const clean = (pin || '').trim();
  if (!/^\d{4,8}$/.test(clean)) {
    return {
      valid: false,
      reasonHi: 'पिन केवल 4 से 8 अंकों (0–9) का होना चाहिए।',
      reasonEn: 'PIN must be 4 to 8 numeric digits (0–9).',
    };
  }
  if (WEAK_PUBLISHER_PINS.has(clean) || /^(\d)\1+$/.test(clean)) {
    return {
      valid: false,
      reasonHi: 'यह पिन बहुत आसान है (जैसे 1947, 1234 या समान अंक)। कृपया एक मजबूत पिन चुनें।',
      reasonEn: 'PIN is too predictable (e.g. 1947, 1234, or repeated digits). Choose a stronger PIN.',
    };
  }
  let isAsc = true;
  let isDesc = true;
  for (let i = 1; i < clean.length; i++) {
    const prev = Number(clean[i - 1]);
    const curr = Number(clean[i]);
    if (curr !== prev + 1) isAsc = false;
    if (curr !== prev - 1) isDesc = false;
  }
  if (isAsc || isDesc) {
    return {
      valid: false,
      reasonHi: 'क्रमिक अंक (जैसे 3456 या 7654) सुरक्षा कारणों से अमान्य हैं।',
      reasonEn: 'Sequential digits (e.g. 3456 or 7654) are not allowed for security.',
    };
  }
  return { valid: true };
}

function maskServerOwnerEmail(email: string = PUBLISHER_OWNER_EMAIL): string {
  const [local, domain] = email.split('@');
  if (!domain || local.length < 2) return '***';
  return `${local[0]}••••${local[local.length - 1]}@${domain}`;
}

function scryptHashSecret(value: string, salt: string): string {
  return crypto.scryptSync(value, salt, 64).toString('hex');
}

function timingSafeHexMatch(hexA: string, hexB: string): boolean {
  if (!hexA || !hexB || hexA.length !== hexB.length) return false;
  const bufA = Buffer.from(hexA, 'hex');
  const bufB = Buffer.from(hexB, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function generateServerRecoveryKey(): string {
  const hex = crypto.randomBytes(6).toString('hex').toUpperCase();
  return `PW-${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}`;
}

function readServerVault(): ServerPublisherVault | null {
  try {
    if (!fs.existsSync(VAULT_FILE_PATH)) return null;
    const raw = fs.readFileSync(VAULT_FILE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as ServerPublisherVault;
    if (!parsed?.pinHash || !parsed?.pinSalt || !parsed?.hmacSecret) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeServerVault(vault: ServerPublisherVault): void {
  fs.writeFileSync(VAULT_FILE_PATH, JSON.stringify(vault, null, 2), { encoding: 'utf8', mode: 0o600 });
}

function signPublisherSessionToken(vault: ServerPublisherVault): string {
  const payload = Buffer.from(
    JSON.stringify({
      brand: PUBLISHER_BRAND_NAME,
      owner: vault.ownerEmail,
      iat: Date.now(),
      exp: Date.now() + VAULT_TOKEN_TTL_MS,
      nonce: crypto.randomBytes(8).toString('hex'),
    })
  ).toString('base64url');
  const sig = crypto.createHmac('sha256', vault.hmacSecret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verifyPublisherSessionToken(token: string, vault: ServerPublisherVault): boolean {
  if (!token || !token.includes('.')) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expectedSig = crypto.createHmac('sha256', vault.hmacSecret).update(payload).digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return false;
  }
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (decoded.brand !== PUBLISHER_BRAND_NAME || decoded.owner !== vault.ownerEmail) return false;
    if (typeof decoded.exp !== 'number' || decoded.exp < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

function extractBearerToken(req: Request): string {
  const header = req.headers.authorization || '';
  if (header.toLowerCase().startsWith('bearer ')) {
    return header.slice(7).trim();
  }
  return '';
}

app.get('/api/publisher-auth/status', (req: Request, res: Response) => {
  const vault = readServerVault();
  const bearer = extractBearerToken(req);
  const now = Date.now();

  if (!vault) {
    return res.json({
      brandName: PUBLISHER_BRAND_NAME,
      initialized: false,
      ownerEmailMasked: maskServerOwnerEmail(),
      lockedRemainingSec: 0,
      sessionValid: false,
    });
  }

  const lockedRemainingSec =
    vault.lockoutUntil && vault.lockoutUntil > now ? Math.ceil((vault.lockoutUntil - now) / 1000) : 0;
  const sessionValid = bearer ? verifyPublisherSessionToken(bearer, vault) : false;

  return res.json({
    brandName: PUBLISHER_BRAND_NAME,
    initialized: true,
    ownerEmailMasked: maskServerOwnerEmail(vault.ownerEmail),
    securityQuestion: vault.securityQuestion,
    lockedRemainingSec,
    updatedAtIso: vault.updatedAtIso,
    sessionValid,
  });
});

app.post('/api/publisher-auth/setup', (req: Request, res: Response) => {
  const existing = readServerVault();
  if (existing) {
    return res.status(409).json({
      ok: false,
      errorHi: 'पब्लिशर सुरक्षा वॉल्ट पहले से सेट है। बदलाव के लिए Change PIN का उपयोग करें।',
      errorEn: 'Publisher security vault is already initialized. Use Change PIN instead.',
    });
  }

  const ownerEmail = String(req.body?.ownerEmail || '').trim().toLowerCase();
  const newPin = String(req.body?.newPin || '').trim();
  const securityQuestion = String(req.body?.securityQuestion || '').trim();
  const securityAnswer = String(req.body?.securityAnswer || '').trim().toLowerCase();

  if (ownerEmail !== PUBLISHER_OWNER_EMAIL) {
    return res.status(403).json({
      ok: false,
      errorHi: `अनधिकृत ईमेल! केवल पंजीकृत POLITICS WORLD स्वामी (${maskServerOwnerEmail()}) ही पिन सेट कर सकते हैं।`,
      errorEn: `Unauthorized email. Only the registered POLITICS WORLD owner (${maskServerOwnerEmail()}) can initialize the vault.`,
    });
  }

  const pinPolicy = validateServerStrongPin(newPin);
  if (!pinPolicy.valid) {
    return res.status(400).json({ ok: false, errorHi: pinPolicy.reasonHi, errorEn: pinPolicy.reasonEn });
  }

  if (securityQuestion.length < 5 || securityAnswer.length < 3) {
    return res.status(400).json({
      ok: false,
      errorHi: 'कृपया अपना निजी सुरक्षा प्रश्न (कम से कम 5 अक्षर) और गुप्त उत्तर (कम से कम 3 अक्षर) दर्ज करें।',
      errorEn: 'Please provide a personal security question (min 5 chars) and secret answer (min 3 chars).',
    });
  }

  const pinSalt = crypto.randomBytes(16).toString('hex');
  const pinHash = scryptHashSecret(`PW-PIN:${newPin}`, pinSalt);
  const recoveryKey = generateServerRecoveryKey();
  const recoverySalt = crypto.randomBytes(16).toString('hex');
  const recoveryHash = scryptHashSecret(`PW-REC:${recoveryKey.toUpperCase()}`, recoverySalt);
  const securityAnswerSalt = crypto.randomBytes(16).toString('hex');
  const securityAnswerHash = scryptHashSecret(`PW-ANS:${securityAnswer}`, securityAnswerSalt);
  const hmacSecret = crypto.randomBytes(32).toString('hex');

  const vault: ServerPublisherVault = {
    brandName: PUBLISHER_BRAND_NAME,
    ownerEmail: PUBLISHER_OWNER_EMAIL,
    pinHash,
    pinSalt,
    recoveryHash,
    recoverySalt,
    securityQuestion,
    securityAnswerHash,
    securityAnswerSalt,
    hmacSecret,
    failedAttempts: 0,
    lockoutUntil: 0,
    updatedAtIso: new Date().toISOString(),
  };

  writeServerVault(vault);
  const token = signPublisherSessionToken(vault);

  return res.json({
    ok: true,
    brandName: PUBLISHER_BRAND_NAME,
    token,
    recoveryKey,
    ownerEmailMasked: maskServerOwnerEmail(vault.ownerEmail),
    securityQuestion: vault.securityQuestion,
    updatedAtIso: vault.updatedAtIso,
  });
});

app.post('/api/publisher-auth/verify-pin', (req: Request, res: Response) => {
  const vault = readServerVault();
  if (!vault) {
    return res.status(404).json({
      ok: false,
      notInitialized: true,
      errorHi: 'पब्लिशर सुरक्षा वॉल्ट अभी सेट नहीं है।',
      errorEn: 'Publisher vault has not been initialized yet.',
    });
  }

  const now = Date.now();
  if (vault.lockoutUntil && vault.lockoutUntil > now) {
    return res.status(423).json({
      ok: false,
      lockedRemainingSec: Math.ceil((vault.lockoutUntil - now) / 1000),
    });
  }

  const enteredPin = String(req.body?.pin || '').trim();
  const candidateHash = scryptHashSecret(`PW-PIN:${enteredPin}`, vault.pinSalt);

  if (timingSafeHexMatch(candidateHash, vault.pinHash)) {
    vault.failedAttempts = 0;
    vault.lockoutUntil = 0;
    writeServerVault(vault);
    const token = signPublisherSessionToken(vault);
    return res.json({
      ok: true,
      brandName: PUBLISHER_BRAND_NAME,
      token,
      ownerEmailMasked: maskServerOwnerEmail(vault.ownerEmail),
      securityQuestion: vault.securityQuestion,
      updatedAtIso: vault.updatedAtIso,
    });
  }

  const nextFailures = (vault.failedAttempts || 0) + 1;
  const shouldLock = nextFailures >= VAULT_MAX_ATTEMPTS;
  vault.failedAttempts = shouldLock ? 0 : nextFailures;
  vault.lockoutUntil = shouldLock ? now + VAULT_LOCKOUT_MS : 0;
  writeServerVault(vault);

  return res.status(shouldLock ? 423 : 401).json({
    ok: false,
    lockedRemainingSec: shouldLock ? Math.ceil(VAULT_LOCKOUT_MS / 1000) : 0,
    attemptsRemaining: shouldLock ? 0 : VAULT_MAX_ATTEMPTS - nextFailures,
  });
});

app.post('/api/publisher-auth/change-pin', (req: Request, res: Response) => {
  const vault = readServerVault();
  if (!vault) {
    return res.status(404).json({
      ok: false,
      errorHi: 'पब्लिशर सुरक्षा वॉल्ट मौजूद नहीं है।',
      errorEn: 'Publisher vault not found.',
    });
  }

  const token = extractBearerToken(req);
  if (!verifyPublisherSessionToken(token, vault)) {
    return res.status(401).json({
      ok: false,
      errorHi: 'अमान्य या समाप्त सेशन। कृपया पुनः पिन से अनलॉक करें।',
      errorEn: 'Invalid or expired owner session. Please unlock again.',
    });
  }

  const now = Date.now();
  if (vault.lockoutUntil && vault.lockoutUntil > now) {
    return res.status(423).json({
      ok: false,
      lockedRemainingSec: Math.ceil((vault.lockoutUntil - now) / 1000),
      errorHi: 'लगातार गलत प्रयासों के कारण पिन परिवर्तन अस्थायी रूप से लॉक है।',
      errorEn: 'PIN changes temporarily locked due to repeated failed attempts.',
    });
  }

  const ownerEmail = String(req.body?.ownerEmail || '').trim().toLowerCase();
  const securityAnswer = String(req.body?.securityAnswer || '').trim().toLowerCase();
  const method = req.body?.method === 'recovery-key' ? 'recovery-key' : 'current-pin';
  const currentPin = String(req.body?.currentPin || '').trim();
  const recoveryKeyInput = String(req.body?.recoveryKey || '').trim().toUpperCase().replace(/\s+/g, '');
  const newPin = String(req.body?.newPin || '').trim();

  if (ownerEmail !== vault.ownerEmail) {
    const nextFailures = (vault.failedAttempts || 0) + 1;
    const shouldLock = nextFailures >= VAULT_MAX_ATTEMPTS;
    vault.failedAttempts = shouldLock ? 0 : nextFailures;
    vault.lockoutUntil = shouldLock ? now + VAULT_LOCKOUT_MS : 0;
    writeServerVault(vault);
    return res.status(403).json({
      ok: false,
      errorHi: `पंजीकृत POLITICS WORLD स्वामी ईमेल मेल नहीं खाता (${maskServerOwnerEmail(vault.ownerEmail)})।`,
      errorEn: `Registered POLITICS WORLD owner email does not match (${maskServerOwnerEmail(vault.ownerEmail)}).`,
    });
  }

  const answerHash = scryptHashSecret(`PW-ANS:${securityAnswer}`, vault.securityAnswerSalt);
  if (!timingSafeHexMatch(answerHash, vault.securityAnswerHash)) {
    const nextFailures = (vault.failedAttempts || 0) + 1;
    const shouldLock = nextFailures >= VAULT_MAX_ATTEMPTS;
    vault.failedAttempts = shouldLock ? 0 : nextFailures;
    vault.lockoutUntil = shouldLock ? now + VAULT_LOCKOUT_MS : 0;
    writeServerVault(vault);
    return res.status(403).json({
      ok: false,
      errorHi: 'निजी सुरक्षा प्रश्न का उत्तर गलत है।',
      errorEn: 'Private security question answer is incorrect.',
    });
  }

  if (method === 'current-pin') {
    const pinCheckHash = scryptHashSecret(`PW-PIN:${currentPin}`, vault.pinSalt);
    if (!timingSafeHexMatch(pinCheckHash, vault.pinHash)) {
      const nextFailures = (vault.failedAttempts || 0) + 1;
      const shouldLock = nextFailures >= VAULT_MAX_ATTEMPTS;
      vault.failedAttempts = shouldLock ? 0 : nextFailures;
      vault.lockoutUntil = shouldLock ? now + VAULT_LOCKOUT_MS : 0;
      writeServerVault(vault);
      return res.status(401).json({
        ok: false,
        errorHi: 'वर्तमान सुरक्षा पिन गलत है।',
        errorEn: 'Current security PIN is incorrect.',
      });
    }
  } else {
    const recHash = scryptHashSecret(`PW-REC:${recoveryKeyInput}`, vault.recoverySalt);
    if (!timingSafeHexMatch(recHash, vault.recoveryHash)) {
      const nextFailures = (vault.failedAttempts || 0) + 1;
      const shouldLock = nextFailures >= VAULT_MAX_ATTEMPTS;
      vault.failedAttempts = shouldLock ? 0 : nextFailures;
      vault.lockoutUntil = shouldLock ? now + VAULT_LOCKOUT_MS : 0;
      writeServerVault(vault);
      return res.status(401).json({
        ok: false,
        errorHi: 'अमान्य मास्टर रिकवरी कुंजी (Recovery Key)।',
        errorEn: 'Invalid Master Recovery Key.',
      });
    }
  }

  const pinPolicy = validateServerStrongPin(newPin);
  if (!pinPolicy.valid) {
    return res.status(400).json({ ok: false, errorHi: pinPolicy.reasonHi, errorEn: pinPolicy.reasonEn });
  }

  const newPinSalt = crypto.randomBytes(16).toString('hex');
  const newPinHash = scryptHashSecret(`PW-PIN:${newPin}`, newPinSalt);
  const newRecoveryKey = generateServerRecoveryKey();
  const newRecoverySalt = crypto.randomBytes(16).toString('hex');
  const newRecoveryHash = scryptHashSecret(`PW-REC:${newRecoveryKey.toUpperCase()}`, newRecoverySalt);

  vault.pinSalt = newPinSalt;
  vault.pinHash = newPinHash;
  vault.recoverySalt = newRecoverySalt;
  vault.recoveryHash = newRecoveryHash;
  vault.failedAttempts = 0;
  vault.lockoutUntil = 0;
  vault.updatedAtIso = new Date().toISOString();
  writeServerVault(vault);

  const refreshedToken = signPublisherSessionToken(vault);

  return res.json({
    ok: true,
    brandName: PUBLISHER_BRAND_NAME,
    token: refreshedToken,
    recoveryKey: newRecoveryKey,
    updatedAtIso: vault.updatedAtIso,
  });
});

app.post('/api/publisher-auth/recover-pin', (req: Request, res: Response) => {
  const vault = readServerVault();
  if (!vault) {
    return res.status(404).json({
      ok: false,
      errorHi: 'पब्लिशर सुरक्षा वॉल्ट अभी सेट नहीं है।',
      errorEn: 'Publisher vault not initialized.',
    });
  }

  const now = Date.now();
  if (vault.lockoutUntil && vault.lockoutUntil > now) {
    return res.status(423).json({
      ok: false,
      lockedRemainingSec: Math.ceil((vault.lockoutUntil - now) / 1000),
      errorHi: 'सुरक्षा लॉक सक्रिय है — कृपया कुछ समय बाद प्रयास करें।',
      errorEn: 'Vault locked due to failed attempts. Try again shortly.',
    });
  }

  const ownerEmail = String(req.body?.ownerEmail || '').trim().toLowerCase();
  const securityAnswer = String(req.body?.securityAnswer || '').trim().toLowerCase();
  const recoveryKeyInput = String(req.body?.recoveryKey || '').trim().toUpperCase().replace(/\s+/g, '');
  const newPin = String(req.body?.newPin || '').trim();

  if (ownerEmail !== vault.ownerEmail) {
    const nextFailures = (vault.failedAttempts || 0) + 1;
    const shouldLock = nextFailures >= VAULT_MAX_ATTEMPTS;
    vault.failedAttempts = shouldLock ? 0 : nextFailures;
    vault.lockoutUntil = shouldLock ? now + VAULT_LOCKOUT_MS : 0;
    writeServerVault(vault);
    return res.status(403).json({
      ok: false,
      errorHi: `पंजीकृत POLITICS WORLD स्वामी ईमेल गलत है (${maskServerOwnerEmail(vault.ownerEmail)})।`,
      errorEn: `Registered POLITICS WORLD owner email does not match (${maskServerOwnerEmail(vault.ownerEmail)}).`,
    });
  }

  const answerHash = scryptHashSecret(`PW-ANS:${securityAnswer}`, vault.securityAnswerSalt);
  const recHash = scryptHashSecret(`PW-REC:${recoveryKeyInput}`, vault.recoverySalt);
  if (!timingSafeHexMatch(answerHash, vault.securityAnswerHash) || !timingSafeHexMatch(recHash, vault.recoveryHash)) {
    const nextFailures = (vault.failedAttempts || 0) + 1;
    const shouldLock = nextFailures >= VAULT_MAX_ATTEMPTS;
    vault.failedAttempts = shouldLock ? 0 : nextFailures;
    vault.lockoutUntil = shouldLock ? now + VAULT_LOCKOUT_MS : 0;
    writeServerVault(vault);
    return res.status(401).json({
      ok: false,
      errorHi: 'मास्टर रिकवरी कुंजी या सुरक्षा प्रश्न का उत्तर गलत है।',
      errorEn: 'Master Recovery Key or security answer is incorrect.',
    });
  }

  const pinPolicy = validateServerStrongPin(newPin);
  if (!pinPolicy.valid) {
    return res.status(400).json({ ok: false, errorHi: pinPolicy.reasonHi, errorEn: pinPolicy.reasonEn });
  }

  const newPinSalt = crypto.randomBytes(16).toString('hex');
  const newPinHash = scryptHashSecret(`PW-PIN:${newPin}`, newPinSalt);
  const newRecoveryKey = generateServerRecoveryKey();
  const newRecoverySalt = crypto.randomBytes(16).toString('hex');
  const newRecoveryHash = scryptHashSecret(`PW-REC:${newRecoveryKey.toUpperCase()}`, newRecoverySalt);

  vault.pinSalt = newPinSalt;
  vault.pinHash = newPinHash;
  vault.recoverySalt = newRecoverySalt;
  vault.recoveryHash = newRecoveryHash;
  vault.failedAttempts = 0;
  vault.lockoutUntil = 0;
  vault.updatedAtIso = new Date().toISOString();
  writeServerVault(vault);

  const token = signPublisherSessionToken(vault);

  return res.json({
    ok: true,
    brandName: PUBLISHER_BRAND_NAME,
    token,
    recoveryKey: newRecoveryKey,
    ownerEmailMasked: maskServerOwnerEmail(vault.ownerEmail),
    securityQuestion: vault.securityQuestion,
    updatedAtIso: vault.updatedAtIso,
  });
});

// 5c. POLITICS WORLD Automated Self-Serve Ad Slot Engine (/api/ads/*)
type ServerAdSlotKey =
  | 'header'
  | 'in-article'
  | 'sponsored-article'
  | 'multimedia-feature'
  | 'sponsored-wire'
  | 'magazine';
type ServerDurationKey = '1-week' | '1-month' | '3-months' | '1-year';

const AD_DB_FILE_PATH = path.resolve(__dirname, '.ad-campaigns-db.json');

const SERVER_SLOT_CONFIG: Record<
  ServerAdSlotKey,
  {
    title: string;
    /** Canonical India Domestic Market Rates in INR (₹) */
    rates: Record<ServerDurationKey, number>;
  }
> = {
  header: {
    title: 'National Header Leaderboard Billboard (970×250 & 728×90)',
    rates: { '1-week': 10000, '1-month': 25000, '3-months': 65000, '1-year': 220000 },
  },
  'in-article': {
    title: 'In-Article National Editorial Unit',
    rates: { '1-week': 5000, '1-month': 12000, '3-months': 32000, '1-year': 110000 },
  },
  'sponsored-article': {
    title: 'Sponsored National Editorial Story',
    rates: { '1-week': 8000, '1-month': 22000, '3-months': 58000, '1-year': 195000 },
  },
  'multimedia-feature': {
    title: 'Multimedia Feature & AI Voice Dossier',
    rates: { '1-week': 15000, '1-month': 42000, '3-months': 110000, '1-year': 360000 },
  },
  'sponsored-wire': {
    title: 'National Press Release Wire',
    rates: { '1-week': 8000, '1-month': 22000, '3-months': 58000, '1-year': 195000 },
  },
  magazine: {
    title: 'Notebook Magazine Masthead Box (India Edition)',
    rates: { '1-week': 15000, '1-month': 40000, '3-months': 105000, '1-year': 350000 },
  },
};

const DURATION_DAYS_MAP: Record<ServerDurationKey, number> = {
  '1-week': 7,
  '1-month': 30,
  '3-months': 90,
  '1-year': 365,
};

interface ServerLiveAdSlot {
  slotKey: ServerAdSlotKey;
  brandName: string;
  headline: string;
  bannerUrl: string;
  targetUrl: string;
  durationKey: ServerDurationKey;
  durationDays: number;
  bookingId: string;
  paymentStatus: 'verified';
  status: 'active' | 'expired' | 'paused';
  activatedAtIso: string;
  expiresAtIso: string;
  expiresAtMs: number;
}

interface ServerAdBooking extends ServerLiveAdSlot {
  contactPerson: string;
  advertiserEmail: string;
  advertiserPhone: string;
  clientType: 'b2b' | 'b2c';
  currency: 'INR';
  gstin: string;
  billingAddress: string;
  baseAmount: number;
  gstAmount: number;
  grandTotal: number;
  paymentMethod: string;
  paymentReference: string;
  invoiceNumber: string;
  createdAtIso: string;
}

interface SlotTelemetryRecord {
  bookingId: string;
  slotKey: ServerAdSlotKey;
  brandName: string;
  headline?: string;
  impressions: number;
  uniqueSessions: number;
  seenSessionHashes?: string[];
  clicks: number;
  states: Record<string, number>;
  devices: Record<'Mobile' | 'Desktop' | 'Tablet', number>;
  languages: Record<string, number>;
  activatedAtIso?: string;
  expiresAtIso?: string;
  durationDays?: number;
  status?: 'Active' | 'Completed';
  lastEventAtIso: string;
}

interface CampaignEmailDeliveryStatus {
  status: 'sent' | 'webhook-dispatched' | 'pending-config' | 'failed';
  recipientMasked: string;
  attemptedAtIso: string;
  provider: string;
  messageId?: string;
  note: string;
}

interface CampaignCompletionReport {
  reportId: string;
  bookingId: string;
  invoiceNumber: string;
  paymentReference: string;
  slotKey: ServerAdSlotKey;
  slotTitle: string;
  brandName: string;
  campaignTitle: string;
  targetUrl: string;
  startDateIso: string;
  endDateIso: string;
  durationDays: number;
  status: 'Completed';
  totalImpressions: number;
  uniqueSessions: number;
  totalClicks: number;
  ctrPct: string;
  indiaStatesReachedCount: number;
  states: Record<string, number>;
  devices: Record<'Mobile' | 'Desktop' | 'Tablet', number>;
  languages: Record<string, number>;
  generatedAtIso: string;
  triggerReason: 'duration-elapsed' | 'owner-completed';
  emailDelivery: CampaignEmailDeliveryStatus;
}

interface AudiencePulseStats {
  totalResponses: number;
  ageBrackets: Record<string, number>;
  states: Record<string, number>;
  updatedAtIso: string;
}

interface ServerAdDatabase {
  slots: Partial<Record<ServerAdSlotKey, ServerLiveAdSlot>>;
  bookings: ServerAdBooking[];
  invoiceSeq: number;
  telemetry: Record<string, SlotTelemetryRecord>;
  completionReports: Record<string, CampaignCompletionReport>;
  audiencePulse: AudiencePulseStats;
}

const INDIA_STATE_CODE_MAP: Record<string, string> = {
  AN: 'Andaman & Nicobar',
  AP: 'Andhra Pradesh',
  AR: 'Arunachal Pradesh',
  AS: 'Assam',
  BR: 'Bihar',
  CH: 'Chandigarh',
  CT: 'Chhattisgarh',
  CG: 'Chhattisgarh',
  DN: 'Dadra & Nagar Haveli and Daman & Diu',
  DD: 'Dadra & Nagar Haveli and Daman & Diu',
  DL: 'Delhi',
  GA: 'Goa',
  GJ: 'Gujarat',
  HR: 'Haryana',
  HP: 'Himachal Pradesh',
  JK: 'Jammu & Kashmir',
  JH: 'Jharkhand',
  KA: 'Karnataka',
  KL: 'Kerala',
  LA: 'Ladakh',
  LD: 'Lakshadweep',
  MP: 'Madhya Pradesh',
  MH: 'Maharashtra',
  MN: 'Manipur',
  ML: 'Meghalaya',
  MZ: 'Mizoram',
  NL: 'Nagaland',
  OR: 'Odisha',
  OD: 'Odisha',
  PY: 'Puducherry',
  PB: 'Punjab',
  RJ: 'Rajasthan',
  SK: 'Sikkim',
  TN: 'Tamil Nadu',
  TG: 'Telangana',
  TS: 'Telangana',
  TR: 'Tripura',
  UP: 'Uttar Pradesh',
  UK: 'Uttarakhand',
  UT: 'Uttarakhand',
  WB: 'West Bengal',
};

const VALID_INDIA_STATES = new Set<string>(Object.values(INDIA_STATE_CODE_MAP));
const VALID_AGE_BRACKETS = new Set<string>(['18-24', '25-34', '35-44', '45-54', '55+']);

function resolveReaderRegionLabel(
  req: Request,
  clientTimeZone?: string,
  optInState?: string
): string {
  const country = String(
    req.headers['x-appengine-country'] ||
      req.headers['cf-ipcountry'] ||
      req.headers['x-vercel-ip-country'] ||
      ''
  )
    .trim()
    .toUpperCase();

  const rawRegion = String(
    req.headers['x-appengine-region'] ||
      req.headers['cf-region-code'] ||
      req.headers['x-vercel-ip-country-region'] ||
      req.headers['x-geo-region'] ||
      ''
  )
    .trim()
    .toUpperCase()
    .replace(/^IN-/, '');

  if ((!country || country === 'IN') && rawRegion && INDIA_STATE_CODE_MAP[rawRegion]) {
    return INDIA_STATE_CODE_MAP[rawRegion];
  }

  const normalizedOptIn = String(optInState || '').trim();
  if (normalizedOptIn && VALID_INDIA_STATES.has(normalizedOptIn)) {
    return normalizedOptIn;
  }

  const city = String(req.headers['x-appengine-city'] || req.headers['cf-ipcity'] || '').trim();
  if (country === 'IN' && city && city !== '?') {
    return `India (${city})`;
  }

  if (country && country !== 'IN' && country !== 'ZZ' && country !== 'XX') {
    return `Global (${country})`;
  }

  const tz = String(clientTimeZone || '').trim();
  const acceptLang = String(req.headers['accept-language'] || '').toLowerCase();
  if (country === 'IN' || tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta' || acceptLang.includes('-in')) {
    return 'Pan-India / Unspecified Region';
  }

  return 'Pan-India / Unspecified Region';
}

function countDistinctIndianStates(states: Record<string, number>): number {
  let count = 0;
  for (const [label, views] of Object.entries(states || {})) {
    if (views > 0 && !label.startsWith('Global (')) {
      count += 1;
    }
  }
  return count;
}

function maskAdvertiserEmail(email: string): string {
  const clean = String(email || '').trim();
  const at = clean.indexOf('@');
  if (at <= 1) return 'advertiser@••••';
  return `${clean[0]}••••${clean.slice(at - 1)}`;
}

function isEmailAutomationConfigured(): { configured: boolean; mode: 'resend' | 'webhook' | 'none' } {
  if (String(process.env.RESEND_API_KEY || '').trim()) {
    return { configured: true, mode: 'resend' };
  }
  if (String(process.env.AD_REPORT_EMAIL_WEBHOOK_URL || '').trim()) {
    return { configured: true, mode: 'webhook' };
  }
  return { configured: false, mode: 'none' };
}

function buildCompletionEmailPayload(report: CampaignCompletionReport) {
  const startStr = new Date(report.startDateIso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
  const endStr = new Date(report.endDateIso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });

  const sortedStates = Object.entries(report.states || {}).sort((a, b) => b[1] - a[1]);
  const stateLinesText =
    sortedStates.length > 0
      ? sortedStates.map(([st, cnt]) => `  - ${st}: ${cnt.toLocaleString('en-IN')} impressions`).join('\n')
      : '  - Pan-India / Unspecified Region: 0 impressions recorded';

  const subject = `[Politics World] Campaign Completion & India Reach Report — ${report.brandName} (${report.invoiceNumber})`;

  const text = [
    `POLITICS WORLD INDIA MEDIA DESK`,
    `CAMPAIGN COMPLETION & ALL-INDIA REACH REPORT`,
    `============================================================`,
    `Report ID        : ${report.reportId}`,
    `Advertiser       : ${report.brandName}`,
    `Campaign Title   : ${report.campaignTitle}`,
    `Ad Placement     : ${report.slotTitle}`,
    `Booking Ref      : ${report.bookingId}`,
    `Tax Invoice Ref  : ${report.invoiceNumber}`,
    `Campaign Window  : ${startStr} to ${endStr} (${report.durationDays} Days)`,
    `Campaign Status  : ${report.status}`,
    ``,
    `REACH & ENGAGEMENT SUMMARY`,
    `--------------------------`,
    `Total Impressions      : ${report.totalImpressions.toLocaleString('en-IN')}`,
    `Unique Viewer Sessions : ${report.uniqueSessions.toLocaleString('en-IN')}`,
    `Verified Clicks        : ${report.totalClicks.toLocaleString('en-IN')} (${report.ctrPct}% CTR)`,
    `Indian States Reached  : ${report.indiaStatesReachedCount}`,
    ``,
    `STATE-WISE VIEW BREAKDOWN ACROSS INDIA`,
    `--------------------------------------`,
    stateLinesText,
    ``,
    `Legal Notice: Issued under Legal Gazette Article VII (SAC 998363).`,
  ].join('\n');

  const stateRowsHtml =
    sortedStates.length > 0
      ? sortedStates
          .map(
            ([st, cnt]) =>
              `<tr><td style="padding:6px 10px;border-bottom:1px solid #e2e8f0;">${st}</td><td style="padding:6px 10px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:bold;">${cnt.toLocaleString('en-IN')}</td></tr>`
          )
          .join('')
      : `<tr><td colspan="2" style="padding:8px 10px;color:#64748b;">No impressions recorded during this campaign window.</td></tr>`;

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:640px;margin:0 auto;background:#070e24;color:#e2e8f0;border:1px solid #1e293b;border-radius:10px;overflow:hidden;">
      <div style="padding:20px 24px;border-bottom:3px solid #f59e0b;background:#040816;">
        <div style="font-size:11px;letter-spacing:1.5px;color:#fbbf24;font-weight:700;text-transform:uppercase;">Politics World India Media Desk</div>
        <h2 style="margin:6px 0 2px;font-size:18px;color:#ffffff;">Campaign Completion &amp; India Reach Report</h2>
        <div style="font-size:12px;color:#94a3b8;">${report.brandName} · ${report.invoiceNumber} · ${report.bookingId}</div>
      </div>
      <div style="padding:20px 24px;background:#ffffff;color:#0f172a;">
        <p style="margin:0 0 12px;font-size:13px;"><strong>Campaign:</strong> ${report.campaignTitle}<br/><strong>Window:</strong> ${startStr} to ${endStr} (${report.durationDays} Days) · <strong>Status:</strong> Completed</p>
        <table style="width:100%;border-collapse:collapse;margin:12px 0;font-size:13px;">
          <tr>
            <td style="padding:10px;background:#f8fafc;border:1px solid #e2e8f0;"><strong>Total Impressions</strong><br/>${report.totalImpressions.toLocaleString('en-IN')}</td>
            <td style="padding:10px;background:#f8fafc;border:1px solid #e2e8f0;"><strong>Unique Sessions</strong><br/>${report.uniqueSessions.toLocaleString('en-IN')}</td>
            <td style="padding:10px;background:#f8fafc;border:1px solid #e2e8f0;"><strong>States Reached</strong><br/>${report.indiaStatesReachedCount}</td>
          </tr>
        </table>
        <h3 style="margin:16px 0 8px;font-size:14px;">State-Wise Reach Breakdown Across India</h3>
        <table style="width:100%;border-collapse:collapse;font-size:12px;border:1px solid #e2e8f0;">
          <thead><tr style="background:#f1f5f9;"><th style="padding:6px 10px;text-align:left;">Indian State / Region</th><th style="padding:6px 10px;text-align:right;">Impressions</th></tr></thead>
          <tbody>${stateRowsHtml}</tbody>
        </table>
      </div>
    </div>
  `.trim();

  return { subject, text, html };
}

async function dispatchCompletionReportEmail(
  bookingId: string,
  recipientEmail: string
): Promise<CampaignEmailDeliveryStatus> {
  const dbData = readAdDatabase();
  const report = dbData.completionReports[bookingId];
  const attemptedAtIso = new Date().toISOString();
  const recipientMasked = maskAdvertiserEmail(recipientEmail);

  if (!report) {
    return {
      status: 'failed',
      recipientMasked,
      attemptedAtIso,
      provider: 'None',
      note: 'Completion report record not found.',
    };
  }

  const resendKey = String(process.env.RESEND_API_KEY || '').trim();
  const webhookUrl = String(process.env.AD_REPORT_EMAIL_WEBHOOK_URL || '').trim();
  const fromEmail =
    String(process.env.REPORT_FROM_EMAIL || '').trim() ||
    'Politics World India Desk <onboarding@resend.dev>';

  const { subject, text, html } = buildCompletionEmailPayload(report);

  let delivery: CampaignEmailDeliveryStatus;

  if (resendKey && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
    try {
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [recipientEmail],
          subject,
          text,
          html,
        }),
      });
      const respJson: any = await resp.json().catch(() => ({}));
      if (resp.ok) {
        delivery = {
          status: 'sent',
          recipientMasked,
          attemptedAtIso,
          provider: 'Resend Email API',
          messageId: respJson?.id || undefined,
          note: `Completion reach report automatically emailed to ${recipientMasked}.`,
        };
      } else {
        delivery = {
          status: 'failed',
          recipientMasked,
          attemptedAtIso,
          provider: 'Resend Email API',
          note: String(respJson?.message || `Email API responded with HTTP ${resp.status}`).slice(0, 180),
        };
      }
    } catch (err: any) {
      delivery = {
        status: 'failed',
        recipientMasked,
        attemptedAtIso,
        provider: 'Resend Email API',
        note: String(err?.message || 'Network error dispatching completion email.').slice(0, 180),
      };
    }
  } else if (webhookUrl && /^https?:\/\//i.test(webhookUrl)) {
    try {
      const webhookSecret = String(process.env.AD_REPORT_WEBHOOK_SECRET || '').trim();
      const resp = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(webhookSecret ? { 'X-Webhook-Secret': webhookSecret } : {}),
        },
        body: JSON.stringify({
          event: 'campaign.completed',
          to: recipientEmail,
          subject,
          text,
          html,
          report,
        }),
      });
      if (resp.ok) {
        delivery = {
          status: 'webhook-dispatched',
          recipientMasked,
          attemptedAtIso,
          provider: 'Configured Email Webhook',
          note: `Completion report dispatched to email relay webhook for ${recipientMasked}.`,
        };
      } else {
        delivery = {
          status: 'failed',
          recipientMasked,
          attemptedAtIso,
          provider: 'Configured Email Webhook',
          note: `Email webhook returned HTTP ${resp.status}.`,
        };
      }
    } catch (err: any) {
      delivery = {
        status: 'failed',
        recipientMasked,
        attemptedAtIso,
        provider: 'Configured Email Webhook',
        note: String(err?.message || 'Webhook dispatch failed.').slice(0, 180),
      };
    }
  } else {
    delivery = {
      status: 'pending-config',
      recipientMasked,
      attemptedAtIso,
      provider: 'Server Relay Hook Ready',
      note: 'Report generated. Set RESEND_API_KEY or AD_REPORT_EMAIL_WEBHOOK_URL in Environment Secrets to auto-deliver email.',
    };
  }

  const latestDb = readAdDatabaseRaw();
  if (latestDb.completionReports[bookingId]) {
    latestDb.completionReports[bookingId].emailDelivery = delivery;
    writeAdDatabase(latestDb);
  }

  return delivery;
}

function detectClientDeviceType(userAgent: string): 'Mobile' | 'Tablet' | 'Desktop' {
  const ua = (userAgent || '').toLowerCase();
  if (/ipad|tablet|playbook|silk|(android(?!.*mobi))/.test(ua)) return 'Tablet';
  if (/mobi|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/.test(ua)) return 'Mobile';
  return 'Desktop';
}

function createEmptyAudiencePulse(): AudiencePulseStats {
  return {
    totalResponses: 0,
    ageBrackets: { '18-24': 0, '25-34': 0, '35-44': 0, '45-54': 0, '55+': 0 },
    states: {},
    updatedAtIso: '',
  };
}

function readAdDatabaseRaw(): ServerAdDatabase {
  try {
    if (fs.existsSync(AD_DB_FILE_PATH)) {
      const raw = fs.readFileSync(AD_DB_FILE_PATH, 'utf8');
      const parsed = JSON.parse(raw) as Partial<ServerAdDatabase>;
      return {
        slots: parsed.slots || {},
        bookings: Array.isArray(parsed.bookings) ? parsed.bookings : [],
        invoiceSeq: typeof parsed.invoiceSeq === 'number' ? parsed.invoiceSeq : 104,
        telemetry: parsed.telemetry && typeof parsed.telemetry === 'object' ? parsed.telemetry : {},
        completionReports:
          parsed.completionReports && typeof parsed.completionReports === 'object'
            ? parsed.completionReports
            : {},
        audiencePulse:
          parsed.audiencePulse && typeof parsed.audiencePulse === 'object'
            ? {
                totalResponses: Number(parsed.audiencePulse.totalResponses) || 0,
                ageBrackets: {
                  '18-24': 0,
                  '25-34': 0,
                  '35-44': 0,
                  '45-54': 0,
                  '55+': 0,
                  ...(parsed.audiencePulse.ageBrackets || {}),
                },
                states: parsed.audiencePulse.states || {},
                updatedAtIso: parsed.audiencePulse.updatedAtIso || '',
              }
            : createEmptyAudiencePulse(),
      };
    }
  } catch {
    // fallback
  }
  return {
    slots: {},
    bookings: [],
    invoiceSeq: 104,
    telemetry: {},
    completionReports: {},
    audiencePulse: createEmptyAudiencePulse(),
  };
}

function buildCompletionReportFromSources(
  dbData: ServerAdDatabase,
  bookingId: string,
  triggerReason: 'duration-elapsed' | 'owner-completed',
  nowMs: number
): { report: CampaignCompletionReport; advertiserEmail: string } | null {
  const booking = dbData.bookings.find((b) => b.bookingId === bookingId);
  const activeOrExpiredSlot = (Object.values(dbData.slots) as Array<ServerLiveAdSlot | undefined>).find(
    (s) => s?.bookingId === bookingId
  );
  const src = booking || activeOrExpiredSlot;
  if (!src) return null;

  const rec = dbData.telemetry[bookingId];
  const impressions = Number(rec?.impressions || 0);
  const uniqueSessions = Number(rec?.uniqueSessions || (impressions > 0 ? impressions : 0));
  const clicks = Number(rec?.clicks || 0);
  const ctrPct = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00';
  const states = rec?.states || {};
  const advertiserEmail = booking?.advertiserEmail || 'vrai74918@gmail.com';
  const nowIso = new Date(nowMs).toISOString();
  const autoEmailCfg = isEmailAutomationConfigured();

  const report: CampaignCompletionReport = {
    reportId: `RPT-${bookingId.replace(/^BK-/, '')}`,
    bookingId,
    invoiceNumber: booking?.invoiceNumber || 'VERIFIED-SLIP',
    paymentReference: booking?.paymentReference || 'DIRECT-VERIFIED',
    slotKey: src.slotKey,
    slotTitle: SERVER_SLOT_CONFIG[src.slotKey]?.title || src.slotKey,
    brandName: src.brandName,
    campaignTitle: src.headline || `${src.brandName} · ${SERVER_SLOT_CONFIG[src.slotKey]?.title || src.slotKey}`,
    targetUrl: src.targetUrl,
    startDateIso: src.activatedAtIso,
    endDateIso: triggerReason === 'owner-completed' && src.expiresAtMs > nowMs ? nowIso : src.expiresAtIso,
    durationDays: src.durationDays,
    status: 'Completed',
    totalImpressions: impressions,
    uniqueSessions,
    totalClicks: clicks,
    ctrPct,
    indiaStatesReachedCount: countDistinctIndianStates(states),
    states,
    devices: rec?.devices || { Mobile: 0, Desktop: 0, Tablet: 0 },
    languages: rec?.languages || {},
    generatedAtIso: nowIso,
    triggerReason,
    emailDelivery: {
      status: autoEmailCfg.configured ? 'pending-config' : 'pending-config',
      recipientMasked: maskAdvertiserEmail(advertiserEmail),
      attemptedAtIso: nowIso,
      provider: autoEmailCfg.configured ? 'Dispatching...' : 'Server Relay Hook Ready',
      note: autoEmailCfg.configured
        ? 'Dispatching completion report email...'
        : 'Report generated. Set RESEND_API_KEY or AD_REPORT_EMAIL_WEBHOOK_URL in Environment Secrets to auto-deliver email.',
    },
  };

  return { report, advertiserEmail };
}

function processCampaignCompletions(dbData: ServerAdDatabase, nowMs: number): Array<{ bookingId: string; email: string }> {
  let changed = false;
  const newlyCompletedEmails: Array<{ bookingId: string; email: string }> = [];

  for (const key of Object.keys(dbData.slots) as ServerAdSlotKey[]) {
    const slot = dbData.slots[key];
    if (slot && slot.status === 'active' && slot.expiresAtMs <= nowMs) {
      slot.status = 'expired';
      changed = true;
    }
  }

  // Check all bookings whose duration has elapsed and do not yet have a completion report
  for (const booking of dbData.bookings) {
    if (booking.expiresAtMs <= nowMs) {
      if (booking.status === 'active') {
        booking.status = 'expired';
        changed = true;
      }
      if (!dbData.completionReports[booking.bookingId]) {
        const built = buildCompletionReportFromSources(dbData, booking.bookingId, 'duration-elapsed', nowMs);
        if (built) {
          dbData.completionReports[booking.bookingId] = built.report;
          if (dbData.telemetry[booking.bookingId]) {
            dbData.telemetry[booking.bookingId].status = 'Completed';
          }
          changed = true;
          newlyCompletedEmails.push({ bookingId: booking.bookingId, email: built.advertiserEmail });
        }
      }
    }
  }

  if (changed) {
    writeAdDatabase(dbData);
  }
  return newlyCompletedEmails;
}

function readAdDatabase(): ServerAdDatabase {
  const dbData = readAdDatabaseRaw();
  const newlyCompleted = processCampaignCompletions(dbData, Date.now());
  for (const item of newlyCompleted) {
    void dispatchCompletionReportEmail(item.bookingId, item.email);
  }
  return dbData;
}

function writeAdDatabase(dbData: ServerAdDatabase): void {
  fs.writeFileSync(AD_DB_FILE_PATH, JSON.stringify(dbData, null, 2), { encoding: 'utf8', mode: 0o600 });
}

function isOwnerAuthorized(req: Request): boolean {
  const vault = readServerVault();
  if (!vault) return false;
  const bearer = extractBearerToken(req);
  return bearer ? verifyPublisherSessionToken(bearer, vault) : false;
}

app.get('/api/ads/slots', (_req: Request, res: Response) => {
  const dbData = readAdDatabase();
  const now = Date.now();
  const activeSlots: Partial<Record<ServerAdSlotKey, ServerLiveAdSlot | null>> = {};
  for (const key of Object.keys(SERVER_SLOT_CONFIG) as ServerAdSlotKey[]) {
    const entry = dbData.slots[key];
    if (entry && entry.status === 'active' && entry.expiresAtMs > now) {
      activeSlots[key] = entry;
    } else {
      activeSlots[key] = null;
    }
  }
  return res.json({
    ok: true,
    serverTimeMs: now,
    slots: activeSlots,
  });
});

app.get('/api/ads/bookings', (req: Request, res: Response) => {
  if (!isOwnerAuthorized(req)) {
    return res.status(401).json({
      ok: false,
      errorHi: 'केवल सत्यापित पब्लिशर स्वामी ही बुकिंग रिकॉर्ड देख सकते हैं।',
      errorEn: 'Publisher owner authentication required.',
    });
  }
  const dbData = readAdDatabase();
  return res.json({
    ok: true,
    bookings: dbData.bookings,
  });
});

app.post('/api/ads/upload-banner', (req: Request, res: Response) => {
  try {
    const slotKey = String(req.body?.slotKey || 'header') as ServerAdSlotKey;
    if (!(slotKey in SERVER_SLOT_CONFIG)) {
      return res.status(400).json({ ok: false, errorEn: 'Invalid ad slot key.', errorHi: 'अमान्य विज्ञापन स्लॉट।' });
    }

    const dataUrl = String(req.body?.dataBase64 || req.body?.dataUrl || '').trim();
    const match = dataUrl.match(/^data:(image\/(?:png|jpeg|jpg|webp|gif));base64,([A-Za-z0-9+/=]+)$/i);
    if (!match) {
      return res.status(400).json({
        ok: false,
        errorHi: 'केवल PNG, JPG, WEBP या GIF बैनर इमेज ही अपलोड करें।',
        errorEn: 'Only valid PNG, JPG, WEBP, or GIF banner images are accepted.',
      });
    }

    const mime = match[1].toLowerCase();
    const rawBase64 = match[2];
    const buffer = Buffer.from(rawBase64, 'base64');
    if (buffer.length === 0 || buffer.length > 4 * 1024 * 1024) {
      return res.status(400).json({
        ok: false,
        errorHi: 'इमेज फ़ाइल 4 MB से कम होनी चाहिए।',
        errorEn: 'Banner image size must be under 4 MB.',
      });
    }

    fs.mkdirSync(AD_BANNERS_DIR, { recursive: true });
    const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : mime.includes('gif') ? 'gif' : 'jpg';
    const fileId = `${slotKey}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`;
    const destPath = path.join(AD_BANNERS_DIR, fileId);
    fs.writeFileSync(destPath, buffer);

    return res.json({
      ok: true,
      bannerUrl: `/uploads/ad-banners/${fileId}`,
      bytes: buffer.length,
    });
  } catch (err: any) {
    return res.status(500).json({
      ok: false,
      errorHi: 'बैनर अपलोड करने में त्रुटि हुई।',
      errorEn: err?.message || 'Banner upload failed.',
    });
  }
});

app.post('/api/ads/checkout/verify', (req: Request, res: Response) => {
  const slotKey = String(req.body?.slotKey || '') as ServerAdSlotKey;
  const durationKey = String(req.body?.durationKey || '1-month') as ServerDurationKey;
  const brandName = String(req.body?.brandName || '').trim().slice(0, 120);
  const contactPerson = String(req.body?.contactPerson || '').trim().slice(0, 120);
  const advertiserEmail = String(req.body?.advertiserEmail || '').trim().slice(0, 150);
  const advertiserPhone = String(req.body?.advertiserPhone || '').trim().slice(0, 30);
  const rawClientType = String(req.body?.clientType || 'b2b').trim().toLowerCase();
  const rawCurrency = String(req.body?.currency || 'INR').trim().toUpperCase();
  const gstin = String(req.body?.gstin || '').trim().toUpperCase().slice(0, 30);
  const billingAddress = String(req.body?.billingAddress || '').trim().slice(0, 220);
  const headline = String(req.body?.headline || '').trim().slice(0, 180);
  const bannerUrl = String(req.body?.bannerUrl || '').trim();
  const targetUrl = String(req.body?.targetUrl || '').trim();
  const paymentMethod = String(req.body?.paymentMethod || 'Corporate UPI / BharatQR (INR)').trim().slice(0, 60);
  const paymentReference = String(req.body?.paymentReference || '').trim().slice(0, 120);

  if (!(slotKey in SERVER_SLOT_CONFIG)) {
    return res.status(400).json({ ok: false, errorHi: 'अमान्य विज्ञापन स्लॉट चुना गया।', errorEn: 'Invalid ad slot selected.' });
  }
  if (!(durationKey in DURATION_DAYS_MAP)) {
    return res.status(400).json({ ok: false, errorHi: 'अमान्य अभियान अवधि।', errorEn: 'Invalid campaign duration.' });
  }
  if (rawCurrency !== 'INR') {
    return res.status(400).json({
      ok: false,
      errorHi: 'केवल भारतीय रुपया (INR ₹) में घरेलू विज्ञापन बुकिंग स्वीकार्य है।',
      errorEn: 'Only India domestic INR (₹) currency is accepted for advertising orders.',
    });
  }
  if (rawClientType !== 'b2b' && rawClientType !== 'b2c') {
    return res.status(400).json({
      ok: false,
      errorHi: 'केवल भारतीय B2B (GSTIN) या B2C (URP) ग्राहक प्रकार मान्य हैं।',
      errorEn: 'Only India domestic B2B (GSTIN) or B2C (URP) client types are accepted.',
    });
  }
  const clientType: 'b2b' | 'b2c' = rawClientType;
  const currency: 'INR' = 'INR';

  if (clientType === 'b2b' && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin)) {
    return res.status(400).json({
      ok: false,
      errorHi: 'B2B GST इनवॉइस के लिए मान्य 15-अंकीय भारतीय GSTIN दर्ज करें (उदा. 07AAACM1234D1Z5)।',
      errorEn: 'A valid 15-character Indian GSTIN (e.g., 07AAACM1234D1Z5) is required for B2B GST invoicing.',
    });
  }
  if (brandName.length < 2) {
    return res.status(400).json({ ok: false, errorHi: 'ब्रांड या कंपनी का नाम दर्ज करें।', errorEn: 'Please enter a valid brand/company name.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(advertiserEmail)) {
    return res.status(400).json({ ok: false, errorHi: 'मान्य कार्य ईमेल पता दर्ज करें।', errorEn: 'Please provide a valid work email address.' });
  }
  if (!/^(\/uploads\/ad-banners\/|https?:\/\/).+/i.test(bannerUrl) || bannerUrl.length > 1024) {
    return res.status(400).json({
      ok: false,
      errorHi: 'कृपया पहले अपना कस्टम बैनर पोस्टर अपलोड करें।',
      errorEn: 'Please upload your custom banner poster image before payment.',
    });
  }
  if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(targetUrl) || targetUrl.length > 1024) {
    return res.status(400).json({
      ok: false,
      errorHi: 'कृपया https:// से शुरू होने वाला मान्य डेस्टिनेशन वेबसाइट URL दर्ज करें।',
      errorEn: 'Please enter a valid target website URL starting with https:// or http://.',
    });
  }
  if (paymentReference.length < 6) {
    return res.status(400).json({
      ok: false,
      errorHi: 'भुगतान सत्यापन UTR / ट्रांज़ैक्शन संदर्भ (कम से कम 6 अक्षर) दर्ज करें।',
      errorEn: 'Please provide a valid UTR / UPI payment verification reference (minimum 6 characters).',
    });
  }

  const dbData = readAdDatabase();
  const now = Date.now();
  const currentSlot = dbData.slots[slotKey];
  const ownerOverride = isOwnerAuthorized(req);

  const isTemporaryDemoSlot = Boolean(currentSlot?.headline?.includes('[DEMO TEST]'));

  if (currentSlot && currentSlot.status === 'active' && currentSlot.expiresAtMs > now && !ownerOverride && !isTemporaryDemoSlot) {
    return res.status(409).json({
      ok: false,
      errorHi: `यह स्लॉट अभी ${currentSlot.brandName} द्वारा बुक है (समाप्ति: ${new Date(currentSlot.expiresAtMs).toLocaleDateString('en-IN')})।`,
      errorEn: `This slot is currently occupied by ${currentSlot.brandName} until ${new Date(currentSlot.expiresAtMs).toLocaleDateString('en-IN')}.`,
    });
  }

  const slotCfg = SERVER_SLOT_CONFIG[slotKey];
  const durationDays = DURATION_DAYS_MAP[durationKey];
  const baseAmount = slotCfg.rates[durationKey];
  const gstAmount = Math.round(baseAmount * 0.18);
  const grandTotal = baseAmount + gstAmount;

  dbData.invoiceSeq = (dbData.invoiceSeq || 104) + 1;
  const invoiceNumber = `PW/TAX-INV/2026-27/${dbData.invoiceSeq}`;
  const bookingId = `BK-${slotKey.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6)}-${Date.now()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

  const activatedAtIso = new Date(now).toISOString();
  const expiresAtMs = now + durationDays * 24 * 60 * 60 * 1000;
  const expiresAtIso = new Date(expiresAtMs).toISOString();

  const liveSlot: ServerLiveAdSlot = {
    slotKey,
    brandName,
    headline: headline || `${brandName} · ${slotCfg.title}`,
    bannerUrl,
    targetUrl,
    durationKey,
    durationDays,
    bookingId,
    paymentStatus: 'verified',
    status: 'active',
    activatedAtIso,
    expiresAtIso,
    expiresAtMs,
  };

  const booking: ServerAdBooking = {
    ...liveSlot,
    contactPerson: contactPerson || brandName,
    advertiserEmail,
    advertiserPhone,
    clientType,
    currency,
    gstin: clientType === 'b2b' ? gstin : 'URP-B2C',
    billingAddress,
    baseAmount,
    gstAmount,
    grandTotal,
    paymentMethod,
    paymentReference,
    invoiceNumber,
    createdAtIso: activatedAtIso,
  };

  dbData.slots[slotKey] = liveSlot;
  dbData.bookings.unshift(booking);
  dbData.telemetry[bookingId] = {
    bookingId,
    slotKey,
    brandName,
    headline: liveSlot.headline,
    impressions: 0,
    uniqueSessions: 0,
    seenSessionHashes: [],
    clicks: 0,
    states: {},
    devices: { Mobile: 0, Desktop: 0, Tablet: 0 },
    languages: {},
    activatedAtIso,
    expiresAtIso,
    durationDays,
    status: 'Active',
    lastEventAtIso: activatedAtIso,
  };
  writeAdDatabase(dbData);

  return res.json({
    ok: true,
    verified: true,
    liveSlot,
    booking,
  });
});

app.post('/api/ads/slots/:slotKey/clear', (req: Request, res: Response) => {
  if (!isOwnerAuthorized(req)) {
    return res.status(401).json({
      ok: false,
      errorHi: 'स्लॉट खाली करने के लिए पब्लिशर पिन से अनलॉक आवश्यक है।',
      errorEn: 'Publisher Desk verification is required to clear a live slot.',
    });
  }
  const slotKey = String(req.params.slotKey || '') as ServerAdSlotKey;
  if (!(slotKey in SERVER_SLOT_CONFIG)) {
    return res.status(400).json({ ok: false, errorEn: 'Invalid slot key.' });
  }
  const dbData = readAdDatabase();
  if (dbData.slots[slotKey]) {
    dbData.slots[slotKey] = {
      ...dbData.slots[slotKey]!,
      status: 'expired',
      expiresAtMs: Date.now() - 1000,
      expiresAtIso: new Date(Date.now() - 1000).toISOString(),
    };
    writeAdDatabase(dbData);
  }
  return res.json({ ok: true, slotKey });
});

app.post('/api/ads/telemetry/event', express.text({ type: 'text/plain', limit: '32kb' }), (req: Request, res: Response) => {
  try {
    let payload: any = req.body;
    if (typeof payload === 'string') {
      payload = JSON.parse(payload);
    }
    const eventType = payload?.type === 'click' ? 'click' : 'impression';
    const slotKey = String(payload?.slotKey || '') as ServerAdSlotKey;
    const bookingId = String(payload?.bookingId || '').trim().slice(0, 100);
    const langCode = String(payload?.langCode || 'en').trim().toLowerCase().slice(0, 8) || 'en';
    const clientTz = String(payload?.timeZone || '').trim().slice(0, 64);
    const rawSessionId = String(payload?.sessionId || '').trim().slice(0, 80);
    const optInState = String(payload?.readerState || '').trim().slice(0, 60);

    if (!(slotKey in SERVER_SLOT_CONFIG) || !bookingId) {
      return res.status(400).json({ ok: false });
    }

    const dbData = readAdDatabase();
    const activeSlot = dbData.slots[slotKey];
    if (!activeSlot || activeSlot.status !== 'active' || activeSlot.bookingId !== bookingId) {
      return res.json({ ok: false, ignored: true });
    }

    const nowIso = new Date().toISOString();
    const existing: SlotTelemetryRecord = dbData.telemetry[bookingId] || {
      bookingId,
      slotKey,
      brandName: activeSlot.brandName,
      headline: activeSlot.headline,
      impressions: 0,
      uniqueSessions: 0,
      seenSessionHashes: [],
      clicks: 0,
      states: {},
      devices: { Mobile: 0, Desktop: 0, Tablet: 0 },
      languages: {},
      activatedAtIso: activeSlot.activatedAtIso,
      expiresAtIso: activeSlot.expiresAtIso,
      durationDays: activeSlot.durationDays,
      status: 'Active',
      lastEventAtIso: nowIso,
    };

    const regionLabel = resolveReaderRegionLabel(req, clientTz, optInState);
    const deviceType = detectClientDeviceType(String(req.headers['user-agent'] || ''));

    if (eventType === 'click') {
      existing.clicks += 1;
    } else {
      existing.impressions += 1;
      existing.states[regionLabel] = (existing.states[regionLabel] || 0) + 1;
      existing.devices[deviceType] = (existing.devices[deviceType] || 0) + 1;
      existing.languages[langCode] = (existing.languages[langCode] || 0) + 1;

      if (rawSessionId) {
        const sessionHash = crypto
          .createHash('sha256')
          .update(`${bookingId}:${rawSessionId}`)
          .digest('hex')
          .slice(0, 16);
        const hashes = Array.isArray(existing.seenSessionHashes) ? existing.seenSessionHashes : [];
        if (!hashes.includes(sessionHash)) {
          existing.uniqueSessions = (existing.uniqueSessions || 0) + 1;
          hashes.push(sessionHash);
          if (hashes.length > 4000) {
            hashes.splice(0, hashes.length - 4000);
          }
          existing.seenSessionHashes = hashes;
        }
      } else {
        existing.uniqueSessions = existing.uniqueSessions || existing.impressions;
      }
    }
    existing.status = 'Active';
    existing.lastEventAtIso = nowIso;

    dbData.telemetry[bookingId] = existing;
    writeAdDatabase(dbData);

    return res.json({ ok: true });
  } catch {
    return res.status(400).json({ ok: false });
  }
});

app.post('/api/audience/pulse', (req: Request, res: Response) => {
  const ageBracket = String(req.body?.ageBracket || '').trim();
  const stateName = String(req.body?.stateName || '').trim();

  if (!VALID_AGE_BRACKETS.has(ageBracket) || !VALID_INDIA_STATES.has(stateName)) {
    return res.status(400).json({
      ok: false,
      errorHi: 'कृपया मान्य भारतीय राज्य और आयु वर्ग चुनें।',
      errorEn: 'Please choose a valid Indian state and age group.',
    });
  }

  const dbData = readAdDatabase();
  const pulse = dbData.audiencePulse || createEmptyAudiencePulse();
  pulse.totalResponses += 1;
  pulse.ageBrackets[ageBracket] = (pulse.ageBrackets[ageBracket] || 0) + 1;
  pulse.states[stateName] = (pulse.states[stateName] || 0) + 1;
  pulse.updatedAtIso = new Date().toISOString();
  dbData.audiencePulse = pulse;
  writeAdDatabase(dbData);

  return res.json({
    ok: true,
    audiencePulse: pulse,
  });
});

function resolveGa4MeasurementId(): string {
  const raw = String(process.env.GA_MEASUREMENT_ID || process.env.VITE_GA_MEASUREMENT_ID || '').trim();
  return /^G-[A-Z0-9]{4,}$/i.test(raw) ? raw.toUpperCase() : '';
}

app.get('/api/analytics/ga4-config', (_req: Request, res: Response) => {
  const measurementId = resolveGa4MeasurementId();
  const ga4Configured = Boolean(measurementId);
  return res.json({
    ok: true,
    ga4Configured,
    measurementId: ga4Configured ? measurementId : null,
    maskedId: ga4Configured ? `${measurementId.slice(0, 4)}••••${measurementId.slice(-3)}` : null,
  });
});

app.get('/api/ads/telemetry/summary', (_req: Request, res: Response) => {
  const dbData = readAdDatabase();
  const now = Date.now();
  const ga4Configured = Boolean(resolveGa4MeasurementId());
  const emailAutomation = isEmailAutomationConfigured();

  const slotSummaries: Record<string, any> = {};
  for (const key of Object.keys(SERVER_SLOT_CONFIG) as ServerAdSlotKey[]) {
    const slot = dbData.slots[key];
    if (!slot || slot.status !== 'active' || slot.expiresAtMs <= now) {
      slotSummaries[key] = null;
      continue;
    }
    const rec = dbData.telemetry[slot.bookingId] || {
      bookingId: slot.bookingId,
      slotKey: key,
      brandName: slot.brandName,
      impressions: 0,
      uniqueSessions: 0,
      clicks: 0,
      states: {},
      devices: { Mobile: 0, Desktop: 0, Tablet: 0 },
      languages: {},
      lastEventAtIso: slot.activatedAtIso,
    };
    const matchingBooking = dbData.bookings.find((b) => b.bookingId === slot.bookingId);
    const ctrPct = rec.impressions > 0 ? ((rec.clicks / rec.impressions) * 100).toFixed(2) : '0.00';

    slotSummaries[key] = {
      bookingId: slot.bookingId,
      invoiceNumber: matchingBooking?.invoiceNumber || 'VERIFIED-SLIP',
      paymentReference: matchingBooking?.paymentReference || 'DIRECT-VERIFIED',
      slotKey: key,
      slotTitle: SERVER_SLOT_CONFIG[key].title,
      brandName: slot.brandName,
      campaignTitle: slot.headline || `${slot.brandName} · ${SERVER_SLOT_CONFIG[key].title}`,
      targetUrl: slot.targetUrl,
      activatedAtIso: slot.activatedAtIso,
      expiresAtIso: slot.expiresAtIso,
      durationDays: slot.durationDays,
      status: 'Active',
      impressions: rec.impressions,
      uniqueSessions: rec.uniqueSessions || rec.impressions,
      clicks: rec.clicks,
      ctrPct,
      indiaStatesReachedCount: countDistinctIndianStates(rec.states),
      states: rec.states,
      devices: rec.devices,
      languages: rec.languages,
      lastEventAtIso: rec.lastEventAtIso,
    };
  }

  return res.json({
    ok: true,
    ga4Configured,
    emailAutomation,
    completionReportsCount: Object.keys(dbData.completionReports || {}).length,
    serverTimeIso: new Date(now).toISOString(),
    slotSummaries,
    audiencePulse: dbData.audiencePulse || createEmptyAudiencePulse(),
  });
});

app.get('/api/ads/reports', (req: Request, res: Response) => {
  const dbData = readAdDatabase();
  const now = Date.now();
  const owner = isOwnerAuthorized(req);
  const emailAutomation = isEmailAutomationConfigured();

  const seenBookingIds = new Set<string>();
  const campaigns: any[] = [];

  for (const booking of dbData.bookings) {
    seenBookingIds.add(booking.bookingId);
    const existingReport = dbData.completionReports[booking.bookingId];
    const slotEntry = dbData.slots[booking.slotKey];
    const isSlotActiveForThisBooking = Boolean(
      slotEntry &&
        slotEntry.bookingId === booking.bookingId &&
        slotEntry.status === 'active' &&
        slotEntry.expiresAtMs > now
    );
    const isCompleted = Boolean(existingReport) || !isSlotActiveForThisBooking;
    const rec = dbData.telemetry[booking.bookingId];
    const totalImpressions = existingReport ? existingReport.totalImpressions : Number(rec?.impressions || 0);
    const uniqueSessions = existingReport
      ? existingReport.uniqueSessions
      : Number(rec?.uniqueSessions || totalImpressions);
    const totalClicks = existingReport ? existingReport.totalClicks : Number(rec?.clicks || 0);
    const ctrPct =
      existingReport?.ctrPct ||
      (totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00');
    const states = existingReport?.states || rec?.states || {};

    campaigns.push({
      reportId: existingReport?.reportId || `RPT-${booking.bookingId.replace(/^BK-/, '')}`,
      bookingId: booking.bookingId,
      invoiceNumber: booking.invoiceNumber || 'VERIFIED-SLIP',
      paymentReference: booking.paymentReference || 'DIRECT-VERIFIED',
      slotKey: booking.slotKey,
      slotTitle: SERVER_SLOT_CONFIG[booking.slotKey]?.title || booking.slotKey,
      brandName: booking.brandName,
      campaignTitle:
        existingReport?.campaignTitle ||
        booking.headline ||
        `${booking.brandName} · ${SERVER_SLOT_CONFIG[booking.slotKey]?.title || booking.slotKey}`,
      targetUrl: booking.targetUrl,
      startDateIso: existingReport?.startDateIso || booking.activatedAtIso,
      endDateIso: existingReport?.endDateIso || booking.expiresAtIso,
      durationDays: booking.durationDays,
      status: isCompleted ? 'Completed' : 'Active',
      totalImpressions,
      uniqueSessions,
      totalClicks,
      ctrPct,
      indiaStatesReachedCount: countDistinctIndianStates(states),
      states,
      devices: existingReport?.devices || rec?.devices || { Mobile: 0, Desktop: 0, Tablet: 0 },
      languages: existingReport?.languages || rec?.languages || {},
      generatedAtIso: existingReport?.generatedAtIso || null,
      triggerReason: existingReport?.triggerReason || null,
      advertiserEmailDisplay: owner ? booking.advertiserEmail : maskAdvertiserEmail(booking.advertiserEmail),
      emailDelivery: existingReport?.emailDelivery || {
        status: 'pending-config',
        recipientMasked: maskAdvertiserEmail(booking.advertiserEmail),
        attemptedAtIso: '',
        provider: emailAutomation.configured ? 'Scheduled on Completion' : 'Server Relay Hook Ready',
        note: isCompleted
          ? 'Ready to generate or dispatch completion report.'
          : 'Auto-dispatches upon campaign end date or manual completion.',
      },
    });
  }

  for (const key of Object.keys(dbData.slots) as ServerAdSlotKey[]) {
    const slot = dbData.slots[key];
    if (!slot || seenBookingIds.has(slot.bookingId)) continue;
    const rec = dbData.telemetry[slot.bookingId];
    const totalImpressions = Number(rec?.impressions || 0);
    const totalClicks = Number(rec?.clicks || 0);
    const states = rec?.states || {};
    campaigns.push({
      reportId: `RPT-${slot.bookingId.replace(/^BK-/, '')}`,
      bookingId: slot.bookingId,
      invoiceNumber: 'VERIFIED-SLIP',
      paymentReference: 'DIRECT-VERIFIED',
      slotKey: slot.slotKey,
      slotTitle: SERVER_SLOT_CONFIG[slot.slotKey]?.title || slot.slotKey,
      brandName: slot.brandName,
      campaignTitle: slot.headline || `${slot.brandName} · ${SERVER_SLOT_CONFIG[slot.slotKey]?.title || slot.slotKey}`,
      targetUrl: slot.targetUrl,
      startDateIso: slot.activatedAtIso,
      endDateIso: slot.expiresAtIso,
      durationDays: slot.durationDays,
      status: slot.status === 'active' && slot.expiresAtMs > now ? 'Active' : 'Completed',
      totalImpressions,
      uniqueSessions: Number(rec?.uniqueSessions || totalImpressions),
      totalClicks,
      ctrPct: totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00',
      indiaStatesReachedCount: countDistinctIndianStates(states),
      states,
      devices: rec?.devices || { Mobile: 0, Desktop: 0, Tablet: 0 },
      languages: rec?.languages || {},
      generatedAtIso: null,
      triggerReason: null,
      advertiserEmailDisplay: 'v••••8@gmail.com',
      emailDelivery: null,
    });
  }

  return res.json({
    ok: true,
    emailAutomation,
    ga4Configured: Boolean(resolveGa4MeasurementId()),
    serverTimeIso: new Date(now).toISOString(),
    campaigns,
    audiencePulse: dbData.audiencePulse || createEmptyAudiencePulse(),
  });
});

app.post('/api/ads/campaigns/:bookingId/complete', async (req: Request, res: Response) => {
  if (!isOwnerAuthorized(req)) {
    return res.status(401).json({
      ok: false,
      errorHi: 'अभियान समाप्त घोषित करने के लिए पब्लिशर स्वामी प्रमाणीकरण आवश्यक है।',
      errorEn: 'Publisher Desk verification is required to mark a campaign completed.',
    });
  }

  const bookingId = String(req.params.bookingId || '').trim();
  const dbData = readAdDatabaseRaw();
  const now = Date.now();
  const booking = dbData.bookings.find((b) => b.bookingId === bookingId);

  if (!booking) {
    return res.status(404).json({
      ok: false,
      errorHi: 'यह अभियान बुकिंग आईडी रिकॉर्ड में नहीं मिली।',
      errorEn: 'Campaign booking ID not found.',
    });
  }

  const slot = dbData.slots[booking.slotKey];
  if (slot && slot.bookingId === bookingId && slot.status === 'active') {
    slot.status = 'expired';
    slot.expiresAtMs = now - 1000;
    slot.expiresAtIso = new Date(now).toISOString();
  }
  booking.status = 'expired';
  if (dbData.telemetry[bookingId]) {
    dbData.telemetry[bookingId].status = 'Completed';
  }

  const built = buildCompletionReportFromSources(dbData, bookingId, 'owner-completed', now);
  if (!built) {
    return res.status(500).json({ ok: false, errorEn: 'Failed to generate completion report.' });
  }

  dbData.completionReports[bookingId] = built.report;
  writeAdDatabase(dbData);

  const delivery = await dispatchCompletionReportEmail(bookingId, built.advertiserEmail);
  const updatedDb = readAdDatabaseRaw();

  return res.json({
    ok: true,
    report: updatedDb.completionReports[bookingId] || built.report,
    emailDelivery: delivery,
  });
});

app.post('/api/ads/reports/:bookingId/resend-email', async (req: Request, res: Response) => {
  if (!isOwnerAuthorized(req)) {
    return res.status(401).json({
      ok: false,
      errorHi: 'रिपोर्ट ईमेल पुनः भेजने के लिए पब्लिशर स्वामी प्रमाणीकरण आवश्यक है।',
      errorEn: 'Publisher Desk verification is required to resend completion emails.',
    });
  }

  const bookingId = String(req.params.bookingId || '').trim();
  const dbData = readAdDatabaseRaw();
  const booking = dbData.bookings.find((b) => b.bookingId === bookingId);
  if (!booking) {
    return res.status(404).json({ ok: false, errorEn: 'Campaign booking not found.' });
  }

  if (!dbData.completionReports[bookingId]) {
    const built = buildCompletionReportFromSources(dbData, bookingId, 'owner-completed', Date.now());
    if (built) {
      dbData.completionReports[bookingId] = built.report;
      writeAdDatabase(dbData);
    }
  }

  const emailDelivery = await dispatchCompletionReportEmail(bookingId, booking.advertiserEmail);
  const updatedDb = readAdDatabaseRaw();
  return res.json({
    ok: true,
    emailDelivery,
    report: updatedDb.completionReports[bookingId] || null,
  });
});

// =========================================================================
// LIVE DAILY MARKET RADAR API (NSE NIFTY 50, SENSEX, USD/INR, GOLD, BRENT)
// =========================================================================
let marketRadarCache: { fetchedAtMs: number; istDayKey: string; payload: any } | null = null;
const MARKET_RADAR_TTL_MS = 60 * 1000;

async function fetchYahooQuote(symbol: string): Promise<{ price: number; prevClose: number } | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PoliticsWorldNews/1.0)' },
      signal: AbortSignal.timeout(4500),
    });
    if (!r.ok) return null;
    const data = (await r.json()) as any;
    const meta = data?.chart?.result?.[0]?.meta;
    const price = Number(meta?.regularMarketPrice);
    const prevClose = Number(meta?.chartPreviousClose ?? meta?.previousClose ?? price);
    if (!Number.isFinite(price) || price <= 0) return null;
    return {
      price,
      prevClose: Number.isFinite(prevClose) && prevClose > 0 ? prevClose : price,
    };
  } catch {
    return null;
  }
}

async function fetchOpenExchangeUsdInr(): Promise<number | null> {
  try {
    const r = await fetch('https://open.er-api.com/v6/latest/USD', {
      signal: AbortSignal.timeout(4500),
    });
    if (!r.ok) return null;
    const data = (await r.json()) as any;
    const rate = Number(data?.rates?.INR);
    return Number.isFinite(rate) && rate > 0 ? rate : null;
  } catch {
    return null;
  }
}

function formatPctDelta(price: number, prevClose: number): { change: string; isPositive: boolean; isNeutral: boolean } {
  if (!prevClose || prevClose <= 0) {
    return { change: '⇄ 0.00%', isPositive: true, isNeutral: true };
  }
  const pct = ((price - prevClose) / prevClose) * 100;
  const absPct = Math.abs(pct);
  if (absPct < 0.01) {
    return { change: '⇄ 0.00%', isPositive: true, isNeutral: true };
  }
  const isPositive = pct >= 0;
  return {
    change: `${isPositive ? '▲ +' : '▼ -'}${absPct.toFixed(2)}%`,
    isPositive,
    isNeutral: false,
  };
}

app.get('/api/market/radar', async (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  const now = new Date();
  const istDayKey = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const forceRefresh = req.query.refresh === '1' || req.query.refresh === 'true';

  if (
    !forceRefresh &&
    marketRadarCache &&
    marketRadarCache.istDayKey === istDayKey &&
    Date.now() - marketRadarCache.fetchedAtMs < MARKET_RADAR_TTL_MS
  ) {
    return res.json(marketRadarCache.payload);
  }

  const [niftyRes, sensexRes, inrRes, brentRes, goldRes, openFxRes] = await Promise.allSettled([
    fetchYahooQuote('^NSEI'),
    fetchYahooQuote('^BSESN'),
    fetchYahooQuote('INR=X'),
    fetchYahooQuote('BZ=F'),
    fetchYahooQuote('GC=F'),
    fetchOpenExchangeUsdInr(),
  ]);

  const nifty = niftyRes.status === 'fulfilled' ? niftyRes.value : null;
  const sensex = sensexRes.status === 'fulfilled' ? sensexRes.value : null;
  const usdInrYahoo = inrRes.status === 'fulfilled' ? inrRes.value : null;
  const brent = brentRes.status === 'fulfilled' ? brentRes.value : null;
  const gold = goldRes.status === 'fulfilled' ? goldRes.value : null;
  const openInrRate = openFxRes.status === 'fulfilled' ? openFxRes.value : null;

  const usdInrQuote =
    usdInrYahoo ||
    (openInrRate ? { price: openInrRate, prevClose: openInrRate } : null);

  const items: Array<{
    name: string;
    symbol: string;
    price: string;
    change: string;
    isPositive: boolean;
    isNeutral?: boolean;
  }> = [];

  if (nifty) {
    const d = formatPctDelta(nifty.price, nifty.prevClose);
    items.push({
      name: 'NIFTY 50',
      symbol: 'NSE',
      price: nifty.price.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
      ...d,
    });
  }

  if (usdInrQuote) {
    const d = formatPctDelta(usdInrQuote.price, usdInrQuote.prevClose);
    items.push({
      name: 'USD / INR',
      symbol: 'FX',
      price: `₹${usdInrQuote.price.toFixed(2)}`,
      ...d,
    });
  }

  if (gold) {
    const d = formatPctDelta(gold.price, gold.prevClose);
    items.push({
      name: 'GOLD SPOT',
      symbol: 'XAU',
      price: `$${Math.round(gold.price).toLocaleString('en-US')}`,
      ...d,
    });
  }

  if (brent) {
    const d = formatPctDelta(brent.price, brent.prevClose);
    items.push({
      name: 'BRENT CRUDE',
      symbol: 'OIL',
      price: `$${brent.price.toFixed(2)}`,
      ...d,
    });
  }

  if (sensex) {
    const d = formatPctDelta(sensex.price, sensex.prevClose);
    items.push({
      name: 'SENSEX',
      symbol: 'BSE',
      price: sensex.price.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
      ...d,
    });
  }

  const dayStr = now
    .toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' })
    .toUpperCase();

  const payload = {
    ok: true,
    isLiveFeed: items.length > 0,
    dateLabel: `TODAY ${dayStr}`,
    statusLabel: items.length > 0 ? 'LIVE MARKET FEED · IST' : 'DAILY MARKET SNAPSHOT',
    updatedAtIso: now.toISOString(),
    items,
  };

  if (items.length > 0) {
    marketRadarCache = {
      fetchedAtMs: Date.now(),
      istDayKey,
      payload,
    };
  } else if (marketRadarCache) {
    return res.json(marketRadarCache.payload);
  }

  return res.json(payload);
});

// =========================================================================
// LIVE CAPITOL & INDIAN PARLIAMENTARY BILL TRACKER (/api/bills/live)
// Sources: PRS Legislative Research (prsindia.org/billtrack) & US Congress.gov RSS
// =========================================================================
interface LiveBillItem {
  id: string;
  billNumber: string;
  title: string;
  chamber: string;
  jurisdiction: 'india' | 'senate' | 'house';
  status: string;
  stageProgress: number;
  summary: string;
  nextMilestone: string;
  sourceName: string;
  sourceUrl: string;
  publishedLabel: string;
}

const billsLiveCache: { fetchedAtMs: number; istDayKey: string; payload: any } = {
  fetchedAtMs: 0,
  istDayKey: '',
  payload: null,
};
const BILLS_LIVE_TTL_MS = 15 * 60 * 1000;

function fixBrokenUtf8(text: string): string {
  return unescapeHtml(text)
    .replace(/â€™/g, "'")
    .replace(/â€˜/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€\x9d|â€/g, '"')
    .replace(/â€“|â€”/g, '—')
    .replace(/\s+/g, ' ')
    .trim();
}

function mapStatusToStageProgress(status: string): number {
  const s = status.toLowerCase();
  if (s.includes('signed') || s.includes('enacted') || s.includes('assent')) return 100;
  if (s.includes('presented to president') || s.includes('passed')) return 92;
  if (s.includes('reconciliation') || s.includes('floor') || s.includes('pending')) return 68;
  if (s.includes('committee')) return 52;
  if (s.includes('withdrawn') || s.includes('lapsed')) return 15;
  return 60;
}

async function fetchPrsIndiaBills(): Promise<LiveBillItem[]> {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 7000);
    const r = await fetch('https://prsindia.org/billtrack', {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PoliticsWorldNews/1.0)' },
    });
    clearTimeout(t);
    if (!r.ok) return [];
    const html = await r.text();

    const rows = html.split(/<div class="views-row">/i).slice(1);
    const results: LiveBillItem[] = [];
    const seen = new Set<string>();

    for (const row of rows) {
      const linkMatch = row.match(/<a[^>]+href="(\/billtrack\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
      if (!linkMatch) continue;
      const href = linkMatch[1].trim();
      const title = fixBrokenUtf8(linkMatch[2].replace(/<[^>]+>/g, ''));
      if (!title || title.length < 10 || seen.has(href)) continue;
      // Only formal Parliamentary Bills (exclude administrative Rules notices)
      if (!/\bbill\b/i.test(title)) continue;
      seen.add(href);

      const statusMatch = row.match(/views-field-field-bill-status[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/i);
      const rawStatus = statusMatch ? fixBrokenUtf8(statusMatch[1].replace(/<[^>]+>/g, '')) : 'Pending in Parliament';
      const status = rawStatus || 'Pending in Parliament';
      const stageProgress = mapStatusToStageProgress(status);

      const idxNum = results.length + 1;
      const yearMatch = title.match(/\b(20\d{2})\b/);
      const billYear = yearMatch ? yearMatch[1] : '2026';

      results.push({
        id: `prs-${href.replace(/[^a-z0-9]+/gi, '-').slice(0, 48)}`,
        billNumber: `SANSAD-${billYear}-${String(idxNum).padStart(2, '0')}`,
        title,
        chamber: 'India Parliament (Sansad)',
        jurisdiction: 'india',
        status,
        stageProgress,
        summary: `Tracked live from PRS Legislative Research (New Delhi). Official status in the Indian Parliament: ${status}.`,
        nextMilestone:
          status.toLowerCase() === 'passed'
            ? 'Passed by Parliament · Awaiting Presidential Assent / Gazette Notification.'
            : status.toLowerCase().includes('committee')
              ? 'Under Standing Committee scrutiny before House floor consideration.'
              : 'Listed on the active Lok Sabha / Rajya Sabha legislative docket.',
        sourceName: 'PRS India BillTrack',
        sourceUrl: `https://prsindia.org${href}`,
        publishedLabel: `India Parliament · ${billYear}`,
      });

      if (results.length >= 6) break;
    }

    return results;
  } catch {
    return [];
  }
}

async function fetchCongressGovBills(): Promise<LiveBillItem[]> {
  const results: LiveBillItem[] = [];
  const seen = new Set<string>();

  // 1. Bills Presented to the President (latest passed legislation)
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 6000);
    const r = await fetch('https://www.congress.gov/rss/presented-to-president.xml', {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PoliticsWorldNews/1.0)' },
    });
    clearTimeout(t);
    if (r.ok) {
      const xml = await r.text();
      const pubDate = fixBrokenUtf8(xml.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1] || '');
      const items = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];
      for (const itemXml of items.slice(0, 2)) {
        const billNum = fixBrokenUtf8(itemXml.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
        const descRaw = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i)?.[1]
          || itemXml.match(/<description>([\s\S]*?)<\/description>/i)?.[1]
          || '';
        const billTitle = fixBrokenUtf8(descRaw.replace(/<[^>]+>/g, ''));
        const link = fixBrokenUtf8(itemXml.match(/<link>([\s\S]*?)<\/link>/i)?.[1] || 'https://www.congress.gov');
        if (!billNum || !billTitle || seen.has(billNum)) continue;
        seen.add(billNum);

        const isSenate = /^s\./i.test(billNum);
        results.push({
          id: `cg-${billNum.toLowerCase().replace(/[^a-z0-9]+/g, '')}`,
          billNumber: billNum,
          title: billTitle,
          chamber: isSenate ? 'U.S. Senate' : 'U.S. House of Representatives',
          jurisdiction: isSenate ? 'senate' : 'house',
          status: 'Presented to President',
          stageProgress: 94,
          summary: `Passed both chambers of the U.S. Congress and formally presented to the White House (${pubDate || 'Current Session'}).`,
          nextMilestone: 'Awaiting Presidential signature or executive action.',
          sourceName: 'Congress.gov Official Wire',
          sourceUrl: link.replace('http://', 'https://'),
          publishedLabel: pubDate ? pubDate.replace(/\s*\d{2}:\d{2}:\d{2}.*/, '') : 'U.S. Congress',
        });
      }
    }
  } catch {
    // ignore feed error
  }

  // 2. Most-Viewed Active Bills (Congress.gov Weekly Docket)
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 6000);
    const r = await fetch('https://www.congress.gov/rss/most-viewed-bills.xml', {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PoliticsWorldNews/1.0)' },
    });
    clearTimeout(t);
    if (r.ok) {
      const xml = await r.text();
      const pubDate = fixBrokenUtf8(xml.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1] || '');
      const descMatch = xml.match(/<item>[\s\S]*?<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i);
      const listHtml = descMatch?.[1] || '';
      const liMatches = [...listHtml.matchAll(/<li>\s*<a href=['"]([^'"]+)['"][^>]*>([^<]+)<\/a>\s*\[([^\]]+)\]\s*-\s*([\s\S]*?)<\/li>/gi)];

      for (const m of liMatches) {
        if (results.length >= 6) break;
        const link = m[1].trim();
        const billNum = fixBrokenUtf8(m[2]);
        const congressLabel = fixBrokenUtf8(m[3]);
        const billTitle = fixBrokenUtf8(m[4].replace(/<[^>]+>/g, ''));
        if (!billNum || !billTitle || seen.has(billNum)) continue;
        seen.add(billNum);

        const isSenate = /^s\./i.test(billNum);
        results.push({
          id: `cg-${billNum.toLowerCase().replace(/[^a-z0-9]+/g, '')}`,
          billNumber: billNum,
          title: billTitle,
          chamber: isSenate ? 'U.S. Senate' : 'U.S. House of Representatives',
          jurisdiction: isSenate ? 'senate' : 'house',
          status: `Active Docket (${congressLabel} Congress)`,
          stageProgress: isSenate ? 72 : 66,
          summary: `Ranked among the top most-tracked legislative bills in the ${congressLabel} U.S. Congress on Congress.gov.`,
          nextMilestone: isSenate
            ? 'Scheduled in active U.S. Senate committee / floor legislative calendar.'
            : 'Under review in House chamber / committee proceedings.',
          sourceName: 'Congress.gov Official Docket',
          sourceUrl: link.replace('http://', 'https://'),
          publishedLabel: pubDate ? pubDate.replace(/\s*\d{2}:\d{2}:\d{2}.*/, '') : `${congressLabel} Congress`,
        });
      }
    }
  } catch {
    // ignore feed error
  }

  return results;
}

app.get('/api/bills/live', async (req: Request, res: Response) => {
  const forceRefresh = req.query.refresh === '1';
  const now = new Date();
  const istDayKey = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

  if (
    !forceRefresh &&
    billsLiveCache.payload &&
    billsLiveCache.istDayKey === istDayKey &&
    Date.now() - billsLiveCache.fetchedAtMs < BILLS_LIVE_TTL_MS
  ) {
    return res.json({ ...billsLiveCache.payload, cached: true });
  }

  const [indiaBills, congressBills] = await Promise.all([
    fetchPrsIndiaBills(),
    fetchCongressGovBills(),
  ]);

  // Interleave India Parliament bills and US Congress bills so both are prominent on load
  const combined: LiveBillItem[] = [];
  const maxLen = Math.max(indiaBills.length, congressBills.length);
  for (let i = 0; i < maxLen; i++) {
    if (indiaBills[i]) combined.push(indiaBills[i]);
    if (congressBills[i]) combined.push(congressBills[i]);
  }

  const payload = {
    ok: true,
    isLiveFeed: combined.length > 0,
    updatedAtIso: now.toISOString(),
    updatedIstLabel: now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    }) + ' IST',
    sources: [
      ...(indiaBills.length > 0 ? ['PRS India Parliament'] : []),
      ...(congressBills.length > 0 ? ['Congress.gov RSS'] : []),
    ],
    bills: combined,
  };

  if (combined.length > 0) {
    billsLiveCache.fetchedAtMs = Date.now();
    billsLiveCache.istDayKey = istDayKey;
    billsLiveCache.payload = payload;
  } else if (billsLiveCache.payload) {
    return res.json({ ...billsLiveCache.payload, cached: true });
  }

  return res.json(payload);
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
        middlewareMode: true,
        hmr: false,
        ws: false,
        watch: null,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use('/src/assets/images', express.static(path.resolve(__dirname, 'src', 'assets', 'images')));
    app.use(express.static(path.resolve(__dirname, 'dist'), { dotfiles: 'allow' }));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Politics World Server running on http://0.0.0.0:${PORT}`);
  });

  // Periodically evaluate expired ad campaigns and trigger automatic end-of-campaign reports + emails
  setInterval(() => {
    try {
      readAdDatabase();
    } catch {
      // ignore transient timer errors
    }
  }, 60 * 1000);
}

startServer();
