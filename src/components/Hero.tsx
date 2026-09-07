import ChatWidget from "./ChatWidget";
import TopoLines from "./TopoLines";
import HeroGradient from "./HeroGradient";
import Reveal from "./Reveal";

const STEPS = ["Describe it", "Get matched", "Chat it through"];

export default function Hero() {
  return (
    <section className="from-wash-blue via-wash-blue-soft relative left-1/2 w-[calc(100vw-1rem)] -translate-x-1/2 overflow-hidden rounded-xl bg-gradient-to-b to-white sm:w-[calc(100vw-1.5rem)] lg:w-[calc(100vw-2.5rem)]">
      <HeroGradient />
      <TopoLines opacityScale={0.5} />

      <div className="relative mx-auto flex min-h-[calc(100svh-104px)] w-full max-w-[1500px] flex-col items-center justify-center gap-9 px-6 py-12 text-center sm:px-12 lg:py-16 lg:max-h-[880px]">
        <Reveal className="mx-auto max-w-[900px]">
          <h1 className="font-heading text-[clamp(46px,6.6vw,74px)] leading-[1.05] font-semibold tracking-tight">
            On-demand engineering marketplace.
          </h1>

          <p className="text-ink-2 mx-auto mt-4.5 max-w-[44ch] text-[18.5px] leading-[1.5]">
            Match with a vetted engineer and work through your problem live, at a
            fraction of what a dev shop would charge.
          </p>

          <ol className="text-ink-2 mt-7 flex flex-wrap items-center justify-center gap-x-3.5 gap-y-2.5 text-[15px]">
            {STEPS.map((step, i) => (
              <li key={step} className="flex items-center gap-3.5">
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="bg-surface text-brand-ink grid size-6 place-items-center rounded-full text-[12.5px] font-semibold shadow-sm"
                  >
                    {i + 1}
                  </span>
                  {step}
                </span>
                {i < STEPS.length - 1 && (
                  <span aria-hidden="true" className="text-ink-3">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.15} className="mx-auto w-full max-w-3xl text-left">
          <ChatWidget />
        </Reveal>
      </div>
    </section>
  );
}
