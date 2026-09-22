"use client";

import { useEffect, useState } from "react";
import Reveal from "./Reveal";

type CaseStudy = {
  name: string;
  role: string;
  program: "SnapCamp" | "SnapSprint";
  videoId: string;
  before: string;
  whatWeDid: string;
  result: string;
};

const CASE_STUDIES: CaseStudy[] = [
  {
    name: "Danny Beck",
    role: "Founder & CEO, Tell Pastell",
    program: "SnapCamp",
    videoId: "c268be8d-8384-4efc-834f-229604f41821",
    before: "Stuck 3 weeks. Checkout crashed on every real payment.",
    whatWeDid: "Found it in 20 minutes, fixed payments, set up the live site.",
    result: "Live in 4 days. 52 paying customers in month one.",
  },
  {
    name: "Clement Townsend",
    role: "Founder, Video Pro Learning",
    program: "SnapCamp",
    videoId: "0fe8b7da-171d-4680-90dd-c7553e608b1d",
    before: "App live but leaking user data through an open database.",
    whatWeDid: "Security pass, locked down access, added backups.",
    result: "Passed their first enterprise security review.",
  },
  {
    name: "Cassie Campbell",
    role: "Founder & Principal, Cassie Camp, LLC",
    program: "SnapCamp",
    videoId: "aba9c01f-1db5-44a8-9f8d-eaf28bedf140",
    before: "Quoted $18,000 by an agency to finish the build.",
    whatWeDid: "12 hours with one engineer over two weeks.",
    result: "Launched for under $1,500.",
  },
];

const AUTO_ADVANCE_MS = 6000;

function CaseBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <div className="text-ink-3 text-[11px] font-semibold tracking-[0.08em] uppercase">{label}</div>
      <p className="text-ink-2 mt-1.5 text-[15px] leading-relaxed">{text}</p>
    </div>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const current = CASE_STUDIES[active];

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % CASE_STUDIES.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [active]);

  return (
    <section
      id="results"
      aria-labelledby="testimonials-heading"
      className="relative left-1/2 mt-24 w-screen -translate-x-1/2 py-24"
    >
      <div className="px-5 sm:px-10 lg:px-14">
        <Reveal className="max-w-2xl">
          <h2
            id="testimonials-heading"
            className="font-heading text-[34px] leading-[1.1] font-semibold tracking-tight md:text-[44px]"
          >
            Builders who shipped
          </h2>
          <p className="text-ink-2 mt-4 max-w-[52ch] text-[14.5px] font-medium">
            Non-engineers who took products from idea to launch with an engineer in their corner.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[180px_1.9fr_1fr] lg:gap-5">
          {/* tab list */}
          <div className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1 lg:overflow-visible">
            {CASE_STUDIES.map((c, i) => {
              const isActive = i === active;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setActive(i)}
                  className="relative shrink-0 py-3 pl-4 text-left text-[15px] transition-colors lg:w-full"
                >
                  <span className="bg-line-2 absolute top-0 left-0 h-full w-[2px] overflow-hidden rounded-full">
                    {isActive && (
                      <span
                        key={active}
                        className="bg-brand block h-full w-full origin-top animate-[testimonial-fill_var(--dur)_linear_forwards]"
                        style={{ "--dur": `${AUTO_ADVANCE_MS}ms` } as React.CSSProperties}
                      />
                    )}
                  </span>
                  <span className={isActive ? "text-ink font-semibold" : "text-ink-3 hover:text-ink-2 font-medium"}>
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* video */}
          <div className="border-line-2 bg-ink relative aspect-video w-full overflow-hidden rounded-2xl border">
            <iframe
              key={current.videoId}
              src={`https://embed-v2.testimonial.to/v/${current.videoId}`}
              title={`${current.name} testimonial`}
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              loading="lazy"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>

          {/* case study */}
          <div className="bg-surface-2 rounded-2xl p-7">
            <div className="font-heading text-[24px] leading-tight font-semibold tracking-tight">
              {current.name}
            </div>
            <div className="mt-1 flex items-center gap-2 text-[13.5px]">
              <span className="text-ink-2 font-medium">{current.role}</span>
              <span aria-hidden="true" className="bg-line h-3.5 w-px" />
              <span className="text-ink-3 font-medium">{current.program}</span>
            </div>

            <div className="mt-8 flex flex-col gap-6">
              <CaseBlock label="Before" text={current.before} />
              <CaseBlock label="What we did" text={current.whatWeDid} />
              <CaseBlock label="Result" text={current.result} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
