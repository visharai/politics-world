// Google Analytics 4 (GA4 + Google Signals) Runtime Loader & Event Helper
// Reads VITE_GA_MEASUREMENT_ID at build time or /api/analytics/ga4-config at runtime.

export interface GA4StatusInfo {
  connected: boolean;
  maskedId: string | null;
}

const VALID_GA4_REGEX = /^G-[A-Z0-9]{4,}$/i;

let cachedStatus: GA4StatusInfo = {
  connected: false,
  maskedId: null,
};
let initPromise: Promise<GA4StatusInfo> | null = null;

function maskGaId(id: string): string {
  return `${id.slice(0, 4)}••••${id.slice(-3)}`;
}

function injectGtagScript(measurementId: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const cleanId = measurementId.trim().toUpperCase();
  if (!VALID_GA4_REGEX.test(cleanId)) return;

  const w = window as any;
  if (!w.__pwGa4InitializedId) {
    w.__pwGa4InitializedId = cleanId;

    const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id="]`);
    if (!existingScript) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(cleanId)}`;
      document.head.appendChild(script);
    }

    w.dataLayer = w.dataLayer || [];
    if (typeof w.gtag !== 'function') {
      w.gtag = function gtag() {
        w.dataLayer.push(arguments);
      };
    }
    w.gtag('js', new Date());
    w.gtag('config', cleanId, {
      anonymize_ip: true,
      page_title: document.title,
      page_location: window.location.href,
    });
  }

  cachedStatus = {
    connected: true,
    maskedId: maskGaId(cleanId),
  };

  window.dispatchEvent(new CustomEvent('pw-ga4-status', { detail: cachedStatus }));
}

export function getGA4Status(): GA4StatusInfo {
  return cachedStatus;
}

export async function initGA4(): Promise<GA4StatusInfo> {
  if (typeof window === 'undefined') return cachedStatus;

  const buildTimeId = String((import.meta as any).env?.VITE_GA_MEASUREMENT_ID || '').trim();
  if (VALID_GA4_REGEX.test(buildTimeId)) {
    injectGtagScript(buildTimeId);
    return cachedStatus;
  }

  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const res = await fetch('/api/analytics/ga4-config', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data?.ga4Configured && typeof data.measurementId === 'string' && VALID_GA4_REGEX.test(data.measurementId)) {
          injectGtagScript(data.measurementId);
        }
      }
    } catch {
      // keep silent on offline/boot
    }
    return cachedStatus;
  })();

  return initPromise;
}

export function trackGA4Event(eventName: string, params: Record<string, string | number | boolean> = {}): void {
  if (typeof window === 'undefined') return;
  try {
    const gtag = (window as any).gtag;
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }
  } catch {
    // ignore gtag failures
  }
}
