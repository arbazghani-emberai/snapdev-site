import SessionPreview from "./SessionPreview";
import TopoLines from "./TopoLines";
import HeroGradient from "./HeroGradient";
import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section className="from-wash-blue via-wash-blue-soft relative left-1/2 w-[calc(100vw-1rem)] -translate-x-1/2 overflow-hidden rounded-xl bg-gradient-to-b to-white sm:w-[calc(100vw-1.5rem)] lg:w-[calc(100vw-2.5rem)]">
      <HeroGradient />
      <TopoLines opacityScale={0.5} />

      <div className="relative mx-auto flex min-h-[calc(100svh-104px)] w-full max-w-[1500px] flex-col items-center justify-center gap-9 px-6 py-12 text-center sm:px-12 lg:py-16 lg:max-h-[880px]">
        <Reveal className="mx-auto max-w-[900px]">
          <h1 className="font-heading text-[clamp(36px,5.2vw,58px)] leading-[1.1] font-semibold tracking-tight">
            Your app is 80% done. A senior engineer finishes{" "}
            <span className="text-brand">the last 20%</span>.
          </h1>

          <p className="text-ink-2 mx-auto mt-4.5 max-w-[52ch] text-[18.5px] leading-[1.5]">
            Tell us where you&apos;re stuck and we match you with a vetted senior engineer. Your first hour is free.
            We&apos;re giving away the first 1,000.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mx-auto w-full max-w-4xl">
          <SessionPreview />
        </Reveal>
      </div>
    </section>
  );
}
