import { Bug, Database, ShieldCheck, Users, Wrench, type LucideIcon } from "lucide-react";
import DeployVisual from "./DeployVisual";
import DebugVisual from "./DebugVisual";
import Reveal from "./Reveal";

type Service = {
  title: string;
  tagline: string;
  blurb: string;
  tags: string[];
  icon: LucideIcon;
  /** Tailwind class for the icon bubble. */
  tint: string;
};

type FeaturedService = Omit<Service, "tint"> & {
  /** The animated mock UI that plays when the card scrolls into view. */
  visual: () => React.ReactNode;
};

const FEATURED: FeaturedService[] = [
  {
    title: "Deployment & DevOps",
    tagline: "Ship with confidence",
    blurb: "From localhost to a live URL - hosting, CI/CD, and domains handled.",
    tags: ["Vercel & Netlify", "Docker & CI/CD", "Domains & DNS", "Monitoring"],
    icon: Wrench,
    visual: DeployVisual,
  },
  {
    title: "Debugging & Rescue",
    tagline: "Fix what's broken",
    blurb: "Fix what the AI broke - cryptic errors found and explained.",
    tags: ["Stack Traces", "Build Errors", "Runtime Bugs"],
    icon: Bug,
    visual: DebugVisual,
  },
];

const COMPACT: Omit<Service, "tint">[] = [
  {
    title: "Code Review & Security",
    tagline: "Catch it early",
    blurb: "A senior engineer reads your AI-written code before your users do.",
    tags: ["Security Audit", "Best Practices", "Refactoring"],
    icon: ShieldCheck,
  },
  {
    title: "Auth, Data & APIs",
    tagline: "Wired up right",
    blurb: "Logins, databases, and integrations set up the right way.",
    tags: ["Supabase & Postgres", "OAuth & Sessions", "Stripe & Webhooks"],
    icon: Database,
  },
  {
    title: "Pairing & Mentorship",
    tagline: "Learn as you go",
    blurb: "Learn while you build with weekly 1:1 sessions.",
    tags: ["Live Pairing", "Weekly Mentorship", "Learn Tracks"],
    icon: Users,
  },
];

export default function Services() {
  return (
    <section
      aria-labelledby="services-heading"
      className="relative left-1/2 mt-5 w-screen -translate-x-1/2 py-14"
    >
      <div className="px-5 sm:px-10 lg:px-14">
        <Reveal>
          <h2
            id="services-heading"
            className="font-heading mx-auto max-w-[16ch] text-center text-[34px] leading-[1.1] font-semibold tracking-tight md:text-[44px]"
          >
            Explore Our Expert Engineering Services
          </h2>
          <p className="text-ink-2 mx-auto mt-4 text-center text-[14.5px] font-medium">
            Tailored help for every stage of your AI-built project.
          </p>
        </Reveal>

        <div className="mt-12 flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {FEATURED.map(({ title, tagline, blurb, tags, icon: Icon, visual: Visual }, i) => (
              <Reveal
                key={title}
                delay={i * 0.12}
                className="bg-surface-2 flex flex-col rounded-xl p-8"
              >
                <span className="bg-surface text-ink inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-semibold shadow-sm">
                  <Icon className="size-4" strokeWidth={2} />
                  {tagline}
                </span>

                <h3 className="font-heading mt-6 text-[26px] leading-tight font-semibold tracking-tight md:text-[30px]">
                  {title}
                </h3>

                <Visual />

                <p className="text-ink-2 mt-6 text-[14.5px] leading-relaxed">{blurb}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="bg-surface text-ink rounded-full px-3.5 py-2 text-[12.5px] font-medium whitespace-nowrap"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {COMPACT.map(({ title, tagline, blurb, tags, icon: Icon }, i) => (
              <Reveal
                key={title}
                delay={i * 0.1}
                className="bg-surface-2 text-ink flex flex-col rounded-xl p-7"
              >
                <span className="bg-surface text-ink inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-semibold shadow-sm">
                  <Icon className="size-4" strokeWidth={2} />
                  {tagline}
                </span>

                <div className="font-heading mt-6 text-[22px] leading-tight font-semibold tracking-tight">
                  {title}
                </div>

                <p className="text-ink-2 mt-2.5 text-[14.5px] leading-relaxed">{blurb}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="bg-surface text-ink rounded-full px-3.5 py-2 text-[12.5px] font-medium whitespace-nowrap"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
