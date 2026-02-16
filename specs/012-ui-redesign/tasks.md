# Task Breakdown: Complete UI/UX Redesign

**Feature**: 011-ui-redesign
**Created**: 2026-02-16
**Status**: Draft

## Task Legend

- **Status**: `[pending]`, `[in_progress]`, `[completed]`, `[blocked]`
- **Priority**: `P1` (Critical), `P2` (Important), `P3` (Nice-to-have)
- **Estimated**: Time estimate for each task
- **Dependencies**: Tasks that must be completed first

---

## Phase 1: Foundation (Design System)

### T-001: Define Deep Rich Dark Theme Variables
**Priority**: P1
**Estimated**: 1 hour
**Status**: `[completed]`
**Dependencies**: None

Create CSS custom properties for the Deep Rich Dark theme in `globals.css`:
- Navy/charcoal base colors using OKLCH
- Gold/neon accent colors
- Glassmorphism variables (blur, opacity, border)
- Priority/urgency color scales
- Light theme override with complementary colors

**Acceptance**:
- [X] Dark theme is default (`:root` has dark colors)
- [X] Light theme in `.light` class
- [X] All colors use OKLCH for consistent perception
- [X] Variables follow naming convention: `--color-*`

**Files**: `frontend/src/app/globals.css`

---

### T-002: Define Typography System
**Priority**: P1
**Estimated**: 30 minutes
**Status**: `[completed]`
**Dependencies**: None

Define typography scale and font families:
- Display font variable (Cal Sans or Inter with tight tracking)
- Body font variable (Inter)
- Type scale (xs, sm, base, lg, xl, 2xl, 3xl, 4xl)
- Letter-spacing variables

**Acceptance**:
- [X] Font families defined as CSS variables
- [X] Type scale uses rem units
- [X] Display tracking is tighter (-0.02em)
- [X] Fonts load without layout shift

**Files**: `frontend/src/app/globals.css`

---

### T-003: Define Animation System
**Priority**: P2
**Estimated**: 30 minutes
**Status**: `[completed]`
**Dependencies**: None

Create animation system variables and utilities:
- Duration variables (fast: 150ms, normal: 250ms, slow: 350ms)
- Easing functions (cubic-bezier)
- Reduced motion media query

**Acceptance**:
- [X] Duration variables defined
- [X] Easing functions use cubic-bezier
- [X] `prefers-reduced-motion` disables animations
- [X] Utility classes for common transitions

**Files**: `frontend/src/app/globals.css`, `frontend/src/lib/animations.ts`

---

### T-004: Create Theme Utilities
**Priority**: P1
**Estimated**: 1 hour
**Status**: `[completed]`
**Dependencies**: T-001

Create theme management utilities:
- `useTheme` hook for theme state
- Theme provider component
- localStorage persistence
- SSR-safe theme detection

**Acceptance**:
- [X] Hook returns current theme and toggle function
- [X] Theme persists to localStorage
- [X] No flash of wrong theme on page load
- [X] SSR-safe (no hydration mismatch)

**Files**: `frontend/src/lib/theme.ts`, `frontend/src/components/design-system/ThemeProvider.tsx`

---

### T-005: Create GlassCard Component
**Priority**: P1
**Estimated**: 2 hours
**Status**: `[completed]`
**Dependencies**: T-001

Create reusable glassmorphism card component:
- Backdrop blur effect
- Configurable opacity
- Subtle border
- Shadow depth options
- Responsive blur values

**Acceptance**:
- [X] Component accepts blur, opacity, border, shadow props
- [X] Glassmorphism effect visible in both themes
- [X] Blur is smaller on mobile devices
- [X] Content maintains readability
- [X] Export as `GlassCard` from design-system

**Files**: `frontend/src/components/design-system/GlassCard.tsx`

---

### T-006: Create ThemeToggle Component
**Priority**: P1
**Estimated**: 1 hour
**Status**: `[completed]`
**Dependencies**: T-004

Create theme toggle button/switch:
- Button variant (icon)
- Switch variant (toggle)
- Smooth transition animation
- Sun/moon icon indication

**Acceptance**:
- [X] Toggles between light and dark themes
- [X] Icon indicates current theme
- [X] Transition is smooth (300ms)
- [X] Accessible (aria-label, keyboard)
- [X] Works in SSR

**Files**: `frontend/src/components/design-system/ThemeToggle.tsx`

---

### T-007: Create Illustration Component
**Priority**: P2
**Estimated**: 3 hours
**Status**: `[completed]`
**Dependencies**: T-001, T-002

Create empty state illustration component:
- SVG-based illustrations (Lucide combinations)
- Types: no-tasks, no-results, error, success
- Size variants
- Subtle animation
- Uses accent colors

**Acceptance**:
- [X] Four illustration types implemented
- [X] Size prop works (sm, md, lg)
- [X] Subtle animation on load
- [X] Uses theme accent colors
- [X] Accessible (aria-label)

**Files**: `frontend/src/components/design-system/Illustration.tsx`

---

## Phase 2: Navigation & Layout

### T-008: Create FloatingDock Component
**Priority**: P1
**Estimated**: 3 hours
**Status**: `[completed]`
**Dependencies**: T-005

Create macOS-style floating navigation dock:
- Fixed bottom-center positioning
- Appears on scroll down
- Hides on scroll to top
- GlassCard styling
- Tooltips on hover
- Icon items: Dashboard, Tasks, Chat, Settings

**Acceptance**:
- [X] Dock is centered at bottom
- [X] Appears when scrolling down
- [X] Hides when at top of page
- [X] Glassmorphism effect
- [X] Tooltips show on hover with delay
- [X] Active route is highlighted
- [X] Keyboard accessible

**Files**: `frontend/src/components/design-system/FloatingDock.tsx`

---

### T-009: Update Root Layout with Theme Provider
**Priority**: P1
**Estimated**: 1 hour
**Status**: `[completed]`
**Dependencies**: T-004

Wrap root layout with theme provider:
- Add ThemeProvider to layout
- Pass initial theme from cookies
- Ensure no flash

**Acceptance**:
- [X] ThemeProvider wraps children
- [X] Initial theme detected correctly
- [X] No layout shift
- [X] Works with existing providers

**Files**: `frontend/src/app/layout.tsx`

---

### T-010: Add ThemeToggle to FloatingDock
**Priority**: P2
**Estimated**: 30 minutes
**Status**: `[completed]`
**Dependencies**: T-006, T-008

Add theme toggle button to floating dock:
- Position at end of dock items
- Smaller than nav icons
- Works independently of nav

**Acceptance**:
- [X] Toggle button visible in dock
- [X] Toggles theme on click
- [X] Doesn't trigger navigation
- [X] Proper spacing from other icons

**Files**: `frontend/src/components/design-system/FloatingDock.tsx`

---

## Phase 3: Landing Page

### T-011: Create HeroSection Component
**Priority**: P1
**Estimated**: 3 hours
**Status**: `[completed]`
**Dependencies**: T-001, T-002, T-005

Create landing page hero section:
- Problem statement headline (display type)
- Supporting copy
- Hero illustration (composition)
- CTA buttons (Sign Up, Learn More)
- Gradient text effect on headline

**Acceptance**:
- [X] Bold display headline
- [X] Clear value proposition
- [X] Two CTA buttons
- [X] Illustration on right (desktop) or top (mobile)
- [X] Gradient text on key phrases
- [X] Responsive layout

**Files**: `frontend/src/components/landing/HeroSection.tsx`

---

### T-012: Create FeatureSection Component
**Priority**: P2
**Estimated**: 2 hours
**Status**: `[completed]`
**Dependencies**: T-005, T-007

Create feature showcase section:
- Grid layout (3 columns on desktop)
- Feature cards (GlassCard)
- Icon + title + description
- Hover effect

**Acceptance**:
- [X] Three feature cards
- [X] Responsive grid
- [X] GlassCard styling
- [X] Hover reveals more info
- [X] Icons use accent color

**Files**: `frontend/src/components/landing/FeatureSection.tsx`

---

### T-013: Create StorySection Components
**Priority**: P2
**Estimated**: 2 hours
**Status**: `[completed]`
**Dependencies**: T-001, T-002, T-007

Create narrative sections:
- Problem story section
- Solution story section
- Illustration + text layout
- Scroll-triggered fade-in

**Acceptance**:
- [X] Two story sections
- [X] Alternating layout (left-right)
- [X] Illustrations on one side
- [X] Fade-in animation on scroll
- [X] Emotional, narrative copy

**Files**: `frontend/src/components/landing/StorySection.tsx`

---

### T-014: Create CTASection Component
**Priority**: P2
**Estimated**: 1 hour
**Status**: `[pending]**
**Dependencies**: T-005

Create final CTA section:
- Strong call-to-action headline
- Sign-up form or button
- Minimal illustration
- Gradient background

**Acceptance**:
- [ ] Compelling CTA copy
- [ ] Sign-up button or inline form
- [ ] Subtle gradient background
- [ ] Consistent with hero

**Files**: `frontend/src/components/landing/CTASection.tsx`

---

### T-015: Create Landing Page
**Priority**: P1
**Estimated**: 2 hours
**Status**: `[pending]`
**Dependencies**: T-011, T-012, T-013, T-014

Assemble landing page from components:
- Combine all sections
- Add smooth scroll behavior
- Implement scroll-triggered animations
- Ensure responsive spacing

**Acceptance**:
- [ ] Hero at top
- [ ] Story sections follow
- [ ] Feature grid in middle
- [ ] CTA at bottom
- [ ] Scroll animations work
- [ ] Smooth scroll between sections
- [ ] Mobile layout stacks properly

**Files**: `frontend/src/app/page.tsx`

---

### T-016: Add Auth Redirect to Landing Page
**Priority**: P1
**Estimated**: 1 hour
**Status**: `[pending]`
**Dependencies**: T-015

Implement smart redirect logic:
- Authenticated users → /dashboard
- Unauthenticated users → landing page
- No flash of redirect

**Acceptance**:
- [ ] Logged-in users see dashboard
- [ ] Logged-out users see landing
- [ ] No delay or flash
- [ ] Works on first visit

**Files**: `frontend/src/app/page.tsx`

---

## Phase 4: Dashboard Grid

### T-017: Create TaskBoardCard Component
**Priority**: P1
**Estimated**: 4 hours
**Status**: `[pending]`
**Dependencies**: T-005

Create square board-style task card:
- 1:1 aspect ratio
- Glassmorphism styling
- Task title (truncated)
- Priority badge overlay
- Urgency border color
- Hover reveals quick actions
- Checkbox for completion

**Acceptance**:
- [ ] Square aspect ratio
- [ ] GlassCard styling
- [ ] Title truncates with ellipsis
- [ ] Priority badge visible
- [ ] Urgency border on left
- [ ] Hover shows edit/delete/complete
- [ ] Checkbox toggles completion
- [ ] Responsive sizing

**Files**: `frontend/src/components/dashboard/TaskBoardCard.tsx`

---

### T-018: Create TaskGrid Component
**Priority**: P1
**Estimated**: 4 hours
**Status**: `[pending]`
**Dependencies**: T-017

Create grid container for task cards:
- Responsive columns (1-4 based on screen)
- CSS Grid layout
- Gap spacing
- Empty state illustration
- Drag-and-drop hooks (prepare for T-019)

**Acceptance**:
- [ ] Responsive: 1 col mobile, 2 col tablet, 3-4 col desktop
- [ ] CSS Grid implementation
- [ ] Proper gap spacing
- [ ] Shows illustration when empty
- [ ] Accepts tasks as prop
- [ ] Renders TaskBoardCard for each

**Files**: `frontend/src/components/dashboard/TaskGrid.tsx`

---

### T-019: Add Drag-and-Drop to TaskGrid
**Priority**: P2
**Estimated**: 3 hours
**Status**: `[pending]`
**Dependencies**: T-018

Implement drag-and-drop reordering:
- Install @dnd-kit packages
- Make cards draggable
- Animate position changes
- Call onReorder callback

**Acceptance**:
- [ ] Cards can be dragged
- [ ] Other cards move aside
- [ ] Drop position is clear
- [ ] Smooth animations
- [ ] onReorder called with new order
- [ ] Works on touch devices

**Files**: `frontend/src/components/dashboard/TaskGrid.tsx`

**Dependencies to install**:
- `@dnd-kit/core`
- `@dnd-kit/sortable`
- `@dnd-kit/utilities`

---

### T-020: Update Dashboard Page to Use TaskGrid
**Priority**: P1
**Estimated**: 2 hours
**Status**: `[pending]`
**Dependencies**: T-018

Replace TaskList with TaskGrid:
- Update dashboard/page.tsx
- Pass tasks to TaskGrid
- Handle reordering
- Maintain server-side fetching

**Acceptance**:
- [ ] Dashboard shows TaskGrid instead of list
- [ ] Tasks load server-side (unchanged)
- [ ] Grid is responsive
- [ ] Empty state shows illustration
- [ ] Header simplified (minimal)

**Files**: `frontend/src/app/dashboard/page.tsx`

---

### T-021: Add Grid Customization Controls
**Priority**: P2
**Estimated**: 2 hours
**Status**: `[pending]`
**Dependencies**: T-020

Add controls for grid customization:
- Column count selector
- Card size toggle
- Persist preferences to localStorage

**Acceptance**:
- [ ] User can select column count
- [ ] User can toggle card size
- [ ] Preference saved to localStorage
- [ ] Preference restored on load
- [ ] Controls in dropdown or settings

**Files**: `frontend/src/components/dashboard/GridControls.tsx`, `frontend/src/app/dashboard/page.tsx`

---

## Phase 5: Forms Redesign

### T-022: Create MultiStepForm Wrapper
**Priority**: P1
**Estimated**: 4 hours
**Status**: `[pending]**
**Dependencies**: T-005, T-003

Create multi-step form component:
- Step array prop
- Current step state
- Progress indicator
- Next/Back navigation
- Slide animation between steps
- Final validation and submit

**Acceptance**:
- [ ] Accepts steps array with fields and validation
- [ ] Progress indicator shows current/total
- [ ] Next button validates current step
- [ ] Back button returns to previous
- [ ] Slide animation (transform)
- [ ] Final submit calls onSubmit
- [ ] Data accumulated across steps

**Files**: `frontend/src/components/design-system/MultiStepForm.tsx`

---

### T-023: Redesign LoginForm
**Priority**: P1
**Estimated**: 2 hours
**Status**: `[pending]`
**Dependencies**: T-022

Convert login to multi-step card:
- Step 1: Email
- Step 2: Password
- GlassCard container
- MultiStepForm wrapper

**Acceptance**:
- [ ] Two steps: email → password
- [ ] Progress indicator visible
- [ ] GlassCard styling
- [ ] Back button works
- [ ] Submit on final step
- [ ] Error handling maintained
- [ ] Existing auth logic unchanged

**Files**: `frontend/src/components/auth/LoginForm.tsx`

---

### T-024: Redesign RegisterForm
**Priority**: P1
**Estimated**: 2 hours
**Status**: `[pending]`
**Dependencies**: T-022

Convert register to multi-step card:
- Step 1: Email + name
- Step 2: Password + confirm
- GlassCard container
- MultiStepForm wrapper

**Acceptance**:
- [ ] Two steps: info → password
- [ ] Progress indicator visible
- [ ] GlassCard styling
- [ ] Back button works
- [ ] Submit on final step
- [ ] Validation maintained
- [ ] Existing auth logic unchanged

**Files**: `frontend/src/components/auth/RegisterForm.tsx`

---

### T-025: Redesign TaskForm
**Priority**: P1
**Estimated**: 3 hours
**Status**: `[pending]`
**Dependencies**: T-022

Convert task form to multi-step:
- Step 1: Title + description
- Step 2: Due date + priority
- Step 3: Tags + recurrence
- GlassCard container
- MultiStepForm wrapper

**Acceptance**:
- [ ] Three steps organized logically
- [ ] Progress indicator visible
- [ ] GlassCard styling
- [ ] Back/Next navigation
- [ ] All fields present
- [ ] Existing validation maintained
- [ ] Edit mode works

**Files**: `frontend/src/components/tasks/TaskForm.tsx`

---

## Phase 6: Chat Sidebar

### T-026: Create ChatSidebar Component
**Priority**: P1
**Estimated**: 4 hours
**Status**: `[pending]**
**Dependencies**: T-005

Create persistent chat sidebar:
- Fixed left or right position
- Collapsed (60px) and expanded (300px) states
- Transform animation
- GlassCard styling
- Full screen on mobile
- Toggle button

**Acceptance**:
- [ ] Fixed position on left or right
- [ ] Two states: collapsed and expanded
- [ ] Smooth transform animation
- [ ] Glassmorphism effect
- [ ] Full screen with close button on mobile
- [ ] Toggle button visible when collapsed
- [ ] Preserves chat state

**Files**: `frontend/src/components/chat/ChatSidebar.tsx`

---

### T-027: Integrate TaskChat into ChatSidebar
**Priority**: P1
**Estimated**: 2 hours
**Status**: `[pending]`
**Dependencies**: T-026

Remove TaskChat wrapper, use in sidebar:
- TaskChat fills sidebar content
- Remove duplicate headers
- Maintain existing chat functionality
- Preserve SSE streaming

**Acceptance**:
- [ ] TaskChat renders inside sidebar
- [ ] Chat functionality unchanged
- [ ] Streaming works
- [ ] History persists
- [ ] No duplicate UI elements

**Files**: `frontend/src/components/chat/ChatSidebar.tsx`, `frontend/src/components/chat/TaskChat.tsx`

---

### T-028: Add ChatSidebar to Dashboard Layout
**Priority**: P1
**Estimated**: 2 hours
**Status**: `[pending]**
**Dependencies**: T-027

Add sidebar to dashboard layout:
- Wrap dashboard content
- Push content when expanded
- Overlay on mobile
- Default state configurable

**Acceptance**:
- [ ] Sidebar visible on dashboard
- [ ] Content adjusts to sidebar width
- [ ] Mobile: sidebar overlays full screen
- [ ] Desktop: sidebar pushes or overlays
- [ ] Toggle button accessible
- [ ] State persists across navigation

**Files**: `frontend/src/app/dashboard/layout.tsx`

---

### T-029: Remove FloatingChat Button/Overlay
**Priority**: P2
**Estimated**: 1 hour
**Status**: `[pending]`
**Dependencies**: T-028

Remove old floating chat implementation:
- Delete FloatingChat component
- Remove ChatProvider wrapper
- Clean up unused code

**Acceptance**:
- [ ] FloatingChat component removed
- [ ] No floating button visible
- [ ] No overlay sheet
- [ ] ChatProvider simplified or removed
- [ ] No broken references

**Files**: `frontend/src/components/chatbot/FloatingChat.tsx` (delete)

---

## Phase 7: Polish & Optimization

### T-030: Optimize Animations
**Priority**: P2
**Estimated**: 3 hours
**Status**: `[pending]**
**Dependencies**: All Phase 1-6 tasks

Review and optimize all animations:
- Ensure GPU acceleration (transforms)
- Reduce animation complexity
- Add will-change hints
- Test with reduced motion

**Acceptance**:
- [ ] All animations use transforms
- [ ] No layout thrashing
- [ ] 60fps maintained
- [ ] Reduced motion respected
- [ ] Performance profile shows no long tasks

**Files**: All component files with animations

---

### T-031: Implement Keyboard Navigation
**Priority**: P1
**Estimated**: 4 hours
**Status**: `[pending]**
**Dependencies**: T-018, T-026

Add comprehensive keyboard support:
- Tab order logical
- Arrow keys navigate grid
- Enter activates focused items
- Escape closes modals/sidebars
- Visible focus rings

**Acceptance**:
- [ ] Tab visits all interactive elements
- [ ] Arrow keys navigate task grid
- [ ] Enter opens/activates focused item
- [ ] Escape closes modals and sidebar
- [ ] Focus ring always visible
- [ ] Skip links for main content

**Files**: Multiple component files

---

### T-032: Accessibility Audit & Fixes
**Priority**: P1
**Estimated**: 3 hours
**Status**: `[pending]`
**Dependencies**: T-031

Run accessibility audit and fix issues:
- Lighthouse accessibility audit
- Screen reader testing
- Color contrast verification
- ARIA labels and roles

**Acceptance**:
- [ ] Lighthouse accessibility score 100
- [ ] All color ratios meet WCAG AA
- [ ] Screen reader announces content correctly
- [ ] ARIA labels on interactive elements
- [ ] No inaccessible actions

**Files**: Multiple component files

---

### T-033: Performance Audit & Optimization
**Priority**: P1
**Estimated**: 3 hours
**Status**: `[pending]`
**Dependencies**: T-030

Run performance audit and optimize:
- Lighthouse performance audit
- Code splitting review
- Image optimization
- Bundle size analysis
- Lazy loading opportunities

**Acceptance**:
- [ ] Lighthouse performance score > 90
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Bundle size reasonable
- [ ] Heavy components lazy loaded

**Files**: Multiple files, configuration

---

### T-034: Cross-Browser Testing & Fixes
**Priority**: P2
**Estimated**: 3 hours
**Status**: `[pending]**
**Dependencies**: All previous tasks

Test and fix for all target browsers:
- Chrome/Edge
- Firefox
- Safari
- Mobile Safari
- Chrome Mobile

**Acceptance**:
- [ ] Works in Chrome/Edge
- [ ] Works in Firefox
- [ ] Works in Safari (backdrop-filter fallback)
- [ ] Works on iOS Safari
- [ ] Works on Chrome Android
- [ ] Graceful degradation for unsupported features

**Files**: Multiple files, CSS

---

### T-035: Update Documentation
**Priority**: P3
**Estimated**: 2 hours
**Status**: `[pending]**
**Dependencies**: All previous tasks

Update project documentation:
- Update CLAUDE.md with new design system
- Document component usage
- Update README with new screenshots
- Create migration guide

**Acceptance**:
- [ ] Design system documented
- [ ] Component props documented
- [ ] Screenshots updated
- [ ] Migration guide created
- [ ] Breaking changes noted

**Files**: `CLAUDE.md`, `README.md`, new docs

---

## Task Summary

| Phase | Tasks | Total Estimate |
|-------|-------|----------------|
| Phase 1: Foundation | T-001 to T-007 | ~11 hours |
| Phase 2: Navigation | T-008 to T-010 | ~5 hours |
| Phase 3: Landing Page | T-011 to T-016 | ~11 hours |
| Phase 4: Dashboard Grid | T-017 to T-021 | ~15 hours |
| Phase 5: Forms | T-022 to T-025 | ~11 hours |
| Phase 6: Chat Sidebar | T-026 to T-029 | ~9 hours |
| Phase 7: Polish | T-030 to T-035 | ~18 hours |
| **Total** | **35 tasks** | **~80 hours** |

## Dependencies Graph

```
Phase 1 (Foundation)
├── T-001, T-002, T-003 (Can be parallel)
├── T-004 (depends on T-001)
├── T-005 (depends on T-001)
├── T-006 (depends on T-004)
└── T-007 (depends on T-001, T-002)

Phase 2 (Navigation)
├── T-008 (depends on T-005)
├── T-009 (depends on T-004)
└── T-010 (depends on T-006, T-008)

Phase 3 (Landing)
├── T-011, T-012, T-013, T-014 (Can be parallel, depend on Phase 1)
├── T-015 (depends on T-011, T-012, T-013, T-014)
└── T-016 (depends on T-015)

Phase 4 (Dashboard)
├── T-017 (depends on T-005)
├── T-018 (depends on T-017)
├── T-019 (depends on T-018)
├── T-020 (depends on T-018)
└── T-021 (depends on T-020)

Phase 5 (Forms)
├── T-022 (depends on T-005, T-003)
├── T-023, T-024, T-025 (Can be parallel, depend on T-022)

Phase 6 (Chat)
├── T-026 (depends on T-005)
├── T-027 (depends on T-026)
├── T-028 (depends on T-027)
└── T-029 (depends on T-028)

Phase 7 (Polish)
└── T-030 to T-035 (depend on all previous)
```

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Backdrop-filter not supported in some browsers | Medium | Low | Provide fallback solid colors |
| Grid layout confuses existing users | Medium | Medium | Offer single-column view option |
| Drag-and-drop complexity causes bugs | Low | Medium | Thorough testing, consider removing if problematic |
| Performance issues with glassmorphism | Medium | Low | Use sparingly, optimize with GPU acceleration |
| Accessibility issues with custom components | High | Low | Extensive keyboard testing, screen reader audit |
