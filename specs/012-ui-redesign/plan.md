# Implementation Plan: Complete UI/UX Redesign

**Feature**: 011-ui-redesign
**Created**: 2026-02-16
**Status**: Draft

## Architecture Overview

This redesign maintains the existing Next.js 16 App Router architecture but introduces significant changes to:

1. **Design System**: New theme variables, typography scale, glassmorphism utilities
2. **Component Library**: New base components (GlassCard, FloatingDock, MultiStepForm)
3. **Layout Structure**: Landing page, grid dashboard, persistent chat sidebar
4. **Navigation**: Floating island dock replacing/supplementing header navigation
5. **Theme System**: Deep Rich Dark default with light mode toggle

### Technology Stack

- **Framework**: Next.js 16.1.1 (App Router) - unchanged
- **UI Library**: React 19.2.3 - unchanged
- **Component Base**: Radix UI primitives - unchanged
- **Styling**: Tailwind CSS 4 - unchanged, with new theme extensions
- **Animations**: CSS transitions + Framer Motion (optional) for complex animations
- **Icons**: Lucide React - unchanged
- **State**: React hooks (useState, useSearchParams) - unchanged
- **Forms**: React Hook Form + Zod - unchanged

### New Dependencies (Consider Adding)

- `framer-motion`: For smooth animations and layout transitions
- `@dnd-kit/core` + `@dnd-kit/sortable`: For drag-and-drop grid functionality
- `react-use`: For additional hooks (throttle, debounce, localStorage)

## Component Hierarchy

```
src/
├── app/
│   ├── page.tsx                    # NEW: Story-driven landing page
│   ├── (auth)/
│   │   ├── login/page.tsx          # REDESIGN: Card-based multi-step login
│   │   └── register/page.tsx       # REDESIGN: Card-based multi-step register
│   ├── dashboard/
│   │   ├── layout.tsx              # MODIFY: Add persistent chat sidebar
│   │   └── page.tsx                # MODIFY: Grid dashboard layout
│   ├── tasks/page.tsx              # MODIFY: Grid view of tasks
│   └── chat/page.tsx               # MODIFY: Dedicated chat page (sidebar open)
│   ├── layout.tsx                  # MODIFY: Add theme provider
│   └── globals.css                 # MODIFY: New theme variables
│
├── components/
│   ├── design-system/              # NEW: Design system components
│   │   ├── GlassCard.tsx           # NEW: Glassmorphism card base
│   │   ├── FloatingDock.tsx        # NEW: macOS-style floating nav
│   │   ├── ThemeToggle.tsx         # NEW: Light/dark theme toggle
│   │   ├── MultiStepForm.tsx       # NEW: Card-based multi-step form wrapper
│   │   └── Illustration.tsx        # NEW: Empty state illustrations
│   ├── dashboard/
│   │   ├── TaskGrid.tsx            # NEW: Grid container for task cards
│   │   └── TaskBoardCard.tsx       # NEW: Square board-style task card
│   ├── landing/                    # NEW: Landing page components
│   │   ├── HeroSection.tsx
│   │   ├── FeatureSection.tsx
│   │   ├── StorySection.tsx
│   │   └── CTASection.tsx
│   ├── chat/
│   │   ├── ChatSidebar.tsx         # NEW: Persistent sidebar wrapper
│   │   └── TaskChat.tsx            # MODIFY: Remove wrapper, use in sidebar
│   ├── auth/
│   │   ├── LoginForm.tsx           # MODIFY: Multi-step card design
│   │   └── RegisterForm.tsx        # MODIFY: Multi-step card design
│   └── tasks/
│       ├── TaskForm.tsx            # MODIFY: Multi-step card design
│       └── (existing task components - mostly unchanged)
│
├── lib/
│   ├── theme.ts                    # NEW: Theme utilities and persistence
│   └── animations.ts               # NEW: Animation constants and variants
│
└── styles/
    └── themes.css                  # NEW: Theme-specific CSS (if needed)
```

## Data Flow

### Theme State Flow

```
User Action (Toggle)
    ↓
Theme Toggle Component
    ↓
Update localStorage + CSS variable class
    ↓
All components react to CSS variable changes
```

### Grid Dashboard State Flow

```
Server Component (dashboard/page.tsx)
    ↓ Fetch tasks server-side
    ↓ Pass to TaskGrid (Client Component)
    ↓ TaskGrid manages:
    - Grid layout state (columns)
    - Drag-and-drop state
    - Filter/sort state (URL params)
    ↓ Pass to TaskBoardCard components
```

### Chat Sidebar State Flow

```
Root Layout (ChatProvider)
    ↓ Manages global chat state
    ↓ ChatSidebar component
    - Open/closed state
    - Conversation history
    - Toggle visibility
    ↓ TaskChat component (existing, adapted)
```

## Component Specifications

### 1. GlassCard Component

**Purpose**: Base component for glassmorphism effect

**Props**:
```typescript
interface GlassCardProps {
  children: React.ReactNode;
  blur?: 'sm' | 'md' | 'lg';  // Backdrop blur amount
  opacity?: number;           // Background opacity (0-1)
  border?: boolean;           // Show subtle border
  shadow?: 'sm' | 'md' | 'lg'; // Shadow depth
  className?: string;
}
```

**Implementation**:
- Uses Tailwind's `backdrop-blur-{size}` utilities
- CSS variables for opacity and background color
- Responsive blur values (smaller on mobile)

### 2. FloatingDock Component

**Purpose**: macOS-style centered floating navigation

**Props**:
```typescript
interface FloatingDockProps {
  items: DockItem[];
  position?: 'bottom' | 'top';
  showOnScroll?: boolean;
}

interface DockItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}
```

**Implementation**:
- Fixed positioning, centered horizontally
- Scroll event listener to show/hide
- Transform animations for smooth appearance
- GlassCard component for dock background
- Tooltips on hover (delayed)

### 3. ThemeToggle Component

**Purpose**: Switch between light and dark themes

**Props**:
```typescript
interface ThemeToggleProps {
  variant?: 'button' | 'switch';
  showLabel?: boolean;
}
```

**Implementation**:
- Reads from `localStorage` on mount
- Toggles `.light` or `.dark` class on `<html>`
- Uses CSS variables for theme colors
- Smooth transition (300ms)

### 4. MultiStepForm Component

**Purpose**: Wrapper for card-based multi-step forms

**Props**:
```typescript
interface MultiStepFormProps<T> {
  steps: FormStep<T>[];
  onSubmit: (data: T) => Promise<void>;
  initialData?: Partial<T>;
}

interface FormStep<T> {
  title: string;
  fields: React.ReactNode;
  validation: z.ZodSchema<Partial<T>>;
}
```

**Implementation**:
- Manages current step state
- Progress indicator at top
- Slide animations between steps
- Data accumulation across steps
- Final validation on submit

### 5. TaskGrid Component

**Purpose**: Grid container for task board cards

**Props**:
```typescript
interface TaskGridProps {
  tasks: Task[];
  columns?: 1 | 2 | 3 | 4;
  sortable?: boolean;
  onReorder?: (tasks: Task[]) => void;
}
```

**Implementation**:
- CSS Grid with responsive columns
- @dnd-kit for drag-and-drop
- Animates position changes
- Persists column preference

### 6. TaskBoardCard Component

**Purpose**: Square board-style task card

**Props**:
```typescript
interface TaskBoardCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}
```

**Implementation**:
- Square aspect ratio (1:1)
- Glassmorphism effect
- Hover reveals quick actions
- Status indicator (urgency border)
- Priority badge overlay

### 7. ChatSidebar Component

**Purpose**: Persistent collapsible sidebar for chat

**Props**:
```typescript
interface ChatSidebarProps {
  defaultOpen?: boolean;
  position?: 'left' | 'right';
  width?: string;
}
```

**Implementation**:
- Fixed position (left or right)
- Transform translate for open/closed
- Backdrop glassmorphism when open
- Full screen on mobile
- Integrates existing TaskChat component

### 8. Illustration Component

**Purpose**: Empty state illustrations

**Props**:
```typescript
interface IllustrationProps {
  type: 'no-tasks' | 'no-results' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
}
```

**Implementation**:
- SVG-based illustrations (Lucide icon combinations)
- Animated elements (subtle motion)
- Uses accent colors from theme
- Context-aware sizing

## Theme System Design

### Color Palette (CSS Variables)

```css
:root { /* Deep Rich Dark (Default) */
  /* Base colors - Navy/Charcoal */
  --background: oklch(0.15 0.01 240);      /* Deep navy */
  --foreground: oklch(0.95 0.01 240);      /* Off-white */
  --card: oklch(0.18 0.02 240 / 0.6);     /* Semi-transparent navy */
  --card-foreground: oklch(0.95 0.01 240);

  /* Accent - Gold/Neon */
  --primary: oklch(0.70 0.15 85);          /* Gold */
  --primary-foreground: oklch(0.15 0.01 240);
  --accent: oklch(0.75 0.20 320);          /* Neon purple/pink */
  --accent-foreground: oklch(0.15 0.01 240);

  /* Glassmorphism */
  --glass-blur: 12px;
  --glass-opacity: 0.6;
  --glass-border: oklch(1 0 0 / 0.1);

  /* Priority colors (accented for dark) */
  --urgency-overdue: oklch(0.65 0.20 25);
  --urgency-due-today: oklch(0.75 0.15 65);
  --urgency-due-soon: oklch(0.70 0.15 180);
}

.light {
  /* Complementary light theme */
  --background: oklch(0.98 0.01 240);
  --foreground: oklch(0.15 0.01 240);
  --card: oklch(1 0 0 / 0.7);
  --card-foreground: oklch(0.15 0.01 240);

  /* Darker accents for contrast */
  --primary: oklch(0.45 0.18 85);         /* Darker gold */
  --primary-foreground: oklch(0.98 0.01 240);
  --accent: oklch(0.50 0.20 320);         /* Darker purple */
  --accent-foreground: oklch(0.98 0.01 240);
}
```

### Typography System

```css
:root {
  /* Display font for headings - Bold & Expressive */
  --font-display: 'Cal Sans', 'Inter', system-ui, sans-serif;

  /* Body font for readability */
  --font-body: 'Inter', system-ui, sans-serif;

  /* Tight letter-spacing for display */
  --tracking-display: -0.02em;
  --tracking-normal: 0;

  /* Type scale */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.5rem;     /* 24px - h3 */
  --text-2xl: 1.875rem;  /* 30px - h2 */
  --text-3xl: 2.5rem;    /* 40px - h1 display */
  --text-4xl: 3.5rem;    /* 56px - hero */
}
```

### Animation System

```css
:root {
  /* Durations */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;

  /* Easing */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

  /* Respects reduced motion */
  @media (prefers-reduced-motion: reduce) {
    --duration-fast: 0ms;
    --duration-normal: 0ms;
    --duration-slow: 0ms;
  }
}
```

## Layout Structures

### Landing Page Layout

```
┌─────────────────────────────────────┐
│  Hero Section                        │
│  - Problem statement (display type)  │
│  - Illustration                      │
│  - CTA buttons                       │
├─────────────────────────────────────┤
│  Story Section 1                     │
│  - Narrative text                    │
│  - Scroll-triggered animation        │
├─────────────────────────────────────┤
│  Features Grid (3 columns)           │
│  - Feature cards with illustrations  │
├─────────────────────────────────────┤
│  Story Section 2                     │
│  - Solution story                    │
├─────────────────────────────────────┤
│  CTA Section                         │
│  - Final call to action              │
│  - Sign up form                      │
└─────────────────────────────────────┘
```

### Dashboard Layout (with Persistent Chat Sidebar)

```
┌──────────────┬──────────────────────────────────┐
│              │  Header (simplified)              │
│              │  - Page title                     │
│              │  - User avatar                    │
│  Chat        ├──────────────────────────────────┤
│  Sidebar     │                                    │
│  (collaps-   │  ┌────┐ ┌────┐ ┌────┐ ┌────┐     │
│   ible)      │  │    │ │    │ │    │ │    │     │
│              │  │Card│ │Card│ │Card│ │Card│     │
│  - Open:     │  │    │ │    │ │    │ │    │     │
│    300px     │  └────┘ └────┘ └────┘ └────┘     │
│  - Closed:   │                                    │
│    60px      │  ┌────┐ ┌────┐ ┌────┐ ┌────┐     │
│              │  │    │ │    │ │    │ │    │     │
│              │  │Card│ │Card│ │Card│ │Card│     │
│              │  └────┘ └────┘ └────┘ └────┘     │
│              │                                    │
├──────────────┴──────────────────────────────────┤
│  Floating Dock (appears on scroll)                │
│  [≡] [☐] [💬] [⚙]                                │
└──────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌─────────────────────────────┐
│  Header (minimal)            │
│  - Hamburger menu           │
├─────────────────────────────┤
│                             │
│  ┌─────────┐ ┌─────────┐   │
│  │         │ │         │   │
│  │  Card   │ │  Card   │   │
│  │         │ │         │   │
│  └─────────┘ └─────────┘   │
│                             │
│  ┌─────────┐ ┌─────────┐   │
│  │         │ │         │   │
│  │  Card   │ │  Card   │   │
│  │         │ │         │   │
│  └─────────┘ └─────────┘   │
│                             │
├─────────────────────────────┤
│  Floating Dock               │
│  [≡] [☐] [💬] [⚙]          │
└─────────────────────────────┘
```

## Implementation Strategy

### Phase 1: Foundation (Week 1)

**Goal**: Establish design system and base components

1. Update theme variables in `globals.css`
2. Create design-system components:
   - GlassCard
   - ThemeToggle
   - Illustration
3. Set up typography system
4. Create animation utilities

**Deliverables**:
- Working theme toggle
- GlassCard component with glassmorphism
- Theme variables documented

### Phase 2: Navigation & Layout (Week 1-2)

**Goal**: Implement floating dock and basic layout

1. Create FloatingDock component
2. Update root layout with theme provider
3. Create responsive layout wrapper
4. Implement scroll detection for dock

**Deliverables**:
- Floating dock visible on scroll
- Theme toggle in dock
- Responsive layout structure

### Phase 3: Landing Page (Week 2)

**Goal**: Build story-driven landing page

1. Create HeroSection component
2. Create FeatureSection component
3. Create StorySection components
4. Implement scroll animations
5. Add illustrations

**Deliverables**:
- Complete landing page
- Scroll-triggered animations
- Working CTAs

### Phase 4: Dashboard Grid (Week 2-3)

**Goal**: Transform task list into grid dashboard

1. Create TaskGrid component
2. Create TaskBoardCard component
3. Implement drag-and-drop (@dnd-kit)
4. Add grid customization controls
5. Persist grid preferences

**Deliverables**:
- Grid layout with task cards
- Drag-and-drop reordering
- Responsive grid columns

### Phase 5: Forms Redesign (Week 3)

**Goal**: Convert forms to multi-step card design

1. Create MultiStepForm wrapper
2. Redesign LoginForm
3. Redesign RegisterForm
4. Redesign TaskForm
5. Add progress indicators

**Deliverables**:
- Multi-step login form
- Multi-step task form
- Smooth step transitions

### Phase 6: Chat Sidebar (Week 3-4)

**Goal**: Convert floating chat to persistent sidebar

1. Create ChatSidebar component
2. Integrate existing TaskChat
3. Add collapsible behavior
4. Implement mobile full-screen mode
5. Remove floating button/overlay

**Deliverables**:
- Persistent sidebar chat
- Collapsed/expanded states
- Mobile-responsive behavior

### Phase 7: Polish & Optimization (Week 4)

**Goal**: Refine animations, accessibility, and performance

1. Optimize animations
2. Add keyboard navigation
3. Ensure focus rings visible
4. Performance audit (Lighthouse)
5. Cross-browser testing

**Deliverables**:
- 100% accessibility score
- 90+ performance score
- Smooth animations throughout

## Migration Notes

### Breaking Changes

1. **Task List → Task Grid**: Users accustomed to single-column list will see grid
   - Mitigation: Provide option to switch to single-column view

2. **Floating Chat → Sidebar**: Chatbot moves from overlay to sidebar
   - Mitigation: Migration guide in release notes

3. **Header → Floating Dock**: Navigation changes behavior
   - Mitigation: Keep minimal header with user menu

### Data Migration

No data migration required (frontend-only change).

### Backwards Compatibility

- All existing API calls remain unchanged
- All existing routes remain the same
- User data structure is unchanged

## Performance Considerations

### Optimization Strategies

1. **Code Splitting**: Lazy load heavy components
2. **Image Optimization**: Use Next.js Image for illustrations
3. **Animation Performance**: Use CSS transforms (GPU-accelerated)
4. **Bundle Size**: Monitor with webpack-bundle-analyzer
5. **Glassmorphism Cost**: Backdrop-filter can be expensive, use sparingly

### Performance Targets

- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- Lighthouse Performance: > 90

## Testing Strategy

### Visual Regression

- Use Chromatic or Percy for component screenshots
- Test all components in both themes
- Test responsive breakpoints

### Accessibility Testing

- Keyboard navigation audit
- Screen reader testing (NVDA, VoiceOver)
- Color contrast verification
- Focus ring visibility

### Cross-Browser Testing

- Chrome/Edge (Chromium)
- Firefox
- Safari (WebKit)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

### User Testing

- 5-user usability test on landing page
- A/B test grid vs. list preference
- Survey on dark/light theme usage

## Rollout Plan

### Phase 1: Alpha (Internal)

- Deploy to development environment
- Internal team testing
- Bug fixes and refinement

### Phase 2: Beta (Selected Users)

- Feature flag for gradual rollout
- 10% of users get new design
- Collect feedback and metrics
- Iterate based on feedback

### Phase 3: Full Release

- Remove feature flag
- 100% of users get new design
- Monitor metrics closely
- Hotfix any critical issues

### Rollback Plan

If critical issues arise:

1. Re-enable feature flag to revert 50% of users
2. If issues persist, revert 100% to old design
3. Deploy hotfix
4. Re-rollout following same phased approach

## Open Questions

1. **Illustration Assets**: Should we commission custom illustrations or use SVG compositions?
2. **Framer Motion**: Is it worth adding the dependency, or can CSS handle animations?
3. **Grid Persistence**: Where should grid preferences be stored? (localStorage vs. backend)
4. **Sidebar Default**: Should chat sidebar default to open or closed?
5. **Single Column Option**: Should we provide a list view option for users who prefer it?
