import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../data/translations';
import { Globe, ChevronDown, Check, Search, X } from 'lucide-react';

interface LanguageSelectorProps {
  // Optional custom button styling or full-width drawer mode
  variant?: 'header' | 'drawer';
  onLanguageSelected?: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'header',
  onLanguageSelected,
}) => {
  const { currentLanguage, setLanguage, langCode } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Desktop outside click handler (only when open and on screen width >= 640px)
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      // If mobile modal is open, modal has its own backdrop overlay
      if (typeof window !== 'undefined' && window.innerWidth < 640) return;
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  // Prevent background scroll when mobile modal is open
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.innerWidth < 640) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleSelect = (code: string) => {
    setLanguage(code);
    setIsOpen(false);
    setFilterQuery('');
    if (onLanguageSelected) {
      onLanguageSelected();
    }
  };

  // Render Mobile Full Modal into document.body using React Portal
  const renderMobileModal = () => {
    if (!isOpen || !mounted || typeof document === 'undefined') return null;

    return createPortal(
      <div className="sm:hidden fixed inset-0 z-[99999] flex flex-col justify-end bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
        {/* Backdrop overlay click dismiss */}
        <div
          className="fixed inset-0 -z-10"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />

        {/* Bottom Sheet Card */}
        <div
          className="relative w-full max-h-[85vh] bg-[#070e24] border-t-2 border-amber-500/50 rounded-t-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans"
          role="dialog"
          aria-modal="true"
          aria-label="Select Edition Language"
        >
          {/* Top Grab Bar */}
          <div className="w-12 h-1.5 bg-slate-600 rounded-full mx-auto mt-2.5 mb-1 shrink-0" />

          {/* Modal Header */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-[#182852] bg-[#050b1d] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-full bg-amber-500/20 text-amber-400">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
                  <span>16 Global Editions</span>
                  <span className="text-amber-400 font-sans text-xs">· भाषा चुनें</span>
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Current: {currentLanguage.flag} {currentLanguage.nativeName} ({currentLanguage.code.toUpperCase()})
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full bg-[#0e1b3d] text-slate-300 hover:text-white border border-[#21356b] active:scale-95 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Input Box */}
          <div className="p-3 bg-[#08122d] border-b border-[#182852] shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={langCode === 'hi' ? 'भाषा खोजें (जैसे: हिन्दी, English)...' : 'Search language (e.g. Hindi, English)...'}
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full bg-[#050b1a] border border-[#21376b] focus:border-amber-400 rounded-lg pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
              />
              {filterQuery && (
                <button
                  type="button"
                  onClick={() => setFilterQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Language Grid/List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredLanguages.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 italic">
                No matching language found
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = lang.code === currentLanguage.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer text-left active:scale-[0.98] ${
                      isSelected
                        ? 'bg-[#12244f] border-amber-400 text-white shadow-lg'
                        : 'bg-[#091430] border-[#162752] text-slate-200 hover:bg-[#0e1d44] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl leading-none select-none">{lang.flag}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-100">{lang.nativeName}</span>
                          <span className="text-[11px] font-mono text-amber-300 uppercase font-bold">
                            ({lang.code})
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">{lang.name}</div>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-400 text-slate-950 font-bold text-xs shadow">
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> Active
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer note with Close button */}
          <div className="p-3 bg-[#050b1d] border-t border-[#182852] flex items-center justify-between text-xs shrink-0">
            <span className="text-slate-400 text-[11px] font-mono">Instant full-portal translation</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  // Drawer variant
  if (variant === 'drawer') {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full p-2.5 rounded-sm bg-[#0a1532] border border-[#1b2f5d] text-slate-200 hover:text-white flex items-center justify-between cursor-pointer transition-colors"
          title="Change Global Edition / Language"
        >
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-serif font-bold">
              {langCode === 'hi' ? 'भाषा बदलें' : 'Edition / Language'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs text-amber-300 font-bold">
            <span>{currentLanguage.flag}</span>
            <span>{currentLanguage.nativeName}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </button>
        {renderMobileModal()}
      </>
    );
  }

  // Header default variant
  return (
    <div className="relative font-sans" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        ref={triggerButtonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-200 hover:text-white bg-[#0a1534] hover:bg-[#112250] border border-[#1d3266] hover:border-amber-400/60 rounded-xs transition-all cursor-pointer shadow-xs select-none active:scale-95"
        title="Select Edition / Language"
        aria-label="Language translation selector"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
        <span className="font-medium flex items-center gap-1 sm:gap-1.5 text-[11px]">
          <span>{currentLanguage.flag}</span>
          <span className="font-bold text-amber-300">{currentLanguage.code.toUpperCase()}</span>
          <span aria-hidden="true" className="text-slate-500 hidden sm:inline">·</span>
          <span className="text-slate-100 font-semibold hidden sm:inline">{currentLanguage.nativeName}</span>
        </span>
        <ChevronDown className={`w-3 h-3 text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 1. MOBILE RESPONSIVE MODAL (< 640px) */}
      {renderMobileModal()}

      {/* 2. DESKTOP POPOVER (>= 640px) */}
      {isOpen && (
        <div className="hidden sm:block absolute top-full right-0 mt-2 w-80 bg-[#070e24] border border-amber-500/40 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header & Search */}
          <div className="p-3 bg-[#050b1d] border-b border-[#182852]">
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono mb-2">
              <span className="font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                16 Global Editions
              </span>
              <span className="text-[11px] text-slate-400">भाषा चुनें</span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search language or country (e.g. Hindi)..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full bg-[#050b1a] border border-[#1e3468] focus:border-amber-400 rounded-xs pl-8 pr-6 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
              />
              {filterQuery && (
                <button
                  type="button"
                  onClick={() => setFilterQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Languages Scrollable List */}
          <div className="max-h-72 overflow-y-auto p-1.5 space-y-1">
            {filteredLanguages.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400 italic">
                No matching language found
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = lang.code === currentLanguage.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xs transition-colors cursor-pointer text-left ${
                      isSelected
                        ? 'bg-[#12244f] border border-amber-400/60 text-white font-medium'
                        : 'text-slate-200 hover:bg-[#0c1836] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg leading-none select-none">{lang.flag}</span>
                      <div>
                        <div className="flex items-center gap-1.5 leading-snug">
                          <span className="font-bold text-slate-100">{lang.nativeName}</span>
                          <span className="text-[10px] font-mono text-amber-300 uppercase">
                            ({lang.code})
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans">{lang.name}</div>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-amber-400 shrink-0 stroke-[2.5]" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="px-3 py-2 bg-[#050b1d] border-t border-[#182852] text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>Instant Full-Portal Translation</span>
            <span className="text-emerald-400 font-bold">Active</span>
          </div>
        </div>
      )}
    </div>
  );
};
