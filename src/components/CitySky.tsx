import { useMemo } from 'react';
import { PixelScene } from '@/components/PixelScene';
import type { Location } from '@/data/home';
import { citySky, SKY_H, SKY_W } from '@/scene/sky';

/** A city's sky right now, beside its local time on Home (decoration). */
export default function CitySky({ name, lat, lon }: Location) {
  const scene = useMemo(() => citySky(name, lat, lon), [name, lat, lon]);
  return (
    <PixelScene
      scene={scene}
      width={SKY_W}
      height={SKY_H}
      className="h-4 w-16 rounded-[3px] shadow-border"
    />
  );
}
