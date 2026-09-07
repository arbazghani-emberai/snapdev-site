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
  price: number;
  hours: string;
  hoursPerMonth: number;
  description: string;
  features: { label: string; included: boolean }[];
  highlight?: boolean;
};

export const PLANS: PlanTier[] = [
  {
    id: "starter",
    name: "Starter",
    price: 19,
    hours: "No engineering hours",
    hoursPerMonth: 0,
    description: "No engineering hours included. Browse the roster and get matched when you're ready.",
    features: [
      { label: "Get unstuck on demand", included: false },
      { label: "Matched teammate", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 129,
    hours: "2 engineering hrs/mo",
    hoursPerMonth: 2,
    description: "2 hrs a month. Good for occasional help getting unstuck.",
    features: [
      { label: "Get unstuck on demand", included: true },
      { label: "Matched teammate", included: false },
    ],
    highlight: true,
  },
  {
    id: "pro-plus",
    name: "Pro+",
    price: 269,
    hours: "5 engineering hrs/mo",
    hoursPerMonth: 5,
    description: "5 hrs a month. Steady support as you build.",
    features: [
      { label: "Get unstuck on demand", included: true },
      { label: "Matched teammate", included: false },
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 469,
    hours: "10 engineering hrs/mo",
    hoursPerMonth: 10,
    description: "10 hrs a month. A dedicated teammate, or on-demand support. Slack community access.",
    features: [
      { label: "Get unstuck on demand", included: true },
      { label: "Matched teammate", included: true },
    ],
  },
  {
    id: "partner",
    name: "Partner",
    price: 999,
    hours: "25 engineering hrs/mo",
    hoursPerMonth: 25,
    description: "25 hrs a month. Priority access and a dedicated engineering partner.",
    features: [
      { label: "Get unstuck on demand", included: true },
      { label: "Matched teammate", included: true },
    ],
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
