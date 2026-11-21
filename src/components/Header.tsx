import React, { useState, useEffect } from 'react';
import {
  Search,
  Headphones,
  Calendar,
  Globe,
  Menu,
  X,
  ChevronRight,
  Zap,
  Radio,
  FileText,
  Crown,
  Scale,
  Sparkles,
  Sun,
  Moon,
  Lock,
  Trophy,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { LanguageSelector } from './LanguageSelector';
import { fetchLiveMarketRadar, getDailyMarketRadar } from '../utils/marketData';
import { NotebookMagazineModal } from './NotebookMagazineModal';
import { PWAInstallButton } from './PWAInstallButton';
import { LiveAdSlotBanner } from './LiveAdSlotBanner';
import { AdSlotKey } from '../data/adSlotsConfig';

interface HeaderProps {
  onOpenSearch: () => void;
  onSubscribeClick: () => void;
  onOpenMonetizationHub?: () => void;
  onBookSlot?: (slotKey: AdSlotKey) => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onSubscribeClick,
  onOpenMonetizationHub,
  onBookSlot,
  activeSection,
  onNavigate,
}) => {
  const { t, langCode, formattedDate, formattedCompactDate } = useLanguage();
  const { theme, isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMagazineModalOpen, setIsMagazineModalOpen] = useState(false);
  const [liveTime, setLiveTime] = useState<string>(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  // Live 1-second local clock for top dateline strip
  useEffect(() => {
    const updateClock = () => {
      const locale = langCode === 'hi' ? 'hi-IN' : 'en-US';
      setLiveTime(
        new Date().toLocaleTimeString(locale, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateClock();
    const clockTimer = setInterval(updateClock, 1000);
    return () => clearInterval(clockTimer);
  }, [langCode]);

  // Live Daily Market Radar (Hydrated from real-time server feed + IST calendar auto-refresh)
  const [marketRadar, setMarketRadar] = useState(() => getDailyMarketRadar());
  const [isRefreshingRadar, setIsRefreshingRadar] = useState(false);

  const syncLiveMarketRadar = async (forceRefresh = false) => {
    if (forceRefresh) setIsRefreshingRadar(true);
    try {
      const liveData = await fetchLiveMarketRadar(forceRefresh);
      setMarketRadar(liveData);
    } finally {
      if (forceRefresh) setIsRefreshingRadar(false);
    }
  };

  useEffect(() => {
    void syncLiveMarketRadar(false);

    const interval = setInterval(() => {
      void syncLiveMarketRadar(false);
    }, 60 * 1000);

    const handleVisibilityOrFocus = () => {
      if (typeof document === 'undefined' || document.visibilityState === 'visible') {
        void syncLiveMarketRadar(false);
      }
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    };
  }, []);

  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleMobileNavigate = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    onNavigate(sectionId);
  };

  const navItems = [
    {
      id: 'live-wire',
      label: langCode === 'hi' ? 'लाइव वायर डेस्क' : 'Live Wire Feeds',
      badge: 'AUTO',
      badgeColor: 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40',
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'cricket-live',
      label: langCode === 'hi' ? 'क्रिकेट लाइव स्कोर' : 'Cricket Live',
      badge: 'LIVE',
      badgeColor: 'bg-rose-900/60 text-rose-300 border border-rose-500/40',
      icon: <Trophy className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'latest-news',
      label: t.globalBriefing,
      icon: <Globe className="w-4 h-4 text-sky-400" />,
    },
    {
      id: 'audio-digest',
      label: t.podcasts,
      icon: <Headphones className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'policy-tracker',
      label: t.capitolPolicy,
      icon: <Scale className="w-4 h-4 text-indigo-400" />,
    },
    {
      id: 'fact-checks',
      label: t.factChecks,
      icon: <FileText className="w-4 h-4 text-teal-400" />,
    },
    {
      id: 'leader-rankings',
      label: t.leaderRankings,
      icon: <Crown className="w-4 h-4 text-amber-400" />,
    },
  ];

  return (
    <header className="w-full bg-[#070e24] border-b border-[#1b2b54] relative z-40 font-sans">
      {/* ==================================================================== */}
      {/* TIER 1: TOP GILDED DATELINE & READER UTILITY STRIP                   */}
      {/* ==================================================================== */}
      <div className="border-b border-[#142347] px-3 sm:px-6 py-1.5 sm:py-2 text-xs text-slate-400 relative z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-4 font-sans">
          {/* Left (Row 1 on Mobile): Full Dateline, Real-Time Clock & Global Bureaus */}
          <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 min-w-0 w-full sm:w-auto pb-1 sm:pb-0 border-b border-[#142347]/60 sm:border-b-0">
            <span className="font-semibold text-slate-100 flex items-center gap-1.5 whitespace-nowrap text-xs sm:text-[13px] min-w-0 truncate" title="Live Current Day & Date">
              <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" aria-hidden="true" />
              {/* Responsive Date: clean compact on mobile & small tablet, full on md+ */}
              <span className="hidden md:inline">{formattedDate || t.editionDate}</span>
              <span className="inline md:hidden font-medium truncate">{formattedCompactDate || formattedDate || t.editionDate}</span>
            </span>
            <span aria-hidden="true" className="text-slate-600 hidden sm:inline">·</span>
            <span className="inline-flex items-center gap-1 text-emerald-300 font-mono font-semibold text-[11px] sm:text-xs tabular-nums whitespace-nowrap shrink-0" title="Real-Time Local Clock">
              <Clock className="w-3 h-3 text-emerald-400 shrink-0" aria-hidden="true" />
              <span>{liveTime}</span>
            </span>
            <span aria-hidden="true" className="text-slate-600 hidden lg:inline">·</span>
            <span className="hidden lg:inline text-slate-400 font-mono text-[11px] uppercase tracking-wider whitespace-nowrap">
              Washington · New Delhi · London · Geneva
            </span>
          </div>

          {/* Right (Row 2 on Mobile): Edition Translation Select & Publisher Desk */}
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 text-slate-400 shrink-0 w-full sm:w-auto">
            {/* Language Selector Dropdown Widget */}
            <LanguageSelector />

            {/* Publisher Wallet & Ad Desk Trigger */}
            <button
              onClick={onOpenMonetizationHub}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-white bg-black hover:bg-neutral-900 border border-white/60 hover:border-white text-[10px] sm:text-[11px] font-semibold cursor-pointer shadow-md transition-all active:scale-95 whitespace-nowrap shrink-0"
              title={
                langCode === 'hi'
                  ? 'पब्लिशर डेस्क (लॉक्ड) एवं विज्ञापन रेट कार्ड'
                  : 'Publisher Desk (Protected) & Media Rate Card'
              }
            >
              <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300 shrink-0 stroke-[2.5]" />
              <span className="hidden sm:inline font-mono font-bold tracking-tight">
                {langCode === 'hi' ? 'पब्लिशर डेस्क' : 'Publisher Desk'}
              </span>
              <span className="inline sm:hidden font-mono font-bold">
                {langCode === 'hi' ? 'डेस्क' : 'Desk'}
              </span>
              <span className="ml-0.5 px-1 sm:px-1.5 py-0.2 rounded-xs text-[8px] sm:text-[9px] bg-amber-400 text-slate-950 font-black tracking-normal">
                {langCode === 'hi' ? 'विज्ञापन' : 'ADS'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TIER 2: GRAND BROADSHEET MASTHEAD (NEW YORK TIMES / FINANCIAL TIMES) */}
      {/* ==================================================================== */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 border-b border-[#142347]">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-3 md:gap-4">
          {/* Left Column: Real-Time Daily Market Radar (Desktop) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col justify-center space-y-1 text-xs font-mono text-slate-300 border-r border-[#15244b] pr-4">
            <div className="flex items-center justify-between text-slate-200 pb-1 border-b border-[#15244b]/80">
              <span className="text-amber-400 font-bold tracking-wider text-xs sm:text-[13px]">MARKET RADAR</span>
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center gap-1"
                  title={marketRadar.statusLabel}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {marketRadar.dateLabel}
                </span>
                <button
                  type="button"
                  onClick={() => void syncLiveMarketRadar(true)}
                  disabled={isRefreshingRadar}
                  className="p-0.5 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer disabled:opacity-50"
                  title={langCode === 'hi' ? 'मार्केट रडार अभी रीफ्रेश करें' : 'Refresh Live Market Radar'}
                  aria-label="Refresh Market Radar"
                >
                  <RefreshCw className={`w-3 h-3 ${isRefreshingRadar ? 'animate-spin text-amber-300' : ''}`} />
                </button>
              </div>
            </div>
            {marketRadar.items.slice(0, 4).map((item) => (
              <div key={item.name} className="flex items-center justify-between text-[12px] leading-relaxed">
                <span className="text-slate-300 font-medium">{item.name}</span>
                <span
                  className={
                    item.isNeutral
                      ? 'text-slate-100 font-bold tabular-nums'
                      : item.isPositive
                      ? 'text-emerald-400 font-bold tabular-nums'
                      : 'text-rose-400 font-bold tabular-nums'
                  }
                >
                  {item.price} {item.change}
                </span>
              </div>
            ))}
          </div>

          {/* Center Column: Iconic Grand Masthead */}
          <div className="col-span-1 md:col-span-12 lg:col-span-6 flex flex-col items-center justify-center text-center min-w-0">
            <div className="w-full flex items-center justify-between md:justify-center gap-1.5 sm:gap-3 relative">
              {/* Mobile Hamburger Trigger (Left on mobile) */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden px-2 py-1.5 rounded-sm bg-[#0a1532] border border-[#1b2f5d] text-slate-200 hover:text-white hover:bg-[#12234e] transition-colors cursor-pointer flex items-center justify-center gap-1 shrink-0"
                aria-label="Open mobile navigation menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Menu className="w-4 h-4 xs:w-5 xs:h-5 text-amber-300" />
                <span className="hidden xs:inline text-[10px] font-mono uppercase tracking-wider text-slate-300 font-bold">Menu</span>
              </button>

              {/* Majestic Typographic Title + Flush Borderless Transparent Horizontal Logo */}
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group flex-1 md:flex-initial inline-flex flex-col items-center justify-center transition-colors select-none py-0.5 min-w-0 max-w-full"
              >
                <h1 className="brand-title text-[15px] xs:text-lg sm:text-3xl lg:text-[1.85rem] xl:text-[2.4rem] font-serif font-black tracking-[0.05em] xs:tracking-[0.1em] sm:tracking-[0.16em] lg:tracking-[0.11em] xl:tracking-[0.15em] uppercase text-slate-100 group-hover:text-amber-300 transition-colors leading-none whitespace-nowrap truncate max-w-full">
                  POLITICS WORLD
                </h1>
                <img
                  src="/images/politics_world_logo.png"
                  alt="Politics World Official Logo"
                  className="w-[132px] xs:w-[178px] sm:w-[290px] lg:w-[290px] xl:w-[360px] h-auto object-contain block -mt-0.5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)]"
                />
              </a>

              {/* Single Install App CTA directly beside Politics World */}
              <div className="shrink-0 flex items-center">
                <PWAInstallButton variant="compact" />
              </div>
            </div>

            {/* Broadsheet Official Edition Strip */}
            <div className="w-full mt-2 pt-2 border-t border-[#162750] flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-300 font-serif">
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] sm:text-xs">
                <span className="text-emerald-400 font-mono font-bold text-[10px] sm:text-[11px] px-1.5 py-0.2 rounded-xs bg-emerald-950/60 border border-emerald-500/30">
                  LIVE
                </span>
                <span className="font-semibold text-slate-200 tracking-wide">
                  {langCode === 'hi' ? 'दैनिक सत्यापित अंतरराष्ट्रीय संस्करण' : 'Verified International Edition'}
                </span>
                <span className="text-slate-600 hidden xs:inline">·</span>
                <span className="hidden xs:inline text-[10px] sm:text-[11px] text-slate-400 font-mono uppercase tracking-wider">
                  24x7 Real-Time Wire
                </span>
              </div>
            </div>

            {/* Classical Latin Editorial Motto */}
            <p className="brand-motto hidden sm:block text-[9px] sm:text-[10px] uppercase tracking-[0.24em] text-amber-200/90 font-serif mt-1.5 border-t border-[#162750]/60 pt-1.5 w-full max-w-lg mx-auto">
              Veritas et Aequitas · Independent Global Journal of Record · Founded MMXXIV
            </p>

            {/* Mobile / Tablet Compact Live Market Radar + Masthead Ad Slot */}
            <div className="lg:hidden w-full max-w-md mx-auto mt-2.5 space-y-2">
              <div className="rounded-md bg-[#050c1f] border border-[#162750] overflow-hidden font-mono">
                <div className="px-2.5 py-1 border-b border-[#142347] flex items-center justify-between text-[9px] uppercase tracking-wider">
                  <span className="text-amber-400 font-bold">MARKET RADAR</span>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          marketRadar.isLiveFeed ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                        }`}
                      />
                      <span>
                        {marketRadar.isLiveFeed ? `LIVE · ${marketRadar.dateLabel}` : marketRadar.dateLabel}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => void syncLiveMarketRadar(true)}
                      disabled={isRefreshingRadar}
                      className="p-0.5 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer disabled:opacity-50"
                      aria-label="Refresh Mobile Market Radar"
                    >
                      <RefreshCw className={`w-2.5 h-2.5 ${isRefreshingRadar ? 'animate-spin text-amber-300' : ''}`} />
                    </button>
                  </div>
                </div>
                <div className="px-1.5 py-1.5 grid grid-cols-4 divide-x divide-[#162750]">
                  {marketRadar.items.slice(0, 4).map((item) => (
                    <div
                      key={item.name}
                      className="flex flex-col items-center justify-center text-center px-1 min-w-0"
                    >
                      <span className="text-[8.5px] sm:text-[10px] text-slate-400 font-semibold tracking-tight truncate w-full leading-tight">
                        {item.name}
                      </span>
                      <span
                        className={`text-[11px] sm:text-xs font-bold tabular-nums leading-snug truncate max-w-full ${
                          item.isNeutral
                            ? 'text-slate-100'
                            : item.isPositive
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <LiveAdSlotBanner
                slotKey="magazine"
                variant="compact"
                onBookSlot={(slotKey) => {
                  if (onBookSlot) onBookSlot(slotKey);
                  else onOpenMonetizationHub?.();
                }}
              />
            </div>
          </div>

          {/* Right Column: Live Masthead Ad Slot (Desktop Broadsheet Card) */}
          <div id="magazine-masthead-slot" className="hidden lg:flex lg:col-span-3 flex-col justify-center border-l border-[#15244b] pl-4">
            <LiveAdSlotBanner
              slotKey="magazine"
              variant="compact"
              onBookSlot={(slotKey) => {
                if (onBookSlot) onBookSlot(slotKey);
                else onOpenMonetizationHub?.();
              }}
            />
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TIER 3: DOUBLE-HAIRLINE EDITORIAL SECTION BAR (DESKTOP)               */}
      {/* ==================================================================== */}
      <nav className="hidden md:block bg-[#050a1c] border-y border-[#162750] py-2 sm:py-2.5 px-4 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-start lg:justify-center gap-3 md:gap-5 lg:gap-7 text-[11px] lg:text-xs font-serif font-bold uppercase tracking-[0.12em] lg:tracking-[0.16em] text-slate-300 overflow-x-auto no-scrollbar">
          <button
            onClick={() => onNavigate('live-wire')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 ${
              activeSection === 'live-wire'
                ? 'text-amber-300 font-black border-b-2 border-amber-400'
                : 'text-slate-300 hover:text-white hover:border-b-2 hover:border-amber-400/50'
            }`}
          >
            <span>{langCode === 'hi' ? 'लाइव वायर' : 'Live Wire'}</span>
          </button>

          <span aria-hidden="true" className="text-slate-700">·</span>

          <button
            onClick={() => onNavigate('cricket-live')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 flex items-center gap-1.5 ${
              activeSection === 'cricket-live'
                ? 'text-amber-300 font-black border-b-2 border-amber-400'
                : 'text-emerald-300 hover:text-white hover:border-b-2 hover:border-amber-400/50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span>{langCode === 'hi' ? 'क्रिकेट लाइव' : 'Cricket Live'}</span>
          </button>

          <span aria-hidden="true" className="text-slate-700">·</span>

          <button
            onClick={() => onNavigate('latest-news')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 ${
              activeSection === 'latest-news'
                ? 'text-amber-300 font-black border-b-2 border-amber-400'
                : 'text-slate-300 hover:text-white hover:border-b-2 hover:border-amber-400/50'
            }`}
          >
            {t.globalBriefing}
          </button>

          <span aria-hidden="true" className="text-slate-700">·</span>

          <button
            onClick={() => onNavigate('audio-digest')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 ${
              activeSection === 'audio-digest'
                ? 'text-amber-300 font-black border-b-2 border-amber-400'
                : 'text-slate-300 hover:text-white hover:border-b-2 hover:border-amber-400/50'
            }`}
          >
            {t.podcasts}
          </button>

          <span aria-hidden="true" className="text-slate-700">·</span>

          <button
            onClick={() => onNavigate('policy-tracker')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 ${
              activeSection === 'policy-tracker'
                ? 'text-amber-300 font-black border-b-2 border-amber-400'
                : 'text-slate-300 hover:text-white hover:border-b-2 hover:border-amber-400/50'
            }`}
          >
            {t.capitolPolicy}
          </button>

          <span aria-hidden="true" className="text-slate-700">·</span>

          <button
            onClick={() => onNavigate('fact-checks')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 ${
              activeSection === 'fact-checks'
                ? 'text-amber-300 font-black border-b-2 border-amber-400'
                : 'text-slate-300 hover:text-white hover:border-b-2 hover:border-amber-400/50'
            }`}
          >
            {t.factChecks}
          </button>

          <span aria-hidden="true" className="text-slate-700">·</span>

          <button
            onClick={() => onNavigate('leader-rankings')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 ${
              activeSection === 'leader-rankings'
                ? 'text-amber-300 font-black border-b-2 border-amber-400'
                : 'text-slate-300 hover:text-white hover:border-b-2 hover:border-amber-400/50'
            }`}
          >
            {t.leaderRankings}
          </button>
        </div>
      </nav>

      {/* ==================================================================== */}
      {/* MOBILE SLIDE-OUT HAMBURGER MENU DRAWER */}
      {/* ==================================================================== */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden overflow-hidden">
          {/* Backdrop Blur Overlay */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            aria-hidden="true"
          />

          {/* Slide-out Drawer from Left */}
          <div
            className="fixed inset-y-0 left-0 w-[86vw] max-w-sm bg-[#060c1d] border-r border-[#1a2c5a] shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col justify-between z-50 text-slate-100 animate-in slide-in-from-left duration-250 font-sans"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Drawer"
          >
            {/* Drawer Top Header: Brand Wordmark + Close Button */}
            <div className="p-4 sm:p-5 border-b border-[#142347] flex items-center justify-between bg-[#070e24]">
              <div>
                <h3 className="brand-title text-xl font-serif font-black tracking-wider text-white uppercase select-none leading-none">
                  POLITICS WORLD
                </h3>
                <img
                  src="/images/politics_world_logo.png"
                  alt="Politics World Official Logo"
                  className="w-44 h-auto object-contain block mt-0.5 drop-shadow-[0_2px_5px_rgba(0,0,0,0.6)]"
                />
                <p className="text-[9px] font-mono uppercase tracking-widest text-amber-300/80 mt-1">
                  Global Journal of Record
                </p>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-sm bg-[#0d1a38] border border-[#1b2f5d] text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close mobile menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Tools Bar (Search, Theme Mode) */}
            <div className="p-3 bg-[#08122c] border-b border-[#122044] grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="p-2 rounded bg-[#0b1736] border border-[#192b57] text-slate-300 hover:text-sky-300 flex flex-col items-center gap-1 cursor-pointer transition-colors"
              >
                <Search className="w-4 h-4 text-sky-400" />
                <span className="text-[10px] font-medium">{t.search}</span>
              </button>

              {/* Mobile Drawer Direct Bright / Dark Mode Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded bg-[#0b1736] border border-[#192b57] text-slate-300 hover:text-amber-300 flex flex-col items-center gap-1 cursor-pointer transition-colors active:scale-95"
                title={isDark ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-300 fill-amber-300/30" />
                    <span className="text-[10px] font-bold text-amber-300">
                      {langCode === 'hi' ? 'ब्राइट' : 'Bright'}
                    </span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-indigo-400 fill-indigo-400/30" />
                    <span className="text-[10px] font-bold text-indigo-300">
                      {langCode === 'hi' ? 'डार्क' : 'Dark'}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Language Selector Option in Mobile Drawer */}
            <div className="px-4 py-2 border-b border-[#122044] bg-[#070e24]">
              <LanguageSelector
                variant="drawer"
                onLanguageSelected={() => setIsMobileMenuOpen(false)}
              />
            </div>

            {/* Drawer Navigation Links Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 px-3 pb-1">
                {langCode === 'hi' ? 'संपादकीय विभाग एवं प्रसारण' : 'Editorial Sections & Broadcasts'}
              </div>

              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMobileNavigate(item.id)}
                    className={`w-full p-2.5 rounded-sm flex items-center justify-between text-left text-xs font-serif tracking-wide transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-[#0e1d44] border-amber-400/60 text-amber-300 font-bold shadow-sm'
                        : 'bg-transparent border-transparent text-slate-300 hover:bg-[#0a1532] hover:text-white hover:border-[#15254d]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="shrink-0">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                  </button>
                );
              })}

              {/* India Publisher & Ad Desk Link in mobile menu */}
              {onOpenMonetizationHub && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenMonetizationHub();
                  }}
                  className="w-full p-2.5 rounded-sm flex items-center justify-between text-left text-xs text-white bg-black hover:bg-neutral-900 transition-colors cursor-pointer border border-white/50"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-amber-300 shrink-0" />
                    <span className="font-bold font-mono">
                      {langCode === 'hi' ? 'पब्लिशर एवं विज्ञापन डेस्क (भारत)' : 'India Publisher & Ad Desk'}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                </button>
              )}

              {/* Live Magazine Ad Slot in mobile drawer */}
              <div onClick={() => setIsMobileMenuOpen(false)}>
                <LiveAdSlotBanner
                  slotKey="magazine"
                  variant="compact"
                  onBookSlot={(slotKey) => {
                    setIsMobileMenuOpen(false);
                    if (onBookSlot) onBookSlot(slotKey);
                    else onOpenMonetizationHub?.();
                  }}
                />
              </div>
            </div>

            {/* Drawer Bottom Action: Dateline & Bureau info */}
            <div className="p-4 border-t border-[#142347] bg-[#070e24] space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>{formattedDate || t.editionDate}</span>
                <span>ISSN 2831-9042</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider text-center pt-1 border-t border-[#142347]/60">
                Washington · New Delhi · London · Geneva · Etc.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notebook Magazine Interactive Order & Ad Booking Modal */}
      <NotebookMagazineModal
        isOpen={isMagazineModalOpen}
        onClose={() => setIsMagazineModalOpen(false)}
        onOpenMonetizationHub={onOpenMonetizationHub}
      />
    </header>
  );
};
