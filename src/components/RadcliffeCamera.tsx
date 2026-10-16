import { HiddenCat } from '@/components/HiddenCat';
import { PixelScene, SMALL_DISSOLVE } from '@/components/PixelScene';
import {
  RADCLIFFE_CAT_BOX,
  RADCLIFFE_H,
  RADCLIFFE_LABEL,
  RADCLIFFE_W,
  radcliffe,
} from '@/scene/radcliffe';

/**
 * Oxford's entry gets the Radcliffe Camera in the drizzle, the cat beside
 * it. A row of its own on phones, under the dates on wider screens.
 */
export function RadcliffeCamera() {
  return (
    <div className="relative mt-4 basis-full md:mt-6 md:w-[156px]">
      <PixelScene
        scene={radcliffe}
        width={RADCLIFFE_W}
        height={RADCLIFFE_H}
        label={RADCLIFFE_LABEL}
        className="h-24 w-[156px]"
        dissolve={SMALL_DISSOLVE}
      />
      <HiddenCat
        spot="research"
        box={RADCLIFFE_CAT_BOX}
        sceneW={RADCLIFFE_W}
        sceneH={RADCLIFFE_H}
      />
    </div>
  );
}
