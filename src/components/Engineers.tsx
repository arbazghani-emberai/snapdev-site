"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import BookFreeSessionModal from "./BookFreeSessionModal";
import { ENGINEERS, type Engineer } from "@/data/engineers";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function EngineerCard({ engineer, onBook }: { engineer: Engineer; onBook: () => void }) {
  const { name, role, status, skills, img, hue, specialty, capability } = engineer;
  const firstName = name.split(/\s+/)[0];
  const online = status === "Online";

  return (
    <div className="w-[290px] shrink-0">
      <div
        role="button"
        tabIndex={0}
        aria-label={name}
        className="group border-line hover:border-ink-3 focus-visible:ring-brand/40 block w-full cursor-pointer overflow-hidden rounded-lg border text-left transition focus-visible:ring-2 focus-visible:outline-none"
      >
        <div
          className="relative aspect-[0.93] overflow-hidden"
          style={{
            backgroundColor: `oklch(0.90 0.045 ${hue})`,
            color: `oklch(0.32 0.05 ${hue})`,
          }}
        >
          {img ? (
            <Image
              src={img}
              alt=""
              width={250}
              height={250}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <span className="grid h-full w-full place-items-center text-[44px] font-semibold tracking-tight">
              {initials(name)}
            </span>
          )}
          <span className="bg-surface/95 text-ink-3 absolute bottom-2.5 left-2.5 rounded-full px-2.5 py-1 text-[12px] font-semibold shadow-sm">
            No reviews yet
          </span>
        </div>

        <div className="p-4">
          <div className="font-heading text-[24px] leading-tight font-semibold tracking-tight">{name}</div>

          <div className="mt-0.5 flex items-center gap-3 text-[13px]">
            <span className="text-ink-2 truncate font-medium">{role}</span>
            <span aria-hidden="true" className="bg-line h-3.5 w-px shrink-0" />
            <span className="text-ink-2 flex shrink-0 items-center gap-1.5 font-medium">
              <span
                aria-hidden="true"
                className={`size-1.5 rounded-full ${
                  status === "Online" ? "bg-online" : "bg-ink-3"
                }`}
              />
              {status}
            </span>
          </div>

          <p className="text-ink-2 mt-2 text-[13px] leading-snug">{specialty}</p>

          <div className="mt-2.5 flex flex-nowrap items-center gap-1.5 overflow-hidden">
            <span className="border-line bg-surface text-ink-2 shrink-0 rounded-full border px-3 py-1 text-[12px] font-medium whitespace-nowrap">
              {skills[0]}
            </span>
            <span className="border-line bg-surface text-ink-2 shrink-0 truncate rounded-full border px-3 py-1 text-[12px] font-medium">
              {capability}
            </span>
          </div>
        </div>

        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBook();
            }}
            className={
              online
                ? "bg-brand hover:bg-brand-ink w-full rounded-full py-3 text-[13.5px] font-semibold text-white transition"
                : "border-line hover:bg-surface-2 w-full rounded-full border py-3 text-[13.5px] font-semibold transition"
            }
          >
            {online ? `Talk to ${firstName} now` : `Book ${firstName}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Engineers() {
  const scroller = useRef<HTMLDivElement>(null);
  const [bookOpen, setBookOpen] = useState(false);

  const scrollBy = (dir: 1 | -1) =>
    scroller.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <section
      id="engineers"
      aria-labelledby="top-engineers-heading"
      className="relative left-1/2 mt-16 w-screen -translate-x-1/2 py-14"
    >
      <div className="flex flex-wrap items-end justify-between gap-6 px-5 sm:px-10 lg:px-14">
        <Reveal>
          <h2
            id="top-engineers-heading"
            className="font-heading text-[34px] leading-[1.1] font-semibold tracking-tight md:text-[44px] md:whitespace-nowrap"
          >
            Who you&apos;ll be talking to
          </h2>
          <p className="text-ink-2 mt-4 w-full max-w-[62ch] text-[14.5px] font-medium">
            Every engineer is interviewed, tested and rated by the founders they work with.
          </p>
        </Reveal>

        <div className="hidden gap-3 md:flex">
          <button
            type="button"
            aria-label="Scroll back"
            onClick={() => scrollBy(-1)}
            className="border-line text-ink-3 hover:text-ink flex size-13 items-center justify-center rounded-full border transition"
          >
            <ArrowLeft className="size-[19px]" strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="Scroll forward"
            onClick={() => scrollBy(1)}
            className="border-line text-ink-3 hover:text-ink flex size-13 items-center justify-center rounded-full border transition"
          >
            <ArrowRight className="size-[19px]" strokeWidth={2} />
          </button>
        </div>
      </div>

      <Reveal className="mt-10">
        <div
          ref={scroller}
          className="no-scrollbar flex gap-6 overflow-x-auto px-5 pb-4 sm:px-10 lg:px-14"
        >
          {ENGINEERS.map((e, i) => (
            <EngineerCard key={`${e.name}-${i}`} engineer={e} onBook={() => setBookOpen(true)} />
          ))}
        </div>
      </Reveal>

      <BookFreeSessionModal open={bookOpen} onClose={() => setBookOpen(false)} />
    </section>
  );
}
