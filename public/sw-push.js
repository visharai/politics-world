// Web Push & Notification Click Handlers imported by Workbox Service Worker
self.addEventListener('push', (event) => {
  let data = {
    title: 'Politics World · Breaking News Alert',
    body: 'A new major political report has been published.',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    tag: 'breaking-news',
    data: {
      url: '/',
    },
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      data = {
        ...data,
        ...payload,
        data: {
          url: payload.url || payload.data?.url || '/',
        },
      };
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    tag: data.tag || 'politics-world-alert',
    renotify: true,
    requireInteraction: false,
    vibrate: [200, 100, 200],
    data: data.data,
    actions: [
      { action: 'read', title: 'Read Article' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client && client.url.includes(self.location.origin)) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
