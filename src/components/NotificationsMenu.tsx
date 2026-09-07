"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "@/components/icons";

const NOTIFICATIONS = [
  {
    id: "n1",
    title: "Khalil replied to your message",
    detail: "“Got it. Let me pull up the code and I'll walk you through it.”",
    time: "2m ago",
  },
  {
    id: "n2",
    title: "Session summary ready",
    detail: "Your call with Wajahat A. wrapped up - notes and diffs are saved.",
    time: "1h ago",
  },
  {
    id: "n3",
    title: "Plan renews soon",
    detail: "Your Starter plan renews on October 3, 2026.",
    time: "1d ago",
  },
];

export default function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        aria-expanded={open}
        className="border-line hover:bg-surface-2 relative grid size-9 shrink-0 place-items-center rounded-full border transition"
      >
        <Bell className="size-4" strokeWidth={2} />
        {NOTIFICATIONS.length > 0 && (
          <span
            aria-hidden="true"
            className="bg-brand border-bg absolute top-1 right-1.5 size-2 rounded-full border"
          />
        )}
      </button>

      {open && (
        <div className="animate-menu-in border-line bg-surface absolute top-[calc(100%+10px)] right-0 z-50 w-80 origin-top-right rounded-lg border p-1.5 shadow-xl">
          <div className="flex items-center justify-between px-2.5 pt-1.5 pb-2">
            <span className="text-[13px] font-semibold">Notifications</span>
            <span className="text-ink-3 text-[11.5px] font-medium">{NOTIFICATIONS.length} new</span>
          </div>
          <div className="flex flex-col gap-0.5">
            {NOTIFICATIONS.map((n) => (
              <div key={n.id} className="hover:bg-surface-2 rounded-lg px-2.5 py-2.5 transition">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[13px] font-semibold">{n.title}</span>
                  <span className="text-ink-3 shrink-0 text-[11px]">{n.time}</span>
                </div>
                <p className="text-ink-2 mt-0.5 text-[12.5px] leading-relaxed">{n.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
