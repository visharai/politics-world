import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { X } from 'lucide-react';
import { LiveAdSlotBanner } from './LiveAdSlotBanner';
import { AdSlotKey } from '../data/adSlotsConfig';

export interface TopLeaderboardAdProps {
  onOpenMonetizationHub?: () => void;
  onBookSlot?: (slotKey: AdSlotKey) => void;
}

export const TopLeaderboardAd: React.FC<TopLeaderboardAdProps> = ({
  onOpenMonetizationHub,
  onBookSlot,
}) => {
  const { langCode } = useLanguage();
  const { isDark } = useTheme();
  const [isDismissed, setIsDismissed] = useState(false);

  const handleBookHeader = (slotKey: AdSlotKey) => {
    if (onBookSlot) {
      onBookSlot(slotKey);
    } else {
      onOpenMonetizationHub?.();
    }
  };

  if (isDismissed) {
    return (
      <div
        className={`w-full border-b py-1 px-4 ${
          isDark ? 'bg-[#030612] border-[#111f42]' : 'bg-slate-100 border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>
            {langCode === 'hi'
              ? 'शीर्ष विज्ञापन स्थान छुपाया गया है'
              : 'Header Advertisement Collapsed'}
          </span>
          <button
            type="button"
            onClick={() => setIsDismissed(false)}
            className="text-amber-600 dark:text-amber-400 hover:underline font-sans font-semibold cursor-pointer text-xs"
          >
            {langCode === 'hi' ? 'विज्ञापन पुनः दिखाएं' : 'Show Ad Slot'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside
      aria-label="Header Leaderboard Advertisement"
      className={`w-full border-b transition-colors duration-200 ${
        isDark
          ? 'bg-[#030612] border-[#13234d] text-slate-200'
          : 'bg-[#f4f7fb] border-slate-200 text-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 relative">
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <LiveAdSlotBanner
              slotKey="header"
              variant="leaderboard"
              onBookSlot={handleBookHeader}
            />
          </div>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="mt-0.5 p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
            title={langCode === 'hi' ? 'छुपाएं' : 'Hide banner'}
            aria-label="Hide advertisement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
