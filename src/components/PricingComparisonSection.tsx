"use client";

import { useState } from "react";
import { Check } from "@/components/icons";
import Reveal from "./Reveal";
import BookFreeSessionModal from "./BookFreeSessionModal";

const PLANS = [
  {
    name: "Starter",
    badge: null,
    price: "Free",
    priceNote: null,
    benefits: ["Matched senior engineer", "Buy 1, 5 or 10 hours anytime"],
    cta: "Get started",
  },
  {
    name: "Pro",
    badge: "Popular" as const,
    price: "$110",
    priceNote: "$55/hr",
    benefits: [
      "Matched senior engineer",
      "Slack community",
      "Cancel anytime",
      "Unused hours rollover to next month",
      "Your projects and recaps kept",
    ],
    cta: "Buy Pro",
  },
  {
    name: "Pro+",
    badge: null,
    price: "$250",
    priceNote: null,
    benefits: ["Everything in Pro", "Get extensive engineering support", "Priority matching"],
    cta: "Buy Pro+",
  },
];

export default function PricingComparisonSection() {
  const [bookOpen, setBookOpen] = useState(false);

  return (
    <section
      aria-labelledby="pricing-comparison-heading"
      className="bg-surface-2 relative left-1/2 mt-24 w-[calc(100vw-1rem)] -translate-x-1/2 rounded-xl p-5 sm:w-[calc(100vw-1.5rem)] sm:p-10 lg:w-[calc(100vw-2.5rem)] lg:p-14"
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
          <p className="text-ink-2 mt-4 max-w-[58ch] text-[15px] leading-relaxed">
            Dev agencies cost $15K+. Full-time engineers are $150K+/year. We can get your vibe coded app running for
            a fraction.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={Math.min(0.2 + i * 0.08, 0.5)}>
              <div
                className={`relative flex h-full flex-col rounded-3xl border p-7 pt-8 ${
                  plan.badge === "Popular" ? "border-brand bg-brand-wash" : "border-line-2 bg-surface"
                }`}
              >
                {plan.badge && (
                  <span className="bg-brand absolute -top-3.5 left-7 rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.04em] text-white uppercase">
                    {plan.badge}
                  </span>
                )}

                <div className="text-[15px] font-semibold">{plan.name}</div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-heading text-[36px] leading-none font-bold tracking-tight">
                    {plan.price}
                  </span>
                  {plan.priceNote && <span className="text-ink-3 text-[14px]">{plan.priceNote}</span>}
                </div>

                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {plan.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-[14px] leading-snug">
                      <Check className="text-online mt-0.5 size-4 shrink-0" strokeWidth={2.5} />
                      <span className="text-ink-2">{b}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => setBookOpen(true)}
                  className={`mt-7 w-full rounded-full py-3 text-[14px] font-semibold text-white transition ${
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
