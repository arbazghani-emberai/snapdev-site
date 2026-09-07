"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Settings, LogOut } from "@/components/icons";
import { CURRENT_USER } from "@/data/app";

export default function AccountMenu() {
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
        aria-label="Account menu"
        aria-expanded={open}
        className="bg-brand-wash text-brand-ink hover:bg-brand hover:text-white grid size-9 place-items-center rounded-full text-[13px] font-bold transition"
      >
        {CURRENT_USER.initials}
      </button>

      {open && (
        <div className="animate-menu-in border-line bg-surface absolute top-[calc(100%+10px)] right-0 z-50 w-64 origin-top-right rounded-lg border p-1.5 shadow-xl">
          <div className="flex items-center gap-3 p-3">
            <span className="bg-brand-wash text-brand-ink grid size-10 shrink-0 place-items-center rounded-full text-[13px] font-bold">
              {CURRENT_USER.initials}
            </span>
            <div className="min-w-0">
              <div className="truncate text-[14px] font-semibold">{CURRENT_USER.name}</div>
              <div className="text-ink-3 truncate text-[12.5px]">{CURRENT_USER.email}</div>
            </div>
          </div>

          <div className="bg-line my-1 h-px" />

          <Link
            href="/app/settings"
            onClick={() => setOpen(false)}
            className="text-ink hover:bg-surface-2 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[14px] font-medium transition"
          >
            <Settings className="size-4" strokeWidth={2} />
            Settings
          </Link>

          <div className="bg-line my-1 h-px" />

          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-danger hover:bg-danger-wash flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[14px] font-medium transition"
          >
            <LogOut className="size-4" strokeWidth={2} />
            Sign out
          </Link>
        </div>
      )}
    </div>
  );
}
