"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, X } from "@/components/icons";
import { ENGINEERS } from "@/data/engineers";
import BookFreeSessionModal from "./BookFreeSessionModal";

const PROBLEMS = [
  "Deploy failed: missing environment settings",
  "Stripe webhook returning 400, real cards declining",
  "Database: 0 backups configured",
];

const engineer = ENGINEERS.find((e) => e.name === "Khalil") ?? ENGINEERS[0];
const ONLINE_COUNT = ENGINEERS.filter((e) => e.status === "Online").length;
const STACK = ENGINEERS.slice(0, 4);

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const SOLUTIONS = [
  `${engineer.name} joined`,
  "Settings fixed · payments tested · backups on",
  "Live in production, first real signup",
];

/** A before/after comparison: stuck alone vs. paired with an engineer,
 *  in the "session log" style of the reference the redesign is based on.
 *  Header icon/avatar and list-item icons share a fixed-width column so
 *  the heading text and list text land on the same left edge. */
export default function SessionPreview() {
  const [bookOpen, setBookOpen] = useState(false);

  return (
    <div className="w-full text-left">
      <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="border-line bg-surface rounded-lg border p-5">
          <div className="border-line-2 flex items-center gap-3 border-b pb-3.5">
            <span className="bg-surface-2 text-ink-2 grid size-9 shrink-0 place-items-center rounded-full text-[13px] font-semibold">
              ?
            </span>
            <div className="min-w-0">
              <div className="text-[15px] font-semibold">Only you</div>
              <div className="text-ink-3 text-[13px]">No support</div>
            </div>
          </div>

          <ul className="mt-4 flex flex-col gap-3">
            {PROBLEMS.map((problem) => (
              <li key={problem} className="flex items-start gap-2 text-[14px] leading-snug">
                <X className="text-danger mt-0.5 size-4 shrink-0" strokeWidth={2.5} />
                <span className="text-ink-2">{problem}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-line bg-surface rounded-lg border p-5">
          <div className="border-line-2 flex items-center justify-between gap-3 border-b pb-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className="relative size-9 shrink-0 overflow-hidden rounded-full"
                style={{ backgroundColor: `oklch(0.90 0.045 ${engineer.hue})` }}
              >
                {engineer.img && <Image src={engineer.img} alt="" fill className="object-cover" sizes="36px" />}
              </span>
              <div className="min-w-0">
                <div className="truncate text-[15px] font-semibold">{engineer.name}</div>
                <div className="text-ink-3 truncate text-[13px]">{engineer.role} &middot; your free hour</div>
              </div>
            </div>
            <span className="bg-online/10 text-online shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold">
              live
            </span>
          </div>

          <ul className="mt-4 flex flex-col gap-3">
            {SOLUTIONS.map((solution) => (
              <li key={solution} className="flex items-start gap-2 text-[14px] leading-snug">
                <Check className="text-online mt-0.5 size-4 shrink-0" strokeWidth={2.5} />
                <span className="text-ink-2">{solution}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 flex w-full items-stretch gap-3">
        <div className="border-line bg-surface flex min-w-0 flex-1 items-center justify-between gap-3 rounded-full border px-5 py-2.5">
          <span className="flex min-w-0 items-center gap-2.5">
            <span className="relative flex size-2.5 shrink-0">
              <span className="bg-online absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
              <span className="bg-online relative inline-flex size-2.5 rounded-full" />
            </span>
            <span className="truncate text-[14px] font-semibold">
              {ONLINE_COUNT} engineers are available right now.
            </span>
          </span>

          <span className="flex shrink-0 -space-x-2.5">
            {STACK.map((e) => (
              <span
                key={e.name}
                className="border-surface relative size-7 shrink-0 overflow-hidden rounded-full border-2"
                style={{ backgroundColor: `oklch(0.90 0.045 ${e.hue})`, color: `oklch(0.32 0.05 ${e.hue})` }}
              >
                {e.img ? (
                  <Image src={e.img} alt="" fill className="object-cover" sizes="28px" />
                ) : (
                  <span className="grid h-full w-full place-items-center text-[10px] font-semibold">
                    {initials(e.name)}
                  </span>
                )}
              </span>
            ))}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setBookOpen(true)}
          className="bg-brand hover:bg-brand-ink flex shrink-0 items-center justify-center rounded-full px-5 text-[14px] font-medium whitespace-nowrap text-white transition"
        >
          Claim my free hour
        </button>
      </div>

      <BookFreeSessionModal open={bookOpen} onClose={() => setBookOpen(false)} />
    </div>
  );
}
