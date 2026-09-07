"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";
import ScheduleModal from "./ScheduleModal";
import { Check, ChevronDown, AlertTriangle } from "./icons";
import { ENGINEERS } from "@/data/engineers";

export type SessionActionKind = "prep" | "reschedule" | "cancel";
export type SessionActionTarget = { topic: string; engineerName: string; day: string; time: string };

const RESCHEDULE_SLOTS = [
  { label: "Tomorrow · 10:00 AM" },
  { label: "Tomorrow · 2:30 PM" },
  { label: "Thu · 9:00 AM" },
  { label: "Thu · 4:00 PM" },
  { label: "Fri · 11:00 AM" },
];

export default function SessionActionModal({
  kind,
  target,
  onClose,
}: {
  kind: SessionActionKind | null;
  target: SessionActionTarget | null;
  onClose: () => void;
}) {
  const [note, setNote] = useState("");
  const [reason, setReason] = useState("");
  const [done, setDone] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const open = kind !== null && target !== null;

  // Reset during render (not an effect) whenever a different action opens -
  // this instance stays mounted across opens/closes rather than remounting.
  const [prevTarget, setPrevTarget] = useState(target);
  if (target !== prevTarget) {
    setPrevTarget(target);
    setNote("");
    setReason("");
    setDone(null);
    setCalendarOpen(false);
  }

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(onClose, 1400);
    return () => clearTimeout(t);
  }, [done, onClose]);

  if (!open || !target) return null;

  if (calendarOpen) {
    const engineer = ENGINEERS.find((e) => e.name === target.engineerName) ?? null;
    return (
      <ScheduleModal
        engineer={engineer}
        onClose={() => {
          setCalendarOpen(false);
          onClose();
        }}
      />
    );
  }

  if (done) {
    return (
      <Modal open={open} onClose={onClose} className="max-w-sm text-center">
        <div className="bg-online/15 text-online mx-auto grid size-12 place-items-center rounded-full">
          <Check className="size-5" strokeWidth={2.5} />
        </div>
        <p className="mt-4 text-[14.5px] font-semibold">{done}</p>
      </Modal>
    );
  }

  if (kind === "prep") {
    return (
      <Modal open={open} onClose={onClose} className="max-w-md">
        <h3 className="font-heading text-[19px] font-semibold tracking-tight">
          Give {target.engineerName} a head start
        </h3>
        <p className="text-ink-2 mt-1 text-[13px]">
          They&apos;ll see this before your call on {target.day} at {target.time}.
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={5}
          placeholder="What's on your mind? Paste error logs, share links, or describe the problem..."
          className="border-line focus:border-ink bg-surface-2 focus:bg-surface mt-4 w-full resize-y rounded-sm border p-3 text-[14px] leading-relaxed outline-none transition"
        />
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            disabled={!note.trim()}
            onClick={() => setDone(`Prep note sent to ${target.engineerName}`)}
            className="bg-ink hover:bg-ink/85 disabled:bg-surface-2 disabled:text-ink-3 rounded-full px-5 py-2.5 text-[13px] font-semibold text-bg transition disabled:cursor-not-allowed"
          >
            Send note
          </button>
        </div>
      </Modal>
    );
  }

  if (kind === "reschedule") {
    return (
      <Modal open={open} onClose={onClose} className="max-w-md">
        <h3 className="font-heading text-[19px] font-semibold tracking-tight">{target.topic}</h3>
        <p className="text-ink-2 mt-1 text-[13px]">
          with {target.engineerName} · currently {target.day} at {target.time}
        </p>
        <div className="text-ink-3 mt-5 mb-2.5 text-[11.5px] font-semibold tracking-[0.06em] uppercase">
          Suggested times
        </div>
        <div className="flex flex-col gap-2">
          {RESCHEDULE_SLOTS.map((slot) => (
            <button
              key={slot.label}
              type="button"
              onClick={() => setDone(`Call moved to ${slot.label}`)}
              className="border-line hover:border-ink flex items-center justify-between gap-3 rounded-sm border p-3 text-left transition"
            >
              <div className="text-[14px] font-semibold">{slot.label}</div>
              <ChevronDown className="text-ink-3 size-4 -rotate-90" strokeWidth={2} />
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setCalendarOpen(true)}
            className="text-ink hover:text-ink-2 text-[13px] font-semibold"
          >
            See all times
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose} className="max-w-sm">
      <div className="bg-danger-wash text-danger grid size-11 place-items-center rounded-full">
        <AlertTriangle className="size-5" strokeWidth={2} />
      </div>
      <h3 className="font-heading mt-4 text-[19px] font-semibold tracking-tight">Cancel this call?</h3>
      <p className="text-ink-2 mt-1.5 text-[13.5px] leading-relaxed">
        You&apos;re cancelling <span className="text-ink font-semibold">{target.topic}</span> with{" "}
        {target.engineerName} on {target.day} at {target.time}. Cancellations within 2 hours may still be
        charged.
      </p>
      <label className="text-ink-3 mt-5 block text-[11.5px] font-semibold tracking-[0.06em] uppercase">
        Reason (optional)
      </label>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={3}
        placeholder="Let them know why (they'll see this)"
        className="border-line focus:border-ink bg-surface-2 focus:bg-surface mt-2 w-full resize-y rounded-sm border p-3 text-[14px] leading-relaxed outline-none transition"
      />
      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="border-line hover:bg-surface-2 rounded-full border px-4 py-2.5 text-[13px] font-semibold transition"
        >
          Keep call
        </button>
        <button
          type="button"
          onClick={() => setDone("Call cancelled")}
          className="bg-danger hover:bg-danger/85 rounded-full px-4 py-2.5 text-[13px] font-semibold text-white transition"
        >
          Cancel call
        </button>
      </div>
    </Modal>
  );
}
