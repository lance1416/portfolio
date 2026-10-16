import { describe, expect, it } from 'vitest';
import { CHECKS, QUBITS, trippedBy } from './surfaceCode';

const ofType = (type: 'X' | 'Z') => CHECKS.filter((c) => c.type === type);

describe('the distance-3 surface code', () => {
  it('has nine qubits and d² − 1 = 8 checks, four of each type', () => {
    expect(QUBITS).toHaveLength(9);
    expect(ofType('X')).toHaveLength(4);
    expect(ofType('Z')).toHaveLength(4);
  });

  it('has every X-check meet every Z-check on an even number of qubits', () => {
    for (const x of ofType('X')) {
      for (const z of ofType('Z')) {
        const shared = x.qubits.filter((i) => z.qubits.includes(i));
        expect(shared.length % 2).toBe(0);
      }
    }
  });

  it('gives every Z-check a spider in the ZX panel, and no X-check one', () => {
    for (const check of CHECKS) {
      expect(Boolean(check.spider)).toBe(check.type === 'Z');
    }
  });

  it('trips one or two Z-checks for an X error, never none', () => {
    const counts = QUBITS.map((_, i) => trippedBy(i).length);
    expect(counts).toEqual([1, 1, 1, 2, 2, 2, 1, 1, 1]);
    // The centre qubit sits in both interior Z faces.
    expect(trippedBy(4).map((k) => CHECKS[k].face.kind)).toEqual([
      'square',
      'square',
    ]);
  });
});
