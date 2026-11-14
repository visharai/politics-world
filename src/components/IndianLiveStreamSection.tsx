import React, { useState } from 'react';
import {
  Tv,
  Radio,
  ExternalLink,
  Maximize2,
  Minimize2,
  RefreshCw,
  Sparkles,
  Share2,
  Check,
  AlertCircle,
  Play,
  ShieldCheck,
  Globe,
  Sliders,
  Zap,
  Clock,
  ArrowUpRight,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Article } from '../data/newsData';

export interface ChannelInfo {
  id: 'dd-india' | 'wion';
  name: string;
  hindiName: string;
  tagline: string;
  hindiTagline: string;
  broadcaster: string;
  region: string;
  country: string;
  flag: string;
  channelId: string;
  server1EmbedUrl: string;
  server2EmbedUrl: string;
  directLiveUrl: string;
  currentProgram: string;
  hindiProgram: string;
  frequency: string;
  description: string;
  hindiDescription: string;
  coveragePoints: string[];
  hindiCoveragePoints: string[];
}

export const INDIAN_NEWS_CHANNELS: ChannelInfo[] = [
  {
    id: 'dd-india',
    name: 'DD India',
    hindiName: 'डीडी इंडिया (DD India)',
    tagline: "India's Public International Broadcaster",
    hindiTagline: 'भारत का आधिकारिक अंतरराष्ट्रीय सार्वजनिक प्रसारण चैनल',
    broadcaster: 'Prasar Bharati (Doordarshan)',
    region: 'Global Broadcast across 190+ Countries',
    country: 'India',
    flag: '🇮🇳',
    // Verified official YouTube channel ID for @DDIndia: UCGDQNvybfDDeGTf4GtigXaw
    channelId: 'UCGDQNvybfDDeGTf4GtigXaw',
    server1EmbedUrl: 'https://www.youtube.com/embed/live_stream?channel=UCGDQNvybfDDeGTf4GtigXaw&autoplay=1&mute=1',
    server2EmbedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCGDQNvybfDDeGTf4GtigXaw&autoplay=1&mute=1',
    directLiveUrl: 'https://www.youtube.com/@DDIndia/live',
    currentProgram: 'World View with DD India · Prime Diplomatic Edition',
    hindiProgram: 'वर्ल्ड व्यू विद डीडी इंडिया · विशेष राजनयिक संस्करण',
    frequency: '24x7 HD International English Broadcast',
    description:
      'DD India is the premier state-owned international English-language news channel operated by Prasar Bharati, delivering authoritative perspectives on South Asian geopolitics, multilateral treaties, and Indian foreign policy.',
    hindiDescription:
      'डीडी इंडिया प्रसार भारती द्वारा संचालित भारत का प्रमुख अंतरराष्ट्रीय अंग्रेजी समाचार चैनल है, जो वैश्विक मंच पर भारत की नीति, विदेश मामलों और अंतरराष्ट्रीय कूटनीति का आधिकारिक प्रसारण करता है।',
    coveragePoints: [
      'Official briefings from the Ministry of External Affairs (MEA)',
      'High-level coverage of G20, BRICS, and UN General Assembly sessions',
      'Exclusive interviews with foreign envoys and cabinet ministers',
      'In-depth economic dispatches from the Reserve Bank of India & trade desks',
    ],
    hindiCoveragePoints: [
      'विदेश मंत्रालय (MEA) की आधिकारिक प्रेस ब्रीफिंग का सीधा प्रसारण',
      'जी20, ब्रिक्स और संयुक्त राष्ट्र महासभा सत्रों का व्यापक कवरेज',
      'विदेशी राजदूतों एवं केंद्रीय मंत्रियों के विशेष साक्षात्कार',
      'भारतीय रिज़र्व बैंक और अंतरराष्ट्रीय वाणिज्य की विस्तृत आर्थिक रिपोर्ट',
    ],
  },
  {
    id: 'wion',
    name: 'WION',
    hindiName: 'वायन (WION)',
    tagline: 'World Is One News · Global Strategic Journalism',
    hindiTagline: 'वर्ल्ड इज़ वन न्यूज़ · वैश्विक रणनीतिक पत्रकारिता',
    broadcaster: 'Essel Group / Zee Media Corporation',
    region: 'South Asia, Middle East, Europe & Americas',
    country: 'India',
    flag: '🇮🇳 🌐',
    // Verified official YouTube channel ID for @WION: UC_gUM8rL-Lrg6O3adPW9K1g
    channelId: 'UC_gUM8rL-Lrg6O3adPW9K1g',
    server1EmbedUrl: 'https://www.youtube.com/embed/live_stream?channel=UC_gUM8rL-Lrg6O3adPW9K1g&autoplay=1&mute=1',
    server2EmbedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC_gUM8rL-Lrg6O3adPW9K1g&autoplay=1&mute=1',
    directLiveUrl: 'https://www.youtube.com/@WION/live',
    currentProgram: 'Gravitas · Strategic Geopolitics & Defense Affairs',
    hindiProgram: 'ग्रैविटास · रणनीतिक भू-राजनीति एवं रक्षा विश्लेषण',
    frequency: '24x7 HD International English Broadcast',
    description:
      'WION (World Is One News) is an Indian multinational news network examining critical geopolitical events, cross-border defense realignments, and international balance-of-power shifts through an independent global lens.',
    hindiDescription:
      'वायन (WION - वर्ल्ड इज़ वन न्यूज़) भारत का अग्रणी बहुराष्ट्रीय अंग्रेजी समाचार नेटवर्क है, जो वैश्विक घटनाओं, अंतरराष्ट्रीय रक्षा गठबंधनों और भू-राजनीतिक परिवर्तनों का बेबाक विश्लेषण प्रस्तुत करता है।',
    coveragePoints: [
      'Flagship "Gravitas" prime-time geopolitical and strategic analysis',
      'Live frontline coverage across Eurasian and Indo-Pacific hotspots',
      'Defense procurement, naval exercises, and aerospace technology audits',
      'Cross-border economic sanctions and international supply chain alerts',
    ],
    hindiCoveragePoints: [
      'प्रमुख प्राइम-टाइम कार्यक्रम "ग्रैविटास" द्वारा वैश्विक कूटनीतिक विश्लेषण',
      'यूरेशियन और इंडो-पैसिफिक संवेदनशील क्षेत्रों से सीधी ग्राउंड रिपोर्ट',
      'रक्षा सौदों, नौसैनिक अभ्यासों और एयरोस्पेस तकनीक की विस्तृत समीक्षा',
      'अंतरराष्ट्रीय आर्थिक प्रतिबंधों एवं वैश्विक आपूर्ति श्रृंखला पर विशेष नज़र',
    ],
  },
];

export interface IndianLiveStreamSectionProps {
  onOpenArticle?: (article: Article) => void;
  urgentArticles?: Article[];
}

export const IndianLiveStreamSection: React.FC<IndianLiveStreamSectionProps> = ({
  onOpenArticle,
  urgentArticles = [],
}) => {
  const { langCode, t } = useLanguage();
  const { isDark } = useTheme();

  const [selectedChannelId, setSelectedChannelId] = useState<'dd-india' | 'wion'>('dd-india');
  const [selectedServer, setSelectedServer] = useState<'server1' | 'server2'>('server1');
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showTroubleshootHelp, setShowTroubleshootHelp] = useState(false);
  const [sideTab, setSideTab] = useState<'dispatches' | 'channel'>('dispatches');

  const activeChannel =
    INDIAN_NEWS_CHANNELS.find((ch) => ch.id === selectedChannelId) || INDIAN_NEWS_CHANNELS[0];

  const currentEmbedUrl =
    selectedServer === 'server1' ? activeChannel.server1EmbedUrl : activeChannel.server2EmbedUrl;

  const handleReload = () => {
    setReloadKey((prev) => prev + 1);
  };

  const handleCopyStreamLink = () => {
    try {
      navigator.clipboard.writeText(activeChannel.directLiveUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <section
      id="front-page-dispatch"
      className={`w-full py-8 sm:py-12 transition-colors duration-200 font-sans relative overflow-hidden ${
        isDark
          ? 'bg-[#040816] border-b-2 border-[#192b57] text-slate-200'
          : 'bg-[#f1f5f9] border-b-2 border-slate-300 text-slate-800'
      }`}
    >
      {/* Anchor for nav links */}
      <div id="live-tv-broadcasts" className="absolute -top-12 left-0" />

      {/* Background ambient accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header with Front-Page Dispatch Masthead */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-8 border-b ${
            isDark ? 'border-[#152348]' : 'border-slate-300'
          }`}
        >
          <div>
            <div className="flex items-center gap-2.5 text-xs font-serif uppercase tracking-[0.2em] font-bold mb-1.5 text-amber-500 dark:text-amber-300">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
              </span>
              <span className="text-amber-400 font-bold">✦ {t.frontPageDispatch}</span>
              <span className="text-slate-500">·</span>
              <span>
                {langCode === 'hi'
                  ? '24x7 लाइव टीवी चैनल एवं ब्रेकिंग न्यूज़'
                  : '24x7 Live TV Channels & Breaking News'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-black tracking-tight flex items-center gap-2.5 text-slate-900 dark:text-white">
              <span>
                {langCode === 'hi'
                  ? 'लाइव टीवी प्रसारण एवं मुख्य प्रेषण (Dispatches)'
                  : 'Live TV Broadcasts & Front-Page Dispatches'}
              </span>
              <span className="text-lg sm:text-xl shrink-0">🇮🇳 🌐</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mt-1 leading-relaxed">
              {langCode === 'hi'
                ? 'डीडी इंडिया (DD India) और वायन (WION) के 24x7 सीधे प्रसारण तथा सभी प्रमुख राजनीतिक व कूटनीतिक प्रेषण (Dispatches) अब फ्रंट पेज पर एक साथ।'
                : 'Direct 24x7 broadcast streams from DD India and WION alongside real-time political and diplomatic dispatches right on the front page.'}
            </p>
          </div>

          {/* Channel Selector Buttons - Horizontally swipeable on mobile */}
          <div
            className={`flex items-center gap-2 p-1.5 rounded-lg border max-w-full overflow-x-auto no-scrollbar self-start md:self-auto ${
              isDark
                ? 'bg-[#09132d] border-[#192b57]'
                : 'bg-white border-slate-300 shadow-sm'
            }`}
          >
            {INDIAN_NEWS_CHANNELS.map((ch) => {
              const isSelected = ch.id === selectedChannelId;
              const channelLabel =
                langCode === 'hi'
                  ? ch.id === 'dd-india'
                    ? 'डीडी इंडिया'
                    : 'वायन'
                  : ch.name;
              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    setSelectedChannelId(ch.id);
                    setReloadKey((k) => k + 1);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 shadow font-black scale-[1.02]'
                      : isDark
                      ? 'text-slate-300 hover:text-white hover:bg-[#112046]'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-rose-600 animate-pulse' : 'bg-slate-400'}`} />
                  <Tv className="w-3.5 h-3.5" />
                  <span>{channelLabel}</span>
                  <span className="text-[11px]">{ch.flag.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Broadcast Arena */}
        <div className={`grid gap-6 ${isTheaterMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'}`}>
          {/* Main Video Embed Player Container */}
          <div className={`${isTheaterMode ? 'col-span-1' : 'lg:col-span-8'} space-y-3`}>
            {/* Player Masthead Strip */}
            <div
              className={`px-4 py-2.5 rounded-t-lg flex flex-wrap items-center justify-between gap-3 text-xs border ${
                isDark
                  ? 'bg-[#09142f] border-[#1a2f5e]'
                  : 'bg-white border-slate-300 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded bg-rose-600 text-white font-mono text-[10px] uppercase font-bold flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  <span>LIVE ON AIR</span>
                </span>
                <span className="font-serif font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  {langCode === 'hi' ? activeChannel.hindiName : activeChannel.name}
                </span>
                <span className="hidden sm:inline text-slate-400">·</span>
                <span className="hidden sm:inline text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-xs font-mono">
                  {langCode === 'hi' ? activeChannel.hindiProgram : activeChannel.currentProgram}
                </span>
              </div>

              {/* Player Quick Controls & Server Switcher */}
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                {/* Server Switcher Pill */}
                <div
                  className={`flex items-center text-[10px] font-mono rounded p-0.5 border ${
                    isDark ? 'bg-[#060c1f] border-[#1b2f5d]' : 'bg-slate-100 border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => {
                      setSelectedServer('server1');
                      setReloadKey((k) => k + 1);
                    }}
                    className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                      selectedServer === 'server1'
                        ? 'bg-sky-600 text-white font-bold'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title="Main Server 1 (HD Stream)"
                  >
                    Server 1
                  </button>
                  <button
                    onClick={() => {
                      setSelectedServer('server2');
                      setReloadKey((k) => k + 1);
                    }}
                    className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                      selectedServer === 'server2'
                        ? 'bg-sky-600 text-white font-bold'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title="Backup Server 2 (No-Cookie Mirror)"
                  >
                    Server 2
                  </button>
                </div>

                <button
                  onClick={handleReload}
                  className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-[#122247] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  title="Reload stream player (अगर वीडियो अटका है तो रिफ्रेश करें)"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsTheaterMode(!isTheaterMode)}
                  className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-[#122247] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  title={isTheaterMode ? 'Exit theater mode' : 'Enter theater mode'}
                >
                  {isTheaterMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <a
                  href={activeChannel.directLiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-[#122247] text-sky-600 dark:text-sky-300 hover:text-sky-700 transition-colors cursor-pointer"
                  title="Open in YouTube"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Responsive 16:9 Video Player */}
            <div className="relative aspect-video w-full bg-black border-x border-b border-[#1a2f5e] rounded-b-lg overflow-hidden shadow-2xl group">
              <iframe
                key={`${activeChannel.id}-${selectedServer}-${reloadKey}`}
                src={currentEmbedUrl}
                title={`${activeChannel.name} Official Live Stream`}
                className="w-full h-full border-0 absolute inset-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                loading="eager"
              />
            </div>

            {/* Fail-Safe Quick Play Bar if Browser Blocks Iframe */}
            <div
              className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                isDark
                  ? 'bg-[#091533] border-[#1d3266] text-slate-300'
                  : 'bg-white border-amber-200 text-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
                  <Play className="w-3.5 h-3.5 fill-rose-500" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>
                      {langCode === 'hi'
                        ? 'वीडियो नहीं चल रहा या "This video is unavailable" आ रहा है?'
                        : 'Video not playing or showing "This video is unavailable"?'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">
                    {langCode === 'hi'
                      ? 'यूट्यूब के सीधा लाइव प्रसारण लिंक पर 1-क्लिक से देखें या सर्वर बदलें।'
                      : 'Click the direct live broadcast button below or switch to backup channel.'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    // Quick toggle between server1 and server2
                    setSelectedServer((s) => (s === 'server1' ? 'server2' : 'server1'));
                    setReloadKey((k) => k + 1);
                  }}
                  className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border ${
                    isDark
                      ? 'bg-[#0f214d] hover:bg-[#17306e] border-[#254285] text-slate-200'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                  }`}
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>
                    {selectedServer === 'server1' ? 'Switch to Server 2' : 'Switch to Server 1'}
                  </span>
                </button>

                <a
                  href={activeChannel.directLiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer hover:scale-105"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>
                    {langCode === 'hi' ? 'यूट्यूब पर सीधा देखें' : 'Watch Directly on YouTube'}
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Stream Status and Syndication Attribution */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono pt-1">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>1080p HD Live Feed</span>
                </span>
                <span>·</span>
                <span>{activeChannel.frequency}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopyStreamLink}
                  className="text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3 h-3 text-emerald-500" /> : <Share2 className="w-3 h-3" />}
                  <span>{copiedLink ? 'Link Copied' : 'Share Stream'}</span>
                </button>
                <span>·</span>
                <a
                  href={activeChannel.directLiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 dark:text-amber-300 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>{langCode === 'hi' ? 'आधिकारिक यूट्यूब' : 'Official YouTube'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Broadcaster Intelligence & Program Dossier / News Dispatches Side-Panel */}
          <div className={`${isTheaterMode ? 'col-span-1' : 'lg:col-span-4'} flex flex-col justify-between space-y-4`}>
            
            {/* Top Switcher Tabs: Live Dispatches vs Channel Info */}
            <div className={`p-1 rounded-lg border flex items-center gap-1 ${
              isDark ? 'bg-[#08132e] border-[#182a55]' : 'bg-slate-200/70 border-slate-300'
            }`}>
              <button
                onClick={() => setSideTab('dispatches')}
                className={`flex-1 py-1.5 px-2 rounded-md text-xs font-serif font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  sideTab === 'dispatches'
                    ? 'bg-amber-400 text-slate-950 shadow font-black'
                    : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-[#102046]'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300" />
                <span>{langCode === 'hi' ? 'ताज़ा प्रेषण (Dispatches)' : 'Live Dispatches'}</span>
                <span className="px-1.5 py-0.2 bg-rose-600 text-white text-[9px] rounded-full animate-pulse font-mono">LIVE</span>
              </button>

              <button
                onClick={() => setSideTab('channel')}
                className={`flex-1 py-1.5 px-2 rounded-md text-xs font-serif font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  sideTab === 'channel'
                    ? 'bg-amber-400 text-slate-950 shadow font-black'
                    : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-[#102046]'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>{langCode === 'hi' ? 'चैनल विवरण' : 'Channel Info'}</span>
              </button>
            </div>

            {/* TAB CONTENT 1: LIVE DISPATCHES & FAST NEWS */}
            {sideTab === 'dispatches' ? (
              <div
                className={`rounded-lg p-4 shadow-lg space-y-3 border ${
                  isDark ? 'bg-[#081229] border-[#162752]' : 'bg-white border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-[#142347]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {langCode === 'hi' ? 'फ्रंट-पेज ब्रेकिंग प्रेषण' : 'Front-Page Breaking News'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Live 24x7 Wire</span>
                </div>

                <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                  {urgentArticles.slice(0, 4).map((art, idx) => (
                    <div
                      key={art.id || idx}
                      onClick={() => onOpenArticle?.(art)}
                      className="group cursor-pointer p-2.5 rounded-md hover:bg-slate-100 dark:hover:bg-[#0e1d40] border border-transparent hover:border-slate-200 dark:hover:border-[#1d3264] transition-all"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                        <span className="text-amber-600 dark:text-amber-300 font-semibold uppercase">{art.category}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{art.readTime || '2 min'}</span>
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-serif font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors leading-snug line-clamp-2">
                        {art.title}
                      </h4>
                      {art.deck && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1 mt-1">
                          {art.deck}
                        </p>
                      )}
                      <div className="flex items-center gap-1 text-[11px] font-medium text-sky-600 dark:text-sky-400 mt-1.5 group-hover:underline">
                        <span>{langCode === 'hi' ? 'पूरा प्रेषण पढ़ें' : 'Read Full Dispatch'}</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const el = document.getElementById('lead-hero-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2 px-3 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-[#0c1836] dark:hover:bg-[#122450] text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-[#192f5e] text-xs font-serif font-bold text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>{langCode === 'hi' ? 'विस्तृत मुख्य खोजी रिपोर्ट देखें ↓' : 'View Full Lead Investigation ↓'}</span>
                </button>
              </div>
            ) : (
              /* TAB CONTENT 2: BROADCASTER DOSSIER & PILLARS */
              <div
                className={`rounded-lg p-5 shadow-lg space-y-4 border ${
                  isDark
                    ? 'bg-[#081229] border-[#162752]'
                    : 'bg-white border-slate-300'
                }`}
              >
                <div
                  className={`flex items-start justify-between gap-3 pb-3 border-b ${
                    isDark ? 'border-[#142347]' : 'border-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-300 font-bold block">
                      {activeChannel.broadcaster}
                    </span>
                    <h3 className="text-xl font-serif font-black text-slate-900 dark:text-white">
                      {langCode === 'hi' ? activeChannel.hindiName : activeChannel.name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                      {langCode === 'hi' ? activeChannel.hindiTagline : activeChannel.tagline}
                    </p>
                  </div>
                  <span
                    className={`text-2xl p-2 rounded-lg border ${
                      isDark ? 'bg-[#0b1836] border-[#1b2f5d]' : 'bg-slate-100 border-slate-200'
                    }`}
                  >
                    {activeChannel.flag}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {langCode === 'hi' ? activeChannel.hindiDescription : activeChannel.description}
                </p>

                {/* Core Coverage Pillars */}
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                    <span>{langCode === 'hi' ? 'विशेष कवरेज एवं प्रमुख बिंदु' : 'Core Coverage Pillars'}</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {(langCode === 'hi'
                      ? activeChannel.hindiCoveragePoints
                      : activeChannel.coveragePoints
                    ).map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-sky-500 dark:text-sky-400 mt-0.5">✦</span>
                        <span className="leading-tight">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Reach & Transmission Badge */}
                <div
                  className={`p-3 rounded-lg text-[11px] font-mono space-y-1 border ${
                    isDark
                      ? 'bg-[#0b1735] border-[#1a2f5e] text-slate-400'
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex justify-between">
                    <span>Coverage Scope:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{activeChannel.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Channel ID:</span>
                    <span className="text-amber-600 dark:text-amber-300 font-mono">{activeChannel.channelId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Origin:</span>
                    <span className="text-slate-800 dark:text-slate-200">New Delhi Bureau, India</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Channel Grid Buttons */}
            <div
              className={`p-4 rounded-lg border space-y-2.5 ${
                isDark ? 'bg-[#071128] border-[#162955]' : 'bg-white border-slate-300 shadow-sm'
              }`}
            >
              <div className="text-xs font-bold uppercase font-serif text-slate-900 dark:text-white flex items-center justify-between">
                <span>{langCode === 'hi' ? 'अन्य चैनल चुनें' : 'Switch Broadcaster'}</span>
                <span className="text-[10px] font-mono text-emerald-500 font-normal">All 4 Channels Ready</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {INDIAN_NEWS_CHANNELS.map((ch) => {
                  const isCurrent = ch.id === selectedChannelId;
                  const channelShort =
                    langCode === 'hi'
                      ? ch.id === 'dd-india'
                        ? 'डीडी इंडिया'
                        : ch.id === 'wion'
                        ? 'वायन'
                        : ch.id === 'dd-news'
                        ? 'डीडी न्यूज़'
                        : 'संसद टीवी'
                      : ch.name;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => {
                        setSelectedChannelId(ch.id);
                        setReloadKey((k) => k + 1);
                      }}
                      className={`px-2.5 py-2 rounded text-left text-xs font-semibold transition-all cursor-pointer border ${
                        isCurrent
                          ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm font-bold'
                          : isDark
                          ? 'bg-[#0d1a3a] hover:bg-[#142654] border-[#1b3164] text-slate-200'
                          : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{channelShort}</span>
                        <span>{ch.flag.split(' ')[0]}</span>
                      </div>
                      <div className="text-[10px] opacity-75 font-mono truncate">
                        {ch.id === 'dd-india' ? 'English Global' : ch.id === 'wion' ? 'Global News' : ch.id === 'dd-news' ? '24x7 HD' : 'Parliament'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
