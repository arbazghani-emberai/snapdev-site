import { ENGINEERS } from "./engineers";

export const CURRENT_USER = {
  firstName: "Arbaz",
  name: "Arbaz Ghani",
  email: "arbaz.ghani@snapdev.ai",
  initials: "AG",
  bio: "",
  avatarUrl: null as string | null,
};

/** The engineers shown as "online now" in the Get Unstuck panel. */
export const ONLINE_ENGINEERS = ENGINEERS.filter((e) => e.status === "Online");

export type ProjectStatus = "New" | "Active" | "Paused";

export type Project = {
  id: string;
  name: string;
  source: "GitHub" | "Live URL" | "Upload";
  stack: string[];
  status: ProjectStatus;
  active: boolean;
};

/** Empty by default so the connect-a-project empty state is what ships. */
export const PROJECTS: Project[] = [];

export type PlanTier = {
  id: string;
  name: string;
  /** $19 platform fee + hoursPerMonth * ratePerHour. */
  price: number;
  platformFee: number;
  hoursPerMonth: number;
  ratePerHour: number;
  description: string;
  highlight?: boolean;
};

export const PLANS: PlanTier[] = [
  {
    id: "starter",
    name: "Starter",
    price: 19,
    platformFee: 19,
    hoursPerMonth: 0,
    ratePerHour: 60,
    description: "No hours included. Pay $60/hr à la carte whenever you need help.",
  },
  {
    id: "pro",
    name: "Pro",
    price: 129,
    platformFee: 19,
    hoursPerMonth: 2,
    ratePerHour: 55,
    description: "2 hrs a month at $55/hr, plus the $19 platform fee.",
    highlight: true,
  },
  {
    id: "pro-plus",
    name: "Pro+",
    price: 269,
    platformFee: 19,
    hoursPerMonth: 5,
    ratePerHour: 50,
    description: "5 hrs a month at $50/hr, plus the $19 platform fee.",
  },
  {
    id: "growth",
    name: "Growth",
    price: 469,
    platformFee: 19,
    hoursPerMonth: 10,
    ratePerHour: 45,
    description: "10 hrs a month at $45/hr, plus the $19 platform fee.",
  },
  {
    id: "partner",
    name: "Partner",
    price: 994,
    platformFee: 19,
    hoursPerMonth: 25,
    ratePerHour: 39,
    description: "25 hrs a month at $39/hr, plus the $19 platform fee.",
  },
];

export const CURRENT_PLAN_ID = "starter";

export const CURRENT_PLAN = PLANS.find((p) => p.id === CURRENT_PLAN_ID) ?? PLANS[0];

/** Mock billing-period dates shown on the current-plan summary card. */
export const MEMBER_SINCE = "September 3, 2026";
export const PLAN_RENEWS_ON = "October 3, 2026";

export type HourPack = { id: string; hours: number; price: number };

/** One-off top-ups on top of the account's monthly plan allotment. */
export const HOUR_PACKS: HourPack[] = [
  { id: "pack-5", hours: 5, price: 59 },
  { id: "pack-10", hours: 10, price: 109 },
  { id: "pack-25", hours: 25, price: 249 },
];

/** True once the account's plan is at or above `minId` in the PLANS ladder. */
export function hasPlanAtLeast(minId: string, planId: string = CURRENT_PLAN_ID) {
  const order = PLANS.map((p) => p.id);
  return order.indexOf(planId) >= order.indexOf(minId);
}

export type PaymentMethod =
  | { kind: "card"; brand: "Visa" | "Mastercard" | "Amex"; last4: string }
  | { kind: "apple_pay"; brand: "Visa" | "Mastercard" | "Amex"; last4: string };

export type BillingInvoice = {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "Paid" | "Refunded";
  payment: PaymentMethod;
};

export const BILLING_HISTORY: BillingInvoice[] = [
  {
    id: "inv_2026_09",
    date: "Sep 1, 2026",
    description: "Starter plan",
    amount: 19,
    status: "Paid",
    payment: { kind: "card", brand: "Visa", last4: "4242" },
  },
  {
    id: "inv_2026_08",
    date: "Aug 1, 2026",
    description: "Starter plan",
    amount: 19,
    status: "Paid",
    payment: { kind: "apple_pay", brand: "Mastercard", last4: "8831" },
  },
  {
    id: "inv_2026_07",
    date: "Jul 1, 2026",
    description: "Starter plan",
    amount: 19,
    status: "Paid",
    payment: { kind: "card", brand: "Visa", last4: "4242" },
  },
  {
    id: "inv_2026_06",
    date: "Jun 1, 2026",
    description: "Starter plan",
    amount: 19,
    status: "Paid",
    payment: { kind: "card", brand: "Visa", last4: "4242" },
  },
];

export const USAGE = {
  hoursAvailable: CURRENT_PLAN.hoursPerMonth,
  hoursUsed: 0,
  sessionsAllTime: 0,
};

export type IntentOption = {
  id: string;
  icon: "debug" | "plan" | "build" | "deploy";
  label: string;
};

export const INTENT_OPTIONS: IntentOption[] = [
  { id: "debug", icon: "debug", label: "Something's broken" },
  { id: "deploy", icon: "deploy", label: "Help me deploy" },
  { id: "plan", icon: "plan", label: "Plan my next step" },
  { id: "build", icon: "build", label: "Build with me" },
];
