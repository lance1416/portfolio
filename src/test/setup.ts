import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

// Vitest runs without globals, so Testing Library can't register its own cleanup.
afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
});

// ─── Browser APIs jsdom doesn't implement ────────────────────────────────────

// Fresh per test, so a test that changes their behaviour can't leak it.
beforeEach(() => {
  /** matchMedia: nothing matches by default; tests override per case. */
  window.matchMedia = vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
});

/** Observers used by Motion's whileInView; never fire. */
class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
globalThis.IntersectionObserver =
  NoopObserver as unknown as typeof IntersectionObserver;
globalThis.ResizeObserver = NoopObserver as unknown as typeof ResizeObserver;

Object.defineProperty(document, 'fonts', {
  configurable: true,
  value: { ready: Promise.resolve() },
});
