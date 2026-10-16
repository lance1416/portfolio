import { PixelScene } from '@/components/PixelScene';
import { catPortrait, PORTRAIT_H, PORTRAIT_W } from '@/scene/catPortrait';
import { CAT_HINTS, CAT_SPOTS, useCatsFound } from '@/utils/cats';

/**
 * Terminal `cat` with nothing to print: the cat, how many of its
 * hiding places have been found, and a line on where to look for each.
 */
export function CatStatus() {
  const found = useCatsFound();
  const all = found.length === CAT_SPOTS.length;

  return (
    <div className="my-1 flex items-start gap-4">
      <PixelScene
        scene={catPortrait}
        width={PORTRAIT_W}
        height={PORTRAIT_H}
        label="Yuyuan, a lilac British Shorthair, in pixel art"
        className="h-[60px] w-[65px] shrink-0"
      />
      <div>
        <p className="text-zinc-100">
          Yuyuan · found {found.length} of {CAT_SPOTS.length}
        </p>
        <ul>
          {CAT_SPOTS.map((spot) => (
            <li
              key={spot}
              className={
                found.includes(spot) ? 'text-zinc-300' : 'text-zinc-500'
              }
            >
              <span aria-hidden="true">
                {found.includes(spot) ? '✓' : '·'}{' '}
              </span>
              {CAT_HINTS[spot]}
              <span className="sr-only">
                {found.includes(spot) ? ' (found)' : ' (not yet)'}
              </span>
            </li>
          ))}
        </ul>
        {all && <p className="mt-1 text-zinc-300">Yuyuan has moved in.</p>}
      </div>
    </div>
  );
}
