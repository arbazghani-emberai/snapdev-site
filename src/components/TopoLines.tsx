import { buildContours, type ContourLevel } from "@/lib/topo";
import TopoParallax from "./TopoParallax";

const WIDTH = 1600;
const HEIGHT = 900;

// The field is deterministic per seed, so results are cached rather than
// recomputed on every render.
const cache = new Map<number, ContourLevel[]>();

function contoursFor(seed: number): ContourLevel[] {
  let contours = cache.get(seed);
  if (!contours) {
    contours = buildContours({
      width: WIDTH,
      height: HEIGHT,
      seed,
      scale: 260,
      levels: 18,
      cell: 14,
    });
    cache.set(seed, contours);
  }
  return contours;
}

/** Inner contours drift further, which reads as elevation when the cursor moves. */
const DEPTHS = [0.45, 0.8, 1.25];

/**
 * Noise-derived topographic contour lines for a section background.
 *
 * `opacityScale` dials the whole set back for dark surfaces, where the same
 * white strokes read far hotter than they do on the light hero.
 */
export default function TopoLines({
  seed = 21,
  opacityScale = 1,
  stroke = "white",
}: {
  seed?: number;
  opacityScale?: number;
  stroke?: string;
}) {
  const contours = contoursFor(seed);

  return (
    <TopoParallax>
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke={stroke}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute inset-0 h-full w-full"
      >
        {DEPTHS.map((depth, b) => (
          <g
            key={b}
            style={{
              transform: `translate3d(calc(var(--topo-x, 0px) * ${depth}), calc(var(--topo-y, 0px) * ${depth}), 0)`,
              transition: "transform 450ms cubic-bezier(0.22, 0.8, 0.3, 1)",
              willChange: "transform",
            }}
          >
            {contours
              .filter((_, i) => i % DEPTHS.length === b)
              .map((level, i) => (
                <path
                  key={i}
                  d={level.d}
                  opacity={+(level.opacity * opacityScale).toFixed(3)}
                />
              ))}
          </g>
        ))}
      </svg>
    </TopoParallax>
  );
}
