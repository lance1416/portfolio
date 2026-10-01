import { describe, expect, it } from 'vitest';
import { isApplePlatform, paletteShortcut } from './shortcut';

const nav = (fields: object) => fields as Navigator;

describe('isApplePlatform', () => {
  it.each([
    [{ platform: 'MacIntel' }, true],
    [{ platform: 'iPhone' }, true],
    [{ platform: 'Win32' }, false],
    [{ platform: 'Linux x86_64' }, false],
    // Client hints win over the legacy field when present.
    [{ platform: '', userAgentData: { platform: 'macOS' } }, true],
    [{ platform: 'MacIntel', userAgentData: { platform: 'Windows' } }, false],
  ])('%o → %s', (fields, expected) => {
    expect(isApplePlatform(nav(fields))).toBe(expected);
  });
});

describe('paletteShortcut', () => {
  it('advertises ⌘K on Apple devices and Ctrl K elsewhere', () => {
    expect(paletteShortcut(true)).toMatchObject({
      label: '⌘K',
      aria: 'Meta+K',
    });
    expect(paletteShortcut(false)).toMatchObject({
      label: 'Ctrl K',
      aria: 'Control+K',
    });
  });
});
