/** True on macOS, iPadOS and iOS, where the palette shortcut is ⌘K rather than Ctrl+K. */
export function isApplePlatform(nav: Navigator = navigator): boolean {
  const platform =
    (nav as Navigator & { userAgentData?: { platform: string } }).userAgentData
      ?.platform ?? nav.platform;
  return /mac|iphone|ipad|ipod/i.test(platform);
}

/**
 * The command palette shortcut as shown to this visitor. The listener accepts
 * both ⌘ and Ctrl everywhere; this only decides which one to advertise.
 */
export function paletteShortcut(apple = isApplePlatform()) {
  return apple
    ? { label: '⌘K', aria: 'Meta+K' }
    : { label: 'Ctrl K', aria: 'Control+K' };
}

export const PALETTE_SHORTCUT = paletteShortcut();
