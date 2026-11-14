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
  Wallet,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { LanguageSelector } from './LanguageSelector';
import { getDailyMarketRadar } from '../utils/marketData';
import { NotebookMagazineModal } from './NotebookMagazineModal';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  onOpenSearch: () => void;
  onSubscribeClick: () => void;
  onOpenMonetizationHub?: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onSubscribeClick,
  onOpenMonetizationHub,
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

  // Dynamic Daily Market Radar (Updates daily based on calendar date + intraday movement)
  const [marketRadar, setMarketRadar] = useState(() => getDailyMarketRadar());

  // Re-sync market indicators periodically (every 30 seconds)
  useEffect(() => {
    setMarketRadar(getDailyMarketRadar());

    const interval = setInterval(() => {
      setMarketRadar(getDailyMarketRadar());
    }, 30000);

    return () => clearInterval(interval);
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
      id: 'leader-rankings',
      label: t.leaderRankings,
      icon: <Crown className="w-4 h-4 text-amber-400" />,
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
      id: 'audio-digest',
      label: t.podcasts,
      icon: <Headphones className="w-4 h-4 text-cyan-400" />,
    },
  ];

  return (
    <header className="w-full bg-[#070e24] border-b border-[#1b2b54] relative z-40 font-sans">
      {/* ==================================================================== */}
      {/* TIER 1: TOP GILDED DATELINE & READER UTILITY STRIP                   */}
      {/* ==================================================================== */}
      <div className="border-b border-[#142347] px-3 sm:px-6 py-1.5 sm:py-2 text-xs text-slate-400 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 font-sans">
          {/* Left: Full Dateline, Real-Time Clock & Global Bureaus */}
          <div className="flex items-center gap-2 sm:gap-3 shrink min-w-0">
            <span className="font-semibold text-slate-100 flex items-center gap-1.5 whitespace-nowrap text-xs sm:text-[13px]" title="Live Current Day & Date">
              <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" aria-hidden="true" />
              {/* Responsive Date: clean compact on mobile & small tablet so Tier 1 stays single-line, full on md+ */}
              <span className="hidden md:inline">{formattedDate || t.editionDate}</span>
              <span className="inline md:hidden font-medium">{formattedCompactDate || formattedDate || t.editionDate}</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="inline-flex items-center gap-1 text-emerald-300 font-mono font-semibold text-[11px] sm:text-xs tabular-nums whitespace-nowrap" title="Real-Time Local Clock">
              <Clock className="w-3 h-3 text-emerald-400 shrink-0" aria-hidden="true" />
              <span>{liveTime}</span>
            </span>
            <span aria-hidden="true" className="text-slate-600 hidden md:inline">·</span>
            <span className="hidden lg:inline text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              Washington · New Delhi · London · Geneva
            </span>
          </div>

          {/* Right: Quick Utilities & Edition Select */}
          <div className="flex items-center gap-2 sm:gap-3 text-slate-400 shrink-0">
            {/* Install App Trigger (PWA / Mobile Home Screen) */}
            <PWAInstallButton variant="header" />

            {/* Language Selector Dropdown Widget */}
            <LanguageSelector />

            {/* Publisher Wallet & Ad Desk Trigger */}
            <button
              onClick={onOpenMonetizationHub}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-full text-white bg-black hover:bg-neutral-900 border border-white/60 hover:border-white text-[10px] sm:text-[11px] font-semibold cursor-pointer shadow-md transition-all active:scale-95 whitespace-nowrap shrink-0"
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
          {/* Left Column: Financial & Geopolitical Market Radar (Desktop Only - Dynamic Daily Updates) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col justify-center space-y-1.5 text-xs font-mono text-slate-300 border-r border-[#15244b] pr-4">
            <div className="flex items-center justify-between text-slate-200 pb-1 border-b border-[#15244b]/80">
              <span className="text-amber-400 font-bold tracking-wider text-xs sm:text-[13px]">MARKET RADAR</span>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {marketRadar.dateLabel}
              </span>
            </div>
            {marketRadar.items.slice(0, 3).map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs sm:text-[13px] leading-relaxed">
                <span className="text-slate-300 font-medium">{item.name}</span>
                <span
                  className={
                    item.isNeutral
                      ? 'text-slate-100 font-bold'
                      : item.isPositive
                      ? 'text-emerald-400 font-bold'
                      : 'text-rose-400 font-bold'
                  }
                >
                  {item.price} {item.change}
                </span>
              </div>
            ))}
          </div>

          {/* Center Column: Iconic Grand Masthead */}
          <div className="col-span-1 md:col-span-12 lg:col-span-6 flex flex-col items-center justify-center text-center min-w-0">
            <div className="w-full grid grid-cols-[1fr_auto_1fr] md:flex items-center md:justify-center gap-1.5 sm:gap-2 relative">
              {/* Mobile Hamburger Trigger (Left on mobile) */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden justify-self-start px-2 py-1.5 xs:p-2 rounded-sm bg-[#0a1532] border border-[#1b2f5d] text-slate-200 hover:text-white hover:bg-[#12234e] transition-colors cursor-pointer flex items-center justify-center gap-1 shrink-0"
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
                className="group inline-flex flex-col items-center justify-self-center transition-colors select-none py-0.5 min-w-0 max-w-full"
              >
                <h1 className="brand-title text-base xs:text-xl sm:text-4xl lg:text-[2.25rem] xl:text-[2.85rem] font-serif font-black tracking-[0.06em] xs:tracking-[0.12em] sm:tracking-[0.18em] lg:tracking-[0.14em] xl:tracking-[0.18em] uppercase text-slate-100 group-hover:text-amber-300 transition-colors leading-none whitespace-nowrap">
                  POLITICS WORLD
                </h1>
                <img
                  src="/images/politics_world_logo.png"
                  alt="Politics World Official Logo"
                  className="w-[150px] xs:w-[205px] sm:w-[340px] lg:w-[350px] xl:w-[410px] h-auto object-contain block -mt-0.5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)]"
                />
              </a>

              {/* Top-Right Mobile Install CTA (immediately visible at top of mobile screen) */}
              <div className="md:hidden justify-self-end shrink-0">
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

            {/* Mobile / Tablet Quick Action Strip: Install App + Sponsored Notebook Magazine */}
            <div className="lg:hidden w-full max-w-2xl mx-auto mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 items-stretch">
              <PWAInstallButton variant="banner" />

              <div
                onClick={() => setIsMagazineModalOpen(true)}
                className="w-full h-full p-1.5 sm:p-2 bg-gradient-to-r from-[#071333] via-[#0b1e4f] to-[#071333] border border-amber-500/50 rounded-xs flex items-center justify-between gap-2 cursor-pointer shadow-sm active:scale-[0.99] transition-all"
                title="Notebook Magazine Advertisement"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-9 sm:w-9 sm:h-10 shrink-0 rounded-xs overflow-hidden border border-amber-400/60 shadow-xs bg-[#040816]">
                    <img
                      src="/src/assets/images/notebook_magazine_cover_1794245314092.jpg"
                      alt="Notebook Magazine"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-serif font-black text-amber-300 truncate">NOTEBOOK MAGAZINE</span>
                      <span className="text-[8px] px-1 bg-amber-400/25 text-amber-300 font-mono rounded-xs font-bold border border-amber-400/30 shrink-0">AD</span>
                    </div>
                    <div className="text-[10px] text-slate-200 truncate font-sans">
                      {langCode === 'hi' ? 'त्रैमासिक कूटनीतिक विशेषांक' : 'Quarterly Review · Issue 47'}
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-bold rounded-xs shrink-0 whitespace-nowrap shadow-xs">
                  {langCode === 'hi' ? 'देखें ↗' : 'View Ad ↗'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Sponsored Notebook Magazine Ad Box (Horizontal Broadsheet Card) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col justify-center border-l border-[#15244b] pl-4">
            <div
              onClick={() => setIsMagazineModalOpen(true)}
              className="group relative w-full bg-gradient-to-br from-[#060f26] via-[#0a1840] to-[#0e2156] hover:to-[#152d72] border border-amber-500/45 hover:border-amber-400 rounded-sm p-2.5 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_8px_24px_rgba(212,175,55,0.22)] active:scale-[0.99]"
              title={langCode === 'hi' ? 'प्रायोजित विज्ञापन: नोटबुक पत्रिका (क्लिक करके विवरण देखें)' : 'Sponsored Advertisement: Notebook Magazine Quarterly Review (Click for details)'}
            >
              {/* Sponsored Top Label Bar */}
              <div className="flex items-center justify-between gap-1 text-[9px] font-mono uppercase tracking-wider text-amber-400/90 pb-1.5 mb-2 border-b border-[#1c3268]">
                <span className="flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                  <span>{langCode === 'hi' ? 'विज्ञापन' : 'SPONSORED'}</span>
                </span>
                <span className="text-[8px] px-1.5 py-0.2 bg-amber-950/80 text-amber-300 border border-amber-500/40 rounded-xs font-semibold">
                  AD #01
                </span>
              </div>

              {/* Magazine Thumbnail + Text Details */}
              <div className="flex items-center gap-2.5">
                <div className="w-14 h-[74px] shrink-0 rounded-xs overflow-hidden border border-amber-400/70 shadow-md group-hover:scale-105 transition-transform duration-300 bg-[#050b1a]">
                  <img
                    src="/src/assets/images/notebook_magazine_cover_1794245314092.jpg"
                    alt="Notebook Magazine Official Cover"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 text-left space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="text-amber-300 font-serif font-black text-xs tracking-wider uppercase group-hover:text-amber-200 truncate">
                      NOTEBOOK
                    </span>
                    <span className="text-slate-950 text-[8px] font-bold font-sans px-1 py-0.2 bg-amber-400 rounded-xs shrink-0">
                      MAG
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-200 font-serif leading-tight line-clamp-1">
                    {langCode === 'hi' ? 'त्रैमासिक नीति विशेषांक' : 'Quarterly Policy Review'}
                  </p>

                  <p className="text-[9px] text-amber-200/85 font-mono truncate">
                    {langCode === 'hi' ? 'प्रिंट + डिजिटल · अंक 47' : 'Winter 2026 · Issue 47'}
                  </p>

                  <div className="pt-0.5">
                    <span className="w-full inline-flex items-center justify-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 group-hover:from-amber-300 group-hover:to-amber-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider rounded-xs transition-all shadow-xs whitespace-nowrap">
                      <span>{langCode === 'hi' ? 'देखें / बुक करें' : 'Order / Book Ad'}</span>
                      <span className="text-slate-900 group-hover:translate-x-0.5 transition-transform">↗</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
            onClick={() => onNavigate('leader-rankings')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 ${
              activeSection === 'leader-rankings'
                ? 'text-amber-300 font-black border-b-2 border-amber-400'
                : 'text-slate-300 hover:text-white hover:border-b-2 hover:border-amber-400/50'
            }`}
          >
            {t.leaderRankings}
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
            onClick={() => onNavigate('audio-digest')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 ${
              activeSection === 'audio-digest'
                ? 'text-amber-300 font-black border-b-2 border-amber-400'
                : 'text-slate-300 hover:text-white hover:border-b-2 hover:border-amber-400/50'
            }`}
          >
            {t.podcasts}
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

              {/* Digital Wallet & Ledger Link in mobile menu */}
              {onOpenMonetizationHub && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenMonetizationHub();
                  }}
                  className="w-full p-2.5 rounded-sm flex items-center justify-between text-left text-xs text-white bg-black hover:bg-neutral-900 transition-colors cursor-pointer border border-white/50"
                >
                  <div className="flex items-center gap-3">
                    <Wallet className="w-4 h-4 text-amber-300 shrink-0" />
                    <span className="font-bold font-mono">
                      {langCode === 'hi' ? 'डिजिटल वॉलेट व लेजर (Wallet & Payouts)' : 'Digital Wallet & Ledger (Payouts)'}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                </button>
              )}

              {/* Install Mobile App CTA inside Mobile Drawer */}
              <PWAInstallButton variant="drawer" />

              {/* Notebook Magazine Sponsored Slot in mobile drawer */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsMagazineModalOpen(true);
                }}
                className="w-full p-2.5 rounded-sm flex items-center justify-between text-left text-xs text-amber-200 bg-gradient-to-r from-[#07122e] to-[#0a1a42] hover:to-[#0f245a] transition-colors cursor-pointer border border-amber-400/40"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src="/src/assets/images/notebook_magazine_cover_1794245314092.jpg"
                    alt="Notebook Magazine"
                    className="w-7 h-9 object-cover rounded-xs border border-amber-400/50 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-amber-300 font-serif">NOTEBOOK MAGAZINE</div>
                    <div className="text-[10px] text-slate-300 font-sans">
                      {langCode === 'hi' ? 'विशेष पत्रिका · प्रिंट एवं डिजिटल' : 'Quarterly Issue 47 · Print & Digital'}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-amber-500/20 text-amber-300 font-mono shrink-0">
                  {langCode === 'hi' ? 'विज्ञापन' : 'SPONSORED'}
                </span>
              </button>
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
