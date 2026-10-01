import type { ViewportSize } from '@playwright/test';

// Mirrors the breakpoints in the app, so specs pick the layout a device gets.

/** Projects shows the one-screen 3D ring (see pages/Projects.tsx). */
export const showsRing = (viewport: ViewportSize | null) =>
  !!viewport &&
  viewport.width >= 1024 &&
  viewport.height >= 740 &&
  viewport.width > viewport.height;

/** The navbar collapses into the hamburger menu below `sm`. */
export const hasMobileMenu = (viewport: ViewportSize | null) =>
  !!viewport && viewport.width < 640;

/** The floating dock appears from `sm` up. */
export const hasDock = (viewport: ViewportSize | null) =>
  !!viewport && viewport.width >= 640;

/** Experience entries use the two-column, sticky date rail from `md` up. */
export const hasStickyRail = (viewport: ViewportSize | null) =>
  !!viewport && viewport.width >= 768;
