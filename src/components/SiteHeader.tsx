"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Wordmark from "./Wordmark";
import BookFreeSessionModal from "./BookFreeSessionModal";

const NAV_LINKS = [
  { label: "How it works", href: "/#how" },
  { label: "Engineers", href: "/#engineers" },
  { label: "Results", href: "/#results" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

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
      <header className="bg-bg/85 relative z-40 grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-4 backdrop-blur-md sm:px-10">
        <div className="flex justify-start">
          <Wordmark />
        </div>

        {/* Centered nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-ink-2 hover:text-ink text-[14px] font-medium whitespace-nowrap transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2.5">
          {/* Desktop actions */}
          <div className="hidden items-center gap-2.5 md:flex">
            <Link
              href="/login"
              className="border-line hover:bg-surface-2 rounded-full border px-5 py-2.5 text-[14px] font-medium transition"
            >
              Log in
            </Link>
            <button
              type="button"
              onClick={() => setBookOpen(true)}
              className="bg-ink hover:bg-ink/85 rounded-full px-5 py-2.5 text-[14px] font-medium text-white transition"
            >
              Claim my free hour
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
        </div>
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

        {NAV_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className="text-ink-2 hover:bg-surface-2 hover:text-ink w-full rounded-full px-4 py-3 text-left text-[15px] font-medium transition"
          >
            {item.label}
          </Link>
        ))}

        <div className="border-line-2 my-1 border-t" />

        <Link
          href="/login"
          onClick={() => setOpen(false)}
          className="border-line hover:bg-surface-2 w-full rounded-full border px-5 py-3 text-left text-[15px] font-medium transition"
        >
          Log in
        </Link>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setBookOpen(true);
          }}
          className="bg-ink hover:bg-ink/85 w-full rounded-full px-5 py-3 text-[15px] font-medium text-white transition"
        >
          Claim my free hour
        </button>
      </div>

      <BookFreeSessionModal open={bookOpen} onClose={() => setBookOpen(false)} />
    </>
  );
}
