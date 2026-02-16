/**
 * ThemeToggle Component
 * [From]: specs/012-ui-redesign/tasks.md - T-006
 *
 * Button/switch component for toggling between light and dark themes.
 * Features smooth transition animation and accessible keyboard interaction.
 */

'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { cn } from '@/lib/utils';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

export interface ThemeToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant
   * - button: Icon button with tooltip (default)
   * - switch: Toggle switch style
   */
  variant?: 'button' | 'switch';

  /**
   * Show label text
   */
  showLabel?: boolean;

  /**
   * Custom size
   */
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
  lg: 'h-10 w-10',
} as const;

export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(
  (
    {
      className,
      variant = 'button',
      showLabel = false,
      size = 'md',
      ...props
    },
    ref
  ) => {
    const { theme, toggleTheme, mounted } = useTheme();

    // Don't render until mounted to prevent hydration mismatch
    if (!mounted) {
      return (
        <button
          ref={ref}
          className={cn(
            'rounded-md bg-muted',
            sizeClasses[size],
            className
          )}
          disabled
          {...props}
        />
      );
    }

    const isDark = theme === 'dark';

    if (variant === 'switch') {
      return (
        <button
          ref={ref}
          onClick={toggleTheme}
          className={cn(
            // Base styles
            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
            'transition-colors duration-300 ease-in-out',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            // Theme colors
            isDark ? 'bg-primary/20' : 'bg-muted',
            className
          )}
          aria-label="Toggle theme"
          aria-pressed={isDark}
          {...props}
        >
          <span
            className={cn(
              'pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0',
              'transition duration-300 ease-in-out',
              'flex items-center justify-center',
              isDark ? 'translate-x-5' : 'translate-x-0',
              isDark ? 'bg-primary' : 'bg-background'
            )}
          >
            {isDark ? (
              <Moon className="h-3 w-3 text-primary-foreground" strokeWidth={2.5} />
            ) : (
              <Sun className="h-3 w-3 text-foreground" strokeWidth={2.5} />
            )}
          </span>
        </button>
      );
    }

    // Button variant (default)
    return (
      <button
        ref={ref}
        onClick={toggleTheme}
        className={cn(
          // Base button styles
          'relative inline-flex items-center justify-center',
          'rounded-lg',
          'transition-all duration-300 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'hover:scale-110 active:scale-95',
          // Theme colors
          'bg-card/50 backdrop-blur-sm',
          'border border-glass-border',
          'hover:bg-card/70 hover:shadow-lg',
          sizeClasses[size],
          className
        )}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        {...props}
      >
        <div className="relative">
          {isDark ? (
            <Moon className="h-4 w-4 text-primary transition-transform duration-300 rotate-0 scale-100" />
          ) : (
            <Sun className="h-4 w-4 text-primary transition-transform duration-300 rotate-90 scale-100" />
          )}
        </div>

        {showLabel && (
          <span className="ml-2 text-sm font-medium">
            {isDark ? 'Dark' : 'Light'}
          </span>
        )}

        {/* Subtle glow effect */}
        <span
          className={cn(
            'absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300',
            'pointer-events-none',
            isDark && 'bg-primary/10'
          )}
        />
      </button>
    );
  }
);

ThemeToggle.displayName = 'ThemeToggle';

/**
 * Compact theme toggle for floating dock
 */
export const CompactThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(
  (props, ref) => (
    <ThemeToggle
      ref={ref}
      size="sm"
      className="rounded-full"
      {...props}
    />
  )
);

CompactThemeToggle.displayName = 'CompactThemeToggle';
