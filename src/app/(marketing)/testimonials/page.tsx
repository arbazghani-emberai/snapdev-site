import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Reveal from "@/components/Reveal";
import { ALL_TESTIMONIALS } from "@/data/testimonials";

export const metadata: Metadata = {
  title: "Testimonials - SnapDev.ai",
  description: "Feedback from builders who worked with the SnapDev engineering team.",
};

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

export default function TestimonialsPage() {
  return (
    // Full-bleed breakout, same as the landing page's Testimonials section,
    // so the left/right padding lines up exactly regardless of this route's
    // own layout container.
    <div className="relative left-1/2 w-screen -translate-x-1/2 py-10 sm:py-14">
      <div className="px-5 sm:px-10 lg:px-14">
        <Reveal>
          <Link
            href="/"
            className="text-ink-2 hover:text-ink mb-6 inline-flex items-center gap-1.5 text-[13.5px] font-medium"
          >
            <ArrowLeft className="size-3.5" strokeWidth={2} />
            Back to home
          </Link>

          <h1 className="font-heading text-[34px] leading-[1.1] font-semibold tracking-tight md:text-[44px]">
            Builders Who Shipped
          </h1>
          <p className="text-ink-2 mt-3 max-w-lg text-[15px] leading-relaxed">
            {ALL_TESTIMONIALS.length} builders who worked with our engineering team through SnapCamp and SnapSprint,
            in their own words.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={Math.min(i * 0.04, 0.6)}>
            <figure className="border-line hover:border-ink-3 bg-surface flex h-[440px] flex-col rounded-xl border p-6 transition-colors duration-300">
              <figcaption className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  {t.avatar ? (
                    <Image
                      src={t.avatar}
                      alt=""
                      width={40}
                      height={40}
                      className="size-10 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className={`${tintFor(t.name)} text-ink grid size-10 shrink-0 place-items-center rounded-full text-[13px] font-semibold`}
                    >
                      {initialsFor(t.name)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <div className="truncate text-[14.5px] font-semibold">{t.name}</div>
                    {t.role && <div className="text-ink-3 truncate text-[12.5px]">{t.role}</div>}
                  </div>
                </div>
                <span
                  aria-hidden="true"
                  className="bg-surface-2 text-ink-2 shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                >
                  {t.program}
                </span>
              </figcaption>

              {t.context && <p className="text-ink-3 mt-4 line-clamp-2 text-[12.5px] leading-relaxed">{t.context}</p>}

              <blockquote className="mt-4 min-h-0 flex-1 overflow-hidden">
                <p className="text-ink-2 line-clamp-6 text-[14px] leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              </blockquote>

              <span aria-hidden="true" className="text-star mt-5 block text-[14px] tracking-[0.2em]">
                {STARS}
              </span>
            </figure>
          </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
