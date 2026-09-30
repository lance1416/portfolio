import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useScrollLock } from './useScrollLock';

const overflow = () => document.body.style.overflow;

describe('useScrollLock', () => {
  it('locks while active and restores on release', () => {
    const { rerender } = renderHook(({ active }) => useScrollLock(active), {
      initialProps: { active: false },
    });
    expect(overflow()).toBe('');

    rerender({ active: true });
    expect(overflow()).toBe('hidden');

    rerender({ active: false });
    expect(overflow()).toBe('');
  });

  it('keeps the page locked until every overlapping lock is released', () => {
    // e.g. the mobile menu opens the command palette, then closes itself
    const menu = renderHook(({ active }) => useScrollLock(active), {
      initialProps: { active: true },
    });
    const palette = renderHook(({ active }) => useScrollLock(active), {
      initialProps: { active: true },
    });

    menu.rerender({ active: false });
    expect(overflow()).toBe('hidden');

    palette.rerender({ active: false });
    expect(overflow()).toBe('');
  });

  it('releases its lock on unmount', () => {
    const { unmount } = renderHook(() => useScrollLock(true));
    expect(overflow()).toBe('hidden');
    unmount();
    expect(overflow()).toBe('');
  });
});
