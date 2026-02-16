/**
 * GlassCard Component
 * [From]: specs/012-ui-redesign/tasks.md - T-005
 *
 * Base component for glassmorphism effect with configurable blur,
 * opacity, border, and shadow. Provides the signature design aesthetic.
 */

'use client';

import { cn } from '@/lib/utils';
import { forwardRef, type HTMLAttributes } from 'react';

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Backdrop blur amount
   * - sm: 8px (subtle, for mobile)
   * - md: 12px (default, balanced)
   * - lg: 16px (strong, for desktop overlays)
   */
  blur?: 'sm' | 'md' | 'lg';

  /**
   * Background opacity (0-1)
   * Lower values = more transparent
   */
  opacity?: number;

  /**
   * Show subtle border
   */
  border?: boolean;

  /**
   * Shadow depth
   * - sm: subtle
   * - md: medium (default)
   * - lg: strong
   */
  shadow?: 'sm' | 'md' | 'lg';

  /**
   * Hover effect
   */
  hover?: boolean;

  /**
   * Clickable appearance (cursor pointer, hover state)
   */
  clickable?: boolean;
}

const blurClasses = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
} as const;

const shadowClasses = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
} as const;

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className,
      blur = 'md',
      opacity = 0.6,
      border = true,
      shadow = 'md',
      hover = false,
      clickable = false,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base glassmorphism effect
          'bg-card/60',
          blurClasses[blur],
          // Border
          border && 'border border-glass-border',
          // Shadow
          shadowClasses[shadow],
          // Hover states
          hover && 'hover:bg-card/70 hover:shadow-lg transition-all duration-250',
          hover && 'hover:border-glass-border/50',
          // Clickable
          clickable && 'cursor-pointer',
          clickable && 'hover:scale-[1.02] active:scale-[0.98]',
          // Transitions
          'transition-all duration-250 ease-out',
          // Rounded corners
          'rounded-xl',
          className
        )}
        style={{
          // Custom opacity for more control
          backgroundColor: `var(--card)`,
          backdropFilter: `blur(${blur === 'sm' ? 8 : blur === 'lg' ? 16 : 12}px)`,
          WebkitBackdropFilter: `blur(${blur === 'sm' ? 8 : blur === 'lg' ? 16 : 12}px)`,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

/**
 * GlassCard variants for common use cases
 */
export const GlassCardHeader = forwardRef<HTMLDivElement, GlassCardProps>(
  (props, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4 border-b border-glass-border', props.className)}
      {...props}
    />
  )
);

GlassCardHeader.displayName = 'GlassCardHeader';

export const GlassCardContent = forwardRef<HTMLDivElement, GlassCardProps>(
  (props, ref) => (
    <div
      ref={ref}
      className={cn('p-6', props.className)}
      {...props}
    />
  )
);

GlassCardContent.displayName = 'GlassCardContent';

export const GlassCardFooter = forwardRef<HTMLDivElement, GlassCardProps>(
  (props, ref) => (
    <div
      ref={ref}
      className={cn(
        'px-6 py-4 border-t border-glass-border flex items-center',
        props.className
      )}
      {...props}
    />
  )
);

GlassCardFooter.displayName = 'GlassCardFooter';

/**
 * GlassPanel - Full-width glass section
 */
export const GlassPanel = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, blur = 'lg', ...props }, ref) => (
    <GlassCard
      ref={ref}
      blur={blur}
      className={cn('w-full rounded-2xl', className)}
      {...props}
    />
  )
);

GlassPanel.displayName = 'GlassPanel';
