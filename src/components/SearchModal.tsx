import React, { useState, useEffect } from 'react';
import { Article } from '../data/newsData';
import { useLanguage } from '../context/LanguageContext';
import { Search, X, FileText, Scale } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectArticle,
}) => {
  const { t, translatedArticles, translatedBills } = useLanguage();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredArticles = query.trim()
    ? translatedArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.deck.toLowerCase().includes(query.toLowerCase()) ||
          a.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      )
    : translatedArticles.slice(0, 4);

  const filteredBills = query.trim()
    ? translatedBills.filter(
        (b) =>
          b.title.toLowerCase().includes(query.toLowerCase()) ||
          b.billNumber.toLowerCase().includes(query.toLowerCase()) ||
          b.summary.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex justify-center p-4 sm:p-6 md:p-12 font-sans"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#070e24] border border-[#1b2b54] shadow-2xl rounded-sm my-auto text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#152347] flex items-center gap-3 bg-[#08122a]">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder={t.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-[#060c1d] border border-[#17274e] rounded-xs">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
          {/* Articles Section */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>{t.allDispatches} ({filteredArticles.length})</span>
            </div>
            <div className="space-y-2">
              {filteredArticles.length === 0 ? (
                <div className="text-xs text-slate-500 italic p-3 text-center">
                  {t.noSearchResults}
                </div>
              ) : (
                filteredArticles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => {
                      onSelectArticle(art);
                      onClose();
                    }}
                    className="p-3 rounded-sm bg-[#0a142e] border border-[#16274e] hover:border-sky-400/50 hover:bg-[#0d1b3e] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1 font-mono">
                      <span className="text-sky-400 font-semibold">{art.category}</span>
                      <span>·</span>
                      <span>{art.readTime}</span>
                    </div>
                    <h4 className="text-sm font-serif font-bold text-white group-hover:text-sky-300 transition-colors leading-snug">
                      {art.title}
                    </h4>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bills Section */}
          {filteredBills.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2.5 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-sky-400" />
                <span>{t.capitolBillTracker} ({filteredBills.length})</span>
              </div>
              <div className="space-y-2">
                {filteredBills.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-sm bg-[#0a142e] border border-[#16274e] text-xs"
                  >
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mb-1">
                      <span className="text-sky-400 font-bold">{b.billNumber}</span>
                      <span>·</span>
                      <span>{b.chamber}</span>
                      <span>·</span>
                      <span className="text-emerald-400">{b.oddsOfPassage}%</span>
                    </div>
                    <h5 className="font-serif font-bold text-white text-sm leading-snug mb-1">
                      {b.title}
                    </h5>
                    <p className="text-slate-300 line-clamp-1">{b.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
