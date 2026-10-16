import { useSyncExternalStore } from 'react';

/**
 * The cat hides in one scene per page; petting it counts it as found. Found
 * spots persist in this browser (a per-visitor game, nothing shared).
 */
export const CAT_SPOTS = [
  'notFound',
  'experience',
  'projects',
  'research',
] as const;
export type CatSpot = (typeof CAT_SPOTS)[number];

const KEY = 'portfolio-cats';
const listeners = new Set<() => void>();

function load(): readonly CatSpot[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(saved)
      ? CAT_SPOTS.filter((spot) => saved.includes(spot))
      : [];
  } catch {
    // Private windows, blocked storage or a mangled value: start afresh.
    return [];
  }
}

let found = load();

export function findCat(spot: CatSpot) {
  if (found.includes(spot)) return;
  found = CAT_SPOTS.filter((s) => s === spot || found.includes(s));
  try {
    localStorage.setItem(KEY, JSON.stringify(found));
  } catch {
    // Not persisted; still counts for this visit.
  }
  for (const listener of listeners) listener();
}

/** Re-reads storage; for tests. */
export function resetCats() {
  found = load();
  for (const listener of listeners) listener();
}

/** The spots found so far, in `CAT_SPOTS` order (a stable array). */
export function useCatsFound() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    () => found,
  );
}
