import { useReducedMotion } from 'motion/react';
import { type CSSProperties, useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { SCENE_H, SCENE_W, type SceneFactory } from '@/scene/engine';
import { cn } from '@/utils/cn';

/** A full-size scene: 16:9 and column-wide (it fades out at its edges). */
export const SCENE_FRAME = 'aspect-video w-full';

/** How far a full-size scene fades in from its edges. */
export const SCENE_DISSOLVE = { x: 40, y: 20 };

/** How far a small (rail-sized) scene fades in from its edges. */
export const SMALL_DISSOLVE = { x: 6, y: 3 };

/**
 * A soft mask: a gradient across and a gradient down, intersected, so the
 * canvas fades smoothly to transparent within `x`/`y` percent of its edges.
 */
function fadeMask(x: number, y: number): CSSProperties {
  const across = `linear-gradient(to right, transparent, #000 ${x}%, #000 ${100 - x}%, transparent)`;
  const down = `linear-gradient(to bottom, transparent, #000 ${y}%, #000 ${100 - y}%, transparent)`;
  const image = `${across}, ${down}`;
  return {
    maskImage: image,
    maskComposite: 'intersect',
    WebkitMaskImage: image,
    WebkitMaskComposite: 'source-in',
  };
}

/**
 * A pixel scene (`src/scene/`) on a pixelated canvas: `night` in the dark
 * theme, `dusk` in the light one, rebuilt when the theme changes. It only
 * animates while on screen and the tab is visible; with reduced motion it
 * draws a still frame, redrawn each minute (for scenes that follow the clock).
 * Without a `label` it's decoration, ignored by screen readers. `dissolve`
 * fades its edges softly into the page, so it has no hard frame.
 */
export function PixelScene({
  scene: create,
  label,
  width = SCENE_W,
  height = SCENE_H,
  dissolve,
  className,
}: {
  /** A stable factory (module-level or memoised), or the scene restarts. */
  scene: SceneFactory;
  label?: string;
  width?: number;
  height?: number;
  /** How far in to fade from the sides (x) and the top and bottom (y), in scene pixels. */
  dissolve?: { x: number; y: number };
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const scene = create(ctx, isDark ? 'night' : 'dusk');
    scene.render();
    if (reduced) {
      const timer = setInterval(() => {
        scene.update(0);
        scene.render();
      }, 60_000);
      return () => clearInterval(timer);
    }

    let frame = 0;
    let last = 0;
    let onScreen = false;
    const loop = (now: number) => {
      // Clamp the step so a long stall doesn't fling every particle at once.
      scene.update(last ? Math.min((now - last) / 1000, 0.05) : 0);
      scene.render();
      last = now;
      frame = requestAnimationFrame(loop);
    };
    const sync = () => {
      if (onScreen && !document.hidden) {
        if (!frame) {
          last = 0;
          frame = requestAnimationFrame(loop);
        }
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    observer.observe(canvas);
    document.addEventListener('visibilitychange', sync);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [create, isDark, reduced]);

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      {...(label && { role: 'img', 'aria-label': label })}
      style={
        dissolve &&
        fadeMask((dissolve.x / width) * 100, (dissolve.y / height) * 100)
      }
      className={cn('block [image-rendering:pixelated]', className)}
    />
  );
}
