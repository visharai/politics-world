import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ExternalLink, Megaphone, ArrowUpRight, Image as ImageIcon } from 'lucide-react';
import { AdSlotKey, AD_SLOTS_CATALOG } from '../data/adSlotsConfig';
import { useAdSlots } from '../context/AdSlotContext';
import { useLanguage } from '../context/LanguageContext';

interface LiveAdSlotBannerProps {
  slotKey: AdSlotKey;
  variant?: 'leaderboard' | 'editorial' | 'compact';
  onBookSlot?: (slotKey: AdSlotKey) => void;
  className?: string;
}

function getOrCreateAdSessionId(): string {
  if (typeof window === 'undefined') return '';
  const storageKey = 'pw_ad_session_id_v1';
  try {
    const existing = window.sessionStorage.getItem(storageKey);
    if (existing && existing.length >= 8) return existing;
    const generated =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `pw-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    window.sessionStorage.setItem(storageKey, generated);
    return generated;
  } catch {
    return `pw-${Date.now().toString(36)}`;
  }
}

function getOptInReaderState(): string {
  if (typeof window === 'undefined') return '';
  try {
    return (window.localStorage.getItem('pw_reader_pulse_state_v1') || '').trim().slice(0, 60);
  } catch {
    return '';
  }
}

function sendTelemetryEvent(payload: {
  type: 'impression' | 'click';
  slotKey: AdSlotKey;
  bookingId: string;
  langCode: string;
}) {
  if (typeof window === 'undefined') return;
  let timeZone = 'Asia/Kolkata';
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
  } catch {
    // fallback
  }
  const sessionId = getOrCreateAdSessionId();
  const readerState = getOptInReaderState();
  const body = JSON.stringify({
    ...payload,
    timeZone,
    sessionId,
    ...(readerState ? { readerState } : {}),
  });
  try {
    const gtag = (window as any).gtag;
    if (typeof gtag === 'function') {
      gtag('event', payload.type === 'click' ? 'ad_click' : 'ad_impression', {
        slot_key: payload.slotKey,
        booking_id: payload.bookingId,
        edition_lang: payload.langCode,
      });
    }
  } catch {
    // ignore gtag failure
  }
  try {
    if (payload.type === 'click' && typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon('/api/ads/telemetry/event', blob);
      return;
    }
    void fetch('/api/ads/telemetry/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    });
  } catch {
    // fail silently for ad telemetry
  }
}

export const LiveAdSlotBanner: React.FC<LiveAdSlotBannerProps> = ({
  slotKey,
  variant = 'editorial',
  onBookSlot,
  className = '',
}) => {
  const { getActiveSlot, formatPrice } = useAdSlots();
  const { langCode } = useLanguage();
  const [imgError, setImgError] = useState(false);
  const bannerContainerRef = useRef<HTMLDivElement | null>(null);
  const loggedKeyRef = useRef<string>('');
  const isHi = langCode === 'hi';

  const meta = AD_SLOTS_CATALOG[slotKey];
  const activeCampaign = getActiveSlot(slotKey);
  const weeklyRateFormatted = formatPrice(meta.rates['1-week']);

  useEffect(() => {
    if (!activeCampaign?.bookingId) return;
    const dedupeKey = `${activeCampaign.bookingId}:${slotKey}`;
    const sessionSentKey = `pw_ad_imp_sent_${activeCampaign.bookingId}_${slotKey}`;

    if (loggedKeyRef.current === dedupeKey) return;
    try {
      if (window.sessionStorage.getItem(sessionSentKey) === '1') {
        loggedKeyRef.current = dedupeKey;
        return;
      }
    } catch {
      // continue with ref-based dedupe
    }

    const recordImpression = () => {
      if (loggedKeyRef.current === dedupeKey) return;
      loggedKeyRef.current = dedupeKey;
      try {
        window.sessionStorage.setItem(sessionSentKey, '1');
      } catch {
        // ignore storage restrictions
      }
      sendTelemetryEvent({
        type: 'impression',
        slotKey,
        bookingId: activeCampaign.bookingId,
        langCode,
      });
    };

    const el = bannerContainerRef.current;
    if (el && typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            recordImpression();
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    } else {
      recordImpression();
    }
  }, [activeCampaign?.bookingId, slotKey, langCode]);

  const handleBannerClick = useCallback(() => {
    if (!activeCampaign?.bookingId) return;
    sendTelemetryEvent({
      type: 'click',
      slotKey,
      bookingId: activeCampaign.bookingId,
      langCode,
    });
  }, [activeCampaign?.bookingId, slotKey, langCode]);

  let hostnameLabel = '';
  if (activeCampaign?.targetUrl) {
    try {
      hostnameLabel = new URL(activeCampaign.targetUrl).hostname.replace(/^www\./, '');
    } catch {
      hostnameLabel = activeCampaign.targetUrl;
    }
  }

  // Empty, Unbooked, or Expired State -> Clean "Advertise Here - Book This Slot" Placeholder
  if (!activeCampaign) {
    if (variant === 'compact') {
      return (
        <button
          type="button"
          onClick={() => onBookSlot?.(slotKey)}
          className={`w-full text-left group rounded-md border border-dashed border-amber-500/45 bg-gradient-to-br from-[#07112b] to-[#0a1738] hover:border-amber-400 p-3 transition-all cursor-pointer shadow-sm ${className}`}
          title={isHi ? 'यहाँ विज्ञापन दें - यह स्लॉट बुक करें' : 'Advertise Here - Book This Slot'}
        >
          <div className="flex items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-wider text-amber-300/90 mb-1.5">
            <span>{isHi ? 'विज्ञापन स्थान रिक्त' : 'OPEN AD SLOT'}</span>
            <span className="text-slate-400 tabular-nums">{weeklyRateFormatted}+</span>
          </div>
          <div className="text-xs font-serif font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
            {isHi ? 'यहाँ विज्ञापन दें - यह स्लॉट बुक करें' : 'Advertise Here - Book This Slot'}
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
            <span className="truncate">{isHi ? meta.titleHi : meta.titleEn}</span>
            <span className="inline-flex items-center gap-0.5 text-amber-400 font-semibold shrink-0 group-hover:translate-x-0.5 transition-transform">
              <span>{isHi ? 'बुक करें' : 'Book'}</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </button>
      );
    }

    return (
      <div
        id={meta.domTargetId}
        className={`rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/90 dark:bg-[#091229] px-4 py-3.5 sm:px-6 sm:py-4 transition-colors ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Megaphone className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <span>{isHi ? meta.titleHi : meta.titleEn}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{meta.recommendedSize}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums text-emerald-700 dark:text-emerald-400 font-semibold">
                  {isHi ? `${weeklyRateFormatted}/सप्ताह से शुरू (INR)` : `From ${weeklyRateFormatted}/wk (INR)`}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white mt-0.5">
                {isHi ? 'यहाँ विज्ञापन दें - यह स्लॉट बुक करें' : 'Advertise Here - Book This Slot'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">
                {isHi
                  ? 'अपना बैनर पोस्टर और वेबसाइट लिंक अपलोड करें — UPI/NEFT भुगतान सत्यापन के तुरंत बाद पूरे भारत में लाइव।'
                  : 'Upload your banner poster & target URL in Publisher Desk for instant national live placement across India.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onBookSlot?.(slotKey)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-slate-950 text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <span>{isHi ? 'यहाँ विज्ञापन दें - स्लॉट बुक करें' : 'Advertise Here - Book This Slot'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Active & Verified Live Paid Campaign -> Render Custom Banner Poster + Clickable Target URL
  if (variant === 'compact') {
    return (
      <div
        ref={bannerContainerRef}
        className={`w-full rounded-md border border-amber-500/50 bg-[#060f26] overflow-hidden shadow-md ${className}`}
      >
        <div className="px-2.5 py-1 flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-slate-400 border-b border-[#192b59]">
          <span className="text-amber-400 font-bold truncate">
            {isHi ? 'विज्ञापन' : 'ADVERTISEMENT'} · {activeCampaign.brandName}
          </span>
          <span className="text-slate-400 truncate max-w-[110px]">{hostnameLabel}</span>
        </div>
        <a
          href={activeCampaign.targetUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleBannerClick}
          className="block relative group focus:outline-none"
          title={`${activeCampaign.brandName} — ${activeCampaign.targetUrl}`}
        >
          {!imgError ? (
            <img
              src={activeCampaign.bannerUrl}
              alt={activeCampaign.headline || activeCampaign.brandName}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-auto max-h-36 bg-[#07112b] object-contain group-hover:scale-[1.02] transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-24 bg-[#0b1838] flex items-center justify-center gap-2 text-xs text-slate-300 px-3">
              <ImageIcon className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate font-semibold">{activeCampaign.brandName}</span>
            </div>
          )}
          <div className="px-2.5 py-1.5 bg-[#081330] flex items-center justify-between gap-2 text-[11px] text-amber-300 font-semibold">
            <span className="truncate">{activeCampaign.headline || activeCampaign.brandName}</span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </div>
        </a>
      </div>
    );
  }

  return (
    <div id={meta.domTargetId} ref={bannerContainerRef} className={`space-y-1.5 ${className}`}>
      {/* Quiet Disclosure Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 px-0.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-bold text-amber-600 dark:text-amber-400">
            {isHi ? 'विज्ञापन' : 'ADVERTISEMENT'}
          </span>
          <span aria-hidden="true">·</span>
          <span className="truncate font-semibold text-slate-700 dark:text-slate-300">
            {activeCampaign.brandName}
          </span>
          {hostnameLabel && (
            <>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <span className="hidden sm:inline text-slate-400 truncate">{hostnameLabel}</span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => onBookSlot?.(slotKey)}
          className="text-[10px] font-sans font-semibold text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors cursor-pointer"
        >
          {isHi ? 'पब्लिशर डेस्क' : 'Publisher Desk'}
        </button>
      </div>

      {/* Live Advertiser Poster Banner Link */}
      <a
        href={activeCampaign.targetUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={handleBannerClick}
        className="block group relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-[#07112b] shadow-sm hover:shadow-md transition-all focus-visible:outline-2 focus-visible:outline-amber-400"
        title={`${activeCampaign.brandName} · ${activeCampaign.targetUrl}`}
      >
        {!imgError ? (
          <img
            src={activeCampaign.bannerUrl}
            alt={activeCampaign.headline || activeCampaign.brandName}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className={`w-full bg-[#07112b] object-contain transition-transform duration-300 group-hover:scale-[1.01] ${
              variant === 'leaderboard'
                ? 'h-auto max-h-48'
                : 'h-auto max-h-72'
            }`}
          />
        ) : (
          <div className="w-full h-32 bg-slate-900 flex flex-col items-center justify-center gap-1.5 text-slate-300 px-4">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold text-white">{activeCampaign.brandName}</span>
            <span className="text-xs font-mono text-sky-400">{hostnameLabel}</span>
          </div>
        )}

        <div className="px-3.5 py-2 bg-white/95 dark:bg-[#081022]/95 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
            {activeCampaign.headline || activeCampaign.brandName}
          </span>
          <span className="inline-flex items-center gap-1 text-sky-700 dark:text-amber-400 font-semibold whitespace-nowrap shrink-0">
            <span>{isHi ? 'वेबसाइट देखें' : 'Visit Website'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </div>
      </a>
    </div>
  );
};
