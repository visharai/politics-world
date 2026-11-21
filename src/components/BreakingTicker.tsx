import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Radio,
  X,
  ArrowUpRight,
  Bell,
} from 'lucide-react';
import { LIVE_INCOMING_DISPATCHES, BreakingDispatchItem } from '../data/newsData';
import { liveNewsService } from '../services/liveNewsService';
import { translationService } from '../services/translationService';
import { translateText as universalTranslateText } from '../utils/universalTranslator';

interface BreakingTickerProps {
  onSelectBreaking: (title: string, category: string, time: string) => void;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({ onSelectBreaking }) => {
  const { t, langCode, translatedBreakingDispatches, translateBreakingItem } = useLanguage();
  
  // Array of active dispatches
  const [activeDispatches, setActiveDispatches] = useState<BreakingDispatchItem[]>(translatedBreakingDispatches);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newArrivalToast, setNewArrivalToast] = useState<string | null>(null);
  const [incomingQueueIndex, setIncomingQueueIndex] = useState(0);
  const [animatingKey, setAnimatingKey] = useState(0);

  // 1 Minute (60 seconds) Headline rotation timer configuration
  const [headlineIntervalSeconds, setHeadlineIntervalSeconds] = useState<number>(60);
  const [countdown, setCountdown] = useState<number>(60);

  // Sync active dispatches with real-time live GNews wire
  useEffect(() => {
    let isMounted = true;
    const loadLiveTicker = async () => {
      try {
        const wire = await liveNewsService.getLiveWire('all', '', langCode);
        if (isMounted && wire && wire.length > 0) {
          if (langCode === 'en') {
            const liveDispatches: BreakingDispatchItem[] = wire.map((w, idx) => ({
              id: `ticker-${w.id || idx}`,
              timestamp: w.relativeTime || 'Just now · Live',
              category: w.source ? `${w.source.toUpperCase()}` : 'GNEWS LIVE',
              title: w.title,
              urgent: idx === 0,
            }));
            setActiveDispatches(liveDispatches);
            return;
          }

          // Step 1: Instant local dictionary translation (0 ms)
          const instantDispatches: BreakingDispatchItem[] = wire.map((w, idx) => ({
            id: `ticker-${w.id || idx}`,
            timestamp: w.relativeTime || 'Just now · Live',
            category: w.source ? `${w.source.toUpperCase()}` : 'GNEWS LIVE',
            title: universalTranslateText(w.title, langCode),
            urgent: idx === 0,
          }));
          setActiveDispatches(instantDispatches);

          // Step 2: High-accuracy server translation (<1s)
          const titles = wire.map((w) => w.title);
          translationService.translateBatch(titles, langCode).then((tTitles) => {
            if (isMounted && tTitles && tTitles.length > 0) {
              const fullDispatches: BreakingDispatchItem[] = wire.map((w, idx) => ({
                id: `ticker-${w.id || idx}`,
                timestamp: w.relativeTime || 'Just now · Live',
                category: w.source ? `${w.source.toUpperCase()}` : 'GNEWS LIVE',
                title: tTitles[idx] || instantDispatches[idx].title,
                urgent: idx === 0,
              }));
              setActiveDispatches(fullDispatches);
            }
          });
          return;
        }
      } catch (err) {
        // fallback
      }
      if (isMounted) {
        const mapped = translatedBreakingDispatches.map((item) =>
          translateBreakingItem ? translateBreakingItem(item) : item
        );
        setActiveDispatches(mapped);
      }
    };
    loadLiveTicker();
    const interval = setInterval(loadLiveTicker, 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [langCode, translateBreakingItem, translatedBreakingDispatches]);

  // Rotate ticker every 1 minute (60 seconds) when playing and not hovered so every story can be read completely
  useEffect(() => {
    if (!isPlaying || isHovered || activeDispatches.length === 0) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCurrentIndex((curr) => (curr + 1) % activeDispatches.length);
          setAnimatingKey((k) => k + 1);
          return headlineIntervalSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, isHovered, activeDispatches.length, headlineIntervalSeconds]);

  // Periodic simulation of new breaking stories arriving over the wire (every 32 seconds)
  useEffect(() => {
    if (incomingQueueIndex >= LIVE_INCOMING_DISPATCHES.length) return;

    const arrivalTimer = setInterval(() => {
      setIncomingQueueIndex((prevQueueIdx) => {
        if (prevQueueIdx >= LIVE_INCOMING_DISPATCHES.length) return prevQueueIdx;
        const incomingRaw = LIVE_INCOMING_DISPATCHES[prevQueueIdx];
        const incomingTranslated = translateBreakingItem ? translateBreakingItem(incomingRaw) : incomingRaw;

        // Stamp with current local time (clean standard format)
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newStory: BreakingDispatchItem = {
          ...incomingTranslated,
          timestamp: timeStr,
          urgent: true,
        };

        setActiveDispatches((prevList) => {
          // Avoid duplicates
          if (prevList.some((p) => p.id === newStory.id)) return prevList;
          // Prepend as the immediate next or current story
          return [newStory, ...prevList];
        });

        // Smoothly insert without disrupting reading position
        setCurrentIndex((prev) => (prev === 0 ? 0 : prev + 1));
        setNewArrivalToast(newStory.title);

        return prevQueueIdx + 1;
      });
    }, 45000);

    return () => clearInterval(arrivalTimer);
  }, [incomingQueueIndex, translateBreakingItem]);

  // Auto-hide toast after 6 seconds
  useEffect(() => {
    if (!newArrivalToast) return;
    const toastTimer = setTimeout(() => {
      setNewArrivalToast(null);
    }, 6000);
    return () => clearTimeout(toastTimer);
  }, [newArrivalToast]);

  const currentItem = activeDispatches[currentIndex] || activeDispatches[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + activeDispatches.length) % activeDispatches.length);
    setAnimatingKey((k) => k + 1);
    setCountdown(headlineIntervalSeconds);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeDispatches.length);
    setAnimatingKey((k) => k + 1);
    setCountdown(headlineIntervalSeconds);
  };

  const handleJumpTo = (index: number) => {
    setCurrentIndex(index);
    setAnimatingKey((k) => k + 1);
  };

  if (!currentItem) return null;

  return (
    <>
      <div
        className="w-full bg-[#050a1b] border-b border-amber-500/20 text-slate-200 font-sans relative z-20 select-none shadow-xs"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-1.5 flex items-center justify-between gap-2 sm:gap-3">
          {/* Ticker Lead Tag & Live Pulse Indicator */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-gradient-to-r from-amber-500/12 via-amber-400/8 to-amber-500/5 border border-amber-400/30 text-amber-200/95 text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.16em] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-[pulse_3s_ease-in-out_infinite] absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-300 shadow-[0_0_5px_rgba(252,211,77,0.55)]"></span>
              </span>
              <Zap className="w-2.5 h-2.5 fill-amber-300/85 text-amber-300/90" />
              <span>{t.breakingDispatch}</span>
            </span>

            <span aria-hidden="true" className="text-slate-700 hidden sm:inline">|</span>
          </div>

          {/* Ticker Content with Animated Transition */}
          <div className="flex-1 min-w-0 overflow-hidden flex items-center">
            <button
              key={animatingKey}
              onClick={() => onSelectBreaking(currentItem.title, currentItem.category, currentItem.timestamp)}
              className="text-left group flex items-baseline gap-2 w-full truncate cursor-pointer transition-all duration-300 transform animate-fade-in"
              title="Click to read full wire report"
            >
              {/* Timestamp badge */}
              <span className="hidden sm:inline-block text-[11px] font-mono text-sky-400 bg-sky-950/60 px-1.5 py-0.2 rounded border border-sky-800/40 shrink-0 tabular-nums font-semibold">
                {currentItem.timestamp}
              </span>

              {/* Category pill */}
              <span className="hidden xs:inline-block text-[11px] font-bold uppercase tracking-wider text-amber-400/90 shrink-0">
                {currentItem.category}
              </span>

              <span aria-hidden="true" className="text-slate-600 shrink-0 hidden xs:inline">·</span>

              {/* Headline Title */}
              <span className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-amber-200 group-hover:underline truncate transition-colors">
                {currentItem.title}
              </span>
            </button>
          </div>

          {/* Minimalist Prev/Next Controls Only */}
          <div className="flex items-center gap-1 text-slate-400 shrink-0">
            <button
              onClick={handlePrev}
              className="p-1 rounded hover:bg-[#14234b] text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Previous Dispatch"
              title="Previous headline"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleNext}
              className="p-1 rounded hover:bg-[#14234b] text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Next Dispatch"
              title="Next headline"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Synchronized 1-minute progress indicator bar */}
        {isPlaying && !isHovered && (
          <div className="h-[2px] w-full bg-[#0a142e] overflow-hidden">
            <div
              key={`${currentIndex}-${headlineIntervalSeconds}`}
              className="h-full bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 transition-[width] duration-1000 ease-linear shadow-[0_0_8px_rgba(245,158,11,0.5)]"
              style={{
                width: `${Math.min(100, Math.max(0, ((headlineIntervalSeconds - countdown) / headlineIntervalSeconds) * 100))}%`,
              }}
            />
          </div>
        )}
      </div>

      {/* Floating Incoming Story Alert Toast */}
      {newArrivalToast && (
        <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:bottom-6 sm:right-6 z-50 sm:max-w-md bg-[#0a1636] border border-amber-500/50 shadow-2xl rounded-lg p-3 text-slate-100 flex items-start gap-3 animate-slide-up backdrop-blur-md">
          <div className="p-2 rounded-full bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
            <Bell className="w-4 h-4 animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-amber-300 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300 animate-ping inline-block" />
                {langCode === 'hi' ? 'ताज़ा ब्रेकिंग' : 'NEW BREAKING'}
              </span>
              <button
                onClick={() => setNewArrivalToast(null)}
                className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs font-semibold text-slate-200 mt-1 line-clamp-2">
              {newArrivalToast}
            </p>
            <button
              onClick={() => {
                const toastItem = activeDispatches.find((d) => d.title === newArrivalToast) || activeDispatches[0];
                onSelectBreaking(toastItem.title, toastItem.category, toastItem.timestamp);
                setNewArrivalToast(null);
              }}
              className="mt-2 text-[11px] font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
            >
              Open Full Dispatch <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* All Breaking Dispatches Full-Feed Modal Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-[#09142e] border border-[#1d3161] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#1b2f5c] flex items-center justify-between bg-[#070f24]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    {t.breakingDispatch} - Live Bulletins
                    <span className="text-xs font-mono font-normal text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/50">
                      {activeDispatches.length} active dispatches
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Real-time geopolitical, legislative, and diplomatic bulletins updated continuously
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dispatch List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5 divide-y divide-[#15254a]">
              {activeDispatches.map((item, index) => {
                const isSelected = index === currentIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      handleJumpTo(index);
                      onSelectBreaking(item.title, item.category, item.timestamp);
                      setIsDrawerOpen(false);
                    }}
                    className={`pt-2.5 first:pt-0 p-3 rounded-lg cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-[#0e214d] border-amber-500/60 text-white shadow-md'
                        : 'bg-[#071126]/60 border-slate-800/60 hover:bg-[#0c1a3b] hover:border-slate-700 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                          {item.category}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                          {item.timestamp}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isSelected && (
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            Now Playing
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-100 hover:text-amber-200 transition-colors">
                      {item.title}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Footer with actions */}
            <div className="p-3.5 border-t border-[#1b2f5c] bg-[#070f24] flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {langCode === 'hi'
                  ? 'पूरी रिपोर्ट पढ़ने के लिए किसी भी खबर पर क्लिक करें।'
                  : 'Click any headline to open the full dispatch report.'}
              </span>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-3.5 py-1.5 rounded text-xs font-semibold bg-[#12234e] hover:bg-[#1a3370] text-slate-200 transition-colors cursor-pointer"
              >
                {langCode === 'hi' ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
