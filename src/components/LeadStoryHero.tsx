import React from 'react';
import { Article } from '../data/newsData';
import { useLanguage } from '../context/LanguageContext';
import { Clock, ArrowUpRight, Share2, Check } from 'lucide-react';
import { ShareModal } from './ShareModal';
import { getDispatchEdition } from '../utils/dispatchEdition';

interface LeadStoryHeroProps {
  leadArticle: Article;
  secondaryArticles: Article[];
  urgentRailArticles: Article[];
  onOpenArticle: (article: Article) => void;
}

export const LeadStoryHero: React.FC<LeadStoryHeroProps> = ({
  leadArticle,
  secondaryArticles,
  urgentRailArticles,
  onOpenArticle,
}) => {
  const {
    t,
    langCode,
    translateText,
  } = useLanguage();
  const [shareArticle, setShareArticle] = React.useState<Article | null>(null);
  const [copiedId] = React.useState<string | null>(null);

  // Dynamic Daypart Dispatch (Morning / Afternoon / Evening / Night)
  const dispatchEdition = getDispatchEdition(new Date(), langCode);

  const handleShare = (e: React.MouseEvent, article: Article) => {
    e.stopPropagation();
    setShareArticle(article);
  };

  return (
    <section id="lead-hero-section" className="w-full bg-[#060c1d] border-b border-[#18274f] py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* Section Header / Kicker with Dynamic Live Rotation Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 pb-2.5 mb-3 sm:mb-4 border-b border-[#17264d]">
          <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs tracking-wider sm:tracking-widest uppercase font-serif text-slate-400">
            <span className="text-amber-300 font-bold flex items-center gap-1.5 shrink-0">
              <span className="text-amber-400 text-sm">✦</span>
              <span>{dispatchEdition.heroBadge}</span>
            </span>
            <span aria-hidden="true" className="text-slate-600 hidden xs:inline">·</span>
            <span className="text-slate-300 tracking-[0.12em] sm:tracking-[0.16em]">{t.leadInvestigation}</span>
          </div>
          
          {/* 24-Hour Daily Edition Indicator - Broadsheet Zero-Pill Standard */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs font-mono text-slate-400">
            <span className="text-amber-400 font-bold uppercase tracking-wider font-serif">
              {langCode === 'hi' ? '24-घंटे का दैनिक संस्करण' : '24-Hour Daily Edition'}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300 flex items-center gap-1.5 font-sans">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{langCode === 'hi' ? 'आज का ताज़ा समाचार' : "Today's Verified News"}</span>
            </span>
          </div>
        </div>

        {/* 3-Tier Salience Grid: Lead (left 7 cols) + Secondary & Wire Rail (right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
          
          {/* TIER 1: DOMINANT LEAD STORY (Col span 7) */}
          <div className="lg:col-span-7 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#17264d] pb-5 lg:pb-0 lg:pr-6">
            <div>
              {/* Clean unboxed category kicker */}
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300 mb-2">
                <span className="tracking-widest">{leadArticle.category}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-400 font-normal">{t.specialReport}</span>
              </div>

              {/* Dominant Headline with Balance and Grace */}
              <h1
                onClick={() => onOpenArticle(leadArticle)}
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-[2.65rem] font-serif font-black text-slate-900 dark:text-white leading-tight sm:leading-[1.18] cursor-pointer hover:text-amber-500 dark:hover:text-amber-200 transition-colors mb-4 [text-wrap:balance]"
              >
                {leadArticle.title}
              </h1>

              {/* Deck / Subtitle */}
              <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 font-sans leading-relaxed mb-5">
                {leadArticle.deck}
              </p>

              {/* Unboxed Metadata: Zero-pill discipline with News Wire Channel attribution */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-6 font-sans">
                {leadArticle.sourceAgency && (
                  <>
                    <span className="text-amber-300 font-semibold tracking-wide flex items-center gap-1">
                      <span>📡 {leadArticle.sourceAgency}</span>
                      {leadArticle.sourceCountry && <span className="text-slate-400 font-normal">({leadArticle.sourceCountry})</span>}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                  </>
                )}
                <span className="text-slate-200 font-medium">{leadArticle.author}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{leadArticle.authorRole}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="flex items-center gap-1 font-mono tabular-nums">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {leadArticle.readTime}
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{leadArticle.date}</span>
              </div>

              {/* Lead Image Frame */}
              <div
                onClick={() => onOpenArticle(leadArticle)}
                className="relative group cursor-pointer overflow-hidden rounded-sm bg-[#0a142e] border border-[#1a2c5a] mb-5 aspect-[16/10] sm:aspect-[16/9]"
              >
                {leadArticle.image ? (
                  <img
                    src={leadArticle.image}
                    alt={leadArticle.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0c1836] to-[#060c1d] text-slate-400 p-6">
                    <p className="text-sm font-serif italic text-slate-300">{leadArticle.category}</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#060c1d]/80 via-transparent to-transparent opacity-60" />
              </div>

              {/* Caption */}
              {leadArticle.caption && (
                <p className="text-xs font-serif italic text-slate-400 mb-6">
                  {translateText ? translateText(leadArticle.caption) : leadArticle.caption}
                </p>
              )}

              {/* Key Takeaways Box (Refined hairline style, NO thick left border) */}
              {leadArticle.keyTakeaways && leadArticle.keyTakeaways.length > 0 && (
                <div className="p-4 rounded-sm bg-[#0a142e] border border-[#1a2d59] mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2.5">
                    {t.essentialTakeaways}
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    {leadArticle.keyTakeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="text-sky-400 shrink-0 font-bold">›</span>
                        <span>{translateText ? translateText(point) : point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[#16254a]">
              <button
                onClick={() => onOpenArticle(leadArticle)}
                className="px-5 py-2.5 rounded-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-serif font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                title={langCode === 'hi' ? 'पूरी खबर विस्तार से पढ़ें' : 'Read Full Article'}
              >
                <span>{langCode === 'hi' ? 'पूरी खबर विस्तार से पढ़ें' : 'Read Full Article'}</span>
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => handleShare(e, leadArticle)}
                  className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy dispatch link"
                >
                  {copiedId === leadArticle.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* TIER 2 & TIER 3: SECONDARY STORIES & THE WIRE (Col span 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            
            {/* TIER 2: SECONDARY FOCUS STORIES */}
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 pb-1.5 border-b border-[#17264d]">
                {t.keyDevelopments}
              </div>

              {secondaryArticles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => onOpenArticle(article)}
                  className="group cursor-pointer pb-4 border-b border-[#142347] last:border-b-0 last:pb-0"
                >
                  <div className="flex gap-4">
                    {/* Thumbnail if present */}
                    {article.image && (
                      <div className="w-24 sm:w-28 h-20 sm:h-24 shrink-0 rounded-sm overflow-hidden bg-[#0a142e] border border-[#1b2d58]">
                        <img
                          src={article.image}
                          alt={article.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-sky-400 mb-1">
                        <span>{article.category}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-slate-400 font-normal font-mono tabular-nums">{article.readTime}</span>
                      </div>

                      <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white group-hover:text-sky-500 dark:group-hover:text-sky-300 transition-colors leading-snug mb-1.5 [text-wrap:balance]">
                        {article.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 font-sans line-clamp-2 leading-relaxed mb-2">
                        {article.deck}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 mt-2">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          {article.sourceAgency && (
                            <span className="text-amber-300 font-semibold shrink-0">
                              📡 {article.sourceAgency} ·
                            </span>
                          )}
                          <span className="truncate">{article.author}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenArticle(article);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xs bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 hover:border-amber-400 font-semibold text-[11px] transition-all cursor-pointer shrink-0"
                        >
                          <span>{langCode === 'hi' ? 'पूरी खबर पढ़ें' : 'Read Full Article'}</span>
                          <ArrowUpRight className="w-3 h-3 text-amber-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* TIER 3: URGENT DISPATCH WIRE RAIL */}
            <div className="p-5 rounded-sm bg-[#08122c] border border-[#18274f]">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#142347]">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300">
                  {t.realTimeWire}
                </h4>
                <span className="text-[11px] font-mono text-emerald-400">Feed Live</span>
              </div>

              <div className="space-y-3.5">
                {urgentRailArticles.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onOpenArticle(item)}
                    className="group cursor-pointer pb-3 border-b border-[#101c38] last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mb-1 flex-wrap">
                      {item.sourceAgency && (
                        <>
                          <span className="text-amber-300 font-semibold">📡 {item.sourceAgency}</span>
                          <span aria-hidden="true">·</span>
                        </>
                      )}
                      <span className="text-amber-400 font-semibold">{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{item.readTime}</span>
                    </div>
                    <h5 className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-sky-300 transition-colors leading-snug mb-2">
                      {item.title}
                    </h5>
                    <div className="flex items-center justify-end">
                      <span className="text-[11px] font-semibold text-amber-400 group-hover:text-amber-300 flex items-center gap-1">
                        {langCode === 'hi' ? 'पूरी खबर विस्तार से पढ़ें →' : 'Read Full Story →'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Share Dispatch Modal */}
      <ShareModal
        isOpen={!!shareArticle}
        onClose={() => setShareArticle(null)}
        article={shareArticle}
      />
    </section>
  );
};
