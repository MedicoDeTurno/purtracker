import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';

const THEME_KEY = 'pur_tracker_theme';

export function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
  } catch (e) {
    console.warn('Failed to read theme from localStorage:', e);
  }
  return 'system';
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && systemPrefersDark);

  if (isDark) {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }

  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    console.warn('Failed to save theme to localStorage:', e);
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = getInitialTheme();
    return initial === 'dark' || (initial === 'system' && systemPrefersDark) ? 'dark' : 'light';
  });

  useEffect(() => {
    applyTheme(theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const isDark = mediaQuery.matches;
        applyTheme('system');
        setResolvedTheme(isDark ? 'dark' : 'light');
      }
    };

    const isDark = theme === 'dark' || (theme === 'system' && mediaQuery.matches);
    setResolvedTheme(isDark ? 'dark' : 'light');

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    // If currently dark (resolved), switch to light. If light, switch to dark.
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return { theme, resolvedTheme, setTheme, toggleTheme };
}
