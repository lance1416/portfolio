import { usePetHearts } from '@/components/HiddenCat';
import { PixelScene } from '@/components/PixelScene';
import { NAP_H, NAP_W, nap, wake } from '@/scene/nap';
import { cn } from '@/utils/cn';

/**
 * The cat, moved in for good once every hiding place is found: asleep on
 * top of the floating dock (or the footer, where there's no dock). Petting
 * it opens its eyes for a moment, with a heart.
 */
export default function NappingCat({ className }: { className?: string }) {
  const { pet, hearts } = usePetHearts();
  return (
    <button
      type="button"
      aria-label="Pet Yuyuan"
      title="Yuyuan"
      onClick={() => {
        wake();
        pet();
      }}
      className={cn('active:scale-[0.96]', className)}
    >
      <PixelScene
        scene={nap}
        width={NAP_W}
        height={NAP_H}
        className="h-[42px] w-[51px]"
      />
      {hearts}
    </button>
  );
}
