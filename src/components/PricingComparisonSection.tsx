import Reveal from "./Reveal";

const COMPARISON = [
  {
    label: "Dev agency",
    price: "$10,000 to $50,000+",
    suffix: " and weeks of waiting",
  },
  {
    label: "Full-time engineer",
    price: "$150,000+",
    suffix: "/year",
  },
  {
    label: "SnapDev",
    price: "first hour free",
    suffix: ", then from $129/mo",
  },
];

export default function PricingComparisonSection() {
  return (
    <section
      aria-labelledby="pricing-comparison-heading"
      className="bg-surface-2 relative left-1/2 mt-5 w-[calc(100vw-1rem)] -translate-x-1/2 rounded-xl py-24 sm:w-[calc(100vw-1.5rem)] lg:w-[calc(100vw-2.5rem)]"
    >
      <div className="px-5 sm:px-10 lg:px-14">
        <Reveal>
          <span className="text-brand text-[13px] font-bold tracking-[0.06em] uppercase">After your free hour</span>
          <h2
            id="pricing-comparison-heading"
            className="font-heading mt-2 text-[34px] leading-[1.1] font-semibold tracking-tight md:text-[44px]"
          >
            Senior engineers.
            <br />
            Without agency prices.
          </h2>
          <p className="text-ink-2 mt-4 max-w-[52ch] text-[15px] leading-relaxed">
            Hours are the whole currency here. Every plan is a monthly allowance of engineering time with a real
            person, and unused hours never expire.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="bg-surface mt-10 flex flex-col divide-y overflow-hidden rounded-2xl sm:flex-row sm:divide-x sm:divide-y-0 divide-line-2">
            {COMPARISON.map(({ label, price, suffix }) => (
              <div key={label} className="flex-1 px-6 py-5 text-[14.5px]">
                <span className="text-ink-2">{label} </span>
                <span className="font-semibold">{price}</span>
                <span className="text-ink-2">{suffix}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
