"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Reveal from "./Reveal";

const FAQS = [
  {
    q: "I'm not technical at all. Will I understand any of it?",
    a: "Yes. You describe your problem in plain English, and your engineer explains everything in terms you understand, no jargon required. You never have to touch code.",
  },
  {
    q: "I only have an idea. Is this for me?",
    a: "It's built more for people who already have something built with AI and are stuck. If you only have an idea, we can still match you for a planning session to map out what to build first.",
  },
  {
    q: "What if they can't fix my problem?",
    a: "That's rare, but if it happens, we'll match you with another engineer at no extra cost until it's resolved. Your first hour is free either way.",
  },
  {
    q: "Will someone steal my idea or my code?",
    a: "No. Every engineer on SnapDev agrees to confidentiality before you're matched, and your code, repo access, and conversation stay private between you and them.",
  },
  {
    q: "My app was built with Lovable, Bolt, Cursor or Replit. Can you help?",
    a: "Yes. Our engineers work across every AI builder and modern stack. Tell us what you used and we'll match you with someone who knows those tools.",
  },
  {
    q: "What happens after my app is live?",
    a: "You can book more time with the same engineer whenever something breaks or you want to add a feature. There's no subscription, you only pay for the hours you use.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section aria-labelledby="faq-heading" className="relative left-1/2 mt-24 w-screen -translate-x-1/2 py-24">
      <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-0">
        <Reveal>
          <h2
            id="faq-heading"
            className="font-heading text-[34px] leading-[1.1] font-semibold tracking-tight md:text-[44px]"
          >
            Frequently asked questions
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="border-line-2 mt-10 border-t">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-line-2 border-b">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="text-[17px] font-medium">{item.q}</span>
                  <ChevronDown
                    className={`text-ink-3 size-5 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    strokeWidth={2}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"}`}
                  style={{ display: "grid" }}
                >
                  <div className="overflow-hidden">
                    <p className="text-ink-2 max-w-[62ch] text-[15px] leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
