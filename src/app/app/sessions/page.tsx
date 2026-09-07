"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, StarOutline, Phone } from "@/components/icons";
import Reveal from "@/components/Reveal";
import ScheduleModal from "@/components/ScheduleModal";
import SessionRowMenu from "@/components/SessionRowMenu";
import SessionActionModal, { type SessionActionKind, type SessionActionTarget } from "@/components/SessionActionModal";
import GiveReviewModal from "@/components/GiveReviewModal";
import { NEXT_SESSION, UPCOMING_SESSIONS, SESSION_LOG, type LoggedSession, type UpcomingSession } from "@/data/sessions";

function Avatar({ engineer, size = 36 }: { engineer: { img: string | null; hue: number }; size?: number }) {
  return (
    <span
      className="relative shrink-0 overflow-hidden rounded-full"
      style={{ width: size, height: size, backgroundColor: `oklch(0.90 0.045 ${engineer.hue})` }}
    >
      {engineer.img && <Image src={engineer.img} alt="" fill className="object-cover" sizes={`${size}px`} />}
    </span>
  );
}

function DateChip({ day, date, time }: { day: string; date?: string; time: string }) {
  return (
    <span className="bg-surface-2 text-ink shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold whitespace-nowrap">
      {day}
      {date ? ` · ${date}` : ""} · {time}
    </span>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-star inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`fill-current size-3 ${i < rating ? "" : "text-line"}`} />
      ))}
    </span>
  );
}

export default function SessionsPage() {
  const [rebookEngineer, setRebookEngineer] = useState<LoggedSession["engineer"] | null>(null);
  const [reviewSession, setReviewSession] = useState<LoggedSession | null>(null);
  const [givenRatings, setGivenRatings] = useState<Record<string, number>>({});
  const [action, setAction] = useState<{ kind: SessionActionKind; target: SessionActionTarget } | null>(null);

  const handlePastAction = (s: LoggedSession) => (item: string) => {
    if (item === "Book again") setRebookEngineer(s.engineer);
    else if (item === "Give a review") setReviewSession(s);
  };

  const handleAction = (s: UpcomingSession) => (item: string) => {
    const target: SessionActionTarget = {
      topic: s.topic,
      engineerName: s.engineer.name,
      day: s.day,
      time: s.time,
    };
    if (item === "Send prep note") setAction({ kind: "prep", target });
    else if (item === "Reschedule") setAction({ kind: "reschedule", target });
    else if (item === "Cancel") setAction({ kind: "cancel", target });
  };

  const laterSessions = UPCOMING_SESSIONS.filter((s) => s.id !== NEXT_SESSION.id);

  const renderUpcomingCard = (s: UpcomingSession) => {
    const isNext = s.id === NEXT_SESSION.id;
    return (
      <div key={s.id} className="border-line bg-surface flex flex-col rounded-xl border p-5">
        <div className="flex items-start justify-between gap-2">
          <DateChip day={s.day} date={s.date} time={s.time} />
          <SessionRowMenu items={["Send prep note", "Reschedule", "Cancel"]} onAction={handleAction(s)} />
        </div>

        <h3 className="font-heading mt-3 text-[16px] font-semibold tracking-tight">{s.topic}</h3>

        <div className="mt-3 flex items-center gap-3">
          <Avatar engineer={s.engineer} size={32} />
          <div className="min-w-0">
            <div className="truncate text-[13.5px] font-semibold">{s.engineer.name}</div>
            <div className="text-ink-2 text-[12px]">
              {s.engineer.role} · {s.duration}
            </div>
          </div>
        </div>

        {isNext && (
          <button
            type="button"
            className="border-line bg-surface-2 hover:bg-line mt-4 rounded-full border px-4 py-2 text-[13px] font-semibold transition"
          >
            Join room
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="py-10">
      <Reveal>
        <h1 className="font-heading text-[28px] font-semibold tracking-tight">Calls</h1>
        <p className="text-ink-2 mt-1.5 text-[14.5px]">
          Everything you&apos;ve booked, are running, or have already shipped from.
        </p>
      </Reveal>

      <Reveal delay={0.05} className="mt-8">
        <h2 className="font-heading text-[17px] font-semibold tracking-tight">Today</h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {renderUpcomingCard(NEXT_SESSION)}
        </div>
      </Reveal>

      {laterSessions.length > 0 && (
        <Reveal delay={0.08} className="mt-8">
          <h2 className="font-heading text-[17px] font-semibold tracking-tight">Upcoming</h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {laterSessions.map(renderUpcomingCard)}
          </div>
        </Reveal>
      )}

      <Reveal delay={0.12} className="mt-8">
        <h2 className="font-heading text-[17px] font-semibold tracking-tight">Past</h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {SESSION_LOG.map((s) => (
            <div key={s.id} className="border-line bg-surface flex flex-col rounded-xl border p-5">
              <div className="flex items-start gap-3">
                <Avatar engineer={s.engineer} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-semibold">{s.topic}</div>
                  <div className="text-ink-2 truncate text-[12px]">
                    {s.engineer.name} · {s.date} · {s.duration}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handlePastAction(s)("Book again")}
                    aria-label="Book again"
                    title="Book again"
                    className="text-ink-3 hover:bg-surface-2 hover:text-ink grid size-8 place-items-center rounded-full transition"
                  >
                    <Phone className="size-4" strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePastAction(s)("Give a review")}
                    aria-label="Give a review"
                    title="Give a review"
                    className="text-ink-3 hover:bg-surface-2 hover:text-ink grid size-8 place-items-center rounded-full transition"
                  >
                    <StarOutline className="size-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>

              {givenRatings[s.id] && (
                <div className="mt-3">
                  <Stars rating={givenRatings[s.id]} />
                </div>
              )}
            </div>
          ))}
        </div>
      </Reveal>

      <ScheduleModal engineer={rebookEngineer} onClose={() => setRebookEngineer(null)} />
      <GiveReviewModal
        session={reviewSession}
        onClose={() => setReviewSession(null)}
        onSubmit={(rating) => {
          if (reviewSession) setGivenRatings((prev) => ({ ...prev, [reviewSession.id]: rating }));
        }}
      />
      <SessionActionModal kind={action?.kind ?? null} target={action?.target ?? null} onClose={() => setAction(null)} />
    </div>
  );
}
