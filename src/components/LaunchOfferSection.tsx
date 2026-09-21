"use client";

import { useState } from "react";
import { Check } from "@/components/icons";
import Reveal from "./Reveal";
import BookFreeSessionModal from "./BookFreeSessionModal";

const ITEMS = [
  {
    title: "60 minutes live with a senior engineer",
    body: "Screen share. They look at your actual app, not a sales script. Billed at your engineer's normal rate, paid by us.",
    value: "[$X]",
  },
  {
    title: "Your problem fixed on the call, or a written Launch Plan",
    body: "What's broken, what's risky, what's left to go live. Plain English.",
    value: "[$300]",
  },
  {
    title: "Security red-flag check",
    body: "The top ways your app could leak data or get abused, and the fix for each.",
    value: "[$200]",
  },
  {
    title: "Honest time and cost estimate",
    body: "You know what finishing costs before you spend a dollar.",
    value: "[$100]",
  },
  {
    title: "Recording and written recap",
    body: "Rewatch it. Send it to a co-founder. It's yours.",
    value: "included",
  },
];

export default function LaunchOfferSection() {
  const [bookOpen, setBookOpen] = useState(false);

  return (
    <section aria-labelledby="offer-heading" className="relative left-1/2 mt-5 w-screen -translate-x-1/2 py-24">
      <div className="px-5 sm:px-10 lg:px-14">
        <Reveal className="text-center">
          <h2
            id="offer-heading"
            className="font-heading text-[34px] leading-[1.1] font-semibold tracking-tight md:text-[44px]"
          >
            The Launch Hour, free
          </h2>
          <p className="text-ink-2 mx-auto mt-4 max-w-[62ch] text-[15px] leading-relaxed">
            Sixty minutes with a vetted senior engineer, completely free while the Founding 1,000 lasts. Here&apos;s
            everything that&apos;s in it.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-10 grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_400px]">
          <div className="border-line bg-surface rounded-2xl border p-6 sm:p-8">
            {ITEMS.map((item, i) => (
              <div
                key={item.title}
                className={`flex items-start justify-between gap-4 py-5 ${i > 0 ? "border-line-2 border-t" : "pt-0"}`}
              >
                <div className="flex items-start gap-3">
                  <Check className="text-online mt-0.5 size-4 shrink-0" strokeWidth={2.5} />
                  <div>
                    <div className="text-[15px] font-semibold">{item.title}</div>
                    <p className="text-ink-2 mt-1 text-[13.5px] leading-relaxed">{item.body}</p>
                  </div>
                </div>
                <span className="text-ink-3 shrink-0 text-[13px] whitespace-nowrap">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="border-brand/30 bg-brand-wash rounded-2xl border p-6 sm:p-8">
            <span className="text-brand text-[12px] font-bold tracking-[0.06em] uppercase">Your price today</span>

            <div className="mt-2 flex items-baseline justify-between gap-3">
              <span className="text-brand font-heading text-[44px] leading-none font-bold tracking-tight">$0</span>
              <span className="text-ink-3 font-mono text-[13px] line-through">Total value [$X]</span>
            </div>

            <div className="border-brand/20 mt-5 flex flex-col gap-2.5 border-t pt-5">
              <div className="flex items-center justify-between gap-3 text-[13.5px]">
                <span className="text-ink-2">Launch Hour &middot; 60 minutes</span>
                <span className="text-ink-3 font-mono line-through">[$X]</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-[13.5px]">
                <span className="text-ink-2">Paid by SnapDev</span>
                <span className="text-brand font-mono font-semibold">- [$X]</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-[14.5px] font-semibold">
                <span>Due today</span>
                <span>$0.00</span>
              </div>
            </div>

            <div className="bg-surface mt-5 rounded-xl p-4 text-[13px] leading-relaxed">
              <span className="text-brand font-semibold">And we&apos;ll cover your second hour too.</span>{" "}
              <span className="text-ink-2">
                Start any package within 48 hours of your Launch Hour and your next hour is on us as well.
              </span>
            </div>

            <button
              type="button"
              onClick={() => setBookOpen(true)}
              className="bg-ink hover:bg-ink/85 mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[14.5px] font-semibold text-white transition"
            >
              Claim my free hour &rarr;
            </button>

            <p className="text-ink-3 mt-3 text-center text-[12px]">No credit card. Cancel by closing the tab.</p>
          </div>
        </Reveal>
      </div>

      <BookFreeSessionModal open={bookOpen} onClose={() => setBookOpen(false)} />
    </section>
  );
}
