import Reveal from "./Reveal";

const STEPS = [
  {
    title: "Create your account",
    body: "One tap with Google, or an email and password. This is what holds your free hour while you tell us what's wrong.",
    meta: "≈ 20 seconds",
  },
  {
    title: "Tell us where you're stuck",
    body: "Four quick questions in plain English. Paste a link, an error, or a screenshot. Nothing built yet? Say so, and we match you for an idea session instead.",
    meta: "≈ 2 minutes",
  },
  {
    title: "Meet your matched engineer",
    body: "We shortlist engineers who have shipped apps built with your exact tools. Start with whoever is available now, or book a time.",
    meta: "available now: 3 engineers",
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
          <span className="text-brand text-[13px] font-bold tracking-[0.06em] uppercase">How it works</span>
          <h2
            id="how-heading"
            className="font-heading mt-2 text-[34px] leading-[1.1] font-semibold tracking-tight md:text-[44px]"
          >
            Unstuck in three steps. No tech knowledge needed.
          </h2>
        </Reveal>

        <div className="mx-auto mt-16 flex max-w-xl flex-col items-stretch gap-5 lg:max-w-5xl lg:flex-row lg:gap-8">
          {STEPS.map((step, i) => (
            <Reveal
              key={step.title}
              delay={i * 0.12}
              className="border-line-2 hover:border-ink-3 bg-surface flex min-w-0 flex-1 flex-col rounded-xl border p-7 transition-colors duration-300"
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
              <p className="text-ink-3 mt-auto pt-6 text-[13px]">{step.meta}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
