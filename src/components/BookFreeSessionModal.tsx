"use client";

import { useState } from "react";
import Image from "next/image";
import Modal from "./Modal";
import { ArrowLeft, ArrowRight, Star, Check } from "@/components/icons";
import { ENGINEER_DIRECTORY, type DirectoryEngineer } from "@/data/engineer-directory";

const TIME_SLOTS = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
];

const CANDIDATES = ENGINEER_DIRECTORY.slice(0, 5);

function nextWeekdays(count: number) {
  const days: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1);
  while (days.length < count) {
    if (d.getDay() !== 0 && d.getDay() !== 6) days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

const DAYS = nextWeekdays(5);

type Step = "email" | "engineer" | "time" | "done";

export default function BookFreeSessionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [engineer, setEngineer] = useState<DirectoryEngineer | null>(null);
  const [dayIndex, setDayIndex] = useState<number | null>(null);
  const [time, setTime] = useState<string | null>(null);

  // Reset during render (not an effect) whenever the modal is reopened - this
  // instance stays mounted across opens/closes rather than remounting.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setStep("email");
      setEmail("");
      setEngineer(null);
      setDayIndex(null);
      setTime(null);
    }
  }

  const emailValid = /^\S+@\S+\.\S+$/.test(email);

  const close = () => onClose();

  return (
    <Modal open={open} onClose={close} className={step === "time" ? "max-w-2xl" : "max-w-md"}>
      {step !== "email" && step !== "done" && (
        <button
          type="button"
          onClick={() => setStep(step === "time" ? "engineer" : "email")}
          className="text-ink-2 hover:text-ink mb-4 flex items-center gap-1.5 text-[13px] font-semibold"
        >
          <ArrowLeft className="size-3.5" strokeWidth={2} />
          Back
        </button>
      )}

      {step === "email" && (
        <>
          <h2 className="font-heading text-[22px] font-semibold tracking-tight">Book a free 30-minute call</h2>
          <p className="text-ink-2 mt-2 text-[13.5px] leading-relaxed">
            Pick an engineer, pick a time, and the invite lands in your inbox. One free session per email, no
            account needed.
          </p>

          <label className="mt-5 block">
            <span className="text-ink-3 text-[12px] font-semibold tracking-[0.04em] uppercase">Your email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@companyname.com"
              className="border-line focus:border-ink mt-1.5 w-full rounded-lg border p-3 text-[14px] outline-none transition"
            />
          </label>

          <button
            type="button"
            disabled={!emailValid}
            onClick={() => setStep("engineer")}
            className="bg-ink hover:bg-ink/85 disabled:bg-surface-2 disabled:text-ink-3 mt-5 flex w-full items-center justify-center gap-1.5 rounded-full py-3 text-[14px] font-semibold text-bg transition disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight className="size-3.5" strokeWidth={2.5} />
          </button>
        </>
      )}

      {step === "engineer" && (
        <>
          <h2 className="font-heading text-[22px] font-semibold tracking-tight">Pick your engineer</h2>
          <p className="text-ink-2 mt-2 text-[13.5px] leading-relaxed">
            Choose whoever fits your problem, their available times come next.
          </p>

          <div className="mt-5 flex max-h-[360px] flex-col gap-3 overflow-y-auto pr-1">
            {CANDIDATES.map((e) => (
              <div key={e.name} className="border-line rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <span
                    className="relative size-11 shrink-0 overflow-hidden rounded-full"
                    style={{ backgroundColor: `oklch(0.90 0.045 ${e.hue})` }}
                  >
                    {e.img && <Image src={e.img} alt="" fill className="object-cover" sizes="44px" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14.5px] font-semibold">{e.name}</div>
                    <div className="text-ink-2 truncate text-[12.5px]">{e.role}</div>
                  </div>
                  {e.rating && (
                    <span className="flex shrink-0 items-center gap-1 text-[13px] font-semibold">
                      <Star className="text-star size-3.5 fill-current" strokeWidth={0} />
                      {e.rating}
                    </span>
                  )}
                </div>

                <div className="text-ink-2 mt-3 flex flex-col gap-1 text-[12.5px]">
                  {e.rating && (
                    <span className="flex items-center gap-1.5">
                      <Check className="text-online size-3.5" strokeWidth={2.5} />
                      Rated {e.rating} across {e.reviews} review{e.reviews === 1 ? "" : "s"}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <span
                      aria-hidden="true"
                      className={`size-1.5 rounded-full ${e.status === "Online" ? "bg-online" : "bg-ink-3"}`}
                    />
                    {e.status === "Online" ? "Online right now" : "Away right now"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEngineer(e);
                    setDayIndex(null);
                    setTime(null);
                    setStep("time");
                  }}
                  className="bg-ink hover:bg-ink/85 mt-3.5 w-full rounded-full py-2.5 text-[13.5px] font-semibold text-bg transition"
                >
                  Schedule free session
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {step === "time" && engineer && (
        <>
          <div className="flex items-center gap-3">
            <span
              className="relative size-11 shrink-0 overflow-hidden rounded-full"
              style={{ backgroundColor: `oklch(0.90 0.045 ${engineer.hue})` }}
            >
              {engineer.img && <Image src={engineer.img} alt="" fill className="object-cover" sizes="44px" />}
            </span>
            <div className="font-heading text-[19px] font-semibold tracking-tight">{engineer.name}</div>
          </div>

          <p className="text-ink-2 mt-3 text-[13.5px] leading-relaxed">
            Pick a time for your free 30-minute session with {engineer.name}. Times are shown in your timezone.
          </p>

          <div className="mt-4 overflow-x-auto">
            <div className="grid min-w-[520px] grid-cols-5 gap-2">
              {DAYS.map((d, i) => (
                <div key={i} className="text-center text-[12.5px] font-semibold">
                  {d.toLocaleDateString(undefined, { weekday: "short" })}{" "}
                  <span className="text-ink-3 font-normal">
                    {d.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                </div>
              ))}
              {TIME_SLOTS.map((t, ti) =>
                DAYS.map((_, di) => {
                  const selected = dayIndex === di && time === t;
                  return (
                    <button
                      key={`${di}-${ti}`}
                      type="button"
                      onClick={() => {
                        setDayIndex(di);
                        setTime(t);
                      }}
                      className={`rounded-md border px-2 py-2 text-[12.5px] font-semibold transition ${
                        selected ? "border-ink bg-ink text-bg" : "border-line hover:border-ink-3"
                      }`}
                    >
                      {t}
                    </button>
                  );
                }),
              )}
            </div>
          </div>

          <button
            type="button"
            disabled={dayIndex === null || !time}
            onClick={() => setStep("done")}
            className="bg-ink hover:bg-ink/85 disabled:bg-surface-2 disabled:text-ink-3 mt-5 w-full rounded-full py-3 text-[14px] font-semibold text-bg transition disabled:cursor-not-allowed"
          >
            {dayIndex !== null && time
              ? `Book ${DAYS[dayIndex].toLocaleDateString(undefined, { weekday: "short" })} at ${time}`
              : "Pick a time to continue"}
          </button>
        </>
      )}

      {step === "done" && engineer && dayIndex !== null && time && (
        <div className="text-center">
          <div className="bg-online/15 text-online mx-auto grid size-14 place-items-center rounded-full">
            <Check className="size-6" strokeWidth={2.5} />
          </div>
          <h2 className="font-heading mt-4 text-[22px] font-semibold tracking-tight">Session booked</h2>
          <p className="text-ink-2 mt-2 text-[14px] leading-relaxed">
            {DAYS[dayIndex].toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })} at{" "}
            {time} with {engineer.name}. We&apos;ll send the invite to {email}.
          </p>
          <div className="border-line bg-surface-2 mx-auto mt-4 flex items-center gap-3 rounded-lg border p-3 text-left">
            <span
              className="relative size-11 shrink-0 overflow-hidden rounded-full"
              style={{ backgroundColor: `oklch(0.90 0.045 ${engineer.hue})` }}
            >
              {engineer.img && <Image src={engineer.img} alt="" fill className="object-cover" sizes="44px" />}
            </span>
            <div className="min-w-0">
              <div className="truncate text-[14.5px] font-semibold">{engineer.name}</div>
              <div className="text-ink-2 text-[12.5px]">30 min session · free</div>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            className="bg-ink hover:bg-ink/85 mt-5 w-full rounded-full py-3 text-[14px] font-semibold text-bg transition"
          >
            Done
          </button>
        </div>
      )}
    </Modal>
  );
}
