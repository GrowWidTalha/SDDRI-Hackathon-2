/**
 * Theme Provider Component
 * [From]: specs/012-ui-redesign/tasks.md - T-004
 *
 * Provides theme context to the application with SSR-safe theme detection.
 * Wraps the entire app to enable theme switching.
 */

'use client';

import type { Theme } from '@/lib/theme';
import { applyTheme, getInitialTheme, getThemeFromCookie, listenSystemThemeChanges } from '@/lib/theme';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'app-theme',
}: ThemeProviderProps) {
  // Initialize with default to prevent hydration mismatch
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Client-side initialization
    setMounted(true);

    // Get initial theme from localStorage or cookie
    let initialTheme: Theme = defaultTheme;

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === 'dark' || stored === 'light') {
        initialTheme = stored;
      } else {
        const cookieTheme = getThemeFromCookie();
        if (cookieTheme) {
          initialTheme = cookieTheme;
        }
      }
    } catch {
      // localStorage or cookies might not be available
      initialTheme = getInitialTheme();
    }

    setThemeState(initialTheme);
    applyTheme(initialTheme);

    // Listen for system theme changes
    const cleanup = listenSystemThemeChanges((systemTheme) => {
      // Only apply if no user preference is stored
      try {
        if (!localStorage.getItem(storageKey)) {
          setThemeState(systemTheme);
          applyTheme(systemTheme);
        }
      } catch {
        // Ignore localStorage errors
      }
    });

    return cleanup;
  }, [storageKey, defaultTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);

    try {
      localStorage.setItem(storageKey, newTheme);
    } catch {
      // localStorage might not be available
    }
  };

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const value: ThemeContextValue = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    mounted,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * ThemeScript component for SSR theme injection
 * Prevents flash of wrong theme during initial page load
 */
export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var theme = localStorage.getItem('app-theme');
              if (!theme) {
                var cookieTheme = document.cookie
                  .split(';')
                  .find(function(c) { return c.trim().startsWith('theme='); });
                if (cookieTheme) {
                  theme = cookieTheme.split('=')[1];
                }
              }
              if (theme === 'light') {
                document.documentElement.classList.add('light');
              }
              document.documentElement.setAttribute('data-theme', theme || 'dark');
            } catch (e) {
              console.error('Theme initialization error:', e);
            }
          })();
        `,
      }}
    />
  );
}
