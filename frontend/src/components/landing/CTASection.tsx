/**
 * CTASection Component
 * [From]: specs/012-ui-redesign/tasks.md - T-014
 *
 * Final call-to-action section with strong headline, sign-up button,
 * minimal illustration, and gradient background.
 */

'use client';

import Link from 'next/link';
import { ArrowRight, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/design-system';

export interface CTASectionProps {
  className?: string;
}

export function CTASection({ className }: CTASectionProps) {
  return (
    <section
      className={cn(
        'py-24 px-4 sm:px-6 lg:px-8',
        'relative overflow-hidden',
        className
      )}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-foreground/5 via-transparent to-transparent" />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Main CTA card */}
        <GlassCard
          blur="lg"
          border
          shadow="lg"
          className="p-12 sm:p-16 rounded-3xl animate-on-scroll"
        >
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-6">
            <Rocket className="h-8 w-8 text-primary-foreground" />
          </div>

          {/* Headline */}
          <h2 className="display-text text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6">
            Ready to transform your
            <span className="gradient-text block mt-2">productivity?</span>
          </h2>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users who have already discovered a better way to manage their tasks.
            Start your free trial today - no credit card required.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <button
                className={cn(
                  'group relative inline-flex items-center gap-2',
                  'px-10 py-4 rounded-full',
                  'bg-gradient-to-r from-primary to-accent',
                  'text-primary-foreground font-semibold text-lg',
                  'hover:shadow-xl hover:shadow-primary/30',
                  'transition-all duration-250 ease-out',
                  'hover:scale-105'
                )}
              >
                Get Started Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <Link href="/login">
              <button
                className={cn(
                  'inline-flex items-center gap-2',
                  'px-10 py-4 rounded-full',
                  'glass hover:bg-card/70',
                  'text-foreground font-semibold text-lg',
                  'border border-glass-border',
                  'transition-all duration-250 ease-out',
                  'hover:scale-105'
                )}
              >
                Sign In
              </button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-glass-border">
            <p className="text-sm text-muted-foreground mb-4">
              Trusted by productive teams worldwide
            </p>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              {['Free Forever', 'No Credit Card', 'Cancel Anytime', 'Secure'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Decorative elements */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
    </section>
  );
}
