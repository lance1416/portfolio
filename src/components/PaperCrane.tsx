import { HiddenCat } from '@/components/HiddenCat';
import { PixelScene } from '@/components/PixelScene';
import {
  CRANE_CAT_BOX,
  CRANE_H,
  CRANE_LABEL,
  CRANE_W,
  paperCrane,
} from '@/scene/crane';

/** The cat and its paper crane, at the end of Evogami's skills. */
export function PaperCrane() {
  return (
    <div className="relative ml-auto self-end">
      <PixelScene
        scene={paperCrane}
        width={CRANE_W}
        height={CRANE_H}
        label={CRANE_LABEL}
        className="h-8 w-[76px]"
      />
      <HiddenCat
        spot="projects"
        box={CRANE_CAT_BOX}
        sceneW={CRANE_W}
        sceneH={CRANE_H}
      />
    </div>
  );
}
