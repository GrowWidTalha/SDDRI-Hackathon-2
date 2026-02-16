/**
 * HeroSection Component
 * [From]: specs/012-ui-redesign/tasks.md - T-011
 *
 * Landing page hero section with problem statement headline,
 * supporting copy, illustration, and CTA buttons. Features gradient text.
 */

'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/design-system';

export interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section
      className={cn(
        'relative min-h-screen flex items-center justify-center',
        'px-4 sm:px-6 lg:px-8',
        'overflow-hidden',
        className
      )}
    >
      {/* Background gradient mesh */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                AI-Powered Task Management
              </span>
            </div>

            {/* Headline */}
            <h1 className="display-text text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
              <span className="block text-foreground">
                Stop Drowning in
              </span>
              <span className="block gradient-text mt-2">
                Task Chaos
              </span>
            </h1>

            {/* Supporting copy */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Transform your productivity with intelligent task management.
              Let AI help you organize, prioritize, and accomplish more with less stress.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/register">
                <button
                  className={cn(
                    'group relative inline-flex items-center gap-2',
                    'px-8 py-4 rounded-full',
                    'bg-gradient-to-r from-primary to-accent',
                    'text-primary-foreground font-semibold',
                    'hover:shadow-lg hover:shadow-primary/25',
                    'transition-all duration-250 ease-out',
                    'hover:scale-105'
                  )}
                >
                  Get Started Free
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <Link href="/login">
                <button
                  className={cn(
                    'inline-flex items-center gap-2',
                    'px-8 py-4 rounded-full',
                    'glass hover:bg-card/70',
                    'text-foreground font-semibold',
                    'border border-glass-border',
                    'transition-all duration-250 ease-out',
                    'hover:scale-105'
                  )}
                >
                  Sign In
                </button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="pt-8">
              <p className="text-sm text-muted-foreground mb-4">
                Join thousands of productive users
              </p>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                {/* Fake user avatars */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-background flex items-center justify-center text-xs font-semibold text-foreground"
                    style={{ transform: `translateX(-${i * 8}px)` }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Illustration */}
          <div className="relative hidden lg:block">
            {/* Abstract illustration composed of UI elements */}
            <div className="relative">
              {/* Main card */}
              <GlassCard
                blur="lg"
                border
                shadow="lg"
                className="relative p-6 rounded-2xl animate-float"
              >
                <div className="space-y-4">
                  {/* Fake task items */}
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-xl',
                        'bg-card/30 border border-glass-border',
                        'transition-all duration-250 hover:bg-card/50'
                      )}
                    >
                      <div className="h-5 w-5 rounded-full bg-gradient-to-br from-primary to-accent" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-foreground/20 rounded w-3/4" />
                        <div className="h-2 bg-foreground/10 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Chat bubble */}
                <div className="absolute -bottom-4 -right-4 glass p-4 rounded-xl border border-glass-border shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">AI Assistant</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "I've organized 12 tasks for today..."
                  </p>
                </div>
              </GlassCard>

              {/* Floating decoration elements */}
              <div className="absolute -top-8 -right-8 w-16 h-16 bg-accent/20 rounded-full blur-2xl animate-pulse" />
              <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-pulse delay-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
        <span className="text-sm">Scroll to learn more</span>
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}

/**
 * Floating animation for hero card
 */
const styles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
