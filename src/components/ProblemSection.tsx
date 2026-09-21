import { CloudOff, Bug, MessageSquareWarning, CreditCard, ShieldAlert, UserX, type LucideIcon } from "lucide-react";
import Reveal from "./Reveal";

const PROBLEMS: { text: string; icon: LucideIcon }[] = [
  { text: "It works on your laptop. The second you try to put it online, everything breaks.", icon: CloudOff },
  { text: "You fix one bug and the AI quietly breaks three more.", icon: Bug },
  { text: "You've pasted the same error into a chatbot forty times.", icon: MessageSquareWarning },
  { text: 'Payments "kind of" work. You wouldn’t bet a real customer on them.', icon: CreditCard },
  { text: "You have no idea whether your users' data is actually safe.", icon: ShieldAlert },
  { text: "An agency quoted $15,000 and three months. A freelancer ghosted you.", icon: UserX },
];

export default function ProblemSection() {
  return (
    <section aria-labelledby="problem-heading" className="relative left-1/2 mt-5 w-screen -translate-x-1/2 py-14">
      <div className="px-5 sm:px-10 lg:px-14">
        <Reveal>
          <h2
            id="problem-heading"
            className="font-heading text-[34px] leading-[1.1] font-semibold tracking-tight md:text-[44px]"
          >
            Sound familiar?
          </h2>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-3.5 lg:grid-cols-2">
          {PROBLEMS.map(({ text, icon: Icon }, i) => (
            <Reveal key={text} delay={Math.min(i * 0.06, 0.4)}>
              <div className="border-line flex items-center gap-3 rounded-full border px-5 py-4">
                <Icon className="text-ink-3 size-4 shrink-0" strokeWidth={2} />
                <span className="text-[15px] leading-snug">{text}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <p className="font-heading mt-10 max-w-[24ch] text-[26px] leading-[1.2] font-semibold tracking-tight md:text-[30px]">
            You&apos;re not bad at this. You&apos;re missing one thing: a real engineer in your corner.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
