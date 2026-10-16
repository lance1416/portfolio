/**
 * The pointer's last position, shared by every scene (so the cat can look at
 * it). One passive window listener, added the first time a scene asks.
 */
let last: { x: number; y: number } | null = null;
let listening = false;

function listen() {
  listening = true;
  const track = (e: PointerEvent) => {
    last = { x: e.clientX, y: e.clientY };
  };
  window.addEventListener('pointermove', track, { passive: true });
  window.addEventListener('pointerdown', track, { passive: true });
}

/**
 * Where the pointer is in a canvas's own pixels (it may be outside it), or
 * null before it has moved.
 */
export function pointerIn(canvas: HTMLCanvasElement) {
  if (!listening) listen();
  if (!last) return null;
  const r = canvas.getBoundingClientRect();
  if (!r.width || !r.height) return null;
  return {
    x: ((last.x - r.left) / r.width) * canvas.width,
    y: ((last.y - r.top) / r.height) * canvas.height,
  };
}
