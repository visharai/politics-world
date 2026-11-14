import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Download, Smartphone, X, Share } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLanguage } from '../context/LanguageContext';

interface PWAInstallButtonProps {
  variant?: 'header' | 'compact' | 'banner' | 'drawer';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { langCode } = useLanguage();
  const [showGuide, setShowGuide] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuide(true);
    }
  };

  const buttonLabel =
    langCode === 'hi'
      ? variant === 'drawer' || variant === 'banner'
        ? 'मोबाइल ऐप इंस्टॉल करें'
        : 'ऐप इंस्टॉल'
      : variant === 'drawer' || variant === 'banner'
      ? 'Install Mobile App'
      : 'Install App';

  const renderGuideModal = () => {
    if (!showGuide || !mounted || typeof document === 'undefined') return null;

    return createPortal(
      <div
        className="fixed inset-0 z-[999999] flex items-end sm:items-center justify-center p-0 sm:p-4 font-sans"
        role="dialog"
        aria-modal="true"
        aria-label="Install Politics World App"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-xs"
          onClick={() => setShowGuide(false)}
          aria-hidden="true"
        />

        <div className="relative z-10 w-full sm:max-w-md rounded-t-2xl sm:rounded-xl bg-[#08122d] border-t-2 sm:border border-emerald-400/60 p-5 sm:p-6 shadow-2xl text-slate-100">
          <div className="flex items-center justify-between pb-3 border-b border-[#182c5c]">
            <div className="flex items-center gap-2.5">
              <img
                src="/pwa-192x192.png"
                alt="Politics World App Icon"
                className="w-8 h-8 rounded-md border border-amber-400/50 shrink-0"
              />
              <div>
                <h3 className="text-sm sm:text-base font-serif font-bold text-white leading-tight">
                  {isIOS
                    ? langCode === 'hi'
                      ? 'iPhone / iPad पर ऐप इंस्टॉल करें'
                      : 'Install on iPhone / iPad'
                    : langCode === 'hi'
                    ? 'Politics World मोबाइल ऐप इंस्टॉल करें'
                    : 'Install Politics World App'}
                </h3>
                <p className="text-[10px] text-emerald-300 font-mono uppercase tracking-wider">
                  {langCode === 'hi' ? 'फास्ट एवं ऑफलाइन सपोर्ट' : 'Fast Launch · Offline Ready'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="p-1.5 rounded-full bg-[#0d1c42] text-slate-300 hover:text-white cursor-pointer"
              aria-label="Close install instructions"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {isIOS ? (
            <ol className="mt-4 space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <span>
                  {langCode === 'hi' ? 'Safari में नीचे ' : 'Tap the '}
                  <strong className="text-white inline-flex items-center gap-1">
                    Share <Share className="w-3.5 h-3.5 text-sky-400 inline" />
                  </strong>
                  {langCode === 'hi' ? ' बटन पर टैप करें।' : ' button in the Safari toolbar.'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <span>
                  {langCode === 'hi' ? 'नीचे स्क्रॉल करके ' : 'Scroll down and tap '}
                  <strong className="text-white">Add to Home Screen</strong>
                  {langCode === 'hi' ? ' चुनें और Add दबाएं।' : ' to add the icon.'}
                </span>
              </li>
            </ol>
          ) : (
            <ol className="mt-4 space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <span>
                  {langCode === 'hi'
                    ? 'ब्राउज़र के ऊपर दाईं ओर ⋮ मेनू (या एड्रेस बार के Install आइकन) पर टैप करें।'
                    : 'Tap the browser menu (⋮) or the Install icon in the address bar.'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <span>
                  {langCode === 'hi'
                    ? '"Install app" या "Add to Home screen" चुनें — Politics World सीधे मोबाइल ऐप की तरह खुलेगा।'
                    : 'Select "Install app" or "Add to Home screen" to launch Politics World like a native app.'}
                </span>
              </li>
            </ol>
          )}

          <button
            type="button"
            onClick={() => setShowGuide(false)}
            className="mt-5 w-full rounded-sm bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs sm:text-sm font-bold text-white transition-colors cursor-pointer"
          >
            {langCode === 'hi' ? 'ठीक है' : 'Got it'}
          </button>
        </div>
      </div>,
      document.body
    );
  };

  if (variant === 'compact') {
    return (
      <>
        <button
          type="button"
          onClick={handleClick}
          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-sans font-extrabold text-[10px] xs:text-[11px] uppercase tracking-tight shadow-[0_2px_10px_rgba(16,185,129,0.35)] cursor-pointer transition-all active:scale-95 whitespace-nowrap shrink-0"
          title={langCode === 'hi' ? 'मोबाइल ऐप इंस्टॉल करें' : 'Install Politics World App'}
        >
          <Download className="w-3 h-3 stroke-[2.75] shrink-0" />
          <span>{langCode === 'hi' ? 'ऐप' : 'Install'}</span>
        </button>
        {renderGuideModal()}
      </>
    );
  }

  if (variant === 'drawer') {
    return (
      <>
        <button
          type="button"
          onClick={handleClick}
          className="w-full p-2.5 rounded-sm flex items-center justify-between text-left text-xs text-emerald-200 bg-emerald-950/60 hover:bg-emerald-900/70 transition-colors cursor-pointer border border-emerald-400/60"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/pwa-192x192.png"
              alt="Politics World App"
              className="w-8 h-8 rounded-xs border border-amber-400/50 shrink-0"
            />
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-emerald-300 font-serif truncate">{buttonLabel}</div>
              <div className="text-[10px] text-slate-300 font-sans truncate">
                {langCode === 'hi' ? 'होम स्क्रीन पर जोड़ें · ऑफलाइन भी पढ़ें' : 'Add to Home Screen · Offline Ready'}
              </div>
            </div>
          </div>
          <Download className="w-4 h-4 text-emerald-400 shrink-0" />
        </button>
        {renderGuideModal()}
      </>
    );
  }

  if (variant === 'banner') {
    return (
      <>
        <div
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
          }}
          className="w-full h-full p-2 sm:p-2.5 bg-gradient-to-r from-[#062b26] via-[#093d35] to-[#062b26] border-2 border-emerald-400/75 hover:border-emerald-300 rounded-xs flex items-center justify-between gap-2 cursor-pointer shadow-[0_4px_16px_rgba(16,185,129,0.2)] active:scale-[0.99] transition-all"
          title={buttonLabel}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xs overflow-hidden border border-emerald-300/70 shadow-xs bg-[#040816]">
              <img
                src="/pwa-192x192.png"
                alt="Politics World App"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] sm:text-xs font-serif font-black text-white truncate">
                  {langCode === 'hi' ? 'POLITICS WORLD ऐप' : 'POLITICS WORLD APP'}
                </span>
                <span className="text-[8px] px-1 bg-emerald-400 text-slate-950 font-mono rounded-xs font-black shrink-0">
                  APP
                </span>
              </div>
              <div className="text-[10px] text-emerald-200 truncate font-sans font-medium">
                {langCode === 'hi' ? 'सीधे मोबाइल व टैबलेट पर इंस्टॉल करें' : 'Fast Mobile App · Offline Ready'}
              </div>
            </div>
          </div>
          <span className="px-2.5 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-[10px] sm:text-[11px] font-black rounded-xs shrink-0 whitespace-nowrap shadow-sm inline-flex items-center gap-1">
            <Download className="w-3 h-3 stroke-[2.75] shrink-0" />
            <span>{langCode === 'hi' ? 'इंस्टॉल' : 'Install'}</span>
          </span>
        </div>
        {renderGuideModal()}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-slate-950 bg-emerald-400 hover:bg-emerald-300 border border-emerald-300 text-[11px] font-bold cursor-pointer shadow-xs transition-all active:scale-95 whitespace-nowrap shrink-0"
        title={langCode === 'hi' ? 'Politics World मोबाइल ऐप इंस्टॉल करें' : 'Install Politics World App'}
      >
        <Smartphone className="w-3 h-3 shrink-0 stroke-[2.5]" />
        <span>{buttonLabel}</span>
      </button>
      {renderGuideModal()}
    </>
  );
};
