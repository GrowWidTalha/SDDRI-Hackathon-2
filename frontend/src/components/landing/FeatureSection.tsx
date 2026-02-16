/**
 * FeatureSection Component
 * [From]: specs/012-ui-redesign/tasks.md - T-012
 *
 * Feature showcase section with grid layout, GlassCard styling,
 * icon + title + description, and hover effects.
 */

'use client';

import { Brain, Sparkles, Zap, Shield, LayoutGrid, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/design-system';

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Brain className="h-6 w-6" />,
    title: 'AI-Powered Organization',
    description: 'Let artificial intelligence analyze your tasks and suggest optimal organization strategies.',
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: 'Smart Prioritization',
    description: 'Automatically identify urgent and important tasks based on deadlines and context.',
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Lightning Fast',
    description: 'Instant task creation and updates with our streamlined interface.',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Secure & Private',
    description: 'Your data is encrypted and protected. We never sell your information.',
  },
  {
    icon: <LayoutGrid className="h-6 w-6" />,
    title: 'Beautiful Dashboard',
    description: 'Modern glassmorphism design that adapts to your workflow.',
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: 'Works Everywhere',
    description: 'Access your tasks from any device with our responsive design.',
  },
];

export interface FeatureSectionProps {
  className?: string;
}

export function FeatureSection({ className }: FeatureSectionProps) {
  return (
    <section
      className={cn(
        'py-24 px-4 sm:px-6 lg:px-8',
        'relative',
        className
      )}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="display-text text-3xl sm:text-4xl font-semibold mb-4">
            Everything you need to
            <span className="gradient-text"> stay organized</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you accomplish more with less stress.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps extends Feature {
  index: number;
}

function FeatureCard({ icon, title, description, index }: FeatureCardProps) {
  return (
    <GlassCard
      blur="md"
      border
      hover
      className={cn(
        'p-6 rounded-2xl group',
        'animate-on-scroll'
      )}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Icon */}
      <div className={cn(
        'w-12 h-12 rounded-xl',
        'bg-gradient-to-br from-primary/20 to-accent/20',
        'flex items-center justify-center',
        'text-primary mb-4',
        'group-hover:scale-110 transition-transform duration-250'
      )}>
        {icon}
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </GlassCard>
  );
}

/**
 * Scroll-triggered animation styles
 */
const scrollStyles = `
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
  }

  .animate-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = scrollStyles;
  document.head.appendChild(styleSheet);
}
