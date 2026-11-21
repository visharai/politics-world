import React from 'react';
import { Clock, Smartphone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PWAInstallButtonProps {
  variant?: 'header' | 'compact' | 'banner' | 'drawer';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { langCode } = useLanguage();
  const isHi = langCode === 'hi';

  const statusText = isHi ? 'ऐप · Coming Soon' : 'App · Coming Soon';

  if (variant === 'compact') {
    return (
      <span
        role="status"
        aria-disabled="true"
        className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-sm bg-[#0b1736] border border-amber-400/50 text-amber-300 font-sans font-bold uppercase tracking-tight select-none cursor-not-allowed whitespace-nowrap shrink-0 shadow-xs"
        title={isHi ? 'मोबाइल ऐप जल्द आ रहा है (Coming Soon)' : 'Mobile App Coming Soon'}
      >
        <Smartphone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
        <span className="sm:hidden flex flex-col items-start leading-[1.05]">
          <span className="text-[8px] font-black tracking-wider text-amber-400">
            {isHi ? 'ऐप (APP)' : 'APP'}
          </span>
          <span className="text-[8.5px] font-bold text-amber-200">
            Coming Soon
          </span>
        </span>
        <span className="hidden sm:inline text-[11px]">{statusText}</span>
      </span>
    );
  }

  if (variant === 'drawer') {
    return (
      <div
        aria-disabled="true"
        className="w-full p-2.5 rounded-sm flex items-center justify-between text-left text-xs text-amber-200 bg-[#0a1532] border border-amber-400/40 select-none cursor-not-allowed opacity-90"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src="/pwa-192x192.png"
            alt="Politics World App"
            className="w-8 h-8 rounded-xs border border-amber-400/50 shrink-0"
          />
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-amber-300 font-serif truncate">{statusText}</div>
            <div className="text-[10px] text-slate-300 font-sans truncate">
              {isHi ? 'मोबाइल ऐप जल्द आ रहा है' : 'Mobile App Launching Soon'}
            </div>
          </div>
        </div>
        <Clock className="w-4 h-4 text-amber-400 shrink-0" />
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div
        aria-disabled="true"
        className="w-full h-full p-2 sm:p-2.5 bg-[#0a1532] border border-amber-400/50 rounded-xs flex items-center justify-between gap-2 select-none cursor-not-allowed"
        title={statusText}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xs overflow-hidden border border-amber-400/50 shadow-xs bg-[#040816]">
            <img
              src="/pwa-192x192.png"
              alt="Politics World App"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-left min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] sm:text-xs font-serif font-black text-white truncate">
                {isHi ? 'POLITICS WORLD ऐप' : 'POLITICS WORLD APP'}
              </span>
            </div>
            <div className="text-[10px] text-amber-200 truncate font-sans font-medium">
              {isHi ? 'मोबाइल ऐप जल्द आ रहा है' : 'Mobile App Coming Soon'}
            </div>
          </div>
        </div>
        <span className="px-2.5 py-1.5 bg-amber-400/15 border border-amber-400/50 text-amber-300 text-[10px] sm:text-[11px] font-bold rounded-xs shrink-0 whitespace-nowrap inline-flex items-center gap-1">
          <Clock className="w-3 h-3 shrink-0" />
          <span>Coming Soon</span>
        </span>
      </div>
    );
  }

  return (
    <span
      role="status"
      aria-disabled="true"
      className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-amber-300 bg-[#0b1736] border border-amber-400/45 text-[11px] font-bold select-none cursor-not-allowed whitespace-nowrap shrink-0"
      title={isHi ? 'मोबाइल ऐप जल्द आ रहा है (Coming Soon)' : 'Mobile App Coming Soon'}
    >
      <Smartphone className="w-3 h-3 shrink-0 text-amber-400" />
      <span>{statusText}</span>
    </span>
  );
};

