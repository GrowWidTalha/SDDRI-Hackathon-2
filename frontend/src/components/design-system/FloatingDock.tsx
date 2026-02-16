/**
 * FloatingDock Component
 * [From]: specs/012-ui-redesign/tasks.md - T-008
 *
 * macOS-style centered floating navigation dock that appears on scroll.
 * Features glassmorphism effect, tooltips, and keyboard navigation.
 */

'use client';

import { Home, CheckSquare, MessageSquare, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useCallback, type ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { GlassCard } from './GlassCard';
import { CompactThemeToggle } from './ThemeToggle';

export interface DockItem {
  icon: ReactNode;
  label: string;
  href: string;
  activePattern?: RegExp;
}

const DEFAULT_DOCK_ITEMS: DockItem[] = [
  {
    icon: <Home className="h-5 w-5" />,
    label: 'Dashboard',
    href: '/dashboard',
    activePattern: /^\/dashboard/,
  },
  {
    icon: <CheckSquare className="h-5 w-5" />,
    label: 'Tasks',
    href: '/tasks',
    activePattern: /^\/tasks/,
  },
  {
    icon: <MessageSquare className="h-5 w-5" />,
    label: 'Chat',
    href: '/chat',
    activePattern: /^\/chat/,
  },
  {
    icon: <Settings className="h-5 w-5" />,
    label: 'Settings',
    href: '/settings',
    activePattern: /^\/settings/,
  },
];

export interface FloatingDockProps {
  /**
   * Navigation items
   */
  items?: DockItem[];

  /**
   * Position on screen
   */
  position?: 'bottom' | 'top';

  /**
   * Show dock on scroll (otherwise always visible)
   */
  showOnScroll?: boolean;

  /**
   * Scroll threshold before showing dock (in pixels)
   */
  scrollThreshold?: number;

  /**
   * Include theme toggle
   */
  includeThemeToggle?: boolean;

  /**
   * Additional class name
   */
  className?: string;
}

export function FloatingDock({
  items = DEFAULT_DOCK_ITEMS,
  position = 'bottom',
  showOnScroll = true,
  scrollThreshold = 50,
  includeThemeToggle = true,
  className,
}: FloatingDockProps) {
  const [isVisible, setIsVisible] = useState(!showOnScroll);
  const [scrollY, setScrollY] = useState(0);
  const pathname = usePathname();

  // Scroll detection
  useEffect(() => {
    if (!showOnScroll) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const isScrollingDown = currentScrollY > scrollY;
          const hasScrolledEnough = currentScrollY > scrollThreshold;

          setIsVisible(isScrollingDown && hasScrolledEnough);
          setScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showOnScroll, scrollThreshold, scrollY]);

  // Determine active item
  const getActiveIndex = useCallback(() => {
    return items.findIndex(item => item.activePattern?.test(pathname));
  }, [items, pathname]);

  const activeIndex = getActiveIndex();

  return (
    <div
      className={cn(
        'fixed left-1/2 -translate-x-1/2 z-50',
        'transition-all duration-500 ease-out',
        // Position
        position === 'bottom' ? 'bottom-6' : 'top-6',
        // Visibility
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none',
        className
      )}
    >
      <GlassCard
        blur="md"
        border
        shadow="lg"
        className={cn(
          'flex items-center gap-1 sm:gap-2 px-2 py-2',
          'rounded-full'
        )}
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <DockItem
              key={item.href}
              {...item}
              isActive={isActive}
              position={index}
            />
          );
        })}

        {/* Divider */}
        {includeThemeToggle && (
          <div className="w-px h-6 bg-glass-border mx-1" />
        )}

        {/* Theme Toggle */}
        {includeThemeToggle && (
          <div className="relative group/dock">
            <CompactThemeToggle className="dock-icon" />
            <span className="dock-tooltip">
              Toggle Theme
            </span>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

interface DockItemProps extends DockItem {
  isActive: boolean;
  position: number;
}

function DockItem({ icon, label, href, isActive, position }: DockItemProps) {
  return (
    <div className="relative group/dock">
      <Link
        href={href}
        className={cn(
          'dock-icon',
          'relative flex items-center justify-center',
          'w-10 h-10 sm:w-11 sm:h-11',
          'rounded-full',
          'transition-all duration-250 ease-out',
          // Active state
          isActive
            ? 'bg-primary/20 text-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
        )}
        aria-label={label}
        aria-current={isActive ? 'page' : undefined}
      >
        {icon}

        {/* Active indicator */}
        {isActive && (
          <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
        )}
      </Link>

      {/* Tooltip */}
      <span className="dock-tooltip">
        {label}
      </span>
    </div>
  );
}

/**
 * Floating dock styles
 */
const dockStyles = `
  .dock-icon {
    position: relative;
  }

  .dock-tooltip {
    position: absolute;
    bottom: calc(100% + 12px);
    left: 50%;
    transform: translateX(-50%) scale(0.9);
    padding: 6px 12px;
    background: var(--popover);
    color: var(--popover-foreground);
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    border-radius: 6px;
    border: 1px solid var(--glass-border);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    opacity: 0;
    pointer-events: none;
    transition: all 150ms ease-out;
    transform-origin: bottom center;
  }

  .group\\/dock:hover .dock-tooltip {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }

  /* Show tooltip after delay */
  .dock-tooltip {
    transition-delay: 300ms;
  }

  /* Skip to main content link for accessibility */
  .skip-to-content {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    padding: 8px 16px;
    background: var(--background);
    color: var(--foreground);
    border: 1px solid var(--border);
    border-radius: 0 0 8px 0;
    transform: translateY(-100%);
    transition: transform 150ms ease-out;
  }

  .skip-to-content:focus {
    transform: translateY(0);
  }
`;
