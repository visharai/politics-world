import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const THEME_STORAGE_KEY = 'politics_world_theme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(THEME_STORAGE_KEY);
        if (saved === 'light' || saved === 'dark') {
          return saved;
        }
      }
    } catch {
      // ignore
    }
    return 'dark';
  });

  const applyThemeToDOM = (nextTheme: ThemeMode) => {
    try {
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const root = document.documentElement;
        const body = document.body;

        root.setAttribute('data-theme', nextTheme);
        body.setAttribute('data-theme', nextTheme);
        root.style.colorScheme = nextTheme;

        if (nextTheme === 'light') {
          root.classList.add('light');
          root.classList.remove('dark');
          body.classList.add('light');
          body.classList.remove('dark');
        } else {
          root.classList.add('dark');
          root.classList.remove('light');
          body.classList.add('dark');
          body.classList.remove('light');
        }

        // Update meta theme-color for mobile address bars
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
          meta.setAttribute('content', nextTheme === 'light' ? '#f8fafc' : '#060c1d');
        }

        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);

        // Notify any non-react listeners
        window.dispatchEvent(new CustomEvent('politics-theme-changed', { detail: { theme: nextTheme } }));
      }
    } catch (e) {
      console.warn('Error applying theme:', e);
    }
  };

  const setTheme = (newTheme: ThemeMode) => {
    applyThemeToDOM(newTheme);
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    const next: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
