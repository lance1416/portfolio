// Renders public/og-image.png, the 1200×630 link-preview card, from HTML so it
// uses the site's own fonts and colours. Run after changing name or role:
//   pnpm og-image
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { chromium } from '@playwright/test';

const require = createRequire(import.meta.url);
const font = (pkg, file) =>
  `data:font/woff2;base64,${readFileSync(require.resolve(`${pkg}/files/${file}`)).toString('base64')}`;

// Keep in step with src/data/profile.ts.
const NAME = 'Sinan Li';
const ROLE = 'Research Engineer';
const SITE = 'lance1416.com';

const html = `<!doctype html>
<html><head><style>
  @font-face { font-family: Playfair; src: url(${font('@fontsource-variable/playfair-display', 'playfair-display-latin-wght-normal.woff2')}); font-weight: 400 900; }
  @font-face { font-family: Inter; src: url(${font('@fontsource-variable/inter', 'inter-latin-opsz-normal.woff2')}); font-weight: 100 900; }
  @font-face { font-family: Mono; src: url(${font('@fontsource-variable/jetbrains-mono', 'jetbrains-mono-latin-wght-normal.woff2')}); font-weight: 100 800; }
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; padding: 88px 96px;
    background: #fafaf8; color: #18181b;
    display: flex; flex-direction: column; justify-content: space-between;
    position: relative; overflow: hidden;
  }
  /* The site's accent edge (its scroll-progress bar) */
  body::before { content: ''; position: absolute; inset: 0 0 auto; height: 6px; background: oklch(42% 0.22 268); }
  .name { font: 400 148px/1 Playfair; letter-spacing: -0.02em; }
  .role { margin-top: 28px; font: 400 40px/1.2 Inter; color: #52525b; }
  .site { font: 500 26px/1 Mono; color: #a1a1aa; letter-spacing: 0.02em; }
</style></head>
<body>
  <div>
    <div class="name">${NAME}</div>
    <div class="role">${ROLE}</div>
  </div>
  <div class="site">${SITE}</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og-image.png' });
await browser.close();
console.log('wrote public/og-image.png');
