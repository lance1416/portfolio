/** A 3×5 pixel font, capitals only — just the letters the scenes spell. */
import { type Ctx, px } from './engine';

const GLYPHS: Record<string, string[]> = {
  A: ['.#.', '#.#', '###', '#.#', '#.#'],
  C: ['.##', '#..', '#..', '#..', '.##'],
  E: ['###', '#..', '##.', '#..', '###'],
  H: ['#.#', '#.#', '###', '#.#', '#.#'],
  I: ['###', '.#.', '.#.', '.#.', '###'],
  J: ['..#', '..#', '..#', '#.#', '.#.'],
  N: ['#.#', '###', '###', '#.#', '#.#'],
  O: ['.#.', '#.#', '#.#', '#.#', '.#.'],
  P: ['##.', '#.#', '##.', '#..', '#..'],
  R: ['##.', '#.#', '##.', '#.#', '#.#'],
  S: ['.##', '#..', '.#.', '..#', '##.'],
  T: ['###', '.#.', '.#.', '.#.', '.#.'],
  X: ['#.#', '#.#', '.#.', '#.#', '#.#'],
};

export const GLYPH_H = 5;

/** Width of `text` in pixels: 3 per letter, 1 between. */
export const textWidth = (text: string) => text.length * 4 - 1;

export function drawText(
  ctx: Ctx,
  text: string,
  x: number,
  y: number,
  color: string,
) {
  [...text].forEach((ch, i) => {
    GLYPHS[ch]?.forEach((row, dy) => {
      [...row].forEach((bit, dx) => {
        if (bit === '#') px(ctx, x + i * 4 + dx, y + dy, color);
      });
    });
  });
}
