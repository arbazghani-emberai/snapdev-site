"use client";

import { createContext, useContext, useState } from "react";
import { PLANS, CURRENT_PLAN_ID as DEFAULT_PLAN_ID, type PlanTier } from "@/data/app";

type PlanContextValue = {
  plan: PlanTier;
  setPlanId: (id: string) => void;
  /** True once the account's plan is at or above `minId` in the PLANS ladder. */
  hasPlanAtLeast: (minId: string) => boolean;
};

const PlanContext = createContext<PlanContextValue | null>(null);

/**
 * Client-only "which plan is active" state, so switching plans in Settings
 * shows up immediately in the header pill and unlocks/locks gated pages
 * (e.g. Engineers) without a page reload.
 */
export default function PlanProvider({ children }: { children: React.ReactNode }) {
  const [planId, setPlanId] = useState(DEFAULT_PLAN_ID);
  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[0];

  const hasPlanAtLeast = (minId: string) => {
    const order = PLANS.map((p) => p.id);
    return order.indexOf(planId) >= order.indexOf(minId);
  };

  return (
    <PlanContext.Provider value={{ plan, setPlanId, hasPlanAtLeast }}>{children}</PlanContext.Provider>
  );
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used within PlanProvider");
  return ctx;
}
