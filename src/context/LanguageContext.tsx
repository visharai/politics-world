import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { SUPPORTED_LANGUAGES, Language, TRANSLATIONS, UiTranslations } from '../data/translations';
import { Article, ARTICLES, BREAKING_DISPATCHES, BreakingDispatchItem, BILLS_DATA, POLL_DATA, BillItem, OpinionColumn } from '../data/newsData';
import { GlobalLeader, GLOBAL_LEADERS } from '../data/leaderData';
import { PodcastEpisode, PODCAST_EPISODES } from '../data/podcastData';
import { DYNAMIC_PODCAST_TRANSLATIONS } from '../data/podcastTranslations';
import { HOURLY_BREAKING_LEAD_STORIES, getHourlyLeadStory, HOURLY_TRANSLATIONS } from '../data/hourlyNewsData';
import {
  HOURLY_SECONDARY_SETS,
  HOURLY_WIRE_RAIL_SETS,
  HOURLY_BREAKING_DISPATCH_SETS,
  HOURLY_OPINION_SETS,
  HOURLY_FACT_CHECK_SETS,
  getSystemHourSlot,
  getRemainingSecondsUntilNextHour,
} from '../data/hourlyContentPool';
import { FactCheckItem } from '../data/factCheckData';
import {
  DAILY_ROTATING_ITEMS,
  DailyRotatingItem,
  getRotatingLeadStory,
  getRotatingSecondaryStories,
  getRotatingRailStories,
  getRotatingTickerDispatches,
} from '../data/dailyRotatingFeed';

/**
 * Calculates a dynamic seed combining:
 * 1. Day of Year (guarantees a fresh set every day at midnight)
 * 2. Current Hour (cycles through the day)
 * 3. Page Refresh Sequence in sessionStorage (guarantees every refresh loads fresh news without repeating!)
 */
function getDynamicRefreshSeed(totalItemsCount: number): number {
  try {
    const now = new Date();
    // 1. Day of year (changes automatically each day)
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    
    // 2. Incremental sequence on each page reload stored in sessionStorage
    const currentRefreshCount = parseInt(sessionStorage.getItem('pw_refresh_sequence') || '0', 10);
    const nextRefreshCount = currentRefreshCount + 1;
    sessionStorage.setItem('pw_refresh_sequence', nextRefreshCount.toString());

    // 3. Combined rotation formula: Day + Hour + Page Refresh count
    const safeCount = Math.max(1, totalItemsCount);
    return (dayOfYear * 7 + now.getHours() + currentRefreshCount) % safeCount;
  } catch {
    return Math.floor(Math.random() * Math.max(1, totalItemsCount));
  }
}
import {
  DYNAMIC_ARTICLE_TRANSLATIONS,
  DYNAMIC_BREAKING_TRANSLATIONS,
  DYNAMIC_BILL_TRANSLATIONS,
  DYNAMIC_POLL_TRANSLATIONS,
} from '../data/dynamicTranslations';
import {
  translateArticle as universalTranslateArticle,
  translateOpinionColumn,
  translateFactCheckItem,
  translateText as universalTranslateText,
  CATEGORY_TRANSLATIONS,
} from '../utils/universalTranslator';

/**
 * Formats date dynamically with full day of week and date for any of the supported 16 languages.
 */
export function formatHeaderDate(date: Date, langCode: string): string {
  const localeMap: Record<string, string> = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    hi: 'hi-IN',
    zh: 'zh-CN',
    ar: 'ar-EG',
    ja: 'ja-JP',
    ru: 'ru-RU',
    pt: 'pt-BR',
    it: 'it-IT',
    ko: 'ko-KR',
    tr: 'tr-TR',
    nl: 'nl-NL',
    id: 'id-ID',
    pl: 'pl-PL',
  };

  try {
    const locale = localeMap[langCode] || langCode || 'en-US';
    const formatter = new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formatted = formatter.format(date);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  } catch {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}

export function formatCompactDate(date: Date, langCode: string): string {
  const localeMap: Record<string, string> = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    hi: 'hi-IN',
    zh: 'zh-CN',
    ar: 'ar-EG',
    ja: 'ja-JP',
    ru: 'ru-RU',
    pt: 'pt-BR',
    it: 'it-IT',
    ko: 'ko-KR',
    tr: 'tr-TR',
    nl: 'nl-NL',
    id: 'id-ID',
    pl: 'pl-PL',
  };

  try {
    const locale = localeMap[langCode] || langCode || 'en-US';
    const formatter = new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const formatted = formatter.format(date);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  } catch {
    return date.toLocaleDateString();
  }
}

export interface LanguageContextType {
  currentLanguage: Language;
  langCode: string;
  setLanguage: (code: string) => void;
  t: UiTranslations;
  currentDate: Date;
  formattedDate: string;
  formattedCompactDate: string;
  // Dynamic Hourly Rotation System
  currentHourSlot: number;
  manualHourOffset: number;
  secondsUntilNextHour: number;
  rotateToNextHour: () => void;
  setCustomHour: (hour: number) => void;
  isAutoRotateActive: boolean;
  autoRotateCountdown: number;
  toggleAutoRotate: () => void;
  advanceToNextEdition: () => void;
  hourlyLeadArticle: Article;
  hourlySecondaryArticles: Article[];
  hourlyUrgentRailArticles: Article[];
  hourlyBreakingDispatches: BreakingDispatchItem[];
  hourlyOpinionColumns: OpinionColumn[];
  hourlyFactChecks: FactCheckItem[];
  translatedArticles: Article[];
  translatedLeaders: GlobalLeader[];
  translatedBreakingDispatches: BreakingDispatchItem[];
  translatedBills: BillItem[];
  translatedPoll: typeof POLL_DATA;
  translateBreakingItem: (item: BreakingDispatchItem) => BreakingDispatchItem;
  translatedPodcastEpisodes: PodcastEpisode[];
  translatePodcastEpisode: (ep: PodcastEpisode) => PodcastEpisode;
  hourlyLeadArticles: Article[];
  getHourlyLeadArticle: (manualIndex?: number) => Article;
  translateArticle: (article: Article) => Article;
  translateText: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Core leader title translations across all 16 languages
const LEADER_TRANSLATIONS: Record<string, Record<string, { title: string; country: string }>> = {
  es: {
    'leader-5': { title: 'Primer Ministro de la India', country: 'India' },
    'leader-1': { title: 'Presidente de los Estados Unidos', country: 'Estados Unidos' },
    'leader-2': { title: 'Presidenta de la Comisión Europea', country: 'Unión Europea' },
    'leader-3': { title: 'Primer Ministro de Japón', country: 'Japón' },
    'leader-4': { title: 'Primer Ministro del Reino Unido', country: 'Reino Unido' },
  },
  fr: {
    'leader-5': { title: "Premier Ministre de l'Inde", country: 'Inde' },
    'leader-1': { title: 'Président des États-Unis', country: 'États-Unis' },
    'leader-2': { title: 'Présidente de la Commission Européenne', country: 'Union Européenne' },
    'leader-3': { title: 'Premier Ministre du Japon', country: 'Japon' },
    'leader-4': { title: 'Premier Ministre du Royaume-Uni', country: 'Royaume-Uni' },
  },
  de: {
    'leader-5': { title: 'Premierminister von Indien', country: 'Indien' },
    'leader-1': { title: 'Präsident der Vereinigten Staaten', country: 'Vereinigte Staaten' },
    'leader-2': { title: 'Präsidentin der Europäischen Kommission', country: 'Europäische Union' },
    'leader-3': { title: 'Premierminister von Japan', country: 'Japan' },
    'leader-4': { title: 'Premierminister des Vereinigten Königreichs', country: 'Vereinigtes Königreich' },
  },
  hi: {
    'leader-5': { title: 'भारत के प्रधानमंत्री', country: 'भारत' },
    'leader-1': { title: 'संयुक्त राज्य अमेरिका के राष्ट्रपति', country: 'संयुक्त राज्य अमेरिका' },
    'leader-2': { title: 'यूरोपीय आयोग की अध्यक्ष', country: 'यूरोपीय संघ' },
    'leader-3': { title: 'जापान के प्रधानमंत्री', country: 'जापान' },
    'leader-4': { title: 'यूनाइटेड किंगडम के प्रधानमंत्री', country: 'ब्रिटेन' },
  },
  zh: {
    'leader-5': { title: '印度共和国总理', country: '印度' },
    'leader-1': { title: '美利坚合众国总统', country: '美国' },
    'leader-2': { title: '欧盟委员会主席', country: '欧盟' },
    'leader-3': { title: '日本国内阁总理大臣', country: '日本' },
    'leader-4': { title: '大不列颠及北爱尔兰联合王国首相', country: '英国' },
  },
  ar: {
    'leader-5': { title: 'رئيس وزراء الهند', country: 'الهند' },
    'leader-1': { title: 'رئيس الولايات المتحدة الأمريكية', country: 'الولايات المتحدة' },
    'leader-2': { title: 'رئيسة المفوضية الأوروبية', country: 'الاتحاد الأوروبي' },
    'leader-3': { title: 'رئيس وزراء اليابان', country: 'اليابان' },
    'leader-4': { title: 'رئيس وزراء المملكة المتحدة', country: 'المملكة المتحدة' },
  },
  ja: {
    'leader-5': { title: 'インド首相', country: 'インド' },
    'leader-1': { title: 'アメリカ合衆国大統領', country: 'アメリカ合衆国' },
    'leader-2': { title: '欧州委員会委員長', country: '欧州連合' },
    'leader-3': { title: '内閣総理大臣', country: '日本' },
    'leader-4': { title: '英国首相', country: 'イギリス' },
  },
  ru: {
    'leader-5': { title: 'Премьер-министр Индии', country: 'Индия' },
    'leader-1': { title: 'Президент Соединенных Штатов', country: 'США' },
    'leader-2': { title: 'Председатель Европейской комиссии', country: 'Европейский Союз' },
    'leader-3': { title: 'Премьер-министр Японии', country: 'Япония' },
    'leader-4': { title: 'Премьер-министр Великобритании', country: 'Великобритания' },
  },
  pt: {
    'leader-5': { title: 'Primeiro-Ministro da Índia', country: 'Índia' },
    'leader-1': { title: 'Presidente dos Estados Unidos', country: 'Estados Unidos' },
    'leader-2': { title: 'Presidente da Comissão Europeia', country: 'União Europeia' },
    'leader-3': { title: 'Primeiro-Ministro do Japão', country: 'Japão' },
    'leader-4': { title: 'Primeiro-Ministro do Reino Unido', country: 'Reino Unido' },
  },
  it: {
    'leader-5': { title: "Primo Ministro dell'India", country: 'India' },
    'leader-1': { title: 'Presidente degli Stati Uniti', country: 'Stati Uniti' },
    'leader-2': { title: 'Presidente della Commissione Europea', country: 'Unione Europea' },
    'leader-3': { title: 'Primo Ministro del Giappone', country: 'Giappone' },
    'leader-4': { title: 'Primo Ministro del Regno Unito', country: 'Regno Unito' },
  },
  ko: {
    'leader-5': { title: '인도 총리', country: '인도' },
    'leader-1': { title: '미국 대통령', country: '미국' },
    'leader-2': { title: '유럽연합 집행위원장', country: '유럽연합' },
    'leader-3': { title: '일본 내각총리대신', country: '일본' },
    'leader-4': { title: '영국 총리', country: '영국' },
  },
  tr: {
    'leader-5': { title: 'Hindistan Başbakanı', country: 'Hindistan' },
    'leader-1': { title: 'Amerika Birleşik Devletleri Başkanı', country: 'Amerika Birleşik Devletleri' },
    'leader-2': { title: 'Avrupa Komisyonu Başkanı', country: 'Avrupa Birliği' },
    'leader-3': { title: 'Japonya Başbakanı', country: 'Japonya' },
    'leader-4': { title: 'Birleşik Krallık Başbakanı', country: 'Birleşik Krallık' },
  },
  nl: {
    'leader-5': { title: 'Premier van India', country: 'India' },
    'leader-1': { title: 'President van de Verenigde Staten', country: 'Verenigde Staten' },
    'leader-2': { title: 'Voorzitter van de Europese Commissie', country: 'Europese Unie' },
    'leader-3': { title: 'Premier van Japan', country: 'Japan' },
    'leader-4': { title: 'Premier van het Verenigd Koninkrijk', country: 'Verenigd Koninkrijk' },
  },
  id: {
    'leader-5': { title: 'Perdana Menteri India', country: 'India' },
    'leader-1': { title: 'Presiden Amerika Serikat', country: 'Amerika Serikat' },
    'leader-2': { title: 'Presiden Komisi Eropa', country: 'Uni Eropa' },
    'leader-3': { title: 'Perdana Menteri Jepang', country: 'Jepang' },
    'leader-4': { title: 'Perdana Menteri Inggris', country: 'Inggris' },
  },
  pl: {
    'leader-5': { title: 'Premier Indii', country: 'Indie' },
    'leader-1': { title: 'Prezydent Stanów Zjednoczonych', country: 'Stany Zjednoczone' },
    'leader-2': { title: 'Przewodnicząca Komisji Europejskiej', country: 'Unia Europejska' },
    'leader-3': { title: 'Premier Japonii', country: 'Japonia' },
    'leader-4': { title: 'Premier Wielkiej Brytanii', country: 'Wielka Brytania' },
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [langCode, setLangCode] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('politics_world_lang');
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'en';
  });

  // Dynamic system time and 24-hour daily news cycle (no rapid 60-second internal rotation)
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [manualHourOffset, setManualHourOffset] = useState<number>(0);
  const [secondsUntilNextHour, setSecondsUntilNextHour] = useState<number>(getRemainingSecondsUntilNextHour());
  const [isAutoRotateActive, setIsAutoRotateActive] = useState<boolean>(false);
  const [autoRotateCountdown, setAutoRotateCountdown] = useState<number>(86400);

  // 24-Hour stable daily seed: changes cleanly once every 24 hours at midnight
  const daily24HourSeed = useMemo(() => {
    const now = new Date();
    // Daily epoch index (stable for all 24 hours of today)
    const dayEpoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
    return dayEpoch % Math.max(1, DAILY_ROTATING_ITEMS.length);
  }, [currentDate]);

  // Active rotation index based strictly on the 24-hour daily cycle + optional manual advance
  const activeRotationIndex = useMemo(() => {
    return (daily24HourSeed + manualHourOffset) % Math.max(1, DAILY_ROTATING_ITEMS.length);
  }, [daily24HourSeed, manualHourOffset]);

  // Live clock updates for header date display
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDate(now);
      const remaining = getRemainingSecondsUntilNextHour();
      setSecondsUntilNextHour(remaining);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  // Internal auto-rotation is intentionally disabled as per user instruction:
  // "24 ghante mein news website se hat chaji chahiye ander rotate nhi hona chahiye aaj kee news dekhao"

  const toggleAutoRotate = () => {
    setIsAutoRotateActive((prev) => !prev);
  };

  const advanceToNextEdition = () => {
    setManualHourOffset((prev) => prev + 1);
  };

  const currentLanguage =
    SUPPORTED_LANGUAGES.find((l) => l.code === langCode) || SUPPORTED_LANGUAGES[0];

  const baseT = TRANSLATIONS[langCode] || TRANSLATIONS.en;
  const formattedDate = formatHeaderDate(currentDate, langCode);
  const formattedCompactDate = formatCompactDate(currentDate, langCode);

  const t: UiTranslations = {
    ...baseT,
    editionDate: formattedDate,
  };

  useEffect(() => {
    try {
      localStorage.setItem('politics_world_lang', langCode);
      document.documentElement.lang = langCode;
      document.documentElement.dir = currentLanguage.dir;
    } catch {
      // fallback
    }
  }, [langCode, currentLanguage]);

  const setLanguage = (code: string) => {
    if (SUPPORTED_LANGUAGES.some((l) => l.code === code)) {
      setLangCode(code);
    }
  };

  // Calculate current active hour slot synchronized with real 24-hour system clock (00..23)
  const currentHourSlot = useMemo(() => getSystemHourSlot(manualHourOffset), [currentDate, manualHourOffset]);

  const rotateToNextHour = () => {
    advanceToNextEdition();
  };

  const setCustomHour = (targetHour: number) => {
    setManualHourOffset((targetHour - daily24HourSeed + DAILY_ROTATING_ITEMS.length * 10) % DAILY_ROTATING_ITEMS.length);
  };

  // Format dynamic live edition publication timestamp + local clock so news timing always matches real clock
  const formatArticleLiveTime = (offsetMins: number) => {
    const pubDate = new Date(Date.now() - offsetMins * 60 * 1000);
    const clockStr = pubDate.toLocaleTimeString(langCode === 'hi' ? 'hi-IN' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    if (langCode === 'hi') {
      if (offsetMins <= 5) return `लाइव · अभी-अभी · ${clockStr}`;
      if (offsetMins < 60) return `लाइव · ${offsetMins} मिनट पहले · ${clockStr}`;
      const hrs = Math.floor(offsetMins / 60);
      return `लाइव · ${hrs} घंटे पहले · ${clockStr}`;
    }
    if (offsetMins <= 5) return `Live · Just now · ${clockStr}`;
    if (offsetMins < 60) return `Live · ${offsetMins}m ago · ${clockStr}`;
    const hrs = Math.floor(offsetMins / 60);
    return `Live · ${hrs}h ago · ${clockStr}`;
  };

  // Dynamic Daily & Refresh Rotating Lead Article
  const hourlyLeadArticle = useMemo<Article>(() => {
    const baseLeadStory = getRotatingLeadStory(activeRotationIndex);
    const ts = Date.now() - 3 * 60 * 1000;
    return {
      ...universalTranslateArticle(baseLeadStory, langCode),
      date: formatArticleLiveTime(3),
      publishedAt: new Date(ts).toISOString(),
      timestamp: ts,
    };
  }, [activeRotationIndex, langCode]);

  // Dynamic Daily & Refresh Rotating Secondary Articles (Key Developments)
  const hourlySecondaryArticles = useMemo<Article[]>(() => {
    const secondaryList = getRotatingSecondaryStories(activeRotationIndex, 2);
    return secondaryList.map((sec, idx) => {
      const mins = (idx + 1) * 12;
      const ts = Date.now() - mins * 60 * 1000;
      return {
        ...universalTranslateArticle(sec, langCode),
        date: formatArticleLiveTime(mins),
        publishedAt: new Date(ts).toISOString(),
        timestamp: ts,
      };
    });
  }, [activeRotationIndex, langCode]);

  // Dynamic Daily & Refresh Rotating Urgent Wire Rail Articles
  const hourlyUrgentRailArticles = useMemo<Article[]>(() => {
    const railList = getRotatingRailStories(activeRotationIndex, 3);
    return railList.map((rail, idx) => {
      const mins = (idx + 3) * 14;
      const ts = Date.now() - mins * 60 * 1000;
      return {
        ...universalTranslateArticle(rail, langCode),
        date: formatArticleLiveTime(mins),
        publishedAt: new Date(ts).toISOString(),
        timestamp: ts,
      };
    });
  }, [activeRotationIndex, langCode]);

  // Translate individual breaking item
  const translateBreakingItem = (b: BreakingDispatchItem): BreakingDispatchItem => {
    const trans = DYNAMIC_BREAKING_TRANSLATIONS[langCode]?.[b.id];
    const cat = CATEGORY_TRANSLATIONS[langCode]?.[b.category] || b.category;
    if (trans) {
      return {
        ...b,
        title: trans.title,
        category: trans.category || cat,
      };
    }
    return {
      ...b,
      category: cat,
      title: universalTranslateText(b.title, langCode),
    };
  };

  // Hourly & Daily Rotating Breaking Dispatches
  const hourlyBreakingDispatches = useMemo<BreakingDispatchItem[]>(() => {
    const rotatingDispatches = getRotatingTickerDispatches(activeRotationIndex, 6);
    const baseDispatches = HOURLY_BREAKING_DISPATCH_SETS[activeRotationIndex % HOURLY_BREAKING_DISPATCH_SETS.length] || HOURLY_BREAKING_DISPATCH_SETS[0];
    const combined = [...rotatingDispatches, ...baseDispatches];
    return combined.map(translateBreakingItem);
  }, [activeRotationIndex, langCode]);

  // Hourly Opinion Columns
  const hourlyOpinionColumns = useMemo<OpinionColumn[]>(() => {
    const opinionBase = HOURLY_OPINION_SETS[activeRotationIndex % HOURLY_OPINION_SETS.length] || HOURLY_OPINION_SETS[0];
    const todayDateLabel = formatCompactDate(currentDate, langCode);
    return opinionBase.map((col) => ({
      ...translateOpinionColumn(col, langCode),
      date: todayDateLabel,
    }));
  }, [activeRotationIndex, langCode, currentDate]);

  // Hourly Fact Checks
  const hourlyFactChecks = useMemo<FactCheckItem[]>(() => {
    const factBase = HOURLY_FACT_CHECK_SETS[activeRotationIndex % HOURLY_FACT_CHECK_SETS.length] || HOURLY_FACT_CHECK_SETS[0];
    const todayDateLabel = formatCompactDate(currentDate, langCode);
    return factBase.map((item) => ({
      ...translateFactCheckItem(item, langCode),
      date: todayDateLabel,
    }));
  }, [activeRotationIndex, langCode, currentDate]);

  // Hourly Lead Articles list
  const hourlyLeadArticles = useMemo<Article[]>(() => {
    return DAILY_ROTATING_ITEMS.map((art) => universalTranslateArticle(art, langCode));
  }, [langCode]);

  const getHourlyLeadArticle = (manualIndex?: number): Article => {
    const targetIdx = manualIndex ?? activeRotationIndex;
    return {
      ...universalTranslateArticle(getRotatingLeadStory(targetIdx), langCode),
      date: formatArticleLiveTime(3),
    };
  };

  // Full unified pool of rotated articles with deduplication across sections
  const translatedArticles = useMemo<Article[]>(() => {
    const rawList = [
      ...DAILY_ROTATING_ITEMS,
      ...ARTICLES,
      ...(HOURLY_SECONDARY_SETS[activeRotationIndex % HOURLY_SECONDARY_SETS.length] || []),
      ...(HOURLY_WIRE_RAIL_SETS[activeRotationIndex % HOURLY_WIRE_RAIL_SETS.length] || []),
    ];
    const seen = new Set<string>();
    const uniqueList: Article[] = [];
    for (const art of rawList) {
      if (!seen.has(art.id)) {
        seen.add(art.id);
        uniqueList.push(art);
      }
    }
    return uniqueList.map((article, idx) => {
      const mins = (idx + 1) * 7;
      const ts = Date.now() - mins * 60 * 1000;
      return {
        ...universalTranslateArticle(article, langCode),
        date: formatArticleLiveTime(mins),
        publishedAt: new Date(ts).toISOString(),
        timestamp: ts,
      };
    });
  }, [activeRotationIndex, langCode]);

  const translateArticle = (article: Article): Article => universalTranslateArticle(article, langCode);
  const translateText = (text: string): string => universalTranslateText(text, langCode);

  // Translate individual podcast episode
  const translatePodcastEpisode = (ep: PodcastEpisode): PodcastEpisode => {
    const trans = DYNAMIC_PODCAST_TRANSLATIONS[langCode]?.[ep.id];
    if (trans) {
      return {
        ...ep,
        title: trans.title,
        series: trans.series,
        hostRole: trans.hostRole,
        description: trans.description,
        topics: trans.topics,
        keyQuotes: trans.keyQuotes,
        transcriptSample: trans.transcriptSample.map((line) => ({
          time: line.time,
          seconds: line.seconds,
          speaker: line.speaker,
          text: line.text,
        })),
      };
    }
    return ep;
  };

  // Dynamically translate podcast episodes
  const translatedPodcastEpisodes = useMemo<PodcastEpisode[]>(() => {
    return PODCAST_EPISODES.map(translatePodcastEpisode);
  }, [langCode]);

  // Dynamically translate leaders
  const translatedLeaders = useMemo<GlobalLeader[]>(() => {
    return GLOBAL_LEADERS.map((leader) => {
      const langTrans = LEADER_TRANSLATIONS[langCode]?.[leader.id];
      if (langTrans) {
        return {
          ...leader,
          title: langTrans.title,
          country: langTrans.country,
        };
      }
      return leader;
    });
  }, [langCode]);

  // Dynamically translate bills
  const translatedBills = useMemo<BillItem[]>(() => {
    return BILLS_DATA.map((bill) => {
      const billTrans = DYNAMIC_BILL_TRANSLATIONS[langCode]?.[bill.id];
      if (billTrans) {
        return {
          ...bill,
          title: billTrans.title,
          summary: billTrans.summary,
          nextMilestone: billTrans.nextMilestone,
          status: (billTrans.status as BillItem['status']) || bill.status,
        };
      }
      return bill;
    });
  }, [langCode]);

  // Dynamically translate poll
  const translatedPoll = useMemo(() => {
    const pollTrans = DYNAMIC_POLL_TRANSLATIONS[langCode];
    return pollTrans
      ? {
          ...POLL_DATA,
          question: pollTrans.question,
          description: pollTrans.description,
          options: POLL_DATA.options.map((opt, idx) => ({
            ...opt,
            label: pollTrans.options[idx] || opt.label,
          })),
        }
      : POLL_DATA;
  }, [langCode]);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        langCode,
        setLanguage,
        t,
        currentDate,
        formattedDate,
        formattedCompactDate,
        currentHourSlot,
        manualHourOffset,
        secondsUntilNextHour,
        rotateToNextHour,
        setCustomHour,
        isAutoRotateActive,
        autoRotateCountdown,
        toggleAutoRotate,
        advanceToNextEdition,
        hourlyLeadArticle,
        hourlySecondaryArticles,
        hourlyUrgentRailArticles,
        hourlyBreakingDispatches,
        hourlyOpinionColumns,
        hourlyFactChecks,
        translatedArticles,
        translatedLeaders,
        translatedBreakingDispatches: hourlyBreakingDispatches,
        translatedBills,
        translatedPoll,
        translateBreakingItem,
        translatedPodcastEpisodes,
        translatePodcastEpisode,
        hourlyLeadArticles,
        getHourlyLeadArticle,
        translateArticle,
        translateText,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
