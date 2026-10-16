import { PixelScene } from '@/components/PixelScene';
import { DISK_H, DISK_LABEL, DISK_W, hardDisk } from '@/scene/hardDisk';

/** A seeking disk and Ferris, beside KidneyOS's year. */
export function HardDisk() {
  return (
    <div className="shrink-0">
      <PixelScene
        scene={hardDisk}
        width={DISK_W}
        height={DISK_H}
        label={DISK_LABEL}
        className="h-8 w-[76px]"
      />
    </div>
  );
}
