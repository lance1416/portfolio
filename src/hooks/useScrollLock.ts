import { useEffect } from 'react';

let activeLocks = 0;

/**
 * Locks body scroll while `active` is true. Reference-counted so overlapping
 * overlays (command palette, mobile menu) never unlock each other.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    if (activeLocks++ === 0) document.body.style.overflow = 'hidden';
    return () => {
      if (--activeLocks === 0) document.body.style.overflow = '';
    };
  }, [active]);
}
