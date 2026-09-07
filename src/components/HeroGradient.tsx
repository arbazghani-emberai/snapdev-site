/**
 * Two drifting colour blobs behind the hero. Sits under TopoLines so the
 * contours read as a fixed map over shifting terrain colour.
 *
 * The two cycles run at 15s and 19s so they rarely line up and the motion
 * never resolves into an obvious loop.
 */
export default function HeroGradient() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/*
        Placed at opposite corners and at opposite ends of the lightness ramp -
        a mid periwinkle and a purple - so the two colours read as distinct
        accents rather than a single wash.
      */}
      <span
        className="hero-blob hero-blob-a"
        style={{
          background: "var(--color-tint-periwinkle)",
          opacity: 0.5,
          width: "52%",
          height: "56%",
          top: "-12%",
          left: "-6%",
        }}
      />
      <span
        className="hero-blob hero-blob-b"
        style={{
          background: "var(--color-tint-purple)",
          opacity: 0.35,
          width: "54%",
          height: "56%",
          bottom: "-14%",
          right: "-8%",
        }}
      />
    </div>
  );
}
