/** Just the cat, on a clear background, watching the pointer. */
import { CAT_H, CAT_W, drawCat } from './cat';
import type { SceneFactory } from './engine';
import { pointerIn } from './pointer';

export const PORTRAIT_W = CAT_W + 2;
export const PORTRAIT_H = CAT_H + 2;

export const catPortrait: SceneFactory = (ctx) => {
  let t = 0;
  return {
    update(dt) {
      t += dt;
    },
    render() {
      ctx.clearRect(0, 0, PORTRAIT_W, PORTRAIT_H);
      drawCat(ctx, 1, 1, t, pointerIn(ctx.canvas));
    },
  };
};
