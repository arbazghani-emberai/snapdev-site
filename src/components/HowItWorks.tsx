import Reveal from "./Reveal";

const STEPS = [
  {
    title: "Tell us where you're stuck.",
    body: "Answer a few quick questions in plain English. Paste a link, an error, or a screenshot.",
    clip: "step-1",
  },
  {
    title: "Connect with an expert.",
    body: "We'll connect you to a senior engineer in minutes.",
    clip: "step-2",
  },
  {
    title: "Get your problem fixed.",
    body: "Share your screen. They help you fix it.",
    clip: "step-3",
  },
];

function StepVisual({ clip, title }: { clip: string; title: string }) {
  return (
    <video
      className="border-line-2 aspect-square w-full rounded-lg border"
      src={`/steps/${clip}.mp4`}
      poster={`/steps/${clip}-poster.jpg`}
      aria-label={title}
      autoPlay
      muted
      loop
      playsInline
    />
  );
}

export default function HowItWorks() {
  return (
    <section
      id="how"
      aria-labelledby="how-heading"
      className="relative left-1/2 mt-24 w-[calc(100vw-1rem)] -translate-x-1/2 overflow-hidden rounded-xl py-24 sm:w-[calc(100vw-1.5rem)] lg:w-[calc(100vw-2.5rem)]"
    >
      <div className="mx-auto max-w-none px-3 sm:px-7 lg:px-9">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2
            id="how-heading"
            className="font-heading text-[34px] leading-[1.1] font-semibold tracking-tight md:text-[44px]"
          >
            Unstuck in three steps. No tech knowledge needed.
          </h2>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-xl grid-cols-1 gap-10 lg:max-w-none lg:grid-cols-3 lg:gap-10">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.12}>
              <StepVisual clip={step.clip} title={step.title} />
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
