import { PixelScene } from '@/components/PixelScene';
import { TOASTER_H, TOASTER_LABEL, TOASTER_W, toaster } from '@/scene/toaster';

/** Cheese toast popping up, beside CTWS's year. */
export function Toaster() {
  return (
    <div className="shrink-0">
      <PixelScene
        scene={toaster}
        width={TOASTER_W}
        height={TOASTER_H}
        label={TOASTER_LABEL}
        className="h-8 w-11"
      />
    </div>
  );
}
