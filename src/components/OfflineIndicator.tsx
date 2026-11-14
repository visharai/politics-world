import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useLanguage } from '../context/LanguageContext';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { langCode } = useLanguage();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-sm bg-amber-600 border border-amber-400/60 px-3 py-1.5 text-xs font-semibold text-white shadow-lg"
    >
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>
        {langCode === 'hi'
          ? 'ऑफलाइन मोड — सहेजी गई खबरें उपलब्ध हैं'
          : 'Offline Mode — Cached editions available'}
      </span>
    </div>
  );
};
