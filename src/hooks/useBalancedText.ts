import { prepareWithSegments, walkLineRanges } from '@chenglou/pretext';
import type { CSSProperties, RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

/**
 * Binary-search for the tightest maxWidth that produces the same line count
 * as the full available width. This eliminates orphan words and produces an
 * even rag — the "shrink-wrap balanced" layout from @chenglou/pretext.
 */
function findBalancedWidth(
  text: string,
  font: string,
  availableWidth: number,
): number {
  const prepared = prepareWithSegments(text, font);

  let lineCount = 0;
  walkLineRanges(prepared, availableWidth, () => {
    lineCount++;
  });

  if (lineCount <= 1) return availableWidth;

  let lo = Math.floor(availableWidth / lineCount);
  let hi = availableWidth;

  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    let count = 0;
    walkLineRanges(prepared, mid, () => {
      count++;
    });
    if (count === lineCount) hi = mid;
    else lo = mid;
  }

  return hi;
}

/**
 * Attaches to a text element (p, h2, …) and computes the tightest maxWidth
 * that keeps the same line count as the natural layout — eliminating orphans
 * without manual <br> tags or CSS `text-wrap: balance` guesswork.
 *
 * The hook measures the element's own rendered text and computed font
 * (weight, size, family), so there is no separate copy of the text to keep in
 * sync and it stays correct across responsive breakpoints. Text is read on
 * mount and on resize, which suits static copy. It observes the *parent*
 * element's width to avoid feedback loops when the inline style changes the
 * element's own size.
 *
 * Usage:
 *   const { ref, style } = useBalancedText<HTMLParagraphElement>();
 *   <p ref={ref} style={style} className="max-w-xl ...">...</p>
 */
export function useBalancedText<T extends HTMLElement = HTMLElement>(): {
  ref: RefObject<T | null>;
  style: CSSProperties | undefined;
} {
  const ref = useRef<T>(null);
  const [balancedWidth, setBalancedWidth] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let ro: ResizeObserver | null = null;

    async function compute() {
      await document.fonts.ready;
      if (cancelled || !ref.current) return;

      const el = ref.current;
      const parent = el.parentElement;
      if (!parent) return;

      // Read available width from parent to avoid feedback from our own maxWidth style.
      const availableWidth = parent.getBoundingClientRect().width;
      if (availableWidth <= 0) return;

      // Derive font spec from the element's computed style so responsive
      // font-size changes (sm:text-4xl etc.) are respected automatically.
      const cs = window.getComputedStyle(el);
      const font = [
        cs.fontStyle !== 'normal' ? cs.fontStyle : '',
        cs.fontWeight,
        cs.fontSize,
        cs.fontFamily,
      ]
        .filter(Boolean)
        .join(' ');

      const text = el.textContent ?? '';
      const width = findBalancedWidth(text, font, availableWidth);
      if (!cancelled) setBalancedWidth(width);
    }

    compute();

    ro = new ResizeObserver(compute);
    const parent = ref.current?.parentElement;
    if (parent) ro.observe(parent);

    return () => {
      cancelled = true;
      ro?.disconnect();
    };
  }, []);

  return {
    ref,
    style:
      balancedWidth != null ? { maxWidth: `${balancedWidth}px` } : undefined,
  };
}
