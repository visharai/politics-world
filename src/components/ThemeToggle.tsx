import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = (props) => {
  const { t, langCode } = useLanguage();
  const { theme, isDark, toggleTheme } = useTheme();

  const currentTheme = props.theme ?? theme;
  const handleToggle = props.onToggleTheme ?? toggleTheme;
  const isDarkMode = currentTheme === 'dark';

  const label = isDarkMode
    ? langCode === 'hi' ? 'ब्राइट मोड' : 'Bright Mode'
    : langCode === 'hi' ? 'डार्क मोड' : 'Dark Mode';

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-[70] font-sans print:hidden">
      <button
        onClick={handleToggle}
        className={`group flex items-center gap-2 p-2 sm:px-3.5 sm:py-2.5 rounded-full border shadow-2xl transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-sky-400/50 ${
          isDarkMode
            ? 'bg-[#0a1532]/95 text-slate-100 border-[#1c2e5c] hover:border-sky-400 hover:text-white hover:bg-[#0f1f47]'
            : 'bg-white text-slate-900 border-slate-300 hover:border-sky-500 hover:text-sky-950 shadow-slate-300/80 hover:bg-slate-50'
        } backdrop-blur-md`}
        title={isDarkMode ? (t.brightMode || 'Switch to Bright Mode') : (t.darkMode || 'Switch to Dark Mode')}
        aria-label={isDarkMode ? 'Switch to Bright/Light Mode' : 'Switch to Dark Mode'}
      >
        <div
          className={`p-1.5 rounded-full transition-transform duration-300 group-hover:rotate-45 shrink-0 ${
            isDarkMode ? 'bg-sky-500/20 text-sky-400' : 'bg-amber-100 text-amber-600'
          }`}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 fill-sky-400/30" />
          ) : (
            <Moon className="w-4 h-4 fill-amber-500/30" />
          )}
        </div>

        <span className="hidden sm:inline text-xs font-bold tracking-wide select-none pr-1">
          {label}
        </span>
      </button>
    </div>
  );
};
