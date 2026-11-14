import { Article } from '../data/newsData';
import { translateArticle as universalTranslateArticle, translateText as universalTranslateText } from '../utils/universalTranslator';

class TranslationService {
  private clientCache = new Map<string, string>();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('pw_client_translations');
        if (stored) {
          const parsed = JSON.parse(stored);
          Object.entries(parsed).forEach(([k, v]) => {
            if (typeof v === 'string') this.clientCache.set(k, v);
          });
        }
      } catch {
        // fallback
      }
    }
  }

  private persistCache() {
    if (typeof window !== 'undefined' && this.clientCache.size > 0) {
      try {
        const obj: Record<string, string> = {};
        let count = 0;
        for (const [k, v] of this.clientCache.entries()) {
          if (count++ > 500) break; // keep cache reasonable size
          obj[k] = v;
        }
        sessionStorage.setItem('pw_client_translations', JSON.stringify(obj));
      } catch {
        // ignore storage quota
      }
    }
  }

  /**
   * Translates a single text string into targetLang with instant cache fallback
   */
  public async translateText(text: string, targetLang: string): Promise<string> {
    const trimmed = text?.trim();
    if (!trimmed || targetLang === 'en') return text;

    const cacheKey = `${targetLang}:::${trimmed}`;
    if (this.clientCache.has(cacheKey)) {
      return this.clientCache.get(cacheKey)!;
    }

    // Immediate local glossary/dictionary check
    const local = universalTranslateText(trimmed, targetLang);
    if (local && local !== trimmed) {
      this.clientCache.set(cacheKey, local);
      return local;
    }

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: [trimmed], targetLang }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.translated) && data.translated[0]) {
          const result = data.translated[0];
          this.clientCache.set(cacheKey, result);
          this.persistCache();
          return result;
        }
      }
    } catch {
      // return local fallback
    }

    return local || trimmed;
  }

  /**
   * Batch translates an array of strings in a single fast call (<1s)
   */
  public async translateBatch(texts: string[], targetLang: string): Promise<string[]> {
    if (!texts || texts.length === 0 || targetLang === 'en') return texts;

    const results: string[] = new Array(texts.length);
    const toFetchIndices: number[] = [];
    const toFetchTexts: string[] = [];

    texts.forEach((text, i) => {
      const trimmed = text?.trim();
      if (!trimmed) {
        results[i] = text;
        return;
      }
      const cacheKey = `${targetLang}:::${trimmed}`;
      if (this.clientCache.has(cacheKey)) {
        results[i] = this.clientCache.get(cacheKey)!;
        return;
      }
      const local = universalTranslateText(trimmed, targetLang);
      if (local && local !== trimmed) {
        this.clientCache.set(cacheKey, local);
        results[i] = local;
        return;
      }
      toFetchIndices.push(i);
      toFetchTexts.push(trimmed);
    });

    if (toFetchTexts.length === 0) {
      return results;
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);

      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: toFetchTexts, targetLang }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.translated)) {
          data.translated.forEach((trans: string, idx: number) => {
            const originalIndex = toFetchIndices[idx];
            const originalText = toFetchTexts[idx];
            results[originalIndex] = trans || originalText;
            this.clientCache.set(`${targetLang}:::${originalText}`, trans || originalText);
          });
          this.persistCache();
          return results;
        }
      }
    } catch {
      // fallback to original text
    }

    toFetchIndices.forEach((origIdx, fIdx) => {
      if (!results[origIdx]) {
        results[origIdx] = toFetchTexts[fIdx];
      }
    });

    return results;
  }

  /**
   * Translates an entire article (title, deck, lead, body, takeaways)
   */
  public async translateArticle(article: Article, targetLang: string): Promise<Article> {
    if (!article || targetLang === 'en') return article;

    // Instant initial synchronous translation
    const local = universalTranslateArticle(article, targetLang);

    // Extract texts that need server verification/translation
    const textsToTranslate: string[] = [
      article.title,
      article.deck || '',
      article.leadParagraph || '',
      ...(article.keyTakeaways || []),
      ...(article.bodyParagraphs || []),
    ];

    try {
      const translatedBatch = await this.translateBatch(textsToTranslate, targetLang);
      let ptr = 0;
      const title = translatedBatch[ptr++] || local.title;
      const deck = translatedBatch[ptr++] || local.deck;
      const leadParagraph = translatedBatch[ptr++] || local.leadParagraph;
      
      const keyTakeaways: string[] = [];
      const takeawayLen = article.keyTakeaways?.length || 0;
      for (let i = 0; i < takeawayLen; i++) {
        keyTakeaways.push(translatedBatch[ptr++] || article.keyTakeaways![i]);
      }

      const bodyParagraphs: string[] = [];
      const bodyLen = article.bodyParagraphs?.length || 0;
      for (let i = 0; i < bodyLen; i++) {
        bodyParagraphs.push(translatedBatch[ptr++] || article.bodyParagraphs[i]);
      }

      return {
        ...local,
        title,
        deck,
        leadParagraph,
        keyTakeaways: keyTakeaways.length > 0 ? keyTakeaways : local.keyTakeaways,
        bodyParagraphs: bodyParagraphs.length > 0 ? bodyParagraphs : local.bodyParagraphs,
      };
    } catch {
      return local;
    }
  }

  /**
   * Translates multiple articles in parallel with a strict 3.5s timeout (< 5 seconds total)
   */
  public async translateArticles(articles: Article[], targetLang: string): Promise<Article[]> {
    if (!articles || articles.length === 0 || targetLang === 'en') return articles;

    // First, produce instant local translations (<5ms)
    const localArticles = articles.map((a) => universalTranslateArticle(a, targetLang));

    try {
      const topCount = Math.min(articles.length, 12);
      const titles = articles.slice(0, topCount).map((a) => a.title);
      const decks = articles.slice(0, topCount).map((a) => a.deck || a.leadParagraph || '');

      const [tTitles, tDecks] = await Promise.all([
        this.translateBatch(titles, targetLang),
        this.translateBatch(decks, targetLang),
      ]);

      const translated = articles.slice(0, topCount).map((art, idx) => {
        const local = localArticles[idx];
        return {
          ...local,
          title: tTitles[idx] || local.title,
          deck: tDecks[idx] || local.deck,
          leadParagraph: tDecks[idx] || local.leadParagraph,
        };
      });

      return [
        ...translated,
        ...localArticles.slice(topCount),
      ];
    } catch {
      return localArticles;
    }
  }
}

export const translationService = new TranslationService();
