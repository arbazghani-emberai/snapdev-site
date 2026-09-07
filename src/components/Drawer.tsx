"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "./icons";

/**
 * Right-hand drawer that floats rather than sitting flush against the
 * viewport edge, so it reads as the same rounded-card language used across
 * the app. Children own their own scrolling, which lets a wizard pin a
 * header and footer while only the step body scrolls.
 */
export default function Drawer({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  // Portaled straight to <body> - nesting this under a sticky, backdrop-blurred
  // header (as on /app/inbox) confuses some browsers' compositing order, and
  // the header ends up painting above the backdrop despite its lower z-index.
  return createPortal(
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="bg-scrim absolute inset-0 cursor-default"
      />

      <div
        role="dialog"
        aria-modal="true"
        className="animate-drawer-in bg-surface absolute inset-y-3 right-3 flex w-[min(92vw,430px)] flex-col overflow-hidden rounded-xl shadow-2xl sm:inset-y-4 sm:right-4"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="text-ink-3 hover:bg-surface-2 hover:text-ink absolute top-4 right-4 z-10 grid size-10 place-items-center rounded-full transition"
        >
          <X className="size-5" strokeWidth={2} />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
