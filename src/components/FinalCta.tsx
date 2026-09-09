import TopoLines from "./TopoLines";
import Reveal from "./Reveal";

export default function FinalCta() {
  return (
    <section className="bg-ink relative left-1/2 mt-5 w-[calc(100vw-1rem)] -translate-x-1/2 overflow-hidden rounded-xl text-white sm:w-[calc(100vw-1.5rem)] lg:w-[calc(100vw-2.5rem)]">
      <TopoLines seed={44} opacityScale={0.22} />
      <Reveal className="relative px-8 py-44 text-center md:py-56">
        <h2 className="font-heading mx-auto text-balance text-[clamp(26px,4.2vw,56px)] leading-[1.08] font-semibold tracking-tight lg:whitespace-nowrap">
          Stop being stuck. Start shipping.
        </h2>
        <p className="mx-auto mt-5 max-w-sm text-balance text-[clamp(11px,1.7vw,15.5px)] font-medium text-white/60 lg:max-w-none lg:whitespace-nowrap">
          Get matched with a senior engineer in minutes, your first session is free,
          up to 30 minutes.
        </p>
        <button
          type="button"
          className="bg-surface text-ink hover:bg-surface-2 mt-9 rounded-full px-7 py-3.5 text-[15px] font-semibold transition"
        >
          Get Help Now
        </button>
      </Reveal>
    </section>
  );
}
