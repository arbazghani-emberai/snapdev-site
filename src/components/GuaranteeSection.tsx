import Reveal from "./Reveal";

const STAMP_TEXT = "SATISFACTION GUARANTEED • SNAPDEV • ";

function GuaranteeStamp() {
  return (
    <div
      className="relative grid size-[168px] shrink-0 place-items-center rounded-full"
      style={{
        background: "radial-gradient(circle at 32% 28%, #fbe7a8 0%, #e8bf5c 42%, #b9862a 78%, #9a6c1e 100%)",
        boxShadow:
          "0 2px 3px rgba(255,250,222,0.9) inset, 0 -3px 5px rgba(94,63,10,0.55) inset, 0 1px 0 rgba(255,255,255,0.4), 0 18px 30px rgba(19,19,19,0.35)",
      }}
    >
      <div
        className="absolute inset-[10px] rounded-full"
        style={{
          background: "radial-gradient(circle at 34% 30%, #fdf0c4 0%, #e2b358 48%, #a97c28 100%)",
          boxShadow: "0 1px 2px rgba(255,250,222,0.85) inset, 0 -2px 4px rgba(80,53,8,0.5) inset",
        }}
      />

      <svg viewBox="0 0 168 168" className="absolute inset-0" aria-hidden="true">
        <defs>
          <path id="stamp-ring" d="M 84,84 m -62,0 a 62,62 0 1,1 124,0 a 62,62 0 1,1 -124,0" />
        </defs>
        <text
          fill="#5b3d0e"
          fontSize="9.5"
          fontWeight={700}
          letterSpacing="1.5"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <textPath href="#stamp-ring" startOffset="0%">
            {STAMP_TEXT}
          </textPath>
        </text>
      </svg>

      <div
        className="relative grid size-[92px] place-items-center rounded-full"
        style={{
          background: "radial-gradient(circle at 36% 30%, #fff6dc 0%, #eec46e 55%, #b3822d 100%)",
          boxShadow: "0 1px 1px rgba(255,255,255,0.9) inset, 0 -2px 4px rgba(90,60,10,0.55) inset",
        }}
      >
        <svg viewBox="0 0 24 24" className="size-10" fill="none" aria-hidden="true">
          <path
            d="M4.5 12.5 9.5 17.5 19.5 6.5"
            stroke="#5b3d0e"
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

    </div>
  );
}

export default function GuaranteeSection() {
  return (
    <section
      aria-labelledby="guarantee-heading"
      className="bg-brand-ink relative left-1/2 mt-5 w-[calc(100vw-1rem)] -translate-x-1/2 overflow-hidden rounded-xl sm:w-[calc(100vw-1.5rem)] lg:w-[calc(100vw-2.5rem)]"
    >
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-7 px-6 py-20 text-center sm:px-10">
        <Reveal>
          <GuaranteeStamp />
        </Reveal>

        <Reveal delay={0.1}>
          <h2
            id="guarantee-heading"
            className="font-heading text-[32px] leading-[1.15] font-semibold tracking-tight text-white md:text-[42px]"
          >
            If we can&apos;t solve it, you don&apos;t pay.
          </h2>
          <p className="mx-auto mt-4 max-w-[52ch] text-[16px] leading-relaxed text-white/75">
            If your engineer can&apos;t solve the problem you booked them for, those hours go back to your account.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
