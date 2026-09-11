"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import Reveal from "./Reveal";
import { ALL_TESTIMONIALS } from "@/data/testimonials";

const STARS = "★★★★★";

/** Deterministic per name, so the same person always lands on the same tint. */
const AVATAR_TINTS = ["bg-wash-blue", "bg-wash-cream", "bg-wash-pink"];
function tintFor(name: string) {
  const sum = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_TINTS[sum % AVATAR_TINTS.length];
}

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const PAGE_SIZE = 3;

function MoreTestimonialCard({ t }: { t: (typeof ALL_TESTIMONIALS)[number] }) {
  return (
    <figure className="border-line hover:border-ink-3 bg-surface flex aspect-square flex-col overflow-hidden rounded-xl border p-7 transition-colors duration-300">
      <figcaption className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {t.avatar ? (
            <Image
              src={t.avatar}
              alt=""
              width={44}
              height={44}
              className="size-11 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className={`${tintFor(t.name)} text-ink grid size-11 shrink-0 place-items-center rounded-full text-[13px] font-semibold`}
            >
              {initialsFor(t.name)}
            </span>
          )}
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold">{t.name}</div>
            {t.role && <div className="text-ink-3 truncate text-[13px]">{t.role}</div>}
          </div>
        </div>
        <span
          aria-hidden="true"
          className="bg-surface-2 text-ink-2 shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold"
        >
          {t.program}
        </span>
      </figcaption>

      <blockquote className="mt-6 min-h-0 flex-1 overflow-hidden">
        <p className="text-ink-2 line-clamp-6 text-[14.5px] leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
      </blockquote>

      <span aria-hidden="true" className="text-star mt-auto block pt-8 text-[15px] tracking-[0.2em]">
        {STARS}
      </span>
    </figure>
  );
}

export default function Testimonials() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = ALL_TESTIMONIALS.slice(0, visibleCount);
  const hasMore = visibleCount < ALL_TESTIMONIALS.length;

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="relative left-1/2 mt-5 w-screen -translate-x-1/2 py-24"
    >
      <div className="px-5 sm:px-10 lg:px-14">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <h2
            id="testimonials-heading"
            className="font-heading text-[34px] leading-[1.1] font-semibold tracking-tight md:text-[44px]"
          >
            Builders Who Shipped
          </h2>
          <p className="text-ink-2 max-w-xs text-[14.5px] font-medium">
            Non-engineers who took products from idea to launch with an engineer in
            their corner.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((t, i) => (
            <Reveal key={t.name} delay={Math.min(i * 0.06, 0.6)}>
              <MoreTestimonialCard t={t} />
            </Reveal>
          ))}
        </div>

        {hasMore && (
          <Reveal className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, ALL_TESTIMONIALS.length))}
              className="border-line hover:bg-surface-2 flex items-center gap-2 rounded-full border px-5 py-2.5 text-[14px] font-semibold transition"
            >
              Show More
              <ChevronDown className="size-3.5" strokeWidth={2} />
            </button>
          </Reveal>
        )}
      </div>
    </section>
  );
}
