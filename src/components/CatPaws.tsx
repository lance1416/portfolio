import { PixelIcon } from '@/components/PixelIcon';
import { CAT_SPOTS, useCatsFound } from '@/utils/cats';
import { cn } from '@/utils/cn';

const PAW = ['.#.#.', '#...#', '.###.', '#####', '.###.'];

/**
 * By the footer's ©: a paw print per hiding place, filled once the cat has
 * been found there. Nothing at all until the first one, so visitors who
 * never meet the cat never see it.
 */
export function CatPaws() {
  const found = useCatsFound();
  if (!found.length) return null;
  const summary = `Yuyuan found in ${found.length} of ${CAT_SPOTS.length} places`;
  return (
    <span
      role="img"
      aria-label={summary}
      title={summary}
      // 10px paws (2px per pixel) beside 12px mono: centred, they'd hang 1px
      // below the text, so lift them to sit on its baseline.
      className="relative -top-px flex items-center gap-1 text-zinc-500 dark:text-zinc-400"
    >
      {CAT_SPOTS.map((spot) => (
        <PixelIcon
          key={spot}
          bitmap={PAW}
          className={cn('h-2.5 w-2.5', !found.includes(spot) && 'opacity-30')}
        />
      ))}
    </span>
  );
}
