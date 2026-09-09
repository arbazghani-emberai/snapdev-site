"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Star, Phone, Lock } from "@/components/icons";
import Reveal from "@/components/Reveal";
import GetUnstuckModal from "@/components/GetUnstuckModal";
import ScheduleModal from "@/components/ScheduleModal";
import { ENGINEER_DIRECTORY, type DirectoryEngineer } from "@/data/engineer-directory";
import { usePlan } from "@/components/PlanProvider";

const TIME_SLOTS = ["7:00 PM", "9:00 PM", "10:00 PM", "9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"];
const REPLY_TIMES = ["~1m", "~2m", "~3m", "~5m"];
const REVIEW_QUOTES = [
  "Great session, solved my bug in minutes.",
  "Really knew the stack, walked me through the fix step by step.",
  "Patient and clear, exactly what I needed to get unstuck.",
  "Shipped the feature same day thanks to this session.",
  "Explained the tradeoffs well, not just the fix.",
  "Would book again, fast and to the point.",
];
const REVIEW_AUTHORS = ["Jordan", "Sam", "Casey", "Riley", "Morgan", "Avery"];
const REVIEW_TIMES_AGO = ["2 days ago", "1 week ago", "3 weeks ago", "1 month ago"];

/** Deterministic mock booking calendar for the next 6 days, seeded off the engineer's hue. */
function weekSchedule(seed: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const count = 2 + ((seed + i) % 2);
    const slots = [...new Set(Array.from({ length: count }, (_, j) => TIME_SLOTS[(seed + i * 3 + j) % TIME_SLOTS.length]))];
    return {
      key: i,
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      timestamp: d.getTime(),
      slots,
    };
  });
}

/** Deterministic mock reviews so the section has believable content without a backend. */
function engineerReviews(engineer: DirectoryEngineer) {
  if (!engineer.rating) return [];
  const seed = engineer.hue;
  const count = Math.min(engineer.reviews, 3);
  return Array.from({ length: count }, (_, i) => ({
    key: i,
    text: REVIEW_QUOTES[(seed + i) % REVIEW_QUOTES.length],
    author: REVIEW_AUTHORS[(seed + i * 2) % REVIEW_AUTHORS.length],
    timeAgo: REVIEW_TIMES_AGO[(seed + i) % REVIEW_TIMES_AGO.length],
  }));
}

export default function EngineerProfilePage() {
  const { hasPlanAtLeast } = usePlan();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [startOpen, setStartOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleSlot, setScheduleSlot] = useState<{ date: number; time: string } | null>(null);

  const engineer = ENGINEER_DIRECTORY[Number(params.id)];

  if (!hasPlanAtLeast("growth")) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-10 text-center">
        <span className="border-line grid size-14 place-items-center rounded-full border-2">
          <Lock className="text-ink-2 size-6" strokeWidth={2} />
        </span>
        <h1 className="font-heading mt-5 text-[22px] font-semibold tracking-tight">This page is locked</h1>
        <p className="text-ink-2 mx-auto mt-2 max-w-xs text-[14.5px] leading-relaxed">
          You need to upgrade to the Growth plan in order to view this page.
        </p>
        <Link
          href="/app/settings?tab=plan"
          className="bg-ink hover:bg-ink/85 text-bg mt-5 rounded-full px-5 py-2.5 text-[13.5px] font-semibold transition"
        >
          View plans
        </Link>
      </div>
    );
  }

  if (!engineer) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-10 text-center">
        <h1 className="font-heading text-[22px] font-semibold tracking-tight">Engineer not found</h1>
        <button
          type="button"
          onClick={() => router.push("/app/engineers")}
          className="text-ink-2 hover:text-ink mt-3 text-[13.5px] font-semibold"
        >
          Back to engineers
        </button>
      </div>
    );
  }

  const online = engineer.status === "Online";
  const schedule = weekSchedule(engineer.hue);
  const reviews = engineerReviews(engineer);

  return (
    <div className="pt-3 pb-10">
      <Reveal>
        <Link
          href="/app/engineers"
          className="text-ink-2 hover:text-ink inline-flex items-center gap-1.5 text-[13px] font-semibold"
        >
          <ArrowLeft className="size-3.5" strokeWidth={2} />
          Back
        </Link>
      </Reveal>

      <Reveal delay={0.05} className="border-line bg-surface mt-2.5 rounded-xl border p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <div
            className="relative aspect-square overflow-hidden rounded-md"
            style={{ backgroundColor: `oklch(0.90 0.045 ${engineer.hue})` }}
          >
            {engineer.img && <Image src={engineer.img} alt="" fill sizes="280px" className="object-cover" />}
          </div>

          <div>
            <div className="text-ink-2 flex items-center gap-1.5 text-[13px] font-medium">
              <span>{engineer.role}</span>
              <span aria-hidden="true" className="bg-line h-3 w-px shrink-0" />
              <span className="flex shrink-0 items-center gap-1.5">
                <span aria-hidden="true" className={`size-1.5 rounded-full ${online ? "bg-online" : "bg-ink-3"}`} />
                {engineer.status}
              </span>
            </div>

            <h1 className="font-heading mt-1.5 text-[32px] font-semibold tracking-tight">{engineer.name}</h1>

            <p className="text-ink-2 mt-3 max-w-xl text-[14.5px] leading-relaxed">{engineer.bio}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {engineer.skills.map((s) => (
                <span
                  key={s}
                  className="border-line bg-surface-2 text-ink-2 rounded-full border px-2.5 py-1 text-[12px] font-medium whitespace-nowrap"
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setScheduleSlot(null);
                  setScheduleOpen(true);
                }}
                className="bg-brand hover:bg-brand-ink flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-[13.5px] font-semibold text-white transition"
              >
                <Phone className="size-3.5" strokeWidth={2} />
                Book a call
              </button>
              <button
                type="button"
                disabled={!online}
                onClick={() => setStartOpen(true)}
                className="border-line hover:border-ink disabled:hover:border-line flex items-center justify-center gap-1.5 rounded-full border px-5 py-2.5 text-[13.5px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                Get unstuck with {engineer.name}
                <ArrowRight className="size-3.5" strokeWidth={2.5} />
              </button>
            </div>

            {!online && (
              <p className="text-ink-3 mt-2.5 text-[12.5px]">
                {engineer.name} is offline right now, book a time instead.
              </p>
            )}

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="bg-surface-2 rounded-md p-4 text-center">
                <div className="font-heading text-[19px] font-semibold tracking-tight">
                  {engineer.rating ?? "—"}
                </div>
                <div className="text-ink-3 mt-0.5 text-[12px]">
                  {engineer.reviews} review{engineer.reviews === 1 ? "" : "s"}
                </div>
              </div>
              <div className="bg-surface-2 rounded-md p-4 text-center">
                <div className="font-heading text-[19px] font-semibold tracking-tight">{engineer.sessions}</div>
                <div className="text-ink-3 mt-0.5 text-[12px]">Sessions</div>
              </div>
              <div className="bg-surface-2 rounded-md p-4 text-center">
                <div className="font-heading text-[19px] font-semibold tracking-tight">
                  {REPLY_TIMES[engineer.hue % REPLY_TIMES.length]}
                </div>
                <div className="text-ink-3 mt-0.5 text-[12px]">Replies in</div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <div className={`mt-6 grid grid-cols-1 gap-6 ${reviews.length > 0 ? "lg:grid-cols-2" : ""}`}>
        <Reveal delay={0.08} className="border-line bg-surface rounded-xl border p-6">
          <h2 className="font-heading text-[16px] font-semibold tracking-tight">This Week</h2>
          <p className="text-ink-2 mt-1 text-[13px]">Pick a time to book it. All times shown in your timezone.</p>

          <div className="mt-5 flex flex-col gap-4">
            {schedule.map((day) => (
              <div key={day.key} className="flex items-start gap-4">
                <div className="w-14 shrink-0 pt-1.5">
                  <div className="text-[13px] font-semibold">{day.weekday}</div>
                  <div className="text-ink-3 text-[12px]">{day.date}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {day.slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        setScheduleSlot({ date: day.timestamp, time: slot });
                        setScheduleOpen(true);
                      }}
                      className="border-line hover:border-ink rounded-full border px-4 py-2 text-[13px] font-semibold transition"
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {reviews.length > 0 && (
          <Reveal delay={0.1} className="border-line bg-surface rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-ink-3 text-[11px] font-bold tracking-[0.06em] uppercase">Reviews</h2>
              <span className="flex items-center gap-1 text-[13px] font-semibold">
                <Star className="text-star size-3.5 fill-current" strokeWidth={0} />
                {engineer.rating} ({engineer.reviews})
              </span>
            </div>

            <div className="mt-4 flex max-h-[420px] flex-col gap-3 overflow-y-auto pr-1">
              {reviews.map((r) => (
                <div key={r.key} className="bg-surface-2 rounded-lg p-4">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="text-star size-3.5 fill-current" strokeWidth={0} />
                    ))}
                  </div>
                  <p className="mt-2 text-[13.5px] leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                  <div className="mt-2 text-[12.5px] font-semibold">
                    {r.author} <span className="text-ink-3 font-normal">· {r.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>

      <GetUnstuckModal open={startOpen} onClose={() => setStartOpen(false)} initialEngineer={engineer} />
      <ScheduleModal
        engineer={scheduleOpen ? engineer : null}
        initialDate={scheduleSlot?.date}
        initialTime={scheduleSlot?.time}
        onClose={() => setScheduleOpen(false)}
      />
    </div>
  );
}
