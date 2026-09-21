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
  `${engineer.name} joined`,
  "Settings fixed · payments tested · backups on",
  "Live in production, first real signup",
];

/** A before/after comparison: stuck alone vs. paired with an engineer,
 *  in the "session log" style of the reference the redesign is based on.
 *  Header icon/avatar and list-item icons share a fixed-width column so
 *  the heading text and list text land on the same left edge. */
export default function SessionPreview() {
  return (
    <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
      <div className="border-line bg-surface rounded-lg border p-5">
        <div className="border-line-2 flex items-center gap-3 border-b pb-3.5">
          <span className="bg-surface-2 text-ink-2 grid size-9 shrink-0 place-items-center rounded-full text-[13px] font-semibold">
            ?
          </span>
          <div className="min-w-0">
            <div className="text-[15px] font-semibold">Only you</div>
            <div className="text-ink-3 text-[13px]">no one to ask</div>
          </div>
        </div>

        <ul className="mt-4 flex flex-col gap-3">
          {PROBLEMS.map((problem) => (
            <li key={problem} className="flex items-start gap-3 text-[14px] leading-snug">
              <span className="grid w-9 shrink-0 place-items-start pt-0.5">
                <X className="text-danger size-4" strokeWidth={2.5} />
              </span>
              <span className="text-ink-2">{problem}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-line bg-surface rounded-lg border p-5">
        <div className="border-line-2 flex items-center justify-between gap-3 border-b pb-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="relative size-9 shrink-0 overflow-hidden rounded-full"
              style={{ backgroundColor: `oklch(0.90 0.045 ${engineer.hue})` }}
            >
              {engineer.img && <Image src={engineer.img} alt="" fill className="object-cover" sizes="36px" />}
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

        <ul className="mt-4 flex flex-col gap-3">
          {SOLUTIONS.map((solution) => (
            <li key={solution} className="flex items-start gap-3 text-[14px] leading-snug">
              <span className="grid w-9 shrink-0 place-items-start pt-0.5">
                <Check className="text-online size-4" strokeWidth={2.5} />
              </span>
              <span className="text-ink-2">{solution}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
