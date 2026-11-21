import React, { useState, useEffect } from 'react';
import {
  Radio,
  RefreshCw,
  Volume2,
  Square,
  ChevronRight,
  Clock,
  Zap,
  Flame,
  Check,
  Search,
  Key,
  ShieldCheck,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  liveNewsService,
  LiveWireItem,
} from '../services/liveNewsService';
import { Article } from '../data/newsData';
import { podcastAudioEngine, TranscriptLine } from '../utils/podcastAudio';
import { gnewsService } from '../services/gnewsService';
import { translationService } from '../services/translationService';
import { translateText as universalTranslateText } from '../utils/universalTranslator';
import { LiveAdSlotBanner } from './LiveAdSlotBanner';
import { AdSlotKey } from '../data/adSlotsConfig';

interface LiveWireSectionProps {
  onOpenArticle: (article: Article) => void;
  onBookSlot?: (slotKey: AdSlotKey) => void;
}

const GNEWS_TOPIC_CATEGORIES = [
  { id: 'general', nameEn: 'General & World', nameHi: 'विश्व व सामान्य' },
  { id: 'world', nameEn: 'Global Geopolitics', nameHi: 'वैश्विक कूटनीति' },
  { id: 'nation', nameEn: 'Capitol & Nation', nameHi: 'राष्ट्रीय व संसद' },
  { id: 'business', nameEn: 'Business & Markets', nameHi: 'व्यापार व बाजार' },
  { id: 'technology', nameEn: 'Technology & AI', nameHi: 'प्रौद्योगिकी व AI' },
  { id: 'science', nameEn: 'Science & Defense', nameHi: 'विज्ञान व रक्षा' },
];

export const LiveWireSection: React.FC<LiveWireSectionProps> = ({
  onOpenArticle,
  onBookSlot,
}) => {
  const { langCode } = useLanguage();
  const [wireItems, setWireItems] = useState<LiveWireItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<Date>(new Date());
  const [isNarratingWire, setIsNarratingWire] = useState(false);
  const [activeNarratingId, setActiveNarratingId] = useState<string | null>(null);
  const [refreshNotice, setRefreshNotice] = useState<string | null>(null);
  const [countdownSeconds, setCountdownSeconds] = useState(30);

  // GNews API Key Inline Config State
  const [isKeyDrawerOpen, setIsKeyDrawerOpen] = useState(false);
  const [inputApiKey, setInputApiKey] = useState(gnewsService.getApiKey());
  const [keySavedStatus, setKeySavedStatus] = useState<string | null>(null);
  const [gnewsStatus, setGnewsStatus] = useState(gnewsService.getStatus());

  const applyTranslatedWire = async (items: LiveWireItem[], targetLang: string) => {
    if (!items || items.length === 0 || targetLang === 'en') {
      setWireItems(items);
      return;
    }

    // Step 1: Immediate local synchronous translation (<5ms)
    const instantMapped = items.map((it) => ({
      ...it,
      title: universalTranslateText(it.title, targetLang),
      deck: it.deck ? universalTranslateText(it.deck, targetLang) : it.deck,
      leadParagraph: it.leadParagraph ? universalTranslateText(it.leadParagraph, targetLang) : it.leadParagraph,
    }));
    setWireItems(instantMapped);

    // Step 2: High-accuracy server translation for all 16 languages (<1.5s)
    try {
      const titles = items.map((it) => it.title);
      const decks = items.map((it) => it.deck || it.leadParagraph || '');
      const [tTitles, tDecks] = await Promise.all([
        translationService.translateBatch(titles, targetLang),
        translationService.translateBatch(decks, targetLang),
      ]);

      const fullyTranslated = items.map((it, idx) => ({
        ...it,
        title: tTitles[idx] || instantMapped[idx].title,
        deck: tDecks[idx] || instantMapped[idx].deck,
        leadParagraph: tDecks[idx] || instantMapped[idx].leadParagraph,
      }));
      setWireItems(fullyTranslated);
    } catch {
      // keep instantMapped
    }
  };

  const loadWire = async () => {
    setIsRefreshing(true);
    try {
      const items = await liveNewsService.getLiveWire(selectedCategory, searchQuery, langCode);
      await applyTranslatedWire(items, langCode);
      setLastRefreshedTime(new Date());
      setGnewsStatus(gnewsService.getStatus());
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    void gnewsService.checkServerStatus().then(() => {
      setGnewsStatus(gnewsService.getStatus());
    });
  }, []);

  useEffect(() => {
    loadWire();
    setCountdownSeconds(30);
  }, [selectedCategory, searchQuery, langCode]);

  // Second-by-second countdown timer for automated live GNews sweep
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          liveNewsService.refreshWire(selectedCategory, searchQuery, langCode).then((updated) => {
            applyTranslatedWire(updated, langCode);
            setLastRefreshedTime(new Date());
            setGnewsStatus(gnewsService.getStatus());
          });
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedCategory, searchQuery, langCode]);

  useEffect(() => {
    return () => {
      if (podcastAudioEngine.getIsPlaying()) {
        podcastAudioEngine.stop();
      }
    };
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const updated = await liveNewsService.refreshWire(selectedCategory, searchQuery, langCode);
      await applyTranslatedWire(updated, langCode);
      setLastRefreshedTime(new Date());
      setGnewsStatus(gnewsService.getStatus());
      setRefreshNotice(langCode === 'hi' ? 'ताज़ा GNews लाइव समाचार प्राप्त!' : 'Fresh GNews live dispatches fetched!');
      setTimeout(() => setRefreshNotice(null), 3000);
      setCountdownSeconds(30);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSaveApiKey = () => {
    const trimmed = inputApiKey.trim();
    gnewsService.setApiKey(trimmed);
    setGnewsStatus(gnewsService.getStatus());
    setKeySavedStatus(langCode === 'hi' ? 'GNews API Key सफलतापूर्वक सुरक्षित की गई!' : 'GNews API Key saved successfully!');
    setTimeout(() => setKeySavedStatus(null), 3000);
    handleManualRefresh();
  };

  const handleClearApiKey = () => {
    gnewsService.setApiKey('');
    setInputApiKey('');
    void gnewsService.checkServerStatus().then(() => {
      setGnewsStatus(gnewsService.getStatus());
    });
    setKeySavedStatus(langCode === 'hi' ? 'लोकल की हटाई गई — सर्वर लाइव वायर सक्रिय है।' : 'Local key cleared — Server Live Wire remains active.');
    setTimeout(() => setKeySavedStatus(null), 3000);
    handleManualRefresh();
  };

  // Play audio broadcast of wire headlines
  const handleToggleNarrateAll = () => {
    podcastAudioEngine.unlockAudio();
    if (isNarratingWire) {
      podcastAudioEngine.pause();
      setIsNarratingWire(false);
      setActiveNarratingId(null);
      return;
    }

    if (wireItems.length === 0) return;

    setIsNarratingWire(true);
    setActiveNarratingId('all');

    const fullScript = wireItems
      .slice(0, 6)
      .map((item) => `${item.title} ${item.deck || ''}`)
      .join(' ');

    podcastAudioEngine.playContinuous(
      fullScript,
      {
        onTimeUpdate: () => {},
        onSegmentChange: () => {},
        onStateChange: (playing) => {
          setIsNarratingWire(playing);
          if (!playing) setActiveNarratingId(null);
        },
      },
      langCode,
      false
    );
  };

  const handleArticleClick = (wireItem: LiveWireItem) => {
    const article = liveNewsService.wireItemToArticle(wireItem);
    onOpenArticle(article);
  };

  return (
    <section id="live-wire" className="w-full bg-[#040816] border-y-2 border-[#16274e] py-6 sm:py-8 text-slate-100 font-sans relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-[#152349] mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
              </span>
              <span>{langCode === 'hi' ? '0-डिले रियल-टाइम अंतरराष्ट्रीय समाचार वायर' : 'Real-Time 0-Delay Global News Wire'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight flex flex-wrap items-center gap-2.5">
              <span>{langCode === 'hi' ? 'रियल-टाइम लाइव अंतरराष्ट्रीय समाचार' : 'Real-Time Live Global News Wire'}</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>{langCode === 'hi' ? 'लाइव 24/7' : 'Live 24/7'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-[#0b1736] text-cyan-300 border border-cyan-500/30 tabular-nums">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  {langCode === 'hi' ? 'अपडेट:' : 'Updated:'}{' '}
                  {lastRefreshedTime.toLocaleTimeString(langCode === 'hi' ? 'hi-IN' : 'en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl font-sans mt-1.5">
              {langCode === 'hi'
                ? 'BBC World, BBC हिन्दी, Al Jazeera और The Guardian जैसी विश्वसनीय अंतरराष्ट्रीय सेवाओं से बिना 12-घंटे की देरी के सीधे ताज़ा लाइव समाचार यहाँ प्राप्त होते हैं।'
                : 'Zero-delay real-time dispatches direct from BBC World, Al Jazeera, and The Guardian — synchronized to your exact local clock without the 12-hour API delay.'}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {refreshNotice && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs rounded-sm font-mono animate-fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>{refreshNotice}</span>
              </span>
            )}

            {/* API Key Drawer Toggle */}
            <button
              onClick={() => setIsKeyDrawerOpen(!isKeyDrawerOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#091533] hover:bg-[#10224d] border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 text-xs rounded-sm font-mono cursor-pointer transition-all shadow-xs"
              title="Configure or update optional GNews.io Paid API Key"
            >
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>{langCode === 'hi' ? 'API सेटिंग' : 'Wire API'}</span>
            </button>

            {/* Audio Broadcast Button */}
            <button
              onClick={handleToggleNarrateAll}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all shadow-md ${
                isNarratingWire && activeNarratingId === 'all'
                  ? 'bg-rose-500 text-[#060c1d] hover:bg-rose-400 font-bold'
                  : 'bg-sky-400 hover:bg-sky-300 text-[#060c1d] hover:scale-102'
              }`}
              title="Listen to latest live dispatches aloud"
            >
              {isNarratingWire && activeNarratingId === 'all' ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>{langCode === 'hi' ? 'आवाज़ रोकें' : 'Stop Audio'}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{langCode === 'hi' ? 'ध्वनि में सुनें' : 'Listen Aloud'}</span>
                </>
              )}
            </button>

            {/* Auto countdown badge */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#091533] border border-emerald-500/40 text-emerald-300 text-xs rounded-sm font-mono shadow-xs"
              title="Automated live wire continuous sweep cycle"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>
                {langCode === 'hi' ? 'अद्यतन:' : 'Sweep:'}{' '}
                <strong className="text-white font-bold tabular-nums">{countdownSeconds}s</strong>
              </span>
            </div>

            {/* Manual Refresh Button */}
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#0a1636] hover:bg-[#12234e] border border-[#1e3364] hover:border-sky-400 text-slate-200 text-xs rounded-sm transition-colors cursor-pointer font-mono"
              title="Fetch fresh real-time updates now"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {isRefreshing
                  ? (langCode === 'hi' ? 'ला रहा है...' : 'Fetching...')
                  : (langCode === 'hi' ? 'ताज़ा करें' : 'Fetch Updates')}
              </span>
            </button>
          </div>
        </div>

        {/* Expandable GNews API Key Configuration Bar */}
        {isKeyDrawerOpen && (
          <div className="mb-6 p-4 bg-[#071026] border border-cyan-500/50 rounded-sm shadow-xl animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">
                  {langCode === 'hi' ? 'GNews.io API Key सेटिंग्स' : 'GNews.io Live API Key Configuration'}
                </h4>
                <span className="text-xs text-slate-400 font-mono">
                  ({gnewsStatus.configured ? 'सक्रिय / Active' : 'Placeholder Ready'})
                </span>
              </div>
              <a
                href="https://gnews.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cyan-400 hover:text-white underline font-mono flex items-center gap-1"
              >
                <span>gnews.io से निशुल्क API Key प्राप्त करें</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-xs text-slate-300 mb-3">
              {langCode === 'hi'
                ? 'अपनी GNews API Key यहाँ पेस्ट करें और "सुरक्षित करें व लाइव लाएँ" दबाएँ। आपकी की आपके ब्राउज़र में सुरक्षित रहेगी और लाइव समाचार स्वतः फेच होंगे।'
                : 'Paste your GNews.io API key here and click "Save & Fetch Live News". Your key will be safely saved in your browser.'}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={inputApiKey}
                onChange={(e) => setInputApiKey(e.target.value)}
                placeholder="उदा. a1b2c3d4e5f6g7h8..."
                className="flex-1 bg-[#040817] border border-[#1d3262] focus:border-cyan-400 rounded px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-hidden"
              />
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded transition-all cursor-pointer shrink-0"
              >
                {langCode === 'hi' ? 'सुरक्षित करें व ताज़ा करें' : 'Save & Fetch Live'}
              </button>
              {inputApiKey && (
                <button
                  onClick={handleClearApiKey}
                  className="px-3 py-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs rounded transition-colors cursor-pointer shrink-0"
                >
                  {langCode === 'hi' ? 'की हटाएं' : 'Clear Key'}
                </button>
              )}
            </div>

            {keySavedStatus && (
              <p className="text-xs text-emerald-400 font-mono mt-2 flex items-center gap-1.5 animate-fade-in">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{keySavedStatus}</span>
              </p>
            )}
          </div>
        )}

        {/* Progress bar */}
        <div className="w-full bg-[#0d1c42] h-1 rounded-full overflow-hidden mb-4" title="Live wire refresh progress">
          <div
            className="bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 h-full transition-all duration-1000 ease-linear"
            style={{ width: `${Math.min(100, Math.max(3, ((30 - countdownSeconds) / 30) * 100))}%` }}
          />
        </div>

        {/* Category Filter Pills & Search */}
        <div className="mb-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {GNEWS_TOPIC_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-cyan-400 text-slate-950 border-cyan-400 shadow-md font-bold'
                      : 'bg-[#08122d] hover:bg-[#0f1f4b] text-slate-300 border-[#1a2d59]'
                  }`}
                >
                  <span>{langCode === 'hi' ? cat.nameHi : cat.nameEn}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Keyword Search */}
          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={langCode === 'hi' ? 'लाइव वायर में खोजें...' : 'Search real-time live stream...'}
              className="w-full pl-8 pr-3 py-1.5 bg-[#070f24] border border-[#1a2d59] focus:border-cyan-400 rounded-sm text-xs text-white placeholder-slate-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Live Flash Ticker Bar */}
        {wireItems.length > 0 && (
          <div className="bg-[#071026] border border-cyan-500/30 rounded-sm p-2.5 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-950/80 text-rose-300 border border-rose-500/50 rounded-xs text-[10px] font-mono uppercase font-bold tracking-wider">
                <Flame className="w-3 h-3 text-rose-400 fill-rose-400" />
                <span>{langCode === 'hi' ? 'ताज़ा फ्लैश' : 'Flash Alert'}</span>
              </span>
              
              <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 px-2 py-0.5 rounded-xs">
                📡 {wireItems[0].source}
              </span>
            </div>

            <button
              onClick={() => handleArticleClick(wireItems[0])}
              className="text-left text-xs sm:text-sm font-serif font-bold text-white hover:text-cyan-300 truncate transition-colors cursor-pointer flex-1"
            >
              {wireItems[0].title}
            </button>

            <span className="text-[11px] font-mono text-slate-400 shrink-0">
              {wireItems[0].relativeTime}
            </span>
          </div>
        )}

        {/* Live Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {wireItems.map((item) => (
            <article
              key={item.id}
              onClick={() => handleArticleClick(item)}
              className="bg-[#060c20] hover:bg-[#091330] border border-[#142347] hover:border-cyan-500/50 rounded-sm p-4 transition-all duration-200 flex flex-col justify-between cursor-pointer group shadow-sm hover:shadow-cyan-950/20"
            >
              <div>
                {/* Header Tag & Time */}
                <div className="flex items-center justify-between gap-2 mb-2.5 text-[11px] font-mono">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs font-bold uppercase tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                    📡 {item.source}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 tabular-nums">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{item.relativeTime}</span>
                  </span>
                </div>

                {/* Article Image if present */}
                {item.image && (
                  <div className="aspect-[16/9] mb-3 overflow-hidden rounded-xs bg-[#0b1633] border border-[#17274e]">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Title */}
                <h3 className="font-serif font-bold text-base sm:text-lg text-white group-hover:text-cyan-300 transition-colors leading-snug mb-2">
                  {item.title}
                </h3>

                {/* Deck / Excerpt */}
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {item.deck || item.leadParagraph}
                </p>
              </div>

              {/* Footer Meta & Actions */}
              <div className="pt-3 border-t border-[#122042] flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => handleArticleClick(item)}
                  className="w-full py-2 px-3 rounded-xs bg-gradient-to-r from-amber-500/20 via-sky-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-sky-500/30 border border-amber-500/40 hover:border-amber-400 text-amber-300 font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-98"
                  title={langCode === 'hi' ? 'पूरी खबर विस्तार से पढ़ें' : 'Read Full Article'}
                >
                  <span>{langCode === 'hi' ? 'पूरी खबर विस्तार से पढ़ें' : 'Read Full Article'}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                </button>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                  <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Verified Wire Dispatch</span>
                  </span>

                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[11px] font-mono text-cyan-400 hover:text-white underline flex items-center gap-1 shrink-0"
                      title="View original wire story"
                    >
                      <span>{langCode === 'hi' ? 'मूल स्रोत' : 'Source'}</span>
                      <ExternalLink className="w-3 h-3 text-cyan-400" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty state if search returned 0 */}
        {wireItems.length === 0 && (
          <div className="text-center py-16 bg-[#060c20] border border-[#142347] rounded p-8">
            <Radio className="w-8 h-8 text-cyan-400 mx-auto mb-3 animate-pulse" />
            <h4 className="text-base font-bold text-white mb-1">
              {langCode === 'hi' ? 'कोई खबर नहीं मिली' : 'No Wire Stories Found'}
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
              {langCode === 'hi'
                ? 'GNews.io से नए समाचार फेच करने के लिए नीचे दिए गए बटन पर क्लिक करें।'
                : 'Click below to fetch the latest real-time dispatches from GNews.io.'}
            </p>
            <button
              onClick={handleManualRefresh}
              className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{langCode === 'hi' ? 'लाइव समाचार लोड करें' : 'Fetch Live GNews'}</span>
            </button>
          </div>
        )}

        {/* Live Sponsored Wire Placement Slot */}
        <LiveAdSlotBanner
          slotKey="sponsored-wire"
          variant="editorial"
          onBookSlot={onBookSlot}
          className="mt-10"
        />
      </div>
    </section>
  );
};
