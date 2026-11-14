import { Article } from '../data/newsData';

export const PORTAL_DEFAULT_TITLE = 'Politics World - Latest Political News';
export const PORTAL_DEFAULT_DESCRIPTION =
  'Stay informed with Politics World — delivering real-time breaking political news, live dispatches, congressional analyses, global policy updates, and multi-language podcasts.';
export const PORTAL_DEFAULT_IMAGE = '/images/politics_world_logo.png';

/**
 * Normalizes any internal asset path into an absolute, crawlable HTTP/HTTPS image URL.
 * Scrapers like WhatsApp, Facebook, LinkedIn, Twitter, and Telegram require full absolute URLs.
 */
export function resolveFullImageUrl(imagePath?: string): string {
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-pre-5ybfu37d43e2ycuf3t3ush-370038772633.asia-east1.run.app';

  if (!imagePath) {
    return `${origin}${PORTAL_DEFAULT_IMAGE}`;
  }

  // Already a full absolute URL
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Convert Vite src asset paths to public served image paths
  if (imagePath.startsWith('/src/assets/images/')) {
    const filename = imagePath.replace('/src/assets/images/', '');
    return `${origin}/images/${filename}`;
  }

  if (imagePath.startsWith('/')) {
    return `${origin}${imagePath}`;
  }

  return `${origin}/${imagePath}`;
}

/**
 * Helper to update or insert a <meta> element in document.head
 */
function setMetaTag(selector: string, attrName: 'property' | 'name', attrValue: string, content: string) {
  if (typeof document === 'undefined') return;

  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Helper to update or insert <link rel="...">
 */
function setLinkTag(rel: string, href: string) {
  if (typeof document === 'undefined') return;

  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

/**
 * Dynamically updates all Open Graph, Twitter Card, Canonical, and Schema.org tags
 * whenever a user views or shares a specific news article.
 */
export function updateSEOForArticle(article: Article): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const origin = window.location.origin;
  const canonicalUrl = `${origin}/?article=${encodeURIComponent(article.id)}#${article.id}`;
  const fullImageUrl = resolveFullImageUrl(article.image);
  const headline = `${article.title} - Politics World`;
  const description = article.deck || PORTAL_DEFAULT_DESCRIPTION;

  // 1. Document Title
  document.title = `${article.title} | Politics World`;

  // 2. Standard Meta Description
  setMetaTag('meta[name="description"]', 'name', 'description', description);

  // 3. Open Graph Tags (WhatsApp, Facebook, LinkedIn, Discord, Telegram)
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'article');
  setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Politics World');
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', headline);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
  setMetaTag('meta[property="og:image"]', 'property', 'og:image', fullImageUrl);
  setMetaTag('meta[property="og:image:secure_url"]', 'property', 'og:image:secure_url', fullImageUrl);
  setMetaTag('meta[property="og:image:type"]', 'property', 'og:image:type', 'image/jpeg');
  setMetaTag('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
  setMetaTag('meta[property="og:image:height"]', 'property', 'og:image:height', '630');
  setMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', `${article.title} - Politics World Report`);

  // Open Graph Article Specifics
  if (article.category) {
    setMetaTag('meta[property="article:section"]', 'property', 'article:section', article.category);
  }
  if (article.author) {
    setMetaTag('meta[property="article:author"]', 'property', 'article:author', article.author);
  }
  setMetaTag('meta[property="article:published_time"]', 'property', 'article:published_time', new Date().toISOString());

  // 4. Twitter / X Cards (Large Image Preview)
  setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  setMetaTag('meta[name="twitter:site"]', 'name', 'twitter:site', '@PoliticsWorldNews');
  setMetaTag('meta[name="twitter:creator"]', 'name', 'twitter:creator', '@PoliticsWorldNews');
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', headline);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
  setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', fullImageUrl);
  setMetaTag('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', `${article.title} - Politics World Report`);

  // 5. Canonical Link
  setLinkTag('canonical', canonicalUrl);

  // 6. Dynamic Schema.org NewsArticle JSON-LD Tag
  updateNewsArticleSchema(article, canonicalUrl, fullImageUrl);
}

/**
 * Resets Open Graph and Page Metadata back to the portal's master homepage state.
 */
export function resetSEOToDefault(leadArticle?: Article | null): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const origin = window.location.origin;
  const canonicalUrl = `${origin}/`;
  const defaultImage = resolveFullImageUrl(leadArticle?.image || PORTAL_DEFAULT_IMAGE);

  document.title = PORTAL_DEFAULT_TITLE;
  setMetaTag('meta[name="description"]', 'name', 'description', PORTAL_DEFAULT_DESCRIPTION);

  // Open Graph
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
  setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Politics World');
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', PORTAL_DEFAULT_TITLE);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', PORTAL_DEFAULT_DESCRIPTION);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
  setMetaTag('meta[property="og:image"]', 'property', 'og:image', defaultImage);
  setMetaTag('meta[property="og:image:secure_url"]', 'property', 'og:image:secure_url', defaultImage);
  setMetaTag('meta[property="og:image:type"]', 'property', 'og:image:type', 'image/jpeg');
  setMetaTag('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
  setMetaTag('meta[property="og:image:height"]', 'property', 'og:image:height', '630');
  setMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', 'Politics World Live Global News Portal');

  // Twitter / X
  setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', PORTAL_DEFAULT_TITLE);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', PORTAL_DEFAULT_DESCRIPTION);
  setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', defaultImage);

  // Canonical
  setLinkTag('canonical', canonicalUrl);

  // Remove article-specific schema script if present
  const existingArticleSchema = document.getElementById('article-schema-ld');
  if (existingArticleSchema && existingArticleSchema.parentNode) {
    existingArticleSchema.parentNode.removeChild(existingArticleSchema);
  }
}

/**
 * Injects or updates a Schema.org NewsArticle structured data script tag
 */
function updateNewsArticleSchema(article: Article, articleUrl: string, imageUrl: string) {
  if (typeof document === 'undefined') return;

  let scriptEl = document.getElementById('article-schema-ld') as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'article-schema-ld';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    headline: article.title,
    description: article.deck,
    image: [imageUrl],
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: article.author || 'Politics World Editorial Bureau',
      jobTitle: article.authorRole || 'Correspondent',
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'Politics World',
      url:
        typeof window !== 'undefined'
          ? window.location.origin
          : 'https://ais-pre-5ybfu37d43e2ycuf3t3ush-370038772633.asia-east1.run.app',
      logo: {
        '@type': 'ImageObject',
        url: resolveFullImageUrl('/images/politics_world_logo.png'),
      },
    },
    articleSection: article.category,
    keywords: article.tags?.join(', ') || 'politics, news, analysis',
  };

  scriptEl.textContent = JSON.stringify(structuredData, null, 2);
}
