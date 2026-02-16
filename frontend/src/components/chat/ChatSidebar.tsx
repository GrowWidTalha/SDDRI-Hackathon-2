/**
 * ChatSidebar Component
 * [From]: specs/012-ui-redesign/tasks.md - T-026
 *
 * Persistent collapsible chat sidebar:
 * - Fixed left position
 * - Collapsed (60px) and expanded (300px) states
 * - Transform animation
 * - GlassCard styling
 * - Full screen on mobile
 * - Toggle button
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/design-system';
import { MessageCircle, X } from 'lucide-react';

export interface ChatSidebarProps {
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export function ChatSidebar({
  children,
  defaultExpanded = false,
  className,
}: ChatSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile &&
        isExpanded &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isExpanded]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isExpanded]);

  const toggleSidebar = () => setIsExpanded((prev) => !prev);

  return (
    <>
      {/* Desktop sidebar */}
      {!isMobile && (
        <div
          ref={sidebarRef}
          className={cn(
            'fixed left-4 top-4 bottom-20 z-40',
            'transition-all duration-300 ease-in-out',
            isExpanded ? 'w-[300px]' : 'w-[60px]'
          )}
        >
          <GlassCard
            blur="md"
            border
            className={cn(
              'h-full flex flex-col',
              'transition-all duration-300 ease-in-out'
            )}
          >
            {/* Toggle button */}
            <button
              onClick={toggleSidebar}
              className={cn(
                'flex items-center justify-center',
                'h-12 border-b border-glass-border',
                'text-muted-foreground hover:text-foreground',
                'transition-colors duration-200',
                'shrink-0'
              )}
              aria-label={isExpanded ? 'Collapse chat' : 'Expand chat'}
            >
              {isExpanded ? (
                <X className="w-5 h-5" />
              ) : (
                <MessageCircle className="w-5 h-5" />
              )}
            </button>

            {/* Content */}
            <div
              className={cn(
                'flex-1 overflow-hidden',
                'transition-all duration-300 ease-in-out',
                isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
              )}
            >
              {isExpanded && children}
            </div>
          </GlassCard>
        </div>
      )}

      {/* Mobile overlay */}
      {isMobile && isExpanded && (
        <div
          className={cn(
            'fixed inset-0 z-50',
            'bg-background/95 backdrop-blur-md',
            'flex flex-col'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-glass-border">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">AI Assistant</h2>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      )}

      {/* Mobile toggle button */}
      {isMobile && !isExpanded && (
        <button
          onClick={toggleSidebar}
          className={cn(
            'fixed bottom-24 right-4 z-40',
            'w-14 h-14 rounded-full',
            'bg-primary text-primary-foreground',
            'flex items-center justify-center',
            'shadow-lg hover:shadow-xl',
            'hover:scale-105 active:scale-95',
            'transition-all duration-200',
            'md:hidden'
          )}
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </>
  );
}
