"use client";

import { useState } from "react";
import Image from "next/image";
import Modal from "./Modal";
import { Star, Check } from "@/components/icons";
import type { LoggedSession } from "@/data/sessions";

export default function GiveReviewModal({
  session,
  onClose,
  onSubmit,
}: {
  session: LoggedSession | null;
  onClose: () => void;
  onSubmit?: (rating: number, text: string) => void;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Reset during render (not an effect) whenever a different session opens -
  // this instance stays mounted across opens/closes rather than remounting.
  const [prevSession, setPrevSession] = useState(session);
  if (session !== prevSession) {
    setPrevSession(session);
    setRating(0);
    setHoverRating(0);
    setReviewText("");
    setSubmitted(false);
  }

  const close = () => onClose();

  if (!session) return null;

  return (
    <Modal open={!!session} onClose={close} className="max-w-sm">
      {submitted ? (
        <div className="text-center">
          <div className="bg-online/15 text-online mx-auto grid size-14 place-items-center rounded-full">
            <Check className="size-6" strokeWidth={2.5} />
          </div>
          <h2 className="font-heading mt-4 text-[19px] font-semibold tracking-tight">Thanks for the feedback</h2>
          <p className="text-ink-2 mt-2 text-[13.5px] leading-relaxed">
            Your review helps other builders find the right engineer.
          </p>
          <button
            type="button"
            onClick={close}
            className="bg-ink hover:bg-ink/85 text-bg mt-5 w-full rounded-full py-3 text-[14px] font-semibold transition"
          >
            Done
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <span
              className="relative size-11 shrink-0 overflow-hidden rounded-full"
              style={{ backgroundColor: `oklch(0.90 0.045 ${session.engineer.hue})` }}
            >
              {session.engineer.img && (
                <Image src={session.engineer.img} alt="" fill className="object-cover" sizes="44px" />
              )}
            </span>
            <div className="min-w-0">
              <div className="truncate text-[14.5px] font-semibold">{session.engineer.name}</div>
              <div className="text-ink-2 truncate text-[12.5px]">{session.topic}</div>
            </div>
          </div>

          <h2 className="font-heading mt-4 text-[19px] font-semibold tracking-tight">Rate this session</h2>

          <div className="mt-2.5 flex items-center gap-1">
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
                  className={`size-5 transition-colors ${
                    n <= (hoverRating || rating) ? "text-star fill-current" : "text-line fill-current"
                  }`}
                />
              </button>
            ))}
          </div>

          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={3}
            placeholder="Add a review (optional)"
            className="border-line focus:border-ink mt-3 w-full resize-y rounded-lg border p-3 text-[14px] leading-relaxed outline-none transition"
          />

          <button
            type="button"
            disabled={rating === 0}
            onClick={() => {
              onSubmit?.(rating, reviewText.trim());
              setSubmitted(true);
            }}
            className="bg-ink hover:bg-ink/85 disabled:bg-surface-2 disabled:text-ink-3 mt-4 w-full rounded-full py-3 text-[14px] font-semibold text-bg transition disabled:cursor-not-allowed"
          >
            Submit review
          </button>
        </>
      )}
    </Modal>
  );
}
