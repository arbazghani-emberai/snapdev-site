import Reveal from "./Reveal";

const STEPS = [
  {
    title: "Tell us where you're stuck.",
    body: "Answer a few quick questions in plain English. Paste a link, an error, or a screenshot.",
    visual: "questionnaire" as const,
  },
  {
    title: "Connect with an expert.",
    body: "We'll connect you to a senior engineer in minutes.",
    visual: "call" as const,
  },
  {
    title: "Get your problem fixed.",
    body: "Share your screen. They help you fix it.",
    visual: "fix" as const,
  },
];

function PlaceholderVisual({ kind }: { kind: (typeof STEPS)[number]["visual"] }) {
  return (
    <div className="border-line-2 bg-surface-2 relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg border">
      <span className="text-ink-3 absolute top-3 right-3 text-[11px] font-semibold tracking-[0.06em] uppercase">
        Animation placeholder
      </span>

      {kind === "questionnaire" && (
        <div className="bg-surface border-line w-[78%] rounded-lg border p-4 shadow-sm">
          <div className="bg-line-2 h-2.5 w-2/5 rounded-full" />
          <div className="border-line-2 bg-surface-2 mt-4 rounded-md border px-3 py-2.5">
            <div className="bg-line-2 h-2 w-3/4 rounded-full" />
          </div>
          <div className="border-brand bg-brand-wash mt-2.5 flex items-center gap-1 rounded-md border px-3 py-2.5">
            <div className="bg-ink-3 h-2 w-1/2 rounded-full" />
            <span className="bg-brand ml-0.5 h-3 w-[2px] animate-pulse" />
          </div>
          <div className="border-line-2 bg-surface-2 mt-2.5 rounded-md border px-3 py-2.5">
            <div className="bg-line-2 h-2 w-1/3 rounded-full" />
          </div>
        </div>
      )}

      {kind === "call" && (
        <div className="flex w-[78%] gap-2">
          <div className="bg-ink relative flex aspect-square flex-1 items-center justify-center rounded-lg">
            <span className="text-[13px] font-semibold text-white/70">You</span>
            <span className="border-online absolute inset-0 rounded-lg border-2" />
          </div>
          <div className="relative flex aspect-square flex-1 items-center justify-center rounded-lg bg-[#232735]">
            <span className="text-[13px] font-semibold text-white/70">Engineer</span>
            <span className="bg-online absolute top-2 right-2 size-2 rounded-full" />
          </div>
        </div>
      )}

      {kind === "fix" && (
        <div className="relative w-[82%]">
          <div className="rounded-lg bg-[#0e1016] p-4">
            <div className="flex gap-1.5">
              <span className="size-2 rounded-full bg-[#e76b5e]" />
              <span className="size-2 rounded-full bg-[#d4a34d]" />
              <span className="size-2 rounded-full bg-[#62c553]" />
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="h-2 w-4/5 rounded-full bg-[#3d445a]" />
              <div className="h-2 w-3/5 rounded-full bg-[#3d445a]" />
              <div className="h-2 w-2/3 rounded-full bg-[#8ab4ff]/50" />
              <div className="h-2 w-1/2 rounded-full bg-[#3d445a]" />
            </div>
          </div>
          <div className="border-surface bg-ink absolute -right-2 -bottom-3 flex -space-x-2 rounded-full border-2 p-1">
            <span className="border-surface size-6 rounded-full border-2 bg-[#3f4c6b]" />
            <span className="border-surface size-6 rounded-full border-2 bg-[#4a4352]" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section
      id="how"
      aria-labelledby="how-heading"
      className="from-wash-blue-soft relative left-1/2 mt-5 w-[calc(100vw-1rem)] -translate-x-1/2 overflow-hidden rounded-xl bg-gradient-to-b to-white py-24 sm:w-[calc(100vw-1.5rem)] lg:w-[calc(100vw-2.5rem)]"
    >
      <div className="mx-auto max-w-[1500px] px-6 sm:px-10 md:px-14">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2
            id="how-heading"
            className="font-heading text-[34px] leading-[1.1] font-semibold tracking-tight md:text-[44px]"
          >
            Unstuck in three steps. No tech knowledge needed.
          </h2>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-xl grid-cols-1 gap-10 lg:max-w-5xl lg:grid-cols-3 lg:gap-8">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.12}>
              <PlaceholderVisual kind={step.visual} />
              <h3 className="font-heading mt-6 text-[19px] leading-snug font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="text-ink-2 mt-2 text-[14.5px] leading-relaxed">{step.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
