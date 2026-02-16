/**
 * Design System Components
 * [From]: specs/012-ui-redesign/
 *
 * Core reusable components for the Glassmorphism/Modern UI design.
 */

export { GlassCard, GlassCardHeader, GlassCardContent, GlassCardFooter, GlassPanel } from './GlassCard';
export type { GlassCardProps } from './GlassCard';

export { ThemeProvider, useTheme, ThemeScript } from './ThemeProvider';
export type { ThemeProviderProps } from './ThemeProvider';

export { ThemeToggle, CompactThemeToggle } from './ThemeToggle';
export type { ThemeToggleProps } from './ThemeToggle';

export { FloatingDock } from './FloatingDock';
export type { FloatingDockProps, DockItem } from './FloatingDock';

export { Illustration, EmptyState } from './Illustration';
export type { IllustrationProps, EmptyStateProps } from './Illustration';

export { MultiStepForm } from './MultiStepForm';
export type { MultiStepFormProps, FormStep, FormField } from './MultiStepForm';

