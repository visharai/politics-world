import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { BreakingTicker } from './components/BreakingTicker';
import { LeadStoryHero } from './components/LeadStoryHero';
import { LiveWireSection } from './components/LiveWireSection';
import { NewsSection } from './components/NewsSection';
import { PolicyTracker } from './components/PolicyTracker';
import { PodcastSection } from './components/PodcastSection';
import { FactCheckSection } from './components/FactCheckSection';
import { GlobalLeaderRanking } from './components/GlobalLeaderRanking';
import { SearchModal } from './components/SearchModal';
import { ThemeToggle } from './components/ThemeToggle';
import { Footer } from './components/Footer';
import { ArticleModal } from './components/ArticleModal';
import { NotificationModal } from './components/NotificationModal';
import { TopLeaderboardAd } from './components/TopLeaderboardAd';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { MonetizationHubModal } from './components/MonetizationHubModal';
import { CricketLiveSection, CricketScoreStrip } from './components/CricketLiveSection';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Article, OpinionColumn } from './data/newsData';
import { AdSlotKey } from './data/adSlotsConfig';
import { DAILY_ROTATING_ITEMS } from './data/dailyRotatingFeed';
import { useLanguage } from './context/LanguageContext';
import { useTheme } from './context/ThemeContext';
import { notificationService } from './services/notificationService';
import { updateSEOForArticle, resetSEOToDefault } from './utils/seoManager';
import { gnewsService } from './services/gnewsService';
import { liveNewsService } from './services/liveNewsService';
import { translationService } from './services/translationService';
import { translateArticle as universalTranslateArticle } from './utils/universalTranslator';
import { trackGA4Event } from './utils/ga4Analytics';

export default function App() {
  const {
    langCode,
    translatedArticles,
    hourlyLeadArticle,
    hourlySecondaryArticles,
    hourlyUrgentRailArticles,
  } = useLanguage();
  const { theme, isDark, toggleTheme } = useTheme();

  const [rawLiveFeedArticles, setRawLiveFeedArticles] = useState<Article[]>([]);
  const [liveGNewsArticles, setLiveGNewsArticles] = useState<Article[]>([]);
  const [translatedHourlyLead, setTranslatedHourlyLead] = useState<Article>(hourlyLeadArticle);
  const [translatedHourlySecondary, setTranslatedHourlySecondary] = useState<Article[]>(hourlySecondaryArticles);
  const [translatedHourlyRail, setTranslatedHourlyRail] = useState<Article[]>(hourlyUrgentRailArticles);

  // Automatically fetch live breaking articles from GNews API for Global Briefing & Hero
  useEffect(() => {
    let isMounted = true;
    const fetchLiveFeed = async () => {
      try {
        const liveFeedItems = await gnewsService.fetchAllLiveFeeds(langCode);
        const liveWireItems = await liveNewsService.getLiveWire('all', '', langCode);
        const converted = liveWireItems.map((w) => liveNewsService.wireItemToArticle(w));

        const pool = [...liveFeedItems, ...converted];
        const seenTitles = new Set<string>();
        const seenIds = new Set<string>();
        const unique: Article[] = [];
        for (const item of pool) {
          const titleKey = item.title.trim().toLowerCase();
          const idKey = item.id;
          if (!seenTitles.has(titleKey) && !seenIds.has(idKey)) {
            seenTitles.add(titleKey);
            seenIds.add(idKey);
            unique.push(item);
          }
        }

        if (isMounted && unique.length > 0) {
          setRawLiveFeedArticles(unique);
        }
      } catch (e) {
        console.warn('GNews feed load note:', e);
      }
    };
    fetchLiveFeed();
    const interval = setInterval(fetchLiveFeed, 3 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [langCode]);

  // Translate live GNews articles into selected language across all 16 languages (<5s transition)
  useEffect(() => {
    if (rawLiveFeedArticles.length === 0) return;

    if (langCode === 'en') {
      setLiveGNewsArticles(rawLiveFeedArticles);
      return;
    }

    // Step 1: Instant local dictionary translation (0 ms, immediate UI update)
    const instantLocal = rawLiveFeedArticles.map((art) => universalTranslateArticle(art, langCode));
    setLiveGNewsArticles(instantLocal);

    // Step 2: High-accuracy server translation for all 16 languages (<1.5s)
    let isCancelled = false;
    translationService.translateArticles(rawLiveFeedArticles.slice(0, 10), langCode).then((fullyTranslated) => {
      if (!isCancelled && fullyTranslated.length > 0) {
        setLiveGNewsArticles(fullyTranslated);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [rawLiveFeedArticles, langCode]);

  // Translate fallback hourly lead and secondary stories for all 16 languages
  useEffect(() => {
    setTranslatedHourlyLead(hourlyLeadArticle);
    setTranslatedHourlySecondary(hourlySecondaryArticles);
    setTranslatedHourlyRail(hourlyUrgentRailArticles);

    if (langCode === 'en') return;

    let isCancelled = false;
    Promise.all([
      translationService.translateArticle(hourlyLeadArticle, langCode),
      translationService.translateArticles(hourlySecondaryArticles, langCode),
      translationService.translateArticles(hourlyUrgentRailArticles, langCode),
    ]).then(([tLead, tSec, tRail]) => {
      if (!isCancelled) {
        if (tLead) setTranslatedHourlyLead(tLead);
        if (tSec) setTranslatedHourlySecondary(tSec);
        if (tRail) setTranslatedHourlyRail(tRail);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [langCode, hourlyLeadArticle, hourlySecondaryArticles, hourlyUrgentRailArticles]);

  const articles = useMemo(() => {
    const source = liveGNewsArticles.length > 0 ? liveGNewsArticles : translatedArticles.slice(0, 8);
    const seenIds = new Set<string>();
    const seenTitles = new Set<string>();
    const result: Article[] = [];
    for (const art of source) {
      const titleKey = art.title.trim().toLowerCase();
      if (!seenIds.has(art.id) && !seenTitles.has(titleKey)) {
        seenIds.add(art.id);
        seenTitles.add(titleKey);
        result.push(art);
      }
    }
    return result;
  }, [liveGNewsArticles, translatedArticles]);

  const leadArticle = liveGNewsArticles[0] || translatedHourlyLead || articles[0];

  const [activeArticleModal, setActiveArticleModal] = useState<Article | null>(null);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const params = new URLSearchParams(window.location.search);
      return hash === '#privacy' || hash === '#privacy-policy' || params.get('page') === 'privacy';
    }
    return false;
  });
  const [isMonetizationHubOpen, setIsMonetizationHubOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const params = new URLSearchParams(window.location.search);
      return hash === '#monetization' || hash === '#earn' || hash === '#advertise' || params.get('page') === 'monetization';
    }
    return false;
  });
  const [monetizationInitialTab, setMonetizationInitialTab] = useState<
    'revenue' | 'wallet' | 'invoice' | 'ratecard' | 'calculator' | 'guide' | 'reports'
  >('ratecard');
  const [checkoutSlotRequest, setCheckoutSlotRequest] = useState<AdSlotKey | null>(null);

  const handleOpenMonetizationHub = (
    tab: 'revenue' | 'wallet' | 'invoice' | 'ratecard' | 'calculator' | 'guide' | 'reports' = 'ratecard',
    slotKey?: AdSlotKey
  ) => {
    setMonetizationInitialTab(tab);
    if (slotKey) {
      setCheckoutSlotRequest(slotKey);
    }
    setIsMonetizationHubOpen(true);
  };

  const handleScrollToLiveSlot = (domTargetId: string) => {
    setActiveArticleModal(null);
    setTimeout(() => {
      const el = document.getElementById(domTargetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 150);
  };

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('latest-news');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Dynamic Open Graph & Meta Tags synchronization when reader views or closes an article
  useEffect(() => {
    if (activeArticleModal) {
      updateSEOForArticle(activeArticleModal);
      trackGA4Event('article_view', {
        article_id: activeArticleModal.id,
        category: activeArticleModal.category,
        edition_lang: langCode,
      });
    } else {
      resetSEOToDefault(leadArticle);
    }
  }, [activeArticleModal, leadArticle, langCode]);

  // Deep-linking: auto-open article reader when visitor clicks a shared social or direct link
  // Supports both query parameters (?article=... or ?id=...) and URL hashes (#art-...)
  useEffect(() => {
    const handleCheckSharedArticle = () => {
      if (typeof window === 'undefined') return;

      const params = new URLSearchParams(window.location.search);
      const articleQuery = params.get('article') || params.get('id');
      const hash = window.location.hash.replace(/^#/, '');

      if (hash === 'privacy' || hash === 'privacy-policy' || params.get('page') === 'privacy') {
        setIsPrivacyPolicyOpen(true);
        return;
      }

      const targetId = articleQuery || hash;

      if (targetId) {
        const found =
          articles.find((a) => a.id === targetId) ||
          DAILY_ROTATING_ITEMS.find((a) => a.id === targetId);

        if (found) {
          setActiveArticleModal(found);
        }
      }
    };

    handleCheckSharedArticle();
    window.addEventListener('hashchange', handleCheckSharedArticle);
    window.addEventListener('popstate', handleCheckSharedArticle);
    return () => {
      window.removeEventListener('hashchange', handleCheckSharedArticle);
      window.removeEventListener('popstate', handleCheckSharedArticle);
    };
  }, [articles]);

  const secondaryArticles = liveGNewsArticles.length > 2
    ? liveGNewsArticles.slice(1, 3)
    : translatedHourlySecondary.length > 0
    ? translatedHourlySecondary
    : articles.slice(1, 3);
  const urgentRailArticles = liveGNewsArticles.length > 5
    ? liveGNewsArticles.slice(3, 6)
    : translatedHourlyRail.length > 0
    ? translatedHourlyRail
    : articles.slice(3, 6);

  const handleNavigate = (sectionId: string) => {
    if (isPrivacyPolicyOpen) {
      setIsPrivacyPolicyOpen(false);
      if (window.location.hash.includes('privacy')) {
        window.history.pushState(null, '', window.location.pathname);
      }
    }
    setActiveSection(sectionId);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleOpenSearch = () => {
    setIsSearchModalOpen(true);
  };

  const handleOpenPrivacyPolicy = () => {
    setIsPrivacyPolicyOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLegalArticle7 = () => {
    setIsMonetizationHubOpen(false);
    setCheckoutSlotRequest(null);
    setIsPrivacyPolicyOpen(true);
    setTimeout(() => {
      const el = document.getElementById('direct-branding-invoicing');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 150);
  };

  const handleClosePrivacyPolicy = () => {
    setIsPrivacyPolicyOpen(false);
    if (window.location.hash.includes('privacy')) {
      window.history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBreaking = (title: string, category: string, time: string) => {
    // Generate a temporary reading view for breaking news
    const breakingArt: Article = {
      id: 'breaking-' + Date.now(),
      title,
      deck: `Urgent bulletin received at ${time} by the Political Desk. This is a developing situation with ongoing diplomatic and legislative updates.`,
      category: 'White House & Congress',
      author: 'Politics World Fast Wire Desk',
      authorRole: 'Live Bulletin Unit',
      date: `${new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date())} · ${time}`,
      readTime: '2 min read',
      bodyParagraphs: [
        `Reporting teams from our Capitol and global news desks are actively gathering statements and verifying agency communiqués regarding: "${title}".`,
        'Congressional leaders and relevant diplomatic missions have been contacted for official clarification. A full analytical dispatch will follow in the next edition.',
      ],
      tags: ['Breaking', category, 'Urgent Dispatch'],
    };
    setActiveArticleModal(breakingArt);
  };

  const handleSelectColumn = (col: OpinionColumn) => {
    const colArticle: Article = {
      id: col.id,
      title: col.headline,
      deck: col.quote,
      category: 'Geopolitics',
      author: col.author,
      authorRole: col.role,
      date: col.date,
      readTime: col.readTime,
      leadParagraph: col.quote,
      bodyParagraphs: [
        'In the corridors of power, diplomatic declarations often obscure the tectonic economic calculations unfolding beneath the surface.',
        'When assessing statecraft in the modern era, analysts must look not merely to official communiqués, but to the binding legal frameworks and capital expenditures agreed upon behind closed doors.',
        'The geopolitical realignment of the mid-2020s has fundamentally proved that sovereign resilience and technological sovereignty now supersede legacy diplomatic treaties.',
      ],
      tags: ['Opinion', col.columnTitle, 'Statecraft'],
    };
    setActiveArticleModal(colArticle);
  };

  if (isPrivacyPolicyOpen) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-[#060c1d] text-slate-100' : 'bg-[#f8fafc] text-slate-900'} flex flex-col font-sans selection:bg-sky-500/30 selection:text-white`}>
        <Header
          onOpenSearch={handleOpenSearch}
          onSubscribeClick={() => {
            handleClosePrivacyPolicy();
            handleNavigate('subscribe-section');
          }}
          onOpenMonetizationHub={() => handleOpenMonetizationHub('ratecard')}
          onBookSlot={(slotKey) => handleOpenMonetizationHub('ratecard', slotKey)}
          activeSection={activeSection}
          onNavigate={(secId) => {
            handleClosePrivacyPolicy();
            handleNavigate(secId);
          }}
        />

        {/* Complete Professional Privacy Policy View */}
        <PrivacyPolicy onBack={handleClosePrivacyPolicy} />

        <Footer
          onNavigate={(secId) => {
            handleClosePrivacyPolicy();
            handleNavigate(secId);
          }}
          onSubscribeClick={() => {
            handleClosePrivacyPolicy();
            handleNavigate('subscribe-section');
          }}
          onOpenPrivacyPolicy={handleOpenPrivacyPolicy}
          onOpenMonetizationHub={(tab) => handleOpenMonetizationHub(tab || 'ratecard')}
        />

        <MonetizationHubModal
          isOpen={isMonetizationHubOpen}
          onClose={() => {
            setIsMonetizationHubOpen(false);
            setCheckoutSlotRequest(null);
          }}
          initialTab={monetizationInitialTab}
          checkoutSlotRequest={checkoutSlotRequest}
          onConsumeCheckoutRequest={() => setCheckoutSlotRequest(null)}
          onNavigateToSlot={(domTargetId) => {
            handleClosePrivacyPolicy();
            handleScrollToLiveSlot(domTargetId);
          }}
          onOpenLegalArticle7={handleOpenLegalArticle7}
        />

        <ThemeToggle />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#060c1d] text-slate-100' : 'bg-[#f8fafc] text-slate-900'} flex flex-col font-sans selection:bg-sky-500/30 selection:text-white`}>
      {/* 3-Zone Header + Utility Strip */}
      <Header
        onOpenSearch={handleOpenSearch}
        onSubscribeClick={() => handleNavigate('subscribe-section')}
        onOpenMonetizationHub={() => handleOpenMonetizationHub('ratecard')}
        onBookSlot={(slotKey) => handleOpenMonetizationHub('ratecard', slotKey)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Dynamic Live Header Leaderboard Billboard Advertisement */}
      <TopLeaderboardAd
        onOpenMonetizationHub={() => handleOpenMonetizationHub('ratecard', 'header')}
        onBookSlot={(slotKey) => handleOpenMonetizationHub('ratecard', slotKey)}
      />

      {/* Breaking Wire Dispatch Ticker */}
      <BreakingTicker onSelectBreaking={handleSelectBreaking} />

      {/* Auto-Updating Live Cricket Score Strip */}
      <CricketScoreStrip onJumpToCricket={() => handleNavigate('cricket-live')} />

      {/* Main Landing Page Content */}
      <main className="flex-1">
        {/* Front-Page 3-Tier Salience Lead Hero & In-Depth Investigation */}
        <LeadStoryHero
          leadArticle={leadArticle}
          secondaryArticles={secondaryArticles}
          urgentRailArticles={urgentRailArticles}
          onOpenArticle={(art) => setActiveArticleModal(art)}
        />

        {/* Live Automated News Wire: Powered by Real-Time 0-Delay Sources */}
        <LiveWireSection
          onOpenArticle={(art) => setActiveArticleModal(art)}
          onBookSlot={(slotKey) => handleOpenMonetizationHub('ratecard', slotKey)}
        />

        {/* Real-Time Auto-Updating Live Cricket Scoreboard */}
        <CricketLiveSection />

        {/* Latest Political News with Interactive Filter Buttons and Keyword Search */}
        <NewsSection
          articles={articles}
          onOpenArticle={(art) => setActiveArticleModal(art)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenMonetizationHub={() => handleOpenMonetizationHub('ratecard', 'sponsored-article')}
          onBookSlot={(slotKey) => handleOpenMonetizationHub('ratecard', slotKey)}
          leadArticleId={leadArticle.id}
        />

        {/* Podcast & Audio Briefings (Real-Time News Audio Broadcast) */}
        <PodcastSection
          onBookSlot={(slotKey) => handleOpenMonetizationHub('ratecard', slotKey)}
        />

        {/* Interactive Capitol & Parliamentary Bill Radar */}
        <PolicyTracker />

        {/* Fact-Check & Congressional Statement Audits */}
        <FactCheckSection />

        {/* Global Leader Ranking & Approval Index (International Mandate Index) */}
        <GlobalLeaderRanking />
      </main>

      {/* Editorial Masthead Footer */}
      <Footer
        onNavigate={handleNavigate}
        onSubscribeClick={() => handleNavigate('subscribe-section')}
        onOpenPrivacyPolicy={handleOpenPrivacyPolicy}
        onOpenMonetizationHub={(tab) => handleOpenMonetizationHub(tab || 'ratecard')}
      />

      {/* In-Depth Article Reader Modal with In-Article Ad Placement */}
      <ArticleModal
        article={activeArticleModal}
        onClose={() => setActiveArticleModal(null)}
        onOpenMonetizationHub={() => handleOpenMonetizationHub('ratecard', 'in-article')}
      />

      {/* Global Quick Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectArticle={(art) => setActiveArticleModal(art)}
      />

      {/* Web Push Notification Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />

      {/* Monetization & Earning Hub Modal */}
      <MonetizationHubModal
        isOpen={isMonetizationHubOpen}
        onClose={() => {
          setIsMonetizationHubOpen(false);
          setCheckoutSlotRequest(null);
        }}
        initialTab={monetizationInitialTab}
        checkoutSlotRequest={checkoutSlotRequest}
        onConsumeCheckoutRequest={() => setCheckoutSlotRequest(null)}
        onNavigateToSlot={handleScrollToLiveSlot}
        onOpenLegalArticle7={handleOpenLegalArticle7}
      />

      {/* Offline Connectivity Indicator */}
      <OfflineIndicator />

      {/* Floating Dark/Bright Theme Toggle Button */}
      <ThemeToggle />
    </div>
  );
}
