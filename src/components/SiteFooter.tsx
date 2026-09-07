import Link from "next/link";
import Wordmark from "./Wordmark";

export default function SiteFooter() {
  return (
    <footer className="mt-auto">
      <div className="px-5 py-5 sm:px-10 sm:py-10 lg:px-14 lg:py-14">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div>
            <Wordmark />
            <p className="text-ink-2 mt-4 max-w-xs text-[14px] leading-relaxed">
              The talent marketplace pairing vibe coders with senior software
              engineers. Build with AI, ship with confidence.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-7 gap-y-3 text-[14px] font-medium">
            <Link className="text-ink-2 hover:text-ink transition" href="/#engineers">
              Engineers
            </Link>
            <Link className="text-ink-2 hover:text-ink transition" href="/#how">
              How it works
            </Link>
          </nav>
        </div>
        <p className="text-ink-3 border-line-2 mt-10 border-t pt-6 text-[13px]">
          © 2026 SnapDev.ai - real engineers, on demand.
        </p>
      </div>
    </footer>
  );
}
