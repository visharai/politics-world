import React, { useState, useEffect, useRef } from 'react';
import { Article } from '../data/newsData';
import { useLanguage } from '../context/LanguageContext';
import { X, Share2, Clock, Send, MessageSquare, Check, Volume2, Square, Headphones, Copy, ArrowLeft, Calendar, Building2, ExternalLink, Globe, Smile } from 'lucide-react';
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
  const [newCommentText, setNewCommentText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);
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

  const QUICK_COMMENT_EMOJIS = ['👍', '👏', '🇮🇳', '🔥', '💡', '⚖️', '📰', '🤝', '🎯', '😮', '🤔', '💯', '❤️', '🙏'];
  const EXTRA_COMMENT_EMOJIS = ['😄', '🙌', '🗣️', '📢', '🏛️', '🌍', '📊', '✅', '⚠️', '❓', '🚀', '⭐', '✊', '🕊️', '💼', '📌'];

  const handleInsertEmoji = (emoji: string) => {
    const input = commentInputRef.current;
    if (input && typeof input.selectionStart === 'number' && typeof input.selectionEnd === 'number') {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const next = newCommentText.slice(0, start) + emoji + newCommentText.slice(end);
      setNewCommentText(next);
      requestAnimationFrame(() => {
        input.focus();
        const cursorPos = start + emoji.length;
        input.setSelectionRange(cursorPos, cursorPos);
      });
    } else {
      setNewCommentText((prev) => `${prev}${emoji}`);
      commentInputRef.current?.focus();
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const item: Comment = {
      id: 'c-' + Date.now(),
      author: langCode === 'hi' ? 'पाठक सदस्य' : 'Reader Member',
      location: 'Verified Reader',
      text: newCommentText.trim(),
      timestamp: 'Just now',
      likes: 0,
    };
    setComments([item, ...comments]);
    setNewCommentText('');
    setShowEmojiPicker(false);
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

            <div className="flex flex-wrap items-center gap-1.5">
              {/* WhatsApp direct share */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`*${displayArticle.title}*\n\n👉 ${typeof window !== 'undefined' ? window.location.origin : ''}#${displayArticle.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 rounded-md bg-[#0b1530] hover:bg-[#13224a] border border-[#1c2f5e] hover:border-[#25D366]/60 text-slate-200 hover:text-white text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                title="Share to WhatsApp"
              >
                <svg className="w-3 h-3 fill-current text-[#25D366] shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>WhatsApp</span>
              </a>

              {/* Instagram direct share (copies link + opens Instagram) */}
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  navigator.clipboard?.writeText(`${displayArticle.title}\n\n🔗 ${typeof window !== 'undefined' ? window.location.origin : ''}#${displayArticle.id}`);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-2 py-1 rounded-md bg-[#0b1530] hover:bg-[#13224a] border border-[#1c2f5e] hover:border-[#E4405F]/60 text-slate-200 hover:text-white text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                title="Copy link & open Instagram"
              >
                <svg className="w-3 h-3 fill-current text-[#E4405F] shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram</span>
              </a>

              {/* X / Twitter direct share */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(displayArticle.title)}&url=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : ''}#${displayArticle.id}`)}&via=PoliticsWorldNews`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 rounded-md bg-[#0b1530] hover:bg-[#13224a] border border-[#1c2f5e] hover:border-slate-400/60 text-slate-200 hover:text-white text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                title="Share to X"
              >
                <svg className="w-2.5 h-2.5 fill-current text-slate-100 shrink-0" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>X</span>
              </a>

              {/* Quick Copy Link */}
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`${window.location.origin}#${displayArticle.id}`);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer active:scale-95 ${
                  copied
                    ? 'bg-emerald-600 text-white border border-emerald-500'
                    : 'bg-[#0b1530] hover:bg-[#13224a] text-sky-300 border border-[#1c2f5e]'
                }`}
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? (langCode === 'hi' ? 'कॉपी हुआ' : 'Copied') : (langCode === 'hi' ? 'लिंक' : 'Copy')}</span>
              </button>

              {/* More Platforms Popover Modal */}
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="px-2.5 py-1 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                title="Open all social platforms (WhatsApp, Instagram, LinkedIn, Facebook, Telegram, Reddit, Email)"
              >
                <span>{langCode === 'hi' ? 'अन्य...' : 'More'}</span>
              </button>
            </div>
          </div>

          {/* Reader Discussion / Comments Section */}
          <div className="mt-6 pt-4 border-t border-[#16274e]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-base font-serif font-bold text-white">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <span>{t.perspectives} ({comments.length})</span>
              </div>
            </div>

            {/* Comment Form */}
            <form onSubmit={handlePostComment} className="mb-6 space-y-2.5 bg-[#09132c] border border-[#17274e] p-4 rounded-sm">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1 flex items-center">
                  <input
                    ref={commentInputRef}
                    type="text"
                    required
                    placeholder={t.writeComment}
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="w-full bg-[#060c1d] border border-[#1a2b55] focus:border-sky-400 rounded-sm pl-3 pr-9 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                    className="absolute right-2 p-1 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                    title={langCode === 'hi' ? 'और इमोजी देखें' : 'Toggle Emoji Picker'}
                    aria-label="Toggle Emoji Picker"
                    aria-expanded={showEmojiPicker}
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#060c1d] bg-sky-400 hover:bg-sky-300 rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-1 shrink-0"
                >
                  <Send className="w-3 h-3" />
                  <span>{t.post}</span>
                </button>
              </div>

              {/* Visible Quick Emoji Strip */}
              <div className="flex flex-wrap items-center gap-1 pt-1">
                <span className="text-[11px] text-slate-400 mr-1 font-medium">
                  {langCode === 'hi' ? 'इमोजी:' : 'Emojis:'}
                </span>
                {QUICK_COMMENT_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleInsertEmoji(emoji)}
                    className="px-1.5 py-0.5 text-base leading-none rounded bg-[#060c1d] hover:bg-[#132550] border border-[#1a2b55] hover:border-amber-400/60 transition-all cursor-pointer active:scale-90"
                    title={`Insert ${emoji}`}
                    aria-label={`Insert emoji ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                  className="ml-1 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider rounded bg-[#060c1d] hover:bg-[#132550] text-amber-300 border border-[#1a2b55] cursor-pointer"
                >
                  {showEmojiPicker ? (langCode === 'hi' ? 'कम' : 'Less') : (langCode === 'hi' ? '+ और' : '+ More')}
                </button>
              </div>

              {/* Expanded Emoji Tray */}
              {showEmojiPicker && (
                <div className="p-2.5 rounded bg-[#060c1d] border border-[#1b2f5d] flex flex-wrap gap-1.5">
                  {EXTRA_COMMENT_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleInsertEmoji(emoji)}
                      className="px-2 py-1 text-base leading-none rounded bg-[#09132c] hover:bg-[#162b5c] border border-[#1a2b55] hover:border-sky-400 transition-all cursor-pointer active:scale-90"
                      title={`Insert ${emoji}`}
                      aria-label={`Insert emoji ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
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

            {/* Bottom Editorial Sign-off */}
            <div className="mt-8 pt-6 border-t border-[#16274e] flex items-center justify-center text-xs text-slate-400">
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
