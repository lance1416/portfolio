/**
 * A tiny pixel-art icon from a bitmap (`#` filled, anything else clear), as
 * crisp SVG at any size. Decorative: callers label what it means.
 */
export function PixelIcon({
  bitmap,
  className,
  fill = 'currentColor',
}: {
  bitmap: readonly string[];
  className?: string;
  fill?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${bitmap[0].length} ${bitmap.length}`}
      shapeRendering="crispEdges"
      fill={fill}
      className={className}
    >
      {bitmap.flatMap((row, y) =>
        [...row].map((bit, x) =>
          bit === '#' ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: a fixed bitmap; a pixel's position is its identity
            <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />
          ) : null,
        ),
      )}
    </svg>
  );
}
