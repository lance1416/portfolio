import { AnimatePresence, motion } from 'motion/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { SCENE_H, SCENE_W } from '@/scene/engine';
import type { Box } from '@/scene/signpost';
import { type CatSpot, findCat } from '@/utils/cats';
import { DURATION, timed } from '@/utils/variants';

/** Places an overlay on a box of a full-size scene, in percentages. */
export const boxStyle = (b: Box): CSSProperties => ({
  left: `${(b.x / SCENE_W) * 100}%`,
  top: `${(b.y / SCENE_H) * 100}%`,
  width: `${(b.w / SCENE_W) * 100}%`,
  height: `${(b.h / SCENE_H) * 100}%`,
});

const HEART = [
  '.##.##.',
  '#######',
  '#######',
  '.#####.',
  '..###..',
  '...#...',
];

/** A pixel heart, drawn crisp at any size. */
function Heart() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 7 6"
      shapeRendering="crispEdges"
      className="h-3 w-3.5"
      fill="#ff7a8a"
    >
      {HEART.flatMap((row, y) =>
        [...row].map((bit, x) =>
          bit === '#' ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed bitmap
            <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />
          ) : null,
        ),
      )}
    </svg>
  );
}

/**
 * The button over the cat in a scene: petting it counts it as found (and
 * says so with a heart). Its box is in scene pixels.
 */
export function HiddenCat({ spot, box }: { spot: CatSpot; box: Box }) {
  const [hearts, setHearts] = useState<number[]>([]);

  return (
    <button
      type="button"
      aria-label="Pet the cat"
      onClick={() => {
        findCat(spot);
        const id = Date.now();
        setHearts((list) => [...list, id]);
      }}
      style={boxStyle(box)}
      // The cat is a few pixels tall on a phone: the pseudo-element keeps
      // the hit area finger-sized.
      className="absolute rounded-sm after:absolute after:-inset-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <AnimatePresence>
        {hearts.map((id) => (
          <motion.span
            key={id}
            aria-hidden="true"
            initial={{ opacity: 1, y: 0 }}
            animate={{
              opacity: 0,
              y: -28,
              transition: timed(DURATION.slow * 2),
            }}
            onAnimationComplete={() =>
              setHearts((list) => list.filter((h) => h !== id))
            }
            className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2"
          >
            <Heart />
          </motion.span>
        ))}
      </AnimatePresence>
    </button>
  );
}
