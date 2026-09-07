"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, FileText, Star, Check } from "@/components/icons";
import { useSession } from "./SessionProvider";
import type { Engineer } from "@/data/engineers";

function Avatar({ engineer, size }: { engineer: Engineer; size: number }) {
  return (
    <span
      className="relative block shrink-0 overflow-hidden rounded-full"
      style={{ width: size, height: size, backgroundColor: `oklch(0.90 0.045 ${engineer.hue})` }}
    >
      {engineer.img && <Image src={engineer.img} alt="" fill className="object-cover" sizes={`${size}px`} />}
    </span>
  );
}

export default function SessionSummaryToast() {
  const { summary, dismissSummary } = useSession();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Reset during render (not an effect) whenever a new summary comes in -
  // this instance stays mounted across session ends rather than remounting.
  const [prevSummary, setPrevSummary] = useState(summary);
  if (summary !== prevSummary) {
    setPrevSummary(summary);
    setRating(0);
    setHoverRating(0);
    setReviewText("");
    setSubmitted(false);
  }

  // Pause the auto-dismiss once the client starts rating, so writing a
  // review isn't cut off; it resumes once they've submitted feedback.
  useEffect(() => {
    if (!summary) return;
    if (rating > 0 && !submitted) return;
    const timer = setTimeout(dismissSummary, 8000);
    return () => clearTimeout(timer);
  }, [summary, rating, submitted, dismissSummary]);

  if (!summary) return null;

  return (
    <div className="animate-modal-in border-line bg-surface fixed right-5 bottom-5 z-[60] w-[320px] rounded-md border p-4 shadow-2xl">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-heading text-[15px] font-semibold tracking-tight">Session summary</h3>
        <button
          type="button"
          onClick={dismissSummary}
          aria-label="Dismiss"
          className="text-ink-3 hover:text-ink shrink-0"
        >
          <X className="size-3.5" strokeWidth={2} />
        </button>
      </div>

      <div className="border-line-2 mt-3 flex items-center gap-2.5 rounded-sm border p-2.5">
        <Avatar engineer={summary.engineer} size={32} />
        <div className="min-w-0">
          <div className="truncate text-[13px] font-semibold">{summary.engineer.name}</div>
          <div className="text-ink-2 truncate text-[11.5px]">{summary.engineer.role}</div>
        </div>
      </div>

      <div className="border-line-2 mt-2.5 rounded-sm border p-2.5">
        {submitted ? (
          <div className="text-online flex items-center gap-1.5 text-[12.5px] font-medium">
            <Check className="size-3.5" strokeWidth={2.5} />
            Thanks for the feedback
          </div>
        ) : (
          <>
            <div className="text-ink-3 text-[10px] font-semibold tracking-[0.06em] uppercase">
              Rate {summary.engineer.name}
            </div>
            <div className="mt-1.5 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`Rate ${n} star${n === 1 ? "" : "s"}`}
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-0.5"
                >
                  <Star
                    className={`size-4 transition-colors ${
                      n <= (hoverRating || rating) ? "text-star fill-current" : "text-line fill-current"
                    }`}
                  />
                </button>
              ))}
            </div>

            {rating > 0 && (
              <div className="mt-2">
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={2}
                  placeholder="Add a review (optional)"
                  className="border-line focus:border-ink bg-surface-2 focus:bg-surface w-full resize-none rounded-sm border p-2 text-[12.5px] leading-relaxed outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setSubmitted(true)}
                  className="bg-ink hover:bg-ink/85 text-bg mt-1.5 w-full rounded-sm py-1.5 text-[12.5px] font-semibold transition"
                >
                  Submit
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {summary.projectName && (
        <div className="border-line-2 mt-2.5 flex items-center gap-2.5 rounded-sm border p-2.5">
          <FileText className="text-ink-2 size-3.5 shrink-0" strokeWidth={1.75} />
          <div className="min-w-0">
            <div className="text-ink-3 text-[10px] font-semibold tracking-[0.06em] uppercase">Project</div>
            <div className="truncate text-[13px] font-semibold">{summary.projectName}</div>
          </div>
        </div>
      )}

      {summary.notes.length > 0 && (
        <div className="mt-2.5">
          <div className="text-ink-3 mb-1.5 text-[10px] font-semibold tracking-[0.06em] uppercase">
            Your notes ({summary.notes.length})
          </div>
          <div className="flex max-h-24 flex-col gap-1.5 overflow-y-auto">
            {summary.notes.map((n, i) => (
              <p key={i} className="bg-surface-2 rounded-sm px-2.5 py-2 text-[12px] leading-relaxed">
                {n}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
