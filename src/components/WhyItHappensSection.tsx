import Reveal from "./Reveal";

export default function WhyItHappensSection() {
  return (
    <section aria-labelledby="why-heading" className="relative left-1/2 mt-5 w-screen -translate-x-1/2 py-14">
      <div className="px-5 sm:px-10 lg:px-14">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <h2
            id="why-heading"
            className="font-heading max-w-[18ch] text-[34px] leading-[1.1] font-semibold tracking-tight md:text-[44px]"
          >
            AI is a brilliant builder. It&apos;s a terrible launcher.
          </h2>
          <p className="text-ink-2 max-w-xs text-[14.5px] leading-relaxed font-medium">
            AI is great at screens and features, that&apos;s how you got this far. Hosting, security, and payments
            are where one small mistake takes everything down.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="border-line bg-surface mt-10 rounded-2xl border p-6 sm:p-8">
            <div className="flex h-14 w-full overflow-hidden rounded-full">
              <div
                className="bg-brand flex shrink-0 items-center pl-5 text-[13px] font-semibold text-white"
                style={{ width: "80%" }}
              >
                0 &rarr; 80% &middot; built with AI
              </div>
              <div
                className="bg-ink flex shrink-0 items-center justify-center px-4 text-[13px] font-semibold text-white"
                style={{ width: "20%" }}
              >
                the 20%
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <p className="text-[14.5px] leading-relaxed">
                <strong className="font-semibold">What AI does well:</strong>{" "}
                <span className="text-ink-2">screens, features, your first working version.</span>
              </p>
              <p className="text-[14.5px] leading-relaxed">
                <strong className="font-semibold">What needs an engineer:</strong>{" "}
                <span className="text-ink-2">
                  hosting, domains, payments, security, backups, and fixing what breaks at 2am.
                </span>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
