import Image from "next/image";
import { Check, X } from "@/components/icons";
import { ENGINEERS } from "@/data/engineers";

const PROBLEMS = [
  "Deploy failed: missing environment settings",
  "Stripe webhook returning 400, real cards declining",
  "Database: 0 backups configured",
];

const engineer = ENGINEERS.find((e) => e.name === "Khalil") ?? ENGINEERS[0];

const SOLUTIONS = [
  `${engineer.name} joined · screen shared`,
  "Settings fixed · payments tested · backups on",
  "Live in production, first real signup",
];

/** A before/after comparison: stuck alone vs. paired with an engineer,
 *  in the "session log" style of the reference the redesign is based on. */
export default function SessionPreview() {
  return (
    <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
      <div className="border-line bg-surface rounded-lg border p-6 sm:p-7">
        <div className="border-line-2 flex items-center gap-3 border-b pb-4">
          <span className="bg-surface-2 text-ink-2 grid size-11 shrink-0 place-items-center rounded-full text-[15px] font-semibold">
            ?
          </span>
          <div className="min-w-0">
            <div className="text-[15px] font-semibold">Only you</div>
            <div className="text-ink-3 text-[13px]">no one to ask</div>
          </div>
        </div>

        <ul className="mt-4.5 flex flex-col gap-3">
          {PROBLEMS.map((problem) => (
            <li key={problem} className="flex items-start gap-2.5 text-[14px] leading-snug">
              <X className="text-danger mt-0.5 size-4 shrink-0" strokeWidth={2.5} />
              <span className="text-ink-2">{problem}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-line bg-surface rounded-lg border p-6 sm:p-7">
        <div className="border-line-2 flex items-center justify-between gap-3 border-b pb-4">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="relative size-11 shrink-0 overflow-hidden rounded-full"
              style={{ backgroundColor: `oklch(0.90 0.045 ${engineer.hue})` }}
            >
              {engineer.img && <Image src={engineer.img} alt="" fill className="object-cover" sizes="44px" />}
            </span>
            <div className="min-w-0">
              <div className="truncate text-[15px] font-semibold">{engineer.name}</div>
              <div className="text-ink-3 truncate text-[13px]">{engineer.role} &middot; your free hour</div>
            </div>
          </div>
          <span className="bg-online/10 text-online shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold">
            live
          </span>
        </div>

        <ul className="mt-4.5 flex flex-col gap-3">
          {SOLUTIONS.map((solution) => (
            <li key={solution} className="flex items-start gap-2.5 text-[14px] leading-snug">
              <Check className="text-online mt-0.5 size-4 shrink-0" strokeWidth={2.5} />
              <span className="text-ink-2">{solution}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
