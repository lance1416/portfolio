import { describe, expect, it } from 'vitest';
import { drawCat } from './cat';

/** Records the pupils' pixels from a drawCat call. */
function pupils(look: { x: number; y: number } | null, t = 1) {
  const drawn: [number, number][] = [];
  let fill = '';
  const ctx = {
    set fillStyle(c: string) {
      fill = c;
    },
    fillRect: (x: number, y: number) => {
      if (fill === '#3b2a22') drawn.push([x, y]);
    },
  } as unknown as CanvasRenderingContext2D;
  drawCat(ctx, 0, 0, t, look);
  return drawn;
}

describe('drawCat', () => {
  it('turns both eyes the same way, towards what it looks at', () => {
    // Eyes' top-left corners are (1, 3) and (6, 3).
    expect(pupils({ x: -40, y: -40 })).toEqual([
      [1, 3],
      [6, 3],
    ]);
    expect(pupils({ x: 40, y: 40 })).toEqual([
      [2, 4],
      [7, 4],
    ]);
  });

  it('closes its eyes for a blink', () => {
    expect(pupils({ x: 40, y: 40 }, 4.05)).toEqual([]);
  });
});
