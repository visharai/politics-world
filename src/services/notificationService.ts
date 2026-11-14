/**
 * Web Push Notification Service
 * Manages device push registration, OneSignal / FCM subscription tokens,
 * browser permissions, and automated notification dispatches when new articles publish.
 */

export type PushPermissionStatus = 'default' | 'granted' | 'denied' | 'unsupported';

export interface PushSubscriptionPreferences {
  enabled: boolean;
  token: string;
  deviceType: string;
  subscribedAt: string;
  topics: {
    breakingNews: boolean;
    indiaNews: boolean;
    liveWire: boolean;
    globalSummits: boolean;
    elections2026: boolean;
  };
}

const STORAGE_KEY = 'politics_world_push_subscription';

class NotificationService {
  private swRegistration: ServiceWorkerRegistration | null = null;
  private permissionStatus: PushPermissionStatus = 'default';
  private preferences: PushSubscriptionPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
    this.checkPermissionStatus();
    this.initServiceWorker();
  }

  private loadPreferences(): PushSubscriptionPreferences {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      enabled: false,
      token: '',
      deviceType: this.detectDeviceType(),
      subscribedAt: '',
      topics: {
        breakingNews: true,
        indiaNews: true,
        liveWire: true,
        globalSummits: true,
        elections2026: true,
      },
    };
  }

  private savePreferences(prefs: PushSubscriptionPreferences) {
    this.preferences = prefs;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // ignore
    }
  }

  private detectDeviceType(): string {
    if (typeof window === 'undefined') return 'Desktop';
    const ua = navigator.userAgent.toLowerCase();
    if (/android/.test(ua)) return 'Android Device';
    if (/iphone|ipad|ipod/.test(ua)) return 'Apple iOS Device';
    if (/windows/.test(ua)) return 'Windows PC';
    if (/macintosh|mac os x/.test(ua)) return 'macOS Device';
    return 'Web Browser';
  }

  public checkPermissionStatus(): PushPermissionStatus {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      this.permissionStatus = 'unsupported';
      return 'unsupported';
    }
    this.permissionStatus = Notification.permission as PushPermissionStatus;
    return this.permissionStatus;
  }

  public async initServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return null;
    }
    try {
      const existing = await navigator.serviceWorker.getRegistration('/');
      if (existing) {
        this.swRegistration = existing;
        return existing;
      }
      const readyReg = await navigator.serviceWorker.ready;
      this.swRegistration = readyReg;
      return readyReg;
    } catch (e) {
      console.warn('Service Worker registration note:', e);
      return null;
    }
  }

  /**
   * Requests permission from user and registers device for Web Push Notifications
   */
  public async requestPushPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      this.permissionStatus = result as PushPermissionStatus;

      if (result === 'granted') {
        // Generate simulated FCM / OneSignal registration token
        const randomToken =
          'fcm_pw_' +
          Math.random().toString(36).substring(2, 12) +
          '_' +
          Date.now().toString(36);

        const updated: PushSubscriptionPreferences = {
          ...this.preferences,
          enabled: true,
          token: randomToken,
          subscribedAt: new Date().toISOString(),
        };

        this.savePreferences(updated);

        // Send confirmation welcome notification
        this.dispatchNotification({
          title: 'Politics World · Notifications Active',
          body: 'You will now receive automatic real-time alerts whenever breaking articles are published.',
          url: '/',
        });

        return true;
      } else {
        const updated: PushSubscriptionPreferences = {
          ...this.preferences,
          enabled: false,
        };
        this.savePreferences(updated);
        return false;
      }
    } catch (err) {
      console.warn('Notification permission request error:', err);
      return false;
    }
  }

  /**
   * Unsubscribes the user from push notifications
   */
  public unsubscribe(): void {
    const updated: PushSubscriptionPreferences = {
      ...this.preferences,
      enabled: false,
    };
    this.savePreferences(updated);
  }

  public getPreferences(): PushSubscriptionPreferences {
    return this.preferences;
  }

  public updateTopics(topics: PushSubscriptionPreferences['topics']): void {
    const updated: PushSubscriptionPreferences = {
      ...this.preferences,
      topics,
    };
    this.savePreferences(updated);
  }

  /**
   * Plays a subtle, crystal-clear 2-note newsroom chime (C5 -> G5) on notification
   */
  private playNotificationChime(): void {
    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;
      const ctx = new AudioCtxClass();
      const now = ctx.currentTime;

      // Note 1: C5 (523 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.frequency.setValueAtTime(523.25, now);
      gain1.gain.setValueAtTime(0.0001, now);
      gain1.gain.linearRampToValueAtTime(0.18, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.22);

      // Note 2: G5 (784 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.frequency.setValueAtTime(783.99, now + 0.12);
      gain2.gain.setValueAtTime(0.0001, now + 0.12);
      gain2.gain.linearRampToValueAtTime(0.22, now + 0.14);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.48);
    } catch {
      // Audio chime best effort
    }
  }

  /**
   * Dispatches a real-time push alert to the device
   */
  public async dispatchNotification({
    title,
    body,
    icon = '/src/assets/images/india_parliament_news_1792118846447.jpg',
    url = '/',
    tag = 'politics-world-news',
  }: {
    title: string;
    body: string;
    icon?: string;
    url?: string;
    tag?: string;
  }): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    if (Notification.permission !== 'granted') {
      return false;
    }

    this.playNotificationChime();

    const options: NotificationOptions & { renotify?: boolean } = {
      body,
      icon,
      badge: '/favicon.ico',
      tag,
      data: { url },
      renotify: true,
    };

    // Prefer service worker registration showNotification (standard for PWA / Web Push)
    if (this.swRegistration && 'showNotification' in this.swRegistration) {
      try {
        await this.swRegistration.showNotification(title, options);
        return true;
      } catch {
        // Fallback to new Notification
      }
    }

    try {
      const n = new Notification(title, options);
      n.onclick = () => {
        window.focus();
        if (url && url !== '/') {
          window.location.hash = url.replace('#', '');
        }
        n.close();
      };
      return true;
    } catch (e) {
      console.warn('Native notification fallback error:', e);
      return false;
    }
  }

  /**
   * Automated helper called whenever an article or breaking report is published
   */
  public onArticlePublished(article: {
    id: string;
    title: string;
    deck: string;
    category?: string;
    image?: string;
  }): void {
    if (!this.preferences.enabled || Notification.permission !== 'granted') {
      return;
    }

    // Check topic filter
    const isIndia =
      article.title.toLowerCase().includes('india') ||
      article.deck.toLowerCase().includes('india') ||
      article.category?.includes('India');

    if (isIndia && !this.preferences.topics.indiaNews) return;

    this.dispatchNotification({
      title: `🔴 BREAKING: ${article.title}`,
      body: article.deck,
      icon: article.image || '/src/assets/images/india_parliament_news_1792118846447.jpg',
      url: `#${article.id}`,
      tag: `art-${article.id}`,
    });
  }

  /**
   * Dispatches an instant test notification so the user can verify alerts on their device
   */
  public async sendTestNotification(): Promise<boolean> {
    if (Notification.permission !== 'granted') {
      const granted = await this.requestPushPermission();
      if (!granted) return false;
    }

    return this.dispatchNotification({
      title: '🔴 BREAKING DISPATCH: Live Web Push Online',
      body: 'Verified Web Push Alert. Automatic dispatches are active for breaking investigations, Indian policy, and global summits.',
      icon: '/src/assets/images/india_parliament_news_1792118846447.jpg',
      url: '#live-wire',
      tag: 'test-alert',
    });
  }
}

export const notificationService = new NotificationService();
