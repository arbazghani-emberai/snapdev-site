"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "@/components/icons";
import GiveReviewModal from "./GiveReviewModal";
import { SESSION_LOG, type LoggedSession } from "@/data/sessions";

const REVIEW_SESSION_ID = "l1";

type Notification = {
  id: string;
  title: string;
  detail: string;
  time: string;
  read: boolean;
  /** If set, clicking this notification opens the review modal for that logged session. */
  reviewSessionId?: string;
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Khalil replied to your message",
    detail: "“Got it. Let me pull up the code and I'll walk you through it.”",
    time: "2m ago",
    read: false,
  },
  {
    id: "n2",
    title: "Review your call with Ahmed S.",
    detail: "How did the TanStack Query patterns session go? Leave a quick rating.",
    time: "1h ago",
    read: false,
    reviewSessionId: REVIEW_SESSION_ID,
  },
  {
    id: "n3",
    title: "Plan renews soon",
    detail: "Your Starter plan renews on October 3, 2026.",
    time: "1d ago",
    read: true,
  },
];

export default function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [reviewSession, setReviewSession] = useState<LoggedSession | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

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

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleNotificationClick = (n: Notification) => {
    markRead(n.id);
    if (!n.reviewSessionId) return;
    const session = SESSION_LOG.find((s) => s.id === n.reviewSessionId);
    if (!session) return;
    setReviewSession(session);
    setOpen(false);
  };

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
        {unreadCount > 0 && (
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
            <span className="text-ink-3 text-[11.5px] font-medium">{unreadCount} new</span>
          </div>
          <div className="flex flex-col gap-0.5">
            {notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => handleNotificationClick(n)}
                className="hover:bg-surface-2 flex w-full items-start gap-2 rounded-md px-2.5 py-2.5 text-left transition"
              >
                <span
                  aria-hidden="true"
                  className={`mt-1.5 size-1.5 shrink-0 rounded-full ${n.read ? "bg-transparent" : "bg-brand"}`}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className={`text-[13px] ${n.read ? "text-ink-2 font-medium" : "font-semibold"}`}>
                      {n.title}
                    </span>
                    <span className="text-ink-3 shrink-0 text-[11px]">{n.time}</span>
                  </span>
                  <span className="text-ink-2 mt-0.5 block text-[12.5px] leading-relaxed">{n.detail}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <GiveReviewModal session={reviewSession} onClose={() => setReviewSession(null)} />
    </div>
  );
}
