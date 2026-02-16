/**
 * Theme management utilities
 * [From]: specs/012-ui-redesign/tasks.md - T-004
 *
 * Provides SSR-safe theme management with localStorage persistence.
 * Supports Deep Rich Dark (default) and Light themes.
 */

'use client';

import { useCallback, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

const THEME_KEY = 'app-theme';
const DEFAULT_THEME: Theme = 'dark'; // Deep Rich Dark is default

/**
 * Get initial theme with SSR safety
 */
export function getInitialTheme(): Theme {
  // Prevent hydration mismatch by checking if we're on server
  if (typeof window === 'undefined') {
    return DEFAULT_THEME;
  }

  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
  } catch {
    // localStorage might not be available
  }

  // Check system preference as fallback
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }

  return DEFAULT_THEME;
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Remove both classes first
  root.classList.remove('light', 'dark');

  // Add the appropriate class
  if (theme === 'light') {
    root.classList.add('light');
  } else {
    // Default to dark (Deep Rich Dark)
    // No class needed since :root has dark colors
  }

  // Update data attribute for potential CSS targeting
  root.setAttribute('data-theme', theme);
}

/**
 * Save theme to localStorage
 */
export function saveTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // localStorage might not be available (private mode, etc.)
  }
}

/**
 * Theme hook for React components
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount (client-side only)
  useEffect(() => {
    const initialTheme = getInitialTheme();
    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  // Toggle theme function
  const toggleTheme = useCallback(() => {
    const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setThemeState(newTheme);
    applyTheme(newTheme);
    saveTheme(newTheme);
  }, [theme]);

  // Set specific theme
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    saveTheme(newTheme);
  }, []);

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    mounted, // True after initial client-side render
  };
}

/**
 * Theme provider component props
 */
export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

/**
 * Get theme from cookie (for SSR)
 */
export function getThemeFromCookie(): Theme | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  const themeCookie = cookies.find(cookie =>
    cookie.trim().startsWith('theme=')
  );

  if (themeCookie) {
    const value = themeCookie.split('=')[1]?.trim();
    if (value === 'dark' || value === 'light') {
      return value;
    }
  }

  return null;
}

/**
 * Set theme cookie (for SSR hydration)
 */
export function setThemeCookie(theme: Theme): void {
  if (typeof document === 'undefined') return;

  const maxAge = 60 * 60 * 24 * 365; // 1 year
  document.cookie = `theme=${theme}; max-age=${maxAge}; path=/; SameSite=Lax`;
}

/**
 * Listen for system theme changes
 */
export function listenSystemThemeChanges(callback: (theme: Theme) => void): (() => void) | null {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return null;
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleChange = (e: MediaQueryListEvent) => {
    // Only apply if user hasn't set a preference
    if (!localStorage.getItem(THEME_KEY)) {
      callback(e.matches ? 'dark' : 'light');
    }
  };

  mediaQuery.addEventListener('change', handleChange);

  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
}
