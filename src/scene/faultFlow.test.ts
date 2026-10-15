import { describe, expect, it } from 'vitest';
import {
  meetings,
  pointAt,
  routeLength,
  routes,
  travelTime,
} from './faultFlow';

const ends = (kind: 'X' | 'Z') =>
  routes(kind).map((route) => pointAt(route, Number.POSITIVE_INFINITY));

describe('faultFlow', () => {
  it('copies an X error on the control onto both outputs', () => {
    expect(routes('X').map((r) => r[0])).toEqual([
      [20, 40],
      [20, 40],
    ]);
    expect(ends('X')).toEqual([
      [220, 40],
      [220, 100],
    ]);
  });

  it('copies a Z error on the target onto both outputs', () => {
    expect(routes('Z').map((r) => r[0])).toEqual([
      [20, 100],
      [20, 100],
    ]);
    expect(ends('Z')).toEqual([
      [220, 100],
      [220, 40],
    ]);
  });

  it('meets the near node, then the far one', () => {
    const [near, far] = meetings('X');
    expect(near.at).toEqual([120, 40]);
    expect(far.at).toEqual([120, 100]);
    expect(far.time).toBeGreaterThan(near.time);
    expect(travelTime('X')).toBeGreaterThan(far.time);
  });

  it('walks a route by distance, clamped to its ends', () => {
    const [, copy] = routes('X');
    expect(routeLength(copy)).toBe(260);
    expect(pointAt(copy, -5)).toEqual([20, 40]);
    expect(pointAt(copy, 130)).toEqual([120, 70]);
    expect(pointAt(copy, 999)).toEqual([220, 100]);
  });
});
