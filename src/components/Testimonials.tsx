"use client";

import { useState } from "react";
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
    before: "Stuck [3 weeks]. [Describe what was blocking launch].",
    whatWeDid: "[Matched with a senior engineer for X hours]. [Describe the fix].",
    result: "[Describe the real outcome — replace with Danny's actual numbers].",
  },
  {
    name: "Clement Townsend",
    role: "Founder, Video Pro Learning",
    program: "SnapCamp",
    videoId: "0fe8b7da-171d-4680-90dd-c7553e608b1d",
    before: "[Describe what was broken or stuck before SnapDev].",
    whatWeDid: "[Describe the hands-on support Clement got].",
    result: "[Describe the real outcome — replace with Clement's actual numbers].",
  },
  {
    name: "Cassie Campbell",
    role: "Founder & Principal, Cassie Camp, LLC",
    program: "SnapCamp",
    videoId: "aba9c01f-1db5-44a8-9f8d-eaf28bedf140",
    before: "[Describe what was broken or stuck before SnapDev].",
    whatWeDid: "[Describe the hands-on support Cassie got].",
    result: "[Describe the real outcome — replace with Cassie's actual numbers].",
  },
];

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

  return (
    <section
      id="results"
      aria-labelledby="testimonials-heading"
      className="relative left-1/2 mt-24 w-screen -translate-x-1/2 py-24"
    >
      <div className="px-5 sm:px-10 lg:px-14">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2
            id="testimonials-heading"
            className="font-heading text-[34px] leading-[1.1] font-semibold tracking-tight md:text-[44px]"
          >
            Builders who shipped
          </h2>
          <p className="text-ink-2 mx-auto mt-4 max-w-[52ch] text-[14.5px] font-medium">
            Non-engineers who took products from idea to launch with an engineer in their corner.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[220px_360px_1fr] lg:gap-14">
          {/* tab list */}
          <div className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1 lg:overflow-visible">
            {CASE_STUDIES.map((c, i) => {
              const isActive = i === active;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`shrink-0 border-l-2 py-3 pl-4 text-left text-[15px] transition-colors lg:w-full ${
                    isActive
                      ? "border-brand text-ink font-semibold"
                      : "border-line-2 text-ink-3 hover:text-ink-2 font-medium"
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>

          {/* video */}
          <div className="border-line-2 bg-ink relative aspect-[4/5] w-full overflow-hidden rounded-2xl border">
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
          <div>
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
