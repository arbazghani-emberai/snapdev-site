"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "@/components/icons";
import { useTheme } from "./ThemeProvider";

export default function Modal({
  open,
  onClose,
  children,
  className = "max-w-md",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const { theme } = useTheme();

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
  // Since <body> sits outside ThemeProvider's `.dark`-classed wrapper, that
  // class has to be re-applied here too or every popup ignores dark mode.
  return createPortal(
    <div className={`fixed inset-0 z-50 grid place-items-center p-4 ${theme === "dark" ? "dark" : ""}`}>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="bg-scrim absolute inset-0 cursor-default"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`bg-surface text-ink animate-modal-in relative w-full rounded-xl p-7 shadow-2xl sm:p-8 ${className}`}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="text-ink-3 hover:bg-surface-2 hover:text-ink absolute top-5 right-5 grid size-9 place-items-center rounded-full transition"
        >
          <X className="size-4" strokeWidth={2} />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
