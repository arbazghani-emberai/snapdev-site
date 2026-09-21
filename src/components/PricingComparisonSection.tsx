"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import BookFreeSessionModal from "./BookFreeSessionModal";

const COMPARISON = [
  {
    label: "Dev agency",
    price: "$10,000 to $50,000+",
    suffix: " and weeks of waiting",
  },
  {
    label: "Full-time engineer",
    price: "$150,000+",
    suffix: "/year",
  },
  {
    label: "SnapDev",
    price: "first hour free",
    suffix: ", then from $129/mo",
  },
];

const PLANS = [
  {
    name: "Starter",
    badge: null,
    price: "$19",
    hours: "Pay as you go",
    rate: "$60/hr",
    off: null,
    cta: "Buy Starter",
  },
  {
    name: "Pro",
    badge: "Popular" as const,
    price: "$129",
    hours: "2 hrs/mo",
    rate: "$55/hr",
    off: "8% off",
    cta: "Buy Pro",
  },
  {
    name: "Pro+",
    badge: null,
    price: "$269",
    hours: "5 hrs/mo",
    rate: "$50/hr",
    off: "17% off",
    cta: "Buy Pro+",
  },
  {
    name: "Growth",
    badge: null,
    price: "$469",
    hours: "10 hrs/mo",
    rate: "$45/hr",
    off: "25% off",
    cta: "Buy Growth",
  },
  {
    name: "Partner",
    badge: null,
    price: "$994",
    hours: "25 hrs/mo",
    rate: "$39/hr",
    off: "35% off",
    cta: "Buy Partner",
  },
];

export default function PricingComparisonSection() {
  const [bookOpen, setBookOpen] = useState(false);

  return (
    <section
      aria-labelledby="pricing-comparison-heading"
      className="bg-surface-2 relative left-1/2 mt-5 w-[calc(100vw-1rem)] -translate-x-1/2 rounded-xl p-5 sm:w-[calc(100vw-1.5rem)] sm:p-10 lg:w-[calc(100vw-2.5rem)] lg:p-14"
    >
      <div>
        <Reveal>
          <h2
            id="pricing-comparison-heading"
            className="font-heading text-[34px] leading-[1.1] font-semibold tracking-tight md:text-[44px]"
          >
            Senior engineers.
            <br />
            Without agency prices.
          </h2>
          <p className="text-ink-2 mt-4 max-w-[52ch] text-[15px] leading-relaxed">
            Hours are the whole currency here. Every plan is a monthly allowance of engineering time with a real
            person, and unused hours never expire.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="bg-surface mt-10 flex flex-col divide-y overflow-hidden rounded-2xl sm:flex-row sm:divide-x sm:divide-y-0 divide-line-2">
            {COMPARISON.map(({ label, price, suffix }) => (
              <div key={label} className="flex-1 px-6 py-5 text-[14.5px]">
                <span className="text-ink-2">{label} </span>
                <span className="font-semibold">{price}</span>
                <span className="text-ink-2">{suffix}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={Math.min(0.2 + i * 0.06, 0.5)}>
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-6 pt-8 ${
                  plan.badge === "Popular" ? "border-brand bg-brand-wash" : "border-line-2 bg-surface"
                }`}
              >
                {plan.badge && (
                  <span
                    className={`absolute -top-3.5 left-6 rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.04em] uppercase ${
                      plan.badge === "Popular" ? "bg-brand text-white" : "border-line-2 bg-surface border text-ink-2"
                    }`}
                  >
                    {plan.badge}
                  </span>
                )}

                <div className="text-[15px] font-semibold">{plan.name}</div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-heading text-[32px] leading-none font-bold tracking-tight">{plan.price}</span>
                  <span className="text-ink-3 text-[14px]">/mo</span>
                </div>

                <div className="border-line-2 mt-5 border-t pt-5">
                  <div className="text-ink-3 text-[11px] font-semibold tracking-[0.05em] uppercase">
                    Hours included
                  </div>
                  <div className="mt-1 text-[15px] font-semibold">{plan.hours}</div>
                </div>

                <div className="border-line-2 mt-5 border-t pt-5">
                  <div className="text-ink-3 text-[11px] font-semibold tracking-[0.05em] uppercase">
                    Rate per hour
                  </div>
                  <div className="mt-1 text-[15px]">
                    <span className="font-semibold">{plan.rate}</span>
                    {plan.off && <span className="text-online ml-1.5 text-[13px] font-semibold">{plan.off}</span>}
                  </div>
                  <div className="text-ink-3 mt-1 text-[13px]">$19 platform fee</div>
                </div>

                <button
                  type="button"
                  onClick={() => setBookOpen(true)}
                  className={`mt-6 w-full rounded-full py-3 text-[14px] font-semibold text-white transition ${
                    plan.badge === "Popular" ? "bg-brand hover:bg-brand-ink" : "bg-ink hover:bg-ink/85"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <BookFreeSessionModal open={bookOpen} onClose={() => setBookOpen(false)} />
    </section>
  );
}
