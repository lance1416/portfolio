import { HiddenCat } from '@/components/HiddenCat';
import { PixelScene } from '@/components/PixelScene';
import {
  RADCLIFFE_CAT_BOX,
  RADCLIFFE_H,
  RADCLIFFE_LABEL,
  RADCLIFFE_W,
  radcliffe,
} from '@/scene/radcliffe';

/**
 * Oxford's entry gets the Radcliffe Camera in the drizzle, the cat in its
 * doorway. A row of its own on phones, under the dates on wider screens.
 */
export function RadcliffeCamera() {
  return (
    <div className="relative mt-4 basis-full md:mt-6 md:w-36">
      <PixelScene
        scene={radcliffe}
        width={RADCLIFFE_W}
        height={RADCLIFFE_H}
        label={RADCLIFFE_LABEL}
        className="h-24 w-36 rounded-md shadow-border"
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
