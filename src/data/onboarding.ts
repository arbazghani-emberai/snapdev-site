import type { IconComponent } from "@/components/icons";
import { Bug, Rocket, Monitor, Sparkles, Compass } from "@/components/icons";
import {
  ReplitLogo,
  LovableLogo,
  BoltLogo,
  V0Logo,
  CursorLogo,
  ClaudeLogo,
  WindsurfLogo,
} from "@/components/BuilderLogos";

/** What the signup wizard asked, kept around so the home screen can bias its
 *  suggested engineers without a backend to persist it in. */
export const ONBOARDING_STORAGE_KEY = "snapdev_onboarding";

export type BuilderTool = {
  id: string;
  label: string;
  /** Left out for the catch-all "Something else" option. */
  logo?: IconComponent;
};

export const BUILDER_TOOLS: BuilderTool[] = [
  { id: "replit", label: "Replit", logo: ReplitLogo },
  { id: "lovable", label: "Lovable", logo: LovableLogo },
  { id: "bolt", label: "Bolt", logo: BoltLogo },
  { id: "v0", label: "v0", logo: V0Logo },
  { id: "cursor", label: "Cursor", logo: CursorLogo },
  { id: "claude", label: "Claude", logo: ClaudeLogo },
  { id: "windsurf", label: "Windsurf", logo: WindsurfLogo },
  { id: "other", label: "Something else", logo: Compass },
];

export type StuckPoint = {
  id: string;
  label: string;
  blurb: string;
  icon: IconComponent;
  /** Matches an Engineer.capability value, so the home screen can sort by it.
   *  Left out for "not sure" style answers that shouldn't bias the match. */
  capability?: string;
};

export const STUCK_POINTS: StuckPoint[] = [
  {
    id: "bug",
    label: "There's a bug I can't fix",
    blurb: "Something's broken and you're not sure why.",
    icon: Bug,
    capability: "fixes bugs",
  },
  {
    id: "deploy",
    label: "I need to deploy it",
    blurb: "It works locally but isn't live yet.",
    icon: Rocket,
    capability: "deployment issues",
  },
  {
    id: "slow",
    label: "It's slow or laggy",
    blurb: "It runs, but not well enough to ship.",
    icon: Monitor,
    capability: "fixing laggy websites",
  },
  {
    id: "ai",
    label: "My AI features aren't reliable",
    blurb: "Chat, agents, or generations misbehave.",
    icon: Sparkles,
    capability: "expert in AI hallucination",
  },
  {
    id: "other",
    label: "Something else",
    blurb: "Not sure yet, or it's not listed here.",
    icon: Compass,
  },
];

export type OnboardingAnswers = {
  /** Multi-select - a founder often used more than one tool along the way. */
  toolIds: string[];
  stuckPointId: string;
  description: string;
};

export function saveOnboardingAnswers(answers: OnboardingAnswers) {
  try {
    sessionStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(answers));
  } catch {
    // Storage can be unavailable (private mode, disabled) - the home screen
    // just falls back to its default, unbiased engineer list.
  }
}

export function readOnboardingAnswers(): OnboardingAnswers | null {
  try {
    const raw = sessionStorage.getItem(ONBOARDING_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as OnboardingAnswers) : null;
  } catch {
    return null;
  }
}
