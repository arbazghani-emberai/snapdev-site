"use client";

import { Check, Globe, Loader } from "lucide-react";
import useInView from "./useInView";

const STEPS = [
  "Installing dependencies",
  "Building project",
  "Running type checks",
];

export default function DeployVisual() {
  const { ref, inView } = useInView<HTMLDivElement>();

  // Only attach the animation class once in view, so the intro doesn't
  // play while the card is still off-screen.
  const anim = (name: string) => (inView ? name : "anim-hidden");

  return (
    <div
      ref={ref}
      className="relative mt-6 flex h-[280px] items-center justify-center overflow-hidden px-5"
    >
      <div
        style={{ animationDelay: "0.05s" }}
        className={`${anim("anim-rise")} border-line-2 bg-surface w-full max-w-[420px] rounded-lg border shadow-sm`}
      >
        <div className="px-3.5 py-3.5">
          {STEPS.map((step, i) => (
            <div
              key={step}
              style={{ animationDelay: `${0.35 + i * 0.28}s` }}
              className={`${anim("anim-rise")} flex items-center gap-2 py-[3px]`}
            >
              <span className="bg-brand-wash grid size-3.5 shrink-0 place-items-center rounded-full">
                <Check className="text-brand-ink size-2.5" strokeWidth={3} />
              </span>
              <span className="text-ink-2 text-[13px] font-medium">{step}</span>
            </div>
          ))}

          <div
            style={{ animationDelay: "1.2s" }}
            className={`${anim("anim-rise")} flex items-center gap-2 py-[3px]`}
          >
            <Loader className="size-3.5 shrink-0 animate-spin text-[#8ec2f7]" strokeWidth={2.5} />
            <span className="text-ink-2 text-[13px] font-medium">
              Deploying to production
            </span>
          </div>

          {/* progress */}
          <div
            style={{ animationDelay: "1.35s" }}
            className={`${anim("anim-rise")} bg-surface-2 mt-2.5 h-1.5 overflow-hidden rounded-full`}
          >
            <div
              style={
                {
                  "--bar": "100%",
                  animationDelay: "1.45s",
                } as React.CSSProperties
              }
              className={`${inView ? "anim-bar" : "w-0"} h-full rounded-full bg-[#8ec2f7]`}
            />
          </div>

          {/* success chip */}
          <div
            style={{ animationDelay: "2.75s" }}
            className={`${anim("anim-pop")} bg-surface-2 mt-3 flex items-center gap-2 rounded-md px-2.5 py-2`}
          >
            <Globe className="text-ink size-3.5 shrink-0" strokeWidth={2.5} />
            <span className="text-ink text-[13px] font-semibold">
              Live at yourapp.vercel.app
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
