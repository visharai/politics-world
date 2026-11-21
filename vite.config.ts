import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { ARTICLES } from './src/data/newsData';
import { DAILY_ROTATING_ITEMS } from './src/data/dailyRotatingFeed';

function openGraphDynamicSeoPlugin(): Plugin {
  return {
    name: 'opengraph-dynamic-seo',
    transformIndexHtml(html, ctx) {
      try {
        const rawUrl = ctx.originalUrl || (ctx as any).url || '';
        const url = new URL(rawUrl, 'https://politicsworld.news');
        const articleId = url.searchParams.get('article') || url.searchParams.get('id');

        if (!articleId) {
          return html;
        }

        const article =
          ARTICLES.find((a) => a.id === articleId) ||
          DAILY_ROTATING_ITEMS.find((a) => a.id === articleId);

        if (!article) {
          return html;
        }

        const cleanTitle = article.title.replace(/"/g, '&quot;');
        const cleanDeck = (article.deck || '').replace(/"/g, '&quot;');
        let imagePath = article.image || '/images/politics_world_og_banner.jpg';
        if (imagePath.startsWith('/src/assets/images/')) {
          imagePath = '/images/' + imagePath.replace('/src/assets/images/', '');
        }

        let updatedHtml = html;
        updatedHtml = updatedHtml.replace(
          /<title>.*?<\/title>/i,
          `<title>${cleanTitle} | Politics World</title>`
        );
        updatedHtml = updatedHtml.replace(
          /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
          `<meta name="description" content="${cleanDeck}" />`
        );
        updatedHtml = updatedHtml.replace(
          /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
          `<meta property="og:title" content="${cleanTitle} - Politics World" />`
        );
        updatedHtml = updatedHtml.replace(
          /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
          `<meta property="og:description" content="${cleanDeck}" />`
        );
        updatedHtml = updatedHtml.replace(
          /<meta\s+property="og:type"\s+content=".*?"\s*\/?>/i,
          `<meta property="og:type" content="article" />`
        );
        updatedHtml = updatedHtml.replace(
          /<meta\s+property="og:image"\s+content=".*?"\s*\/?>/i,
          `<meta property="og:image" content="${imagePath}" />`
        );
        updatedHtml = updatedHtml.replace(
          /<meta\s+property="og:image:secure_url"\s+content=".*?"\s*\/?>/i,
          `<meta property="og:image:secure_url" content="${imagePath}" />`
        );
        updatedHtml = updatedHtml.replace(
          /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
          `<meta name="twitter:title" content="${cleanTitle} - Politics World" />`
        );
        updatedHtml = updatedHtml.replace(
          /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
          `<meta name="twitter:description" content="${cleanDeck}" />`
        );
        updatedHtml = updatedHtml.replace(
          /<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/i,
          `<meta name="twitter:image" content="${imagePath}" />`
        );

        return updatedHtml;
      } catch {
        return html;
      }
    },
  };
}

function disableHmrClientWsPlugin(): Plugin {
  let wsDisabled = false;
  return {
    name: 'disable-hmr-client-ws',
    apply: 'serve',
    enforce: 'post',
    configResolved(resolvedConfig) {
      wsDisabled =
        resolvedConfig.server.hmr === false || resolvedConfig.server.ws === false;
    },
    transform(code, id) {
      if (!wsDisabled) return null;
      const normalizedId = id.replace(/\\/g, '/').split('?')[0];
      if (!normalizedId.endsWith('/vite/dist/client/client.mjs')) return null;
      return code
        .replace(
          /const transport = normalizeModuleRunnerTransport\(\(\(\) => \{[\s\S]*?\}\)\(\)\);/,
          'const transport = normalizeModuleRunnerTransport({ async connect() {}, async disconnect() {}, send() {} });'
        )
        .replace(
          /setupForwardConsoleHandler\(transport,\s*forwardConsole\);?/g,
          '/* console forwarding disabled */'
        )
        .replace(
          /new WebSocket\([^)]*\)/g,
          '({ readyState: 3, addEventListener: function(){}, removeEventListener: function(){}, send: function(){}, close: function(){} })'
        );
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      openGraphDynamicSeoPlugin(),
      disableHmrClientWsPlugin(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'icon.svg',
          'apple-touch-icon.png',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'pwa-maskable-512x512.png',
          'sw-push.js',
        ],
        manifest: {
          id: '/',
          name: 'Politics World - Latest Political News',
          short_name: 'Politics',
          description:
            'Real-time breaking political news, live dispatches, global policy updates, cricket scores, and multi-language podcasts.',
          theme_color: '#060c1d',
          background_color: '#060c1d',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          orientation: 'any',
          categories: ['news', 'politics', 'magazines'],
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          importScripts: ['/sw-push.js'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          globIgnores: ['**/assets/aistudio/**'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\/api\/(news|gnews|cricket)\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'live-news-api-cache',
                networkTimeoutSeconds: 6,
                expiration: {
                  maxEntries: 40,
                  maxAgeSeconds: 60 * 15,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: true as const,
      // HMR and WebSocket connections are disabled in AI Studio preview environment.
      hmr: false as const,
      ws: false as const,
      watch: null,
    },
  };
});
