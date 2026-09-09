import Image from "next/image";
import { Play } from "lucide-react";
import Reveal from "./Reveal";

/** lucide dropped its brand icons, so the X mark is inlined. */
function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const STARS = "★★★★★";

type Testimonial = {
  /** The opening line carries the card, so it's set apart from the rest. */
  lead: string;
  rest: string;
  name: string;
  title: string;
  avatar: string;
  date: string;
  /** When set, the card renders as a video still instead of a text quote. */
  poster?: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    lead: "I'm a designer, not a developer.",
    rest: "SnapDev.ai is my unfair advantage, whenever Claude and I get stuck, a real engineer shows up in minutes.",
    name: "Tara Jensen",
    title: "Founder, Mealio",
    avatar: "/img/tara.jpg",
    date: "09/30/2026",
  },
  {
    lead: "The session recaps are gold.",
    rest: "Six months in, I've basically gotten a practical CS education while shipping my actual product.",
    name: "Sam Kowalski",
    title: "Indie builder",
    avatar: "/img/sam.jpg",
    date: "08/14/2026",
    // Same person as the avatar, shot to camera, so the video still reads as
    // this testimonial rather than generic stock.
    poster: "/img/sam-video.jpg",
  },
  {
    lead: "Sofia found a bug in 20 minutes.",
    rest: "I'd fought it for 3 days. The money I spend here buys back my weekends.",
    name: "Alex Morgan",
    title: "First-time founder",
    avatar: "/img/alex.jpg",
    date: "07/02/2026",
  },
];

function VideoCard({ t }: { t: Testimonial }) {
  return (
    <figure className="relative flex aspect-square overflow-hidden rounded-xl">
      <Image
        src={t.poster as string}
        alt=""
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
      {/* Scrims so the overlaid copy stays legible against the photo. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/60"
      />

      <div className="relative flex w-full flex-col p-7">
        <figcaption className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold text-white">{t.name}</div>
            <div className="truncate text-[13px] text-white/75">{t.title}</div>
          </div>
          <span
            aria-hidden="true"
            className="bg-surface grid size-9 shrink-0 place-items-center rounded-sm"
          >
            <XLogo className="text-ink size-3.5" />
          </span>
        </figcaption>

        <div className="flex flex-1 items-center justify-center py-6">
          <button
            type="button"
            aria-label={`Play video testimonial from ${t.name}`}
            className="bg-surface text-ink grid size-14 place-items-center rounded-full shadow-lg transition hover:scale-105"
          >
            <Play className="size-5 translate-x-px fill-current" strokeWidth={0} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span aria-hidden="true" className="text-star text-[15px] tracking-[0.2em]">
            {STARS}
          </span>
          <span className="text-[13px] text-white/75">{t.date}</span>
        </div>
      </div>
    </figure>
  );
}

function QuoteCard({ t }: { t: Testimonial }) {
  return (
    <figure className="border-line hover:border-ink-3 bg-surface flex aspect-square flex-col overflow-hidden rounded-xl border p-7 transition-colors duration-300">
      <figcaption className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image
            src={t.avatar}
            alt=""
            width={44}
            height={44}
            className="size-11 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold">{t.name}</div>
            <div className="text-ink-3 truncate text-[13px]">{t.title}</div>
          </div>
        </div>
        <span
          aria-hidden="true"
          className="bg-surface-2 grid size-9 shrink-0 place-items-center rounded-sm"
        >
          <XLogo className="text-ink size-3.5" />
        </span>
      </figcaption>

      <blockquote className="mt-7">
        <span className="text-ink block text-[17px] leading-snug font-semibold">
          “{t.lead}
        </span>
        <span className="text-ink-2 mt-1.5 block text-[14.5px] leading-relaxed">
          {t.rest}”
        </span>
      </blockquote>

      <div className="mt-auto flex items-center justify-between gap-4 pt-8">
        <span aria-hidden="true" className="text-star text-[15px] tracking-[0.2em]">
          {STARS}
        </span>
        <span className="text-ink-3 text-[13px]">{t.date}</span>
      </div>
    </figure>
  );
}

export default function Testimonials() {
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
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              {t.poster ? <VideoCard t={t} /> : <QuoteCard t={t} />}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
