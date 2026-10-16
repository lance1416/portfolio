import { HiddenCat } from '@/components/HiddenCat';
import { PixelScene } from '@/components/PixelScene';
import {
  DESK_CAT_BOX,
  DESK_H,
  DESK_LABEL,
  DESK_W,
  lateDesk,
} from '@/scene/desk';

/**
 * The current role's desk, late at night, under its dates — with the cat on
 * it. A row of its own on phones (where the rail runs across), under the
 * dates on wider screens.
 */
export function LateDesk() {
  return (
    <div className="relative mt-4 basis-full md:mt-6 md:w-36">
      <PixelScene
        scene={lateDesk}
        width={DESK_W}
        height={DESK_H}
        label={DESK_LABEL}
        className="h-24 w-36 rounded-md shadow-border"
      />
      <HiddenCat
        spot="experience"
        box={DESK_CAT_BOX}
        sceneW={DESK_W}
        sceneH={DESK_H}
      />
    </div>
  );
}
