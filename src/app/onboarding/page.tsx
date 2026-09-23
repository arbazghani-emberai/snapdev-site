"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Wordmark from "@/components/Wordmark";
import { ArrowLeft, Check } from "@/components/icons";
import {
  BUILDER_TOOLS,
  STUCK_POINTS,
  saveOnboardingAnswers,
} from "@/data/onboarding";

const STEPS = ["Tool", "Stuck point", "Details"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [toolIds, setToolIds] = useState<Set<string>>(new Set());
  const [stuckPointId, setStuckPointId] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  const toggleTool = (id: string) => {
    setToolIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const pickStuckPoint = (id: string) => {
    setStuckPointId(id);
    setStep(2);
  };

  const finish = () => {
    if (toolIds.size === 0 || !stuckPointId) return;
    saveOnboardingAnswers({
      toolIds: Array.from(toolIds),
      stuckPointId,
      description: description.trim(),
    });
    router.push("/app");
  };

  return (
    <div className="flex min-h-svh flex-col items-center px-6 pt-12 pb-28 sm:pt-16">
      <div className="flex w-full max-w-lg flex-1 flex-col">
        <Link href="/" className="mx-auto mb-8 block shrink-0 sm:mb-10">
          <Wordmark />
        </Link>

        <div className="text-ink-3 shrink-0 text-left text-[13px] font-semibold tabular-nums">
          {step + 1}/{STEPS.length}
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
                message. Pick as many as apply.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {BUILDER_TOOLS.map((tool) => {
                  const selected = toolIds.has(tool.id);
                  return (
                    <button
                      key={tool.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleTool(tool.id)}
                      className={`relative flex flex-col items-center justify-center gap-2.5 rounded-md border px-3 py-5 text-center transition ${
                        selected
                          ? "border-brand bg-brand-wash"
                          : "border-line hover:border-ink-3 hover:bg-surface-2"
                      }`}
                    >
                      {selected && (
                        <span className="bg-brand absolute top-2 right-2 grid size-4 place-items-center rounded-full text-white">
                          <Check className="size-2.5" strokeWidth={3} />
                        </span>
                      )}
                      {tool.logo && <tool.logo className="text-ink size-6" />}
                      <span className="text-[13.5px] font-semibold">
                        {tool.label}
                      </span>
                    </button>
                  );
                })}
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
            </>
          )}
        </div>
      </div>

      {/* Fixed action bar - keeps Back/Continue reachable regardless of how
          tall a given step's content is, instead of scrolling with it. */}
      <div className="border-line-2 bg-bg/95 fixed inset-x-0 bottom-0 border-t px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-lg items-center gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="text-ink-2 hover:text-ink hover:bg-surface-2 flex shrink-0 items-center gap-1.5 rounded-full px-4 py-3.5 text-[14px] font-medium transition"
            >
              <ArrowLeft className="size-3.5" strokeWidth={2} />
              Back
            </button>
          )}
          {step === 0 && (
            <button
              type="button"
              disabled={toolIds.size === 0}
              onClick={() => setStep(1)}
              className="bg-ink hover:bg-ink/85 disabled:bg-surface-2 disabled:text-ink-3 flex-1 rounded-full py-3.5 text-[14.5px] font-semibold text-bg transition disabled:cursor-not-allowed"
            >
              Continue
            </button>
          )}
          {step === 2 && (
            <button
              type="button"
              onClick={finish}
              className="bg-ink hover:bg-ink/85 flex-1 rounded-full py-3.5 text-[14.5px] font-semibold text-bg transition"
            >
              Show my suggested engineers
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
