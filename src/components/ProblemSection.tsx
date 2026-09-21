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
    <section
      aria-labelledby="problem-heading"
      className="bg-surface-2 relative left-1/2 mt-5 w-[calc(100vw-1rem)] -translate-x-1/2 rounded-xl py-52 sm:w-[calc(100vw-1.5rem)] lg:w-[calc(100vw-2.5rem)]"
    >
      <div className="px-5 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <h2
            id="problem-heading"
            className="font-heading text-[34px] leading-[1.1] font-semibold tracking-tight md:text-[44px]"
          >
            Sound familiar?
          </h2>
          <p className="text-ink-2 mx-auto mt-4 w-full text-[14.5px] font-medium">
            You&apos;re not bad at this. You&apos;re missing one thing: a real engineer in your corner.
          </p>
        </Reveal>

        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {PROBLEMS.map(({ text, icon: Icon }, i) => (
            <Reveal key={text} delay={Math.min(i * 0.06, 0.4)}>
              <div className="border-line-2 hover:border-ink-3 bg-surface flex h-full flex-col rounded-xl border p-7 transition-colors duration-300">
                <span className="bg-surface-2 text-ink grid size-10 shrink-0 place-items-center rounded-full">
                  <Icon className="size-5" strokeWidth={2} />
                </span>
                <p className="mt-5 text-[15px] leading-relaxed">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
