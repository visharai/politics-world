import React, { useState, useMemo } from 'react';
import { Article } from '../data/newsData';
import { useLanguage } from '../context/LanguageContext';
import { ShareModal } from './ShareModal';
import {
  Clock,
  Search,
  X,
  ChevronRight,
  Heart,
  MessageSquare,
  Share2,
  Send,
  Trash2,
  Check,
  Smile,
  SlidersHorizontal,
} from 'lucide-react';

interface NewsSectionProps {
  articles: Article[];
  onOpenArticle: (article: Article) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenMonetizationHub?: () => void;
  leadArticleId?: string;
}

interface CommentItem {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

const QUICK_EMOJIS = ['🏛️', '🇺🇸', '⚖️', '🗳️', '📈', '💬', '👏', '💡', '🔥', '👍'];

// Initial seeds for comments
const INITIAL_COMMENTS: Record<string, CommentItem[]> = {
  'art-lead-1': [
    {
      id: 'c-1',
      author: 'Diplomatic Analyst',
      text: 'The 12% subsidy cap represents a realistic middle ground for allied industrial strategy. ⚖️',
      timestamp: '25m ago',
    },
  ],
  'art-secondary-1': [
    {
      id: 'c-2',
      author: 'Pacific Maritime Watch',
      text: 'Long-range joint surveillance patrols send an unmistakable deterrent signal. 🌊',
      timestamp: '1h ago',
    },
  ],
  'art-secondary-2': [
    {
      id: 'c-3',
      author: 'Trade Economist',
      text: 'Automated green lanes will finally ease Pacific container vessel dwell times. 📈',
      timestamp: '2h ago',
    },
  ],
  'art-standard-1': [
    {
      id: 'c-4',
      author: 'Capitol Aide',
      text: 'The stopgap continuing resolution avoids a shutdown, but December will be a test of cloture. 🏛️',
      timestamp: '3h ago',
    },
  ],
  'art-standard-2': [
    {
      id: 'c-5',
      author: 'Polling Desk Member',
      text: 'Suburban ticket-splitting on fiscal questions is redefining conventional battleground maps. 🗳️',
      timestamp: '4h ago',
    },
  ],
  'art-standard-3': [
    {
      id: 'c-6',
      author: 'Silicon Corridor Fellow',
      text: 'Frontier AI compute cluster screenings align with transatlantic dual-use standards. 💡',
      timestamp: '5h ago',
    },
  ],
};

// Initial seeds for likes
const INITIAL_LIKES: Record<string, number> = {
  'art-lead-1': 142,
  'art-secondary-1': 89,
  'art-secondary-2': 64,
  'art-standard-1': 51,
  'art-standard-2': 78,
  'art-standard-3': 43,
  'art-standard-4': 38,
  'art-standard-5': 62,
};

// Individual Article Card Component with Interactive Toolbar
interface ArticleFeedCardProps {
  article: Article;
  onOpenArticle: (article: Article) => void;
  onShareArticle: (article: Article) => void;
}

const ArticleFeedCard: React.FC<ArticleFeedCardProps> = ({
  article,
  onOpenArticle,
  onShareArticle,
}) => {
  const { t, langCode } = useLanguage();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(() => INITIAL_LIKES[article.id] || 25);
  const [comments, setComments] = useState<CommentItem[]>(() => INITIAL_COMMENTS[article.id] || []);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikeCount((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShareArticle(article);
  };

  const handleToggleComments = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCommentsOpen(!isCommentsOpen);
  };

  const handleAddEmoji = (emoji: string) => {
    setCommentText((prev) => prev + emoji);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!commentText.trim()) return;

    const newComment: CommentItem = {
      id: 'c-' + Date.now(),
      author: commentAuthor.trim() || 'Reader Member',
      text: commentText.trim(),
      timestamp: 'Just now',
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentText('');
  };

  const handleDeleteComment = (commentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  return (
    <article
      className="group flex flex-col justify-between bg-[#0a132c] border border-[#182952] hover:border-[#274082] rounded-sm transition-all duration-200 shadow-md font-sans overflow-hidden"
    >
      {/* Editorial Thumbnail Image */}
      {article.image && (
        <div
          onClick={() => onOpenArticle(article)}
          className="relative aspect-[16/10] w-full overflow-hidden bg-[#070e24] cursor-pointer"
        >
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a132c] via-transparent to-transparent opacity-60" />
        </div>
      )}

      {/* Clickable Header & Article Body */}
      <div
        onClick={() => onOpenArticle(article)}
        className="p-5 sm:p-6 cursor-pointer flex-1 flex flex-col justify-between"
      >
        <div>
          {/* Category & Read Time (Clean unboxed text) */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
            <span className="font-semibold uppercase tracking-wider text-sky-400">
              {article.category}
            </span>
            <span className="flex items-center gap-1 font-mono text-[11px] tabular-nums text-slate-400">
              <Clock className="w-3 h-3 text-slate-500" />
              {article.readTime}
            </span>
          </div>

          {/* Headline */}
          <h3 className="text-lg font-serif font-bold text-white group-hover:text-sky-300 transition-colors leading-snug mb-3 [text-wrap:balance]">
            {article.title}
          </h3>

          {/* Deck */}
          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed mb-4 line-clamp-3">
            {article.deck}
          </p>
        </div>

        {/* Unboxed Metadata: Byline, Agency Channel & Date */}
        <div className="pt-3 border-t border-[#142347] flex items-center justify-between text-xs text-slate-400">
          <div>
            {article.sourceAgency && (
              <span className="text-amber-300 font-semibold block text-[11px] mb-0.5 tracking-wide">
                📡 {article.sourceAgency} {article.sourceCountry ? `(${article.sourceCountry})` : ''}
              </span>
            )}
            <span className="text-slate-300 font-medium block truncate max-w-[200px]">
              {article.author}
            </span>
            <span className="text-[11px] text-slate-500">{article.date}</span>
          </div>
          <span className="text-sky-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-medium text-[11px]">
            <span>{langCode === 'hi' ? 'विस्तार से पढ़ें' : 'Full Story'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Dedicated Read Full Article Button on News Card */}
        <div className="mt-3.5 pt-3 border-t border-[#132247]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenArticle(article);
            }}
            className="w-full py-2 px-3 rounded-xs bg-gradient-to-r from-amber-500/20 via-sky-500/15 to-amber-500/20 hover:from-amber-500 hover:to-amber-600 text-amber-300 hover:text-slate-950 border border-amber-500/40 hover:border-amber-400 font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98 group/btn"
          >
            <span>{langCode === 'hi' ? 'पूरी खबर विस्तार से पढ़ें' : 'Read Full Article'}</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Interactive Social Toolbar on Every Feed Item */}
      <div className="bg-[#081128] border-t border-[#15244b] px-5 py-2.5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          {/* Like Button */}
          <button
            onClick={handleToggleLike}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              isLiked ? 'text-rose-400 font-semibold' : 'text-slate-400 hover:text-rose-400'
            }`}
            title={isLiked ? t.liked : t.like}
            aria-label="Like button"
          >
            <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
            <span className="font-mono tabular-nums text-[11px]">{likeCount}</span>
          </button>

          {/* Comment Button (Expands Comment Box) */}
          <button
            onClick={handleToggleComments}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              isCommentsOpen ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-sky-300'
            }`}
            title={t.comment}
            aria-label="Toggle comments"
          >
            <MessageSquare className={`w-4 h-4 ${isCommentsOpen ? 'text-sky-400' : ''}`} />
            <span className="font-mono tabular-nums text-[11px]">{comments.length}</span>
          </button>

          {/* Share Button (opens Social & Clipboard Share Modal) */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-slate-400 hover:text-sky-300 transition-colors cursor-pointer group"
            title={t.share}
            aria-label="Share story"
          >
            <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-sans hidden sm:inline text-slate-400 group-hover:text-sky-300">
              {t.share}
            </span>
          </button>
        </div>

      </div>

      {/* Expandable Comment Box with Emoji Picker & Delete Button */}
      {isCommentsOpen && (
        <div
          className="bg-[#060d21] border-t border-[#15244b] p-4 text-xs space-y-3 animate-in fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between text-slate-300 font-semibold border-b border-[#121f3f] pb-2">
            <span>{t.perspectives} ({comments.length})</span>
            <button
              onClick={() => setIsCommentsOpen(false)}
              className="text-slate-500 hover:text-white p-0.5 cursor-pointer"
              title="Collapse comments"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Existing Comments List with Delete Button */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {comments.length === 0 ? (
              <p className="text-slate-500 italic py-2 text-center">
                No comments yet. Share the first perspective below!
              </p>
            ) : (
              comments.map((c) => (
                <div
                  key={c.id}
                  className="p-2.5 rounded-xs bg-[#091430] border border-[#142347] flex items-start justify-between gap-2 group/comment"
                >
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                      <strong className="text-slate-200 font-sans font-semibold">{c.author}</strong>
                      <span>·</span>
                      <span>{c.timestamp}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-xs break-words">{c.text}</p>
                  </div>

                  {/* Working Delete Button */}
                  <button
                    onClick={(e) => handleDeleteComment(c.id, e)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer opacity-70 group-hover/comment:opacity-100"
                    title={t.delete}
                    aria-label="Delete comment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Quick Emoji Bar */}
          <div className="space-y-1 pt-1 border-t border-[#121f3f]">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider">
                <Smile className="w-3 h-3 text-sky-400" />
                {t.quickEmojis}
              </span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleAddEmoji(emoji)}
                  className="px-1.5 py-0.5 bg-[#0a1636] border border-[#172b59] hover:border-sky-400 hover:bg-[#102454] rounded-xs text-sm transition-transform active:scale-90 cursor-pointer select-none"
                  title={`Add ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Instant Comment Submission Form */}
          <form onSubmit={handlePostComment} className="space-y-2 pt-1">
            <input
              type="text"
              placeholder="Your Name (e.g. Rachel M., DC Bureau)"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              className="w-full bg-[#08122c] border border-[#1a2c5a] focus:border-sky-400 rounded-xs px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            <div className="flex gap-1.5">
              <input
                type="text"
                required
                placeholder={t.writeComment}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-[#08122c] border border-[#1a2c5a] focus:border-sky-400 rounded-xs px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-3 py-1.5 bg-sky-400 hover:bg-sky-300 disabled:opacity-40 disabled:cursor-not-allowed text-[#060c1d] font-semibold uppercase tracking-wider text-[11px] rounded-xs transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>{t.post}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </article>
  );
};

// Category tabs mapping with multi-language support
const CATEGORY_TABS = [
  { id: 'all', getLabel: (t: any) => t.allDispatches, match: () => true },
  {
    id: 'india',
    getLabel: (t: any) => t.indiaSouthAsia || (t.editionDate?.includes('IST') ? 'भारत एवं दक्षिण एशिया' : 'India & South Asia'),
    match: (cat: string, art?: Article) =>
      cat.includes('India') ||
      cat.includes('भारत') ||
      cat.includes('Inde') ||
      cat.includes('Indien') ||
      cat.includes('印度') ||
      cat.includes('الهند') ||
      cat.includes('インド') ||
      cat.includes('Индия') ||
      cat.includes('Índia') ||
      cat.includes('인도') ||
      cat.includes('Hindistan') ||
      (art?.tags && art.tags.some((tg) => tg.toLowerCase().includes('india') || tg.includes('भारत') || tg.toLowerCase().includes('delhi'))) ||
      (art?.id && art.id.includes('india'))
  },
  { id: 'whiteHouse', getLabel: (t: any) => t.whiteHouseCongress, match: (cat: string) => cat.includes('House') || cat.includes('Congress') || cat.includes('Blanca') || cat.includes('Maison') || cat.includes('Weißes') || cat.includes('संसद') || cat.includes('白宫') || cat.includes('البيت') || cat.includes('ホワイト') || cat.includes('Белый') || cat.includes('Branca') || cat.includes('Bianca') || cat.includes('백악관') || cat.includes('Beyaz') || cat.includes('Witte') || cat.includes('Putih') || cat.includes('Biały') },
  { id: 'summits', getLabel: (t: any) => t.globalSummits, match: (cat: string) => cat.includes('Summit') || cat.includes('Cumbre') || cat.includes('Sommet') || cat.includes('Gipfel') || cat.includes('शिखर') || cat.includes('峰会') || cat.includes('القمम') || cat.includes('サミット') || cat.includes('саммит') || cat.includes('Cúpula') || cat.includes('Vertici') || cat.includes('정상회의') || cat.includes('Zirve') || cat.includes('Wereldtop') || cat.includes('KTT') || cat.includes('Szczyt') },
  { id: 'geopolitics', getLabel: (t: any) => t.geopolitics, match: (cat: string) => cat.includes('Geopolitic') || cat.includes('Géopolitique') || cat.includes('Geopolitik') || cat.includes('भू-राजनीति') || cat.includes('地缘') || cat.includes('الجيوسياسة') || cat.includes('地政') || cat.includes('Геополитик') || cat.includes('Geopolítica') || cat.includes('지정학') || cat.includes('Jeopolitik') },
  { id: 'economy', getLabel: (t: any) => t.economyTrade, match: (cat: string) => cat.includes('Economy') || cat.includes('Trade') || cat.includes('Economía') || cat.includes('Comercio') || cat.includes('Économie') || cat.includes('Wirtschaft') || cat.includes('Handel') || cat.includes('व्यापार') || cat.includes('经济') || cat.includes('贸易') || cat.includes('الاقتصاد') || cat.includes('経済') || cat.includes('Экономик') || cat.includes('Comércio') || cat.includes('Commercio') || cat.includes('통상') || cat.includes('Ticaret') || cat.includes('Perdagangan') || cat.includes('Handel') },
];

export const NewsSection: React.FC<NewsSectionProps> = ({
  articles,
  onOpenArticle,
  searchQuery,
  setSearchQuery,
  onOpenMonetizationHub,
  leadArticleId,
}) => {
  const { t, currentHourSlot, hourlyLeadArticle, langCode } = useLanguage();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'readTime'>('latest');
  const [shareArticle, setShareArticle] = useState<Article | null>(null);

  const filteredArticles = useMemo(() => {
    const currentTab = CATEGORY_TABS.find((tab) => tab.id === selectedCategoryId) || CATEGORY_TABS[0];
    const seenIds = new Set<string>();
    const list = articles
      .filter((art) => art.id !== leadArticleId && art.id !== hourlyLeadArticle?.id) // Prevent repeating the hero lead story
      .filter((art) => {
        const matchesCategory = currentTab.match(art.category, art);
        const matchesSearch =
          searchQuery.trim() === '' ||
          art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          art.deck.toLowerCase().includes(searchQuery.toLowerCase()) ||
          art.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .filter((art) => {
        if (seenIds.has(art.id)) {
          return false;
        }
        seenIds.add(art.id);
        return true;
      });

    if (sortBy === 'readTime') {
      return [...list].sort((a, b) => {
        const minsA = parseInt(a.readTime, 10) || 5;
        const minsB = parseInt(b.readTime, 10) || 5;
        return minsA - minsB;
      });
    }

    return [...list].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }, [articles, selectedCategoryId, searchQuery, hourlyLeadArticle, leadArticleId, sortBy]);

  const paddedHour = String(currentHourSlot % 24).padStart(2, '0');

  return (
    <section id="latest-news" className="w-full bg-[#070e22] border-b border-[#172750] py-12 sm:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-8 border-b border-[#16274e]">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-amber-300 mb-2 font-serif">
              <span className="text-amber-400">✦</span>
              <span>{t.politicalDesk}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-950/70 text-emerald-300 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{langCode === 'hi' ? 'लाइव वैश्विक ब्रीफिंग' : 'Live Global Briefing'}</span>
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 font-mono font-normal text-[11px] tracking-normal font-sans tabular-nums">
                {langCode === 'hi' ? `24-घंटे लाइव · ${paddedHour}:00` : `24H Live Edition · ${paddedHour}:00`}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-white tracking-tight">
              {t.latestNewsTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md font-sans">
            {t.latestNewsSubtitle}
          </p>
        </div>

        {/* Filter Controls Bar & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          {/* Category Tabs (Segmented Buttons) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {CATEGORY_TABS.map((tab) => {
              const isActive = selectedCategoryId === tab.id;
              const label = tab.getLabel(t);
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategoryId(tab.id)}
                  className={`px-3.5 py-1.5 text-xs font-serif font-bold uppercase tracking-wider rounded-xs whitespace-nowrap shrink-0 transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm font-black'
                      : 'bg-[#08122a] text-slate-300 border-[#18264d] hover:text-white hover:border-amber-400/60'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Search Box & Sort Toggle */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 w-full lg:w-auto shrink-0">
            <div className="relative flex-1 min-w-0 sm:min-w-[240px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={t.filterPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0a1532] border border-[#1b2b57] focus:border-sky-400 rounded-sm pl-8 pr-7 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 bg-[#0a1532] border border-[#1b2b57] p-1 rounded-sm text-xs shrink-0">
              <span className="text-[11px] text-slate-400 px-1.5">Sort:</span>
              <button
                onClick={() => setSortBy(sortBy === 'latest' ? 'readTime' : 'latest')}
                className="px-2 py-0.5 text-[11px] text-sky-400 font-mono hover:text-white transition-colors cursor-pointer"
              >
                {sortBy === 'latest' ? t.sortLatest : t.sortReading}
              </button>
            </div>
          </div>
        </div>

        {/* Articles Grid with Interactive Toolbars */}
        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center border border-[#1a2d58] rounded-sm bg-[#0a132c]">
            <p className="text-base font-serif text-slate-200 mb-2">{t.noSearchResults}</p>
            <p className="text-xs text-slate-400 mb-4">
              {t.filterPlaceholder}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryId('all');
              }}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#162752] hover:bg-[#1d3570] rounded-sm transition-colors cursor-pointer"
            >
              {t.clearAll}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredArticles.map((article) => (
                <ArticleFeedCard
                  key={article.id}
                  article={article}
                  onOpenArticle={onOpenArticle}
                  onShareArticle={setShareArticle}
                />
              ))}
            </div>

            {/* Separate Partner Spotlight Banner (strictly below news grid, never interrupting news items) */}
            <div className="mt-10 rounded-xs border border-amber-500/40 bg-gradient-to-br from-[#0c1630] via-[#091226] to-[#040817] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md relative overflow-hidden group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold">
                    ✦ SPONSORED BRIEF
                  </span>
                  <span className="text-slate-500">AdChoices · Partner Dispatch</span>
                </div>
                <h4 className="font-serif font-bold text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {langCode === 'hi'
                    ? 'ग्लोबल एनर्जी व सेमीकंडक्टर सप्लाई चेन कॉनक्लेव 2026: डिप्लोमैटिक ब्रीफिंग'
                    : 'Indo-Pacific Critical Supply Chains & Energy Security Conclave 2026'}
                </h4>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {langCode === 'hi'
                    ? '1,200 नीति निर्माताओं, राजनयिकों और उद्योग प्रमुखों के लिए विशेष पंजीकरण खुला है।'
                    : 'Ministerial briefing and executive accreditation now open for institutional policy delegations in Geneva.'}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] font-mono text-emerald-400 font-bold hidden sm:inline">
                  ● VERIFIED PARTNER
                </span>
                {onOpenMonetizationHub ? (
                  <button
                    onClick={onOpenMonetizationHub}
                    className="px-4 py-2 rounded-xs text-[11px] font-serif font-bold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    {langCode === 'hi' ? 'यहाँ विज्ञापन लगाएं' : 'Advertise Slot'}
                  </button>
                ) : (
                  <span className="text-xs text-amber-400 font-bold">Sponsored Slot</span>
                )}
              </div>
            </div>
          </>
        )}

        {/* Share Modal for Direct Social Media Sharing & URL Copying */}
        <ShareModal
          isOpen={!!shareArticle}
          onClose={() => setShareArticle(null)}
          article={shareArticle}
        />

      </div>
    </section>
  );
};
