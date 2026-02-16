/**
 * Animation constants and utilities
 * [From]: specs/012-ui-redesign/tasks.md - T-003
 *
 * Provides centralized animation configuration following the
 * "Subtle & Smooth" design principle (200-300ms durations).
 */

/**
 * Animation durations in milliseconds
 */
export const DURATION = {
  fast: 150,
  normal: 250,
  slow: 350,
} as const;

/**
 * Easing functions (cubic-bezier)
 */
export const EASING = {
  out: 'cubic-bezier(0.16, 1, 0.3, 1)' as const,
  inOut: 'cubic-bezier(0.65, 0, 0.35, 1)' as const,
  in: 'cubic-bezier(0.35, 0, 0.65, 0)' as const,
} as const;

/**
 * Transition string generator
 */
export function transition(
  property: string,
  duration: keyof typeof DURATION = 'normal',
  easing: keyof typeof EASING = 'out'
): string {
  return `${property} ${DURATION[duration]}ms ${EASING[easing]}`;
}

/**
 * Multi-property transition generator
 */
export function transitions(
  properties: string[],
  duration: keyof typeof DURATION = 'normal',
  easing: keyof typeof EASING = 'out'
): string {
  return properties.map(p => transition(p, duration, easing)).join(', ');
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation duration (respects reduced motion preference)
 */
export function getDuration(duration: keyof typeof DURATION = 'normal'): number {
  return prefersReducedMotion() ? 0 : DURATION[duration];
}

/**
 * Animation variants for Framer Motion (if added)
 */
export const variants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
} as const;

/**
 * Stagger children animation delay
 */
export function staggerDelay(index: number, baseDelay: number = 50): number {
  return index * baseDelay;
}

/**
 * CSS transition utility classes mapping
 */
export const TRANSITION_CLASSES = {
  'transition-fast': 'transition-all duration-150 ease-out',
  'transition-normal': 'transition-all duration-250 ease-out',
  'transition-slow': 'transition-all duration-350 ease-out',
  'transition-in-out': 'transition-all duration-250 ease-in-out',
} as const;

/**
 * Animation utility classes
 */
export const ANIMATION_CLASSES = {
  'animate-fade-in': 'animate-fadeIn',
  'animate-slide-up': 'animate-slideInUp',
  'animate-scale-in': 'animate-scaleIn',
} as const;

/**
 * Spring animations (for Framer Motion)
 */
export const spring = {
  stiffness: 300,
  damping: 30,
  mass: 0.8,
} as const;
