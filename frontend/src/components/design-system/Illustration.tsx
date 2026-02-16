/**
 * Illustration Component
 * [From]: specs/012-ui-redesign/tasks.md - T-007
 *
 * Empty state illustrations using SVG compositions (Lucide icon combinations).
 * Types: no-tasks, no-results, error, success with size variants.
 */

'use client';

import {
  CheckSquare2,
  ClipboardX,
  AlertCircle,
  ClipboardCheck,
  FileStack,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type IllustrationType = 'no-tasks' | 'no-results' | 'error' | 'success';

export interface IllustrationProps {
  type: IllustrationType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
} as const;

const illustrationConfig: Record<
  IllustrationType,
  {
    icon: LucideIcon;
    secondaryIcon?: LucideIcon;
    label: string;
    color: string;
  }
> = {
  'no-tasks': {
    icon: CheckSquare2,
    label: 'No tasks',
    color: 'text-primary',
  },
  'no-results': {
    icon: FileStack,
    secondaryIcon: ClipboardX,
    label: 'No results found',
    color: 'text-muted-foreground',
  },
  error: {
    icon: AlertCircle,
    label: 'Something went wrong',
    color: 'text-destructive',
  },
  success: {
    icon: ClipboardCheck,
    secondaryIcon: Sparkles,
    label: 'Success!',
    color: 'text-primary',
  },
};

export function Illustration({
  type,
  size = 'md',
  className,
}: IllustrationProps) {
  const config = illustrationConfig[type];
  const Icon = config.icon;
  const SecondaryIcon = config.secondaryIcon;

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      {/* Icon */}
      <div className={cn('relative', sizeClasses[size], 'flex items-center justify-center')}>
        {/* Background glow */}
        <div
          className={cn(
            'absolute inset-0 rounded-full blur-2xl opacity-20',
            type === 'error' && 'bg-destructive',
            type === 'no-tasks' && 'bg-primary',
            type === 'success' && 'bg-primary'
          )}
        />

        {/* Main icon */}
        <Icon className={cn(
          'relative z-10',
          sizeClasses[size],
          config.color,
          'opacity-80'
        )} />

        {/* Secondary icon (for some illustrations) */}
        {SecondaryIcon && (
          <SecondaryIcon
            className={cn(
              'absolute -bottom-2 -right-2',
              'w-2/3 h-2/3',
              'text-accent opacity-60'
            )}
          />
        )}
      </div>

      {/* Label */}
      <p className="text-sm font-medium text-muted-foreground">
        {config.label}
      </p>
    </div>
  );
}

/**
 * Empty state wrapper component
 */
export interface EmptyStateProps {
  type: IllustrationType;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  type,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4', className)}>
      <Illustration type={type} size="lg" />
      <h3 className="mt-6 text-xl font-semibold text-foreground">
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-muted-foreground text-center max-w-md">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
