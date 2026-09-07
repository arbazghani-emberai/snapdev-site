import Reveal from "./Reveal";

const STEPS = [
  {
    title: "Tell Us Where You're Stuck",
    body: "Describe the problem in plain English - paste an error, drop a repo link, or attach your Claude conversation. Our AI figures out what kind of help you need.",
  },
  {
    title: "Get Matched in Minutes",
    body: "We route your request to vetted engineers who know your exact stack and tools. Compare profiles and reviews - or take the first available expert for instant help.",
  },
  {
    title: "Pair, Fix & Learn",
    body: "Jump into a live session with screen share, shared notes, and your project context already loaded. Your engineer fixes the problem with you, not for you.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      aria-labelledby="how-heading"
      className="from-wash-blue-soft relative left-1/2 mt-16 w-[calc(100vw-1rem)] -translate-x-1/2 overflow-hidden rounded-xl bg-gradient-to-b to-white py-24 sm:w-[calc(100vw-1.5rem)] lg:w-[calc(100vw-2.5rem)]"
    >
      <div className="mx-auto flex min-h-[520px] max-w-[1500px] flex-col justify-center px-6 sm:px-10 md:px-14">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2
            id="how-heading"
            className="font-heading text-[34px] leading-[1.1] font-semibold tracking-tight md:text-[44px]"
          >
            How SnapDev.ai Works
          </h2>
          <p className="text-ink-2 mt-3 text-[14.5px] font-medium">
            Connecting you with the best engineers in three simple steps
          </p>
        </Reveal>

        <div className="mx-auto mt-16 flex max-w-xl flex-col items-stretch gap-5 lg:max-w-5xl lg:flex-row lg:gap-8">
          {STEPS.map((step, i) => (
            <Reveal
              key={step.title}
              delay={i * 0.12}
              className="border-line-2 hover:border-ink-3 bg-surface min-w-0 flex-1 rounded-xl border p-7 transition-colors duration-300"
            >
              <span className="bg-surface-2 text-ink grid size-10 place-items-center rounded-full text-[16px] font-bold">
                {i + 1}
              </span>
              <h3 className="font-heading mt-5 text-[20px] leading-tight font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="text-ink-2 mt-3 text-[14.5px] leading-relaxed">
                {step.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
