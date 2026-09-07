"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Wordmark from "./Wordmark";
import BookFreeSessionModal from "./BookFreeSessionModal";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);

  // Lock page scroll while the drawer is open, and let Escape close it.
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {/*
        backdrop-blur below is a `backdrop-filter`, which - like `filter` -
        establishes a containing block for `position: fixed` descendants.
        The overlay/drawer must live outside this element or their `inset-*`
        utilities resolve against the header's own box instead of the
        viewport.
      */}
      <header className="bg-bg/85 relative z-40 flex items-center justify-between px-5 py-4 backdrop-blur-md sm:px-10">
        <Wordmark />

        {/* Desktop actions */}
        <div className="hidden items-center gap-2.5 md:flex">
          <Link
            href="/login"
            className="text-ink-2 hover:bg-surface-2 hover:text-ink rounded-full px-4 py-2 text-[14px] font-medium transition"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="border-line hover:bg-surface-2 rounded-full border px-5 py-2.5 text-[14px] font-medium transition"
          >
            Get started
          </Link>
          <button
            type="button"
            onClick={() => setBookOpen(true)}
            className="bg-brand hover:bg-brand-ink rounded-full px-5 py-2.5 text-[14px] font-medium text-white transition"
          >
            Book a free session
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(true)}
          className="border-line-2 grid size-10 place-items-center rounded-full border md:hidden"
        >
          <Menu className="size-5" strokeWidth={2} />
        </button>
      </header>

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`bg-scrim fixed inset-0 z-40 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`bg-surface fixed inset-y-0 right-0 z-50 flex w-[min(84vw,320px)] flex-col gap-2.5 p-6 shadow-2xl transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <Wordmark />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="border-line-2 grid size-10 place-items-center rounded-full border"
          >
            <X className="size-5" strokeWidth={2} />
          </button>
        </div>

        <Link
          href="/login"
          onClick={() => setOpen(false)}
          className="text-ink-2 hover:bg-surface-2 hover:text-ink w-full rounded-full px-4 py-3 text-left text-[15px] font-medium transition"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          onClick={() => setOpen(false)}
          className="border-line hover:bg-surface-2 w-full rounded-full border px-5 py-3 text-left text-[15px] font-medium transition"
        >
          Get started
        </Link>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setBookOpen(true);
          }}
          className="bg-brand hover:bg-brand-ink w-full rounded-full px-5 py-3 text-[15px] font-medium text-white transition"
        >
          Book a free session
        </button>
      </div>

      <BookFreeSessionModal open={bookOpen} onClose={() => setBookOpen(false)} />
    </>
  );
}
