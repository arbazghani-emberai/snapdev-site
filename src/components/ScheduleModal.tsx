"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Clock, Monitor, Globe, Repeat } from "@/components/icons";
import Modal from "./Modal";
import type { Engineer } from "@/data/engineers";

const LENGTHS: { key: 30 | 60 | 90; label: string }[] = [
  { key: 30, label: "30 min" },
  { key: 60, label: "60 min" },
  { key: 90, label: "90 min" },
];

const REPEATS: { key: "once" | "weekly" | "biweekly" | "monthly"; label: string }[] = [
  { key: "once", label: "Doesn't repeat" },
  { key: "weekly", label: "Weekly" },
  { key: "biweekly", label: "Bi-weekly" },
  { key: "monthly", label: "Monthly" },
];

const SLOT_TIMES = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
];

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export default function ScheduleModal({
  engineer,
  initialDate,
  initialTime,
  fixedLength,
  onConfirmed,
  onClose,
}: {
  engineer: Engineer | null;
  /** Preselects a date/time, e.g. when opened from a specific "This Week" slot. */
  initialDate?: number;
  initialTime?: string;
  /** Locks the session to a fixed length (e.g. a free 20-min intro) and hides
   *  the length/repeat controls, which don't apply to a one-off intro call. */
  fixedLength?: number;
  /** Called once the user actually confirms a date/time, with the booked length. */
  onConfirmed?: (length: number) => void;
  onClose: () => void;
}) {
  const [length, setLength] = useState<30 | 60 | 90>(30);
  const [repeat, setRepeat] = useState<(typeof REPEATS)[number]["key"]>("once");
  const [repeatOpen, setRepeatOpen] = useState(false);
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  // Reset during render (not an effect) whenever a different engineer opens -
  // this instance stays mounted across opens/closes rather than remounting.
  const [prevEngineer, setPrevEngineer] = useState(engineer);
  if (engineer !== prevEngineer) {
    setPrevEngineer(engineer);
    setLength(30);
    setRepeat("once");
    setRepeatOpen(false);
    const now = new Date();
    const initial = initialDate ? new Date(initialDate) : null;
    setMonthOffset(
      initial ? (initial.getFullYear() - now.getFullYear()) * 12 + (initial.getMonth() - now.getMonth()) : 0,
    );
    setSelectedDate(initialDate ?? null);
    setSelectedTime(initialTime ?? null);
    setConfirmed(false);
  }

  const open = engineer !== null;

  const close = () => {
    onClose();
    setTimeout(() => setRepeatOpen(false), 200);
  };

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!engineer || typeof document === "undefined") return null;

  const effectiveLength = fixedLength ?? length;

  const now = new Date();
  const monthDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const monthLabel = monthDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
  const startWeekday = monthDate.getDay();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sel = selectedDate !== null ? new Date(selectedDate) : null;

  const cells: { key: string; day: number | null; date: number | null; disabled: boolean; selected: boolean; isToday: boolean }[] = [];
  for (let i = 0; i < startWeekday; i++) {
    cells.push({ key: `empty-${i}`, day: null, date: null, disabled: true, selected: false, isToday: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(monthDate.getFullYear(), monthDate.getMonth(), d);
    const isPast = dt < today;
    const isWeekend = dt.getDay() === 0 || dt.getDay() === 6;
    const disabled = isPast || isWeekend;
    const selectedCell = !!sel && sel.getTime() === dt.getTime();
    const isToday = dt.getTime() === today.getTime();
    cells.push({ key: `d-${d}`, day: d, date: dt.getTime(), disabled, selected: selectedCell, isToday });
  }

  const seed = sel ? (sel.getDate() * 7) % SLOT_TIMES.length : 0;
  const baseSlots = SLOT_TIMES.filter((_, i) => (i + seed) % 3 !== 0);
  const slots =
    selectedTime && !baseSlots.includes(selectedTime) ? [selectedTime, ...baseSlots] : baseSlots;

  const canConfirm = selectedDate !== null && selectedTime !== null;
  const slotsLabel = sel ? sel.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }) : "";

  const repeatSuffix =
    { once: "", weekly: ", weekly", biweekly: ", every 2 weeks", monthly: ", monthly" }[repeat] || "";
  const summary = sel
    ? `${sel.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })} at ${selectedTime} (${effectiveLength} min)${repeatSuffix}`
    : "";

  if (confirmed) {
    return (
      <Modal open={open} onClose={close} className="max-w-sm text-center">
        <div className="bg-online/15 text-online mx-auto grid size-14 place-items-center rounded-full">
          <Check className="size-6" strokeWidth={2.5} />
        </div>
        <h2 className="font-heading mt-4 text-[22px] font-semibold tracking-tight">Session booked</h2>
        <p className="text-ink-2 mt-2 text-[14px] leading-relaxed">{summary}. We&apos;ll send a calendar invite.</p>
        <div className="border-line-2 bg-surface-2 mx-auto mt-4 flex items-center gap-3 rounded-lg border p-3 text-left">
          <span
            className="relative size-11 shrink-0 overflow-hidden rounded-full"
            style={{ backgroundColor: `oklch(0.90 0.045 ${engineer.hue})` }}
          >
            {engineer.img && <Image src={engineer.img} alt="" fill className="object-cover" sizes="44px" />}
          </span>
          <div className="min-w-0">
            <div className="truncate text-[14.5px] font-semibold">{engineer.name}</div>
            <div className="text-ink-2 text-[12.5px]">{effectiveLength} min session</div>
          </div>
        </div>
        <button
          type="button"
          onClick={close}
          className="bg-ink hover:bg-ink/85 mt-5 w-full rounded-full py-3 text-[14px] font-semibold text-bg transition"
        >
          Done
        </button>
      </Modal>
    );
  }

  // Portaled straight to <body> - nesting this under a sticky, backdrop-blurred
  // header (as on /app/inbox) confuses some browsers' compositing order, and
  // the header ends up painting above the backdrop despite its lower z-index.
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-6">
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="bg-scrim absolute inset-0 cursor-default"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="animate-modal-in bg-surface relative w-full max-w-3xl overflow-hidden rounded-xl shadow-2xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2">
        {/* Left: session details */}
        <div className="border-line-2 border-b p-7 sm:border-r sm:border-b-0">
          <div className="flex items-center gap-2.5">
            <span
              className="relative size-8 shrink-0 overflow-hidden rounded-full"
              style={{ backgroundColor: `oklch(0.90 0.045 ${engineer.hue})` }}
            >
              {engineer.img && <Image src={engineer.img} alt="" fill className="object-cover" sizes="32px" />}
            </span>
            <div className="leading-tight">
              <div className="text-ink-3 text-[10px] font-bold tracking-[0.08em] uppercase">Meet with</div>
              <div className="text-[14px] font-semibold">{engineer.name}</div>
            </div>
          </div>

          <h2 className="font-heading mt-4 text-[19px] font-semibold tracking-tight">{effectiveLength} min session</h2>

          {!fixedLength && (
            <>
              <div className="text-ink-3 mt-4 mb-1.5 text-[11px] font-bold tracking-[0.06em] uppercase">Length</div>
              <div className="bg-surface-2 border-line-2 flex gap-0 rounded-lg border p-1">
                {LENGTHS.map((l) => (
                  <button
                    key={l.key}
                    type="button"
                    onClick={() => setLength(l.key)}
                    className={`flex-1 rounded-md py-1.5 text-[12.5px] font-semibold transition ${
                      length === l.key ? "bg-surface text-ink shadow-sm" : "text-ink-2"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              <div className="text-ink-3 mt-4 mb-1.5 text-[11px] font-bold tracking-[0.06em] uppercase">Repeat</div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRepeatOpen((v) => !v)}
                  className="border-line hover:border-ink-3 flex w-full items-center justify-between gap-2 rounded-lg border p-2.5 text-[13.5px] transition"
                >
                  <span className="text-ink-2 flex items-center gap-2">
                    <Repeat className="size-3.5" strokeWidth={1.75} />
                    {REPEATS.find((r) => r.key === repeat)?.label}
                  </span>
                  <ChevronDown
                    className={`text-ink-3 size-3.5 transition-transform ${repeatOpen ? "rotate-180" : ""}`}
                    strokeWidth={2}
                  />
                </button>
                {repeatOpen && (
                  <div className="animate-menu-in border-line bg-surface absolute top-[calc(100%+6px)] left-0 z-20 w-full origin-top rounded-lg border p-1 shadow-xl">
                    {REPEATS.map((r) => (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => {
                          setRepeat(r.key);
                          setRepeatOpen(false);
                        }}
                        className={`flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-[13px] transition ${
                          repeat === r.key ? "bg-surface-2 font-semibold" : "hover:bg-surface-2"
                        }`}
                      >
                        {r.label}
                        {repeat === r.key && <Check className="size-3.5" strokeWidth={2.5} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="text-ink-2 mt-5 flex flex-col gap-2 text-[13px]">
            <div className="flex items-center gap-2">
              <Clock className="size-3.5 shrink-0" strokeWidth={1.75} />
              {effectiveLength} min
            </div>
            <div className="flex items-center gap-2">
              <Monitor className="size-3.5 shrink-0" strokeWidth={1.75} />
              Zoom / Google Meet
            </div>
            <div className="flex items-center gap-2">
              <Globe className="size-3.5 shrink-0" strokeWidth={1.75} />
              {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </div>
          </div>
        </div>

        {/* Right: calendar */}
        <div className="p-7">
          <div className="mb-3.5 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMonthOffset((v) => Math.max(0, v - 1))}
              aria-label="Previous month"
              disabled={monthOffset === 0}
              className="border-line hover:border-ink disabled:text-ink-3 disabled:hover:border-line grid size-7 place-items-center rounded-md border transition disabled:cursor-not-allowed"
            >
              <ArrowLeft className="size-3.5" strokeWidth={2} />
            </button>
            <div className="text-[14px] font-semibold">{monthLabel}</div>
            <button
              type="button"
              onClick={() => setMonthOffset((v) => v + 1)}
              aria-label="Next month"
              className="border-line hover:border-ink grid size-7 place-items-center rounded-md border transition"
            >
              <ArrowRight className="size-3.5" strokeWidth={2} />
            </button>
          </div>

          <div className="text-ink-3 mb-1.5 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold">
            {WEEKDAY_LABELS.map((w, i) => (
              <div key={i}>{w}</div>
            ))}
          </div>
          <div className="mb-4 grid grid-cols-7 gap-1">
            {cells.map((c) => (
              <button
                key={c.key}
                type="button"
                disabled={c.disabled}
                onClick={() => {
                  if (c.date === null) return;
                  setSelectedDate(c.date);
                  setSelectedTime(null);
                }}
                className={`aspect-square rounded-md border text-[13px] transition ${
                  c.day === null
                    ? "border-transparent"
                    : c.disabled
                      ? "text-ink-3 border-transparent"
                      : c.selected
                        ? "border-ink bg-ink text-bg"
                        : `border-line hover:border-ink-3 ${c.isToday ? "font-bold" : "font-medium"}`
                }`}
              >
                {c.day}
              </button>
            ))}
          </div>

          {sel && (
            <>
              <div className="text-ink-3 mb-2 text-[11px] font-bold tracking-[0.06em] uppercase">{slotsLabel}</div>
              <div className="mb-4 grid max-h-[160px] grid-cols-3 gap-1.5 overflow-y-auto">
                {slots.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedTime(s)}
                    className={`rounded-md border px-1 py-2 text-center text-[12px] font-semibold transition ${
                      selectedTime === s ? "border-ink bg-ink text-bg" : "border-line hover:border-ink-3"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={close}
              className="border-line hover:bg-surface-2 rounded-full border px-4 py-2.5 text-[13.5px] font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canConfirm}
              onClick={() => {
                if (!canConfirm) return;
                setConfirmed(true);
                onConfirmed?.(effectiveLength);
              }}
              className="bg-brand hover:bg-brand-ink disabled:bg-surface-2 disabled:text-ink-3 flex-1 rounded-full py-2.5 text-[13.5px] font-semibold text-white transition disabled:cursor-not-allowed"
            >
              {canConfirm ? "Confirm session" : sel ? "Pick a time" : "Pick a date"}
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
