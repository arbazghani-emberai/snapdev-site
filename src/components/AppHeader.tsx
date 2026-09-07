"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Users, MessageSquare, Calendar, Crown, Menu, X, Sun, Moon, Lock, type IconComponent } from "@/components/icons";
import Wordmark from "./Wordmark";
import AccountMenu from "./AccountMenu";
import NotificationsMenu from "./NotificationsMenu";
import UpgradeRequiredModal from "./UpgradeRequiredModal";
import { useTheme } from "./ThemeProvider";
import { usePlan } from "./PlanProvider";
import { useSession } from "./SessionProvider";

const NAV: { label: string; href: string; icon: IconComponent }[] = [
  { label: "Home", href: "/app", icon: House },
  { label: "Engineers", href: "/app/engineers", icon: Users },
  { label: "Messages", href: "/app/inbox", icon: MessageSquare },
  { label: "Calls", href: "/app/sessions", icon: Calendar },
];

function isActive(pathname: string, href: string) {
  return href === "/app" ? pathname === "/app" : pathname.startsWith(href);
}

export default function AppHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { plan, hasPlanAtLeast } = usePlan();
  const { session } = useSession();
  const isGuest = !!session?.guest;

  // Browsing engineers is a Growth-plan-and-up feature - below that, the nav
  // item stays visible (with a lock badge) but routes to an upgrade prompt
  // instead of the page.
  const isEngineersLocked = (href: string) => href === "/app/engineers" && !hasPlanAtLeast("growth");

  // A visitor who hasn't created an account yet can only use Messages (their
  // live conversation) - the rest of the app is out of reach until they do.
  const isNavLocked = (href: string) => isGuest && href !== "/app/inbox";

  // Close the drawer on a route change (reset during render, not an effect,
  // per React's "adjusting state when props change" pattern) - covers
  // browser back/forward too, not just the Link's own onClick.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

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

  // The Messages screen's own top border isn't reliably visible flush
  // against the sticky header (they occupy adjacent, not overlapping,
  // boxes), so the header paints its own bottom border on that route only.
  const onMessages = pathname.startsWith("/app/inbox");

  return (
    <>
      <header
        className={`bg-bg/85 sticky top-0 z-40 flex items-center justify-between gap-4 px-3.5 py-3.5 backdrop-blur-md ${
          onMessages ? "border-line-2 border-b" : ""
        }`}
      >
        <Link href="/app" className="ml-1 shrink-0">
          <Wordmark variant={theme === "dark" ? "dark" : "light"} />
        </Link>

        {/* Desktop: centered on the header regardless of side-content width. */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            const locked = isEngineersLocked(item.href);
            const guestLocked = isNavLocked(item.href);

            if (guestLocked) {
              return (
                <span
                  key={item.href}
                  aria-disabled="true"
                  className="text-ink-3 flex shrink-0 cursor-not-allowed items-center gap-1.5 rounded-full px-3.5 py-2 text-[13.5px] font-semibold opacity-50"
                >
                  <item.icon className="size-3.5" strokeWidth={2} />
                  {item.label}
                </span>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                onClick={(e) => {
                  if (!locked) return;
                  e.preventDefault();
                  setUpgradeOpen(true);
                }}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13.5px] font-semibold transition ${
                  active ? "bg-surface-2 text-ink" : "text-ink-2 hover:bg-surface-2"
                }`}
              >
                <item.icon className="size-3.5" strokeWidth={2} />
                {item.label}
                {locked && (
                  <span
                    aria-hidden="true"
                    className="grid size-5 shrink-0 place-items-center rounded-[6px] bg-gradient-to-r from-[#a855f7] to-[#7c3aed]"
                  >
                    <Lock className="size-3 text-white" strokeWidth={2.5} />
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2.5">
          {isGuest ? (
            <>
              <Link
                href="/login"
                className="border-line hover:bg-surface-2 hidden items-center rounded-full border px-4 py-2 text-[13px] font-semibold lg:flex"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-ink hover:bg-ink/85 hidden items-center rounded-full px-4 py-2 text-[13px] font-semibold text-bg transition lg:flex"
              >
                Create account
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/app/settings?tab=plan"
                className="hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#7c3aed] px-4 py-2 text-[13px] font-semibold text-white transition hover:opacity-90 lg:flex"
              >
                <Crown className="size-3.5" strokeWidth={2} />
                Upgrade plan
              </Link>
              <Link
                href="/app/settings?tab=plan"
                className="border-line hover:bg-surface-2 text-ink-2 hidden items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-semibold lg:flex"
              >
                <span className="text-ink">{plan.name}</span>
                <span aria-hidden="true" className="text-ink-3">
                  ·
                </span>
                {plan.hoursPerMonth} hr left
              </Link>
            </>
          )}
          {!isGuest && <NotificationsMenu />}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="border-line hover:bg-surface-2 grid size-9 shrink-0 place-items-center rounded-full border transition"
          >
            {theme === "dark" ? (
              <Sun className="size-4" strokeWidth={2} />
            ) : (
              <Moon className="size-4" strokeWidth={2} />
            )}
          </button>
          {!isGuest && <AccountMenu />}

          {/* Mobile: opens the side nav drawer. */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="app-mobile-nav"
            onClick={() => setOpen(true)}
            className="border-line hover:bg-surface-2 grid size-9 shrink-0 place-items-center rounded-full border transition lg:hidden"
          >
            <Menu className="size-4.5" strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`bg-scrim fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <div
        id="app-mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`bg-surface fixed inset-y-0 right-0 z-50 flex w-[min(84vw,320px)] flex-col gap-1.5 p-5 shadow-2xl transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-3 flex items-center justify-between">
          <Wordmark variant={theme === "dark" ? "dark" : "light"} />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="border-line grid size-9 place-items-center rounded-full border"
          >
            <X className="size-4" strokeWidth={2} />
          </button>
        </div>

        {NAV.map((item) => {
          const active = isActive(pathname, item.href);
          const locked = isEngineersLocked(item.href);
          const guestLocked = isNavLocked(item.href);

          if (guestLocked) {
            return (
              <span
                key={item.href}
                aria-disabled="true"
                className="text-ink-3 flex cursor-not-allowed items-center gap-2.5 rounded-lg px-3.5 py-3 text-[15px] font-semibold opacity-50"
              >
                <item.icon className="size-4" strokeWidth={2} />
                {item.label}
              </span>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                if (!locked) return;
                e.preventDefault();
                setUpgradeOpen(true);
              }}
              className={`flex items-center gap-2.5 rounded-lg px-3.5 py-3 text-[15px] font-semibold transition ${
                active ? "bg-surface-2 text-ink" : "text-ink-2 hover:bg-surface-2"
              }`}
            >
              <item.icon className="size-4" strokeWidth={2} />
              {item.label}
              {locked && (
                <span
                  aria-hidden="true"
                  className="grid size-5 shrink-0 place-items-center rounded-[6px] bg-gradient-to-r from-[#a855f7] to-[#7c3aed]"
                >
                  <Lock className="size-3 text-white" strokeWidth={2.5} />
                </span>
              )}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={toggleTheme}
          className="text-ink-2 hover:bg-surface-2 hover:text-ink flex items-center gap-2.5 rounded-lg px-3.5 py-3 text-left text-[15px] font-semibold transition"
        >
          {theme === "dark" ? <Sun className="size-4" strokeWidth={2} /> : <Moon className="size-4" strokeWidth={2} />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>

        <div className="bg-line my-2 h-px" />

        {isGuest ? (
          <>
            <Link
              href="/signup"
              className="bg-ink hover:bg-ink/85 flex items-center justify-center rounded-full px-4 py-2.5 text-center text-[13.5px] font-semibold text-bg transition"
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="border-line hover:bg-surface-2 mt-1.5 rounded-full border px-4 py-2.5 text-center text-[13.5px] font-semibold transition"
            >
              Log in
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/app/settings?tab=plan"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#a855f7] to-[#7c3aed] px-4 py-2.5 text-[13.5px] font-semibold text-white transition hover:opacity-90"
            >
              <Crown className="size-3.5" strokeWidth={2} />
              Upgrade plan
            </Link>
            <Link
              href="/app/settings?tab=plan"
              className="border-line hover:bg-surface-2 mt-1.5 rounded-full border px-4 py-2.5 text-center text-[13.5px] font-semibold transition"
            >
              {plan.name} · {plan.hoursPerMonth} hr left
            </Link>
          </>
        )}
      </div>

      <UpgradeRequiredModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </>
  );
}
