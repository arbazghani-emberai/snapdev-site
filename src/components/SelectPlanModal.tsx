"use client";

import Modal from "./Modal";
import { usePlan } from "./PlanProvider";
import { PLANS } from "@/data/app";

// The Starter tier's à la carte rate - the baseline every other tier's
// hourly rate is discounted against. Mirrors the same calc in Settings'
// plan tab, kept local since this modal doesn't need the rest of that file.
const BASE_HOUR_RATE =
  PLANS.find((p) => p.hoursPerMonth === 0)?.ratePerHour ?? PLANS[0].ratePerHour;

export default function SelectPlanModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { plan: currentPlan, setPlanId } = usePlan();

  const choose = (id: string) => {
    setPlanId(id);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} className="max-w-4xl">
      <h2 className="font-heading text-[22px] font-semibold tracking-tight">
        Choose your plan
      </h2>
      <p className="text-ink-2 mt-1.5 text-[14px] leading-relaxed">
        Pick how you want to work with an engineer - you can change this anytime
        in Settings.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === currentPlan.id;
          const discountPct = Math.round(
            (1 - plan.ratePerHour / BASE_HOUR_RATE) * 100,
          );
          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-xl border p-5 ${
                plan.highlight
                  ? "border-brand bg-brand-wash"
                  : "border-line bg-surface"
              }`}
            >
              {plan.highlight && (
                <span className="bg-brand absolute -top-2.5 left-5 rounded-full px-2.5 py-0.5 text-[10.5px] font-bold tracking-wide text-white uppercase">
                  Popular
                </span>
              )}
              {isCurrent && (
                <span className="border-line bg-surface text-ink-2 absolute -top-2.5 left-5 rounded-full border px-2.5 py-0.5 text-[10.5px] font-bold tracking-wide uppercase">
                  Current
                </span>
              )}
              <div className="text-[15px] font-semibold">{plan.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-heading text-[28px] font-semibold tracking-tight">
                  ${plan.price}
                </span>
                <span className="text-ink-3 text-[13px]">/mo</span>
              </div>

              <div className="mt-4 flex flex-1 flex-col">
                <div className="border-line-2 border-t py-3 first:border-t-0 first:pt-0">
                  <div className="text-ink-3 text-[10.5px] font-semibold tracking-[0.04em] uppercase">
                    Hours included
                  </div>
                  <div className="mt-1 text-[15px] font-semibold tracking-tight">
                    {plan.hoursPerMonth > 0
                      ? `${plan.hoursPerMonth} hrs/mo`
                      : "Pay as you go"}
                  </div>
                </div>
                <div className="border-line-2 border-t py-3 first:border-t-0 first:pt-0">
                  <div className="text-ink-3 text-[10.5px] font-semibold tracking-[0.04em] uppercase">
                    Rate per hour
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-[15px] font-semibold tracking-tight">
                      ${plan.ratePerHour}/hr
                    </span>
                    {discountPct > 0 && (
                      <span className="text-online text-[11.5px] font-semibold">
                        {discountPct}% off
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-ink-3 text-[12px] leading-relaxed">
                  ${plan.platformFee} platform fee
                </p>
              </div>

              <button
                type="button"
                disabled={isCurrent}
                onClick={() => choose(plan.id)}
                className={`mt-5 rounded-full py-2.5 text-[13.5px] font-semibold transition ${
                  isCurrent
                    ? "bg-surface-2 text-ink-3 cursor-default"
                    : "bg-ink hover:bg-ink/85 text-bg"
                }`}
              >
                {isCurrent ? "Current plan" : "Choose plan"}
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="text-ink-2 hover:text-ink mt-6 block text-center text-[13.5px] font-medium transition"
      >
        I&apos;ll decide later
      </button>
    </Modal>
  );
}
