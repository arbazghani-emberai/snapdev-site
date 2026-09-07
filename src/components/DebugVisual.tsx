"use client";

import { FileCode2, Terminal, TriangleAlert } from "lucide-react";
import useInView from "./useInView";

/** The little tilted source chips that fan out above the before/after pair. */
const SOURCES = [
  { icon: TriangleAlert, rot: "-14deg", delay: 0.35 },
  { icon: Terminal, rot: "-1deg", delay: 0.47 },
  { icon: FileCode2, rot: "13deg", delay: 0.59 },
];

const ERROR_LINES = ["The checkout button stopped working", "Customers can't pay"];

const FIXED_LINES = ["We found the problem", "Shipped the fix"];

export default function DebugVisual() {
  const { ref, inView } = useInView<HTMLDivElement>();

  const anim = (name: string) => (inView ? name : "anim-hidden");

  return (
    <div
      ref={ref}
      className="relative mt-6 h-[280px] overflow-hidden px-5 pt-4"
    >
      <p
        style={{ animationDelay: "0.05s" }}
        className={`${anim("anim-rise")} text-ink text-center text-[15px] font-semibold`}
      >
        We read your errors:
      </p>

      {/* fanned source chips */}
      <div className="mt-3 flex items-center justify-center gap-2.5">
        {SOURCES.map(({ icon: Icon, rot, delay }, i) => (
          <span
            key={i}
            style={
              { "--rot": rot, animationDelay: `${delay}s` } as React.CSSProperties
            }
            className={`${anim("anim-pop")} border-line-2 bg-surface grid size-11 place-items-center rounded-md border shadow-sm`}
          >
            <Icon className="text-ink-2 size-5" strokeWidth={2} />
          </span>
        ))}
      </div>

      {/* before / after pair */}
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <div
          style={{ animationDelay: "0.8s" }}
          className={`${anim("anim-pop")} relative`}
        >
          <span className="bg-surface text-brand-ink absolute -top-2 left-1/2 z-10 -translate-x-1/2 rounded-full px-3 py-1 text-[12px] font-semibold shadow-sm">
            Before
          </span>
          <div
            style={{
              maskImage: "linear-gradient(to bottom, black 65%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 65%, transparent 100%)",
            }}
            className="border-line-2 bg-surface h-full rounded-md border px-3 pt-5 pb-5 shadow-sm"
          >
            {ERROR_LINES.map((line, i) => (
              <span
                key={line}
                style={{ animationDelay: `${1.2 + i * 0.4}s` }}
                className={`${anim("anim-type")} text-ink-2 mt-2 block truncate text-[13px] first:mt-0`}
              >
                {line}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{ animationDelay: "1.05s" }}
          className={`${anim("anim-pop")} relative`}
        >
          <span className="bg-surface text-brand-ink absolute -top-2 left-1/2 z-10 -translate-x-1/2 rounded-full px-3 py-1 text-[12px] font-semibold shadow-sm">
            After
          </span>
          <div
            style={{
              maskImage: "linear-gradient(to bottom, black 65%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 65%, transparent 100%)",
            }}
            className="border-line-2 bg-surface h-full rounded-md border px-3 pt-5 pb-5 shadow-sm"
          >
            {FIXED_LINES.map((line, i) => (
              <span
                key={line}
                style={{ animationDelay: `${2.9 + i * 0.55}s` }}
                className={`${anim("anim-type")} text-ink-2 mt-2 block truncate text-[13px] first:mt-0`}
              >
                {line}
              </span>
            ))}
            <span
              style={{ animationDelay: "4.1s" }}
              className={`${anim("anim-rise")} mt-2.5 flex items-center gap-1.5`}
            >
              <span className="bg-brand-ink size-1.5 rounded-full" />
              <span className="text-brand-ink text-[13px] font-semibold">
                Fixed in 12 min
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
