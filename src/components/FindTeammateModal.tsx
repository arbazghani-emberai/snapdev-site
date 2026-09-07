"use client";

import Image from "next/image";
import Modal from "./Modal";
import { Star } from "@/components/icons";
import { ENGINEER_DIRECTORY, type DirectoryEngineer } from "@/data/engineer-directory";

const SUGGESTED = [...ENGINEER_DIRECTORY]
  .filter((e) => e.rating)
  .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
  .slice(0, 4);

export default function FindTeammateModal({
  open,
  onClose,
  onBook,
}: {
  open: boolean;
  onClose: () => void;
  onBook: (engineer: DirectoryEngineer) => void;
}) {
  return (
    <Modal open={open} onClose={onClose} className="max-w-md">
      <h2 className="font-heading text-[22px] font-semibold tracking-tight">Find your teammate</h2>
      <p className="text-ink-2 mt-2 text-[13.5px] leading-relaxed">
        Based on your projects, here are a few engineers who&apos;d be a good fit for ongoing work. Book a free
        20-minute intro to see who clicks.
      </p>

      <div className="mt-5 flex max-h-[400px] flex-col gap-3 overflow-y-auto pr-1">
        {SUGGESTED.map((e) => (
          <div key={e.name} className="border-line rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <span
                className="relative size-11 shrink-0 overflow-hidden rounded-full"
                style={{ backgroundColor: `oklch(0.90 0.045 ${e.hue})` }}
              >
                {e.img && <Image src={e.img} alt="" fill className="object-cover" sizes="44px" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14.5px] font-semibold">{e.name}</div>
                <div className="text-ink-2 truncate text-[12.5px]">{e.role}</div>
              </div>
              {e.rating && (
                <span className="flex shrink-0 items-center gap-1 text-[13px] font-semibold">
                  <Star className="text-star size-3.5 fill-current" strokeWidth={0} />
                  {e.rating}
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {e.skills.slice(0, 4).map((s) => (
                <span
                  key={s}
                  className="border-line bg-surface-2 text-ink-2 rounded-full border px-2.5 py-1 text-[11.5px] font-medium"
                >
                  {s}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onBook(e)}
              className="bg-ink hover:bg-ink/85 text-bg mt-3.5 w-full rounded-full py-2.5 text-[13.5px] font-semibold transition"
            >
              Book 20-min intro
            </button>
          </div>
        ))}
      </div>
    </Modal>
  );
}
