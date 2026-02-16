/**
 * StorySection Components
 * [From]: specs/012-ui-redesign/tasks.md - T-013
 *
 * Narrative sections with illustration + text layout and
 * scroll-triggered fade-in animations.
 */

'use client';

import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/design-system';
import type { LucideIcon } from 'lucide-react';

export interface StorySectionProps {
  /**
   * Section title/heading
   */
  title: string;

  /**
   * Section description/narrative
   */
  description: string;

  /**
   * Icon for the illustration
   */
  icon: LucideIcon;

  /**
   * Layout direction
   */
  layout?: 'left' | 'right';

  /**
   * Additional class name
   */
  className?: string;
}

export function StorySection({
  title,
  description,
  icon: Icon,
  layout = 'left',
  className,
}: StorySectionProps) {
  const isReverse = layout === 'right';

  return (
    <section
      className={cn(
        'py-24 px-4 sm:px-6 lg:px-8',
        'relative overflow-hidden',
        className
      )}
    >
      {/* Background accent */}
      <div
        className={cn(
          'absolute top-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20',
          isReverse ? 'right-0' : 'left-0',
          isReverse ? 'bg-accent' : 'bg-primary'
        )}
      />

      <div className="max-w-7xl mx-auto">
        <div
          className={cn(
            'grid lg:grid-cols-2 gap-12 items-center',
            isReverse && 'lg:flex-row-reverse'
          )}
        >
          {/* Content */}
          <div
            className={cn(
              'space-y-6',
              isReverse ? 'lg:order-2' : 'lg:order-1',
              'animate-on-scroll'
            )}
          >
            <div className="inline-flex items-center gap-2 w-fit">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary">The Problem</span>
            </div>

            <h2 className="display-text text-3xl sm:text-4xl font-semibold leading-tight">
              {title}
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {/* Illustration */}
          <div
            className={cn(
              'relative',
              isReverse ? 'lg:order-1' : 'lg:order-2',
              'animate-on-scroll',
              'delay-200'
            )}
          >
            <GlassCard
              blur="lg"
              border
              shadow="lg"
              className="p-8 rounded-2xl aspect-square flex items-center justify-center"
            >
              <Icon className="h-32 w-32 text-primary/50" />
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * SolutionStorySection - for the solution narrative
 */
export function SolutionStorySection({ className }: { className?: string }) {
  return (
    <StorySection
      title="Your AI-Powered Productivity Partner"
      description="Experience a new way to manage tasks. Our intelligent system learns your preferences, automates organization, and helps you focus on what truly matters. No more overwhelming lists or forgotten deadlines."
      icon={() => (
        // Custom sparkles icon
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-5.714-2.143L2 12l5.714-2.143L13 3z"
          />
        </svg>
      )}
      layout="right"
      className={className}
    />
  );
}

/**
 * ProblemStorySection - for the problem narrative
 */
export function ProblemStorySection({ className }: { className?: string }) {
  return (
    <StorySection
      title="Traditional Task Apps Are Overwhelming"
      description="You've tried them all - complex interfaces, endless features, and still feel behind. Your tasks pile up, priorities get confused, and important deadlines slip through the cracks. It's not your fault - the tools are working against you."
      icon={() => (
        // Custom chaos icon
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
      layout="left"
      className={className}
    />
  );
}
