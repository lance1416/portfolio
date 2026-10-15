import { describe, expect, it } from 'vitest';
import { sunPosition } from './sky';

const OXFORD = [51.75, -1.26] as const;
const BEIJING = [39.9, 116.4] as const;

describe('sunPosition', () => {
  it('puts the midsummer noon sun high in the south over Oxford', () => {
    // Solar noon in Oxford is ~12:05 UTC; 90° − 51.75° + 23.44° ≈ 61.7°.
    const { elevation, azimuth } = sunPosition(
      new Date('2026-06-21T12:05:00Z'),
      ...OXFORD,
    );
    expect(elevation).toBeCloseTo(61.7, 0);
    expect(azimuth).toBeGreaterThan(175);
    expect(azimuth).toBeLessThan(185);
  });

  it('has it below the horizon at midnight', () => {
    const { elevation } = sunPosition(
      new Date('2026-06-21T00:05:00Z'),
      ...OXFORD,
    );
    expect(elevation).toBeLessThan(-10);
  });

  it('rises in the east and sets in the west at the equinox', () => {
    // Beijing is UTC+8 with local solar noon ~12:14; sunrise ~06:15 local.
    const morning = sunPosition(new Date('2026-03-20T23:00:00Z'), ...BEIJING);
    const evening = sunPosition(new Date('2026-03-21T10:00:00Z'), ...BEIJING);
    expect(morning.elevation).toBeGreaterThan(0);
    expect(morning.azimuth).toBeGreaterThan(80);
    expect(morning.azimuth).toBeLessThan(120);
    expect(evening.elevation).toBeGreaterThan(0);
    expect(evening.azimuth).toBeGreaterThan(240);
    expect(evening.azimuth).toBeLessThan(280);
  });
});
