"use client";

import { useEffect, useRef } from "react";

/**
 * Publishes the cursor's offset from the hero centre as `--topo-x` / `--topo-y`
 * so the contour layers can drift against it. Deliberately tiny: the contour
 * geometry itself stays server-rendered.
 */
export default function TopoParallax({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let pending: { x: number; y: number } | null = null;

    const apply = () => {
      frame = 0;
      if (!pending) return;
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      // -1..1, measured from the centre of the hero.
      const nx = ((pending.x - rect.left) / rect.width - 0.5) * 2;
      const ny = ((pending.y - rect.top) / rect.height - 0.5) * 2;

      el.style.setProperty("--topo-x", `${(-nx * 16).toFixed(2)}px`);
      el.style.setProperty("--topo-y", `${(-ny * 11).toFixed(2)}px`);
    };

    const onMove = (e: PointerEvent) => {
      pending = { x: e.clientX, y: e.clientY };
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0">
      {children}
    </div>
  );
}
