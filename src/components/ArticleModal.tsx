import React, { useState, useEffect } from 'react';
import { Article } from '../data/newsData';
import { useLanguage } from '../context/LanguageContext';
import { X, Share2, Clock, Send, MessageSquare, Check, Volume2, Square, Headphones, Copy, ArrowLeft, Calendar, Building2, ExternalLink, Globe } from 'lucide-react';
import { podcastAudioEngine, TranscriptLine } from '../utils/podcastAudio';
import { ShareModal } from './ShareModal';
import { InArticleAdBanner } from './InArticleAdBanner';
import { translationService } from '../services/translationService';
import { ensureFullLengthArticle } from '../utils/articleExpander';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
  onOpenMonetizationHub?: () => void;
}

interface Comment {
  id: string;
  author: string;
  location: string;
  text: string;
  timestamp: string;
  likes: number;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  onOpenMonetizationHub,
}) => {
  const { t, langCode, translateArticle, translateText } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c1',
      author: 'David Thorne',
      location: 'Washington, DC',
      text: 'The 12 percent subsidy cap represents a realistic compromise, though everything hinges on whether the Geneva panel can issue binding arbitrations without triggering sovereign vetoes.',
      timestamp: '2 hours ago',
      likes: 14,
    },
    {
      id: 'c2',
      author: 'Claire V.',
      location: 'Brussels Bureau',
      text: 'Significant that allied rare earth sourcing is explicitly included. This resolves the customs limbo that automotive component suppliers have faced for months.',
      timestamp: '4 hours ago',
      likes: 8,
    },
  ]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [isNarrating, setIsNarrating] = useState(false);
  const [enhancedArticle, setEnhancedArticle] = useState<Article | null>(null);

  useEffect(() => {
    setEnhancedArticle(null);
    if (!article || langCode === 'en') return;

    let isCancelled = false;
    translationService.translateArticle(article, langCode).then((t) => {
      if (!isCancelled && t) {
        setEnhancedArticle(t);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [article, langCode]);

  const displayArticle = React.useMemo(() => {
    if (!article) return null;
    const base = enhancedArticle || (translateArticle ? translateArticle(article) : article);
    return ensureFullLengthArticle(base, langCode);
  }, [article, langCode, translateArticle, enhancedArticle]);

  // Handle clean back navigation
  const handleGoBack = React.useCallback(() => {
    podcastAudioEngine.pause();
    setIsNarrating(false);
    onClose();
    if (typeof window !== 'undefined' && window.history.state?.articleModalOpen) {
      window.history.back();
    }
  }, [onClose]);

  useEffect(() => {
    setIsNarrating(false);
    return () => {
      podcastAudioEngine.pause();
    };
  }, [article?.id]);

  // Support hardware/browser Back button on mobile & desktop
  useEffect(() => {
    if (!article) return;
    try {
      window.history.pushState({ articleModalOpen: true, id: article.id }, '');
    } catch {
      // fallback
    }

    const handlePopState = () => {
      podcastAudioEngine.pause();
      setIsNarrating(false);
      onClose();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [article?.id, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleGoBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGoBack]);

  if (!article || !displayArticle) return null;

  const isAdOrMetadata = (text: string) => {
    if (!text) return true;
    const lower = text.toLowerCase();
    return (
      lower.includes('advertisement') ||
      lower.includes('sponsored') ||
      lower.includes('विज्ञापन') ||
      lower.includes('adsense') ||
      lower.includes('verified source link') ||
      lower.includes('syndicated in real-time') ||
      lower.includes('verified dispatch certification') ||
      lower.includes('आधिकारिक सत्यापन विवरण') ||
      lower.includes('original article link') ||
      lower.includes('full coverage link') ||
      lower.includes('http://') ||
      lower.includes('https://') ||
      lower.includes('adchoices') ||
      lower.includes('essential intelligence takeaways') ||
      lower.includes('essential takeaways') ||
      lower.startsWith('takeaway') ||
      lower.startsWith('tags:') ||
      lower.includes('ad slot')
    );
  };

  const handleToggleNarrate = () => {
    podcastAudioEngine.unlockAudio();
    if (isNarrating) {
      podcastAudioEngine.pause();
      setIsNarrating(false);
      return;
    }

    setIsNarrating(true);

    // Compile ONLY this specific article's editorial content:
    // Title -> Deck -> Lead Paragraph -> Body Paragraphs (deduplicated)
    // Strictly excludes ads, takeaways, links, dates, metadata, and tags
    const textParts: string[] = [];
    const seen = new Set<string>();
    const addPart = (raw?: string) => {
      if (!raw) return;
      const trimmed = raw.trim();
      if (!trimmed || isAdOrMetadata(trimmed)) return;
      const key = trimmed.toLowerCase().replace(/[^a-z0-9\u0900-\u097f]/g, '');
      if (!key || seen.has(key)) return;
      seen.add(key);
      textParts.push(trimmed);
    };

    addPart(displayArticle.title);
    addPart(displayArticle.deck);
    addPart(displayArticle.leadParagraph);

    if (displayArticle.bodyParagraphs && Array.isArray(displayArticle.bodyParagraphs)) {
      displayArticle.bodyParagraphs.forEach((para) => {
        addPart(para);
      });
    }

    const fullContinuousScript = textParts.join(' ');

    // Read full script in a single continuous non-stop stream without punctuation pauses
    podcastAudioEngine.playContinuous(
      fullContinuousScript,
      {
        onTimeUpdate: () => {},
        onSegmentChange: () => {},
        onStateChange: (playing) => {
          setIsNarrating(playing);
        },
      },
      langCode,
      false
    );
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.origin + '#' + displayArticle.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const item: Comment = {
      id: 'c-' + Date.now(),
      author: newCommentName.trim() || 'Reader Member',
      location: 'Verified Reader',
      text: newCommentText.trim(),
      timestamp: 'Just now',
      likes: 0,
    };
    setComments([item, ...comments]);
    setNewCommentText('');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex justify-center p-1.5 sm:p-6 md:p-10 font-sans"
      onClick={handleGoBack}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-4xl bg-[#070e24] border border-[#1b2b54] shadow-2xl rounded-sm my-auto text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Sticky Bar inside modal with prominent Back to News Button */}
        <div className="sticky top-0 z-20 bg-[#070e24]/95 backdrop-blur border-b border-[#152347] px-3 sm:px-6 py-2.5 sm:py-3 flex flex-wrap xs:flex-nowrap items-center justify-between gap-2 sm:gap-3">
          {/* Prominent Back to News Button on Left */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-sm text-[11px] sm:text-sm font-serif font-black uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
              title={langCode === 'hi' ? 'समाचारों पर वापस जाएं' : 'Back to News'}
              aria-label="Back to News"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
              <span className="sm:hidden">{langCode === 'hi' ? 'वापस' : 'Back'}</span>
              <span className="hidden sm:inline">{langCode === 'hi' ? 'समाचारों पर वापस जाएं' : 'Back to News'}</span>
            </button>

            <div className="hidden xs:flex items-center gap-2 text-xs font-serif font-bold tracking-wider uppercase text-sky-400 truncate">
              <span className="truncate">Politics World Intelligence</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 font-sans font-normal truncate">{displayArticle.category}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Listen Aloud Button */}
            <button
              onClick={handleToggleNarrate}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                isNarrating
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/60 hover:bg-rose-500/30'
                  : 'bg-sky-500/15 text-sky-300 border border-sky-500/40 hover:bg-sky-500/25 hover:text-white'
              }`}
              title={isNarrating ? 'Pause Audio Narration' : 'Listen to this article in current language'}
              aria-label={isNarrating ? 'Pause narration' : 'Listen to article'}
            >
              {isNarrating ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>{langCode === 'hi' ? 'रोकें' : 'Stop'}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">{langCode === 'hi' ? 'आवाज़ में सुनें' : 'Listen Aloud'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={langCode === 'hi' ? 'सोशल मीडिया पर शेयर करें या लिंक कॉपी करें' : 'Share to social media or copy link'}
            >
              <Share2 className="w-4 h-4 text-amber-400" />
            </button>

            {/* Clear Close Button with Label */}
            <button
              onClick={handleGoBack}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-sm text-xs font-medium border border-slate-700 transition-colors cursor-pointer ml-1"
              aria-label={t.closeLabel}
              title={langCode === 'hi' ? 'बंद करें और वापस जाएं' : 'Close and return to feed'}
            >
              <X className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">{langCode === 'hi' ? 'बंद करें' : 'Close'}</span>
            </button>
          </div>
        </div>

        {/* Modal Article Content Container */}
        <div className="p-6 sm:p-10 max-h-[85vh] overflow-y-auto">
          {/* Article Header */}
          <div className="mb-8 border-b border-[#16274e] pb-6">
            
            {/* Prominent Metadata Strip: Publication Date, Origin Wire Agency, Reading Time */}
            <div className="mb-4 p-3 rounded-xs bg-[#091533] border border-[#1b2f5f] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold uppercase tracking-wider text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{langCode === 'hi' ? 'प्रकाशन दिनांक:' : 'Published:'} {displayArticle.date}</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-sky-950/80 text-sky-300 border border-sky-500/40 font-bold uppercase tracking-wider text-[11px]">
                  <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>📡 {displayArticle.sourceAgency || 'Politics World Wire'}</span>
                  {displayArticle.sourceCountry && (
                    <span className="text-slate-400 font-normal">({displayArticle.sourceCountry})</span>
                  )}
                </span>
              </div>

              {displayArticle.sourceUrl && (
                <a
                  href={displayArticle.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-white underline flex items-center gap-1 text-[11px] font-bold shrink-0"
                >
                  <span>{langCode === 'hi' ? 'मूल आधिकारिक वायर रिपोर्ट ↗' : 'Official Wire Dispatch ↗'}</span>
                  <ExternalLink className="w-3 h-3 text-cyan-400" />
                </a>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400 mb-2">
              <span>{displayArticle.category}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="font-mono">{displayArticle.readTime}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white leading-tight mb-4 [text-wrap:balance]">
              {displayArticle.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed mb-6 font-medium">
              {displayArticle.deck}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-sans pt-2 border-t border-[#142347]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-200 font-semibold">{displayArticle.author}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{displayArticle.authorRole}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="flex items-center gap-1 font-mono tabular-nums">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {displayArticle.readTime}
                </span>
              </div>

              {/* In-Body Audio Player Bar */}
              <button
                onClick={handleToggleNarrate}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
                  isNarrating
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 hover:bg-rose-500/30'
                    : 'bg-[#0c1938] hover:bg-[#12234e] text-slate-300 hover:text-white border border-[#1d3260]'
                }`}
                title="Play audible speech broadcast of this article"
              >
                {isNarrating ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                    <span>{langCode === 'hi' ? 'वाचन रोकें (Pause)' : 'Pause Narration'}</span>
                  </>
                ) : (
                  <>
                    <Headphones className="w-3.5 h-3.5 text-sky-400" />
                    <span>{langCode === 'hi' ? 'पूरी खबर आवाज़ में सुनें' : 'Listen to Full Story'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Article Media if available */}
          {displayArticle.image && (
            <div className="mb-8">
              <div className="overflow-hidden rounded-sm border border-[#182850] aspect-[16/9] bg-[#0a142e]">
                <img
                  src={displayArticle.image}
                  alt={displayArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              {displayArticle.caption && (
                <p className="text-xs font-serif italic text-slate-400 mt-2">
                  {displayArticle.caption}
                </p>
              )}
            </div>
          )}

          {/* Key Takeaways Box */}
          {displayArticle.keyTakeaways && displayArticle.keyTakeaways.length > 0 && (
            <div className="p-5 rounded-sm bg-[#091533] border border-[#1b2f5f] mb-8">
              <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">
                {t.essentialTakeaways}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                {displayArticle.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-sky-400 font-bold shrink-0">›</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Uninterrupted Main Prose for This Single Specific News Event */}
          <div className="max-w-none text-slate-300 space-y-5 text-sm sm:text-base leading-relaxed font-sans mb-10">
            {displayArticle.leadParagraph && (
              <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-sky-400">
                {displayArticle.leadParagraph}
              </p>
            )}

            {displayArticle.bodyParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Tags */}
          {displayArticle.tags && displayArticle.tags.length > 0 && (
            <div className="pt-6 border-t border-[#142347] mb-6 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-slate-300">Tags:</span>
              {displayArticle.tags.map((tagItem, idx) => (
                <span key={idx} className="text-sky-400 hover:text-white transition-colors">
                  #{tagItem}{idx < displayArticle.tags.length - 1 ? ' ·' : ''}
                </span>
              ))}
            </div>
          )}

          {/* Separate Partner Sponsorship Placement (strictly outside article prose) */}
          <InArticleAdBanner onOpenMonetizationHub={onOpenMonetizationHub} />

          {/* Direct Social Media Sharing Bar */}
          <div className="p-4 rounded-xs bg-[#050a18] border border-[#16274e] mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-xs bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-bold font-serif">
                <Share2 className="w-3 h-3" />
              </span>
              <span className="text-xs font-serif font-bold uppercase tracking-wider text-slate-200">
                {langCode === 'hi' ? 'रिपोर्ट शेयर करें:' : 'Share this dispatch:'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* WhatsApp direct share */}
              <button
                onClick={() => {
                  const shareUrl = `${window.location.origin}#${displayArticle.id}`;
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`*${displayArticle.title}*\n\n👉 ${shareUrl}`)}`, '_blank');
                }}
                className="px-2.5 py-1.5 rounded-xs bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Share to WhatsApp"
              >
                <span>WhatsApp</span>
              </button>

              {/* X / Twitter direct share */}
              <button
                onClick={() => {
                  const shareUrl = `${window.location.origin}#${displayArticle.id}`;
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(displayArticle.title)}&url=${encodeURIComponent(shareUrl)}&via=PoliticsWorldNews`, '_blank');
                }}
                className="px-2.5 py-1.5 rounded-xs bg-black hover:bg-neutral-900 text-white border border-neutral-700 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Share to X (Twitter)"
              >
                <span>𝕏 / Twitter</span>
              </button>

              {/* Quick Copy Link */}
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`${window.location.origin}#${displayArticle.id}`);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className={`px-2.5 py-1.5 rounded-xs text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#0f1d3f] hover:bg-[#152a5c] text-sky-300 border border-[#1b3470]'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (langCode === 'hi' ? 'कॉपी हुआ!' : 'Copied!') : (langCode === 'hi' ? 'लिंक कॉपी करें' : 'Copy Link')}</span>
              </button>

              {/* More Platforms Popover Modal */}
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="px-3 py-1.5 rounded-xs bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Open all social platforms (LinkedIn, Facebook, Telegram, Reddit, Email)"
              >
                <span>{langCode === 'hi' ? 'अन्य विकल्प...' : 'More...'}</span>
              </button>
            </div>
          </div>

          {/* Quick Exit to News Feed Banner */}
          <div className="p-4 sm:p-5 rounded-sm bg-gradient-to-r from-[#091533] via-[#0d1f4b] to-[#091533] border-2 border-amber-500/50 my-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">✓</span>
              <span>{langCode === 'hi' ? 'आपने यह समाचार पूरा पढ़ लिया है।' : 'You have completed reading this full article.'}</span>
            </div>
            <button
              onClick={handleGoBack}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-serif font-black text-xs uppercase tracking-wider rounded-sm transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
              title={langCode === 'hi' ? 'समाचारों पर वापस जाएं' : 'Back to News'}
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              <span>{langCode === 'hi' ? '← समाचारों पर वापस जाएं' : '← Back to News'}</span>
            </button>
          </div>

          {/* Reader Discussion / Comments Section */}
          <div className="pt-4 border-t border-[#16274e]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-base font-serif font-bold text-white">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <span>{t.perspectives} ({comments.length})</span>
              </div>
            </div>

            {/* Comment Form */}
            <form onSubmit={handlePostComment} className="mb-6 space-y-3 bg-[#09132c] border border-[#17274e] p-4 rounded-sm">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder={t.nameLabel}
                  value={newCommentName}
                  onChange={(e) => setNewCommentName(e.target.value)}
                  className="sm:w-1/3 bg-[#060c1d] border border-[#1a2b55] focus:border-sky-400 rounded-sm px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder={t.writeComment}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 bg-[#060c1d] border border-[#1a2b55] focus:border-sky-400 rounded-sm px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#060c1d] bg-sky-400 hover:bg-sky-300 rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-1 shrink-0"
                >
                  <Send className="w-3 h-3" />
                  <span>{t.post}</span>
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="p-4 rounded-sm bg-[#08122a] border border-[#142347] text-xs font-sans">
                  <div className="flex items-center justify-between text-slate-400 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200">{c.author}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-slate-400">{c.location}</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-500">{c.timestamp}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{translateText ? translateText(c.text) : c.text}</p>
                </div>
              ))}
            </div>

            {/* Bottom Final Return Button */}
            <div className="mt-8 pt-6 border-t border-[#16274e] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <button
                onClick={handleGoBack}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-serif font-black text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md active:scale-95"
                title={langCode === 'hi' ? 'समाचारों पर वापस जाएं' : 'Back to News'}
              >
                <ArrowLeft className="w-4 h-4 stroke-[3]" />
                <span>{langCode === 'hi' ? '← समाचारों पर वापस जाएं' : '← Back to News'}</span>
              </button>
              <span className="font-mono text-[11px] text-slate-400">
                Politics World International Journal of Record · Verified Real-Time
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* Social Media Sharing Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        article={displayArticle}
      />
    </div>
  );
};
