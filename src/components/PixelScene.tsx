import { useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { SCENE_H, SCENE_W, type SceneFactory } from '@/scene/engine';
import { cn } from '@/utils/cn';

/**
 * A pixel scene (`src/scene/`) on a pixelated canvas: `night` in the dark
 * theme, `dusk` in the light one, rebuilt when the theme changes. It only
 * animates while on screen and the tab is visible; with reduced motion it
 * draws one still frame.
 */
export function PixelScene({
  scene: create,
  label,
  className,
}: {
  /** A module-level factory, so the scene isn't rebuilt every render. */
  scene: SceneFactory;
  label: string;
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
    if (reduced) return;

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
      width={SCENE_W}
      height={SCENE_H}
      role="img"
      aria-label={label}
      className={cn(
        'block aspect-video w-full rounded-lg shadow-border [image-rendering:pixelated]',
        className,
      )}
    />
  );
}
