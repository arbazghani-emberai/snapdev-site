"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Wordmark from "@/components/Wordmark";
import { ArrowLeft } from "@/components/icons";
import {
  BUILDER_TOOLS,
  STUCK_POINTS,
  saveOnboardingAnswers,
} from "@/data/onboarding";

const STEPS = ["Tool", "Stuck point", "Details"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [toolId, setToolId] = useState<string | null>(null);
  const [stuckPointId, setStuckPointId] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  const pickTool = (id: string) => {
    setToolId(id);
    setStep(1);
  };

  const pickStuckPoint = (id: string) => {
    setStuckPointId(id);
    setStep(2);
  };

  const finish = () => {
    if (!toolId || !stuckPointId) return;
    saveOnboardingAnswers({
      toolId,
      stuckPointId,
      description: description.trim(),
    });
    router.push("/app");
  };

  return (
    <div className="flex min-h-svh flex-col items-center px-6 py-12 sm:py-16">
      <div className="flex w-full max-w-lg flex-1 flex-col">
        <Link href="/" className="mx-auto mb-8 block shrink-0 sm:mb-10">
          <Wordmark />
        </Link>

        <div className="bg-surface-2 flex w-full shrink-0 overflow-hidden rounded-full">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={`h-1 flex-1 border-r-2 border-bg last:border-r-0 transition-colors duration-300 ${
                i <= step ? "bg-ink" : "bg-transparent"
              }`}
            />
          ))}
        </div>

        {/* key re-mounts per step so each panel animates in, matching the
            connect-project drawer's step transitions. */}
        <div key={step} className="animate-step-in mt-7 flex flex-1 flex-col">
          {step === 0 && (
            <>
              <h1 className="font-heading text-[26px] leading-tight font-semibold tracking-tight">
                What did you build your app with?
              </h1>
              <p className="text-ink-2 mt-2 text-[14.5px] leading-relaxed">
                So we can speak your stack&apos;s language from the first
                message.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {BUILDER_TOOLS.map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => pickTool(tool.id)}
                    className={`rounded-full border px-4 py-2.5 text-[14px] font-semibold transition ${
                      toolId === tool.id
                        ? "border-brand bg-brand-wash text-ink"
                        : "border-line hover:border-ink-3 text-ink-2 hover:text-ink"
                    }`}
                  >
                    {tool.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h1 className="font-heading text-[26px] leading-tight font-semibold tracking-tight">
                Where are you stuck?
              </h1>
              <p className="text-ink-2 mt-2 text-[14.5px] leading-relaxed">
                We&apos;ll prioritize engineers who specialize in exactly this.
              </p>

              <div className="mt-6 flex flex-col gap-2.5">
                {STUCK_POINTS.map((point) => (
                  <button
                    key={point.id}
                    type="button"
                    onClick={() => pickStuckPoint(point.id)}
                    className={`group flex items-center gap-3.5 rounded-xl border p-4 text-left transition ${
                      stuckPointId === point.id
                        ? "border-brand bg-brand-wash"
                        : "border-line hover:border-ink-3 hover:bg-surface-2"
                    }`}
                  >
                    <span
                      className={`grid size-10 shrink-0 place-items-center rounded-lg transition ${
                        stuckPointId === point.id
                          ? "bg-brand text-white"
                          : "bg-surface-2 text-ink-2"
                      }`}
                    >
                      <point.icon className="size-[18px]" strokeWidth={2} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14.5px] font-semibold">
                        {point.label}
                      </span>
                      <span className="text-ink-2 block text-[12.5px] leading-snug">
                        {point.blurb}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="font-heading text-[26px] leading-tight font-semibold tracking-tight">
                Tell us more about your product
              </h1>
              <p className="text-ink-2 mt-2 text-[14.5px] leading-relaxed">
                A sentence or two is plenty - the more context, the better the
                match.
              </p>

              <textarea
                autoFocus
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="What are you building, and what have you tried so far?"
                className="border-line focus:border-brand placeholder:text-ink-3 mt-6 w-full resize-none rounded-lg border p-3.5 text-[14.5px] leading-relaxed outline-none transition"
              />

              <button
                type="button"
                onClick={finish}
                className="bg-ink hover:bg-ink/85 mt-5 w-full rounded-full py-3.5 text-[14.5px] font-semibold text-bg transition"
              >
                Show my suggested engineers
              </button>
            </>
          )}
        </div>

        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="text-ink-2 hover:text-ink mt-6 flex shrink-0 items-center gap-1.5 self-start text-[13.5px] font-medium transition"
          >
            <ArrowLeft className="size-3.5" strokeWidth={2} />
            Back
          </button>
        )}
      </div>
    </div>
  );
}
