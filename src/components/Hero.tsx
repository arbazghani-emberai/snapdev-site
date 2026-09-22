"use client";

import { useState } from "react";
import { ArrowRight } from "@/components/icons";
import TopoLines from "./TopoLines";
import HeroGradient from "./HeroGradient";
import Reveal from "./Reveal";
import BookFreeSessionModal from "./BookFreeSessionModal";

export default function Hero() {
  const [bookOpen, setBookOpen] = useState(false);

  return (
    <section className="from-wash-blue via-wash-blue-soft relative left-1/2 w-[calc(100vw-1rem)] -translate-x-1/2 overflow-hidden rounded-xl bg-gradient-to-b to-white sm:w-[calc(100vw-1.5rem)] lg:w-[calc(100vw-2.5rem)]">
      <HeroGradient />
      <TopoLines opacityScale={0.5} />

      <div className="relative mx-auto flex min-h-[calc(100svh-104px)] w-full max-w-[1600px] flex-col items-center gap-10 px-6 pt-20 pb-16 text-center sm:px-12 sm:pt-28 lg:pt-32">
        <Reveal className="mx-auto max-w-[900px]">
          <h1 className="font-heading text-[clamp(36px,5.2vw,58px)] leading-[1.1] font-semibold tracking-tight">
            App broken? Get a senior engineer on it in minutes.
          </h1>

          <p className="text-ink-2 mx-auto mt-4.5 max-w-[52ch] text-[18.5px] leading-[1.5]">
            Tell us where you&apos;re stuck and we match you with a vetted senior engineer. You leave with the
            problem fixed.
          </p>

          <button
            type="button"
            onClick={() => setBookOpen(true)}
            className="bg-brand hover:bg-brand-ink mt-7 flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-semibold text-white transition"
          >
            Connect with an expert now
            <ArrowRight className="size-4" strokeWidth={2} />
          </button>
        </Reveal>

        <Reveal delay={0.15} className="mx-auto mt-6 w-full max-w-[1240px]">
          <video
            className="border-line-2 aspect-video w-full rounded-md border shadow-[0_30px_80px_-20px_rgba(19,19,19,0.25)]"
            src="/hero/snapdev-hero.mp4"
            poster="/hero/snapdev-hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
          />
        </Reveal>
      </div>

      <BookFreeSessionModal open={bookOpen} onClose={() => setBookOpen(false)} />
    </section>
  );
}
