/**
 * Topographic contour generation: fractal value noise sampled onto a grid,
 * then marching squares to pull isolines out of it - the same idea as the
 * WebGL topo-map shaders, done on the CPU so the hero can ship as plain SVG.
 *
 * Everything here is deterministic for a given seed, so server and client
 * render byte-identical markup.
 */

function hash2(ix: number, iy: number, seed: number): number {
  let h = Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263) ^ Math.imul(seed, 362437);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

/** Cubic fade, so the lattice grid never shows up as straight creases. */
function fade(t: number): number {
  return t * t * (3 - 2 * t);
}

function valueNoise(x: number, y: number, seed: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = fade(x - x0);
  const fy = fade(y - y0);

  const n00 = hash2(x0, y0, seed);
  const n10 = hash2(x0 + 1, y0, seed);
  const n01 = hash2(x0, y0 + 1, seed);
  const n11 = hash2(x0 + 1, y0 + 1, seed);

  const top = n00 + (n10 - n00) * fx;
  const bottom = n01 + (n11 - n01) * fx;
  return top + (bottom - top) * fy;
}

function fbm(x: number, y: number, seed: number, octaves = 4): number {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let total = 0;

  for (let o = 0; o < octaves; o++) {
    value += valueNoise(x * frequency, y * frequency, seed + o * 101) * amplitude;
    total += amplitude;
    amplitude *= 0.5;
    frequency *= 2.03;
  }

  return value / total;
}

type Point = { x: number; y: number };

/**
 * Marching squares over one threshold. Returns loose segments; corners are
 * linearly interpolated so segment endpoints coincide exactly, which lets
 * `chain()` stitch them into long polylines.
 */
function isoSegments(
  field: number[][],
  cols: number,
  rows: number,
  threshold: number,
  cellW: number,
  cellH: number,
): [Point, Point][] {
  const segments: [Point, Point][] = [];

  const lerp = (a: number, b: number) => (threshold - a) / (b - a);

  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const tl = field[r][c];
      const tr = field[r][c + 1];
      const br = field[r + 1][c + 1];
      const bl = field[r + 1][c];

      const idx =
        (tl >= threshold ? 8 : 0) |
        (tr >= threshold ? 4 : 0) |
        (br >= threshold ? 2 : 0) |
        (bl >= threshold ? 1 : 0);

      if (idx === 0 || idx === 15) continue;

      const top = (): Point => ({ x: (c + lerp(tl, tr)) * cellW, y: r * cellH });
      const right = (): Point => ({ x: (c + 1) * cellW, y: (r + lerp(tr, br)) * cellH });
      const bottom = (): Point => ({ x: (c + lerp(bl, br)) * cellW, y: (r + 1) * cellH });
      const left = (): Point => ({ x: c * cellW, y: (r + lerp(tl, bl)) * cellH });

      switch (idx) {
        case 1:
        case 14:
          segments.push([left(), bottom()]);
          break;
        case 2:
        case 13:
          segments.push([bottom(), right()]);
          break;
        case 3:
        case 12:
          segments.push([left(), right()]);
          break;
        case 4:
        case 11:
          segments.push([top(), right()]);
          break;
        case 6:
        case 9:
          segments.push([top(), bottom()]);
          break;
        case 7:
        case 8:
          segments.push([top(), left()]);
          break;
        // Saddles: pick one consistent resolution.
        case 5:
          segments.push([top(), left()]);
          segments.push([bottom(), right()]);
          break;
        case 10:
          segments.push([top(), right()]);
          segments.push([left(), bottom()]);
          break;
      }
    }
  }

  return segments;
}

const key = (p: Point) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`;

/** Stitch coincident segments into polylines so strokes read as continuous curves. */
function chain(segments: [Point, Point][]): Point[][] {
  const adjacency = new Map<string, number[]>();
  segments.forEach(([a, b], i) => {
    for (const p of [a, b]) {
      const k = key(p);
      const list = adjacency.get(k);
      if (list) list.push(i);
      else adjacency.set(k, [i]);
    }
  });

  const used = new Array<boolean>(segments.length).fill(false);
  const polylines: Point[][] = [];

  const step = (from: Point, skip: number): { seg: number; next: Point } | null => {
    for (const i of adjacency.get(key(from)) ?? []) {
      if (used[i] || i === skip) continue;
      const [a, b] = segments[i];
      if (key(a) === key(from)) return { seg: i, next: b };
      if (key(b) === key(from)) return { seg: i, next: a };
    }
    return null;
  };

  for (let i = 0; i < segments.length; i++) {
    if (used[i]) continue;
    used[i] = true;

    const [start, end] = segments[i];
    const line = [start, end];

    // Extend forward from the tail.
    let cursor = end;
    for (;;) {
      const hit = step(cursor, -1);
      if (!hit) break;
      used[hit.seg] = true;
      line.push(hit.next);
      cursor = hit.next;
    }

    // Then backward from the head.
    cursor = start;
    for (;;) {
      const hit = step(cursor, -1);
      if (!hit) break;
      used[hit.seg] = true;
      line.unshift(hit.next);
      cursor = hit.next;
    }

    if (line.length > 2) polylines.push(line);
  }

  return polylines;
}

export type ContourLevel = { d: string; opacity: number };

/**
 * Build the contour set for a `width` x `height` viewBox.
 *
 * `scale` controls how large the terrain features are - bigger means broader,
 * calmer blobs; `levels` is how many isolines to slice the field into.
 */
export function buildContours({
  width,
  height,
  seed = 7,
  scale = 300,
  levels = 16,
  cell = 14,
}: {
  width: number;
  height: number;
  seed?: number;
  scale?: number;
  levels?: number;
  cell?: number;
}): ContourLevel[] {
  const cols = Math.ceil(width / cell) + 1;
  const rows = Math.ceil(height / cell) + 1;
  const cellW = width / (cols - 1);
  const cellH = height / (rows - 1);

  const field: number[][] = [];
  let min = Infinity;
  let max = -Infinity;

  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      const v = fbm((c * cellW) / scale, (r * cellH) / scale, seed);
      row.push(v);
      if (v < min) min = v;
      if (v > max) max = v;
    }
    field.push(row);
  }

  const out: ContourLevel[] = [];

  for (let l = 1; l < levels; l++) {
    const t = min + ((max - min) * l) / levels;
    const polylines = chain(isoSegments(field, cols, rows, t, cellW, cellH));
    if (!polylines.length) continue;

    const d = polylines
      .map(
        (line) =>
          `M${line
            .map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
            .join("L")}`,
      )
      .join("");

    // Alternate weight a little so the map reads as layered elevation
    // rather than a flat set of equal rings.
    out.push({ d, opacity: l % 3 === 0 ? 0.58 : l % 2 === 0 ? 0.36 : 0.47 });
  }

  return out;
}
