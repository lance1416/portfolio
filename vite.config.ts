/// <reference types="vitest/config" />
import * as path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

/**
 * Preloads the fonts the first screen needs, so they download alongside the
 * JS instead of after it renders. Matched by file name, since the built names
 * are hashed. Only Playfair (latin), the hero headline and LCP element on
 * Home: preloading Inter too competed with the JS for bandwidth and measured
 * slower, and body text swaps in from a fallback anyway.
 */
function preloadCriticalFonts(patterns: RegExp[]): Plugin {
  return {
    name: 'preload-critical-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const fonts = Object.keys(ctx.bundle ?? {}).filter((file) =>
          patterns.some((pattern) => pattern.test(file)),
        );
        return fonts.map((file) => ({
          tag: 'link',
          attrs: {
            rel: 'preload',
            as: 'font',
            type: 'font/woff2',
            href: `/${file}`,
            crossorigin: '',
          },
          injectTo: 'head' as const,
        }));
      },
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    preloadCriticalFonts([/playfair-display-latin-wght-normal.*\.woff2$/]),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Playwright specs in e2e/ run separately (pnpm test:e2e).
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
