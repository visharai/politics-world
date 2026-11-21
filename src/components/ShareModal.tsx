import React, { useState, useEffect } from 'react';
import { Article } from '../data/newsData';
import { useLanguage } from '../context/LanguageContext';
import { X, Copy, Check, Share2, Mail, ExternalLink, Smartphone } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, article }) => {
  const { langCode } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [igCopied, setIgCopied] = useState(false);
  const [hasNativeShare, setHasNativeShare] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setHasNativeShare(true);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !article) return null;

  // Compute clean canonical shareable URL with query parameter for WhatsApp/crawler rich preview
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://politicsworld.news';
  const shareUrl = `${baseUrl}/?article=${encodeURIComponent(article.id)}#${article.id}`;
  const shareTitle = `${article.title} - Politics World`;
  const shareSummary = article.deck || 'Read this breaking analysis on Politics World.';

  const copyTextToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch {
      // Fallback ignored
    }
  };

  const handleCopy = async () => {
    await copyTextToClipboard(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInstagramShare = async () => {
    await copyTextToClipboard(`${article.title}\n\n🔗 ${shareUrl}`);
    setIgCopied(true);
    setTimeout(() => setIgCopied(false), 2600);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `${article.title} · Politics World Intelligence Dispatch`,
          url: shareUrl,
        });
        onClose();
      } catch {
        // User cancelled share
      }
    }
  };

  const socialChannels = [
    {
      name: 'WhatsApp',
      accentClass: 'text-[#25D366]',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      ),
      getUrl: () => `https://api.whatsapp.com/send?text=${encodeURIComponent(`📰 *${article.title}*\n\n${shareSummary}\n\n🌐 *Politics World* | Live Intelligence Dispatch\n🔗 ${shareUrl}`)}`,
      onClick: undefined,
    },
    {
      name: 'Instagram',
      accentClass: 'text-[#E4405F]',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      getUrl: () => 'https://www.instagram.com/',
      onClick: handleInstagramShare,
    },
    {
      name: 'X',
      accentClass: 'text-slate-100',
      icon: (
        <svg className="w-3 h-3 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      getUrl: () => `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}&via=PoliticsWorldNews`,
      onClick: undefined,
    },
    {
      name: 'LinkedIn',
      accentClass: 'text-[#0A66C2]',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
      getUrl: () => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      onClick: undefined,
    },
    {
      name: 'Facebook',
      accentClass: 'text-[#1877F2]',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      getUrl: () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      onClick: undefined,
    },
    {
      name: 'Telegram',
      accentClass: 'text-[#229ED9]',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.198 1.006.128.832.942z"/>
        </svg>
      ),
      getUrl: () => `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`,
      onClick: undefined,
    },
    {
      name: 'Reddit',
      accentClass: 'text-[#FF4500]',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.197-2.512-.73a.326.326 0 0 0-.232-.095z"/>
        </svg>
      ),
      getUrl: () => `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(article.title)}`,
      onClick: undefined,
    },
    {
      name: 'Email',
      accentClass: 'text-amber-300',
      icon: <Mail className="w-3.5 h-3.5 shrink-0" />,
      getUrl: () => `mailto:?subject=${encodeURIComponent(article.title + ' - Politics World')}&body=${encodeURIComponent(`Hello,\n\nI thought you would be interested in this analysis from Politics World:\n\n${article.title}\n\n${shareSummary}\n\nRead the full report here: ${shareUrl}\n\nPolitics World Editorial Bureau`)}`,
      onClick: undefined,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#070e24] border border-[#1b2b54] shadow-2xl rounded-md p-5 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#152347]">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded border border-amber-400/50 bg-amber-500/10 flex items-center justify-center text-amber-300">
              <Share2 className="w-3.5 h-3.5" />
            </span>
            <h3 className="text-sm sm:text-base font-serif font-bold text-white tracking-wide">
              {langCode === 'hi' ? 'रिपोर्ट शेयर करें' : 'Share Dispatch'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#121f42] transition-colors cursor-pointer"
            aria-label="Close share dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Article Summary Box */}
        <div className="my-3.5 p-3 rounded bg-[#050a18] border border-[#142347]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300 font-serif mb-0.5">
            {article.category}
          </div>
          <h4 className="text-xs font-serif font-bold text-slate-100 line-clamp-2 leading-snug">
            {article.title}
          </h4>
          <div className="mt-1 text-[10px] text-slate-400 font-sans line-clamp-1">
            By {article.author} · Politics World Intelligence
          </div>
        </div>

        {/* Copy Link Input Bar */}
        <div className="mb-4">
          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            {langCode === 'hi' ? 'वेबसाइट लिंक कॉपी करें' : 'Article Web Link'}
          </label>
          <div className="flex items-center gap-1.5">
            <div className="flex-1 bg-[#091430] border border-[#182a55] rounded px-2.5 py-1.5 text-[11px] font-mono text-slate-300 truncate select-all">
              {shareUrl}
            </div>
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded font-semibold text-[11px] tracking-wide uppercase transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold active:scale-95'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>{langCode === 'hi' ? 'कॉपी हुआ' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>{langCode === 'hi' ? 'कॉपी' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Direct Social Media Sharing Options (Compact Standard Cards) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
            <span>{langCode === 'hi' ? 'सोशल मीडिया शेयर' : 'Social Platforms'}</span>
            {igCopied && (
              <span className="text-emerald-400 font-sans font-semibold normal-case">
                {langCode === 'hi' ? '✓ Instagram लिंक कॉपी हो गया' : '✓ Copied link for Instagram'}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {socialChannels.map((channel) => (
              <a
                key={channel.name}
                href={channel.getUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={channel.onClick}
                className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#0b1530] hover:bg-[#13224a] border border-[#1c2f5e] hover:border-slate-500 text-slate-200 hover:text-white text-[11px] font-medium transition-all cursor-pointer active:scale-95"
                title={`Share to ${channel.name}`}
              >
                <span className={channel.accentClass}>{channel.icon}</span>
                <span className="truncate">{channel.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Optional Native Device Share Sheet */}
        {hasNativeShare && (
          <div className="mt-3.5 pt-3 border-t border-[#152347]">
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-[#0b193d] hover:bg-[#112457] border border-[#1d3570] text-sky-300 hover:text-white text-[11px] font-semibold transition-all cursor-pointer active:scale-98"
            >
              <Smartphone className="w-3.5 h-3.5 text-sky-400" />
              <span>{langCode === 'hi' ? 'डिवाइस शेयर मेनू खोलें' : 'Share via Device Apps'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
