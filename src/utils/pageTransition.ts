import { useOutletContext } from 'react-router-dom';
import { NAV_LINKS } from '@/data/navigation';

/**
 * A page's place in the site's chapter order: Home is 0, then the navbar
 * links left to right (§ 01, § 02, …); anything else sorts last.
 */
export function chapterOf(pathname: string): number {
  if (pathname === '/') return 0;
  const index = NAV_LINKS.findIndex((link) => pathname.startsWith(link.path));
  return index === -1 ? NAV_LINKS.length + 1 : index + 1;
}

/** Moving to a later chapter turns forward; an earlier one turns back. */
export function directionBetween(from: string, to: string): TurnDirection {
  return chapterOf(to) >= chapterOf(from) ? 'forward' : 'back';
}

export const supportsViewTransitions = () =>
  typeof document !== 'undefined' && 'startViewTransition' in document;

export type TurnDirection = 'forward' | 'back';

export interface PageContext {
  /**
   * `initial` for a page's own entrance animation: played on the first page
   * load, skipped after a navigation, where the view transition already
   * animates the page in (one entrance per page, not two stacked).
   */
  entrance: 'hidden' | false;
  /** Which way the last navigation turned, for direction-aware motion. */
  direction: TurnDirection;
}

/** Pages rendered outside the layout (e.g. in tests) animate as on first load. */
const OUTSIDE_LAYOUT: PageContext = {
  entrance: 'hidden',
  direction: 'forward',
};

export function usePageTransition(): PageContext {
  return useOutletContext<PageContext | undefined>() ?? OUTSIDE_LAYOUT;
}

export function usePageEntrance(): PageContext['entrance'] {
  return usePageTransition().entrance;
}
