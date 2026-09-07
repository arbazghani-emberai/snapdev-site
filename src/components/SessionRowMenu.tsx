"use client";

import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Send, Calendar, XCircle, Phone, Star, type IconComponent } from "./icons";

const ITEM_ICON: Record<string, IconComponent> = {
  "Send prep note": Send,
  Reschedule: Calendar,
  Cancel: XCircle,
  "Book again": Phone,
  "Give a review": Star,
};

export default function SessionRowMenu({
  items,
  onAction,
}: {
  items: string[];
  onAction: (item: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-label="Session actions"
        className="text-ink-3 hover:bg-surface-2 hover:text-ink grid size-8 place-items-center rounded-full transition"
      >
        <MoreHorizontal className="size-4" strokeWidth={2} />
      </button>

      {open && (
        <div className="animate-menu-in border-line bg-surface absolute top-[calc(100%+6px)] right-0 z-20 w-44 origin-top-right rounded-sm border p-1 shadow-xl">
          {items.map((item) => {
            const Icon = ITEM_ICON[item];
            const danger = item === "Cancel";
            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setOpen(false);
                  onAction(item);
                }}
                className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] font-medium transition ${
                  danger ? "text-danger hover:bg-danger-wash" : "text-ink hover:bg-surface-2"
                }`}
              >
                {Icon && <Icon className="size-3.5 shrink-0" strokeWidth={1.75} />}
                {item}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
