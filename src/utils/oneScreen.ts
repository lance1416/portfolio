import { useSyncExternalStore } from 'react';

/**
 * Whether the page fills exactly one screen and can't scroll (the Projects
 * ring). The footer then sits beside the dock instead of below the page,
 * where no one could reach it. A count, so overlapping mounts (StrictMode)
 * can't switch it off early.
 */
let count = 0;
const listeners = new Set<() => void>();

function change(delta: number) {
  count += delta;
  for (const listener of listeners) listener();
}

/** Marks the page one-screen until the returned function is called. */
export function claimOneScreen() {
  change(1);
  return () => change(-1);
}

export function useOneScreen() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    () => count > 0,
  );
}
