import { PixelScene, SMALL_DISSOLVE } from '@/components/PixelScene';
import {
  UC_H,
  UC_LABEL,
  UC_W,
  universityCollege,
} from '@/scene/universityCollege';

/**
 * Toronto's entry gets University College in the snow (no cat here: it's a
 * scene, not a hiding place). A row of its own on phones, under the dates on
 * wider screens.
 */
export function UniversityCollege() {
  return (
    <div className="mt-4 basis-full md:mt-6 md:w-[156px]">
      <PixelScene
        scene={universityCollege}
        width={UC_W}
        height={UC_H}
        label={UC_LABEL}
        className="h-24 w-[156px]"
        dissolve={SMALL_DISSOLVE}
      />
    </div>
  );
}
